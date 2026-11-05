---
sidebar_position: 12
---

# HTML 解析

当服务器只提供网页，没有 JSON 或 RSS 接口时，可以用 `HTMLDoc` 和 XPath 从 HTML 中提取内容。

:::tip 有结构化接口时，优先使用接口
网页结构可能随时改变，HTML 也比 JSON 更占内存。能用 JSON API 或 RSS 时，不要解析整个网页。
:::

## 最短示例

```js
const request = new Request("https://example.com")
const html = await request.fetchString()
const document = new HTMLDoc(html)

const result = document.xpath("//h1")
const headings = JSON.parse(result)
this.title = headings[0]?.text || ""
```

`xpath()` 返回 JSON 字符串，需要先用 `JSON.parse()` 转成数组。

## 常用 XPath

| XPath | 选择内容 |
| --- | --- |
| `//h1` | 所有 `h1` 元素 |
| `//div[@class='title']` | `class` 为 `title` 的 `div` |
| `//a/@href` | 所有链接的 `href` 属性 |
| `//ul[@id='list']/li` | 指定列表中的 `li` |

## 返回字段

每个匹配项可能包含：

| 字段 | 内容 |
| --- | --- |
| `text` / `content` | 纯文字 |
| `innerHTML` | 元素内部的 HTML |
| `toHTML` | 包含元素自身的完整 HTML |
| `toXML` | XML 表示 |
| `className` | CSS 类名 |
| `tagName` | 标签名 |

多数场景只需要 `text` 和 `innerHTML`。

## 示例：提取标题和评分

```js
const request = new Request("https://movie.douban.com/subject/1292052/")
const html = await request.fetchString()
const document = new HTMLDoc(html)

const titles = JSON.parse(document.xpath("//h1/span[@property='v:itemreviewed']"))
const ratings = JSON.parse(document.xpath("//strong[@class='ll rating_num']"))

this.title = titles[0]?.text || "?"
this.rating = ratings[0]?.text || "?"
```

## 限制

- 页面改版后，XPath 可能失效。
- `HTMLDoc` 不执行网页 JavaScript，无法读取客户端渲染后的 SPA 内容。
- 不要解析体积很大的页面，小组件扩展的内存有限。

## 速查

```js
new HTMLDoc(html)            // 从 HTML 字符串创建文档
document.xpath(query) → string // 返回匹配项的 JSON 字符串
```
