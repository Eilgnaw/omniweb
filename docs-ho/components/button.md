---
sidebar_position: 5
---

# 按钮 Button

可点击的容器组件。文字、图标都通过**子节点**(文本 / 图标 / 图片)表达,按钮 自己只负责交互。

## 用法

编辑器加 **按钮**(`Button`),**把要显示的子组件拖进去**:

```
按钮 (Button)
 ├─ 图标 (Icon, glyph = "plus")
 └─ 文本 (Text, content = "添加")
```

然后在 按钮 的「点击」字段(`event.click`)写一个主 JS 里已经定义好的函数调用。用户点了之后,按钮会执行这个调用,再让卡片刷新显示最新结果。

## 点击事件 (`click`)

推荐把逻辑写在主 JS,按钮里只写函数名:

```text
increment()
await refreshData()
refresh
```

主 JS 示例:

```js
let counter = Config.get("counter", 0)

function increment() {
  counter = counter + 1
  Config.set("counter", counter)
}

async function refreshData() {
  const data = await new Request("https://example.com/api").fetchJSON()
  Config.set("title", data.title)
}
```

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `click` | event | 点击时执行的 JS 片段 |
| `width` / `height` / `padding` | | 同 Stack |
| `backColor` / `cornerRadius` / `opacity` | | 同 Stack |

> 按钮 内的文字 / 字号 / 字色直接由子节点(文本 / 图标)的属性决定,按钮自己不暴露字体相关字段。

## 注意事项

:::tip click 片段也是 JS
它能访问主 JS 顶层定义的变量、函数、Setting / Config。复杂逻辑放进主 JS 函数,按钮里只写 `increment()` 或 `await refreshData()` 这类调用。
:::

:::warning click 也走 4.5s 上限
不要在 click 里写大段代码或 `return`。异步逻辑可以写成主 JS 的 `async function`,再在按钮里用 `await 函数名()` 调用。
:::
