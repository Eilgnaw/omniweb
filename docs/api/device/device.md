---
sidebar_position: 4
---
# 设备信息
:::info
设备信息接口可以获取设备的一些基础信息
:::
### 系统版本号
``` js
this.version = device.systemVersion()
console.log(version)

// 17.0
```

### 设备名称
``` js
this.name = device.name()
console.log(name)

// iPhone 15 Pro
```

### 设备语言
``` js
this.language = device.language()
console.log(language)

// zh
```

### 电池信息
:::info
由于小组件刷新时间限制,电量时效不准,故暂不提供读取,如果能接受电池信息延迟,可以联系我们开放此接口
:::
