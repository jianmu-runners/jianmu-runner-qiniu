const fs = require('fs');
const axios = require('axios');
const url = 'https://api.qiniu.com/sslcert';
// 生成七牛管理凭证
const createToken = function () {
  const qiniu = require('qiniu');
  const mac = new qiniu.auth.digest.Mac(
    process.env.JIANMU_QINIU_ACCESS_KEY,
    process.env.JIANMU_QINIU_SECRET_KEY
  );
  function uptoken() {
    return qiniu.util.generateAccessToken(mac, url);
  }
  // 生成上传 Token
  return uptoken();
};
const instance = axios.create();
const ca = fs.readFileSync(process.env.JIANMU_CERTIFICATE_PATH, 'utf-8');
const pri = fs.readFileSync(process.env.JIANMU_CERTIFICATE_KEY_PATH, 'utf-8');
const params = {
  name: process.env.JIANMU_DOMAIN,
  common_name: process.env.JIANMU_DOMAIN,
  pri,
  ca,
};
(() => {
  instance
    .post(url, params, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: createToken(),
      },
    })
    .then(result => {
      console.log('证书id:', result.data);
      const certID = {
        cert_id: result.data.certID,
      };
      fs.writeFileSync('/tmp/resultFile', JSON.stringify(certID), 'utf-8');
    })
    .catch(err => {
      console.log(err.response.status);
      console.log(err.response.statusText);
      console.log(err.response.headers);
      console.log(err.response.data);
      process.exit(1);
    });
})();
