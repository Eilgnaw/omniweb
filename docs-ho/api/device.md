---
sidebar_position: 5
---

# 设备信息

`Device` 是只读全局对象，不需要 `await`。可以根据设备类型、语言、屏幕和 API 版本调整卡片内容。

## 字段

```js
console.log(Device.model)
console.log(Device.locale)
console.log(Device.screenWidth, Device.screenHeight)
```

| 字段 | 内容 |
| --- | --- |
| `model` | 设备型号 |
| `brand` | 品牌，例如 `HUAWEI` |
| `osVersion` | 系统完整版本 |
| `deviceType` | `phone`、`tablet`、`2in1`、`wearable` 等 |
| `sdkApiVersion` | API Level |
| `locale` | 语言地区，例如 `zh-Hans-CN` |
| `screenWidth` / `screenHeight` | 屏幕像素尺寸 |
| `densityDPI` | 屏幕 DPI |

## 根据设备调整布局

```js
let columns = Device.deviceType === "tablet" ? 4 : 2
```

把网格的“列数 / 行数”设为 `${columns}`。

## 根据语言切换内容

```js
let greeting = Device.locale.startsWith("zh") ? "你好" : "Hello"
```

## 按 API 版本准备回退

```js
let supportsAdvancedGauge = Device.sdkApiVersion >= 23
```

某些设备或模拟器可能无法提供全部字段，字符串会是 `""`，数字会是 `0`。使用前准备默认值：

```js
let dpi = Device.densityDPI || 320
```

## 速查

```js
Device.model
Device.brand
Device.osVersion
Device.deviceType
Device.sdkApiVersion
Device.locale
Device.screenWidth
Device.screenHeight
Device.densityDPI
```
