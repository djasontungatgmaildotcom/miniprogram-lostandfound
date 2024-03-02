## 项目启动方式

### .admin/admin-pc:

项目设置

```
npm install
```

用于开发的编译和热重载

```
npm run serve
```

编译并缩小以用于生产

```
npm run build
```

脚手架设置参考:

See [Configuration Reference](https://cli.vuejs.org/config/).



### .server

nodejs编写的接口端, 没有进行工程化, 可以自行改进

下载nodejs框架express

```
npm install express --save
```

切换npm镜像源为淘宝镜像源

```
npm config set registry https://registry.npm.taobao.org
```

下载nodemon解决nodejs代码更新的痛点

```
npm install nodemon -g
```

nodejs连接mongodb数据库

```
npm install mongoose --save
```

下载multer来实现文件上传存储

```
npm install multer --save
```

下载uuid来实现不重复的字符串

```
npm install uuid --save
```

下载axios实现网络请求

```
npm install axios --save
```



### .项目启动:

1.打开server, 在终端输入 `nodemon` 开启后端接口, 使用nodemon进行热更新

```javascript
// server
nodemon
```

2.开启后端管理系统的vue前端, 使用 `npm install` 安装完依赖后 , 输入以下指令启动vue项目

```javascript
// 进入admin-pc目录
cd admin-pc 
// 启动vue项目
npm run serve
```

3.微信小程序开发者工具导入小程序项目



### .wx:uni-app端:

打开微信小程序导入项目即可



### .依赖:

- nodejs:  https://nodejs.org/en/  (node18 recommend)
- MongoDB / MongoDB Compass: https://www.mongodb.com/try/download/community
