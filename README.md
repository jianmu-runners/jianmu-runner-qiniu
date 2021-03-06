# jianmu-runner-qiniu

### 介绍

七牛云 api 封装

### 七牛云文件上传

#### 输入参数

```
qiniu_bucket: 七牛bucket
qiniu_ak: 七牛accessKey
qiniu_sk: 七牛secretKey
qiniu_zone: 七牛zone，可选参数，不设置时，自动识别，华东：z0；华北：z1；华南：z2；北美：na0；东南亚：as0
qiniu_upload_uri_prefix: 上传后的路径前缀
qiniu_upload_dir: 要上传的目录
```

#### 输出参数

```
qiniu_base_uri: 上传后的根uri
```

#### 构建 docker 镜像

```
# 安装依赖
npm install 或 yarn

# 创建docker镜像
docker build -t jianmudev/jianmu-runner-qiniu:${version} .

# 上传docker镜像
docker push jianmudev/jianmu-runner-qiniu:${version}
```

#### 用法

文件上传：

```
docker run --rm \
  -e JIANMU_QINIU_BUCKET=xxx \
  -e JIANMU_QINIU_AK=xxx \
  -e JIANMU_QINIU_SK=xxx \
  -e JIANMU_QINIU_UPLOAD_URI_PREFIX=xxx/x.x.x \
  -e JIANMU_QINIU_UPLOAD_DIR=/tmp/dist \
  -v /${workspace}/${project_dir}:/tmp/dist \
  -v /${workspace}/result_file:/tmp/result_file \
  jianmudev/jianmu-runner-qiniu:${version} \
  node /app/scripts/upload.js
```

### 七牛云 ssl 证书上传

#### 输入参数

```
certificate_path: 证书路径
certificate_key_path: 证书密钥路径
domain: 域名
qiniu_accesskey: 七牛accessKey
qiniu_secretkey: 七牛secretKey
```

#### 输出参数

```
cert_id: 七牛证书id
```

#### 构建 docker 镜像

```
# 安装依赖
npm install 或 yarn

# 创建docker镜像
docker build -t jianmudev/jianmu-runner-qiniu:${version} .

# 上传docker镜像
docker push jianmudev/jianmu-runner-qiniu:${version}
```

####

#### 用法

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
  jianmudev/jianmu-runner-qiniu:${version} \
  node /app/scripts/upload_ssl.js
```

### 七牛云域名ssl证书更新

#### 输入参数

```
domain: 域名
http2_enable: 是否启用http2功能
cert_id: 证书id
force_https: 是否强制跳转https
access_key: 七牛accessKey
secret_key: 七牛secretKey
```

#### 构建docker镜像

```
# 安装依赖
npm install 或 yarn

# 创建docker镜像
docker build -t jianmudev/jianmu-runner-qiniu:${version} .

# 上传docker镜像
docker push jianmudev/jianmu-runner-qiniu:${version}
```

#### 用法

域名ssl证书更新：

```
docker run --rm \
	-e JIANMU_DOMAIN=example.com \
	-e JIANMU_HTTP2_ENABLE=xxx \
	-e JIANMU_CERT_ID=xxx \
	-e JIANMU_FORCE_HTTPS=xxx \
	-e JIANMU_ACCESS_KEY=xxx \
	-e JIANMU_SECRET_KEY=xxx \
	jianmudev/jianmu-runner-qiniu:${version} \
	node /app/scripts/update_domain_ssl.js
```

