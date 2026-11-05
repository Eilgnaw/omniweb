---
sidebar_position: 2
---

# 配置与设置

Omni 有三类持久数据。先按作用域选择，后面的代码会简单很多。

| 需要保存什么 | 使用 | 作用域 |
| --- | --- | --- |
| 当前小组件自己的数据 | `Config` | 每个小组件独立 |
| 某个桌面槽位的按钮状态 | `getValue` / `setValue` | 小组件类型 + 系统槽位 |
| 让用户在设置面板中填写的值 | `Setting` | 每个小组件独立 |

新代码默认使用 `Config`。只有明确需要槽位状态或用户设置面板时，再选另外两类。

## `Config`：保存当前小组件的数据

`Config` 保留数字、布尔值、字符串、数组和对象的类型。

```js
Config.set("count", 42)
Config.set("enabled", true)
Config.set("items", [1, 2, 3])
Config.set("user", { name: "Alice" })

const count = Config.get("count")       // 42
const enabled = Config.get("enabled")   // true
const missing = Config.get("missing")   // undefined
```

### 给读取设置默认值

```js
const page = Config.get("page", 0)
const recent = Config.get("recent", [])
const profile = Config.get("profile", { name: "" })
```

键不存在或保存内容损坏时，会返回第二个参数。

### 检查、列出和删除

```js
if (Config.has("token")) {
  console.log(Config.get("token"))
}

console.log(Config.keys())
Config.delete("token")
```

传入 `null` 或 `undefined` 也会删除：

```js
Config.set("token", null)
```

:::warning 只能保存 JSON 兼容值
请保存字符串、数字、布尔值、`null`、数组和普通对象。函数、循环引用等内容不能可靠序列化。
:::

## `setConfig` / `getConfig`：旧版字符串存储

```js
setConfig("token", "abcdef")
const token = getConfig("token")
```

这组 API 只保存字符串，主要用于兼容旧小组件和快捷指令。新代码使用 `Config`。

:::warning 两套键互不相通
`Config.get("token")` 读不到 `setConfig("token", ...)` 保存的值。迁移时需要自己复制一次：

```js
Config.set("token", getConfig("token"))
```
:::

## `getValue` / `setValue`：按桌面槽位保存

```js
setValue("favorite", "heart.fill")
const icon = getValue("favorite")
```

这组 API 按“小组件类型 + 系统槽位”保存字符串，常用于 Button 点击后的轻量状态。编辑器运行时使用调试槽位 `999`。

:::warning 不要保存重要数据
系统决定槽位，重新添加或移动小组件后，槽位可能变化。重要数据请使用 `Config`。
:::

## `Setting`：读取用户填写的设置

分享模板时，用设置项让每个用户填写自己的城市、Token、颜色、图片或文件。

### 在编辑器中创建

1. 打开小组件的设置面板。
2. 添加设置项，选择类型并填写唯一 key。
3. 在 JavaScript 中用同一个 key 读取。

### 按类型读取

```js
this.token = Setting.string("token")       // 文本、选项、图标、颜色
this.notify = Setting.bool("notify")       // 开关
this.fontSize = Setting.number("fontSize") // 数字，未设置时为 0

const birthdayMs = Setting.date("birthday")
const birthday = new Date(birthdayMs)       // 毫秒时间戳

this.background = Setting.image("background") // LL: 路径或 ""
this.rules = Setting.fileString("rules")       // 用户所选文本文件的内容
```

未设置时，字符串返回 `""`，布尔值返回 `false`，数字和日期返回 `0`。

### 显示用户选择的图片

```js
this.background = Setting.image("background")
```

把 Image 的类型设为“文件”，内容设为 `${background}`。`Setting.image()` 返回的是本地 `LL:` 路径，不是网络 URL。

## 用 JavaScript 声明设置项

在编辑器中运行时，`Setting.add()` 可以把声明放进设置面板的暂存区：

```js
Setting.add({
  key: "city",
  name: "城市",
  type: "text",
  icon: "location",
  description: "输入用于天气查询的城市"
})

Setting.add({
  key: "theme",
  name: "主题",
  type: "select",
  options: ["light", "dark"]
})
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `key` | ✓ | 唯一标识，与 `Setting.xxx(key)` 对应 |
| `name` | ✓ | 设置面板中的名称 |
| `type` | ✓ | `text`、`toggle`、`select`、`icon`、`color` 或 `file` |
| `icon` |  | SF Symbol 名称，默认 `gearshape` |
| `description` |  | 名称下方的说明 |
| `options` | `select` 必填 | 字符串数组 |

:::warning `Setting.add()` 支持的类型少于编辑器
数字、日期和图片设置可以在编辑器中创建并读取，但当前不能通过 `Setting.add()` 声明。
:::

相同 key 会更新名称、图标、说明和选项，同时保留用户已经填写的值和原类型。删除一行 `Setting.add()` 只会清除暂存声明，不会自动删除已存在的设置项。

`Setting.add()` 只在主 App 运行时生效；小组件扩展中调用不会修改设置。

## 写入设置值

`Setting.set(value, key)` 可以写回一个设置值，适合首次运行时生成并保存 ID：

```js
if (!Setting.string("userId")) {
  Setting.set(String(Date.now()), "userId")
}
```

一般情况下，让用户通过设置面板修改值会更清楚。

## 速查

```js
Config.set(key, value)
Config.get(key, default?) → any
Config.has(key) → boolean
Config.delete(key)
Config.keys() → string[]

setConfig(key, value)      // 旧版字符串存储
getConfig(key) → string

setValue(key, value)       // 按类型 + 槽位保存字符串
getValue(key) → string

Setting.string(key) → string
Setting.bool(key) → boolean
Setting.number(key) → number
Setting.date(key) → number
Setting.image(key) → string
Setting.fileString(key) → string
Setting.set(value, key)
Setting.add({ key, name, type, ... })
```
