---
sidebar_position: 4
---

# 速查地图

如果只想拍马上手,**直接看 [做出第一个小组件](./first-widget.md)** —— 跟着走一遍就能跑出一张能用的卡片。

下面是常用语法 / API 一表搜:

## 占位符

```
${var}                  普通字段(content / fontSize / forColor / src ...)
${a.b.0.c}              点号路径 + 数组索引
{rows[row]}             容器 dataSource 字段,循环数组
```

详见 [占位符语法](./placeholder.md)。

## 常用 JS

```js
// 网络
const obj = await new Request(url).fetchJSON()

// 本地文件
const bytes = await new Request(url).fetch()
const path  = await FileManager.write("x.png", bytes)   // → "files/x.png"

// 持久化(类型保真,JSON 兼容)
Config.set("key", val)
const v = Config.get("key", 0)            // 缺失返 0,number 类型保留

// 用户参数(类型保真)
const city = Setting.get("city", "北京")
Setting.set("city", "上海")

// 设备信息
Device.locale                              // "zh-Hans-CN"

// 调度
setUpdateFreq(30)                          // 30 分钟后再唤起

// 调试
console.log("...")
if (isDebug()) { /* 编辑器才会进 */ }
```

## 完整 API 列表

| 模块 | 看哪儿 |
|---|---|
| 配置 / 持久化 | [Config](../api/config.md) |
| 网络请求 | [Network](../api/network.md) |
| 文件读写 | [FileManager](../api/fileManager.md) |
| 设备信息 | [Device](../api/device.md) |
| 卡片控制(刷新 / 跳转) | [Control](../api/control.md) |
| 日志 | [Console](../api/console.md) |

## 组件

| 类型 | 看哪儿 |
|---|---|
| 文本 Text | [Text](../components/text.md) |
| 图片 Image | [Image](../components/image.md) |
| 图标 Icon | [Icon](../components/icon.md) |
| 按钮 Button | [Button](../components/button.md) |
| 容器(Row/Column/Stack/...) | [Stack](../components/stack.md) |
| 网格 Grid | [Grid](../components/grid.md) |
| 占位 Blank | [Blank](../components/blank.md) |
