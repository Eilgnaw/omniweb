---
sidebar_position: 2
---

# 图片 Image

显示一张图片。来源 3 种:**网络 URL** / **本地沙盒文件**(`files/xxx.png`)/ **占位符变量**。

## 用法

编辑器加 **图片**(`Image`),「资源」字段(`src`)填:

| 资源字段写 | 来源 |
|---|---|
| `https://example.com/x.png` | 网络 |
| `files/avatar.png` | 沙盒,见 [`FileManager`](../api/fileManager.md) |
| `${img}` | JS 顶层变量,值可以是上面任一种 |

## 属性

| 属性 (`attrs` key) | 类型 | 说明 |
|------|------|------|
| `src` | string | 资源路径,见上 |
| `contentMode` | enum | `fit` / `fill` / `cover` / `contain` / `none` / `scaleDown` |
| `width` / `height` | length | 同 Text |
| `padding` | padding4 | 同 Text |
| `backColor` | color | 默认透明 |
| `cornerRadius` | length | 圆角(裁掉超出部分) |
| `opacity` | number | 0..1 |

## 例:下载并展示

```js
const url = "https://example.com/today.png"
let img = "files/today.png"

if (!(await FileManager.exists("today.png"))) {
  try {
    const bytes = await new Request(url).fetch()
    img = await FileManager.write("today.png", bytes)
    // img === "files/today.png"
  } catch (e) {
    console.error("图片下载失败:", e.message)
    img = ""
  }
}
```

Image 组件 `src` 字段填 `${img}`。

## 例:动态切图

```js
let img = (Device.locale.startsWith("zh"))
  ? "files/banner_zh.png"
  : "files/banner_en.png"
```

## 注意事项

:::warning 本地图片必须带 `files/` 前缀
卡片侧 Image 渲染本地文件靠 `files/` 前缀触发 fd 注入。**省掉前缀直接写 `"x.png"` 渲染不出**。`FileManager.write` 返回的是 canonical 形式,别手动剥。
:::

:::tip 资源解析顺序
`src` 字段先看是不是 `${...}` 整段占位 → 解析后按 `https://` 或 `files/` 前缀路由。混排(`https://x.com/${id}.png`)也支持,**只在最终字符串里看头部前缀决定走哪种加载方式**。
:::

:::warning 别在卡片刷新里下大图
卡片侧 4.5s 上限。大图建议在主 App 编辑器里手动跑一次缓存好,卡片刷新直接用 `files/` 路径。
:::
