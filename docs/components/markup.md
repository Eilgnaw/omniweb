---
sidebar_position: 13
---

# AWidget Markup（AWML）

:::warning 当前版本暂未开放
App Store 版本暂时关闭布局源码编辑和相关 MCP 接口。你现在不需要学习或使用 AWML；已有小组件会继续使用已保存的原生布局。
:::

本页保留为后续开放时的技术参考。AWML 用 XML 风格标签描述原生小组件布局，JavaScript 继续负责提供变量。

## 核心结构

每份源码只有一个 `<widget>` 根节点，`type` 必须与当前小组件类型一致：

```xml
<widget version="1" type="medium">
  <vstack width="0" height="0" alignment="leading" spacing="8" padding="16">
    <text width="0" height="0" font-size="16">${city}</text>
    <text width="0" height="0" font-size="32" color="#FFB800">${temperature}°</text>
  </vstack>
</widget>
```

JavaScript 在独立编辑器中提供变量：

```js
this.city = "杭州"
this.temperature = 26
```

未填写宽高时默认 24；`0` 表示自动尺寸。需要铺满背景时，使用根 `zstack`、背景 Shape 和独立内容容器。

## 编辑与保存行为

- 有效源码会更新预览，也会随小组件保存和导出。
- 源码错误时保留草稿和最后一次有效预览，并暂停可视化写入和保存。
- 点击诊断可以跳到错误行；修复后恢复同步。
- 可视化修改会更新源码，同时尽量保留未修改节点的格式和注释。
- 草稿只保存在当前设备。
- 源码编辑器使用与 JavaScript 编辑器相同的主题、行号、换行、撤销和重做能力。

## 支持的标签

`text`、`icon`、`image`、`date`、`vstack`、`hstack`、`zstack`、`tstack`、`grid`、`hgrid`、`shape`、`spacer`、`button`、`gauge`、`canvas`。

布局与动作行为沿用对应的原生组件。`button` 的 `value` 仍然是点击后执行的代码。

## 基本语法

- 所有标签必须闭合，属性值必须加引号。
- 空节点可以写成 `<icon value="sun.max.fill" />`。
- Text 的标签内容保留空格和换行；其他组件使用 `value` 属性。
- `&` 和 `<` 必须写成 `&amp;` 和 `&lt;`。
- 缺少 `id` 时会自动生成；空 ID 或重复 ID 会报错。新增节点不要复制已有 ID。
- 不支持 HTML、CSS、DOM、`script`、DTD 或自定义实体。

## 常用属性

| 属性 | 作用 |
| --- | --- |
| `name`、`value` | 编辑名称和组件内容 |
| `width`、`height` | 数字尺寸 |
| `font-size`、`font-name` | 字号和字体 |
| `color`、`background` | 单色或深浅色值，例如 `#FF0000`、`000000\|ffffff` |
| `padding`、`insets`、`spacing` | 整体留白、四边留白、子项间距 |
| `alignment`、`corner-radius`、`clip-shape` | 对齐、圆角、裁剪 |
| `opacity`、`hidden`、`rotation`、`offset-x`、`offset-y` | 显示状态与变换 |
| `data-source`、`columns` | 循环数据源和网格列数 |
| `open-url` | 对应组件的 URL 点击行为 |

数字尺寸和间距不接受变量绑定，也不能填写 CSS 单位。`${...}` 只读取变量路径，不执行 JavaScript 表达式。

## 循环

```xml
<widget version="1" type="medium">
  <vstack width="0" height="0" data-source="${rows[row]}">
    <text width="0" height="0">${row.title}</text>
  </vstack>
</widget>
```

`grid` 和 `hgrid` 最多包含一个模板组件。变量作用域与可视化编辑器一致，详见[循环](./loop.md)。

## 复杂属性

`foreground`、`background`、`shadow` 和 `text-stroke` 子节点保存现有属性 JSON。Canvas 使用 `commands` 子节点。CDATA 可以避免逐个转义 JSON 字符：

```xml
<widget version="1" type="small">
  <text width="0" height="0" font-size="24">${title}
    <foreground><![CDATA[{"1":"FF0000|0000FF","4":"lgradient","2":"topLeading","3":"bottomTrailing"}]]></foreground>
    <shadow><![CDATA[{"2":4,"3":0,"4":2}]]></shadow>
  </text>
</widget>
```

同一个属性不能同时使用简写属性和子节点。Canvas 的 `commands` 可以放指令数组，也可以放绑定整个数组的 JSON 字符串，例如 `"${drawing}"`。

## 实时活动与控制小组件

实时活动用 `<region name="...">` 声明区域。可用名称：`lockWidget`、`expandBottom`、`expandCenter`、`expandLead`、`expandTrail`、`compactLead`、`compactTrail`、`minimal`、`watch`。

```xml
<widget version="1" type="live">
  <region name="lockWidget"><text width="0" height="0">${status}</text></region>
  <region name="minimal"><icon value="timer" /></region>
</widget>
```

未提供的区域使用空布局，区域不能重复。推送仍只更新变量，不会因为使用 AWML 而执行 JavaScript。

控制小组件使用 `control-toggle`，支持 `title`、`image`、`state`、`color`、`url`、`code`：

```xml
<widget version="1" type="toggle">
  <control-toggle title="灯光" image="lightbulb.fill" state="${state}" code="${code}" />
</widget>
```

## AI 与 MCP 工作流

功能重新开放后，推荐顺序是：

1. `get_markup_schema`：读取语法和完整属性列表。
2. `get_guide`：查询组件与 JavaScript 接口说明。
3. `validate_markup`：校验 `markup` 和可选 `type`，修复诊断。
4. `create_widget`：传入名称、类型、`markup` 和可选 `jscode`。
5. 修改已有小组件前先 `get_widget`，再把 `revision` 作为 `expectedRevision` 传给 `update_widget`。

`markup` 与旧的 `layout/text` 参数互斥。校验不会保存小组件，也不会执行 JavaScript。

## 限制

- 源码最大 1 MiB。
- 最多 10,000 个节点。
- 最多 64 层嵌套。
- 不支持的源码版本会保留原文，并阻止重写。
