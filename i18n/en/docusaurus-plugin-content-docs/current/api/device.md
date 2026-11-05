---
sidebar_position: 5
---

# Device information

`Device` returns device, screen, battery, and connection information synchronously. You don't need `await`.

## Device and system

```js
this.system = Device.systemVersion() // e.g. "17.5"
this.name = Device.name()            // device name
this.model = Device.model()          // e.g. "iPhone"
this.language = Device.language()    // e.g. "en"
this.darkMode = Device.isdarkmode()  // true / false
```

## Screen

```js
const screen = Device.screen()
console.log(screen)
// { scale: 3, width: 393, height: 852 }
```

| Field | Meaning |
| --- | --- |
| `scale` | Screen pixel density, such as `2` or `3` |
| `width` / `height` | Logical screen size in points |

## Battery

```js
const battery = Device.battery()
this.level = Math.round(battery.level * 100)
this.charging = battery.state === "charging"
```

| `state` | Meaning |
| --- | --- |
| `unknown` | Can't determine the state |
| `charging` | Charging |
| `full` | Fully charged |
| `unplugged` | Not charging |

`level` is a decimal from `0` to `1`.

## Device storage

```js
const total = Device.totalDiskSpace()
const free = Device.freeDiskSpace()
const gigabyte = 1024 * 1024 * 1024

this.storage = `${(free / gigabyte).toFixed(1)} GB free / ${(total / gigabyte).toFixed(1)} GB`
```

Both methods return a byte count. They return `0` if the value can't be read.

:::warning Storage information is only for display to the user
These methods are covered by Apple's disk-space Required Reason API, declared with reason `85F4.1`. You can't send the values or derived information over the internet or use them for tracking or device fingerprinting.
:::

## Network

```js
const network = Device.network()
console.log(network)
// { wifi: true, cellular: false, online: true, vpn: false }
```

| Field | Meaning |
| --- | --- |
| `wifi` | Currently connected through Wi-Fi |
| `cellular` | Currently connected through cellular data |
| `online` | The network is reachable |
| `vpn` | A VPN connection was detected |

## Bluetooth and Personal Hotspot

```js
const connectivity = Device.connectivity()
console.log(connectivity)
// { bluetooth: "on", hotspot: false }
```

`bluetooth` may be `on`, `off`, `unsupported`, `unauthorized`, `resetting`, or `unknown`. `hotspot` is a boolean.

:::warning Connection values reflect the current detection
Reading Bluetooth may trigger a system permission prompt; after denial, it returns `unauthorized`. iOS has no public Personal Hotspot status API, so `hotspot` is an indirect result and shouldn't control critical behavior.
:::

## Example: switch icons for the network

```js
const network = Device.network()
this.networkIcon = network.wifi
  ? "wifi"
  : network.cellular
    ? "antenna.radiowaves.left.and.right"
    : "wifi.slash"
```

Set an Icon's Content to `${networkIcon}`.

## Quick reference

```js
Device.systemVersion() → string
Device.name() → string
Device.model() → string
Device.language() → string
Device.isdarkmode() → boolean
Device.screen() → { scale, width, height }
Device.battery() → { state, level }
Device.totalDiskSpace() → number  // total capacity in bytes
Device.freeDiskSpace() → number   // available capacity in bytes
Device.network() → { wifi, cellular, online, vpn }
Device.connectivity() → { bluetooth, hotspot }
```
