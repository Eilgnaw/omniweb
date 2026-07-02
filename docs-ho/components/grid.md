---
sidebar_position: 6
---

# 网格 Grid

按行 / 列规整排列子节点。

:::info 实现细节
鸿蒙卡片不支持原生 `Grid` / `GridItem`(白名单外),Omni 内部用 `Column` + `Row` 切片模拟。视觉行为一致,但**性能不如 ArkUI 的 LazyForEach**,长列表(>50 条)别用 Grid,直接用 Column + dataSource。
:::

## 属性

| 属性 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `direction` | enum | `horizontal` | `horizontal`(先 → 后 ↓) / `vertical`(先 ↓ 后 →) |
| `columns` | number | `3` | `horizontal` 时:**列数**;`vertical` 时:**每列条目数** |
| `spacing` | number | `0` | 行 / 列间距,最小为 `0` |
| `dataSource` | string | | 循环数据源,语法同 [Stack](./stack.md#循环-datasource) |
| `width` / `height` / `offsetX` / `offsetY` / `offsetZ` / `padding` / `backColor` / `cornerRadius` / `opacity` | | | 同 Stack |

## 例:横向 3 列网格

JS:

```js
let items = [
  { name: "音乐", icon: "music" },
  { name: "相机", icon: "camera" },
  { name: "记事", icon: "note" },
  { name: "天气", icon: "cloud" },
  { name: "时钟", icon: "clock" },
  { name: "设置", icon: "gear" },
]
```

网格 配置:
- `direction`: `horizontal`
- `columns`: `3`
- `spacing`: `8`
- `dataSource`: `{items[item]}`

子节点(一个 纵列,作为「格子」):
```
纵列 (Column)
 ├─ 图标 (Icon, glyph = ${item.icon}, fontSize = 24)
 └─ 文本 (Text, content = ${item.name}, fontSize = 12)
```

## 例:垂直方向

`direction = vertical`,`columns = 4`:数据先填第一列 4 个,再第二列 4 个……

## 注意事项

:::warning 别滥用 网格
- **长列表**(>50)用 纵列 + dataSource,网格 本身没有 lazy,全展开后掉帧
- **不规则布局**直接 横排 / 纵列 嵌套,网格 是「固定行列」场景的快捷写法
:::

:::tip dataSource 和子节点的关系
网格 的 child 数组就是「**每个格子的模板**」 —— 通常 1 个根 child(纵列 / 图标 + 文字)。数据源决定有多少个格子,模板复用。
:::
