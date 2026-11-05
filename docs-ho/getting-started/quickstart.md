---
sidebar_position: 4
---

# 速查地图

第一次使用请先看[做出第一个卡片](./first-widget.md)。已经熟悉编辑器时，可以从这里直接跳到答案。

## 常用语法

```text
${name}          普通值
${user.name}     对象字段
${list.0}        数组项
{rows[row]}      容器的循环数据源
```

## 常用 JavaScript

```js
const data = await new Request(url).fetchJSON()

Config.set("count", 1)
const count = Config.get("count", 0)

const city = Setting.string("city") || "北京"

setUpdateFreq(30)
console.log(data)
```

## 卡片形态

| 位置 | 尺寸 | 添加方式 |
| --- | --- | --- |
| 桌面 | `1*2`、`2*2`、`2*4`、`4*4` | 编辑页“更多 → 添加至桌面” |
| 锁屏 | `lock_1*1`、`lock_1*2` | 先添加锁屏卡片位，再选择同尺寸卡片 |

## 按目标找 API

| 目标 | 文档 |
| --- | --- |
| 保存状态、共享数据、用户设置 | [配置与设置](../api/config.md) |
| 发起 HTTP 请求 | [网络请求](../api/network.md) |
| 下载图片、读写文件 | [文件读写](../api/fileManager.md) |
| 获取设备和屏幕信息 | [设备信息](../api/device.md) |
| 获取坐标和地址 | [位置信息](../api/location.md) |
| 控制刷新、判断调试环境 | [卡片控制](../api/control.md) |
| 接收闪控球文字识别结果 | [捷径参数](../api/shortcut.md) |
| 从外部运行卡片或打开 App | [URL Scheme 与 AppLink](../api/url-scheme.md) |

## 按目标找组件

| 目标 | 组件 |
| --- | --- |
| 显示普通文字 | [文字](../components/text.md) |
| 显示系统时间 | [时钟](../components/text-clock.md) |
| 正计时或倒计时 | [计时器](../components/text-timer.md) |
| 显示网络或本地图片 | [图片](../components/image.md) |
| 显示系统符号或 Emoji | [图标](../components/icon.md) |
| 生成可扫码内容 | [二维码](../components/qrcode.md) |
| 组织横向、纵向或叠层布局 | [容器](../components/stack.md) |
| 点击后运行代码 | [按钮](../components/button.md) |
| 固定行列展示 | [网格](../components/grid.md) |
| 可滚动长内容 | [列表](../components/list.md) |
| 显示进度 | [仪表](../components/gauge.md) |
| 绘制图表和路径 | [画布](../components/canvas.md) |
| 推开相邻内容 | [占位](../components/blank.md) |
