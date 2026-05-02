---
sidebar_position: 5
---

# 按钮 Button

可点击的组件,点击后**执行一段 JS 代码**。

:::warning 不支持打开 URL
**button 只能跑 JS,不能直接打开 URL**(底层是 AppIntent,系统限制)。
要做"点击跳转"的效果,把 [stack 容器](./stack.md) 当作按钮用 — vstack / hstack / zstack / tstack / grid 都有"打开 URL"属性,容器整体就是可点区域。
:::

:::warning 平台限制
桌面小组件按钮要 **iOS 17+** 才能用。锁屏组件、灵动岛组件目前不能放可点按钮(系统限制)。
:::

## 用法

从编辑器右上角 ➕ 添加 **button**,在它内部可以放任意子组件(text / icon / image),作为按钮的"长相"。
然后在按钮的属性里写要执行的 JS 代码。

## 常用属性

| 属性 | 说明 |
|------|------|
| 内部子组件 | 按钮的视觉(文字、图标等) |
| 内容(JS 代码) | 点击时执行的 JS 片段 |
| 样式 | plain(无边框) / noflash(不闪) / normal(系统按钮) |
| 背景 / 圆角 | 视觉调整 |

## 按钮代码 vs 主 JS

| | 主 JS | 按钮代码 |
|---|------|---------|
| 何时跑 | 小组件**刷新**时 | 用户**点击**按钮时 |
| 用来 | 读数据 / 拉接口,把结果赋给 `this.xxx` | 改本地状态 / 触发动作 |
| 长度 | 通常较长 | 一般几行 |

按钮代码跑完,Omni 会自动刷一下小组件让新状态生效。

## 例:点击切换"已点赞"状态

主 JS:
```js
this.state = getValue("liked") || "heart"
```

按钮代码:
```js
const cur = getValue("liked") || "heart"
setValue("liked", cur === "heart" ? "heart.fill" : "heart")
```

按钮里放一个 icon,内容填 `{state}` —— 每次点击图标在"♡"和"❤"之间切换。

## 想"点击跳转 URL"怎么办?

不要用 button — 用一个 stack 容器代替:

```
zstack (打开 URL: https://2f0.cn)
  └─ text  ("打开网页")
```

或者跳第三方 App:

```
hstack (打开 URL: weixin://)
  ├─ icon  (message.fill)
  └─ text  ("打开微信")
```

详见 [stack.md → 打开 URL](./stack.md#openurl)。
