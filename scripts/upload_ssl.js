const fs = require('fs');
const axios = require('axios');
const url = 'https://api.qiniu.com/sslcert';
const encoding = 'utf-8';
// 生成七牛管理凭证
const createToken = function () {
  const qiniu = require('qiniu');
  const mac = new qiniu.auth.digest.Mac(
    process.env.JIANMU_QINIU_ACCESS_KEY,
    process.env.JIANMU_QINIU_SECRET_KEY
  );
  // 生成上传 Token
  return qiniu.util.generateAccessToken(mac, url);
};
const ca = fs.readFileSync(process.env.JIANMU_CERTIFICATE_PATH, encoding);
const pri = fs.readFileSync(process.env.JIANMU_CERTIFICATE_KEY_PATH, encoding);
const params = {
  name: process.env.JIANMU_DOMAIN,
  common_name: process.env.JIANMU_DOMAIN,
  pri,
  ca,
};
axios
  .create()
  .post(url, params, {
    headers: {
      'Content-Type': `application/json; charset=${encoding}`,
      Authorization: createToken(),
    },
  })
  .then(result => {
    console.log('证书id:', result.data);
    const certID = {
      cert_id: result.data.certID,
    };
    fs.writeFileSync('/tmp/resultFile', JSON.stringify(certID), encoding);
  })
  .catch(err => {
    console.log(err.response.status);
    console.log(err.response.statusText);
    console.log(err.response.headers);
    console.log(err.response.data);
    process.exit(1);
  });
