---
sidebar_position: 3
---

# 占位符语法

占位符是把 JS 数据**塞进组件**的桥。两套语法,分清楚用在哪:

| 语法 | 用途 | 写在哪 |
|---|---|---|
| `${var}` / `${a.b.c}` | 普通值占位 | 任意组件属性(content / fontSize / forColor / src / width / ...) |
| `{arr[row]}` | 数组循环 | **容器的 `dataSource` 字段**(只在这一处生效) |

## 一、`${...}` 普通占位符

### 基础:`${变量名}`

JS 里写:

```js
let title = "你好"
let count = 42
```

组件字段写:

```
${title}                  → 显示: 你好
你有 ${count} 条新消息    → 显示: 你有 42 条新消息
```

### `${对象.字段}` 点号路径

变量是对象 / 数组就用点号深入:

```js
let user = {
  name: "Alice",
  badges: ["VIP", "新人"]
}
```

```
${user.name}        → Alice
${user.badges.0}    → VIP    (数组索引也用 . 分隔)
```

任意嵌套都行:`${a.b.0.c.d}`。

### 整段 vs 混排,类型保留

- **整段**(`${var}` 单独成段)→ 保留 JS 原始类型。`fontSize` 字段填 `${size}`,JS 里 `let size = 18`(number),最终 ArkUI 拿到的就是 number 18,不是字符串 "18"
- **混排**(`${var}` 跟其它字符拼)→ 永远输出字符串。`你好 ${name}!` 始终是 string

:::tip 为什么这个细节重要
`fontSize: '18'` 跟 `fontSize: 18` 在 ArkUI 里行为不同(前者会被当 px 字符串)。如果你的字号 / 间距 / 圆角字段填占位符,**写「整段」`${size}` 不要写「混排」`${size}px`**。
:::

## 二、`{rows[row]}` 数组循环

只在 **`Column` / `Row` / `Stack` / `VStack` / `HStack` / `Grid` 的 `dataSource` 字段**里有效。意思:**遍历某个数组,把每一项命名成一个变量**,然后子组件就能用这个变量。

JS:

```js
let rows = [
  { title: "苹果", price: 5 },
  { title: "香蕉", price: 3 },
  { title: "橘子", price: 4 },
]
```

容器的 `dataSource` 字段填:

```
{rows[row]}
```

意思 —— 遍历 `rows`,每一项叫 `row`。子组件里:

```
${row.title}     → 苹果 / 香蕉 / 橘子
${row.price}     → 5 / 3 / 4
```

嵌套循环也成:

```
外层 dataSource: {rows[row]}
内层 dataSource: {row.cells[cell]}    ← 用外层的 row 的 cells 字段
内层组件:        ${cell.text}
```

:::warning 单次循环上限 50
为防 JS 误产巨大数组打挂卡片,渲染端**最多展开 50 条**。超出部分会被截掉。如果你确实需要长列表,自己在 JS 里 `slice(0, 50)`。
:::

## 三、取不到值会怎样?

- 占位符**不存在** → 替换为空字符串 `""`,不报错
- 写错路径 → 同上,显示空白。用 `console.log(JSON.stringify(变量))` 自查
- `dataSource` 数组没准备好(JS 还没出 / 路径错) → **不展开子节点,容器是空的**(总比挂掉好)

## 速查表

| 写法 | 含义 |
|------|------|
| `${name}` | 读顶层 `name` |
| `${user.name}` | 读 `user.name` |
| `${list.0}` | 读 `list[0]` |
| `${a.b.2.c}` | 任意嵌套 |
| `文字 ${x} 文字` | 一段里可混多个,输出字符串 |
| `{rows[row]}` | **容器 dataSource 专用**:遍历 `rows`,每项叫 `row` |
