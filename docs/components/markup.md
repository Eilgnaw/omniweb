---
sidebar_position: 13
---

# 标签布局（AWidget Markup）

AWidget Markup（AWML）使用 XML 形式的原生组件标签描述小组件。布局源码独立保存，JS 继续提供变量；标签编译成现有原生布局。支持桌面、锁屏、控制小组件和 Live Activity。

## 开始使用

在完整编辑器顶部选择「源码」。已有布局会转换为标签；修改有效源码后更新预览，切回「组件」也可以修改组件。可视化修改会更新对应源码，保留未修改节点的内容、格式和注释。

```xml
<widget version="1" type="medium">
  <vstack width="0" height="0" alignment="leading" spacing="8" padding="16">
    <text width="0" height="0" font-size="16">${city}</text>
    <text width="0" height="0" font-size="32" color="#FFB800">${temperature}°</text>
  </vstack>
</widget>
```

在独立 JS 编辑器中提供数据：

```js
this.city = "杭州";
this.temperature = 26;
```

尺寸沿用现有组件语义：未填写宽高时默认 24，`0` 表示自动尺寸。需要铺满的背景请采用根 `zstack`、背景形状和独立内容容器，具体参考现有组件文档。

输入错误时保留草稿与最后一次有效预览，暂停可视化写入和保存。点击诊断可跳转到错误行；修复后继续同步。源码页复用应用现有代码编辑器，使用相同的主题、行号、换行和键盘工具栏。右上角更多菜单可打开编辑器设置、插入组件和属性，对勾用于保存布局。顶部布局撤销、重做可恢复源码与可视化修改。草稿保留在当前设备，有效源码随小组件保存和导出。

## 标签和属性

支持 `text`、`icon`、`image`、`date`、`vstack`、`hstack`、`zstack`、`tstack`、`grid`、`hgrid`、`shape`、`spacer`、`button`、`gauge`、`canvas`。名称、布局能力和动作行为沿用现有组件。`button` 的 `value` 仍表示按钮执行代码。

- 标签必须闭合，属性值必须加引号；空节点可写为 `<icon value="sun.max.fill" />`。
- 根节点为 `<widget version="1" type="medium">`，`type` 必须与被编辑小组件一致。
- `text` 内容保留空格和换行。其他组件使用 `value` 属性。字符 `&`、`<` 必须转义为 `&amp;`、`&lt;`。
- 缺失 `id` 时自动生成并写回；重复或空 ID 报错。编辑时保留 ID，新增节点不要复制原 ID。
- 不支持通用 HTML、CSS、DOM、脚本块、DTD 或自定义实体。

| 常用属性 | 含义 |
| --- | --- |
| `name`、`value` | 编辑名称、组件内容 |
| `width`、`height` | 数字尺寸 |
| `font-size`、`font-name` | 字号、字体 |
| `color`、`background` | 单色或现有浅色/深色值，例如 `#FF0000`、`000000\|ffffff` |
| `padding`、`insets`、`spacing` | 整体间距、四边间距、子项间距 |
| `alignment`、`corner-radius`、`clip-shape` | 对齐、圆角、裁剪 |
| `opacity`、`hidden`、`rotation`、`offset-x`、`offset-y` | 动态显示和变换 |
| `data-source`、`columns` | 循环数据源、网格列数 |
| `open-url` | 沿用组件的 URL 打开行为 |

完整属性列表可通过 MCP `get_markup_schema` 获取；属性只在对应原生组件使用时产生效果。宽高、间距等数字属性不接受变量绑定，不能填写 CSS 单位。`${…}` 沿用现有路径绑定，不执行 JS 表达式。

```xml
<widget version="1" type="medium">
  <vstack width="0" height="0" data-source="${rows[row]}">
    <text width="0" height="0">${row.title}</text>
  </vstack>
</widget>
```

`grid` 和 `hgrid` 最多包含一个模板组件。循环和变量作用域详见[循环](./loop.md)。

## 复杂属性

复杂属性使用 `foreground`、`background`、`shadow`、`text-stroke` 子节点，内容为现有属性 JSON；Canvas 使用 `commands` 子节点和现有命令 JSON；既可填写命令数组，也可填写绑定整个数组的 JSON 字符串，例如 `"${drawing}"`。CDATA 可以避免逐个转义 JSON 字符。

```xml
<widget version="1" type="small">
  <text width="0" height="0" font-size="24">${title}<foreground><![CDATA[{"1":"FF0000|0000FF","4":"lgradient","2":"topLeading","3":"bottomTrailing"}]]></foreground><shadow><![CDATA[{"2":4,"3":0,"4":2}]]></shadow></text>
</widget>
```

颜色对象：`1` 为颜色值，`2/3` 为起止方向，`4` 为 `single/lgradient/rgradient/agradient`，`5` 为中心点。阴影对象：`1` 为颜色对象，`2` 为半径，`3/4` 为 X/Y 偏移。文字描边对象：`1` 为颜色对象，`2` 为宽度。同一属性不能同时使用简写属性和子节点。

## Live Activity 与控制小组件

Live Activity 使用 `<region name="…">`，区域名称为 `lockWidget`、`expandBottom`、`expandCenter`、`expandLead`、`expandTrail`、`compactLead`、`compactTrail`、`minimal`、`watch`。未提供区域为空布局，不能重复声明。

```xml
<widget version="1" type="live">
  <region name="lockWidget"><text width="0" height="0">${status}</text></region>
  <region name="minimal"><icon value="timer" /></region>
</widget>
```

推送仍通过现有数据变量更新；标签不会使远程推送执行 JS。

控制小组件使用一个专用节点，属性支持 `title`、`image`、`state`、`color`、`url`、`code`。字段填写后覆盖对应 JS 输出，省略字段则沿用原有输出。动作和系统展示能力沿用现有控制小组件。

```xml
<widget version="1" type="toggle">
  <control-toggle title="灯光" image="lightbulb.fill" state="${state}" code="${code}" />
</widget>
```

可视化模式提供控制字段表单，和源码同步。

## AI 与 MCP

1. 调用 `get_markup_schema` 获取语法；使用 `get_guide` 查询具体组件和 JS API。
2. 调用 `validate_markup`，传入 `markup` 与可选 `type`，修复返回的诊断。
3. `create_widget` 传入名称、类型、`markup`，以及可选 `jscode`；`markup` 与 `layout/text` 互斥。
4. 修改前调用 `get_widget`，获取 `markup` 和 `revision`；`update_widget` 同时传入 `expectedRevision`，防止覆盖其他修改。

校验不保存小组件，也不执行 JS。返回的有效源码包含自动生成的 ID。输入最多 1 MiB、10,000 个节点、64 层嵌套。旧 JSON 接口继续支持；源码版本不受支持时保留原文并阻止重写。
