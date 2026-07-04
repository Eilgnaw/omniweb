---
sidebar_position: 5
---

# Device Info

Get device model, system, screen, battery, network, and other basic info. **All synchronous** — no `await` needed.

## Basic Info

```js
this.version  = Device.systemVersion()  // "17.5"
this.name     = Device.name()           // "iPhone 15 Pro"
this.model    = Device.model()          // "iPhone"
this.language = Device.language()       // "zh"
this.darkMode = Device.isdarkmode()     // true / false
```

## Screen

```js
const s = Device.screen()
console.log(s)
// { scale: 3, width: 393, height: 852 }
```

| Field | Description |
|------|------|
| `scale` | Pixel density multiplier (2x / 3x) |
| `width` / `height` | Logical screen width / height in points |

## Battery

```js
const b = Device.battery()
console.log(b)
// { "state": "unplugged", "level": 0.75 }
```

| state | Meaning |
|-------|------|
| `unknown`   | Unknown |
| `charging`  | Charging |
| `full`      | Fully charged |
| `unplugged` | Not charging |

`level` is a 0–1 decimal. Multiply by 100 for the percentage.

## Network Status

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

| Field | Description |
|------|------|
| `wifi` | Connected to Wi-Fi |
| `cellular` | Using cellular |
| `online` | Online (either of the above) |
| `vpn` | On VPN |

## Connectivity (Bluetooth / Hotspot)

```js
const c = Device.connectivity()
console.log(c)
// { "bluetooth": "on", "hotspot": false }
```

| Field | Value / Type |
|------|------------|
| `bluetooth` | `"on"` / `"off"` / `"unsupported"` / `"unauthorized"` / `"resetting"` / `"unknown"` |
| `hotspot` | true / false |

:::warning Bluetooth permission
Reading Bluetooth status requires the app to have the **Bluetooth permission** configured. iOS prompts on first use. If denied, returns `"unauthorized"`.
:::

## Example: A "Network Status" Icon

```js
const n = Device.network()
this.netIcon = n.wifi ? "wifi" : (n.cellular ? "antenna.radiowaves.left.and.right" : "wifi.slash")
```

Put `${netIcon}` in an icon component to auto-switch icons based on network status.
