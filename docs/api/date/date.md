---
sidebar_position: 3
---
# 日期信息
:::info
日期相关接口
:::


### 基础信息
```js
var now = new Date()
this.year = now.getFullYear()  //获取年份 2024
this.month = now.getMonth() + 1 //获取月份 5
this.day = now.getDate() //获取天 23
this.hours = now.getHours() //获取小时 23 (小组件最快15分钟刷新一次,故此处的时间不能作为时钟用途)
this.minutes = now.getMinutes() //获取分钟 23(小组件最快15分钟刷新一次,故此处的时间不能作为时钟用途)
this.seconds = now.getSeconds() //获取秒 23(小组件最快15分钟刷新一次,故此处的时间不能作为时钟用途)

```

### 农历日期
``` js
this.lunarDateStr= Calendar.lunarDate()
console.log(lunarDateStr)

// 2024甲辰年五月初九
```
