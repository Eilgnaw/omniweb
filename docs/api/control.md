---
sidebar_position: 3
---

# 刷新与实时活动

这页包含两组能力：建议普通小组件的下次刷新时间，以及通过代码或推送控制实时活动。

## 普通小组件刷新

iOS 决定实际刷新时间。下面的 API 只能提交建议，不能创建精确定时器。

### 按间隔刷新

```js
setUpdateFreq(30) // 建议 30 分钟后再次刷新
```

参数单位为分钟。不要设置过短的间隔；频繁刷新会被系统合并或推迟。

### 在指定时间后刷新

```js
const next = new Date()
next.setDate(next.getDate() + 1)
next.setHours(7, 0, 0, 0)

setUpdateTime(next.getTime())
```

参数是毫秒时间戳。适合“夜间不必更新，明早再刷新”一类场景。

:::warning 刷新不是准点闹钟
小组件被查看得越多，系统通常越愿意分配刷新机会，但任何建议都可能提前、延后或被跳过。秒级变化请使用 [Date 组件](../components/date.md)或实时活动。
:::

## 在 JS 中结束实时活动

```js
endLiveActivity()
```

可以放在实时活动的 Button 代码中，或在没有内容可展示时调用。

## 通过推送控制实时活动

推送可以远程启动、更新和结束实时活动。

### 先完成准备

1. 在实时活动编辑页右上角菜单中点**复制推送 curl**。
2. 保存其中的接口地址、`user_id` 和 `widget_id`。
3. 让服务器计算要显示的变量，并把它们编码进 `content_state.data`。

:::warning 推送不会运行实时活动的 JavaScript
远程 `start`、`update` 和 `end` 只使用 `content_state.data` 中的变量渲染。它们不会执行实时活动 JS，也不会自动联网。所有值都要由服务器或调用方提前准备。
:::

### 使用前提

- 远程启动需要 iOS 17.2 或更高版本。
- 设备至少打开过一次 App，App 才能上传系统需要的推送信息。
- 用户只需管理 App 中显示的一个 Push ID，也就是 `user_id`。不要向用户暴露 APNs Token。
- `start`、`update`、`end` 使用同一组 `user_id` 和 `widget_id`。
- 推送启动后，系统会异步建立更新通道。第一次 `update` 请等待几秒。

### 请求地址

| 环境 | 地址 |
| --- | --- |
| 正式 | `POST https://omni.umiibo.app/api/push` |
| 调试 | `POST https://omni.umiibo.app/api/sandbox/push` |

### 请求字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `user_id` | ✓ | App 中显示的 Push ID |
| `widget_id` | ✓ | 实时活动小组件 ID |
| `type` | ✓ | `start`、`update` 或 `end` |
| `content_state` |  | 渲染变量；`data` 必须是 JSON 字符串 |
| `alert_title` |  | 仅 `start` 使用的提醒标题 |
| `alert_body` |  | 仅 `start` 使用的提醒内容 |
| `sound_mode` |  | `custom`、`system` 或 `silent`；默认 `custom` |
| `sound` |  | 兼容旧客户端的自定义声音文件名 |
| `silent` |  | 兼容旧客户端；`true` 时优先静默 |
| `timestamp` | ✓ | 当前秒级 Unix 时间戳 |
| `nonce` | ✓ | 每次请求都不同的随机字符串 |

### `content_state.data` 是字符串

外层请求是 JSON，但 `data` 里面还要再放一层 JSON 字符串：

```json
{
  "content_state": {
    "isLoading": false,
    "data": "{\"title\":\"进行中\",\"count\":1}"
  }
}
```

布局里的 `${title}` 和 `${count}` 会读取这层数据。

### 启动

```bash
curl -X POST https://omni.umiibo.app/api/push \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "你的 Push ID",
    "widget_id": "实时活动小组件 ID",
    "type": "start",
    "sound_mode": "custom",
    "content_state": {
      "isLoading": false,
      "data": "{\"title\":\"进行中\",\"count\":1}"
    },
    "alert_title": "实时活动已启动",
    "alert_body": "新的实时活动正在显示",
    "timestamp": 1910000000,
    "nonce": "start-001"
  }'
```

请在实际请求中生成当前时间戳和唯一 `nonce`，不要照抄示例值。

### 更新

沿用相同的 `user_id` 与 `widget_id`，把 `type` 改为 `update`，并更新变量：

```json
{
  "type": "update",
  "content_state": {
    "isLoading": false,
    "data": "{\"title\":\"已更新\",\"count\":2}"
  }
}
```

请求仍然必须包含新的 `timestamp` 和 `nonce`。

### 结束

把 `type` 改为 `end`。可以同时发送最后一组展示变量：

```json
{
  "type": "end",
  "content_state": {
    "isLoading": false,
    "data": "{\"title\":\"已结束\"}"
  }
}
```

请求仍然必须包含同一组 `user_id`、`widget_id`，以及新的 `timestamp` 和 `nonce`。

## 推送声音

| `sound_mode` | 行为 |
| --- | --- |
| `custom` | 播放 App 内置的 `push_click.caf` |
| `system` | 播放系统默认声音 |
| `silent` | 静默推送 |

旧字段 `sound` 可以指定 App 内置声音文件，`silent: true` 会覆盖其他声音设置。

## 速查

```js
setUpdateFreq(minutes) → void
setUpdateTime(timestampMs) → void
endLiveActivity() → void

POST /api/push type="start"  // 远程启动
POST /api/push type="update" // 更新变量
POST /api/push type="end"    // 结束活动
```
