---
sidebar_position: 4
---

# 容器 Stack / Row / Column

容器组件,把子节点按方向排列。一共 5 种类型,布局含义对齐 ArkUI / SwiftUI:

| 类型 | 方向 | 备注 |
|---|---|---|
| `Column` / `VStack` | 竖排(从上到下) | 互为别名 |
| `Row` / `HStack` | 横排(从左到右) | 互为别名 |
| `Stack` | 叠放(后加的盖上面) | 类似 ZStack |

## 用法

编辑器加任一容器,树面板里**把子组件拖进去**。子节点的顺序就是渲染顺序。

## 属性

容器自身没专属字段,共享一组布局 / 视觉属性 + 一个 `dataSource`(循环):

| 属性 | 类型 | 说明 |
|------|------|------|
| `dataSource` | string | 循环数据源,见下文「循环」 |
| `width` / `height` | length | `auto` / `100` / `100%` / `${w}` |
| `padding` | padding4 | `8` 或 `8,8,8,8` |
| `backColor` | color | 背景 |
| `cornerRadius` | length | 圆角 |
| `opacity` | number | 0..1 |

## 循环 (dataSource) \{#循环-datasource\}

容器的 `dataSource` 字段写 `{arr[item]}`,容器的**子节点会按数组展开**,每条 item 在一个新的 scope 里渲染:

JS:

```js
let rows = [
  { title: "苹果", price: 5 },
  { title: "香蕉", price: 3 },
  { title: "橘子", price: 4 },
]
```

容器配置:

- `dataSource`: `{rows[row]}`
- 子节点 1(文本 `Text`):`content` = `${row.title}`
- 子节点 2(文本 `Text`):`content` = `¥${row.price}`

渲染结果:

```
苹果   ¥5
香蕉   ¥3
橘子   ¥4
```

**嵌套循环**也支持(外层叫 `row`,内层用 `row.cells` 展开成 `cell`):

```
外层 纵列 (Column):
  dataSource = {rows[row]}
  ↳ 内层 横排 (Row):
     dataSource = {row.cells[cell]}
     ↳ 文本 (Text):  ${cell.text}
```

## 例:动态背景色按值高亮

JS:

```js
let rows = [
  { title: "A", score: 95, color: "#34C759" },
  { title: "B", score: 60, color: "#FF9500" },
  { title: "C", score: 30, color: "#FF3B30" },
]
```

外层 纵列(`Column`):`dataSource = {rows[row]}`,子节点 横排(`Row`):`backColor = ${row.color}`,文本(`Text`):`content = ${row.title} ${row.score}`。

## 注意事项

:::warning 单次循环上限 50
渲染端最多展开 50 条,超出截掉。**JS 里自己 `arr.slice(0, 50)` 控制更可靠**(超出的接口数据扔掉省内存)。
:::

:::tip 数组没准备好不挂
JS 还没出数据 / 路径写错,`dataSource` 解析不到数组就**不展开子节点**(容器渲染成空)。比挂掉好。
:::

:::warning 容器没有 click 事件
想要响应点击,**把 横排 / 纵列 套进一个 按钮**(按钮也是容器)。详见 [按钮](./button.md)。
:::
