---
sidebar_position: 5
---

# 主 App 交互界面

Omni 可以从 JavaScript 展示系统弹窗、分享面板、文件预览和网页。它们只会在编辑器运行或通过 `Widget.urlscheme` 打开的主 App 中展示。

推荐把整段交互逻辑放进 `Widget.runInApp()`，避免 Widget Extension 刷新时执行不必要的网络请求：

```js
await Widget.runInApp(async () => {
  const alert = new Alert()
  alert.title = "主 App 交互"
  alert.addAction("继续")
  alert.addCancelAction("取消")
  await alert.presentAlert()
})
```

## Alert

```js
const alert = new Alert()
alert.title = "发现新版本"
alert.message = "修复数据刷新问题。"
alert.addAction("立即更新")
alert.addDestructiveAction("删除缓存后更新")
alert.addCancelAction("稍后")

const index = await alert.presentAlert()
```

普通和破坏性操作从 `0` 开始按添加顺序编号；取消始终返回 `-1`。`present()` 是 `presentAlert()` 的简写，`presentSheet()` 使用底部操作表。

Alert 也可以读取输入：

```js
const alert = new Alert()
alert.title = "连接服务器"
alert.addTextField("地址", "https://example.com")
alert.addSecureTextField("Token")
alert.addAction("继续")
alert.addCancelAction("取消")

if (await alert.presentAlert() === 0) {
  const server = alert.textFieldValue(0)
  const token = alert.textFieldValue(1)
}
```

:::warning 操作表不支持输入框
添加输入框后请使用 `presentAlert()`，不要使用 `presentSheet()`。
:::

## ShareSheet

```js
const fm = FileManager.local()
const report = fm.documents() + "report.txt"
fm.writeString(report, "Hello, Omni!")

const result = await ShareSheet.present([
  "分享说明",
  "https://example.com",
  report
])
console.log(result.completed, result.activityType)
```

数组可包含普通文字、HTTPS URL 和当前小组件的 `FileManager` 路径。其他小组件的路径、绝对路径和越界路径不会被读取。

## QuickLook

```js
const fm = FileManager.local()
const file = fm.documents() + "manual.pdf"
await QuickLook.present(file)
```

`QuickLook.present()` 接受当前小组件的虚拟文件路径或 HTTPS URL，并在预览关闭后继续执行。远程预览限制为 110 MB。

## WebView

展示 HTTPS 页面：

```js
await WebView.present("https://example.com/release-notes")
```

展示 HTML：

```js
await WebView.presentHTML(`
  <meta name="viewport" content="width=device-width">
  <h1>更新说明</h1>
  <p>感谢使用。</p>
`)
```

WebView 使用临时网站数据，不向网页注入 Omni 原生接口，并阻止 HTTP 等非安全导航。

## 在 Widget Extension 中调用

这些 API 即使没有包在 `Widget.runInApp()` 里，也不会让小组件刷新失败：

| API | Widget Extension 中的结果 |
| --- | --- |
| `Alert.presentAlert()` / `presentSheet()` | 返回 `-1` |
| `ShareSheet.present()` | 返回 `{ completed: false, reason: "main_app_only" }` |
| `QuickLook.present()` / `WebView.present()` | 不展示界面，Promise 正常完成 |
| `Widget.update()` | 返回 `{ updated: false, reason: "main_app_only" }` |

这种降级只负责保证安全。若检查更新前还要请求网络，仍应使用 `Widget.runInApp()`，否则 Widget Extension 每次刷新都会执行该请求。

:::warning 等待 UI Promise
这些接口会在用户关闭界面后完成。请使用 `await`，让脚本按正确顺序继续执行。
:::

## 速查

```js
new Alert() → Alert
alert.addAction(title) → void
alert.addDestructiveAction(title) → void
alert.addCancelAction(title) → void
alert.addTextField(placeholder?, text?) → void
alert.addSecureTextField(placeholder?, text?) → void
alert.textFieldValue(index) → string | null
alert.present() → Promise<number>
alert.presentAlert() → Promise<number>
alert.presentSheet() → Promise<number>
ShareSheet.present(items) → Promise<{ completed, activityType?, reason? }>
QuickLook.present(source) → Promise<void>
WebView.present(url) → Promise<void>
WebView.presentHTML(html, baseURL?) → Promise<void>
```
