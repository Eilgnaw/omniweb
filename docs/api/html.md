---
sidebar_position: 12
---

# HTML 解析

`HTMLDoc` 用来**从 HTML 文本里抽取数据**。如果接口直接给 JSON,你用不到这个;
但如果要从网页(豆瓣评分、博客标题)抓数据,就靠它。

## 用法

```js
const html = await new Request("https://example.com").fetchString()
const doc = new HTMLDoc(html)

const result = doc.xpath("//h1")  // 返回 JSON 字符串
const items = JSON.parse(result)
console.log(items)
```

## XPath 是什么

简单说:像写 CSS 选择器一样,但语法更"路径化",能精准定位 HTML 里的节点。

| XPath | 含义 |
|-------|------|
| `//h1` | 所有 h1 |
| `//div[@class='title']` | class 为 title 的 div |
| `//a/@href` | 所有 a 标签的 href |
| `//ul[@id='list']/li` | id 为 list 的 ul 下的 li |

具体语法可搜 "XPath 教程"。

## 返回数据格式

`xpath()` 返回 JSON 字符串,parse 后是数组:

```json
[
  {
    "text":      "节点纯文本",
    "innerHTML": "节点内部 HTML",
    "toHTML":    "完整 HTML 含自身",
    "toXML":     "XML 形式",
    "className": "css 类名",
    "tagName":   "h1",
    "content":   "纯文本内容"
  }
]
```

最常用的是 `text`(纯文字)和 `innerHTML`(内部 HTML)。

## 例:抓豆瓣电影评分

```js
const html = await new Request("https://movie.douban.com/subject/1292052/").fetchString()
const doc = new HTMLDoc(html)

const titleArr = JSON.parse(doc.xpath("//h1/span[@property='v:itemreviewed']"))
const ratingArr = JSON.parse(doc.xpath("//strong[@class='ll rating_num']"))

this.title  = titleArr[0]?.text || "?"
this.rating = ratingArr[0]?.text || "?"
```

## 注意

- HTML 解析在小组件里**有内存压力**(小于 30MB),别拿巨大的页面练手。
- 网页结构变了,XPath 就失效。商业级用法建议接 RSS 或第三方 API。
- 仅支持 HTML(由 [Kanna](https://github.com/tid-kijyun/Kanna) 库解析),不支持执行 JavaScript;
  动态渲染的 SPA 站点抓不到数据。
