---
sidebar_position: 11
---

# 循环 Loop

循环让一套子组件按数组内容重复显示。它不是独立组件，而是 `vstack`、`hstack`、`zstack`、`grid` 等容器的能力。

## 三步完成一个列表

### 1. 用 JavaScript 准备数组

```js
this.items = [
  { name: "苹果", price: 5 },
  { name: "香蕉", price: 3 },
  { name: "橙子", price: 4 }
]
```

### 2. 给容器设置循环数据源

选中一个 `vstack`，在“循环数据源”里填写：

```text
${items[item]}
```

这表示“遍历 `items`，把当前项命名为 `item`”。

### 3. 在子组件里使用当前项

在 `vstack` 里放一个 `hstack`：

| 子组件 | 内容 |
| --- | --- |
| text | `${item.name}` |
| spacer | — |
| text | `¥${item.price}` |

结果：

```text
苹果       ¥5
香蕉       ¥3
橙子       ¥4
```

## 空数组

```js
this.items = []
```

数组为空时，容器仍然存在，但不会生成任何循环子组件。你不需要额外判断。

## 嵌套循环

每一层容器都可以使用自己的循环变量：

```js
this.groups = [
  { title: "水果", items: [{ name: "苹果" }, { name: "香蕉" }] },
  { title: "蔬菜", items: [{ name: "白菜" }, { name: "菠菜" }] }
]
```

```text
外层 vstack：${groups[group]}
├─ text：${group.title}
└─ 内层 vstack：${group.items[item]}
   └─ text：${item.name}
```

:::warning 不要把循环容器放进 Button
尽量不要把设置了循环数据源的 `vstack`、`hstack`、`zstack` 或 `grid` 放在 Button 里面。这种嵌套在部分小组件中可能无法显示。建议让 Button 只包含 `text`、`icon`、`image` 或其他不带循环的简单布局，并把循环容器放在 Button 外面。
:::

## 读取全局变量

循环内会优先读取循环变量。如果它与全局变量重名，用 `$.` 强制读取全局值：

```text
${item.name}  → 当前项的 name
${$.item}     → 全局的 this.item
```

更多规则见[占位符语法](../getting-started/placeholder.md)。

## 大数组与性能

循环会遍历完整数组，不再只显示前 50 项。例如，下面的数据可以用来制作包含闰年 366 天的进度网格：

```js
this.days = Array.from({ length: 366 }, (_, index) => ({
  index,
  completed: index < 120
}))
```

给 `grid` 设置循环数据源 `${days[day]}`，再用一个形状组件作为模板即可。

:::warning
iOS 分配给小组件的内存有限。数组越大，模板里的组件也会被重复越多次。制作大网格时请保持模板简单，避免在每一项中放置大图片、复杂视觉效果或另一层大循环。
:::

## 适合的场景

- 待办和日程列表
- 多日天气预报
- 年度进度和习惯打卡网格
- 股票、RSS 或消息摘要
- 配合 Grid 制作图标面板或照片墙
