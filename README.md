# 简易QQ 开发：
## 避坑：
* 1. <Image> 如果不指定 width 和 height 就无法显示粗来！！
```javascript

<Image source = {{uri:`data:image/png;base64,${this.state.localAvatarURLbase64}`}}
                              style={{width: 66, height: 58}}/>

```
* 2. 使用 react-native-image-picker 图片上传时需要一些在Xcode的配置：[地址](https://www.jianshu.com/p/c2aecf93e1af)

* 3. 前端http获取不到图片，可能需要https.g刚刚看看存放图片的后端显示图片大小为0，可能就是因为图片根本没有所以前端显示不出来，但是为什么传上去的图片大小为0呢？
