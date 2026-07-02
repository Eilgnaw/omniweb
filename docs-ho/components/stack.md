---
sidebar_position: 4
---

# 容器 Stack / Row / Column

容器组件,把子节点按方向排列。一共 5 种类型,布局含义对齐 ArkUI / SwiftUI:

| 类型 | 方向 | 备注 |
|---|---|---|
| `Column` / `VStack` | 竖排(从上到下) | 互为别名 |
| `Row` / `HStack` | 横排(从左到右) | 互为别名 |
| `Stack` | 叠放(后加的盖上面) | 类似 ZStack |

## 用法

编辑器加任一容器,树面板里**把子组件拖进去**。子节点的顺序就是渲染顺序。

## 属性

容器自身没专属字段,共享一组布局 / 视觉属性 + 一个 `dataSource`(循环):

| 属性 | 类型 | 说明 |
|------|------|------|
| `dataSource` | string | 循环数据源,见下文「循环」 |
| `openUrl` | string | 点击容器时打开链接或 App,可写固定值或占位符 |
| `spacing` | number | Row / Column 的子节点间距,最小为 `0`;Stack 无间距字段 |
| `alignItems` / `justifyContent` / `alignContent` | enum | Row / Column / Stack 的对齐字段,按编辑器下拉选项填写 |
| `width` / `height` | length | `auto` / `100` / `100%` / `${w}` |
| `offsetX` / `offsetY` / `offsetZ` | length | 视觉偏移,不改变原本布局占位 |
| `padding` | padding4 | `8` 或 `8,8,8,8` |
| `backColor` | color | 背景 |
| `cornerRadius` | length | 圆角 |
| `opacity` | number | 0..1 |

## 打开链接 (`openUrl`) \{#openurl\}

横排 / 纵列 / 叠放 都可以直接设置 `openUrl`。用户点这个容器时,Omni 会拉起系统打开对应链接:

```
https://example.com/detail
app://com.example.targetapp
app://com.example.targetapp?ability=EntryAbility
app://com.example.targetapp?ability=EntryAbility&module=entry
${row.url}
app://com.huawei.hmos.clock?ability=com.huawei.hmos.clock.phone
hww://www.huawei.com
app://com.huawei.hmos.calendar?ability=MainAbility
```

把上面这类值填到容器的 `openUrl` 字段即可。

`app://包名` 会按包名打开已安装应用。只有目标应用需要指定入口时,再加 `?ability=...`;如果目标应用需要模块名,再加 `&module=...`。目标应用未安装或系统不允许跳转时不会打开。

这适合让一整块内容变成跳转区域。如果需要点击后执行 JS、写 `Config`、刷新数据或按条件决定跳转,仍然用 [按钮 Button](./button.md) 的 `click` 事件。

## 循环 (dataSource) \{#循环-datasource\}

容器的 `dataSource` 字段写 `{arr[item]}`,容器的**子节点会按数组展开**,每条 item 在一个新的 scope 里渲染:

JS:

```js
let rows = [
  { title: "苹果", price: 5 },
  { title: "香蕉", price: 3 },
  { title: "橘子", price: 4 },
]
```

容器配置:

- `dataSource`: `{rows[row]}`
- 子节点 1(文本 `Text`):`content` = `${row.title}`
- 子节点 2(文本 `Text`):`content` = `¥${row.price}`

渲染结果:

```
苹果   ¥5
香蕉   ¥3
橘子   ¥4
```

**嵌套循环**也支持(外层叫 `row`,内层用 `row.cells` 展开成 `cell`):

```
外层 纵列 (Column):
  dataSource = {rows[row]}
  ↳ 内层 横排 (Row):
     dataSource = {row.cells[cell]}
     ↳ 文本 (Text):  ${cell.text}
```

## 例:动态背景色按值高亮

JS:

```js
let rows = [
  { title: "A", score: 95, color: "#34C759" },
  { title: "B", score: 60, color: "#FF9500" },
  { title: "C", score: 30, color: "#FF3B30" },
]
```

外层 纵列(`Column`):`dataSource = {rows[row]}`,子节点 横排(`Row`):`backColor = ${row.color}`,文本(`Text`):`content = ${row.title} ${row.score}`。

## 注意事项

:::warning 单次循环上限 50
渲染端最多展开 50 条,超出截掉。**JS 里自己 `arr.slice(0, 50)` 控制更可靠**(超出的接口数据扔掉省内存)。
:::

:::tip 数组没准备好不挂
JS 还没出数据 / 路径写错,`dataSource` 解析不到数组就**不展开子节点**(容器渲染成空)。比挂掉好。
:::

:::tip 容器只负责链接跳转
`openUrl` 不会执行 JS 片段。想响应点击改状态,**把 横排 / 纵列 套进一个 按钮**(按钮也是容器)。详见 [按钮](./button.md)。
:::
