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
| `fileManager.download(request, path)` | File info object | Images or large files that need to be saved |

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

## Download directly to a file

When you download an image or a larger binary file, don't use `fetch()` to copy every byte into JavaScript first. Pass the configured request to the destination `FileManager`:

```js
const fm = FileManager.local()
const path = fm.documents() + "avatar.png"

const request = new Request("https://example.com/avatar.png")
request.headers = {
  "Authorization": `Bearer ${token}`,
  "Referer": "https://example.com/"
}

const result = await fm.download(request, path)
console.log(result.path, result.status, result.mimeType, result.size, result.cached)
```

`download()` keeps the method, headers, and body configured on the `Request`. The response goes straight to a temporary file and replaces the destination only after the download succeeds, without creating a JavaScript byte array.

The returned object contains:

| Field | Meaning |
| --- | --- |
| `path` | The destination path you passed in |
| `status` | HTTP status code |
| `mimeType` | Response MIME type |
| `size` | Saved file size in bytes |
| `cached` | Whether the widget runtime cache was updated |

The Promise rejects for non-`2xx` HTTP responses, invalid file paths, network failures, or file write failures. The old `fetch() + fm.saveImage()` flow still works, but it's only recommended for very small binary values.

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
fileManager.download(request, path) → Promise<{ path, status, mimeType, size, cached }>
```
