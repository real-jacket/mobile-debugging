# mobile-debugging

debugging mobile h5 in app

## ios

参考文章: [构建基于 iOS 模拟器的前端调试方案](https://juejin.cn/post/6844904198648119304#heading-9)

### 基本思路

通过 macos 自带的模拟 + Safari Inspector 实现对 h5 页面的调试。

### 问题

- `simctl`命令不存在
`xcrun: error: unable to find utility "simctl", not a developer tool or in PATH`
解决办法参考：[xcrun unable to find simctl 解决](https://juejin.cn/post/6844903624485634061)