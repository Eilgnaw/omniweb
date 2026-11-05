---
sidebar_position: 1
---

# 网络请求

使用 `Request` 从 HTTP 接口读取 JSON、文本或二进制数据。它是 Omni 中浏览器 `fetch` 的替代品。

## 最短示例

```js
try {
  const request = new Request("https://2f0.cn/api/omni")
  const data = await request.fetchJSON()
  this.title = data.omni
} catch (error) {
  console.error("请求失败：", error)
  this.title = "暂时无法加载"
}
```

`fetchJSON()` 已经返回解析后的对象，不需要再调用 `JSON.parse()`。

## 选择返回类型

| 方法 | 返回 | 适合 |
| --- | --- | --- |
| `fetchJSON()` | 已解析的对象或数组 | JSON API |
| `fetchString()` | 字符串 | HTML、纯文本、XML |
| `fetch()` | 字节数组 | 图片和其他二进制文件 |

## GET 请求

```js
const request = new Request("https://2f0.cn/api/omni")
request.headers = {
  "Accept": "application/json"
}

const data = await request.fetchJSON()
console.log(data)
```

`GET` 是默认方法，不需要额外设置。

## POST JSON

```js
const request = new Request("https://2f0.cn/api/omni")
request.method = "POST"
request.headers = {
  "Content-Type": "application/json"
}
request.body = {
  message: "Hello, Omni Widgets"
}

const response = await request.fetchJSON()
console.log(response)
```

`body` 中的对象会被编码成 JSON。也可以把 `method` 改成服务器支持的其他 HTTP 方法。

## 错误处理

网络失败、URL 无效或返回内容无法按指定类型解析时，Promise 会被拒绝。给小组件设置一个可读的回退值：

```js
try {
  const request = new Request(url)
  const data = await request.fetchJSON()
  this.value = data.value
} catch (error) {
  console.error(error)
  this.value = "--"
}
```

:::tip 别在一次刷新里请求太多接口
小组件的运行时间和内存都有限。能合并的请求尽量合并，重复数据可以用 [`Config`](./config.md) 或[文件](./fileManager.md)缓存。
:::

## 速查

```js
new Request(url)                 // 创建请求
request.method = "POST"          // 设置 HTTP 方法
request.headers = { ... }        // 设置请求头
request.body = { ... }           // 设置 JSON 请求体
request.fetchJSON() → Promise<any>
request.fetchString() → Promise<string>
request.fetch() → Promise<number[]>
```
