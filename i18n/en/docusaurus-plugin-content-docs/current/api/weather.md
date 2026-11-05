---
sidebar_position: 7
---

# Weather

`Weather` reads Apple Weather (WeatherKit) data. It uses the current location, requires location permission, and caches results for about one hour.

## Current weather

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
  console.error("Couldn't load weather:", error)
  this.icon = "exclamationmark.triangle.fill"
  this.condition = "Weather unavailable"
  this.temperature = "--"
}
```

`getCurrent()` returns a JSON string, so parse it with `JSON.parse()`.

## Common current-weather fields

| Field | Content |
| --- | --- |
| `symbolName` | An SF Symbol name you can pass directly to [Icon](../components/icon.md) |
| `condition` | WeatherKit condition string |
| `temperature.value` | Temperature in °C |
| `apparentTemperature.value` | Feels-like temperature |
| `humidity` | Humidity in the `0...1` range |
| `pressure.value` | Pressure in mbar |
| `pressureTrend` | `rising`, `falling`, or `steady` |
| `wind.speed.value` | Wind speed in km/h |
| `wind.compassDirection` | Direction such as `north` or `east` |
| `visibility.value` | Visibility in meters |
| `uvIndex.value` | UV index |
| `cloudCover` | Cloud cover in the `0...1` range |
| `isDaylight` | Whether it's daytime |
| `precipitationIntensity.value` | Precipitation intensity |
| `dewPoint.value` | Dew point temperature |

When you need more fields, inspect the actual response in the editor:

```js
console.log(JSON.stringify(weather, null, 2))
```

## Today's forecast

```js
const result = await Weather.getToday()
const weather = JSON.parse(result)
const today = weather.forecast[0]

this.high = Math.trunc(today.highTemperature.value)
this.low = Math.trunc(today.lowTemperature.value)
this.icon = today.symbolName
this.rain = Math.round(today.precipitationChance * 100) + "%"
```

`forecast` is an array. This API requests the current day, so you'll normally read the first item.

## Common daily-forecast fields

| Field | Content |
| --- | --- |
| `highTemperature.value` / `lowTemperature.value` | High / low temperature |
| `symbolName` / `condition` | Symbol name / condition |
| `precipitationChance` | Chance of precipitation in the `0...1` range |
| `humidityMax` / `humidityMin` | Maximum / minimum humidity |
| `wind.speed.value` | Wind speed |
| `uvIndex.value` | UV index |
| `sun.sunrise` / `sun.sunset` | Sunrise / sunset as millisecond timestamps |
| `moon.phase` / `moon.moonrise` / `moon.moonset` | Moon phase, moonrise, and moonset |
| `daytimeForecast` / `restOfDayForecast` / `overnightForecast` | Daytime, rest-of-day, and overnight segments |

## Permissions and failures

Weather depends on location. Run it once in the main app and grant location permission. Background refreshes may use cached location and weather. Always give your symbols, text, and numbers a fallback when a call fails.

## Quick reference

```js
Weather.getCurrent() → Promise<string> // current weather JSON string
Weather.getToday() → Promise<string>   // today's forecast JSON string
```
