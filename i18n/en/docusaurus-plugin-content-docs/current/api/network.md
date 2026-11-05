---
sidebar_position: 1
---

# Network requests

Use `Request` to read JSON, text, or binary data from an HTTP endpoint. It's Omni's replacement for browser `fetch`.

## Smallest useful example

```js
try {
  const request = new Request("https://2f0.cn/api/omni")
  const data = await request.fetchJSON()
  this.title = data.omni
} catch (error) {
  console.error("Request failed:", error)
  this.title = "Can't load right now"
}
```

`fetchJSON()` already returns a parsed object. Don't call `JSON.parse()` on it again.

## Choose a response type

| Method | Returns | Best for |
| --- | --- | --- |
| `fetchJSON()` | Parsed object or array | JSON APIs |
| `fetchString()` | String | HTML, plain text, XML |
| `fetch()` | Byte array | Images and other binary files |

## GET request

```js
const request = new Request("https://2f0.cn/api/omni")
request.headers = {
  "Accept": "application/json"
}

const data = await request.fetchJSON()
console.log(data)
```

`GET` is the default method, so you don't need to set it.

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

An object in `body` is encoded as JSON. You can set `method` to any other HTTP method your server supports.

## Error handling

The Promise rejects when the network fails, the URL is invalid, or the response can't be parsed as the requested type. Give the widget a readable fallback:

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

:::tip Keep each refresh small
Widget runtime and memory are limited. Combine requests when possible, and cache repeated data with [`Config`](./config.md) or [files](./fileManager.md).
:::

## Quick reference

```js
new Request(url)                 // create a request
request.method = "POST"          // set the HTTP method
request.headers = { ... }        // set request headers
request.body = { ... }           // set a JSON request body
request.fetchJSON() → Promise<any>
request.fetchString() → Promise<string>
request.fetch() → Promise<number[]>
```
