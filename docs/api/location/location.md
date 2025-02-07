---
sidebar_position: 1
---
# 位置信息
:::info
位置信息用于获取当前坐标以及地址信息
:::

## 获取坐标
获取当前坐标信息
```js
let location =  await Location.getLocation()
console.log('当前位置:', `${location.latitude},${location.longitude}`);
// 当前位置: 34.7472,113.625
```

## 获取地址信息
获取当前地址信息
```js
let mark = await Location.getPlacemark()
console.log(mark)
let obj = JSON.parse(mark)
console.log(obj.city)

// {"countryCode":"CN","street":"林士街","name":"林士街2号","city":"香港特别行政区","streetNumber":"2号","country":"中国","district":"中西区"}
// 香港特别行政区
```
