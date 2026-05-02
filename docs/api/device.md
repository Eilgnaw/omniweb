---
sidebar_position: 5
---

# 设备信息

获取设备型号、系统、屏幕、电量、网络等基础信息。**全部同步**,不需要 `await`。

## 基本信息

```js
this.version  = Device.systemVersion()  // "17.5"
this.name     = Device.name()           // "iPhone 15 Pro"
this.model    = Device.model()          // "iPhone"
this.language = Device.language()       // "zh"
this.darkMode = Device.isdarkmode()     // true / false
```

## 屏幕

```js
const s = Device.screen()
console.log(s)
// { scale: 3, width: 393, height: 852 }
```

| 字段 | 说明 |
|------|------|
| `scale` | 像素密度倍数(2x / 3x) |
| `width` / `height` | 逻辑像素的屏幕宽 / 高 |

## 电量

```js
const b = Device.battery()
console.log(b)
// { "state": "unplugged", "level": 0.75 }
```

| state | 含义 |
|-------|------|
| `unknown`   | 未知 |
| `charging`  | 充电中 |
| `full`      | 已充满 |
| `unplugged` | 未充电 |

`level` 是 0~1 的小数。乘 100 即百分比。

## 网络状态

```js
const n = Device.network()
console.log(n)
// {
//   "wifi":     true,
//   "cellular": false,
//   "online":   true,
//   "vpn":      false
// }
```

| 字段 | 说明 |
|------|------|
| `wifi` | 是否连 Wi-Fi |
| `cellular` | 是否走蜂窝 |
| `online` | 是否联网(任一为真) |
| `vpn` | 是否在 VPN |

## 连接状态(蓝牙 / 热点)

```js
const c = Device.connectivity()
console.log(c)
// { "bluetooth": "on", "hotspot": false }
```

| 字段 | 取值 / 类型 |
|------|------------|
| `bluetooth` | `"on"` / `"off"` / `"unsupported"` / `"unauthorized"` / `"resetting"` / `"unknown"` |
| `hotspot` | true / false |

:::warning 蓝牙权限
读取蓝牙状态需要 App 配置了**蓝牙权限**。第一次会弹窗。拒绝后返回 `"unauthorized"`。
:::

## 例:做一个"网络状态"图标

```js
const n = Device.network()
this.netIcon = n.wifi ? "wifi" : (n.cellular ? "antenna.radiowaves.left.and.right" : "wifi.slash")
```

icon 组件填 `{netIcon}`,根据网络自动切换图标。
