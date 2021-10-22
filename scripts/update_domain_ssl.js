const axios = require('axios');
const qiniu = require('qiniu');
require('dotenv').config({ path: '.env' });

const {
  JIANMU_DOMAIN,
  JIANMU_ACCESS_KEY,
  JIANMU_SECRET_KEY,
  JIANMU_CERT_ID,
  JIANMU_FORCE_HTTPS,
  JIANMU_HTTP2_ENABLE,
} = process.env;

const mac = new qiniu.auth.digest.Mac(JIANMU_ACCESS_KEY, JIANMU_SECRET_KEY);
const token = qiniu.util.generateAccessToken(
  mac,
  `https://api.qiniu.com/domain/${JIANMU_DOMAIN}/httpsconf`
);

const data = {
  certId: JIANMU_CERT_ID,
  forceHttps: eval(JIANMU_FORCE_HTTPS),
  http2Enable: eval(JIANMU_HTTP2_ENABLE),
};

axios
  .put(`https://api.qiniu.com/domain/${JIANMU_DOMAIN}/httpsconf`, data, {
    headers: {
      Authorization: token,
    },
  })
  .then(res => {
    console.log('status:', res.status);
    console.log('statusText:', res.statusText);
    console.log('data:', res.data);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
