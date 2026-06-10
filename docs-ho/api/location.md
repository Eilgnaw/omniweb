---
sidebar_position: 6
---

# 位置信息

获取当前**坐标**和**地址**。需要位置权限。

## 获取坐标

```js
const loc = await Location.getLocation()
console.log(loc.latitude, loc.longitude)
// 34.75936567 113.69243507
```

也可以传一个分钟数,表示你希望位置足够新:

```js
const loc = await Location.getLocation(5)
```

返回:

```js
{
  latitude: 34.75936567,
  longitude: 113.69243507,
  altitude: 104.13
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `latitude` | number | 纬度 |
| `longitude` | number | 经度 |
| `altitude` | number | 海拔,单位米 |

## 获取地址

不传参数时,使用当前位置:

```js
const mark = await Location.getPlacemark()
console.log(mark.city)         // 某某市
console.log(mark.street)       // 大河路
console.log(mark.country)      // 中国
```

也可以传指定坐标:

```js
const mark = await Location.getPlacemark({
  latitude: 34.75936567,
  longitude: 113.69243507
})

console.log(mark.city)         // 某某市
```

返回字段:

| 字段 | 说明 |
|------|------|
| `name` | 地点名 |
| `street` | 街道 |
| `streetNumber` | 门牌号 |
| `district` | 区 |
| `city` | 市 |
| `state` | 省 |
| `country` | 国 |
| `countryCode` | 国家码,如 `CN` |
| `postalCode` | 邮编 |

## 例:显示当前城市

```js
const loc = await Location.getLocation()
const mark = await Location.getPlacemark(loc)

const city = mark.city || mark.name || "未知城市"
const position = `${loc.latitude}, ${loc.longitude}`

console.log("city", city)
console.log("position", position)
```

组件字段里可以绑定:

| 组件 | 字段 | 填什么 |
|------|------|--------|
| Text | content | `${city}` |
| Text | content | `${position}` |

## 速查

```js
await Location.getLocation()
await Location.getLocation(5)

await Location.getPlacemark()
await Location.getPlacemark({ latitude, longitude })
```
