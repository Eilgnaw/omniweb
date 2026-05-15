---
sidebar_position: 3
---
# Component Control
:::info
When building widgets and Live Activities, you can use the APIs below to control widget refresh timing and to end a Live Activity programmatically.
:::
### Widget Refresh Timing
Configure widget refreshes by combining a refresh frequency with a specific refresh time.
:::warning
- The actual refresh time is controlled by the system — even when you set a frequency and time, the system may not refresh on schedule.
- Each widget gets 40–70 refreshes per 24 hours, so you should manage the total count by adjusting both frequency and refresh time.
- In theory, the more often a widget is viewed, the more closely it follows your configured timing — the system learns and optimizes over time.
:::
#### Set Refresh Frequency
Set the frequency to control the interval until the next refresh. We recommend a minimum of 5 minutes.
``` js
//setUpdateFreq(minute)
setUpdateFreq(30)//refresh every 30 minutes
```
#### Set Refresh Time
If the widget doesn't need to refresh during a certain period, set the refresh time to the moment after that period ends.
``` js
//setUpdateTime(timestamp)
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(0, 1, 0, 0)
setUpdateTime(tomorrow.getTime())//set the next refresh time to 00:01 tomorrow
```

### Live Activity Control
You can end a Live Activity programmatically from code.
#### End Live Activity
Use this from a button action or whenever there's no more info to display.
``` js
endLiveActivity()
```
