# jianmu-runner-qiniu

#### 介绍
七牛云文件上传

#### 输入参数
```
qiniu_bucket: 七牛bucket
qiniu_ak: 七牛accessKey
qiniu_sk: 七牛secretKey
qiniu_upload_name: 上传后的根目录
qiniu_upload_version: 上传后的版本
qiniu_upload_dir: 要上传的目录
```
#### 输出参数
```
base_uri: 上传后的根uri
```

#### 构建
```
docker build -t jianmudev/jianmu-runner-qiniu:${version} .
```

#### 使用
```
docker run --rm \
  -e qiniu_bucket=xxx \
  -e qiniu_ak=xxx \
  -e qiniu_sk=xxx \
  -e qiniu_upload_name=xxx \
  -e qiniu_upload_version=x.x.x \
  -e qiniu_upload_dir=/tmp/dist \
  -v /${workspace}/${project_dir}:/tmp/dist \
  -v /${workspace}/result_file:/tmp/result_file \
  jianmudev/jianmu-runner-qiniu:${version} \
  node scripts/upload.js
```
