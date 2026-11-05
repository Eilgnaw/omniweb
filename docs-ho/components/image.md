---
sidebar_position: 2
---

# 图片

图片可以显示网络资源、卡片沙盒文件，或 JavaScript 动态提供的地址。

## 先选择来源

| 资源 | 来源 |
| --- | --- |
| `https://example.com/x.png` | 网络图片 |
| `files/avatar.png` | 当前卡片的本地文件 |
| `${image}` | JavaScript 提供的网络或本地地址 |

## 属性

| 字段 | 常用填写 | 作用 |
| --- | --- | --- |
| 资源 | `https://...` / `files/a.png` / `${image}` | 图片地址 |
| 填充模式 | `fit` / `fill` / `cover` / `contain` / `none` / `scaleDown` | 控制图片如何适配宽高 |
| 宽 / 高、偏移、内外边距 | 数字、百分比或变量 | 通用布局字段 |
| 显示、背景色、圆角、旋转、不透明度 | 固定值或变量 | 通用视觉字段 |

## 示例：下载并缓存

```js
const filename = "avatar.png"
let image = "files/" + filename

if (!(await FileManager.exists(filename))) {
  try {
    const bytes = await new Request("https://example.com/avatar.png").fetch()
    image = await FileManager.write(filename, bytes)
  } catch (error) {
    console.error("图片下载失败：", error)
    image = ""
  }
}
```

把“资源”设为 `${image}`。

:::warning 本地图片必须以 `files/` 开头
`FileManager.write()` 会返回正确路径。不要删掉前缀，也不要把普通文件名直接填进“资源”。
:::

:::tip 卡片刷新时少下载大图
脚本只有 4.5 秒。体积较大的图片先在编辑器中运行一次完成缓存，卡片刷新时直接读取 `files/` 路径。
:::
