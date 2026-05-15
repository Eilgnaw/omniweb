---
sidebar_position: 7
---

# Weather

Weather data comes from **Apple Weather** (WeatherKit) and refreshes hourly. **Requires the "Location" permission.**

## Current Weather

```js
try {
  const result = await Weather.getCurrent()
  const obj = JSON.parse(result)

  this.icon = obj.symbolName                       // SF Symbol icon name
  this.text = obj.condition                        // condition: mostlyCloudy / sunny ...
  this.temp = Math.trunc(obj.temperature.value)    // temperature
  this.feel = Math.trunc(obj.apparentTemperature.value)  // feels-like temperature
  this.hum  = Math.round(obj.humidity * 100) + "%" // humidity
} catch (error) {
  this.icon = "exclamationmark.triangle.fill"
  this.temp = "--"
  console.error("Weather fetch failed, check location permission:", error)
}
```

### Common Fields

| Field | Description |
|------|------|
| `symbolName` | SF Symbol icon name — pass it straight to an [icon component](../components/icon.md) |
| `condition` | Weather condition string |
| `temperature.value` | Temperature (°C) |
| `apparentTemperature.value` | Feels-like temperature |
| `humidity` | Humidity, 0–1 |
| `pressure.value` | Pressure (mbar) |
| `pressureTrend` | Pressure trend: `rising` / `falling` / `steady` |
| `wind.speed.value` | Wind speed (km/h) |
| `wind.compassDirection` | Wind direction: `north` / `east`, etc. |
| `visibility.value` | Visibility (m) |
| `uvIndex.value` | UV index |
| `cloudCover` | Cloud cover, 0–1 |
| `isDaylight` | Is it daytime |
| `precipitationIntensity.value` | Precipitation intensity |
| `dewPoint.value` | Dew point temperature |

<details>
<summary>Full response fields (click to expand)</summary>

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

## Today's Weather (with Intra-Day Forecast)

```js
const result = await Weather.getToday()
const obj = JSON.parse(result)

const today = obj.forecast[0]
this.high = Math.trunc(today.highTemperature.value)
this.low  = Math.trunc(today.lowTemperature.value)
this.icon = today.symbolName
```

`forecast` is an array, where each item is one day's forecast. Includes:

| Field | Description |
|------|------|
| `highTemperature.value` / `lowTemperature.value` | High / low temperature |
| `symbolName` / `condition` | Icon / condition |
| `precipitationChance` | Precipitation probability, 0–1 |
| `humidityMax` / `humidityMin` | Humidity range |
| `wind.speed.value` | Wind speed |
| `uvIndex.value` | UV index |
| `sun.sunrise` / `sun.sunset` | Sunrise / sunset, ms timestamps |
| `moon.phase` / `moon.moonrise` / `moon.moonset` | Moon phase / moonrise / moonset |
| `daytimeForecast` / `restOfDayForecast` / `overnightForecast` | Day / afternoon / overnight segmented forecasts (same shape as above) |

<details>
<summary>Full response fields (click to expand)</summary>

The response is very rich. Main nesting:

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
      daytimeForecast:    {…same field types as above},
      restOfDayForecast:  {…},
      overnightForecast:  {…}
    },
    ...
  ]
}
```

For the exact units and types of each field, the fastest way is to run `console.log(result)` and inspect it yourself.
</details>

## Unreleased APIs

The following APIs aren't available yet. Contact the author if you need them:

- Weather alerts
- Hourly forecast
