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
