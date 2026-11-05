---
sidebar_position: 6
---

# Location

`Location` reads the current coordinates and converts coordinates into an address. The first use requires location permission.

## Get coordinates

```js
const location = await Location.getLocation()
console.log(location.latitude, location.longitude)
```

Returns:

```js
{
  latitude: 34.7472,
  longitude: 113.625,
  altitude: 96.3
}
```

The default cache is 60 minutes. Pass a number of minutes for a shorter cache:

```js
const location = await Location.getLocation(5)
```

:::tip Don't shorten the cache without a reason
Background location uses battery, and iOS limits location access from widgets. Weather and city widgets usually work well with the default 60 minutes.
:::

### Fallback during background refresh

During an automatic refresh, iOS may not return a new coordinate in time. After 6 seconds, Omni tries the last successful location from the previous 24 hours. The location request may continue for up to 20 seconds, but a late result is only cached for the next refresh. If no cached location is available, the call fails.

## Convert coordinates to an address

With no argument, it uses the current location:

```js
const place = await Location.getPlacemark()
this.city = place.city || place.name
```

You can also pass coordinates:

```js
const place = await Location.getPlacemark({
  latitude: 22.284681,
  longitude: 114.158177
})
```

## Address fields

| Field | Meaning |
| --- | --- |
| `name` | Place name |
| `street` | Street |
| `streetNumber` | Street number |
| `district` | District |
| `city` | City |
| `state` | State or province |
| `country` | Country or region |
| `countryCode` | ISO country code, such as `CN` |
| `postalCode` | Postal code |

Address structures vary by region, so fields may be empty. Always provide a display fallback.

## Example: current city and weather

```js
try {
  const place = await Location.getPlacemark()
  const weather = JSON.parse(await Weather.getCurrent())

  this.city = place.city || place.district || place.name || "Current location"
  this.temperature = Math.trunc(weather.temperature.value) + "°"
  this.icon = weather.symbolName
} catch (error) {
  console.error("Couldn't load location or weather:", error)
  this.city = "Location unavailable"
  this.temperature = "--"
  this.icon = "location.slash"
}
```

## Quick reference

```js
Location.getLocation(cacheMinutes?) → Promise<{ latitude, longitude, altitude }>
Location.getPlacemark() → Promise<object>
Location.getPlacemark({ latitude, longitude }) → Promise<object>
```
