---
sidebar_position: 7
---
# 设备信息
:::info
设备信息接口可以获取设备的一些基础信息
:::
### 系统版本号
``` js
this.version = Device.systemVersion()
console.log(version)

// 17.0
```

### 设备名称
``` js
this.name = Device.name()
console.log(name)

// iPhone 15 Pro
```

### 设备语言
``` js
this.language = Device.language()
console.log(language)

// zh
```

### 电量信息
:::info
电量状态分别为: 未知 "unknown", 充电中 "charging", 已充满 "full", 未充电 "unplugged"
:::
``` js
this.battery = Device.battery()
console.log(battery)
// {"state":"unplugged","level":0.75}
```

### 网络状态
:::info
获取设备的网络连接状态，包括WiFi、蜂窝网络、VPN等
:::
``` js
const network = Device.network()
console.log(network)

// {
//   "wifi": true,           // WiFi连接状态
//   "cellular": false,      // 蜂窝网络状态  
//   "online": true,         // 是否联网
//   "vpn": false           // VPN连接状态
// }
```



### 连接状态
:::info
获取设备的连接状态，包括蓝牙、热点等非网络连接
:::
``` js
const connectivity = Device.connectivity()
console.log(connectivity)

// {
//   "bluetooth": "on",     // 蓝牙状态: "on"/"off"/"unauthorized"/"unknown"等
//   "hotspot": false       // 热点是否开启（true/false）
// }
```

#### 状态说明
- `bluetooth`: 蓝牙详细状态（字符串）
  - `"on"` - 蓝牙已开启并可用
  - `"off"` - 蓝牙已关闭
  - `"unsupported"` - 设备不支持蓝牙
  - `"unauthorized"` - 应用没有蓝牙权限
  - `"resetting"` - 蓝牙正在重置
  - `"unknown"` - 未知状态
- `hotspot`: 个人热点开启状态（布尔值）
