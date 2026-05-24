---
sidebar_position: 5
---

# 设备信息 Device

只读全局对象 `Device`,启动时一次性 seed,后续不变。

## 字段

```js
console.log(JSON.stringify(Device))
// {
//   "model": "Mate 60 Pro",
//   "brand": "HUAWEI",
//   "osVersion": "OpenHarmony-5.0.0.110",
//   "deviceType": "phone",
//   "sdkApiVersion": 14,
//   "locale": "zh-Hans-CN",
//   "screenWidth": 1260,
//   "screenHeight": 2720,
//   "densityDPI": 320
// }
```

| 字段 | 类型 | 说明 |
|---|---|---|
| `model` | string | 设备型号(`deviceInfo.productModel`) |
| `brand` | string | 品牌(HUAWEI / honor / ...) |
| `osVersion` | string | OS 完整版本名 |
| `deviceType` | string | `"phone"` / `"tablet"` / `"2in1"` / `"wearable"` ... |
| `sdkApiVersion` | number | API level(如 14) |
| `locale` | string | 系统语言地区(如 `"zh-Hans-CN"`) |
| `screenWidth` | number | 屏幕像素宽 |
| `screenHeight` | number | 屏幕像素高 |
| `densityDPI` | number | 屏幕 DPI |

## 常见用法

### 按设备类型出不同布局

```js
const isTablet = Device.deviceType === "tablet"
let cols = isTablet ? 4 : 2     // Grid 字段填 ${cols}
```

### 国际化文案

```js
const isZh = Device.locale.startsWith("zh")
let greeting = isZh ? "你好" : "Hello"
```

### 按 API level 兜底新特性

```js
if (Device.sdkApiVersion >= 14) {
  // 用 API 14+ 才有的接口
}
```

## 注意事项

:::tip 启动后不变
Device 在 runtime 创建时一次性读取并缓存,跨次 eval 也不重新读。设备语言切换、屏幕方向变化要重启 App / 卡片才会更新到。
:::

:::warning 字段缺失时是空串 / 0
某些字段在特殊设备 / 模拟器上可能拿不到 —— 都用 `String(...)` / `Number(...)` 包过,失败返 `""` / `0`,不会抛错。访问前可以兜底:

```js
const dpi = Device.densityDPI || 320
```
:::

## 速查

```js
Device.model            // string
Device.brand            // string
Device.osVersion        // string
Device.deviceType       // string
Device.sdkApiVersion    // number
Device.locale           // string
Device.screenWidth      // number
Device.screenHeight     // number
Device.densityDPI       // number
```
