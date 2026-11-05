---
sidebar_position: 12
---

# HTML parsing

When a service only provides a webpage and has no JSON or RSS endpoint, use `HTMLDoc` and XPath to extract content from the HTML.

:::tip Prefer structured data when it's available
Page structure can change at any time, and HTML uses more memory than JSON. Use a JSON API or RSS feed instead whenever you can.
:::

## Smallest useful example

```js
const request = new Request("https://example.com")
const html = await request.fetchString()
const document = new HTMLDoc(html)

const result = document.xpath("//h1")
const headings = JSON.parse(result)
this.title = headings[0]?.text || ""
```

`xpath()` returns a JSON string. Parse it into an array with `JSON.parse()`.

## Common XPath queries

| XPath | Selects |
| --- | --- |
| `//h1` | Every `h1` element |
| `//div[@class='title']` | A `div` whose `class` is `title` |
| `//a/@href` | The `href` from every link |
| `//ul[@id='list']/li` | `li` elements in one specific list |

## Returned fields

Each match may include:

| Field | Content |
| --- | --- |
| `text` / `content` | Plain text |
| `innerHTML` | HTML inside the element |
| `toHTML` | Full HTML including the element itself |
| `toXML` | XML representation |
| `className` | CSS class name |
| `tagName` | Tag name |

Most widgets only need `text` and `innerHTML`.

## Example: extract a title and rating

```js
const request = new Request("https://movie.douban.com/subject/1292052/")
const html = await request.fetchString()
const document = new HTMLDoc(html)

const titles = JSON.parse(document.xpath("//h1/span[@property='v:itemreviewed']"))
const ratings = JSON.parse(document.xpath("//strong[@class='ll rating_num']"))

this.title = titles[0]?.text || "?"
this.rating = ratings[0]?.text || "?"
```

## Limits

- XPath can break when the page is redesigned.
- `HTMLDoc` doesn't execute webpage JavaScript, so it can't read content rendered by a client-side SPA.
- Don't parse very large pages. Widget extensions have limited memory.

## Quick reference

```js
new HTMLDoc(html)              // create a document from an HTML string
document.xpath(query) → string // return matches as a JSON string
```
