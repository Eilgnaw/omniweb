---
sidebar_position: 9
---

# 容器 Stack

Stack 把多个子组件组合成一套布局。先根据排列方向选择容器：

| 类型 | 排列方式 | 常见用途 |
| --- | --- | --- |
| `vstack` | 从上到下 | 标题与说明、纵向列表 |
| `hstack` | 从左到右 | 图标与文字、左右对齐 |
| `zstack` | 前后叠放 | 背景图、遮罩、叠层效果 |
| `tstack` | 拼成一段文字 | 同一行中混合字号、字体或颜色 |

## 常用属性

| 属性 | 作用 |
| --- | --- |
| 子组件 | 放入任意组件，也可以继续嵌套容器 |
| 间距 | 子组件之间的距离 |
| 内边距 | 容器四边留白，例如 `10,10,10,10` |
| 对齐 | `center`、`leading`、`trailing` 等 |
| 背景 / 圆角 | 设置容器整体的背景 |
| 毛玻璃 | `thick`、`thin` 或 `regular` 材质 |
| 旋转 / 偏移 / 不透明度 | 调整容器整体效果 |
| Blur / Scale Effect | 让整个容器及其子组件一起模糊、缩放或镜像；详见[视觉效果](./visual-effects.md) |
| 打开 URL | 让整个容器可点击 |

## 选择排列方式

### VStack：纵向排列

```text
vstack
├─ text（标题）
├─ text（副标题）
└─ icon
```

### HStack：横向排列

```text
hstack
├─ icon
├─ text
├─ spacer
└─ text
```

配合 [Spacer](./spacer.md) 可以把内容推到左右两侧。

### ZStack：前后叠放

子组件按顺序叠放，后面的内容显示在前面：

```text
zstack
├─ image（背景）
└─ text（前景）
```

适合背景图、半透明遮罩和由两层形状组成的进度条。

### TStack：拼接富文本

TStack 只接受 Text 子组件。它会把多段 Text 拼成一段连续文字，而不是把它们当作独立视图排列。

```text
tstack
├─ text（"32"，字号 36）
└─ text（"°C"，字号 14）
```

结果是一行紧密排列的 `32°C`，但两段可以使用不同样式。

使用 TStack 时注意：

- 段落之间不会自动加空格，需要在内容中自己保留。
- 只支持 Text；Icon、Image 和其他容器会被忽略。
- 需要分行或独立对齐时，请改用 VStack 或 HStack。

## 让容器可点击

给 `vstack`、`hstack`、`zstack`、`tstack` 或 `grid` 设置“打开 URL”，整个容器就会成为点击区域。

| URL | 点击后的行为 |
| --- | --- |
| `https://2f0.cn` | 打开网页 |
| `weixin://` | 打开微信 |
| `mailto:foo@bar.com` | 新建邮件 |
| `omniwidgets://runjs/medium/{Widget.id}` | 重新运行当前中号小组件的 JS |
| `omniwidgets://openmini?...` | 打开微信小程序 |
| `${link}` | 使用 JavaScript 提供的 URL |

`omniwidgets://` 与旧的 `awidget://` 行为相同，已有链接不需要修改。

### 示例：一个可跳转的按钮外观

```text
hstack（背景：蓝色；圆角：10；内边距：10；打开 URL：weixin://）
├─ icon（message.fill，白色）
└─ text（打开微信，白色）
```

:::info 跳转与运行代码是两件事
Stack 的“打开 URL”负责跳转。[Button](./button.md) 负责运行 JavaScript。先按用户点击后要发生的结果选择组件。
:::

## 让容器按数组重复

VStack、HStack、ZStack 和 Grid 都可以设置循环数据源，按数组重复内部布局。详见[循环 Loop](./loop.md)。

## 示例：图标、标题和副标题

```text
hstack
├─ icon
└─ vstack
   ├─ text（标题）
   └─ text（副标题，小号、灰色）
```

## 示例：封面图上的标题

```text
zstack
├─ image（填满容器）
└─ vstack
   ├─ spacer
   └─ text（标题，白色）
```
