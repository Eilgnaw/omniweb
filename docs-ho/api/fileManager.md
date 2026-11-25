---
sidebar_position: 4
---

# 文件读写

`FileManager` 在当前卡片的沙盒中读写文字和二进制文件。最常见的用途是缓存接口结果和网络图片。

## 最短示例

```js
await FileManager.write("note.txt", "Hello")
const text = await FileManager.read("note.txt")
```

## 路径规则

- API 接受 `"avatar.png"` 或 `"files/avatar.png"`。
- `write()` 总是返回 `"files/<文件名>"`，可以直接给图片使用。
- 只能访问当前卡片的文件，不能使用绝对路径、`~`、`..`、反斜杠或空路径段。

## 在编辑器中管理文件

打开卡片编辑器，选择右上角**更多 → 文件管理**，可以查看当前卡片通过 `FileManager` 生成的文件。

文件管理支持：

- 逐级浏览文件夹、新建文件夹和导入文件。
- 预览图片和常见文本文件。文本文件最多显示前 256 KiB。
- 重命名、删除、导出文件，以及复制 `files/...` 引用路径。

每张卡片的文件彼此独立。重命名或删除文件后，编辑器不会自动修改代码和图片组件中已有的路径，请同时更新相关引用。

## 两种调用方式

```js
// 直接调用
await FileManager.write("a.txt", "hello")

// 获取同一个文件管理对象
const files = FileManager()
await files.write(files.root() + "a.txt", "hello")
```

两种写法行为相同。

## 读写文字

```js
const savedPath = await FileManager.write("config.json", JSON.stringify({ count: 1 }))
const content = await FileManager.read("config.json")
const config = content ? JSON.parse(content) : {}
```

文件不存在时，`read()` 返回空字符串。

## 下载并保存图片

```js
const filename = "avatar.png"
let avatar = "files/" + filename

if (!(await FileManager.exists(filename))) {
  const bytes = await new Request("https://example.com/avatar.png").fetch()
  avatar = await FileManager.write(filename, bytes)
}
```

把图片的“资源”设为 `${avatar}`。

## 检查、列出和删除

```js
const exists = await FileManager.exists("avatar.png")
const rootFiles = await FileManager.list()
const imageFiles = await FileManager.list("images")
const removed = await FileManager.remove("avatar.png") // "1" 已删除；"0" 不存在
```

## 列出和清空文件夹

```js
const fm = FileManager()
await fm.write("cache/a.txt", "A")
await fm.write("cache/nested/b.txt", "B")

const names = await fm.list("files/cache")
const cleared = await fm.clear("files/cache") // true
const remaining = await fm.list("files/cache") // []
```

`list(dir?)` 返回目录下的直接子项名称，包括文件和文件夹。省略路径时列出当前卡片文件的根目录。

`clear(path)` 递归删除指定文件夹内的全部内容，保留文件夹本身，成功返回 `true`。需要明确传入路径，例如 `cache` 或 `files/cache`。路径非法、不存在或指向文件时，调用会抛出错误。

:::warning 清空操作无法撤销
将 `fm.root()` 传给 `clear()` 会清空当前卡片的整个 `files/` 目录。调用前请确认路径。
:::

:::warning 本地图片必须使用 `files/` 路径
`FileManager.write()` 已经返回正确格式。普通文件名可以用于 API 调用，但图片组件需要 `files/` 前缀。
:::

:::tip 大文件先在编辑器中缓存
卡片脚本只有 4.5 秒。不要在每次桌面刷新时重复下载大文件。
:::

## 速查

```js
FileManager.root() → "files/"
FileManager.read(path) → Promise<string>
FileManager.write(path, string | Uint8Array | number[]) → Promise<string>
FileManager.exists(path) → Promise<boolean>
FileManager.list(dir?) → Promise<string[]>
FileManager.clear(path) → Promise<boolean>
FileManager.remove(path) → Promise<string> // "1" 已删除；"0" 不存在
```
