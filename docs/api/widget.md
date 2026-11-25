---
sidebar_position: 4
---

# 小组件信息

`Widget` 是当前小组件的上下文对象。它会自动注入，不需要创建。

## 读取当前小组件

```js
console.log(Widget.id)
console.log(Widget.name)
console.log(Widget.type)
console.log(Widget.urlscheme)
console.log(Widget.runsInApp)
console.log(Widget.runsInWidget)
```

| 属性 | 含义 |
| --- | --- |
| `id` | 小组件的持久 UUID |
| `name` | 用户设置的名称 |
| `type` | `small`、`medium`、`large`、`circular`、`rectangular`、`inline`、`button`、`toggle` 或 `live` |
| `urlscheme` | 打开后会在主 App 中重新运行当前小组件 JS 的 URL |
| `runsInApp` | 是否在支持交互界面的主 App 中运行 |
| `runsInWidget` | 是否在 Widget Extension 中刷新小组件 |

`Widget.urlscheme` 目前返回 `awidget://...`。Omni 同时支持更易识别的 `omniwidgets://...`，两者行为相同。

## 先确认代码运行在哪里

`Widget.openUrl()`、`Widget.reload()` 和 `Widget.update()` 只在主 App 中生效：

- 在编辑器里点“运行”。
- 通过 `omniwidgets://runjs/...` 或 `Widget.urlscheme` 打开 Omni。

主屏幕小组件在扩展中自动刷新时，`openUrl()` 和 `reload()` 不执行操作；`update()` 返回 `{ updated: false, reason: "main_app_only" }`。

需要执行[弹窗、分享、预览](./ui.md)或更新检查时，推荐把整段逻辑放进 `Widget.runInApp()`：

```js
await Widget.runInApp(async () => {
  // 这里只会在主 App 中执行
  const alert = new Alert()
  alert.title = "主 App 操作"
  alert.addAction("继续")
  alert.addCancelAction("取消")
  await alert.presentAlert()
})
```

Widget Extension 会直接跳过回调，连回调里的网络请求也不会发送。直接在扩展中调用 Alert 等 UI API 也不会让小组件失败：Alert 返回 `-1`，分享返回 `completed: false`，QuickLook 和 WebView 直接结束。

## 打开 URL

```js
Widget.openUrl("https://2f0.cn")
Widget.openUrl("weixin://")
```

如果目标是“用户点击桌面小组件后跳转”，请设置 [Stack 的“打开 URL”](../components/stack.md#让容器可点击)，不要把 `Widget.openUrl()` 放进后台刷新代码。

## 请求刷新时间线

```js
Widget.reload()
```

它会请求系统重载当前小组件类型的所有时间线，适合主 App 中修改配置后使用。

:::warning `reload()` 不保证立即刷新
它只是通知 iOS 数据已经变化。系统仍然决定何时重新读取和显示内容。
:::

## 检查并安装更新包

Omni 不提供固定的更新服务器。组件作者可以自行检查版本、准备更新说明和 `.omni` 下载地址，再由用户确认是否安装：

```js
await Widget.runInApp(async () => {
  // 示例使用模拟数据；也可以用 Request.fetchJSON() 从作者服务器读取
  const release = {
    hasUpdate: true,
    version: "2.0.0",
    notes: [
      "调整组件样式",
      "修复数据刷新问题"
    ],
    packageURL: "https://example.com/releases/widget.omni"
  }

  if (!release.hasUpdate) return

  const alert = new Alert()
  alert.title = `发现新版本 ${release.version}`
  alert.message = release.notes.join("\n")
  alert.addAction("立即更新")
  alert.addCancelAction("稍后")

  if (await alert.presentAlert() !== 0) return

  const result = await Widget.update(release.packageURL)
  console.log(result.updated, result.name, result.packageId)
})
```

`Widget.update(source)` 接受两种来源：

- HTTPS 下载地址。Omni 使用原生下载，不把整个包复制进 JavaScript 内存。
- 当前小组件 `FileManager` 返回的 `LD:`、`LL:`、`ID:` 或 `IL:` 路径。需要自定义请求头时，可以先用 `fm.download(request, path)` 下载，再传入本地路径。

更新前会检查：

- 包必须是当前带 `manifest.json` 的版本化 `.omni` 格式。
- manifest、payload、预览图和 App build 兼容性必须通过验证。
- 新包的 `Widget.type` 必须与当前组件完全一致，例如 `small` 只能更新为 `small`。
- 受保护包需要重新申请导入授权并完成解密。
- 包大小不能超过 110 MB；下载和重定向必须保持 HTTPS。

类型或包校验失败时，Promise 会 reject，原组件不会变化。文件和数据库替换使用事务日志；中途失败或 App 意外退出时会恢复一致状态。

:::warning 更新会覆盖组件包内容
更新后保留当前设备上的 `Widget.id`，所以桌面、锁屏或控制中心仍然指向同一个本机组件。新包会替换名称、代码、布局、设置定义、资源、作者和权限元数据；按实例 ID 保存的 JS Storage、`FileManager` 文件和文件授权会保留。
:::

每次导出的包仍然有新的 `packageId`，这不影响原位更新。当前没有 bundle ID、更新频道或作者签名连续性；版本比较、更新说明和确认流程由组件作者负责。

## 通过 URL 运行 JS

快捷指令或其他 App 可以打开：

```text
omniwidgets://runjs/medium/<widget-id>
```

还可以附带查询参数：

```text
omniwidgets://runjs/medium/<widget-id>?city=Shanghai&count=10
```

JavaScript 通过 `$params` 读取：

```js
const city = $params.city || "Shanghai"
Config.set("city", city)
Widget.reload()
```

## 示例：同步后打开其他 App

```js
const request = new Request("https://api.example.com/sync")
await request.fetchJSON()
Config.set("lastSync", Date.now())
Widget.reload()
Widget.openUrl("weixin://")
```

这段代码需要从编辑器或运行 URL 启动，不能依赖主屏幕小组件的后台刷新。

## 速查

```js
Widget.id → string
Widget.name → string
Widget.type → string
Widget.urlscheme → string
Widget.runsInApp → boolean
Widget.runsInWidget → boolean
Widget.runInApp(callback) → Promise<any>
Widget.openUrl(url) → void // 仅主 App
Widget.reload() → void     // 仅主 App
Widget.update(source) → Promise<{ updated, reason?, id, name, type, packageId }>
$params → object           // 运行 URL 的查询参数
```
