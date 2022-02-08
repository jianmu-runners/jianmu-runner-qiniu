const axios = require('axios');
const update_domain_ssl = require('scripts/update_domain_ssl.js');
require('dotenv').config({ path: '.env' });

const {
  JIANMU_DOMAIN,
  JIANMU_ACCESS_KEY,
  JIANMU_SECRET_KEY,
  JIANMU_CERT_ID,
  JIANMU_FORCE_HTTPS,
  JIANMU_HTTP2_ENABLE,
} = process.env;

const mac = new update_domain_ssl.auth.digest.Mac(JIANMU_ACCESS_KEY, JIANMU_SECRET_KEY);
// 获取token
const domainToken = update_domain_ssl.util.generateAccessToken(
  mac,
  `https://api.qiniu.com/domain/${JIANMU_DOMAIN}`
);

const data = {
  certId: JIANMU_CERT_ID,
  forceHttps: eval(JIANMU_FORCE_HTTPS),
  http2Enable: eval(JIANMU_HTTP2_ENABLE),
};

axios
  .get(`https://api.qiniu.com/domain/${JIANMU_DOMAIN}`, {
    headers: {
      Authorization: domainToken,
    },
  })
  .then(res => {
    console.log('status:', res.status);
    console.log('statusText:', res.statusText);
    console.log('data:', res.data);
    if (res.data.protocol === 'http') {
      const sslizeToken = update_domain_ssl.util.generateAccessToken(
        mac,
        `https://api.qiniu.com/domain/${JIANMU_DOMAIN}/sslize`
      );
      // http升级到https并修改证书
      axios
        .put(`https://api.qiniu.com/domain/${JIANMU_DOMAIN}/sslize`, data, {
          headers: {
            Authorization: sslizeToken,
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
    } else {
      const httpsConfToken = update_domain_ssl.util.generateAccessToken(
        mac,
        `https://api.qiniu.com/domain/${JIANMU_DOMAIN}/httpsconf`
      );
      // 已经是https直接修改证书
      axios
        .put(`https://api.qiniu.com/domain/${JIANMU_DOMAIN}/httpsconf`, data, {
          headers: {
            Authorization: httpsConfToken,
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
    }
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
