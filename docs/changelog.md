---
sidebar_position: 99
---

# 更新日志

仅列**用户能感知到**的功能变化。Bug 修复 / 内部重构不在此页。

## 占位符:新模板统一用 `${...}`

新建或编辑模板时,占位符建议写成 `${name}` / `${user.name}` / `${rows[row]}`。
旧的 `{name}` 仍兼容,保存时会自动规范化为 `${name}`。

详见 [占位符语法](./getting-started/placeholder.md)。

---

## 设置项:新增 3 种类型 + JS 可反向声明

设置项支持新增 **数字 / 日期 / 图片** 三种类型:

```js
Setting.number("fontSize")        // → Double
new Date(Setting.date("birthday")) // ms 时间戳,直接喂 Date()
this.bg = Setting.image("bgKey")   // → "LL:{wid}/..." 路径
```

图片选完后会**根据小组件里 image 组件的显示尺寸自动压缩**,放心选大图。

还能从 **JS 反向声明设置项**,不必再去面板里一个个加:

```js
Setting.add({ key: "city", name: "城市", type: "text" })
Setting.add({ key: "bg",   name: "背景", type: "image" })
```

详见 [配置读写 — Setting](./api/config.md#设置项-setting)。

---

## 设置面板 UI 优化

- 整行可点(不必再凑去戳右边小铅笔)
- 没填的项显示**未设置**灰色占位,提示用户去设
- 长文本编辑改成**独立 sheet** + 多行 TextEditor,不再用挤巴巴的弹窗

---

## 占位符:无前缀也支持点号路径

```
${user.name}     ← 现在直接生效
${$.user.name}   ← 强制读全局,仍支持
```

`${var}` 不再只是简单查变量名,还能**逐层深入**对象 / 数组。
循环里如果同名,加 `$.` 前缀强制读全局。

详见 [占位符语法](./getting-started/placeholder.md)。

---

## 循环:空数组不再"整段消失"

旧:数组为空 → **整个容器都不渲染**(布局会塌)。
新:数组为空 → 容器仍在,只是循环出 0 项。

```js
this.list = []   // 不再让容器消失,而是显示空白
```

详见 [循环 Loop](./components/loop.md)。

---

## URL 触发:JS 走异步执行

通过 `awidget://runjs/...` URL 触发的 JS,以前在主线程同步跑,可能卡 UI。
现在走**异步线程**,响应更顺,且可以正确等待网络请求结果。

按钮 / 快捷指令 / 实时活动里点 URL 后小组件**没刷新**的情况会少很多。

---

## JS 变量:支持数组 / 字典

```js
this.list = [1, 2, 3]            // ✅
this.user = { name: "A" }        // ✅
```

以前只支持字符串和数字,**数组 / 对象会被丢掉**;现在可以原样保留并被占位符 / 循环消费。
配合上面"点号路径"和"循环"非常好用。

---

## URL Scheme

每个小组件都自带一个 URL Scheme,可作回调:

```js
console.log(Widget.urlscheme)
// awidget://runjs/medium/<widget-id>
```

打开它会**重跑这个小组件的 JS**。常用于按钮、快捷指令、灵动岛回调。

详见 [小组件信息](./api/widget.md)。

---

## iPad 支持

Omni 现在适配 iPad 屏幕尺寸。同一个小组件可在 iPhone / iPad 显示。

---

## 编辑器改进

- **撤销 / 重做**:误操作可回退
- **工具栏重排**:常用项更近
- **属性行预览**:不打开属性面板也能看到当前组件配置
- **SF Symbols 选择器搜索**:输入关键词找图标
- **首页编辑列表**:支持跨层级拖拽,iOS 26 上的拖拽 / 预览问题修复

---

## 小细节

- **文本默认缩放因子改为 0.9**:大字号在小组件里更不容易被截断
- **文本默认行数无限制**:长文本能自然换行;需要单行的自己设
- **Widget 对象注入**:JS 里直接 `Widget.id` / `Widget.reload()` 等
- **Widget.reload()**:JS 里直接触发当前类型小组件的全部刷新

---

如果你发现某项功能用法和文档不一致,可能是版本差异。可以在 GitHub 留 issue 或微博联系作者。
