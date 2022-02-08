# 七牛云域名ssl证书更新

### 介绍

上传证书至七牛云平台修改已有的证书

### 发布到建木Hub

通过建木CI执行[qiniu.yml](https://gitee.com/jianmu-runners/jianmu-runner-list/blob/master/release_dsl/qiniu.yml) ，可发布到建木Hub

### 输入参数

```
domain: 域名
http2_enable: 是否启用http2功能
cert_id: 证书id
force_https: 是否强制跳转https
access_key: 七牛accessKey
secret_key: 七牛secretKey
```

### 构建docker镜像

```
# 安装依赖
npm install 或 yarn

# 创建docker镜像
docker build -t jianmurunner/update_domain_ssl:${version} .

# 上传docker镜像
docker push jianmurunner/update_domain_ssl:${version}
```

### 用法

域名ssl证书更新：

```
docker run --rm \
	-e JIANMU_DOMAIN=example.com \
	-e JIANMU_HTTP2_ENABLE=xxx \
	-e JIANMU_CERT_ID=xxx \
	-e JIANMU_FORCE_HTTPS=xxx \
	-e JIANMU_ACCESS_KEY=xxx \
	-e JIANMU_SECRET_KEY=xxx \
	jianmurunner/update_domain_ssl:${version} \
	node /app/scripts/update_domain_ssl.js
```

