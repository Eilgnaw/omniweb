---
sidebar_position: 7
---

# 天气

`Weather` 读取 Apple Weather（WeatherKit）数据。它使用当前位置，需要位置权限。推荐接口直接返回 JavaScript 对象，不需要 `JSON.parse()`。

## 当前天气

```js
try {
  const weather = await Weather.current()

  this.icon = weather.symbolName
  this.condition = weather.condition
  this.temperature = Math.trunc(weather.temperature.value)
  this.feelsLike = Math.trunc(weather.apparentTemperature.value)
  this.humidity = Math.round(weather.humidity * 100) + "%"
} catch (error) {
  console.error("天气获取失败：", error)
  this.icon = "exclamationmark.triangle.fill"
  this.condition = "暂时无法获取天气"
  this.temperature = "--"
}
```

### 当前天气常用字段

| 字段 | 内容 |
| --- | --- |
| `symbolName` | 可直接给 [Icon](../components/icon.md) 使用的 SF Symbol 名称 |
| `condition` | WeatherKit 天气状况字符串 |
| `temperature.value` | 温度，单位 °C |
| `apparentTemperature.value` | 体感温度 |
| `humidity` | 湿度，范围 `0...1` |
| `pressure.value` | 气压，单位 mbar |
| `pressureTrend` | `rising`、`falling` 或 `steady` |
| `wind.speed.value` | 风速，单位 km/h |
| `wind.compassDirection` | 风向，例如 `north`、`east` |
| `visibility.value` | 能见度，单位 m |
| `uvIndex.value` | 紫外线指数 |
| `cloudCover` | 云量，范围 `0...1` |
| `isDaylight` | 是否为白天 |
| `precipitationIntensity.value` | 降水强度 |
| `dewPoint.value` | 露点温度 |

字段较多时，可以在编辑器中查看完整对象：

```js
console.log(JSON.stringify(weather, null, 2))
```

## 今日与多日预报

`today()` 返回只包含今天的预报对象：

```js
const result = await Weather.today()
const today = result.forecast[0]

this.high = Math.trunc(today.highTemperature.value)
this.low = Math.trunc(today.lowTemperature.value)
this.icon = today.symbolName
this.rain = Math.round(today.precipitationChance * 100) + "%"
```

读取未来多天时使用 `daily(days?)`。默认返回 10 天，也可以指定 `1...10`：

```js
const daily = await Weather.daily(7)
this.days = daily.forecast.map(day => ({
  date: day.date,
  high: Math.trunc(day.highTemperature.value),
  low: Math.trunc(day.lowTemperature.value),
  icon: day.symbolName
}))
```

### 日预报常用字段

| 字段 | 内容 |
| --- | --- |
| `date` | 当天开始时间，毫秒时间戳 |
| `highTemperature.value` / `lowTemperature.value` | 最高 / 最低温度 |
| `symbolName` / `condition` | 图标名称 / 天气状况 |
| `precipitationChance` | 降水概率，范围 `0...1` |
| `minimumHumidity` / `maximumHumidity` | 最低 / 最高湿度 |
| `wind.speed.value` | 风速 |
| `uvIndex.value` | 紫外线指数 |
| `sun.sunrise` / `sun.sunset` | 日出 / 日落毫秒时间戳 |
| `moon.phase` / `moon.moonrise` / `moon.moonset` | 月相、月出、月落 |
| `daytimeForecast` / `restOfDayForecast` / `overnightForecast` | 白天、剩余白天、夜间分段预报 |

## 按小时预报

`hourly(hours?)` 默认返回从当前小时开始的 25 小时，最多可请求 240 小时：

```js
const hourly = await Weather.hourly(24)
this.hours = hourly.forecast.map(hour => ({
  date: hour.date,
  temperature: Math.trunc(hour.temperature.value),
  icon: hour.symbolName,
  rain: Math.round(hour.precipitationChance * 100)
}))
```

小时预报还包含体感温度、湿度、风、能见度、紫外线、云量、露点和降水类型等字段。

## 分钟降水

分钟预报是否可用取决于地区。不可用时 `minute()` 返回 `null`：

```js
const availability = await Weather.availability()
const minute = await Weather.minute()

if (availability.minuteAvailability === "available" && minute) {
  this.nextHour = minute.forecast.map(item => ({
    date: item.date,
    chance: Math.round(item.precipitationChance * 100),
    intensity: item.precipitationIntensity.value
  }))
} else {
  this.nextHour = []
}
```

`availability()` 还会返回 `alertAvailability`，其值可能是 `available`、`temporarilyUnavailable`、`unsupported` 或 `unknown`。

## 天气预警

`alerts()` 始终返回数组；当前没有预警时返回 `[]`：

```js
const alerts = await Weather.alerts()
this.alerts = alerts.map(alert => ({
  summary: alert.summary,
  severity: alert.severity,
  region: alert.region || "",
  source: alert.source,
  detailsURL: alert.detailsURL
}))
```

显示预警时请保留 `source` 和 `detailsURL`，它们是预警来源信息的一部分。

## 缓存、权限与错误

天气使用当前位置。第一次请先在主 App 中运行并允许位置权限。后台刷新可能使用缓存位置；如果没有可用位置，Promise 会被拒绝。

预报会优先按照 WeatherKit 返回的过期时间缓存。没有过期时间时，分钟数据缓存约 5 分钟，当前天气、小时预报和预警约 15 分钟，日预报和可用性约 60 分钟。小时数或天数超出支持范围时，调用也会失败。

## 旧版字符串接口

旧组件可以继续使用以下接口，它们仍返回 JSON 字符串：

```js
const weather = JSON.parse(await Weather.getCurrent())
const today = JSON.parse(await Weather.getToday())
```

`getWeather()` 是 `getCurrent()` 的旧别名。新代码请使用 `current()`、`today()` 等对象接口。

## 速查

```js
Weather.current() → Promise<object>           // 当前天气
Weather.today() → Promise<object>             // 今日 Forecast 对象
Weather.minute() → Promise<object | null>      // 下一小时分钟预报
Weather.hourly(hours?) → Promise<object>       // 默认 25，范围 1...240
Weather.daily(days?) → Promise<object>         // 默认 10，范围 1...10
Weather.alerts() → Promise<object[]>           // 天气预警，无预警时为 []
Weather.availability() → Promise<object>       // 分钟预报与预警可用性
Weather.getWeather() → Promise<string>         // 旧版当前天气 JSON 字符串
Weather.getCurrent() → Promise<string>         // 旧版当前天气 JSON 字符串
Weather.getToday() → Promise<string>           // 旧版今日预报 JSON 字符串
```
