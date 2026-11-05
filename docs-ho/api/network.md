---
sidebar_position: 2
---

# 网络请求

使用 `Request` 从 HTTP 接口读取 JSON、文字或二进制数据。它是鸿蒙版中浏览器 `fetch` 的替代品。

## 最短示例

```js
let title = "暂时无法加载"

try {
  const request = new Request("https://2f0.cn/api/omni")
  const data = await request.fetchJSON()
  title = data.title || data.omni || title
} catch (error) {
  console.error("请求失败：", error)
}
```

`fetchJSON()` 已经返回解析后的对象，不需要再次 `JSON.parse()`。

## 选择返回类型

| 方法 | 返回 | 适合 |
| --- | --- | --- |
| `fetchJSON()` | 解析后的对象或数组 | JSON API |
| `fetchString()` | 字符串 | 纯文本、HTML、XML |
| `fetch()` | `Uint8Array` | 图片和其他二进制文件 |

## GET 请求

```js
const request = new Request("https://api.example.com/list")
request.headers = { "X-Token": "abc" }

const data = await request.fetchJSON()
```

`GET` 是默认方法。

## POST JSON

```js
const request = new Request("https://api.example.com/login")
request.method = "POST"
request.headers = { "Content-Type": "application/json" }
request.body = {
  username: "alice",
  password: "secret"
}

const data = await request.fetchJSON()
```

对象形式的 `body` 会自动编码为 JSON。也可以在构造时传入配置：

```js
const request = new Request(url, {
  method: "POST",
  headers: { "X-Token": "abc" },
  body: { value: 1 }
})
```

## 下载图片

```js
const bytes = await new Request("https://example.com/avatar.png").fetch()
let image = await FileManager.write("avatar.png", bytes)
// image === "files/avatar.png"
```

把图片的“资源”设为 `${image}`。

## 时间限制与错误

:::warning 卡片脚本最多运行 4.5 秒
多个独立请求尽量并行：

```js
const [profile, weather] = await Promise.all([
  new Request(profileUrl).fetchJSON(),
  new Request(weatherUrl).fetchJSON()
])
```
:::

HTTP 状态码大于等于 400、网络失败或 JSON 解析失败都会抛错。需要继续显示卡片时，请用 `try...catch` 设置回退值。

## 速查

```js
new Request(url)
new Request(url, { method, headers, body })

request.method = "POST"
request.headers = { ... }
request.body = { ... }

request.fetchJSON() → Promise<any>
request.fetchString() → Promise<string>
request.fetch() → Promise<Uint8Array>
```
