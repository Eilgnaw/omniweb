---
sidebar_position: 12
---

# HTML Parsing

`HTMLDoc` is for **extracting data from HTML text**. If your API returns JSON directly, you don't need this — but if you need to scrape data from a webpage (Douban ratings, blog titles), this is your tool.

## Usage

```js
const html = await new Request("https://example.com").fetchString()
const doc = new HTMLDoc(html)

const result = doc.xpath("//h1")  // returns a JSON string
const items = JSON.parse(result)
console.log(items)
```

## What Is XPath?

In short: like a CSS selector, but with a more "path-style" syntax for precisely locating nodes in HTML.

| XPath | Meaning |
|-------|------|
| `//h1` | All h1s |
| `//div[@class='title']` | div with class `title` |
| `//a/@href` | The href of every a tag |
| `//ul[@id='list']/li` | li under the ul with id `list` |

For full syntax, search for "XPath tutorial".

## Return Data Format

`xpath()` returns a JSON string. After parsing, it's an array:

```json
[
  {
    "text":      "node's plain text",
    "innerHTML": "node's inner HTML",
    "toHTML":    "full HTML including self",
    "toXML":     "XML form",
    "className": "css class name",
    "tagName":   "h1",
    "content":   "plain text content"
  }
]
```

The most commonly used are `text` (plain text) and `innerHTML` (inner HTML).

## Example: Scrape a Douban Movie Rating

```js
const html = await new Request("https://movie.douban.com/subject/1292052/").fetchString()
const doc = new HTMLDoc(html)

const titleArr = JSON.parse(doc.xpath("//h1/span[@property='v:itemreviewed']"))
const ratingArr = JSON.parse(doc.xpath("//strong[@class='ll rating_num']"))

this.title  = titleArr[0]?.text || "?"
this.rating = ratingArr[0]?.text || "?"
```

## Notes

- HTML parsing **uses memory** inside the widget (limit is under 30MB) — don't throw huge pages at it.
- If the page structure changes, the XPath breaks. For production-grade use, prefer an RSS feed or a third-party API.
- Only HTML is supported (parsed by the [Kanna](https://github.com/tid-kijyun/Kanna) library). JavaScript execution isn't supported, so client-rendered SPAs won't give you any data.
