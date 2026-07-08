---
sidebar_position: 4
---

# 容器

容器用来组织子组件。编辑器里有三种常用容器:

| 名称 | 排列方式 | 常见用途 |
|---|---|---|
| 纵列 | 从上到下排列 | 标题 + 内容 + 底部说明 |
| 横排 | 从左到右排列 | 图标 + 文本、左右两端对齐 |
| 层叠 | 子组件互相叠放 | 背景图上放文字、角标 |

## 用法

在编辑器底部点加号,添加 **纵列**、**横排** 或 **层叠**,再把子组件拖进去。子组件在树面板里的顺序就是显示顺序;层叠里后面的子组件会盖在前面的子组件上。

## 属性

| 字段 | 可填写 | 说明 |
|------|------|------|
| 数据源（循环） | `{rows[row]}` | 按数组重复渲染子组件 |
| 打开链接 | `https://...` / `OmniWidgets://...` / `${row.url}` | 点击整个容器时打开链接或应用 |
| 内间距 | `0` / `8` | 纵列、横排的子组件间距;层叠没有这个字段 |
| 水平对齐 | `start` / `center` / `end` | 纵列中子组件的横向位置 |
| 垂直分布 | `start` / `center` / `spaceBetween` | 纵列中子组件的纵向分布 |
| 垂直对齐 | `top` / `center` / `bottom` | 横排中子组件的纵向位置 |
| 水平分布 | `start` / `center` / `spaceBetween` | 横排中子组件的横向分布 |
| 对齐 | `topStart` / `center` / `bottomEnd` | 层叠中子组件的对齐位置 |
| 宽 / 高 | `auto` / `100` / `100%` / `${w}` | 容器尺寸 |
| 水平偏移 / 垂直偏移 / Z 轴偏移 | `0` / `8` / `${x}` | 只移动显示位置,不改变原本占位 |
| 内边距 / 外边距 | `8` / `8,8,8,8` | 四周留白 |
| 显示 | `true` / `false` / `${show}` | 控制是否显示 |
| 背景色 | `#FFFFFF` / `${color}` | 容器背景 |
| 圆角 | `0` / `8` / `50%` | 背景圆角 |
| 旋转角度 | `0` / `15` / `${angle}` | 顺时针旋转角度 |
| 不透明度 | `0` 到 `1` | `1` 为完全不透明 |

## 打开链接

纵列、横排、层叠都可以设置「打开链接」。用户点击容器时,Omni 会打开对应链接:

```text
https://example.com/detail
OmniWidgets://open-app/com.example.targetapp?ability=EntryAbility
OmniWidgets://open-app/com.example.targetapp?ability=EntryAbility&module=entry
${row.url}
OmniWidgets://open-app/com.huawei.hmos.clock?ability=com.huawei.hmos.clock.phone
hww://www.huawei.com
OmniWidgets://open-app/com.huawei.hmos.calendar?ability=MainAbility
```

把上面这类值填到「打开链接」字段即可。

`OmniWidgets://open-app/包名?ability=...` 会打开已安装应用的指定入口。如果目标应用需要模块名,再加 `&module=...`。目标应用未安装或系统不允许跳转时不会打开。旧版 `app://包名` 仍可兼容,但新卡片建议使用带 `ability` 的 `OmniWidgets://open-app/`。

如果需要点击后执行脚本、写入配置、刷新数据或按条件决定跳转,使用 [按钮](./button.md) 的「点击」字段。

## 循环

在「数据源（循环）」填 `{rows[row]}`,容器的子组件会按数组重复显示。每条数据都会得到一个临时名称,例如这里的 `row`。

JS:

```js
let rows = [
  { title: "苹果", price: 5 },
  { title: "香蕉", price: 3 },
  { title: "橘子", price: 4 },
]
```

容器配置:

| 位置 | 字段 | 填写 |
|---|---|---|
| 外层纵列 | 数据源（循环） | `{rows[row]}` |
| 子组件 1 文本 | 内容 | `${row.title}` |
| 子组件 2 文本 | 内容 | `¥${row.price}` |

显示结果:

```text
苹果   ¥5
香蕉   ¥3
橘子   ¥4
```

嵌套循环也支持。外层用 `row`,内层用 `cell`:

```text
外层纵列
  数据源（循环）: {rows[row]}
  里面放一个横排
    数据源（循环）: {row.cells[cell]}
    里面放文本: ${cell.text}
```

## 例:按值高亮背景

JS:

```js
let rows = [
  { title: "A", score: 95, color: "#34C759" },
  { title: "B", score: 60, color: "#FF9500" },
  { title: "C", score: 30, color: "#FF3B30" },
]
```

| 位置 | 字段 | 填写 |
|---|---|---|
| 外层纵列 | 数据源（循环） | `{rows[row]}` |
| 子组件横排 | 背景色 | `${row.color}` |
| 横排里的文本 | 内容 | `${row.title} ${row.score}` |

## 注意事项

:::warning 单次循环上限 50
渲染端最多展开 50 条,超出会被截掉。接口数据很多时,建议在 JS 里先 `arr.slice(0, 50)`。
:::

:::tip 数组没准备好会显示为空
JS 还没返回数据,或「数据源（循环）」路径写错时,容器不会展开子组件。
:::

:::tip 容器只负责链接跳转
「打开链接」不会执行脚本。想点击后改状态,把内容放进按钮里。
:::
