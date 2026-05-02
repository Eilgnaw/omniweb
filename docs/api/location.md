---
sidebar_position: 6
---

# 位置信息

获取当前**坐标**和**地址**(反向地理编码)。需要"位置"权限。

## 获取坐标

```js
const loc = await Location.getLocation()        // 默认缓存 60 分钟
console.log(loc.latitude, loc.longitude)
// 34.7472 113.625
```

```js
const loc = await Location.getLocation(5)       // 缓存 5 分钟,更"新鲜"
```

返回:`{ latitude, longitude, altitude }`(altitude 单位:米)。

:::tip 缓存的意义
小组件每次刷新都重新定位**很费电**,且系统对小组件的位置访问有限制。
默认缓存 60 分钟意味着同一小时内多次调用都用同一个坐标,基本够用。
要更准的实时定位才传更小的缓存值。
:::

## 获取地址(反向地理编码)

不传参数 = 用当前位置:

```js
const mark = await Location.getPlacemark()
console.log(mark.city)         // 香港特别行政区
console.log(mark.street)       // 林士街
console.log(mark.country)      // 中国
```

返回字段:

| 字段 | 说明 |
|------|------|
| `name` | 地点名(如 "林士街2号") |
| `street` | 街道 |
| `streetNumber` | 门牌号 |
| `district` | 区 |
| `city` | 市 |
| `state` | 省 |
| `country` | 国 |
| `countryCode` | ISO 国家码(如 `CN`) |
| `postalCode` | 邮编 |

也可以传指定坐标:

```js
const mark = await Location.getPlacemark({
  latitude:  22.284681,
  longitude: 114.158177
})
console.log(mark.city)   // 香港特别行政区
```

## 例:小组件显示当前城市天气

```js
const mark = await Location.getPlacemark()
this.city = mark.city || mark.name

const weather = JSON.parse(await Weather.getCurrent())
this.temp = Math.trunc(weather.temperature.value) + "°"
this.icon = weather.symbolName
```

text / icon 组件分别填 `{city}` `{temp}` `{icon}` 即可。
