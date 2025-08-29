---
sidebar_position: 2
---
# 文件管理
:::info
文件管理 (FileManager) 模块提供了在 Omni 小组件中读写文件的能力，支持 iCloud 和本地文件存储。
:::

## 初始化

`FileManager` 需要先进行初始化，以指定使用本地存储还是 iCloud 。

### 本地存储

文件将仅存储在当前设备上。

#### 公共目录

文件存储在 `文件 App -> 我的 iPhone -> Omni` 目录下。

```javascript
// 初始化本地 FileManager
const fm = FileManager.local();

// 获取公共文档目录路径
const documentsPath = fm.documents();
console.log(documentsPath);
// 输出 LD:小组件ID(UUID)/
// 对应位置为: iPhone/OmniWidgets/Widgets/小组件ID(UUID)
```

#### 私有目录

文件存储在应用内部的本地目录中，在 `文件` App 中不可见。

```javascript
// 初始化本地 FileManager
const fm = FileManager.local();

// 获取私有库目录路径
const libraryPath = fm.library();
console.log(libraryPath);
```


## 文件操作

### 读写字符串

适用于读写文本文件，如 `txt`, `json` 等。

```javascript
const fm = FileManager.local();
const docs = fm.documents();
const filePath = docs + "greeting.txt";

// 写入字符串
fm.writeString(filePath, "Hello, Omni!");

// 读取字符串
const content = fm.readString(filePath);
console.log(content); // 输出: Hello, Omni!
```

### 读写图片

适用于保存和加载图片。

```javascript
const fm = FileManager.local();
const docs = fm.documents();
this.imagePath = docs + "background.png";
// 假设 image 是从网络或其它地方获取的图片数据 [Uint8Array]
const image = await new Request("https://example.com/image.png").fetch();
// 保存图片
fm.saveImage(imagePath, image);

// 在图片组件中显示
// 将图片组件类型设置为 "文件"，内容填写 imagePath 变量的值即可。
```

### 检查文件是否存在

```javascript
const fm = FileManager.local();
const path = fm.documents() + "config.json";

if (fm.fileExists(path)) {
  console.log("文件存在");
} else {
  console.log("文件不存在");
}
```

### 删除文件

```javascript
const fm = FileManager.local();
const path = fm.documents() + "temp.txt";

// 确保文件存在再删除
if (fm.fileExists(path)) {
  fm.remove(path);
  console.log("文件已删除");
}
```

## 快捷指令

您可以在 `快捷指令 App -> Omni -> 文件管理` 分类下找到更多文件操作的示例和快捷指令。


## iCloud 云盘
:::tip
由于小组件本身暂不支持 iCloud 同步所以暂不推荐使用 iCloud
:::
文件将存储在 iCloud Drive 中，可在多个设备间同步。

#### 公共目录

文件存储在 `文件 App -> iCloud Drive -> Omni` 目录下，用户可以方便地查看和管理。

```javascript
// 初始化 iCloud FileManager
const fm = FileManager.iCloud();

// 获取公共文档目录路径
const documentsPath = fm.documents();
console.log(documentsPath);
//输出 ID:小组件ID(UUID)/
// 对应位置为: iCloud/OmniWidgets/Widgets/小组件ID(UUID)
```

#### 私有目录

文件存储在应用内部的 iCloud 目录中，在 `文件` App 中不可见，适合存放不希望用户直接操作的缓存或配置文件。

```javascript
// 初始化 iCloud FileManager
const fm = FileManager.iCloud();

// 获取私有库目录路径
const libraryPath = fm.library();
console.log(libraryPath);
```

