---
sidebar_position: 6
---

# 位置信息

`Location` 可以读取当前坐标，也可以把坐标转换成地址。首次使用需要位置权限。

## 获取坐标

```js
const location = await Location.getLocation()
console.log(location.latitude, location.longitude)
```

返回：

```js
{
  latitude: 34.75936567,
  longitude: 113.69243507,
  altitude: 104.13
}
```

默认接受 60 分钟内的位置缓存。需要更短缓存时传入分钟数：

```js
const location = await Location.getLocation(5)
```

| 字段 | 内容 |
| --- | --- |
| `latitude` | 纬度 |
| `longitude` | 经度 |
| `altitude` | 海拔，单位 m |

## 获取地址

不传参数时使用当前位置：

```js
const place = await Location.getPlacemark()
let city = place.city || place.district || place.name || "未知位置"
```

也可以传入指定坐标：

```js
const place = await Location.getPlacemark({
  latitude: 34.75936567,
  longitude: 113.69243507
})
```

## 地址字段

| 字段 | 内容 |
| --- | --- |
| `name` | 地点名 |
| `street` / `streetNumber` | 街道 / 门牌号 |
| `district` | 区 |
| `city` | 市 |
| `state` | 省 |
| `country` / `countryCode` | 国家或地区 / 国家码 |
| `postalCode` | 邮编 |

不同地区的地址结构不同，字段可能为空，请准备回退值。

## 示例：显示城市与坐标

```js
let city = "无法获取位置"
let position = ""

try {
  const location = await Location.getLocation()
  const place = await Location.getPlacemark(location)

  city = place.city || place.name || "未知城市"
  position = `${location.latitude}, ${location.longitude}`
} catch (error) {
  console.error("位置获取失败：", error)
}
```

## 速查

```js
Location.getLocation(cacheMinutes?) → Promise<object>
Location.getPlacemark() → Promise<object>
Location.getPlacemark({ latitude, longitude }) → Promise<object>
```
