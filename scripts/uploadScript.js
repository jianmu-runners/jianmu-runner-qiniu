const fs = require('fs');
const qiniu = require('qiniu');
const chalk = require('chalk');
const log = require('loglevel');
const { levels: { TRACE } } = log;
const {
  QINIU_BUCKET: bucket,
  QINIU_AK: accessKey,
  QINIU_SK: secretKey,
  QINIU_UPLOAD_NAME: name,
  QINIU_UPLOAD_VERSION: version,
  QINIU_UPLOAD_DIR: staticPath,
} = process.env;
log.setLevel(TRACE);

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

/**
 * 构建上传策略函数
 * @param key
 * @returns {string}
 */
function getUpToken(key) {
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: `${bucket}:${key}`,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
  });
  return putPolicy.uploadToken(mac);
}

const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z1;
const formUploader = new qiniu.form_up.FormUploader(config);
//  new qiniu.form_up.PutExtra();
const putExtra = null;

/**
 * 上传文件
 * @param key
 * @param localFile
 */
function uploadFile(key, localFile) {
  log.info('上传文件', localFile, '\t->\t', key);

  const uploadToken = getUpToken(key);
  formUploader.putFile(uploadToken, key, localFile, putExtra, (e, respBody) => {
    if (!e && !respBody.error) {
      log.info('上传成功',
        'hash:', respBody.hash,
        'key:', respBody.key,
        'persistentId:', respBody.persistentId
      );
    } else {
      log.error(chalk.bold.red('上传失败'), e, respBody.error);
    }
  });
}

/**
 * 上传目录
 * @param dirPath
 * @param relative
 */
function uploadDirectory(dirPath, relative = '') {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      throw err;
    }
    //  遍历目录
    files.forEach(fileOrDir => {
      const filePath = `${dirPath}/${fileOrDir}`;
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          throw statErr;
        }
        const relativeName = `${relative}${relative ? '/' : ''}${fileOrDir}`;
        if (stats.isDirectory()) {
          // 目录时，继续遍历
          uploadDirectory(filePath, relativeName);
        } else {
          // 文件时，上传
          uploadFile(`${name}/${version}/${relativeName}`, filePath);
        }
      });
    });
  });
}

module.exports = () => {
  uploadDirectory(staticPath);

  // 创建结果文件
  fs.writeFileSync('/tmp/result_file', JSON.stringify({
    baseUri: `/${name}/${version}`,
  }));
};
