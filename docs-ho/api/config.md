---
sidebar_position: 1
---

# 配置与设置

鸿蒙版有三类持久数据。先按作用域选择：

| 需要保存什么 | 使用 | 作用域 |
| --- | --- | --- |
| 当前卡片自己的状态和缓存 | `Config` | 每张卡片独立 |
| 同形态、同尺寸卡片共用的数据 | `Shared` | 相同 `kind + dimension` 共享 |
| 让用户在设置页填写的参数 | `Setting` | 每张卡片独立 |

新代码默认使用 `Config`。只有确实需要多张同尺寸卡片共享，才使用 `Shared`。

## `Config`：当前卡片的数据

`Config` 会保留字符串、数字、布尔值、数组和对象的类型。

```js
Config.set("count", 42)
Config.set("enabled", true)
Config.set("items", [1, 2, 3])
Config.set("user", { name: "Alice" })

const count = Config.get("count")
const enabled = Config.get("enabled")
```

### 默认值

```js
const page = Config.get("page", 0)
const recent = Config.get("recent", [])
const profile = Config.get("profile", { name: "" })
```

键不存在或值为 `null` 时，会返回第二个参数。

### 检查和删除

```js
if (Config.has("token")) {
  console.log(Config.get("token"))
}

console.log(Config.keys())
Config.delete("token")
```

传入 `null` 或 `undefined` 也会删除键。

## `Shared`：同形态、同尺寸共享

```js
Shared.set("lastFetch", Date.now())
const lastFetch = Shared.get("lastFetch", 0)
```

例如，两张 `desk + 2*4` 卡片会读取同一份 `Shared` 数据；换成 `2*2` 后不会共享。

`Shared` 的 `set`、`get`、`has`、`delete`、`keys` 与 `Config` 用法相同。

:::warning 先确认你真的需要共享
共享状态会影响所有同形态、同尺寸卡片。普通计数、缓存和用户 Token 应放在 `Config` 中。
:::

## `Setting`：用户填写的参数

分享模板时，用设置项让每个用户填写自己的城市、Token、颜色或图片。

### 声明设置项

```js
Setting.add({
  key: "city",
  name: "城市",
  type: "text",
  icon: "location",
  description: "用于天气查询"
})

Setting.add({
  key: "theme",
  name: "主题",
  type: "select",
  options: ["light", "dark", "auto"]
})
```

| 字段 | 必填 | 作用 |
| --- | --- | --- |
| `key` | ✓ | 唯一标识，与读取方法对应 |
| `name` | ✓ | 设置页显示名称 |
| `type` | ✓ | 设置控件类型 |
| `icon` |  | 图标名称，默认 `gearshape` |
| `description` |  | 名称下方的说明 |
| `options` | `select` 必填 | 可选字符串数组 |

支持的 `type`：

| 类型 | 读取 |
| --- | --- |
| `text` | `Setting.string(key)` |
| `number` | `Setting.number(key)` |
| `date` | `Setting.date(key)`，返回毫秒时间戳 |
| `toggle` | `Setting.bool(key)` |
| `select` | `Setting.select(key)` |
| `icon` | `Setting.icon(key)` |
| `color` | `Setting.color(key)` |
| `image` | `Setting.image(key)` |

重复声明同一个 key 会更新名称、图标、说明和选项，并保留用户已经填写的值。

### 读取设置

```js
const city = Setting.string("city") || "北京"
const fontSize = Setting.number("fontSize") || 16
const notify = Setting.bool("notify")
const targetDate = Setting.date("targetDate")
const accent = Setting.color("accent") || "#0A59F7"
const avatar = Setting.image("avatar")
```

颜色可能是十六进制字符串，也可能是包含渐变和深浅色的完整颜色对象，可以整段绑定到组件颜色字段。

### 低层读取和写入

```js
const city = Setting.get("city", "北京")
Setting.set("city", "上海")
const allValues = Setting.all()
```

`Setting.set(key, value)` 只修改值，不会创建设置页字段。要让用户看到输入项，必须先 `Setting.add()`。

:::warning 卡片刷新不会写回用户设置
`Setting.set()` 只有在编辑器运行时会持久保存。桌面或锁屏卡片刷新时的写入只影响本次运行，避免后台覆盖用户设置。
:::

## 速查

```js
Config.set(key, value)
Config.get(key, default?) → any
Config.has(key) → boolean
Config.delete(key)
Config.keys() → string[]

Shared.set(key, value)
Shared.get(key, default?) → any
Shared.has(key) → boolean
Shared.delete(key)
Shared.keys() → string[]

Setting.add({ key, name, type, ... })
Setting.get(key, default?) → any
Setting.set(key, value)
Setting.all() → object
Setting.string(key) → string
Setting.number(key) → number
Setting.bool(key) → boolean
Setting.date(key) → number
Setting.select(key) → string
Setting.icon(key) → string
Setting.color(key) → string | object
Setting.image(key) → string
```
