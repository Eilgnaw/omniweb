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
FileManager.remove(path) → Promise<string> // "1" 已删除；"0" 不存在
```
