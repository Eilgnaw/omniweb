---
sidebar_position: 2
---

# 配置读写

Omni 提供 **3 种存储**,各自的作用域不同:

| 类型 | 跟着谁走 | 用途 |
|------|---------|------|
| 小组件配置 (`Config`) | **每个小组件独立**,类型保真 | 这个小组件的 token、城市、状态对象等 |
| 通用配置 (`getValue` / `setValue`) | **跨小组件共享**(同一种类型 + 同一槽位) | 用户全局信息;按钮代码里改的状态 |
| 设置项 (`Setting`) | **每个小组件独立** + 用户在设置面板填 | 模板分享后,让别人填自己的信息 |

## 小组件配置

每个小组件独立的存储空间。**新代码统一用 `Config`** — 类型保真、带默认值,见下方。

老的 `setConfig` / `getConfig` 是字符串版,保留主要是为了:
- 跟**快捷指令**互通(快捷指令侧只能传字符串)
- 不破坏老 widget

### `Config`(推荐)

`Config` 对每个小组件自动初始化好了,直接调用就行。number / boolean / array / object 都能存,读出来类型不变。

```js
Config.set("count", 42)              // number
Config.set("on", true)               // boolean
Config.set("items", [1, 2, 3])       // array
Config.set("user", { name: "x" })    // object

Config.get("count")          // 42 (number,不是 "42")
Config.get("on")             // true (boolean,不是 1)
Config.get("missing")        // undefined
```

#### 默认值省去 `??` 兜底

`get` 的第二个参数是 key 不存在时的回退值,看代码就知道这个字段默认什么:

```js
const idx  = Config.get("page",   0)              // → 0
const list = Config.get("recent", [])              // → []
const user = Config.get("user",   { name: "" })   // → 给个空对象
```

#### 完整签名

| 方法 | 说明 |
|---|---|
| `Config.set(key, value)` | 存任意 JSON 兼容值;传 `null` / `undefined` 等价于 `delete` |
| `Config.get(key, default?)` | 读;键不存在或值损坏时返回 `default`(不传则为 `undefined`) |
| `Config.has(key) → boolean` | 检查 key 是否存在 |
| `Config.delete(key)` | 删除 |
| `Config.keys() → string[]` | 列出所有 key,按字母排序 |

#### 注意事项

:::tip 类型保真
内部走 JSON 序列化,所以存什么类型读什么类型 — `true` 不会变成 `1`,`42` 不会变成 `"42"`,嵌套数组/对象里的各成员类型也都对。
:::

:::warning 跟 `setConfig` 不共用 key
`Config` 用的是独立的 key 前缀,跟 `setConfig` 物理隔离 — 即使 key 名字相同,两套 API 互不干扰、互相也读不到对方的数据。想迁移得自己手动 `Config.set("token", getConfig("token"))`。
:::

### `setConfig` / `getConfig`(遗留,仅字符串)

```js
setConfig("token", "abcdef")    // 存
const t = getConfig("token")    // 取
console.log(t)                  // abcdef
```

只能存字符串。**新写代码请直接用 `Config`**;老 widget 改成 `Config` 也需要手动迁移数据(两套 key 不共享)。**唯一仍然需要它的场景**是跟快捷指令交换数据。

## 通用配置

按"小组件类型 + 槽位"为键的存储。同一种小组件如果你加到桌面**两次**,就是两个槽位(slot 1、slot 2),互不干扰。
编辑器里运行时,槽位永远是 `999`(调试位)。

```js
setValue("database", "abcdefg")
const data = getValue("database")
console.log(data)
```

:::warning
"槽位"概念由系统决定,你换桌面位置可能导致槽位变化。**慎用**作为重要数据存储。
日常推荐用 `setConfig` / `getConfig`。
:::

## 设置项 (Setting)

如果你想把小组件**分享**给别人用,但需要别人填自己的 token / 城市 / 图片 — 用设置项。

### 流程

1. **编辑器里**:右上 ⚙️ → 添加设置项,选类型(文本 / 数字 / 日期 / 开关 / 选项 / 图标 / 颜色 / 图片 / 文件),给个 key
2. **JS 里**:`Setting.string("xxx")` / `Setting.number("xxx")` 等读用户填的值
3. **别人导入**后,会在小组件设置面板里看到这些设置项,填好就能用

> 也可以**从 JS 反向声明**设置项 —— 见下方 [Setting.add](#反向声明-settingadd)。

### 读设置

每个类型对应一个读取函数,未设置时返回各自的默认值。

```js
// 文本 / 选项 / 图标 / 颜色 hex —— 都是字符串
this.token   = Setting.string("token")     // 未设置 → ""
this.theme   = Setting.string("theme")     // select 选项也用 string 读
this.icon    = Setting.string("iconName")  // SF Symbol 名
this.color   = Setting.string("bgHex")     // "FF3000FF" 之类的 hex

// 开关
this.notify  = Setting.bool("notify")      // 未设置 → false

// 数字
this.size    = Setting.number("fontSize")  // Double,未设置 → 0

// 日期 —— 返回 ms 时间戳,直接喂 new Date()
const birthday = new Date(Setting.date("birthday"))
const daysOld  = (Date.now() - Setting.date("birthday")) / 86400000

// 图片 —— 返回 LL: 路径 token,配合 buttonStyle="file" 渲染
this.bgPath  = Setting.image("background") // "LL:{wid}/background.jpg" 或 ""

// 文件(用户从系统文件选的)→ 直接拿到文件内容字符串
this.fileTxt = Setting.fileString("rules")
```

#### 图片怎么显示

`Setting.image()` 返回的是 `LL:` 前缀路径,**不能直接 `<img>`**。要在小组件里渲染,把它赋给一个 image 组件的 `value`,并把 `buttonStyle` 设为 `"file"`:

```js
this.bgPath = Setting.image("background")  // "LL:{wid}/background.jpg"
```
然后在编辑器里的 image 组件:`buttonStyle = "file"`, `value = "${bgPath}"`,小组件就能加载到那张图。保存小组件时会**根据这个 image 组件的宽度自动压缩**,不必担心大图占内存。

### 反向声明 (Setting.add)

不想在编辑器里手动一个个加设置项?**让 JS 自己声明**。每次预览运行时,JS 调用 `Setting.add({...})` 会把设置项写进设置面板的暂存区,用户下次打开设置面板就能看到。

```js
Setting.add({ key: "city",       name: "城市",     icon: "location", type: "text" })
Setting.add({ key: "notify",     name: "通知开关", type: "toggle" })
Setting.add({ key: "fontSize",   name: "字号",     type: "number" })
Setting.add({ key: "birthday",   name: "生日",     type: "date" })
Setting.add({ key: "background", name: "背景图",   type: "image" })
Setting.add({ key: "theme",      name: "主题",     type: "select",
              options: ["dark", "light"] })
```

字段:

| 字段 | 必填 | 说明 |
|---|---|---|
| `key` | ✓ | 唯一标识,跟 `Setting.xxx("key")` 对应 |
| `name` | ✓ | 设置面板里显示的名字 |
| `type` | ✓ | `text` / `number` / `date` / `toggle` / `select` / `icon` / `color` / `image` / `file` |
| `icon` | | SF Symbol 名,默认 `gearshape` |
| `description` | | 名字下方的小灰字说明 |
| `options` | type=select 时必填 | 字符串数组 |

**合并规则**:
- key 已存在 → 更新 name / icon / description / options,**保留用户已填的值和原类型**
- key 不存在 → 新增
- JS 删掉某行 `Setting.add(...)`,下次预览时该项**从暂存区消失**,但已在面板里的项不会被自动删(用户可以手动删)

**只在主 App 里生效**:widget 扩展刷新时调用是 no-op,不会反复写暂存区。

### 写设置(少用)

```js
Setting.set("uuid-12345", "userId")        // 把字符串写进去
const id = Setting.string("userId")
console.log(id)
```

通常用于:首次运行生成一个唯一 ID 写回去,下次运行直接用。

## 速查

```js
// 小组件级 —— 简单字符串
setConfig(key, value)        // 写
getConfig(key) → string      // 读

// 小组件级 —— 类型保真 KV
Config.set(key, value)               // 写,任意 JSON 兼容值
Config.get(key, default?) → any      // 读,缺失返回 default
Config.has(key) → boolean
Config.delete(key)
Config.keys() → string[]

// 通用(按类型 + 槽位)
setValue(key, value)         // 写
getValue(key) → string       // 读

// 用户填的设置项 —— 读
Setting.string(key)     → string  // text/select/icon/color hex
Setting.bool(key)       → bool
Setting.number(key)     → Double  // 0 if unset
Setting.date(key)       → Number  // ms timestamp, 0 if unset
Setting.image(key)      → string  // "LL:{wid}/file.jpg", "" if unset
Setting.fileString(key) → string  // 文件内容

// 用户填的设置项 —— 写
Setting.set(value, key)           // 仅写字符串
Setting.add({ key, name, type, ... })  // JS 反向声明设置项(仅 App 端生效)
```
