---
sidebar_position: 3
---

# 图标 Icon (SF Symbols)

显示一个 Apple SF Symbols 系统图标。无需联网、矢量缩放、和系统视觉一致。

## 用法

从编辑器右上角 ➕ 添加 **icon**,在"内容"字段填 SF Symbol 名字:

| 内容 | 显示 |
|------|------|
| `sun.max` | ☀ |
| `cloud.rain` | 🌧 |
| `heart.fill` | ♥ |
| `{icon}` | 由 JS 决定 |

编辑器内置 SF Symbols 选择器(在 icon 组件的属性面板),不用自己背名字。

完整图标库参考 [Apple SF Symbols](https://developer.apple.com/sf-symbols/)(选了之后用图标的英文名)。

## 常用属性

| 属性 | 说明 |
|------|------|
| 内容 | SF Symbol 名(例 `bolt.fill`) |
| 宽 / 高 | 显示尺寸 |
| 颜色 | 单色 / 渐变 |
| 旋转 / 偏移 | 特效 |
| 透明度 | 0~1 |

## 例:根据天气状况切图标

```js
const result = await Weather.getCurrent()
const obj = JSON.parse(result)
this.icon = obj.symbolName    // Apple 直接给好了 SF Symbol 名
```

icon 组件内容填 `{icon}`,会自动显示对应天气图标。

:::tip 锁屏组件
锁屏的圆形 / 矩形 / 内联组件**只能显示单色**,SF Symbol 在这里特别合适。
:::
