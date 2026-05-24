---
sidebar_position: 4
---

# 文件读写 FileManager

每张卡片自己的沙盒目录,根路径 `widgets/{id}/files/`。读 / 写 / 列举 / 删除四件事。

## 路径约定

- 所有路径**相对于** `widgets/{id}/files/`
- API 既接受 `"foo.png"`,也接受带前缀的 `"files/foo.png"`,内部统一剥前缀
- `write` 写完返回 **canonical** 形式 `"files/<name>"` —— 直接喂给 Image 组件的 `src` 字段就能渲染

:::warning 路径安全
绝对路径(`/...`)、家目录(`~...`)、`..` 上跳、空段(`a//b`)、反斜杠都会被拒。**只能在自己卡片沙盒里活动**,无法读其它卡片或系统文件。
:::

## 两种写法,等价

```js
// 静态调用(推荐,代码短)
await FileManager.write("a.png", bytes)
const content = await FileManager.read("a.png")

// 函数调用 + root() 拼路径
const fm = FileManager()
const path = fm.root() + "a.png"      // "files/a.png"
await fm.write(path, bytes)
```

内部就一份共享 manager,两种写法行为一致。

## 读

```js
const text = await FileManager.read("config.json")
// → 文件不存在返 ""(不抛错)
// → 始终按 UTF-8 文本读;二进制目前没有 readBytes
```

## 写

```js
// 写字符串
await FileManager.write("note.txt", "hello\nworld")

// 写二进制(Uint8Array 或 number[])
const req = new Request("https://example.com/x.png")
const bytes = await req.fetch()                  // Uint8Array
const saved = await FileManager.write("x.png", bytes)
// saved === "files/x.png"

// 把 saved 写入顶层变量给 Image 用
let img = saved      // → Image src 填 ${img}
```

`write` 返回 canonical 路径 `"files/<rel>"`,这就是你要塞给 Image 组件 `src` 的值。

## 检查 / 列举 / 删

```js
const exists = await FileManager.exists("x.png")     // → true / false

const all = await FileManager.list()                 // → string[] 根目录文件名
const sub = await FileManager.list("imgs")           // → string[] 子目录

const ok  = await FileManager.remove("x.png")        // 删完不抛错;不存在也 ok
```

## 完整示例:下载并展示图片

```js
const url = "https://example.com/avatar.png"
const filename = "avatar.png"

let avatar = "files/" + filename     // 先假设有缓存

if (!(await FileManager.exists(filename))) {
  try {
    const bytes = await new Request(url).fetch()
    avatar = await FileManager.write(filename, bytes)
  } catch (e) {
    console.error("下载失败:", e.message)
    avatar = ""                       // Image 收到空字符串会显示默认占位
  }
}
```

然后画布上 Image 组件 `src` 字段填 `${avatar}`,搞定。

## 注意事项

:::tip Image 必须用 `files/` 前缀
卡片侧 Image 组件渲染本地图片靠路径前缀辨识 —— `"files/xxx.png"` 走 fd 注入,**省掉前缀的话渲染不出**。`FileManager.write` 已经替你拼好,别手动剥。
:::

:::warning 沙盒图片在卡片侧的特殊路径
卡片端 `WidgetCard` 不能直接用文件路径加载 Image,主机侧 binding 阶段会把 `"files/xxx.png"` 转成 `formImages` + fd 注入。**只要你 src 写 `${avatar}` 且 JS 里 avatar 是 `"files/xxx.png"` 形式,就一切都对**,不必自己处理 fd。
:::

:::warning 4.5s 超时同样适用
卡片侧每次 eval 上限 4.5s。下载大图 + 写盘可能挤掉别的逻辑。**别在卡片刷新里下大文件**,放主 App 编辑器里手动跑一次缓存好就行。
:::

## 速查

```js
// 字符串读
await FileManager.read(path)              → string    // 不存在 → ""

// 写(string 或 Uint8Array/number[])
await FileManager.write(path, content)    → string    // 返 "files/<rel>" canonical

// 元数据
await FileManager.exists(path)            → boolean
await FileManager.list(dir?)              → string[]
await FileManager.remove(path)            → boolean   // 已删返 true

// root 路径(给手动拼接用)
FileManager.root()                        → "files/"
```
