---
sidebar_position: 9
---

# 容器 Stack

容器把多个子组件**组合在一起**,有四种排列方式:

| 类型 | 排列 | 用途 |
|------|------|------|
| **vstack** | 竖排 ↕ | 标题 + 副标题、列表行 |
| **hstack** | 横排 ↔ | 图标 + 文字、左右对齐 |
| **zstack** | 叠放 ⊕ | 背景图 + 上层内容 |
| **tstack** | 富文本拼接 ✏️ | 一行字里多种字体 / 颜色 |

## 通用属性

| 属性 | 说明 |
|------|------|
| 子组件 | 内部任意组件,可嵌套 |
| 间距(spacing) | 子组件之间的距离 |
| 内边距(padding/pacings) | 容器内 4 方向边距,如 `10,10,10,10` |
| 对齐方式(alignment) | `center` / `leading` / `trailing` 等 |
| 背景色 / 圆角 | 容器整体背景 |
| 毛玻璃(material) | 模糊背景效果(`thick` / `thin` / `regular`) |
| 旋转 / 偏移 / 透明度 | 视觉调整 |
| 打开 URL (openUrl) | 整个容器作为可点区域,点了会打开 — 详见 [下方专门章节](#openurl) |

## openurl

所有 stack 容器(vstack / hstack / zstack / tstack / grid)都支持 **"打开 URL"属性**。
设置之后,**整个容器变成一个可点区域**;用户点了它,iOS 就会打开这个 URL。

:::info 为什么要在容器上、而不是 button 上?
[button 组件](./button.md) **只能跑 JS,不能打开 URL**(底层用的是 AppIntent,系统限制)。
所以"点击跳转"的需求统一靠 stack 容器实现。
:::

### 常见 URL

| 写法 | 行为 |
|------|------|
| `https://2f0.cn` | 打开网页 |
| `weixin://` | 打开微信 |
| `mailto:foo@bar.com` | 写邮件 |
| `awidget://runjs/medium/{Widget.id}` | 重新跑当前小组件的 JS |
| `awidget://openmini?...` | 打开微信小程序(系统会自动追加 `&from=omni`) |
| `${link}` | 由 JS 决定 |

### 例:做一个"按钮"

最简单的"按钮":一个 zstack + 文字 + 设置 openUrl

```
zstack (打开 URL: https://2f0.cn)
  └─ text  ("访问官网")
```

复杂一点:icon + 文字 + 圆角背景 + 跳转

```
hstack (背景色: 蓝色, 圆角: 10, 内边距: 10,10,15,15, 打开 URL: weixin://)
  ├─ icon  (message.fill, 白色)
  └─ text  ("打开微信", 白色)
```

## vstack — 竖排

最常用。子组件**自上而下**摆。

```
┌─────────┐
│  text 1  │
│  text 2  │  ← vstack
│  icon    │
└─────────┘
```

## hstack — 横排

子组件**自左到右**摆。配合 [spacer](./spacer.md) 实现"两端对齐"。

```
[ icon | text | spacer | button ]   ← hstack
```

## zstack — 叠放

子组件**层层叠**,后写的在上面。常用于:

- 背景图 + 文字
- 半透明遮罩
- 进度条(底色 + 进度色)

```
   ┌───────┐
   │  bg   │ ← 第一层(背景)
   │  txt  │ ← 第二层(在背景上)
   └───────┘
```

## tstack — 富文本拼接

跟前三种**完全不一样** — tstack **不是布局容器**,而是把多个 `text` 子组件
**拼成一段连贯的文字**(底层是 SwiftUI 的 `Text + Text`),
**每段可以有自己的字号 / 字体 / 颜色,但作为整体当成一段文本来排版换行**。

vstack / hstack 装文本是 **3 个独立的 Text 视图**,会换行 / 对齐独立处理;
tstack 装文本是 **1 段文字**,不会在中间换行,只在整段超长时整体折行。

### 子组件

只放 `text`(其它类型会被忽略)。**子组件之间没有分隔符**,要空格自己在 value 里加。

### 例:大数字 + 小单位

```
tstack:
  ├─ text  (内容: "32",  字号 36, 颜色 主色)
  └─ text  (内容: "°C",  字号 14, 颜色 灰色)
```

显示:**32**°C(数字大,单位小,贴在一起)。如果用 hstack,小字会单独居中,跟大数字隔得很开,不自然。

### 例:加粗一个词

```
tstack:
  ├─ text  (内容: "您有 ")
  ├─ text  (内容: "${count}", 字号大、颜色红)
  └─ text  (内容: " 条新消息")
```

显示:`您有 5 条新消息`,中间数字突出。

### 注意

- 想让两段文字之间**有空格**,就在 value 末尾或开头加空格,tstack 不会替你加
- 想要**换行单独显示** → 用 vstack,不要用 tstack
- tstack 内不能放 icon / image / 容器,只识别 text

## 容器也能做循环

任意容器(vstack / hstack / zstack / grid)都可以设置一个**循环数据源**,
让自己的内部组件按数组**重复 N 次**。详见 [循环 Loop](./loop.md)。

## 例:经典"图标 + 标题 + 副标题"卡片

```
hstack:
  ├─ icon (大尺寸)
  └─ vstack:
       ├─ text  ("标题")
       └─ text  ("副标题",字号小、灰色)
```

## 例:封面图 + 标题(zstack)

```
zstack:
  ├─ image (封面,撑满)
  └─ vstack:
       ├─ spacer
       └─ text ("标题",白色)
```

效果:文字浮在封面图底部。
