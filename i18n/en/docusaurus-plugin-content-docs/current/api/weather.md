---
sidebar_position: 7
---

# Weather

`Weather` reads Apple Weather (WeatherKit) data. It uses the current location and requires location permission. The recommended APIs return JavaScript objects directly, so you don't need `JSON.parse()`.

## Current weather

```js
try {
  const weather = await Weather.current()

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

### Common current-weather fields

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

When you need more fields, inspect the complete object in the editor:

```js
console.log(JSON.stringify(weather, null, 2))
```

## Today and daily forecasts

`today()` returns a forecast object that only contains today:

```js
const result = await Weather.today()
const today = result.forecast[0]

this.high = Math.trunc(today.highTemperature.value)
this.low = Math.trunc(today.lowTemperature.value)
this.icon = today.symbolName
this.rain = Math.round(today.precipitationChance * 100) + "%"
```

Use `daily(days?)` for several days. It returns 10 days by default, or you can request `1...10`:

```js
const daily = await Weather.daily(7)
this.days = daily.forecast.map(day => ({
  date: day.date,
  high: Math.trunc(day.highTemperature.value),
  low: Math.trunc(day.lowTemperature.value),
  icon: day.symbolName
}))
```

### Common daily-forecast fields

| Field | Content |
| --- | --- |
| `date` | Start of the day as a millisecond timestamp |
| `highTemperature.value` / `lowTemperature.value` | High / low temperature |
| `symbolName` / `condition` | Symbol name / condition |
| `precipitationChance` | Chance of precipitation in the `0...1` range |
| `minimumHumidity` / `maximumHumidity` | Minimum / maximum humidity |
| `wind.speed.value` | Wind speed |
| `uvIndex.value` | UV index |
| `sun.sunrise` / `sun.sunset` | Sunrise / sunset as millisecond timestamps |
| `moon.phase` / `moon.moonrise` / `moon.moonset` | Moon phase, moonrise, and moonset |
| `daytimeForecast` / `restOfDayForecast` / `overnightForecast` | Daytime, rest-of-day, and overnight segments |

## Hourly forecast

`hourly(hours?)` returns 25 hours starting with the current hour by default. You can request up to 240 hours:

```js
const hourly = await Weather.hourly(24)
this.hours = hourly.forecast.map(hour => ({
  date: hour.date,
  temperature: Math.trunc(hour.temperature.value),
  icon: hour.symbolName,
  rain: Math.round(hour.precipitationChance * 100)
}))
```

Hourly forecasts also include feels-like temperature, humidity, wind, visibility, UV index, cloud cover, dew point, and precipitation type.

## Minute precipitation

Minute forecasts depend on regional availability. `minute()` returns `null` when they aren't available:

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

`availability()` also returns `alertAvailability`. Its value can be `available`, `temporarilyUnavailable`, `unsupported`, or `unknown`.

## Weather alerts

`alerts()` always returns an array. When there are no active alerts, it returns `[]`:

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

Keep `source` and `detailsURL` when you display an alert. They're part of the alert's source information.

## Caching, permissions, and errors

Weather uses the current location. Run it once in the main app and grant location permission. Background refreshes may use a cached location. If no location is available, the Promise is rejected.

Forecasts prefer the expiration date returned by WeatherKit. Without one, minute data is cached for about 5 minutes; current weather, hourly forecasts, and alerts for about 15 minutes; and daily forecasts and availability for about 60 minutes. Calls also fail when the requested hour or day count is outside the supported range.

## Legacy string APIs

Existing widgets can continue to use these APIs. They still return JSON strings:

```js
const weather = JSON.parse(await Weather.getCurrent())
const today = JSON.parse(await Weather.getToday())
```

`getWeather()` is the old alias for `getCurrent()`. Use the object-based `current()`, `today()`, and related APIs in new code.

## Quick reference

```js
Weather.current() → Promise<object>           // current weather
Weather.today() → Promise<object>             // today's Forecast object
Weather.minute() → Promise<object | null>      // next-hour minute forecast
Weather.hourly(hours?) → Promise<object>       // default 25, range 1...240
Weather.daily(days?) → Promise<object>         // default 10, range 1...10
Weather.alerts() → Promise<object[]>           // alerts, or [] when none are active
Weather.availability() → Promise<object>       // minute and alert availability
Weather.getWeather() → Promise<string>         // legacy current-weather JSON string
Weather.getCurrent() → Promise<string>         // legacy current-weather JSON string
Weather.getToday() → Promise<string>           // legacy today-forecast JSON string
```
