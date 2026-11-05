---
sidebar_position: 3
---

# 占位符语法

鸿蒙版有两种容易混淆的写法：

| 写法 | 用途 | 写在哪里 |
| --- | --- | --- |
| `${name}` / `${user.name}` | 读取普通值 | 任意组件字段 |
| `{rows[row]}` | 遍历数组 | 容器的“数据源（循环）”字段 |

## 显示一个变量

```js
let title = "今日天气"
let count = 42
```

```text
${title}            → 今日天气
共 ${count} 条      → 共 42 条
```

## 读取对象或数组

```js
let user = {
  name: "Alice",
  badges: ["VIP", "新人"]
}
```

```text
${user.name}       → Alice
${user.badges.0}   → VIP
```

鸿蒙版数组索引也使用点号，例如 `${list.0}`、`${a.b.2.c}`。

## 整段绑定会保留类型

- 字段只写 `${size}`：保留 JavaScript 数字类型。
- 写成 `字号 ${size}` 或 `${size}px`：结果是字符串。

需要给字号、间距、宽高或布尔字段传变量时，优先使用整段绑定。

## 循环数组

```js
let rows = [
  { title: "苹果", price: 5 },
  { title: "香蕉", price: 3 }
]
```

在纵列、横排、层叠、网格或列表的“数据源（循环）”中填写：

```text
{rows[row]}
```

子组件使用：

```text
${row.title}
¥${row.price}
```

嵌套循环：

```text
外层：{rows[row]}
内层：{row.cells[cell]}
子组件：${cell.text}
```

:::warning 每次最多展开 50 条
超过部分会被截断。数据很多时，先在 JavaScript 中使用 `slice(0, 50)`。
:::

## 内容为空时怎么检查？

找不到变量或路径时，Omni 会显示空字符串，不会报错。按顺序检查：

1. 重新运行 JavaScript。
2. `console.log` 确认变量不是 `undefined`。
3. 检查大小写和点号路径。
4. 确认循环字段使用 `{rows[row]}`，而不是 `${rows[row]}`。

## 速查

| 写法 | 作用 |
| --- | --- |
| `${name}` | 读取顶层 `name` |
| `你好，${name}` | 在文字中插入变量 |
| `${user.name}` | 读取对象字段 |
| `${list.0}` | 读取数组项 |
| `${a.b.2.c}` | 读取嵌套路径 |
| `{rows[row]}` | 在“数据源（循环）”中遍历数组 |
| `${row.title}` | 在循环中读取当前项 |
