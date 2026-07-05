---
sidebar_position: 3
---
# Component Control

:::info
When building widgets and Live Activities, you can use the APIs below to control widget refresh timing, and you can end a Live Activity from code or push.
:::

### Widget Refresh Timing
Configure widget refreshes by combining a refresh frequency with a specific refresh time.

:::warning
- The actual refresh time is controlled by the system. Even when you set a frequency and time, the system may not refresh on schedule.
- Each widget gets 40-70 refreshes per 24 hours, so you should manage the total count by adjusting both frequency and refresh time.
- In theory, the more often a widget is viewed, the more closely it follows your configured timing. The system learns and optimizes over time.
:::

#### Set Refresh Frequency
Set the frequency to control the interval until the next refresh. We recommend a minimum of 5 minutes.

```js
// setUpdateFreq(minute)
setUpdateFreq(30) // refresh every 30 minutes
```

#### Set Refresh Time
If the widget doesn't need to refresh during a certain period, set the refresh time to the moment after that period ends.

```js
// setUpdateTime(timestamp)
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(0, 1, 0, 0)
setUpdateTime(tomorrow.getTime()) // set the next refresh time to 00:01 tomorrow
```

### Live Activity Control
You can end a Live Activity from JS, and you can remotely start, update, and end it with push. The push API only accepts variables. It doesn't run the JS code inside the Live Activity.

#### End Current Live Activity
Use this from a button action or whenever there's no more info to display.

```js
endLiveActivity()
```

#### Before Sending Pushes
- In the Live Activity editor, open the top-right menu and tap "Copy push curl" to get the API URL, `user_id`, `widget_id`, and a `start` example.
- Users only need one visible Push ID, which is the `user_id` in the request. Use the same `widget_id` for start, update, and end.
- Don't ask users to manage APNs details. The app uploads the information needed for push automatically, and the backend keeps the Push ID, device, and Live Activity bound together.
- The device needs to open the app at least once before the backend can receive the system information required for remote start.
- After a Live Activity starts from push, the system creates the follow-up update channel asynchronously. Wait a few seconds before sending the first `update`.
- Remote start requires iOS 17.2 or later. Older systems can only update or end a Live Activity that has already been started on the device.

:::warning
When you start, update, or end a Live Activity with push, the UI only renders variables from `content_state.data`. It won't run Live Activity JS, and it won't fetch network data automatically. Your server or caller needs to calculate the values first and push them in.
:::

#### Request URL
Production:

```text
POST https://omni.umiibo.app/api/push
```

Sandbox:

```text
POST https://omni.umiibo.app/api/sandbox/push
```

#### Request Fields
| Field | Required | Description |
| --- | --- | --- |
| `user_id` | ✓ | The Push ID shown in the app. |
| `widget_id` | ✓ | The Live Activity widget ID. |
| `type` | ✓ | `start` to start, `update` to update, `end` to end. |
| `content_state` |  | Live Activity variables. `data` is a JSON string. |
| `alert_title` |  | Used only by `start`. The notification title shown when the Live Activity starts. |
| `alert_body` |  | Used only by `start`. The notification body shown when the Live Activity starts. |
| `sound_mode` |  | Push sound mode: `custom` uses the bundled sound, `system` uses the system default sound, and `silent` sends a silent push. The default is `custom`. |
| `sound` |  | Legacy field for an optional custom sound filename. |
| `silent` |  | Legacy field. Set it to `true` for a silent push. It wins over `sound_mode` and `sound`. |
| `timestamp` | ✓ | Current Unix timestamp in seconds. |
| `nonce` | ✓ | A random string that must be different for every request. |

#### Push Sound
By default, pushes play the bundled `push_click.caf` sound. You can change the sound per request with `sound_mode`:

- `custom`: play the bundled `push_click.caf` sound.
- `system`: play the system default sound.
- `silent`: send a silent push with no sound.

If you're still using the legacy fields, `sound: "xxx.caf"` can name a custom bundled sound file, and `silent: true` forces a silent push.

#### Start a Live Activity
The copied curl already uses `start` by default. Check the initial variables, then send it directly. `widget_id` must point to a Live Activity widget saved on the device, otherwise the UI can't render as expected.

```bash
curl -X POST https://omni.umiibo.app/api/push \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "your Push ID",
    "widget_id": "Live Activity widget ID",
    "type": "start",
    "sound_mode": "custom",
    "content_state": {
      "isLoading": false,
      "data": "{\"title\":\"Running\",\"count\":1}"
    },
    "alert_title": "Live Activity started",
    "alert_body": "A new Live Activity is now showing",
    "timestamp": 1710000000,
    "nonce": "start-001"
  }'
```

#### Update a Live Activity
`update` only updates variables. Put the values used by your layout into `content_state.data`.

```bash
curl -X POST https://omni.umiibo.app/api/push \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "your Push ID",
    "widget_id": "Live Activity widget ID",
    "type": "update",
    "sound_mode": "custom",
    "content_state": {
      "isLoading": false,
      "data": "{\"title\":\"Updated\",\"count\":2}"
    },
    "timestamp": 1710000001,
    "nonce": "update-001"
  }'
```

#### End a Live Activity
`end` ends the Live Activity for the current `widget_id`. You can include final variables for the last display state, or send only the minimal request.

```bash
curl -X POST https://omni.umiibo.app/api/push \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "your Push ID",
    "widget_id": "Live Activity widget ID",
    "type": "end",
    "sound_mode": "custom",
    "content_state": {
      "isLoading": false,
      "data": "{\"title\":\"Ended\"}"
    },
    "timestamp": 1710000002,
    "nonce": "end-001"
  }'
```

### Quick Reference
```js
setUpdateFreq(minute) → void        // suggest a widget refresh after this many minutes
setUpdateTime(timestamp) → void     // set the next refresh time
endLiveActivity() → void            // end the current Live Activity
POST /api/push type="start"         // start a Live Activity with push
POST /api/push type="update"        // update Live Activity variables with push
POST /api/push type="end"           // end a Live Activity with push
POST /api/push sound_mode="custom|system|silent" // choose the push sound
```
