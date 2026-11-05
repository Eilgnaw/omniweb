---
sidebar_position: 10
---

# 网格 Grid

Grid 按固定列数排列内容，并在一行放满后自动换行。适合图标面板、照片墙和多日预报。

## 最快用法

1. 添加 **grid**。
2. 设置“列数”。
3. 添加要排列的子组件。

例如，`columns = 3` 且有 7 项时：

```text
1  2  3
4  5  6
7
```

## 常用属性

| 属性 | 作用 |
| --- | --- |
| 列数 | 每行显示几项 |
| 间距 | 网格项之间的距离 |
| 对齐 | 最后一行未填满时的排列方式 |
| 内边距 / 背景 / 圆角 | 调整整个网格容器 |

## 示例：两列天气图标

JavaScript：

```js
this.items = [
  { icon: "sun.max", label: "晴" },
  { icon: "cloud", label: "阴" },
  { icon: "cloud.rain", label: "雨" },
  { icon: "snow", label: "雪" }
]
```

Grid 设置：

- 列数：`2`
- 循环数据源：`${items[item]}`
- 子组件：一个 `vstack`，里面放 `${item.icon}` 和 `${item.label}`

这样只需设计一个网格项，Omni 会根据数组长度重复它。循环规则见[循环 Loop](./loop.md)。
