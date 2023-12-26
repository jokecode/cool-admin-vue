### 0、克隆发布工程

```
克隆地址： git@8.131.224.226:Guo/jsq_deploy.git
```



### 1、打包前端项目

```
# D:\XXX\front-end\cool-admin-vue
npm run build
```

> 提示：需要先安装依赖` npm i `
>
> 如果安装失败可以尝试使用[cnpm](https://developer.aliyun.com/mirror/NPM?from=tnpm)，或者切换您的镜像源

### 2、拷贝dist到` D:\XXX\jsq_deploy\web `

```
# D:\XXX\jsq_deploy\web
D:\XXX\jsq_deploy\web\dist
```



### 3、打包后端项目

```
# D:\XXX\back-end\cool-admin-midway
npm run build
```

> 提示：需要先安装依赖` npm i `
>
> 如果安装失败可以尝试使用[cnpm](https://developer.aliyun.com/mirror/NPM?from=tnpm)，或者切换您的镜像源

### 4、拷贝dist到` D:\XXX\jsq_deploy\server `

```
# D:\XXX\jsq_deploy\server
D:\XXX\jsq_deploy\server\dist
```

