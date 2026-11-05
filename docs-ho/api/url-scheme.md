---
sidebar_position: 9
---

# URL Scheme 与 AppLink

外部链接可以运行一张卡片、控制闪控球，或打开指定应用。可以把链接放进系统快捷指令、其他 App、二维码或容器的“打开链接”。

协议写作 `OmniWidgets://`，匹配时不区分大小写。HTTPS AppLink 使用：

```text
https://omni.2f0.cn/ho/app/
```

## 运行卡片

```text
OmniWidgets://run-widget/<卡片 ID>
OmniWidgets://run-widget/<卡片 ID>?city=Shanghai&count=10
```

AppLink：

```text
https://omni.2f0.cn/ho/app/run-widget/<卡片 ID>?city=Shanghai&count=10
```

查询参数会进入 `$params`，值都是字符串：

```js
const city = $params.city || "Beijing"
const count = Number($params.count || 0)

Config.set("lastCity", city)
```

:::warning 运行后不会立即重绘桌面卡片
配置和文件会保存，但桌面或锁屏内容通常要等下一次系统刷新才会变化。
:::

## 当前卡片的运行链接

```js
console.log(Widget.id)
console.log(Widget.name)
console.log(Widget.kind)
console.log(Widget.dimension)
console.log(Widget.urlscheme)
```

```js
Widget.openUrl(Widget.urlscheme + "?source=button")
```

## 控制闪控球

```text
OmniWidgets://floating-ball/start
OmniWidgets://floating-ball/stop
OmniWidgets://floating-ball/toggle
```

对应 AppLink：

```text
https://omni.2f0.cn/ho/app/floating-ball/start
https://omni.2f0.cn/ho/app/floating-ball/stop
https://omni.2f0.cn/ho/app/floating-ball/toggle
```

首次启动可能需要系统授权。

## 打开指定应用

```text
OmniWidgets://open-app/<包名>?ability=EntryAbility
OmniWidgets://open-app/<包名>?ability=EntryAbility&module=entry
```

AppLink：

```text
https://omni.2f0.cn/ho/app/open-app/<包名>?ability=EntryAbility
```

只有目标应用需要模块名时才添加 `module`。

## 速查

```text
OmniWidgets://run-widget/<widgetId>?key=value
OmniWidgets://floating-ball/start|stop|toggle
OmniWidgets://open-app/<bundleName>?ability=<abilityName>&module=<moduleName>

https://omni.2f0.cn/ho/app/run-widget/<widgetId>?key=value
https://omni.2f0.cn/ho/app/floating-ball/start|stop|toggle
https://omni.2f0.cn/ho/app/open-app/<bundleName>?ability=<abilityName>
```

## 注意事项

- 找不到卡片、运行报错或超时时，可以在 App 中查看最近一次外部调用结果。
- AppLink 未被系统交给 Omni 时，会回退到文档站下载页。
- 重复查询参数以后面的值为准。
