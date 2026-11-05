---
sidebar_position: 5
---

# 设备信息

`Device` 同步返回设备、屏幕、电量和连接状态，不需要 `await`。

## 设备与系统

```js
this.system = Device.systemVersion() // 例如 "17.5"
this.name = Device.name()            // 设备名称
this.model = Device.model()          // 例如 "iPhone"
this.language = Device.language()    // 例如 "zh"
this.darkMode = Device.isdarkmode()  // true / false
```

## 屏幕

```js
const screen = Device.screen()
console.log(screen)
// { scale: 3, width: 393, height: 852 }
```

| 字段 | 含义 |
| --- | --- |
| `scale` | 屏幕像素密度，例如 `2` 或 `3` |
| `width` / `height` | 屏幕逻辑尺寸，单位为点 |

## 电量

```js
const battery = Device.battery()
this.level = Math.round(battery.level * 100)
this.charging = battery.state === "charging"
```

| `state` | 含义 |
| --- | --- |
| `unknown` | 无法判断 |
| `charging` | 正在充电 |
| `full` | 已充满 |
| `unplugged` | 未充电 |

`level` 是 `0` 到 `1` 的小数。

## 设备存储

```js
const total = Device.totalDiskSpace()
const free = Device.freeDiskSpace()
const gigabyte = 1024 * 1024 * 1024

this.storage = `${(free / gigabyte).toFixed(1)} GB 可用 / ${(total / gigabyte).toFixed(1)} GB`
```

两个方法都返回字节数；读取失败时返回 `0`。

:::warning 存储信息只能用于向用户显示
这些方法属于 Apple 的磁盘空间 Required Reason API，App 使用 `85F4.1` 理由进行申报。读取结果及其衍生值不能发送到互联网，也不能用于跟踪或设备指纹识别。
:::

## 网络

```js
const network = Device.network()
console.log(network)
// { wifi: true, cellular: false, online: true, vpn: false }
```

| 字段 | 含义 |
| --- | --- |
| `wifi` | 当前通过 Wi-Fi 连接 |
| `cellular` | 当前通过蜂窝网络连接 |
| `online` | 当前网络可达 |
| `vpn` | 检测到 VPN 连接 |

## 蓝牙与热点

```js
const connectivity = Device.connectivity()
console.log(connectivity)
// { bluetooth: "on", hotspot: false }
```

`bluetooth` 可能是 `on`、`off`、`unsupported`、`unauthorized`、`resetting` 或 `unknown`。`hotspot` 是布尔值。

:::warning 连接状态是当前检测结果
读取蓝牙可能触发系统权限请求；拒绝后返回 `unauthorized`。iOS 没有公开的个人热点状态接口，`hotspot` 是间接检测结果，不适合用于关键逻辑。
:::

## 示例：根据网络切换图标

```js
const network = Device.network()
this.networkIcon = network.wifi
  ? "wifi"
  : network.cellular
    ? "antenna.radiowaves.left.and.right"
    : "wifi.slash"
```

把 Icon 内容设为 `${networkIcon}`。

## 速查

```js
Device.systemVersion() → string
Device.name() → string
Device.model() → string
Device.language() → string
Device.isdarkmode() → boolean
Device.screen() → { scale, width, height }
Device.battery() → { state, level }
Device.totalDiskSpace() → number  // 总容量，字节
Device.freeDiskSpace() → number   // 可用容量，字节
Device.network() → { wifi, cellular, online, vpn }
Device.connectivity() → { bluetooth, hotspot }
```
