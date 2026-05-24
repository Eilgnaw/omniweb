---
sidebar_position: 3
---

# 图标 Icon

显示一个内置 glyph 或 emoji。Icon 接受三种来源:

- 内置 glyph 名(见 `render/IconGlyphs.ts`,如 `star` / `heart` / `bell`)
- **Emoji 字符**(`🌞` / `❤️`),直接用 Unicode 渲染,跨设备一致
- 占位符 `${name}`

## 用法

编辑器加 **图标**(`Icon`),「图标」字段(`glyph`)填:

| glyph 字段写 | 渲染 |
|---|---|
| `star` | 内置星形 glyph |
| `heart` | 内置心形 glyph |
| `🌞` | emoji 太阳 |
| `${icon}` | JS 顶层变量,值可以是上面任一种 |

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `glyph` | string | glyph 名 / emoji / `${...}` |
| `fontSize` | length | 大小,如 `24` 或 `${size}` |
| `forColor` | color | 前景色,只对内置 glyph 生效;emoji 走系统色彩 |
| `width` / `height` / `padding` / `backColor` / `cornerRadius` / `opacity` | | 同 Text |

## 例:按状态切图标

```js
const obj = await new Request("https://api.example.com/health").fetchJSON()

let icon  = obj.ok ? "checkmark" : "exclamationmark"
let color = obj.ok ? "#34C759"   : "#FF3B30"
```

Icon 组件:`glyph = ${icon}`,`forColor = ${color}`。

## 注意事项

:::tip 找不到 glyph 名怎么办
不在内置表里的名字会渲染成空白(不报错)。要兜底用 emoji —— emoji 是 Unicode 字符,所有设备都能渲染:

```js
let icon = (knownGlyph(obj.kind)) ? obj.kind : "❓"
```
:::

:::warning emoji 不响应 forColor
emoji 字符的颜色由系统字体决定,你设 `forColor` 没用。**只有内置 glyph 才能换色**。
:::
