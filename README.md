# 开发文档

## 目录

1. [起步](#starter)
2. [文件结构](#fileConstruct)
3. [风格指南](#styleGuide)
4. [发布](#release)

## <span id="starter">起步</span>

**项目启动**

1. 环境准备

    * node 版本号：v8.9.0
    * npm 版本号：6.0.1
    * ioinic 版本号：3.20.0
    * cordova 版本号：8.0.0
    * angular 版本号：6.0.0
    * git 版本号：2.19.1

2. 启动项目（开发时环境）
```
cd babb
ionic serve
```

**快捷命令**
```
ionic g component 组件名
ionic g directive 指令名
ionic g page 页面名
ionic g page 页面名 --no-module
ionic g pipe 管道名
ionic g provider 管道名
```

## <span id="fileConstruct">文件结构</span>

## <span id="styleGuide">风格指南</span>

## <span id="release">发布</span>

1. 修改版本号
> 在config.xml中修改`version="版本号"`
2. 修改APP名称
> 在config.xml中修改`<name>APP名称</name>`
3. 打包android apk
```
ionic build android --prod
```
4. 在`platforms\android\app\build\outputs\apk\debug`目录下获取安装包`app-debug.apk`。
