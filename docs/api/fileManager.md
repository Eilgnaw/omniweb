---
sidebar_position: 11
---

# 文件管理

用 `FileManager` 保存文本、JSON 和图片。每个小组件都有自己的目录。

## 先选本地还是 iCloud

| 初始化 | 位置 | 建议用途 |
| --- | --- | --- |
| `FileManager.local()` | 当前设备 | 默认选择；缓存、图片、普通数据 |
| `FileManager.iCloud()` | iCloud Drive | 需要跨设备访问的文件 |

:::warning 小组件中优先使用本地文件
iCloud 文件可能尚未下载，后台小组件也不适合等待同步。除非确实需要跨设备文件，否则使用 `FileManager.local()`。
:::

## 选择公开或私有目录

```js
const fm = FileManager.local()
const publicDirectory = fm.documents()
const privateDirectory = fm.library()
```

| 方法 | 路径前缀 | 用户能否在“文件”App 中看到 |
| --- | --- | --- |
| `documents()` | 本地 `LD:` / iCloud `ID:` | 能 |
| `library()` | 本地 `LL:` / iCloud `IL:` | 不能 |

返回值已经包含当前小组件目录和末尾 `/`，可以直接拼接文件名。

## 读写文字

```js
const fm = FileManager.local()
const path = fm.documents() + "greeting.txt"

const saved = fm.writeString(path, "Hello, Omni!")
const content = fm.readString(path)

console.log(saved, content)
```

`writeString()` 返回是否写入成功。文件不存在或读取失败时，`readString()` 返回空值。

## 保存网络图片

```js
const fm = FileManager.local()
const path = fm.documents() + "background.png"

if (!fm.fileExists(path)) {
  const request = new Request("https://example.com/image.png")
  request.headers = {
    "Authorization": `Bearer ${token}`
  }
  await fm.download(request, path)
}

this.imagePath = path
```

把 Image 组件的类型设为“文件”，内容设为 `${imagePath}`。

`download()` 会把响应直接写入文件，适合需要请求头的图片，也能避免大图片在 JavaScript 与原生之间来回复制字节数组。旧的 `fetch() + saveImage()` 仍然兼容。

## 检查与删除

```js
const fm = FileManager.local()
const path = fm.documents() + "temp.txt"

if (fm.fileExists(path)) {
  const removed = fm.remove(path)
  console.log("删除结果：", removed)
}
```

## 列出和清空目录

```js
const fm = FileManager.local()
const cacheDirectory = fm.join([fm.documents(), "cache"])

fm.writeString(fm.join([cacheDirectory, "a.txt"]), "A")
fm.writeString(fm.join([cacheDirectory, "b.txt"]), "B")

const names = fm.listContents(cacheDirectory)
console.log(names) // ["a.txt", "b.txt"]

const cleared = fm.clear(cacheDirectory)
console.log(cleared, fm.listContents(cacheDirectory)) // true, []
```

`listContents()` 返回目录下的直接子项名称，包括文件和文件夹，结果按名称排序。`clear()` 会删除目录内的全部文件和子文件夹，但保留目录本身。

:::warning 清空操作无法撤销
把 `fm.documents()` 或 `fm.library()` 直接传给 `clear()` 会清空当前小组件对应目录中的全部内容。调用前请确认路径。
:::

## 安全拼接路径

```js
const path = fm.join([fm.documents(), "cache", "data.json"])
```

`join()` 会把多段路径组合起来，适合有子目录的文件。路径中的 `./` 和重复 `/` 会被规范化；绝对路径、任何 `..` 路径段，以及属于其他小组件的路径前缀都会被拒绝。所有文件 API 都使用同一套路径检查。

## iCloud 目录

```js
const fm = FileManager.iCloud()
const publicDirectory = fm.documents() // ID:...
const privateDirectory = fm.library()  // IL:...
```

公开目录会显示在“文件”App 的 iCloud Drive 中；私有目录只供 App 使用。

## 速查

```js
FileManager.local() → FileManager
FileManager.iCloud() → FileManager
fm.documents() → string
fm.library() → string
fm.join(paths) → string
fm.fileExists(path) → boolean
fm.writeString(path, content) → boolean
fm.readString(path) → string | null
fm.saveImage(path, bytes) → void
fm.download(request, path) → Promise<{ path, status, mimeType, size, cached }>
fm.listContents(path) → string[]
fm.clear(path) → boolean
fm.remove(path) → boolean
```
