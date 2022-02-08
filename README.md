# 七牛云 ssl 证书上传

### 介绍

上传证书至七牛云平台获取七牛云平台提供的证书id

### 发布到建木Hub

通过建木CI执行[qiniu.yml](https://gitee.com/jianmu-runners/jianmu-runner-list/blob/master/release_dsl/qiniu.yml) ，可发布到建木Hub

### 输入参数

```
certificate_path: 证书路径
certificate_key_path: 证书密钥路径
domain: 域名
qiniu_accesskey: 七牛accessKey
qiniu_secretkey: 七牛secretKey
```

### 输出参数

```
cert_id: 七牛证书id
```

### 构建 docker 镜像

```
# 安装依赖
npm install 或 yarn

# 创建docker镜像
docker build -t jianmurunner/qiniu:${version} .

# 上传docker镜像
docker push jianmurunner/qiniu:${version}
```

### 用法

ssl 证书上传：

```
docker run --rm \
  -e JIANMU_CERTIFICATE_PATH=/tmp/xxx \
  -e JIANMU_CERTIFICATE_KEY_PATH=/tmp/xxx \
  -e JIANMU_DOMAIN=example.com \
  -e JIANMU_QINIU_ACCESSKEY=xxx \
  -e JIANMU_QINIU_SECRETKEY=xxx \
  -v /${workspace}/${project_dir}:/tmp \
  -v /${workspace}/result_file:/tmp/resultFile \
  jianmurunner/qiniu:${version} \
  node /app/scripts/upload_ssl.js
```

