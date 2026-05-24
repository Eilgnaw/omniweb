---
sidebar_position: 1
---

# 配置读写

鸿蒙版提供 **3 种存储**,各自作用域不同:

| 类型 | 跟着谁走 | 用途 |
|------|---------|------|
| 卡片配置 (`Config`) | **每张卡片独立**(按 widget.id 隔离),类型保真 | 这张卡片的 counter / token / cache / 上次刷新时间 |
| 共享配置 (`Shared`) | **同 `kind + dimension` 跨实例共享**,类型保真 | 多个同尺寸卡片共用的全局状态 |
| 设置项 (`Setting`) | **每张卡片独立** + 用户在设置面板填,类型保真 | 模板分享后,让别人填自己的信息 |

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
`kind + dim` 共享的语义意味着:你换其它尺寸 / 锁屏卡片,数据互相看不到。**日常优先用 `Config`**;只在「同尺寸多实例共用一个全局态」(刷新时间戳、全局开关)才用 `Shared`。
:::

## 设置项 `Setting`

如果你想把卡片**分享**给别人用,但需要别人填自己的 token / 城市 / 颜色 —— 用设置项。

数据落在 `widget.setting`(数据库 `setting` 字段的 JSON 对象),用户在卡片设置面板编辑。**只有主 App 编辑器有权写库**;卡片刷新路径里调 `Setting.set` 只动内存不回写库(防止后台刷新覆盖用户编辑值)。

### 流程

1. **JS 里**:`Setting.get("city", "北京")` 读用户填的值,带缺省值
2. **用户在设置面板里**填好 token / 城市等
3. **下次运行**:JS 读到的就是用户填的值

### 读 / 写

```js
const city  = Setting.get("city",  "北京")         // 字符串,缺省 "北京"
const size  = Setting.get("fontSize", 14)          // 数字,类型保留
const theme = Setting.get("theme", { mode: "dark" })  // 对象也行

// 写(通常在主 App 编辑器路径里;卡片侧只动内存)
Setting.set("uuid", "abc-123-def")
Setting.set("notify", true)
Setting.set("colors", ["#FF0000", "#00FF00"])

// 全量
const all = Setting.all()      // → 整个 setting 对象
```

### 跟 `Config` 的区别

| 维度 | `Config` | `Setting` |
|---|---|---|
| 落盘到 | `widgets/{id}/kv.json`(沙盒文件) | `widgets` 表的 `setting` 字段(SQLite) |
| 编辑入口 | 仅代码 | 代码 + **用户在卡片设置面板可编辑** |
| 卡片刷新里 set 是否回写 | **是**(JsRunner 写 `kv.json`) | **否**(只动内存,防覆盖用户编辑值) |
| 适用场景 | 卡片内部状态、缓存、计数 | 暴露给用户的参数(token / 城市 / 主题色) |

### 注意事项

:::tip 跨次运行的回写时机(主 App 路径)
跟 `Config` 一样,**JS 跑完**主机侧检测到 `setting` 有变化才会写库。同次 eval 内 set 完立刻 get 没问题。
:::

:::warning 卡片刷新路径里 set 不持久
`FormExtension` 每次刷新拿到的 `widget.setting` 是只读快照;在卡片刷新 JS 里调 `Setting.set(...)` **只影响内存,不会回写库**。这是有意的 —— 防止后台刷新无脑覆盖用户在 App 里编辑的值。**要让设置持久化,只在主 App 编辑器(`isDebug() === true`)路径写**:

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
```
