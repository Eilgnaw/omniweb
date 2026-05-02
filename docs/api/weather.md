---
sidebar_position: 7
---

# 天气

天气数据来自 **Apple Weather**(WeatherKit),数据每小时更新一次。**需要"位置"权限**。

## 当前天气

```js
try {
  const result = await Weather.getCurrent()
  const obj = JSON.parse(result)

  this.icon = obj.symbolName                       // SF Symbol 图标名
  this.text = obj.condition                        // 状况:mostlyCloudy / sunny ...
  this.temp = Math.trunc(obj.temperature.value)    // 温度
  this.feel = Math.trunc(obj.apparentTemperature.value)  // 体感温度
  this.hum  = Math.round(obj.humidity * 100) + "%" // 湿度
} catch (error) {
  this.icon = "exclamationmark.triangle.fill"
  this.temp = "--"
  console.error("天气获取失败,检查定位权限:", error)
}
```

### 常用字段

| 字段 | 说明 |
|------|------|
| `symbolName` | SF Symbol 图标名,可直接给 [icon 组件](../components/icon.md) |
| `condition` | 天气状况字符串 |
| `temperature.value` | 温度(°C) |
| `apparentTemperature.value` | 体感温度 |
| `humidity` | 湿度,0~1 |
| `pressure.value` | 气压(mbar) |
| `pressureTrend` | 气压趋势:`rising` / `falling` / `steady` |
| `wind.speed.value` | 风速(km/h) |
| `wind.compassDirection` | 风向:`north` / `east` 等 |
| `visibility.value` | 能见度(m) |
| `uvIndex.value` | 紫外线指数 |
| `cloudCover` | 云量,0~1 |
| `isDaylight` | 是否白天 |
| `precipitationIntensity.value` | 降水强度 |
| `dewPoint.value` | 露点温度 |

<details>
<summary>完整返回字段(点开看)</summary>

```json
{
  "temperature":         {"value": 23.07, "unit": {"symbol": "°C"}},
  "apparentTemperature": {"value": 23.73, "unit": {"symbol": "°C"}},
  "dewPoint":            {"value": 16.86, "unit": {"symbol": "°C"}},
  "humidity": 0.68,
  "pressure": {"value": 1010.61, "unit": {"symbol": "mbar"}},
  "pressureTrend": "falling",
  "visibility": {"value": 22522.81, "unit": {"symbol": "m"}},
  "wind": {
    "speed":            {"value": 22.63, "unit": {"symbol": "km/h"}},
    "direction":        {"value": 182,   "unit": {"symbol": "°"}},
    "gust":             {"value": 39,    "unit": {"symbol": "km/h"}},
    "compassDirection": "south"
  },
  "uvIndex": {"value": 0, "category": "low"},
  "cloudCover":     0.84,
  "cloudCoverLow":  0.15,
  "cloudCoverMid":  0.4,
  "cloudCoverHigh": 0.92,
  "rainfallAmount":   {"pastHour": {...}, "pastSixHours": {...}, "pastTwentyFourHours": {...}},
  "snowfallAmount":   {"pastHour": {...}, "pastSixHours": {...}, "pastTwentyFourHours": {...}},
  "precipitationIntensity": {"value": 0, "unit": {"symbol": "mm/h"}},
  "condition":  "mostlyCloudy",
  "symbolName": "cloud",
  "isDaylight": true,
  "metadata": {
    "latitude":  35.694,
    "longitude": 139.767,
    "date":           738146429,
    "expirationDate": 738146729
  }
}
```
</details>

## 今日天气(含日内预报)

```js
const result = await Weather.getToday()
const obj = JSON.parse(result)

const today = obj.forecast[0]
this.high = Math.trunc(today.highTemperature.value)
this.low  = Math.trunc(today.lowTemperature.value)
this.icon = today.symbolName
```

`forecast` 是数组,每项是当日预报。包含:

| 字段 | 说明 |
|------|------|
| `highTemperature.value` / `lowTemperature.value` | 最高 / 最低温度 |
| `symbolName` / `condition` | 图标 / 状况 |
| `precipitationChance` | 降水概率,0~1 |
| `humidityMax` / `humidityMin` | 湿度上下限 |
| `wind.speed.value` | 风速 |
| `uvIndex.value` | 紫外线 |
| `sun.sunrise` / `sun.sunset` | 日出 / 日落毫秒时间戳 |
| `moon.phase` / `moon.moonrise` / `moon.moonset` | 月相 / 月出 / 月落 |
| `daytimeForecast` / `restOfDayForecast` / `overnightForecast` | 白天 / 下午 / 夜间分段预报(同上结构) |

<details>
<summary>完整返回字段(点开看)</summary>

返回结构非常丰富,主要嵌套层次:

```
{
  metadata,
  forecast: [
    {
      highTemperature, lowTemperature,
      highTemperatureTime, lowTemperatureTime,
      symbolName, condition, precipitation, precipitationChance,
      humidityMin, humidityMax, maximumHumidity, minimumHumidity,
      wind: { speed, gust, direction, compassDirection },
      windSpeedAvg, windSpeedMax, windGustSpeedMax, highWindSpeed,
      visibilityMin, visibilityMax,
      maximumVisibility, minimumVisibility,
      rainfallAmount, snowfallAmount,
      precipitationAmountByType: { rainfall, snowfall, hail, sleet, mixed, precipitation },
      uvIndex,
      sun:  { sunrise, sunset, civilDawn, civilDusk, nauticalDawn, nauticalDusk, astronomicalDawn, astronomicalDusk, solarNoon, solarMidnight },
      moon: { phase, moonrise, moonset },
      daytimeForecast:    {…和上面同一类字段},
      restOfDayForecast:  {…},
      overnightForecast:  {…}
    },
    ...
  ]
}
```

具体每个字段的单位、类型,运行 `console.log(result)` 实地查看最直观。
</details>

## 未开放接口

以下接口暂未开放,有需求请联系作者:

- 天气警报
- 每小时预报
