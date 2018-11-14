# 开发文档

## 目录

1. [起步](#starter)
2. [文件结构](#fileConstruct)
3. [风格指南](#styleGuide)
4. [发布](#release)

## <span id="starter">起步</span>

**项目启动**

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
