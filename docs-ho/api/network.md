---
sidebar_position: 2
---

# 网络请求

网络模块让卡片可以联网拉数据。一个类 `Request`,三种取响应的方式。

## 基本用法

```js
const req = new Request("https://2f0.cn/api/omni")
const obj = await req.fetchJSON()    // 直接拿到解析好的对象

let title = obj.title
let count = obj.count
```

## 配置请求

```js
const req = new Request("https://api.example.com/login")
req.method = "POST"
req.headers = { "X-Token": "abc" }
req.body = { username: "alice", pwd: "x" }   // 对象自动 JSON.stringify

const resp = await req.fetchJSON()
```

可选字段:

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `method` | string | `"GET"` | `GET` / `POST` / `PUT` / `DELETE` / `OPTIONS` / `HEAD` / `TRACE` / `CONNECT`(大小写不敏感) |
| `headers` | `Record<string, string>` | `{}` | 自动加 `User-Agent: AWidgetHarmony/1.0` |
| `body` | string \| object \| undefined | undefined | 对象自动 `JSON.stringify`;body 非空且没指定 `Content-Type` 自动加 `application/json` |

## 三种取响应方式

```js
const req = new Request("https://example.com/x")

// 1) JSON —— 一步到位,内部 JSON.parse
const obj = await req.fetchJSON()

// 2) 字符串 —— 自己 parse 或当 HTML / 文本用
const text = await req.fetchString()

// 3) 二进制 —— 给图片、文件用,直接拿 Uint8Array
const bytes = await req.fetch()             // Uint8Array
```

### 二进制 → 写入文件

最常见的用法:下载图片缓存到沙盒 → Image 组件用 `files/` 路径加载:

```js
const req = new Request("https://example.com/avatar.png")
const bytes = await req.fetch()                  // Uint8Array
const savedPath = await FileManager.write("avatar.png", bytes)
// savedPath === "files/avatar.png"

let avatar = savedPath                          // → Image 组件 src 填 ${avatar}
```

详见 [`FileManager`](./fileManager.md)。

## 注意事项

:::warning 卡片侧 4.5s 硬上限
鸿蒙 `FormExtensionAbility.onUpdateForm` 每次最多给 5 秒,JS 这边在 4500ms 处 timeout。一次拉多个接口要并行,**别串行 await**:

```js
// ❌ 串行,可能超时
const a = await reqA.fetchJSON()
const b = await reqB.fetchJSON()

// ✅ 并行
const [a, b] = await Promise.all([reqA.fetchJSON(), reqB.fetchJSON()])
```

连接超时和读取超时单独都是 5s,体感更紧 —— 慢接口建议放主 App 里跑(`FileManager` 缓存),卡片只读缓存。
:::

:::warning fetchJSON 解析失败抛错
返回内容不是合法 JSON,`fetchJSON()` 会 throw。**包 try/catch**,不然 JS eval 直接 error,卡片走 fallback bindings。
:::

:::tip HTTP 错误码 ≥ 400 抛错
返回 400+ 也是 throw `http <code>`,不必自己判 `response.status`。
:::

## 速查

```js
// 构造
const req = new Request(url)
req.method  = "GET" | "POST" | "PUT" | "DELETE" | ...
req.headers = { "X-Foo": "bar" }
req.body    = "raw string" | { json: "object" }

// 取响应
await req.fetch()        → Uint8Array       // 二进制 fast path
await req.fetchString()  → string
await req.fetchJSON()    → 解析后的对象     // 内部 JSON.parse
```
