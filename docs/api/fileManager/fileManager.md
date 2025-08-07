---
sidebar_position: 2
---
# 文件管理
:::info
文件管理用于 Omni 小组件读写文件
:::
### 初始化
#### iCloud 云盘
- 使用一个可以在 文件-iCloud-Omni 中管理的文件路径
```js
//指定为iCloud
const fm = FileManager.iCloud()
//使用共享路径(可在 文件 APP 中管理)
let basePath = fm.documents()
console.log(basePath)
```
- 使用一个iCloud 内部文件路径,文件 APP 中不可见
```js
//指定为iCloud
const fm = FileManager.iCloud()
//使用内部文件路径
let basePath = fm.library()
console.log(basePath)
```

#### 本地文件
- 使用一个可以在 文件-iPhone-Omni 中管理的文件路径
```js
//指定为本地文件
const fm = FileManager.local()
//使用共享路径(可在 文件 APP 中管理)
let basePath = fm.documents()
console.log(basePath)
```
- 使用一个本地内部文件路径,文件 APP 中不可见
```js
//指定为本地文件
const fm = FileManager.local()
//使用内部文件路径
let basePath = fm.library()
console.log(basePath)
```
### 文件读写
#### 图片读写
- 保存图片
```js
let imageName = "test.png"
let image = [11,11,....11] //[uint8]
const fm = FileManager.local()
let basePath = fm.documents()
let imagePath = basePath + imageName
fm.saveImage(imagePath,image)
```

- 显示图片
使用图片组件,类型设置为 文件, 内容使用 `{imagePath}`

#### 字符串读写
``` js
let fileName = "test.txt"
const fm = FileManager.local()
const doc = fm.documents()
const path = doc + "test.txt"
let str = randomString()
//写入字符串
fm.writeString(path,str)

//读取字符串
this.text = fm.readString(path)
console.log(text)
```