# jianmu-runner-qiniu

#### 介绍
七牛云文件上传

#### 输入参数
```
qiniu_bucket: 七牛bucket
qiniu_ak: 七牛accessKey
qiniu_sk: 七牛secretKey
qiniu_upload_uri_prefix: 上传后的路径前缀
qiniu_upload_dir: 要上传的目录
```
#### 输出参数
```
qiniu_base_uri: 上传后的根uri
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
  node scripts/upload.js
```
