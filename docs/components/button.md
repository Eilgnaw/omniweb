---
sidebar_position: 5
---

# 按钮 Button

Button 在用户点击后运行一小段 JavaScript。适合切换状态、记录操作或触发 App Intent。

## 先判断该用哪一种点击

| 目标 | 使用 |
| --- | --- |
| 点击后运行 JavaScript | **Button** |
| 点击后打开网页或 App | 带“打开 URL”属性的 [Stack](./stack.md#让容器可点击) |

:::warning Button 不能直接打开 URL
Button 基于 App Intent，只负责运行代码。要跳转 URL，请让 `vstack`、`hstack`、`zstack`、`tstack` 或 `grid` 变成可点击容器。
:::

:::warning 系统限制
主屏幕小组件的 Button 需要 iOS 17 或更高版本。锁屏组件和实时活动不能放这种可点击 Button。
:::

## 最快用法

1. 添加 **button**。
2. 在 Button 里面放 `text`、`icon` 或 `image`，决定它的外观。
3. 在 Button 的“内容”里填写点击后运行的 JavaScript。

Button 代码运行完成后，Omni 会请求刷新小组件，让新状态显示出来。

:::warning 不要在 Button 里放循环容器
尽量不要把设置了循环数据源的 `vstack`、`hstack`、`zstack` 或 `grid` 放在 Button 里面。这种嵌套在部分小组件中可能无法显示。让 Button 只包含 `text`、`icon`、`image` 或其他不带循环的简单布局，并把循环容器放在 Button 外面。
:::

## 主 JS 与 Button 代码

| | 主 JS | Button 代码 |
| --- | --- | --- |
| 运行时机 | 小组件刷新时 | 用户点击时 |
| 主要用途 | 获取数据并设置 `this.xxx` | 修改状态或触发操作 |
| 建议长度 | 可以包含完整的数据流程 | 保持简短，通常几行 |

## 示例：切换收藏状态

主 JS 读取状态：

```js
this.icon = getValue("favorite") || "heart"
```

Button 内容切换状态：

```js
const current = getValue("favorite") || "heart"
setValue("favorite", current === "heart" ? "heart.fill" : "heart")
```

在 Button 里添加一个 Icon，把内容设为 `${icon}`。每次点击会在空心和实心爱心之间切换。

## 常用属性

| 属性 | 作用 |
| --- | --- |
| 子组件 | Button 显示的文字、图标或图片 |
| 内容 | 点击后执行的 JavaScript |
| 样式 | `plain` 无边框；`noflash` 不闪烁；`normal` 使用系统样式 |
| 背景 / 圆角 | 调整 Button 外观 |
