# simple-R2-Image-worker 使用R2桶存储图像

A simple woeker script to use cf r2 as image hosting.

## 实现的功能

- [x] 使用自定义域名访问图像
- [x] 使用ShareX上传图像
- [x] 使用Api上传图像

## 使用方法

1.在CLoudflare控制面板中新建一个R2存储桶

2.在Workers中新建一个服务

3.在Workers的设置-变量页面绑定R2存储桶，变量名称命名为`R2`或者你喜欢的任何其他名称

4.编辑Worker触发器,通过以下两种方式之一绑定自定义域名：

  - 在自定义域中添加你的域名,例如： `pic.example.com` ,Cloudflare会自动为你设置DNS
    
  - 在路由中添加动态路由，例如： `pic.example.com/*` ( `/*`是必要的,区域可以不用选择),然后在DNS中为对应的域名解析并开启CDN,解析地址可以使用除了`1.1.1.1`等特殊地址以外的任何地址
    
5.编辑Woker,用[worker.js](https://raw.githubusercontent.com/We-Jinyao/simple-R2-Image-worker/main/worker.ts "worker")中的内容替换,将变量名设置为你绑定R2桶的变量,`token`设置为你自定义的鉴权码,然后保存并部署Worker. 至此你可以在Cloudflare R2控制面板处上传图像, 然后使用你的自定义域名+文件名访问图片, 例如： `pic.example.com/filename.png` 


6.在 **ShareX主界面** - **目标** - **自定义上传目标** 中新增一个上传器,将 **方法** 设置为 **POST**, **请求URL** 设置为你的自定义域名+'/upload', 例如： `https://pic.example.com/upload`, **正文** 设置为 **Binary**, **URL参数** 设置为： token:你自定义的token, filename:{filename}, 第二个参数为可选的, 下面的 **URL**设置为 `{json:image}` , 然后将图片上传器设置为刚刚编辑的图片上传器, 测试图片上传, 如因网络问题出现502错误可以在  **ShareX主界面** - **应用程序设置** - **代理** 中设置代理


7.Api上传需要在参数中指明token和filename（可选）, body为图片, Headers 中说明 `content-type`和`content-length`


8.删除图片可直接在Cloudflare Dashboard中删除，或者参考 [ShareX-R2-Cloudflare-Workers](https://github.com/Cherry/ShareX-R2-Cloudflare-Workers)（这也是本项目灵感来源） 设置删除Url

## Liscense

![MIT](https://img.shields.io/github/license/We-Jinyao/simple-R2-Image-worker)
