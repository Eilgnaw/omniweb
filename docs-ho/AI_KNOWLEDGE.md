---
title: Omni Widgets 鸿蒙版 AI 知识库
draft: true
---

# Omni Widgets 鸿蒙版 AI 知识库

> 用途：本文件是提供给 AI 助手的产品知识上下文。AI 应依据本文件帮助用户使用 Omni Widgets 鸿蒙版制作、设置、调试、分享桌面卡片和锁屏卡片。
>
> 适用范围：仅限 Omni Widgets 鸿蒙版，不要把 iOS 版、浏览器、SwiftUI、ArkTS 开发接口或其他卡片工具的行为混入答案。
>
> 最后核对：2026-11-22，依据当前鸿蒙版功能、用户文档与运行行为整理。

## 1. AI 回答规则

### 1.1 回答目标

AI 的目标是让普通用户能在 Omni Widgets 中完成任务，而不是解释 App 内部实现。

- 默认使用简体中文。
- 优先给出用户在 App 中可操作的步骤，其次给出可复制的 JavaScript。
- 使用 App 中显示的中文组件名和字段名，例如“文字”“纵列”“数据源（循环）”“打开链接”。
- 必须保留用户需要原样输入的值，例如 `${name}`、`{rows[row]}`、`horizontal`、`vertical`、`fit`、`cover`、`OmniWidgets://...`。
- 用户未说明卡片位置时，可以先给通用方案；只有桌面和锁屏差异会实质影响结果时，才询问位置或尺寸。
- 能用可视化组件完成时，不要强迫用户写 JavaScript。
- 需要动态数据时，给出完整变量声明和组件绑定位置，不要只给孤立代码片段。
- 说明限制时同时给出可行替代方案。

### 1.2 禁止臆测

- 不要把浏览器的 `fetch`、`window`、`document`、`localStorage` 当成可用接口。
- 不要声称可以安装 npm 包或导入第三方 JavaScript 模块。
- 不要虚构本文件未列出的 Omni API、组件字段、刷新能力或平台权限。
- 不要保证系统在某个精确时刻刷新卡片。
- 不要把 `setUpdateFreq()` 当作秒级定时器。
- 不要让用户自己编写顶层 `return`；Omni 会自动收集顶层变量。
- 不要把内部英文组件类型作为主要称呼。应说“纵列”“横排”“层叠”“文字”“图片”等。
- 如果用户当前安装版本没有某项能力，应提示文档跟随最新测试版，并建议在 App 的“联系我们”中了解测试版本；不要断言用户安装损坏。

### 1.3 推荐的答题顺序

1. 先直接说明能否实现，以及最简单的实现方式。
2. 给出编辑器中的组件树或操作路径。
3. 如需 JavaScript，给出可复制的完整代码。
4. 明确指出每个组件字段要填什么。
5. 紧邻方案说明与该任务相关的限制、权限或刷新行为。
6. 排错问题按“日志 → 变量 → 占位符 → 平台限制”的顺序检查。

## 2. 产品概览

Omni Widgets 是一个使用可视化编辑器制作鸿蒙桌面卡片和锁屏卡片的 App。用户可以先用组件完成静态布局，再通过 JavaScript 获取动态数据，最后用占位符把数据绑定到组件字段。

### 2.1 支持的卡片形态

| 位置 | 形态 | 尺寸 |
| --- | --- | --- |
| 主屏幕 | 桌面 | `1*2`、`2*2`、`2*4`、`4*4`、`4*6` |
| 锁屏 | 锁屏 | `lock_1*1`、`lock_1*2` |

- `4*6` 是桌面超大卡片。PC 和 2in1 支持；手机和平板是否显示取决于设备型号和桌面宫格配置。
- `lock_1*1` 画布约为 76 × 76 vp，适合图标、数字和短状态。
- `lock_1*2` 画布约为 160 × 76 vp，适合图标加两行文字或小指标。

### 2.2 核心工作流

1. 新建卡片并选择位置、尺寸和名称。
2. 添加组件，组成布局。
3. 需要动态内容时，在“代码”中声明顶层变量。
4. 在组件字段中用 `${变量名}` 绑定结果。
5. 在编辑器中运行代码并查看日志。
6. 保存后添加到桌面，或绑定到同尺寸锁屏卡片位。

最小示例：

```js
let title = "今日天气"
let temperature = 26
```

两个文字的“内容”分别填写：

```text
${title}
${temperature}°
```

## 3. JavaScript 运行模型

### 3.1 可用能力

支持常见标准 JavaScript，以及 `async/await`、`Promise`、`Date`、`JSON`、`Math`、数组和对象操作。Omni 另外提供 `Request`、`Config`、`Shared`、`Setting`、`FileManager`、`Location`、`Device`、`Widget`、`$params` 等扩展接口。

### 3.2 输出变量规则

Omni 会自动收集脚本顶层使用 `const`、`let`、`var` 声明的变量，用于 `${...}` 绑定。

```js
const title = "今日天气"   // 可以绑定 ${title}
let count = 3             // 可以绑定 ${count}
const _token = "secret"   // 下划线开头，不输出

function load() {
  const temp = 26         // 函数局部变量，不输出
}
```

注意：

- 不要自己写顶层 `return`。
- `_` 开头的顶层变量会被视为私有变量，不进入绑定结果。
- 函数内部变量不能直接绑定。
- 顶层解构声明不会被自动收集。需要绑定时改成普通标识符声明。

不推荐：

```js
const { title, value } = data
```

推荐：

```js
const title = data.title
const value = data.value
```

### 3.3 运行时间和失败回退

- 每次卡片 JavaScript 运行预算最多约 4.5 秒，网络、定位、文件操作和 `sleep()` 都包含在内。
- 未捕获异常、输出无法转换为普通对象或运行超时会使本次执行失败。
- 卡片已有上一次成功数据时，失败或超时会继续显示上一次成功内容。
- 因此用户可能看到旧内容，而不是空白；排错时应查看编辑器日志。
- 多个互不依赖的请求应使用 `Promise.all()` 并行执行。

```js
const [profile, weather] = await Promise.all([
  new Request(profileUrl).fetchJSON(),
  new Request(weatherUrl).fetchJSON()
])
```

### 3.4 不可用能力

- 没有浏览器 `fetch`，请使用 `Request`。
- 没有 `window`、`document` 和 DOM。
- 不能安装 npm 包。
- 不应依赖持续后台执行、无限循环或长时间计时。

## 4. 占位符与循环

### 4.1 普通绑定

| 写法 | 作用 |
| --- | --- |
| `${name}` | 读取顶层变量 `name` |
| `你好，${name}` | 在字符串中插入变量 |
| `${user.name}` | 读取对象字段 |
| `${list.0}` | 读取数组第 1 项 |
| `${a.b.2.c}` | 读取嵌套对象和数组 |

```js
let user = {
  name: "Alice",
  badges: ["VIP", "新人"]
}
```

```text
${user.name}       → Alice
${user.badges.0}   → VIP
```

- 整个字段只写 `${size}` 时，会保留数字、布尔值、数组或对象等原始类型。
- 写成 `字号 ${size}` 或 `${size}px` 后，结果是字符串。
- 变量或路径不存在时会变成空字符串，不会直接报错。

### 4.2 数组循环

“数据源（循环）”使用 `{数组路径[当前项名称]}`，不是 `${...}`。

```js
let rows = [
  { title: "苹果", price: 5 },
  { title: "香蕉", price: 3 }
]
```

外层纵列、横排、层叠、网格或列表的“数据源（循环）”填写：

```text
{rows[row]}
```

内部文字填写：

```text
${row.title}
¥${row.price}
```

支持嵌套循环：

```text
外层纵列：{rows[row]}
└─ 内层横排：{row.cells[cell]}
   └─ 文字：${cell.text}
```

循环每次最多展开 50 条，超过部分截断。数据很多时先在 JavaScript 中使用 `slice(0, 50)`。

## 5. Omni JavaScript API 总表

| 目标 | API |
| --- | --- |
| HTTP 请求 | `Request` |
| 当前卡片持久状态 | `Config` |
| 同形态同尺寸共享状态 | `Shared` |
| 用户设置项 | `Setting` |
| 当前卡片文件 | `FileManager` |
| 坐标和地址 | `Location` |
| 设备信息 | `Device` |
| 当前卡片信息 | `Widget` |
| 外部调用和点击参数 | `$params` |
| 建议刷新 | `setUpdateFreq()`、`setUpdateTime()` |
| 打开链接 | `openUrl()`、`Widget.openUrl()` |
| 判断编辑器环境 | `isDebug()` |
| 短暂等待 | `sleep()` |
| 调试日志 | `console.*` |

## 6. `Request`：网络请求

`Request` 是 Omni 中浏览器 `fetch` 的替代品。

### 6.1 最短示例

```js
let title = "暂时无法加载"

try {
  const data = await new Request("https://2f0.cn/api/omni").fetchJSON()
  title = data.title || data.omni || title
} catch (error) {
  console.error("请求失败：", error)
}
```

### 6.2 返回类型

| 方法 | 返回 | 用途 |
| --- | --- | --- |
| `fetchJSON()` | 解析后的对象、数组或 `null` | JSON API |
| `fetchString()` | 字符串 | 文本、HTML、XML |
| `fetch()` | `Uint8Array` | 图片和其他二进制文件 |

`fetchJSON()` 已经执行 JSON 解析，不要再次 `JSON.parse()`。

### 6.3 GET 和请求头

```js
const request = new Request("https://api.example.com/list")
request.headers = { "X-Token": "abc" }
const data = await request.fetchJSON()
```

GET 是默认方法。

### 6.4 POST JSON

```js
const request = new Request("https://api.example.com/login", {
  method: "POST",
  headers: { "X-Token": "abc" },
  body: {
    username: "alice",
    password: "secret"
  }
})

const data = await request.fetchJSON()
```

- 对象形式的 `body` 会自动执行 `JSON.stringify()`。
- 有请求体且未提供 `Content-Type` 时，默认使用 `application/json`。
- 默认 User-Agent 为 `AWidgetHarmony/1.0`。
- 支持 GET、POST、PUT、DELETE、OPTIONS、HEAD、TRACE、CONNECT；未知方法会按 GET 处理。

### 6.5 错误和限制

- HTTP 状态码大于等于 400 会抛错。
- 网络失败和 `fetchJSON()` 解析失败会抛错。
- 单次连接和读取超时为 5 秒，但卡片脚本总预算只有约 4.5 秒，因此实际更早受到总预算限制。
- `Request` 只直接提供响应内容，不提供浏览器 Response 对象、状态码或响应头读取接口。
- 需要回退内容时用 `try...catch`。

### 6.6 速查

```js
new Request(url)
new Request(url, { method, headers, body })

request.method = "POST"
request.headers = { ... }
request.body = { ... }

request.fetchJSON()   // Promise<any>
request.fetchString() // Promise<string>
request.fetch()       // Promise<Uint8Array>
```

## 7. `Config`、`Shared` 与 `Setting`

### 7.1 作用域选择

| 需要保存什么 | 使用 | 作用域 |
| --- | --- | --- |
| 当前卡片自己的计数、状态和缓存 | `Config` | 每张卡片独立 |
| 同形态、同尺寸卡片共用的数据 | `Shared` | 相同 `kind + dimension` 共享 |
| 让用户在设置页填写的城市、Token、颜色、图片等 | `Setting` | 每张卡片独立 |

新代码默认优先使用 `Config`。只有确实需要多张同尺寸卡片互相影响时才使用 `Shared`。

### 7.2 `Config`

`Config` 支持 JSON 兼容值并保留类型：字符串、数字、布尔值、数组和对象。

```js
Config.set("count", 42)
Config.set("enabled", true)
Config.set("items", [1, 2, 3])
Config.set("user", { name: "Alice" })

const count = Config.get("count", 0)
const enabled = Config.get("enabled", false)
```

```js
Config.has("token")
Config.keys()
Config.delete("token")
```

- 键不存在或值为 `null` 时，`get(key, defaultValue)` 返回默认值。
- `set(key, null)` 或 `set(key, undefined)` 等同删除。
- `keys()` 返回排序后的键名数组。

### 7.3 `Shared`

```js
Shared.set("lastFetch", Date.now())
const lastFetch = Shared.get("lastFetch", 0)
```

`Shared` 的 `set`、`get`、`has`、`delete`、`keys` 与 `Config` 相同。

例如两张 `desk + 2*4` 卡片共享同一份 `Shared`；换成 `2*2` 后不共享。普通计数、用户 Token 和每张卡片不同的缓存不要放在 `Shared`。

### 7.4 `Setting.add()` 声明用户设置项

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
| `key` | 是 | 唯一标识，与读取方法对应 |
| `name` | 是 | 设置页显示名称 |
| `type` | 是 | 设置控件类型 |
| `icon` | 否 | 图标名称，默认 `gearshape` |
| `description` | 否 | 名称下方的说明 |
| `options` | `select` 必填 | 可选字符串数组 |

支持的 `type`：

| 类型 | 推荐读取方法 | 返回 |
| --- | --- | --- |
| `text` | `Setting.string(key)` | 字符串 |
| `number` | `Setting.number(key)` | 数字 |
| `date` | `Setting.date(key)` | 毫秒时间戳 |
| `toggle` | `Setting.bool(key)` | 布尔值 |
| `select` | `Setting.select(key)` | 字符串 |
| `icon` | `Setting.icon(key)` | 字符串 |
| `color` | `Setting.color(key)` | 颜色字符串或完整颜色对象 |
| `image` | `Setting.image(key)` | 图片路径字符串 |

声明设置项后，应在编辑器中至少运行一次代码，让设置定义写入卡片。桌面或锁屏后台刷新不会新增或修改设置项定义。

重复声明同一个 `key` 会更新名称、类型、图标、说明和选项，并保留已有用户值。

### 7.5 读取和写入设置值

```js
const city = Setting.string("city") || "北京"
const fontSize = Setting.number("fontSize") || 16
const notify = Setting.bool("notify")
const targetDate = Setting.date("targetDate")
const accent = Setting.color("accent") || "#0A59F7"
const avatar = Setting.image("avatar")
```

低层接口：

```js
const city = Setting.get("city", "北京")
Setting.set("city", "上海")
const allValues = Setting.all()
```

- `Setting.set()` 只修改值，不创建设置页字段。
- 需要用户可见输入项时必须使用 `Setting.add()`。
- `Setting.get()` 在值不存在时默认返回空字符串，或返回提供的第二个参数。
- `Setting.string()`、`select()`、`icon()`、`image()` 的缺省值是空字符串。
- `Setting.number()`、`date()` 的无效值回退为 `0`。
- `Setting.bool()` 对布尔值、数字和字符串 `"true"` 做转换。

### 7.6 速查

```js
Config.set(key, value)
Config.get(key, defaultValue?)
Config.has(key)
Config.delete(key)
Config.keys()

Shared.set(key, value)
Shared.get(key, defaultValue?)
Shared.has(key)
Shared.delete(key)
Shared.keys()

Setting.add({ key, name, type, ... })
Setting.get(key, defaultValue?)
Setting.set(key, value)
Setting.all()
Setting.string(key)
Setting.number(key)
Setting.bool(key)
Setting.date(key)
Setting.select(key)
Setting.icon(key)
Setting.color(key)
Setting.image(key)
```

## 8. `FileManager`：当前卡片文件

`FileManager` 用于在当前卡片自己的文件空间中读写文本和二进制文件，常用于缓存接口结果和网络图片。

### 8.1 最短示例

```js
await FileManager.write("note.txt", "Hello")
const text = await FileManager.read("note.txt")
```

两种调用方式等价：

```js
await FileManager.write("a.txt", "hello")

const files = FileManager()
await files.write(files.root() + "a.txt", "hello")
```

### 8.2 路径规则

- API 接受 `"avatar.png"` 或 `"files/avatar.png"`。
- `write()` 始终返回 `"files/<文件名>"`，该返回值可直接绑定到图片“资源”。
- 只能访问当前卡片的文件。
- 不接受绝对路径、`~`、`..`、反斜杠、符号链接或空路径段。
- 文件不存在时，`read()` 返回空字符串。
- `list(dir?)` 只返回指定目录的直接子项名称，不递归。

### 8.3 下载并缓存图片

```js
const filename = "avatar.png"
let avatar = "files/" + filename

if (!(await FileManager.exists(filename))) {
  const bytes = await new Request("https://example.com/avatar.png").fetch()
  avatar = await FileManager.write(filename, bytes)
}
```

图片的“资源”填写 `${avatar}`。

### 8.4 列出、删除和清空

```js
const exists = await FileManager.exists("avatar.png")
const rootFiles = await FileManager.list()
const names = await FileManager.list("files/cache")
const removed = await FileManager.remove("avatar.png")
```

`remove()` 返回字符串：`"1"` 表示已删除，`"0"` 表示不存在。

```js
const fm = FileManager()
await fm.write("cache/a.txt", "A")
await fm.write("cache/nested/b.txt", "B")

await fm.clear("files/cache")
```

- `clear(path)` 递归删除文件夹中的全部内容，但保留文件夹本身。
- 必须明确传入文件夹路径；非法路径、不存在或指向文件时会抛错。
- `await FileManager.clear(FileManager.root())` 会清空当前卡片整个 `files/`，不可撤销。

### 8.5 图片路径限制

- 用户通过编辑器选择的本地图片通常使用 `images/...`。
- 通过 `FileManager.write()` 生成的本地图片必须使用返回的 `files/...`。
- 普通文件名可以传给 FileManager 方法，但图片组件引用本地文件时必须保留 `files/` 或 `images/` 前缀。
- 本地文件无法读取时图片会显示为空，不应让整张卡片失败。

### 8.6 文件管理页面

编辑器右上角选择“更多 → 文件管理”，可以：

- 浏览文件夹、新建文件夹和导入文件。
- 预览图片和常见文本文件；文本最多预览前 256 KiB。
- 重命名、删除、导出文件。
- 复制 `files/...` 引用路径。

重命名或删除文件后，代码和图片组件中的旧路径不会自动修改。

### 8.7 速查

```js
FileManager.root()                     // "files/"
FileManager.read(path)                 // Promise<string>
FileManager.write(path, content)       // Promise<string>
FileManager.exists(path)               // Promise<boolean>
FileManager.list(dir?)                 // Promise<string[]>
FileManager.clear(path)                // Promise<boolean>
FileManager.remove(path)               // Promise<string>
```

`write()` 的 `content` 支持字符串、`Uint8Array` 和数字数组。

## 9. `Location`：坐标和地址

### 9.1 获取坐标

```js
const location = await Location.getLocation()
```

返回：

```js
{
  latitude: 34.75936567,
  longitude: 113.69243507,
  altitude: 104.13
}
```

默认接受 60 分钟内的位置缓存。传入分钟数可改变缓存时长：

```js
const location = await Location.getLocation(5)
```

传 `0` 表示不使用已有位置缓存，尝试重新定位。

### 9.2 获取地址

```js
const place = await Location.getPlacemark()
```

或指定坐标：

```js
const place = await Location.getPlacemark({
  latitude: 34.75936567,
  longitude: 113.69243507
})
```

返回字段：

| 字段 | 内容 |
| --- | --- |
| `name` | 地点名 |
| `street` / `streetNumber` | 街道 / 门牌号 |
| `district` | 区 |
| `city` | 市 |
| `state` | 省 |
| `country` / `countryCode` | 国家或地区 / 国家码 |
| `postalCode` | 邮编 |

不同地区可能缺少部分地址字段，应准备回退：

```js
let city = "无法获取位置"

try {
  const location = await Location.getLocation()
  const place = await Location.getPlacemark(location)
  city = place.city || place.district || place.name || "未知位置"
} catch (error) {
  console.error("位置获取失败：", error)
}
```

### 9.3 权限与限制

- 首次使用应在 Omni 编辑器中运行一次定位代码，并完成系统位置授权。
- 桌面或锁屏卡片后台刷新无法主动弹出授权窗口；未授权时会报错。
- 定位失败时不会伪造坐标，应使用 `try...catch` 给出回退内容。
- 反向地理编码失败但有旧缓存时，可能返回旧地址。

## 10. `Device`：设备信息

`Device` 是只读全局对象，不需要 `await`。

| 字段 | 内容 |
| --- | --- |
| `model` | 设备型号 |
| `brand` | 品牌，例如 `HUAWEI` |
| `osVersion` | 系统完整版本 |
| `deviceType` | `phone`、`tablet`、`2in1`、`wearable` 等 |
| `sdkApiVersion` | API Level |
| `locale` | 语言地区，例如 `zh-Hans-CN` |
| `screenWidth` / `screenHeight` | 屏幕像素尺寸 |
| `densityDPI` | 屏幕 DPI |

```js
let columns = Device.deviceType === "tablet" ? 4 : 2
let greeting = Device.locale.startsWith("zh") ? "你好" : "Hello"
let dpi = Device.densityDPI || 320
```

部分设备或模拟器可能无法提供全部字段；字符串可能是 `""`，数字可能是 `0`，应准备默认值。

## 11. `Widget`、`$params` 与打开链接

### 11.1 当前卡片信息

```js
Widget.id
Widget.name
Widget.kind
Widget.dimension
Widget.urlscheme
```

- `Widget.urlscheme` 是运行当前卡片的链接。
- `Widget.openUrl(url)` 与全局 `openUrl(url)` 都可请求打开链接。

```js
Widget.openUrl(Widget.urlscheme + "?source=button")
openUrl("https://example.com")
```

打开链接属于运行结束后的动作。编辑器预览运行时不会真的跳出 App，桌面或锁屏卡片运行时才会交给系统处理。

### 11.2 `$params`

`$params` 是当前这次运行收到的参数对象。普通系统刷新时通常是 `{}`。

外部运行链接：

```text
OmniWidgets://run-widget/<卡片 ID>?city=Shanghai&count=10
```

读取：

```js
const city = $params.city || "Beijing"
const count = Number($params.count || 0)
```

查询参数值是字符串。需要长期保存时使用 `Config.set()`。

### 11.3 闪控球捷径参数

闪控球识别文字且命中已启用捷径后，目标卡片可读取：

| 字段 | 内容 |
| --- | --- |
| `$params.shortcut.commandId` | 捷径 ID |
| `$params.shortcut.commandName` | 捷径名称 |
| `$params.shortcut.trigger` | 触发来源；闪控球为 `floatingBallOcr` |
| `$params.shortcut.matched` | 是否命中 |
| `$params.shortcut.capturedAt` | 识别时间戳，单位 ms |
| `$params.ocr.rawText` | 原始识别文字 |
| `$params.ocr.editedText` | 本次捷径使用的文字 |
| `$params.ocr.lines` | 按行拆分的字符串数组 |

```js
const text = $params.ocr?.editedText || ""
const match = text.match(/取件码[:：\s]*([A-Z0-9-]{4,})/)
const code = match?.[1] || ""

if (code) Config.set("pickupCode", code)
let pickupCode = Config.get("pickupCode", "")
```

`$params` 只对本次运行有效。

## 12. 刷新、等待与日志

### 12.1 建议下次刷新

```js
setUpdateFreq(30)
```

参数单位为分钟。系统接受的最小建议间隔是 5 分钟，小于 5 分钟会按 5 分钟提交；实际刷新时间仍由系统决定。

```js
const next = new Date()
next.setDate(next.getDate() + 1)
next.setHours(7, 0, 0, 0)
setUpdateTime(next.getTime())
```

`setUpdateTime()` 参数是毫秒时间戳。两种方法在同次运行中都调用时，最后一次调用生效。

不应把刷新建议当作准点闹钟。秒级时钟和倒计时应使用“时钟”或“计时器”组件。

### 12.2 判断编辑器环境

```js
if (isDebug()) {
  console.log("当前在编辑器中运行")
}
```

- 编辑器运行返回 `true`。
- 桌面或锁屏卡片刷新返回 `false`。

### 12.3 短暂等待

```js
await sleep(300)
```

- 参数单位为毫秒。
- 返回等待毫秒数的字符串。
- 等待同样占用 4.5 秒脚本预算，不能用来模拟定时器。

### 12.4 控制台日志

```js
console.log("开始加载")
console.info("步骤 1")
console.warn("使用缓存")
console.error("请求失败：", error)
console.debug("中间结果：", data)
```

- 多个参数会以空格连接。
- 对象和数组会尝试转换为 JSON 文本。
- 每次运行最多保留 200 条日志，超出部分丢弃。
- 桌面和锁屏卡片没有可见日志面板，应在编辑器中复现问题。

## 13. URL Scheme 与 AppLink

协议 `OmniWidgets://` 匹配时不区分大小写。

### 13.1 运行卡片

```text
OmniWidgets://run-widget/<卡片 ID>
OmniWidgets://run-widget/<卡片 ID>?city=Shanghai&count=10

https://omni.2f0.cn/ho/app/run-widget/<卡片 ID>?city=Shanghai&count=10
```

运行后配置和文件会保存，但桌面或锁屏内容通常需要等待下一次系统刷新，不保证立即重绘。

### 13.2 控制闪控球

```text
OmniWidgets://floating-ball/start
OmniWidgets://floating-ball/stop
OmniWidgets://floating-ball/toggle

https://omni.2f0.cn/ho/app/floating-ball/start
https://omni.2f0.cn/ho/app/floating-ball/stop
https://omni.2f0.cn/ho/app/floating-ball/toggle
```

首次启动可能需要系统授权。

### 13.3 打开指定应用

```text
OmniWidgets://open-app/<包名>?ability=EntryAbility
OmniWidgets://open-app/<包名>?ability=EntryAbility&module=entry

https://omni.2f0.cn/ho/app/open-app/<包名>?ability=EntryAbility
```

只有目标应用需要模块名时才添加 `module`。目标应用、Ability 或权限不匹配时不会打开。

### 13.4 注意事项

- 找不到卡片、运行报错或超时时，可在 App 中查看最近一次外部调用结果。
- 重复查询参数以后面的值为准。
- AppLink 未被系统交给 Omni 时，会回退到文档站下载页。

## 14. 组件通用规则

### 14.1 支持的组件

文字、图片、图标、二维码、按钮、占位、时钟、计时器、纵列、横排、层叠、网格、列表、仪表、画布。

### 14.2 通用布局字段

| 字段 | 说明 |
| --- | --- |
| 宽 / 高 | 数字、带单位长度、百分比、`auto` 或变量 |
| 水平偏移 / 垂直偏移 / Z 轴偏移 | 数字、带单位长度或变量 |
| 内边距 / 外边距 | 单值，或上、右、下、左四个值 |

- 裸数字通常按 vp 处理。
- 常见显式单位包括 `vp`、`px`、`fp`、`lpx`。
- 字号和行高的裸数字按 vp 视觉尺寸处理。

### 14.3 通用视觉字段

| 字段 | 说明 |
| --- | --- |
| 显示 | `true` / `false` / `${show}` |
| 背景色 | 纯色、渐变、普通/深色配色或变量 |
| 圆角 | 数字、带单位长度、百分比或变量 |
| 旋转角度 | 正负数字或变量 |
| 不透明度 | `0` 到 `1` |

“显示”为 `false` 时，组件和整棵子树不参与渲染。

## 15. 颜色格式

### 15.1 普通和深色

颜色编辑器支持纯色、线性渐变、径向渐变、角度渐变，以及普通/深色两套配色。深色配色未设置时使用普通配色。

### 15.2 手动输入

| 输入 | 作用 |
| --- | --- |
| `#0A59F7` | 单个颜色 |
| `#000000\|#FFFFFF` | 普通黑色、深色白色 |
| `#0A59F7,#34C759` | 两个渐变色标 |
| `#0A59F7,#34C759\|#80B3FF,#82E5A0` | 普通和深色各两个色标 |
| `${color}` | 绑定颜色字符串或完整颜色对象 |
| `${startColor},${endColor}` | 用变量提供渐变色标 |

逗号分隔色标，竖线分隔普通和深色。

### 15.3 透明度

鸿蒙版使用 `#RRGGBB` 或 `#AARRGGBB`。八位颜色前两位是透明度：

| 颜色 | 效果 |
| --- | --- |
| `#0000FF` | 不透明蓝色 |
| `#800000FF` | 约 50% 不透明蓝色 |
| `#00000000` | 完全透明 |

最近使用最多 30 项，“我的配色”最多 48 项。变量颜色不会加入最近使用或收藏。

## 16. 组件参考

### 16.1 文字

用途：标题、数字、说明和动态文本。

| 字段 | 常用值 |
| --- | --- |
| 内容 | `你好` / `${title}` / `温度 ${temp}°` |
| 字号 | `14` / `14vp` / `${size}` |
| 行高 | `16` / `20` / `${lineHeight}` |
| 字重 | `normal` / `bold` / `medium` |
| 字体 | 编辑器下拉选项 |
| 文字色 | `#000000` / `${color}` |
| 文字描边 | 启用、宽度、颜色 |

文字描边限制：

- 按单行显示，换行变成空格。
- 前景使用渐变时不显示描边。
- 宽度不足时横向缩放，不自动换行。
- 描边宽度有效上限为 32 vp。

### 16.2 图片

| 资源 | 来源 |
| --- | --- |
| `https://example.com/x.png` | 网络图片 |
| `images/photo.png` | 编辑器选择的当前卡片图片 |
| `files/avatar.png` | `FileManager` 生成的当前卡片文件 |
| `${image}` | JavaScript 提供的地址或本地路径 |

“填充模式”支持：`fit`、`fill`、`cover`、`contain`、`none`、`scaleDown`。

- `fit` 和 `contain` 都表示完整显示并保持比例。
- `cover` 保持比例并铺满，可能裁剪。
- 本地文件引用必须保留 `images/` 或 `files/` 前缀。
- 大图应先在编辑器中缓存，避免每次卡片刷新都下载。

### 16.3 图标

| 字段 | 常用值 |
| --- | --- |
| 图标 | `star` / `heart` / `🌞` / `${icon}` |
| 字号 | `24` / `${size}` |
| 字重 | `normal` / `bold` / `medium` |
| 前景色 | `#000000` / `${color}` |

Emoji 颜色由系统字体决定，不响应“前景色”。系统符号名称无效时可能显示为空白。

### 16.4 二维码

| 字段 | 常用值 |
| --- | --- |
| 内容 | 固定文本、URL、Wi-Fi 文本或 `${url}` |
| 二维码色 | `#000000` / `${color}` |
| 背景色 | `#FFFFFF` |
| 宽 / 高 | 相同的正方形尺寸，例如 `120` |

建议使用深色前景、浅色背景和正方形尺寸。内容为空、尺寸太小或对比度太低会降低识别率。

### 16.5 纵列、横排和层叠

| 容器 | 排列 | 专属字段 |
| --- | --- | --- |
| 纵列 | 从上到下 | 水平对齐、垂直分布、内间距 |
| 横排 | 从左到右 | 垂直对齐、水平分布、内间距 |
| 层叠 | 前后叠放 | 九宫格“对齐” |

三者都支持“数据源（循环）”和“打开链接”。

纵列和横排主轴分布可用：`start`、`center`、`end`、`spaceBetween`、`spaceAround`、`spaceEvenly`。

层叠对齐可用：`topStart`、`top`、`topEnd`、`start`、`center`、`end`、`bottomStart`、`bottom`、`bottomEnd`。层叠中后面的组件盖在前面的组件上。

### 16.6 按钮

按钮是可点击容器，子组件决定外观，“点击”字段决定执行的 JavaScript 片段。

主脚本：

```js
let count = Config.get("count", 0)

function increment() {
  count += 1
  Config.set("count", count)
}
```

按钮“点击”填写：

```text
increment()
```

- 异步调用可以写 `await refreshData()`。
- 特殊值 `refresh` 表示不追加额外代码，只重新运行主脚本并刷新。
- 点击代码与主脚本共用约 4.5 秒预算。
- 不要在“点击”中粘贴大段逻辑或写顶层 `return`。
- 只需打开网页或 App 时，优先用容器的“打开链接”。

### 16.7 占位

占位用于撑开纵列或横排剩余空间，常用于两端对齐。

```text
横排
├─ 文字（标题）
├─ 占位
└─ 文字（26°）
```

| 字段 | 常用值 |
| --- | --- |
| 最小占位 | `10` / `10px` / `10vp` |
| 显示 | `true` / `false` / `${show}` |

- “最小占位”留空时使用系统自动撑开行为。
- 不支持百分比、负数和 0；无效值按未设置处理。
- 多个占位会平分剩余空间。

### 16.8 网格

网格适合固定行列，不滚动。

| 字段 | 常用值 |
| --- | --- |
| 方向 | `horizontal` / `vertical` |
| 列数 / 行数 | `3` / `${count}` |
| 间距 | `0` / `8` |
| 数据源（循环） | `{items[item]}` |

- `horizontal` 表示先从左到右，再换行。
- `vertical` 表示先从上到下，再换列。
- 一个格子需要多个组件时，先用纵列、横排或层叠包成一个根模板。
- 循环最多展开 50 条。
- 数据多或需要滚动时使用列表。

### 16.9 列表

列表适合待办、新闻、排行、日程等可滚动内容。

| 字段 | 常用值 |
| --- | --- |
| 方向 | `vertical` / `horizontal` |
| 间距 | `0` / `8` |
| 数据源（循环） | `{items[item]}` |
| 初始位置 | `0` / `3` |
| 列数 / 行数 | `1` / `2` |
| 交叉轴对齐 | `start` / `center` / `end` |
| 滚动条 | `off` / `auto` / `on` |
| 边缘效果 | `spring` / `none` |
| 分割线宽度 / 颜色 | `1` / `#1A000000` |

- 应给列表设置明确宽高，尤其是明确高度，才能形成滚动区域。
- 竖向列表的“列数 / 行数”表示列数；横向表示行数。
- 循环最多显示 50 条。
- 当前不支持分组吸顶、底部吸附和侧滑操作。

### 16.10 仪表

| 字段 | 常用值 |
| --- | --- |
| 当前值 | `0.6` / `${value}` |
| 最小值 / 最大值 | `0` / `1` |
| 起始角度 / 终止角度 | `210` / `150` |
| 环宽 | `12` / `12vp` |
| 颜色 | 单色、线性渐变或分段颜色 |

- 当前值应在最小值和最大值之间。
- 环宽不支持百分比，非正值按未设置处理。
- 仪表只识别直接子级中可见的层叠：第一个层叠是中心内容；有两个以上时最后一个层叠是说明。
- 说明内容需要 API 23 或以上；较低版本只显示仪表环和中心内容。
- 分段颜色最多 9 段，超过部分截断。

分段颜色：

```js
let colors = {
  kind: "segments",
  segments: [
    { color: "#34C759", weight: 30 },
    { color: "#FF9500", weight: 40 },
    { color: "#FF3B30", weight: 30 }
  ]
}
```

线性渐变：

```js
let colors = {
  kind: "linear",
  stops: [
    { color: "#0A59F7", offset: 0 },
    { color: "#34C759", offset: 1 }
  ]
}
```

### 16.11 时钟

时钟显示系统时间，自行更新，不需要 JavaScript 或频繁刷新。

| 字段 | 常用值 |
| --- | --- |
| 格式 | `HH:mm` / `yyyy/M/d` / `M月d日 EEEE` |
| 时区偏移 | `-8` / `5`；留空跟随系统 |
| 字号、字重、字体、文字色 | 固定值或变量 |

常见格式：

| 写法 | 含义 |
| --- | --- |
| `yyyy` / `yy` | 年 |
| `M` / `MM` | 月 |
| `d` / `dd` | 日 |
| `E` / `EEEE` | 星期 |
| `H` / `HH` | 24 小时制 |
| `h` / `hh` | 12 小时制 |
| `m` / `mm` | 分钟 |
| `a` | 上午 / 下午 |

卡片最小时间单位是分钟，不要依赖 `ss`、`SS`、`SSS` 在时钟上显示秒或毫秒。秒级计时使用计时器。

### 16.12 计时器

| 目标 | 倒计时 | 起点时间戳(ms) | 格式 |
| --- | --- | --- | --- |
| 从现在正计时 | `false` | 留空或 `Date.now()` | `mm:ss` |
| 从指定时刻正计时 | `false` | 起始时间戳 | `HH:mm:ss` |
| 倒计时 | `true` | 结束时间戳 | `mm:ss` 或 `HH:mm:ss` |

“倒计时时长(ms,已弃用)”只为旧卡片保留，新卡片使用“起点时间戳(ms)”。

5 分钟倒计时：

```js
let endTime = Date.now() + 5 * 60 * 1000
```

设置：倒计时 `true`，起点时间戳 `${endTime}`，格式 `mm:ss`。

- 倒计时最多显示 24 小时；更长会截断为 24 小时。
- 结束时间已过去时显示 0。
- 正计时超过 24 小时后按一天循环显示。

### 16.13 画布

画布按 JSON 指令绘制图形，适合进度环、折线图、柱状图、徽章、仪表盘和特殊文字效果。

| 字段 | 常用值 |
| --- | --- |
| 绘制指令 | `${drawing}` / JSON 数组 |
| 坐标宽度 / 高度 | `100`，有效上限 `4000` |
| 缩放模式 | `fit` / `stretch` |
| 宽 / 高 | `120` / `${size}` |

示例：

```js
let drawing = [
  {
    op: "circle",
    x: 50,
    y: 50,
    radius: 40,
    fill: "#0A59F7"
  },
  {
    op: "text",
    text: "75%",
    x: 50,
    y: 50,
    size: 18,
    fill: "#FFFFFF",
    align: "center",
    baseline: "middle"
  }
]
```

支持的主要 `op`：

| `op` | 主要字段 | 用途 |
| --- | --- | --- |
| `rect` / `roundRect` | `x`、`y`、`width`、`height`、`radius` | 矩形 |
| `circle` | `x`、`y`、`radius` | 圆形 |
| `arc` | `x`、`y`、`radius`、`start`、`end` | 圆弧，角度单位为度 |
| `line` | `x1`、`y1`、`x2`、`y2` | 直线 |
| `polyline` | `points`、`close` | 折线或多边形 |
| `path` | `segments` | 组合路径 |
| `text` | `text`、`x`、`y`、`size` | 文字 |
| `clear` | `x`、`y`、`width`、`height` | 清除区域 |
| `save` / `restore` | 无 | 保存或恢复状态 |
| `translate` / `rotate` / `scale` | 坐标、角度或比例 | 变换后续指令 |
| `clipRect` / `clipCircle` | 位置和尺寸 | 裁剪后续内容 |

`path.segments` 支持 `move`、`line`、`quadratic`、`bezier`、`arc`、`close`。

填充和描边字段包括：`fill`、`stroke`、`lineWidth`、`lineCap`、`lineJoin`、`dash`、`dashOffset`、`alpha`、`shadowColor`、`shadowBlur`、`shadowX`、`shadowY`、`composite`。

画布限制：

- 最多 100 条绘制指令。
- 折线点和路径片段最多 200 个。
- 每个渐变最多 16 个色标。
- `save` 深度最多 20 层。
- 无效指令跳过，超过限制部分截断。
- 不能在指令中直接绘制图片。
- 不是连续动画环境。

## 17. 编辑器与卡片操作

### 17.1 新建和编辑

- 首页右上角 `+` 新建桌面或锁屏卡片。
- 长按画布或点底部 `+` 添加组件。
- 组件树顺序决定显示顺序；层叠中后面的组件覆盖前面的组件。
- 窗口足够宽时编辑器左右分栏，分割线比例会记住。
- 预览中单指拖动卡片，双指捏合缩放。
- 窄屏或竖屏未分栏时，“代码”可全屏打开代码编辑器。

### 17.2 添加到桌面

1. 编辑器右上角选择“更多 → 添加至桌面”。
2. 当前内容保存并绑定到新卡片。
3. 如果系统不显示入口，可从桌面卡片库添加 Omni 卡片，再在系统编辑中选择同尺寸卡片。

### 17.3 添加到锁屏

1. 在系统锁屏双指捏合进入编辑。
2. 添加 Omni 锁屏卡片位。
3. 首次显示“点击选择卡片”。
4. 点击占位，从同尺寸卡片列表中选择。

也可以在 Omni 首页切到锁屏，长按卡片，选择“应用到锁屏”。

注意：

- 卡片位和卡片尺寸必须一致。
- 没有同尺寸卡片时可选择“新建并使用”。
- 删除已绑定卡片后，对应卡片位会回到选择占位。
- 清除 Omni 绑定记录不会从系统锁屏删除卡片位。

## 18. 导出、作者与分享保护

首页长按卡片并选择“导出”，可填写作者信息并选择普通分享或受保护分享。

### 18.1 作者信息

可填写作者名称、主页或社交链接、作者简介和组件简介。作者资料是分享署名，不代表实名或平台认证。

### 18.2 普通分享

普通分享可离线导入，接收者拥有完整编辑权限，适合设备迁移或允许自由修改的卡片。

### 18.3 受保护分享

可以限制授权设备数，并分别设置：

- 修改作者信息
- 编辑组件
- 访问代码
- 复制组件
- 再次导出
- 投稿

每项权限可设为：直接允许、密码解锁、始终禁止。

- 只要有一项使用密码解锁，就需要至少 8 位密码。
- 同一个密码解锁该分享包中所有“密码解锁”权限。
- 密码不是 ZIP 解压密码，也不是首次导入密码。
- 首次导入受保护分享需要联网验证，并受授权设备数限制。
- 受保护分享加密布局、代码、设置定义和随包资源；预览图、作者资料、组件简介和权限摘要仍可见。
- 鸿蒙分享包只能由鸿蒙版导入，不能与 iOS 版互相导入。

## 19. 常用完整方案

### 19.1 接口数据卡片

```js
let icon = "cloud"
let title = "暂时无法加载"
let value = "--"

try {
  const data = await new Request("https://2f0.cn/api/omni").fetchJSON()
  icon = data.icon || "cloud"
  title = data.title || data.omni || "今日数据"
  value = data.value ?? "--"
} catch (error) {
  console.error("请求失败：", error)
}

setUpdateFreq(30)
```

组件树：

```text
横排
├─ 图标：${icon}
└─ 纵列
   ├─ 文字：${title}
   └─ 文字：${value}
```

### 19.2 带用户设置的天气卡片

```js
Setting.add({
  key: "city",
  name: "城市",
  type: "text",
  icon: "location",
  description: "填写查询城市"
})

const city = Setting.string("city") || "北京"
let title = city
let temperature = "--"

try {
  const url = "https://api.example.com/weather?city=" + encodeURIComponent(city)
  const data = await new Request(url).fetchJSON()
  temperature = data.temperature ?? "--"
} catch (error) {
  console.error("天气加载失败：", error)
}
```

首次在编辑器中运行后，到卡片设置页填写城市。文字绑定 `${title}` 和 `${temperature}`。

### 19.3 持久计数按钮

```js
let count = Config.get("count", 0)

function increment() {
  count += 1
  Config.set("count", count)
}

function reset() {
  count = 0
  Config.set("count", count)
}
```

- 文字“内容”：`${count}`
- 增加按钮“点击”：`increment()`
- 重置按钮“点击”：`reset()`

### 19.4 动态列表

```js
let items = []

try {
  const data = await new Request("https://api.example.com/todos").fetchJSON()
  items = (data.items || data || []).slice(0, 50)
} catch (error) {
  console.error("列表加载失败：", error)
}
```

列表设置：

- 数据源（循环）：`{items[item]}`
- 方向：`vertical`
- 高：明确数值或 `100%`
- 项目文字：`${item.title}`

### 19.5 网络图片缓存

```js
const filename = "avatar.png"
let avatar = "files/" + filename

try {
  if (!(await FileManager.exists(filename))) {
    const bytes = await new Request("https://example.com/avatar.png").fetch()
    avatar = await FileManager.write(filename, bytes)
  }
} catch (error) {
  console.error("图片缓存失败：", error)
  avatar = ""
}
```

图片“资源”填写 `${avatar}`。

## 20. 限制总表

| 能力 | 限制 |
| --- | --- |
| JavaScript | 每次约 4.5 秒；无 DOM、浏览器 `fetch`、npm 包 |
| HTTP | 连接和读取各 5 秒，但仍受 4.5 秒总预算约束；HTTP 400+ 抛错 |
| 日志 | 每次最多 200 条 |
| 占位符 | 路径不存在时显示空字符串 |
| 循环 | 每个循环节点最多展开 50 条 |
| 定时刷新 | 最小提交间隔 5 分钟；实际时间由系统决定 |
| 位置 | 首次需在编辑器内完成授权；卡片后台不能弹授权 |
| 本地图片 | 必须使用 `images/` 或 `files/` 前缀 |
| 网格 | 不滚动 |
| 列表 | 无分组吸顶、底部吸附、侧滑；应明确高度 |
| 时钟 | 卡片最小时间单位为分钟，不依赖秒或毫秒 |
| 计时器 | 倒计时显示最多 24 小时 |
| 仪表 | 说明需 API 23+；分段颜色最多 9 段 |
| 占位 | 最小占位不支持百分比、负数和 0 |
| 文字描边 | 单行；渐变前景不描边；宽度上限 32 vp |
| 画布 | 100 条指令、200 点/片段、16 色标、20 层保存；不能画图片或持续动画 |
| 外部运行 | 会保存数据，但不保证立即重绘桌面或锁屏卡片 |
| 分享包 | 鸿蒙与 iOS 不互通；受保护分享首次导入需联网 |

## 21. 常见问题排查

### 21.1 变量没有显示

按顺序检查：

1. 在编辑器重新运行代码。
2. 用 `console.log(variable)` 确认变量不是 `undefined`。
3. 确认变量在脚本顶层使用普通标识符声明。
4. 检查占位符大小写和点号路径。
5. 数组索引使用 `${list.0}`。
6. 循环数据源使用 `{rows[row]}`，不是 `${rows[row]}`。
7. 检查变量是否以下划线开头，或是否只在函数内部声明。

### 21.2 编辑器正常，桌面卡片不更新

检查：

- 是否已经保存并把正确尺寸卡片绑定到桌面。
- 脚本是否在 4.5 秒内完成。
- 是否误以为 `setUpdateFreq()` 会准点执行。
- 是否通过外部 URL 运行后期待立即重绘；外部运行通常要等待下一次系统刷新。
- 位置权限是否只在卡片后台首次触发；应先在编辑器授权。
- 是否看到的是失败后的上一次成功内容。

### 21.3 网络请求失败

检查：

- URL 是否完整且可从设备访问。
- 是否误用了浏览器 `fetch`。
- HTTP 状态是否大于等于 400。
- 多个请求是否串行导致超时。
- `fetchJSON()` 返回内容是否确实为合法 JSON。
- 是否用 `try...catch` 和日志记录错误。

### 21.4 本地图片空白

检查：

- `FileManager.write()` 是否成功。
- 图片“资源”是否使用返回的 `files/...`，而不是普通文件名。
- 文件是否被重命名或删除。
- 是否把 `FileManager.read()` 的文本内容误当作图片路径。
- 下载是否在 4.5 秒内完成；大图应先在编辑器缓存。

### 21.5 列表不能滚动

检查：

- 列表是否设置明确高度。
- 内容是否真的超出列表区域。
- 是否误用了不滚动的网格。
- 父容器是否限制了列表高度。

### 21.6 点击按钮没有变化

检查：

- 主脚本是否定义了被调用函数。
- “点击”是否只写 `increment()` 之类的调用，而不是粘贴整段脚本。
- 状态是否用 `Config.set()` 持久保存。
- 是否存在未捕获异常或超时。
- 只需刷新时可直接填写 `refresh`。

## 22. 术语映射

AI 面向用户回答时应优先使用左侧名称。

| 用户名称 | 代码或旧资料中可能出现的名称 |
| --- | --- |
| 文字 | `Text` |
| 图片 | `Image` |
| 图标 | `Icon` |
| 二维码 | `QRCode` |
| 按钮 | `Button` |
| 网格 | `Grid` |
| 列表 | `List` |
| 仪表 | `Gauge` |
| 画布 | `Canvas` |
| 占位 | `Blank` |
| 时钟 | `TextClock` |
| 计时器 | `TextTimer` |
| 纵列 | `Column` / `VStack` |
| 横排 | `Row` / `HStack` |
| 层叠 | `Stack` / `ZStack` |

除非用户明确讨论数据文件或开发实现，否则不要用右侧名称主导说明。

## 23. 知识边界

- 本文件描述的是 Omni Widgets 鸿蒙版最新文档对应能力。
- 某项功能在用户设备上不存在时，优先考虑用户版本较旧、设备形态或系统能力差异。
- 不要根据其他平台经验补全本文件未说明的行为。
- 涉及第三方 API 的字段、认证、额度、隐私和稳定性时，应以该 API 提供方文档为准。
- 涉及系统桌面、锁屏、应用跳转或刷新调度时，最终行为可能受鸿蒙版本、设备类型和系统策略影响。
