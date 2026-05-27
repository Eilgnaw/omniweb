---
sidebar_position: 1
---

# 文本 Text

最常用的组件,显示一段文字。

## 用法

编辑器底部点 ➕ → 添加 **文本**(`Text`),在「内容」字段填要显示的文字。可以是固定文字、占位符,或者两者混合。

| 内容字段写 | 显示效果 |
|------------|---------|
| `Hello` | Hello |
| `${name}` | 显示 JS 顶层变量 `name` 的值 |
| `你好 ${name},今天 ${temp}°` | 你好 Alice,今天 26° |

占位符语法详见 [占位符语法](../getting-started/placeholder.md)。

## 属性

| 属性 (`attrs` key) | 类型 | 说明 |
|------|------|------|
| `content` | string | 显示的文字 / 占位符(支持 `${...}` 和混排) |
| `fontSize` | length | 字号,可写固定数字 `14` 或占位 `${size}` |
| `fontWeight` | enum | `normal` / `bold` / `medium` / `bolder` / `lighter` / `regular` |
| `fontName` | enum | 系统字体名(见编辑器下拉选项) |
| `forColor` | color | 文字色,`#000` 或 `${c}` |
| `width` | length | `auto` / `100` / `100%` / `${w}` |
| `height` | length | 同 width |
| `padding` | padding4 | `8` 或 `8,8,8,8` |
| `backColor` | color | 背景色 |
| `cornerRadius` | length | 圆角 |
| `opacity` | number | 0..1 |

## 例:展示一行 JS 数据

```js
let title = "未读"
let count = 12
```

| 组件 | content 填 |
|------|-----------|
| Text | `${title}` |
| Text | `${count}` |
| Text(混) | `${title}: ${count} 条` |

## 例:动态字号

字号字段填 `${size}`,JS 给个数:

```js
let size = 24       // 整段占位,保留 number 类型
```

:::tip 整段 vs 混排
`fontSize: ${size}` 是「整段」,拿到的是 number;`fontSize: ${size}px` 是「混排」,会变字符串,**别这么写**。详见 [占位符语法](../getting-started/placeholder.md#一-普通占位符)。
:::
