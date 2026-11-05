---
sidebar_position: 9
---

# 日历

`Calendar` 可以读取未来一个月的系统日历事件，也可以计算农历和日期差。

| 目标 | 使用 |
| --- | --- |
| 读取日历事件 | `Calendar.getEvents()` |
| 显示今天的农历 | `Calendar.lunarDate()` |
| 做生日或节日倒计时 | `daysUntilSolar()` / `daysUntilLunar()` |
| 计算两个日期相差几天 | `daysBetween()` / `daysFromNow()` |

## 读取未来一个月的事件

```js
try {
  const result = await Calendar.getEvents()
  const events = JSON.parse(result)
  this.events = events.slice(0, 3)
} catch (error) {
  console.error("日历读取失败：", error)
  this.events = []
}
```

每条事件包含：

| 字段 | 内容 |
| --- | --- |
| `title` | 标题 |
| `startDate` / `endDate` | 开始 / 结束时间字符串 |
| `notes` | 备注 |
| `color` | 来源日历的十六进制颜色 |

用一个 VStack 设置循环数据源 `${events[event]}`，子组件可以显示 `${event.title}` 和 `${event.startDate}`。

:::warning 先在主 App 中授权
第一次调用 `getEvents()` 会请求日历“完整访问”。小组件后台刷新不能弹权限框；请先在编辑器中运行一次并完成授权。
:::

## 显示今天的农历

```js
this.fullLunar = Calendar.lunarDate()
this.shortLunar = Calendar.getLunarDate()
```

- `lunarDate()` 返回较完整的中文日期。
- `getLunarDate()` 返回适合紧凑展示的干支年月日字符串。

## 读取农历分量

```js
this.year = Calendar.lunarYear()            // 甲子循环中的 1...60
this.month = Calendar.lunarMonth()          // 1...12
this.day = Calendar.lunarDay()              // 1...30
this.isLeap = Calendar.isLunarLeapMonth()   // true / false
this.zodiac = Calendar.zodiac()             // 生肖
this.ganZhi = Calendar.ganZhi()             // 天干地支
```

`lunarYear()` 不是公历年份。需要“甲辰”“丙午”一类文字时，直接使用 `ganZhi()`。

## 距离下一个节日还有几天

```js
this.springFestival = Calendar.daysUntilLunar(1, 1)
this.christmas = Calendar.daysUntilSolar(12, 25)
```

参数是月和日。当天返回 `0`；今年已经错过时，会计算下一年。

## 计算日期差

```js
this.daysLeft = Calendar.daysFromNow("2030-01-01")
this.span = Calendar.daysBetween("2030-01-01", "2030-05-15")
```

- `daysFromNow()` 返回“目标日期 - 今天”，未来为正，过去为负。
- `daysBetween()` 返回“第二个日期 - 第一个日期”。
- 日期支持 `YYYY-MM-DD`、`YYYY/MM/DD`、`YYYY.MM.DD`。解析失败时返回 `0`。

## 公历转农历

```js
this.lunar = Calendar.lunarFromSolar("2030-02-03")
```

解析失败时返回空字符串。

## 速查

```js
Calendar.getEvents() → Promise<string>
Calendar.lunarDate() → string
Calendar.getLunarDate() → string
Calendar.lunarYear() → number
Calendar.lunarMonth() → number
Calendar.lunarDay() → number
Calendar.isLunarLeapMonth() → boolean
Calendar.zodiac() → string
Calendar.ganZhi() → string
Calendar.daysUntilLunar(month, day) → number
Calendar.daysUntilSolar(month, day) → number
Calendar.daysFromNow(ymd) → number
Calendar.daysBetween(from, to) → number
Calendar.lunarFromSolar(ymd) → string
```
