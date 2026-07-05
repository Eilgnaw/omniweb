---
sidebar_position: 1
---

# 配置读写

鸿蒙版提供 **3 种存储**,各自作用域不同:

| 类型 | 跟着谁走 | 用途 |
|------|---------|------|
| 卡片配置 (`Config`) | **每张卡片独立**(按 widget.id 隔离),类型保真 | 这张卡片的 counter / token / cache / 上次刷新时间 |
| 共享配置 (`Shared`) | **同 `kind + dimension` 跨实例共享**,类型保真 | 多个同尺寸卡片共用的全局状态 |
| 设置项 (`Setting`) | **每张卡片独立** + 用户在用户设置里填,类型保真 | 模板分享后,让别人填自己的信息 |

三套接口形态完全对齐(`set` / `get` / `has` / `delete` / `keys`,值都是 JSON 兼容类型,**读出来类型不变**),区别只在作用域。

## 卡片配置 `Config`

每张卡片独立的存储空间,落盘到 `widgets/{id}/kv.json`。`number` / `boolean` / `array` / `object` 都能直接存,读出来类型不变。

```js
Config.set("count", 42)              // number
Config.set("on", true)               // boolean
Config.set("items", [1, 2, 3])       // array
Config.set("user", { name: "x" })    // object

Config.get("count")          // 42 (number,不是 "42")
Config.get("on")             // true (boolean,不是 1)
Config.get("missing")        // undefined
```

### 缺省值省去 `??` 兜底

`get` 的第二个参数是 key 不存在 / 显式被设成 `null` 时的回退值,看一眼就知道这个字段默认什么:

```js
const idx  = Config.get("page",   0)              // → 0
const list = Config.get("recent", [])             // → []
const user = Config.get("user",   { name: "" })   // → 给个空对象
```

### 完整签名

| 方法 | 说明 |
|---|---|
| `Config.set(key, value)` | 存任意 JSON 兼容值;传 `null` / `undefined` 等价于 `delete` |
| `Config.get(key, default?)` | 读;key 不存在或值是 `null` 时返回 `default`(不传则为 `undefined`) |
| `Config.has(key) → boolean` | 检查 key 是否存在 |
| `Config.delete(key)` | 删除 |
| `Config.keys() → string[]` | 列出所有 key,按字母排序 |

### 注意事项

:::tip 类型保真
内部走 JSON 序列化,所以存什么类型读什么类型 —— `true` 不会变成 `1`,`42` 不会变成 `"42"`,嵌套数组 / 对象里的各成员类型也都对。
:::

:::tip 持久化时机
`Config.set` / `Config.get` 在 JS 运行期间只动内存;**JS 跑完**主机侧才把全量 KV 写盘到 `widgets/{id}/kv.json`。所以同次 eval 内 set 完立即 get 没问题,跨次自动持久化。
:::

## 共享配置 `Shared`

按「**形态 + 尺寸**」分组的存储。同一种 `desk_2*4` 桌面卡片,你加到桌面**两次**(2 个实例),它们走的是同一份 `Shared` 数据,落盘到 `widgets/_shared/desk_2x4.json`。

```js
Shared.set("lastFetch", Date.now())
Shared.set("globalToken", "abc-def")

const ts = Shared.get("lastFetch", 0)
```

### 完整签名

跟 `Config` **完全对称**(方法名、参数、行为都一样),只是存储域不同:

| 方法 | 说明 |
|---|---|
| `Shared.set(key, value)` | 存;`null` / `undefined` 等价 `delete` |
| `Shared.get(key, default?)` | 读;缺失或 `null` 返 `default` |
| `Shared.has(key) → boolean` | |
| `Shared.delete(key)` | |
| `Shared.keys() → string[]` | 按字母排序 |

### 注意事项

:::warning 真的需要再用
`kind + dim` 共享的语义意味着:你换其它尺寸的卡片,数据互相看不到。**日常优先用 `Config`**;只在「同尺寸多实例共用一个全局态」(刷新时间戳、全局开关)才用 `Shared`。
:::

## Setting —— 用户填的参数

如果你想把卡片**分享**给别人用,但需要别人填自己的 token / 城市 / 颜色 / 图片 —— 用设置项。

数据落在 `widget.setting`(数据库 `setting` 字段的 JSON),用户在编辑器节点树里的**用户设置**页面编辑。**只有主 App 编辑器有权写库**;卡片刷新路径里调 `Setting.set` 只动内存不回写库(防止后台刷新覆盖用户编辑值)。

### 数据格式

新版本 `widget.setting` 使用 envelope,同时兼容旧版 values-only:

```json
{
  "schemaVersion": 2,
  "items": [
    {
      "key": "city",
      "name": "城市",
      "type": "text",
      "icon": "location",
      "description": "天气查询城市"
    }
  ],
  "values": {
    "city": "北京"
  }
}
```

旧格式仍能读取:

```json
{ "city": "北京" }
```

运行 JS 时只会把 `values` 注入给 `Setting`;`items` 只用来渲染用户设置页面。

### 流程

1. **JS 里**用 `Setting.add(...)` 声明用户可填写字段
2. **JS 里**用 `Setting.get("city", "北京")` 或 typed read 读取用户填的值
3. **用户在用户设置页面**填好 token / 城市 / 图片等
4. **下次运行**:JS 读到的就是用户填的值

### 声明用户设置项

```js
Setting.add({
  key: "city",
  name: "城市",
  type: "text",
  icon: "location",
  description: "天气查询城市"
})

Setting.add({
  key: "theme",
  name: "主题",
  type: "select",
  icon: "paintpalette",
  options: ["light", "dark", "auto"]
})
```

`Setting.add` 只声明 UI,不会写入用户值。重复声明同一个 `key` 会更新展示文案 / 图标 / 选项,用户已经填过的值会保留。

支持的类型:

| type | 用户设置控件 | 读取方式 |
|---|---|---|
| `text` | 文本输入 | `Setting.string(key)` / `Setting.get(key, default)` |
| `number` | 数字输入 | `Setting.number(key)` |
| `date` | 日期选择 | `Setting.date(key)` 返回毫秒时间戳 |
| `toggle` | 开关 | `Setting.bool(key)` |
| `select` | 选项列表 | `Setting.select(key)` |
| `icon` | 图标名 | `Setting.icon(key)` |
| `color` | 颜色值 | `Setting.color(key)` 返回 `#RRGGBB` 字符串或完整颜色对象 |
| `image` | 图片选择 | `Setting.image(key)` 返回沙盒相对路径 |

:::tip 声明只在编辑器持久化
`Setting.add` 只在主 App 编辑器预览时合并到 `widget.setting.items`;桌面卡片刷新时是 no-op,不会污染设置结构。
:::

### 读取用户填写值

```js
Setting.add({ key: "eventName", name: "事件名称", type: "text", icon: "calendar" })
Setting.add({ key: "targetDate", name: "目标日期", type: "date", icon: "calendar" })

const eventName = Setting.string("eventName") || "元旦"
const targetMs  = Setting.date("targetDate") || new Date("2027-01-01").getTime()
```

typed read 会做基础类型转换:

```js
Setting.string("city")      // string,缺失返回 ""
Setting.number("fontSize")  // number,缺失 / 非数字返回 0
Setting.bool("notify")      // boolean
Setting.date("targetDate")  // number(ms)
Setting.color("color")      // string 或 ColorItem 对象
Setting.image("avatar")     // string,例如 "images/xxx.jpg"
```

颜色设置项可以是旧版单个 Hex 字符串,也可以是颜色编辑器保存的完整颜色对象。完整对象可直接返回给组件颜色属性:

```js
Setting.add({ key: "accent", name: "主题色", type: "color", icon: "paintpalette" })

const accent = Setting.color("accent") || "#0A59F7"

// 编辑器里把某个组件的 backColor / forColor 设为 ${accent}
// 如果用户选择了渐变或 Light/Dark 颜色,组件会按完整颜色对象渲染。
```

### 低层读 / 写

`get` / `set` / `all` 直接操作 values:

```js
const city  = Setting.get("city", "北京")          // 字符串,缺省 "北京"
const size  = Setting.get("fontSize", 14)          // 数字,类型保留
const theme = Setting.get("theme", { mode: "dark" }) // 对象也行

// 写 values(通常只在主 App 编辑器路径里)
Setting.set("uuid", "abc-123-def")
Setting.set("notify", true)
Setting.set("colors", ["#FF0000", "#00FF00"])

const all = Setting.all()      // → values 对象,不包含 items
```

:::tip `get` 的默认值
`Setting.get(key, default)` 在 key 不存在 / 值是 `null` 时返回 `default`;不传 default 时返回空字符串 `""`。
:::

:::warning `set` 不是声明 UI
`Setting.set` 只改 values,不会让字段自动出现在用户设置页面。要让用户看到可填写项,请用 `Setting.add` 声明。
:::

### 跟 `Config` 的区别

| 维度 | `Config` | `Setting` |
|---|---|---|
| 落盘到 | `widgets/{id}/kv.json`(沙盒文件) | `widgets` 表的 `setting` 字段(SQLite) |
| 编辑入口 | 仅代码 | 代码声明 + **用户在用户设置页面可编辑** |
| 卡片刷新里 set 是否回写 | **是**(JsRunner 写 `kv.json`) | **否**(只动内存,防覆盖用户编辑值) |
| 适用场景 | 卡片内部状态、缓存、计数 | 暴露给用户的参数(token / 城市 / 主题色) |

### 注意事项

:::tip 跨次运行的回写时机(主 App 路径)
跟 `Config` 一样,**JS 跑完**主机侧检测到 values 或 declarations 有变化才会写库。同次 eval 内 set 完立刻 get 没问题。
:::

:::warning 卡片刷新路径里 set 不持久
`FormExtension` 每次刷新拿到的 `widget.setting` 是只读快照;在卡片刷新 JS 里调 `Setting.set(...)` **只影响内存,不会回写库**,`Setting.add(...)` 也不会写声明。这是有意的 —— 防止后台刷新无脑覆盖用户在 App 里编辑的值。**要让设置持久化,只在主 App 编辑器(`isDebug() === true`)路径写**:

```js
if (isDebug()) {
  Setting.set("lastEditAt", Date.now())
}
```
:::

## 速查

```js
// 卡片级(每张卡独立,类型保真)
Config.set(key, value)                          // null/undefined 等价 delete
Config.get(key, default?) → any                 // 缺失/null → default
Config.has(key)           → boolean
Config.delete(key)
Config.keys()             → string[]            // 按字母排序

// 跨实例共享(同 kind+dim,类型保真)
Shared.set(key, value)
Shared.get(key, default?) → any
Shared.has(key)           → boolean
Shared.delete(key)
Shared.keys()             → string[]

// 用户参数(每张卡独立,类型保真;卡片侧 set 不回写库)
Setting.get(key, default?) → any
Setting.set(key, value)
Setting.all()              → Record<string, any>
Setting.add({ key, name, type, icon?, description?, options? })
Setting.string(key)        → string
Setting.number(key)        → number
Setting.bool(key)          → boolean
Setting.date(key)          → number
Setting.select(key)        → string
Setting.icon(key)          → string
Setting.color(key)         → string | ColorItem
Setting.image(key)         → string
```
