---
sidebar_position: 4
---

# 容器

容器把多个子组件组织成一套布局。先根据排列方向选择：

| 容器 | 排列方式 | 常见用途 |
| --- | --- | --- |
| 纵列 | 从上到下 | 标题、内容、说明 |
| 横排 | 从左到右 | 图标加文字、两端对齐 |
| 层叠 | 前后重叠 | 背景图、角标、遮罩 |

## 最快用法

添加纵列、横排或层叠，再把子组件拖进去。树中的顺序就是显示顺序；层叠中后面的组件盖在前面。

## 布局属性

| 字段 | 适用 | 作用 |
| --- | --- | --- |
| 内间距 | 纵列、横排 | 子组件之间的距离 |
| 水平对齐 | 纵列 | `start` / `center` / `end` |
| 垂直分布 | 纵列 | `start`、`center`、`spaceBetween` 等 |
| 垂直对齐 | 横排 | `top` / `center` / `bottom` |
| 水平分布 | 横排 | `start`、`center`、`spaceBetween` 等 |
| 对齐 | 层叠 | `topStart`、`center`、`bottomEnd` 等 |
| 数据源（循环） | 全部 | 按数组重复内部模板 |
| 打开链接 | 全部 | 点击整个容器后跳转 |
| 宽 / 高、偏移、内外边距 | 全部 | 通用布局字段 |
| 显示、背景色、圆角、旋转、不透明度 | 全部 | 通用视觉字段 |

## 让整个容器可点击

在“打开链接”中填写：

```text
https://example.com
OmniWidgets://open-app/com.example.app?ability=EntryAbility
OmniWidgets://open-app/com.example.app?ability=EntryAbility&module=entry
${row.url}
```

打开指定应用需要包名和 `ability`；只有目标应用要求模块名时才添加 `module`。目标不存在或系统不允许跳转时，不会打开。

要点击后运行代码、修改配置或按条件处理，请使用[按钮](./button.md)。

## 按数组重复布局

JavaScript：

```js
let rows = [
  { title: "苹果", price: 5 },
  { title: "香蕉", price: 3 },
  { title: "橘子", price: 4 }
]
```

纵列设置：

| 位置 | 字段 | 填写 |
| --- | --- | --- |
| 外层纵列 | 数据源（循环） | `{rows[row]}` |
| 子文字 1 | 内容 | `${row.title}` |
| 子文字 2 | 内容 | `¥${row.price}` |

嵌套循环可以让内层继续读取外层项：

```text
外层纵列：{rows[row]}
└─ 内层横排：{row.cells[cell]}
   └─ 文字：${cell.text}
```

:::warning 每次最多展开 50 条
超出部分会截断。数组不存在或路径错误时，容器保留，但不会生成循环子组件。
:::
