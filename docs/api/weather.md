---
sidebar_position: 7
---

# 天气

`Weather` 读取 Apple Weather（WeatherKit）数据。它使用当前位置，需要位置权限，结果会缓存约 1 小时。

## 当前天气

```js
try {
  const result = await Weather.getCurrent()
  const weather = JSON.parse(result)

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

`getCurrent()` 返回 JSON 字符串，因此需要 `JSON.parse()`。

## 当前天气常用字段

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

字段较多时，先在编辑器中查看实际结果：

```js
console.log(JSON.stringify(weather, null, 2))
```

## 今日预报

```js
const result = await Weather.getToday()
const weather = JSON.parse(result)
const today = weather.forecast[0]

this.high = Math.trunc(today.highTemperature.value)
this.low = Math.trunc(today.lowTemperature.value)
this.icon = today.symbolName
this.rain = Math.round(today.precipitationChance * 100) + "%"
```

`forecast` 是数组。当前接口查询当天，因此通常读取第一项。

## 今日预报常用字段

| 字段 | 内容 |
| --- | --- |
| `highTemperature.value` / `lowTemperature.value` | 最高 / 最低温度 |
| `symbolName` / `condition` | 图标名称 / 天气状况 |
| `precipitationChance` | 降水概率，范围 `0...1` |
| `humidityMax` / `humidityMin` | 最高 / 最低湿度 |
| `wind.speed.value` | 风速 |
| `uvIndex.value` | 紫外线指数 |
| `sun.sunrise` / `sun.sunset` | 日出 / 日落毫秒时间戳 |
| `moon.phase` / `moon.moonrise` / `moon.moonset` | 月相、月出、月落 |
| `daytimeForecast` / `restOfDayForecast` / `overnightForecast` | 白天、剩余白天、夜间分段预报 |

## 权限与失败处理

天气依赖位置。第一次请先在主 App 中运行并允许位置权限。后台刷新可能使用缓存位置和缓存天气；如果读取失败，请保留图标、文字和数字的回退值。

## 速查

```js
Weather.getCurrent() → Promise<string> // 当前天气 JSON 字符串
Weather.getToday() → Promise<string>   // 今日预报 JSON 字符串
```
