---
sidebar_position: 3
---

# 占位符语法

占位符把 JavaScript 的结果放进组件属性。大多数时候，只需要记住一种写法：

```text
${变量名}
```

:::tip 旧模板仍然可用
旧的 `{变量名}` 会在保存时转换为 `${变量名}`。新模板统一使用 `${...}`。
:::

## 显示一个变量

JavaScript：

```js
this.title = "今日天气"
this.temperature = 26
```

组件内容：

```text
${title}
当前 ${temperature}°
```

一段文字里可以同时使用固定文字和多个占位符。

## 读取对象或数组里的值

```js
this.user = {
  name: "Alice",
  badges: ["VIP", "新人"]
}
```

```text
${user.name}       → Alice
${user.badges[0]}  → VIP
```

点号和数组下标可以继续嵌套，例如 `${forecast[0].temperature.value}`。

## 在容器里循环数组

循环数据源的写法与普通占位符不同：

```js
this.rows = [
  { name: "苹果", price: 5 },
  { name: "香蕉", price: 3 }
]
```

在容器的“循环数据源”里填写：

```text
${rows[row]}
```

这表示“遍历 `rows`，并把当前项命名为 `row`”。容器里的子组件可以使用：

```text
${row.name}
¥${row.price}
```

嵌套循环也可以沿用外层变量：

```text
外层数据源：${rows[row]}
内层数据源：${row.cells[cell]}
内层组件：${cell.text}
```

完整示例见[循环 Loop](../components/loop.md)。

## 什么时候使用 `${$.name}`？

`$.` 表示“忽略当前循环变量，直接读取最外层变量”。只有循环变量与全局变量重名时才需要它。

```js
this.row = "全局值"
this.rows = [{ name: "第一项" }]
```

在 `${rows[row]}` 的循环内部：

```text
${row.name}  → 第一项
${$.row}     → 全局值
```

## 内容为空时怎么检查？

找不到变量或路径时，Omni 会显示空字符串，不会报错。按这个顺序检查：

1. 重新运行 JavaScript。
2. 用 `console.log` 确认变量不是 `undefined`。
3. 检查大小写、点号和数组下标。
4. 确认普通组件没有误用循环数据源写法。

## 速查

| 写法 | 用途 |
| --- | --- |
| `${name}` | 读取 `this.name` |
| `你好，${name}` | 在文字中插入变量 |
| `${user.name}` | 读取对象字段 |
| `${list[0]}` | 读取数组项 |
| `${a.b[2].c}` | 读取嵌套路径 |
| `${rows[row]}` | 在容器的循环数据源里遍历数组 |
| `${row.name}` | 在循环内部读取当前项 |
| `${$.name}` | 在循环内部强制读取全局变量 |
