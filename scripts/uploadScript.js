const fs = require('fs');
const qiniu = require('qiniu');
const log = require('loglevel');
const { levels: { TRACE } } = log;
const {
  JIANMU_QINIU_BUCKET: bucket,
  JIANMU_QINIU_AK: accessKey,
  JIANMU_QINIU_SK: secretKey,
  JIANMU_QINIU_UPLOAD_NAME: name,
  JIANMU_QINIU_UPLOAD_VERSION: version,
  JIANMU_QINIU_UPLOAD_DIR: staticPath,
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
// 空间对应的机房，不设置时，自动识别
// config.zone = qiniu.zone.Zone_z1;
const formUploader = new qiniu.form_up.FormUploader(config);
// new qiniu.form_up.PutExtra();
const putExtra = null;

/**
 * 上传文件
 * @param key
 * @param localFile
 */
function uploadFile(key, localFile) {
  log.info('上传文件', localFile, '\t->\t', key);

  const uploadToken = getUpToken(key);
  formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr, respBody, respInfo) => {
    if (respErr) {
      throw respErr;
    }
    if (respInfo.statusCode === 200) {
      log.info('上传成功', JSON.stringify(respBody));
    } else {
      console.warn('上传失败', respInfo.statusCode, JSON.stringify(respBody));
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
    qiniu_base_uri: `/${name}/${version}`,
  }));
};
