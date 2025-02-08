---
sidebar_position: 3
---
# 配置读写
:::info
配置读写分为小组件配置,小组件设置和通用配置
:::
### 小组件配置
此配置跟随小组件,每个小组件相互独立
可通过快捷指令进行写入和读取操作
#### 写配置
``` js
//setConfig(key, value)
setConfig("token", "abcdef")
```
#### 读配置
``` js
//getValue(key) 默认值为空
let token = getConfig("token")
console.log(token)
//abcdef
```

### 小组件设置
小组件设置是在小组件编辑界面,点击 ⚙️ 图标后的设置项
设置项在编辑组件时添加
用于其他用户导入小组件后在此设置个人信息
#### 读设置
``` js
//Setting.string(key) 读取字符串类型的设置项
this.string = Setting.string("string")
//Setting.fileString(key) 读取文本文件的内容
this.file = Setting.fileString("file")
//Setting.string(key) 读取选中项
this.select = Setting.string("select")
//Setting.bool(key) 读取布尔值
this.flag = Setting.bool("flag")
```

#### 写设置
目前仅支持写入字符串,一般用于显示用户初始化信息,如随机 ID
``` js
//Setting.set(value,key) 读取字符串类型的设置项
Setting.set("111111","string")
let string = Setting.string(string)
console.log(string)
// 111111
```

### 通用配置
通用配置是所有小组件可以共享的配置信息
此配置提供快捷指令接口,可以通过快捷指令读取和写入
编辑时,槽位默认为999, 正式使用时槽位默认为1
为防止冲突,请谨慎使用此配置
#### 写配置
``` js
//setValue(key, value)
setValue('database' ,"abcdefg")
```

#### 读配置
``` js
//getValue(key) 默认值为空
this.data = getValue('database')
console.log(data)
```