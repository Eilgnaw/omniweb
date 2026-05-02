---
sidebar_position: 2
---

# 做出第一个小组件

跟着这一节走完,你会得到一个**显示当前天气**的中号小组件。

## 1. 新建小组件

打开 Omni → 首页右上角 `+` → 选 **中号** → 起个名字 → 进编辑器。

## 2. 搭一个简单布局

从编辑器右上角 ➕ 依次添加:

- 一个 **vstack**(竖排容器),作为根
- 在 vstack 里加一个 **icon**(SF 图标)
- 再加一个 **text**(文本)
- 再加一个 **text**(温度)

布局大概长这样:

```
┌─────────────┐
│   ☀ icon    │
│  晴 (text)   │
│  26°(text)   │
└─────────────┘
```

## 3. 写 JS 代码

点编辑器底部的 **`<>`(代码)**,粘贴以下代码:

```js
try {
    const result = await Weather.getCurrent()
    const obj = JSON.parse(result)

    this.icon = obj.symbolName                       // SF 图标名,比如 "sun.max"
    this.text = obj.condition                        // 状况,比如 "mostlyCloudy"
    this.temp = Math.trunc(obj.temperature.value)    // 温度,取整
} catch (error) {
    this.icon = "exclamationmark.triangle.fill"
    this.text = "错误"
    this.temp = "--"
    console.log(error)
}
```

点 **运行**。控制台没报错的话, `this.icon` / `this.text` / `this.temp` 都被赋值了。

## 4. 把 JS 数据绑定到组件

回到画布,点击每个组件,在它的"内容"字段填:

| 组件 | 内容字段填 |
|------|-----------|
| icon | `{icon}` |
| 第一个 text | `{text}` |
| 第二个 text | `{temp}°` |

`{xxx}` 就是占位符 — Omni 会自动把它替换成 JS 里的 `this.xxx` 的值。

:::tip 占位符的更多写法
- `{obj.name}` 直接读对象字段
- `{$.xxx}` 强制读全局
- `{rows[row]}` 给循环用

详见 [占位符语法](./placeholder.md)。
:::

## 5. 控制刷新频率

天气没必要一分钟刷一次。在 JS 的最后加一行:

```js
setUpdateFreq(30) // 建议系统 30 分钟后再刷
```

> ⚠️ 这只是"建议",最终由 iOS 决定真正的刷新时机。详见 [组件控制](../api/control.md)。

## 6. 保存 → 加到桌面

- 编辑器右上角点 **保存**。
- 退出 App,长按桌面 → 添加小组件 → 找到 **Omni 中号**(或对应类型) → 添加。
- 长按你刚加的小组件 → **编辑小组件** → 选你刚做的那个。

完成! 🎉

---

接下来推荐看:

- [占位符语法](./placeholder.md) — 让组件吃下复杂数据
- [循环 (loop)](../components/loop.md) — 渲染列表 / 数组
- [接口文档](../api/network.md) — 看看还能调什么
