---
sidebar_position: 3
---
# 组件控制

:::info
在制作小组件和实时活动时,可以使用以下接口控制小组件刷新时间,也可以用代码或推送结束实时活动。
:::

### 小组件刷新时间
小组件刷新时间设置,可使用刷新频率和指定刷新时间组合使用。

:::warning
- 小组件真正的刷新时间由系统控制,即使设置刷新频率和时间,也可能不会按时刷新。
- 每个小组件 24 小时内刷新次数为 40-70 次,应通过设置频率和刷新时间控制刷新总次数。
- 理论上小组件展示次数越多,就会越符合设定的时间,这需要系统学习优化。
:::

#### 设置刷新频率
通过设置刷新频率,可以控制小组件下一次刷新时间间隔,建议最小设置为 5 分钟。

```js
// setUpdateFreq(minute)
setUpdateFreq(30) // 每 30 分钟刷新一次
```

#### 设置刷新时间
当某个时间段小组件不需要刷新,可以将刷新时间设置为这个时间段结束后的时间。

```js
// setUpdateTime(timestamp)
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(0, 1, 0, 0)
setUpdateTime(tomorrow.getTime()) // 设置下一次刷新时间为第二天 00:01
```

### 实时活动控制
实时活动可以在 JS 里主动结束,也可以通过推送远程启动、更新、结束。推送接口只接收变量,不会运行实时活动里的 JS 代码。

#### 结束当前实时活动
可以用于按键执行,或者当没有信息要显示的时候主动结束。

```js
endLiveActivity()
```

#### 推送前准备
- 在实时活动编辑页右上角菜单点击"复制推送 curl",可以拿到接口地址、`user_id`、`widget_id` 和一份 `start` 示例。
- 对外只需要使用一个用户可见的 Push ID,也就是请求里的 `user_id`;启动、更新、结束都配合同一个 `widget_id` 使用。
- 不要让用户管理 APNs 信息。App 会自动上报推送所需信息,后台会维护 Push ID、设备和实时活动之间的绑定关系。
- 设备需要至少打开过一次 App,后台才能拿到远程启动实时活动所需的系统信息。
- 通过推送启动后,系统会异步建立后续更新通道;第一次 `update` 建议等几秒再发送。
- 推送启动需要 iOS 17.2 或更高版本。旧系统只能更新或结束已经在本机启动过的实时活动。

:::warning
通过推送启动、更新、结束实时活动时,只会使用 `content_state.data` 里的变量渲染界面。不会执行实时活动的 JS 代码,也不会自动联网请求数据。需要展示的变量要由你的服务器或调用方提前算好后推过来。
:::

#### 请求地址
正式环境:

```text
POST https://omni.umiibo.app/api/push
```

调试环境:

```text
POST https://omni.umiibo.app/api/sandbox/push
```

#### 请求字段
| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `user_id` | ✓ | App 里的 Push ID。 |
| `widget_id` | ✓ | 实时活动组件 ID。 |
| `type` | ✓ | `start` 启动,`update` 更新,`end` 结束。 |
| `content_state` |  | 实时活动变量。`data` 是一个 JSON 字符串。 |
| `alert_title` |  | 仅 `start` 使用,启动实时活动时显示的提醒标题。 |
| `alert_body` |  | 仅 `start` 使用,启动实时活动时显示的提醒内容。 |
| `sound_mode` |  | 推送声音模式:`custom` 使用内置提示音,`system` 使用系统默认提示音,`silent` 静默。未传时默认 `custom`。 |
| `sound` |  | 兼容旧字段,可选自定义声音文件名。 |
| `silent` |  | 兼容旧字段,设为 `true` 时静默推送,优先级高于 `sound_mode` 和 `sound`。 |
| `timestamp` | ✓ | 当前秒级时间戳。 |
| `nonce` | ✓ | 每次请求都不同的随机字符串。 |

#### 推送声音
默认会播放 App 内置的 `push_click.caf`。每次请求都可以通过 `sound_mode` 改变声音:

- `custom`:播放 App 内置提示音 `push_click.caf`。
- `system`:播放系统默认提示音。
- `silent`:静默推送,不播放声音。

如果你还在使用旧字段,`sound: "xxx.caf"` 可以指定 App 内置的自定义声音文件,`silent: true` 会强制静默。

#### 启动实时活动
复制出来的 curl 默认就是 `start`。确认初始变量后直接发送即可。`widget_id` 对应本机已经保存的实时活动组件,否则界面无法按预期渲染。

```bash
curl -X POST https://omni.umiibo.app/api/push \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "你的 Push ID",
    "widget_id": "实时活动组件 ID",
    "type": "start",
    "sound_mode": "custom",
    "content_state": {
      "isLoading": false,
      "data": "{\"title\":\"进行中\",\"count\":1}"
    },
    "alert_title": "实时活动已启动",
    "alert_body": "新的实时活动正在显示",
    "timestamp": 1710000000,
    "nonce": "start-001"
  }'
```

#### 更新实时活动
`update` 只更新变量。把布局里会用到的变量放进 `content_state.data`。

```bash
curl -X POST https://omni.umiibo.app/api/push \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "你的 Push ID",
    "widget_id": "实时活动组件 ID",
    "type": "update",
    "sound_mode": "custom",
    "content_state": {
      "isLoading": false,
      "data": "{\"title\":\"已更新\",\"count\":2}"
    },
    "timestamp": 1710000001,
    "nonce": "update-001"
  }'
```

#### 结束实时活动
`end` 会结束当前 `widget_id` 对应的实时活动。可以带上最后一次展示用的变量,也可以只发最小请求。

```bash
curl -X POST https://omni.umiibo.app/api/push \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "你的 Push ID",
    "widget_id": "实时活动组件 ID",
    "type": "end",
    "sound_mode": "custom",
    "content_state": {
      "isLoading": false,
      "data": "{\"title\":\"已结束\"}"
    },
    "timestamp": 1710000002,
    "nonce": "end-001"
  }'
```

### 速查
```js
setUpdateFreq(minute) → void        // 建议系统多少分钟后刷新小组件
setUpdateTime(timestamp) → void     // 指定下一次刷新时间
endLiveActivity() → void            // 结束当前实时活动
POST /api/push type="start"         // 推送启动实时活动
POST /api/push type="update"        // 推送更新实时活动变量
POST /api/push type="end"           // 推送结束实时活动
POST /api/push sound_mode="custom|system|silent" // 指定推送声音
```
