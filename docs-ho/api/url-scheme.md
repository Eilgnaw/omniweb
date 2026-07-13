---
sidebar_position: 9
---

# 外部调用 URL Scheme 与 AppLink

Omni Widgets 支持用外部调用链接触发 App 内动作。可以放在系统快捷指令、其它 App、二维码,也可以从卡片 JS 里用 `Widget.openUrl()` 打开。

协议展示为 `OmniWidgets://`,实际匹配不区分大小写。

也可以使用文档站域名的 HTTPS AppLink。已安装 App 时,系统会尝试直接交给 Omni Widgets；未安装或系统未接管时,会回退到文档站下载页。

AppLink 基础地址:

```text
https://omni.2f0.cn/ho/app/
```

## 运行卡片

```text
OmniWidgets://run-widget/<卡片 ID>?city=Shanghai&count=10
```

打开后会运行这张卡片已经保存的逻辑。URL 只能选择本地卡片,不能把任意代码放进 URL 执行。

对应的 AppLink:

```text
https://omni.2f0.cn/ho/app/run-widget/<卡片 ID>?city=Shanghai&count=10
```

查询参数会注入到 `$params`:

```js
const city = $params.city || "Beijing"
const count = Number($params.count || 0)

Config.set("lastCity", city)
console.log("run from url", city, count)
```

:::warning 不会自动刷新卡片
`run-widget` 默认只运行卡片逻辑。`Config.set()`、`FileManager.write()` 等结果会保存,但桌面 / 锁屏卡片不会立刻重绘;等下次刷新时才会显示新结果。
:::

## 获取当前卡片链接

```js
console.log(Widget.id)
console.log(Widget.name)
console.log(Widget.kind)
console.log(Widget.dimension)
console.log(Widget.urlscheme)
```

`Widget.urlscheme` 会返回当前卡片的运行链接:

```js
const url = Widget.urlscheme + "?source=button"
Widget.openUrl(url)
```

## 控制闪控球

```text
OmniWidgets://floating-ball/start
OmniWidgets://floating-ball/stop
OmniWidgets://floating-ball/toggle
```

| URL | 说明 |
|---|---|
| `OmniWidgets://floating-ball/start` | 启动闪控球 |
| `OmniWidgets://floating-ball/stop` | 停止闪控球 |
| `OmniWidgets://floating-ball/toggle` | 已启动则停止,未启动则启动 |

首次启动可能会弹出系统授权。拒绝后不会启动闪控球。

对应的 AppLink:

```text
https://omni.2f0.cn/ho/app/floating-ball/start
https://omni.2f0.cn/ho/app/floating-ball/stop
https://omni.2f0.cn/ho/app/floating-ball/toggle
```

## 打开指定应用

```text
OmniWidgets://open-app/<应用包名>?ability=EntryAbility
OmniWidgets://open-app/<应用包名>?ability=EntryAbility&module=entry
```

打开应用需要提供应用包名和 `ability`。只有目标应用还需要模块名时,再加 `module`。

卡片逻辑里也可以这样打开:

```js
Widget.openUrl("OmniWidgets://open-app/com.huawei.hmos.calendar?ability=MainAbility")
```

对应的 AppLink:

```text
https://omni.2f0.cn/ho/app/open-app/com.huawei.hmos.calendar?ability=MainAbility
```

## 使用 AGC App Linking

如果要使用 AppGallery Connect 创建短链接、统计链接或支持安装后的延迟跳转,需要在 AppGallery Connect 中启用 App Linking,并将 URL 前缀配置为文档站域名。

项目维护者需要配置以下信息,卡片作者不需要填写:

```text
AGC App ID: <AGC_APP_ID>
URL 前缀: https://omni.2f0.cn
未安装回退地址: https://omni.2f0.cn/download
签名证书 SHA-256: <APP_SIGNING_CERTIFICATE_SHA256>
```

AppLink 的实际 deep link 仍使用本页的 `/ho/app/` 路径规则。

## 速查

```text
OmniWidgets://run-widget/<widgetId>
OmniWidgets://run-widget/<widgetId>?key=value

OmniWidgets://floating-ball/start
OmniWidgets://floating-ball/stop
OmniWidgets://floating-ball/toggle

OmniWidgets://open-app/<bundleName>?ability=EntryAbility
OmniWidgets://open-app/<bundleName>?ability=EntryAbility&module=entry

https://omni.2f0.cn/ho/app/run-widget/<widgetId>?key=value
https://omni.2f0.cn/ho/app/floating-ball/start
https://omni.2f0.cn/ho/app/floating-ball/stop
https://omni.2f0.cn/ho/app/floating-ball/toggle
https://omni.2f0.cn/ho/app/open-app/<bundleName>?ability=EntryAbility
https://omni.2f0.cn/ho/app/open-app/<bundleName>?ability=EntryAbility&module=entry
```

## 注意事项

- query 参数值在 `$params` 里都是字符串。
- 重复参数名以后面的值为准。
- 找不到卡片、运行报错或超时时,结果会写入最近一次输出和日志。
- AppLink 未被系统接管时,会打开文档站下载页。
- 运行卡片、目标应用或闪控球动作不存在时,App 内会显示最近一次外部调用结果。
