---
sidebar_position: 5
---

# 按钮

按钮是可点击的容器。文字、图标、图片都通过子组件表达,按钮自己只负责点击交互。

## 用法

在编辑器底部点加号,添加 **按钮**,再把要显示的子组件拖进去:

```text
按钮
 ├─ 图标,「图标」填 plus
 └─ 文本,「内容」填 添加
```

然后在按钮的「点击」字段写一个主 JS 里已经定义好的函数调用。用户点击后,按钮会执行这个调用,再刷新卡片显示最新结果。

## 点击

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

| 字段 | 可填写 | 说明 |
|------|------|------|
| 点击 | `increment()` / `await refreshData()` / `refresh` | 点击时执行的脚本片段 |
| 宽 / 高 | `auto` / `100` / `100%` / `${w}` | 按钮尺寸 |
| 水平偏移 / 垂直偏移 / Z 轴偏移 | `0` / `8` / `${x}` | 只移动显示位置,不改变原本占位 |
| 内边距 / 外边距 | `8` / `8,8,8,8` | 四周留白 |
| 显示 | `true` / `false` / `${show}` | 控制是否显示 |
| 背景色 | `#FFFFFF` / `${color}` | 按钮背景 |
| 圆角 | `0` / `8` / `50%` | 背景圆角 |
| 旋转角度 | `0` / `15` / `${angle}` | 顺时针旋转角度 |
| 不透明度 | `0` 到 `1` | `1` 为完全不透明 |

按钮里的文字、字号、字色由子组件决定。

## 注意事项

:::tip 点击片段也是 JS
它能访问主 JS 顶层定义的变量、函数、Setting、Config。复杂逻辑放进主 JS 函数,按钮里只写 `increment()` 或 `await refreshData()` 这类调用。
:::

:::warning 点击也有运行时间上限
不要在「点击」里写大段代码或 `return`。异步逻辑可以写成主 JS 的 `async function`,再在按钮里用 `await 函数名()` 调用。
:::
