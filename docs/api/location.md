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
  latitude: 34.7472,
  longitude: 113.625,
  altitude: 96.3
}
```

默认缓存 60 分钟。需要更短缓存时，传入分钟数：

```js
const location = await Location.getLocation(5)
```

:::tip 不要无故缩短缓存
后台定位耗电，而且 iOS 会限制小组件的位置访问。天气、城市等场景通常使用默认 60 分钟即可。
:::

### 后台刷新时的回退

自动刷新时，iOS 可能无法及时提供新坐标。请求 6 秒后仍没有结果时，Omni 会尝试返回 24 小时内最后一次成功位置；定位最多继续 20 秒，晚到的结果只供下次刷新使用。如果没有可用缓存，本次调用会失败。

## 把坐标转换成地址

不传参数时使用当前位置：

```js
const place = await Location.getPlacemark()
this.city = place.city || place.name
```

也可以传入指定坐标：

```js
const place = await Location.getPlacemark({
  latitude: 22.284681,
  longitude: 114.158177
})
```

## 地址字段

| 字段 | 含义 |
| --- | --- |
| `name` | 地点名称 |
| `street` | 街道 |
| `streetNumber` | 门牌号 |
| `district` | 区 |
| `city` | 市 |
| `state` | 省或州 |
| `country` | 国家或地区 |
| `countryCode` | ISO 国家码，例如 `CN` |
| `postalCode` | 邮编 |

不同地区的地址结构不同，字段可能为空。显示时准备一个回退值。

## 示例：当前城市与天气

```js
try {
  const place = await Location.getPlacemark()
  const weather = JSON.parse(await Weather.getCurrent())

  this.city = place.city || place.district || place.name || "当前位置"
  this.temperature = Math.trunc(weather.temperature.value) + "°"
  this.icon = weather.symbolName
} catch (error) {
  console.error("位置或天气获取失败：", error)
  this.city = "无法获取位置"
  this.temperature = "--"
  this.icon = "location.slash"
}
```

## 速查

```js
Location.getLocation(cacheMinutes?) → Promise<{ latitude, longitude, altitude }>
Location.getPlacemark() → Promise<object>
Location.getPlacemark({ latitude, longitude }) → Promise<object>
```
