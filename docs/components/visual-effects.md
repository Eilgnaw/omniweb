---
sidebar_position: 11
---

# 视觉效果

除 Spacer 外，所有组件都可以使用 Blur 和 Scale Effect。效果也可以应用到容器；应用到容器时，全部子组件会一起变化。

## Blur

| 属性 | 可用值 | 作用 |
| --- | --- | --- |
| Radius | `0` 到 `50`，或 `${变量}` | 高斯模糊半径；`0` 表示关闭 |
| Opaque | `true`、`false`，或 `${变量}` | 是否要求模糊结果保持完全不透明 |

`Opaque = false` 允许模糊边缘带透明度，适合让相邻图片自然衔接。`Opaque = true` 可以避免透明边缘，但接缝会更明确。

:::warning 模糊会增加小组件内存占用
优先对一个容器整体模糊，不要给大量 Grid 子项分别设置较大的 Radius。小组件扩展的内存有限，复杂布局请先在真机上测试。
:::

## Scale Effect

| 属性 | 默认值 | 作用 |
| --- | --- | --- |
| X | `1` | 横向倍率；负数会水平镜像 |
| Y | `1` | 纵向倍率；负数会垂直镜像 |
| Anchor | `center` | 缩放与镜像使用的锚点 |

Anchor 支持：

```text
center
leading / trailing / top / bottom
topLeading / topTrailing / bottomLeading / bottomTrailing
```

常用组合：

| 效果 | X | Y |
| --- | --- | --- |
| 水平镜像 | `-1` | `1` |
| 垂直镜像 | `1` | `-1` |
| 双向镜像 | `-1` | `-1` |
| 重置 | `1` | `1` |

Scale Effect 只改变绘制结果，不会改变组件在 Stack 中占用的尺寸。对容器使用负倍率时，里面的文字也会被镜像。

## 使用 JavaScript 变量

Blur 和 Scale Effect 的全部属性都支持占位符：

```js
this.blurRadius = 20
this.blurOpaque = false
this.scaleX = -1
this.scaleY = 1
this.scaleAnchor = "center"
```

在属性面板中设置：

| 属性 | 值 |
| --- | --- |
| Radius | `${blurRadius}` |
| Opaque | `${blurOpaque}` |
| X | `${scaleX}` |
| Y | `${scaleY}` |
| Anchor | `${scaleAnchor}` |

非法值会回退到安全默认值：Radius 使用 `0`，Opaque 使用 `false`，X/Y 使用 `1`，Anchor 使用 `center`。

## 示例：清晰封面衔接模糊背景

在宽 `338`、高 `158` 的中号组件中放一个 HStack：

```text
hstack（间距 -60）
├─ image（158 × 158，fill）
└─ image（240 × 158，fill；Radius 20；Opaque false；X -1；Y 1）
```

右图向左重叠 `60` 点，也就是模糊半径的三倍。透明的模糊边缘会落在清晰左图上，到了左图边界时已经过渡到稳定的模糊区域。

