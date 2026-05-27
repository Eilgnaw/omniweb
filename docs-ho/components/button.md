---
sidebar_position: 5
---

# 按钮 Button

可点击的容器组件。文字、图标都通过**子节点**(文本 / 图标 / 图片)表达,按钮 自己只负责交互。

## 用法

编辑器加 **按钮**(`Button`),**把要显示的子组件拖进去**:

```
按钮 (Button)
 ├─ 图标 (Icon, glyph = "plus")
 └─ 文本 (Text, content = "添加")
```

然后在 按钮 的「点击」字段(`event.click`)写一段 JS 片段。用户点了之后,这段 JS 会被拼到主 JS 末尾一起跑,实现「响应点击 → 更新状态 → 卡片重渲」。

## 点击事件 (`click`)

最常用的 4 种姿势:

### 1. 刷新

```
click: refresh
```

直接重新执行卡片主 JS,通常配合 `Config.set` / `Shared.set` 拿到最新数据。

### 2. 改一个本地变量

```
click: counter = counter + 1
```

不要忘了配合 `Config.set` 持久化,不然下次刷新会丢:

```
click: counter = (counter || 0) + 1; Config.set("counter", counter)
```

### 3. 调一个函数

```
click: increment()
```

主 JS 里定义 `increment`:

```js
function increment() {
  const n = Config.get("counter", 0) + 1
  Config.set("counter", n)
}
```

### 4. 跳 URL

```
click: openUrl("https://example.com/x")
```

或带状态:

```
click: openUrl("myapp://detail?id=" + currentId)
```

### `$params`

如果你 按钮 有动态的点击参数(同一个 click 处理函数被多个按钮触发,需要区分),可以把参数序列化到 `$params`:

```js
// 多个 按钮 的 click 字段可以各填:
//   doAction({ kind: "incr" })
//   doAction({ kind: "reset" })

function doAction(p) {
  if (p.kind === "incr") { /* ... */ }
  if (p.kind === "reset") { /* ... */ }
}
```

但更常用是 Omni 主机侧已经把 click 路径下的参数注入到 `$params`(主刷新路径下永远是 `{}`)。详见 [`api/control#params`](../api/control.md#params)。

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `click` | event | 点击时执行的 JS 片段 |
| `width` / `height` / `padding` | | 同 Stack |
| `backColor` / `cornerRadius` / `opacity` | | 同 Stack |

> 按钮 内的文字 / 字号 / 字色直接由子节点(文本 / 图标)的属性决定,按钮自己不暴露字体相关字段。

## 注意事项

:::tip click 片段也是 JS
它会被拼到主 JS 末尾跑,所以**主 JS 顶层定义的变量、函数、Setting / Config 都能访问**。注意别在 click 片段里写 `return`(会污染包裹的 IIFE)。
:::

:::warning click 也走 4.5s 上限
click 片段里调 `Request` 这种异步逻辑,跟主 JS 共享 4.5s 预算。**点击立即跑接口要做好兜底**,网络慢会被砍。
:::
