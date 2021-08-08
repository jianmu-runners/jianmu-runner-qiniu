require('dotenv').config({ path: '.env' });
const log = require('loglevel');
const { levels: { TRACE } } = log;
log.setLevel(TRACE);

Object.keys(process.env).map(key => {
  if (!key.startsWith('QINIU_')) {
    return;
  }

  // 打印业务相关环境变量
  log.log(key + ':', process.env[key]);
});

const upload = require('./uploadScript');

upload();
