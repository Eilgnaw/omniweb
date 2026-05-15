---
sidebar_position: 6
---

# Location

Get the current **coordinates** and **address** (reverse geocoding). Requires the "Location" permission.

## Get Coordinates

```js
const loc = await Location.getLocation()        // defaults to 60-minute cache
console.log(loc.latitude, loc.longitude)
// 34.7472 113.625
```

```js
const loc = await Location.getLocation(5)       // 5-minute cache, fresher data
```

Returns: `{ latitude, longitude, altitude }` (altitude in meters).

:::tip Why caching matters
Re-locating on every widget refresh **burns battery fast**, and iOS imposes strict limits on widget location access.
The default 60-minute cache means repeated calls within the same hour reuse one coordinate — usually more than enough.
Only pass a smaller cache value when you genuinely need fresher real-time positioning.
:::

## Get Address (Reverse Geocoding)

No arguments = use the current location:

```js
const mark = await Location.getPlacemark()
console.log(mark.city)         // Hong Kong SAR
console.log(mark.street)       // Forest Street
console.log(mark.country)      // China
```

Return fields:

| Field | Description |
|------|------|
| `name` | Place name (e.g. "2 Forest Street") |
| `street` | Street |
| `streetNumber` | Street number |
| `district` | District |
| `city` | City |
| `state` | State / province |
| `country` | Country |
| `countryCode` | ISO country code (e.g. `CN`) |
| `postalCode` | Postal code |

You can also pass specific coordinates:

```js
const mark = await Location.getPlacemark({
  latitude:  22.284681,
  longitude: 114.158177
})
console.log(mark.city)   // Hong Kong SAR
```

## Example: Show Current City's Weather in a Widget

```js
const mark = await Location.getPlacemark()
this.city = mark.city || mark.name

const weather = JSON.parse(await Weather.getCurrent())
this.temp = Math.trunc(weather.temperature.value) + "°"
this.icon = weather.symbolName
```

In the text / icon components, just fill in `{city}` `{temp}` `{icon}`.
