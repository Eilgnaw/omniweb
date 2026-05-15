---
sidebar_position: 9
---

# 日历

读取系统日历事件、农历日期。需要授权"日历"权限。

## 农历日期

```js
this.lunar = Calendar.lunarDate()
console.log(this.lunar)
// 2026丙午年三月十六
```

`lunarDate()` 同步,直接返回农历日期字符串(中文格式)。

如果想要拼接好的"年月日"字符串:

```js
const s = Calendar.getLunarDate()
console.log(s) // 类似 "丙午三月十六"
```

## 农历分量(月/日/闰月)

如果想自己排版或参与逻辑判断,可以拿到农历的"数字"形式:

```js
this.y = Calendar.lunarYear()         // 60 甲子循环中的第几年 (1–60)
this.m = Calendar.lunarMonth()        // 1–12
this.d = Calendar.lunarDay()          // 1–30
this.leap = Calendar.isLunarLeapMonth() // 当前农历月是否闰月
```

| 方法 | 返回 | 说明 |
|------|------|------|
| `lunarYear()` | Int | 1–60,**不是公元年**;干支用 [`ganZhi()`](#生肖与天干地支) |
| `lunarMonth()` | Int | 1–12 |
| `lunarDay()` | Int | 1–30 |
| `isLunarLeapMonth()` | Bool | 当前是不是闰月(如闰二月返回 `true`) |

## 生肖与天干地支

```js
console.log(Calendar.zodiac()) // "马"
console.log(Calendar.ganZhi()) // "丙午"
```

| 方法 | 返回 |
|------|------|
| `zodiac()` | 当年生肖,鼠/牛/虎/兔/龙/蛇/马/羊/猴/鸡/狗/猪 |
| `ganZhi()` | 当年天干地支,如 "甲辰"、"丙午" |

## 距离某天还有多少天

做"春节倒计时"、"距离生日还有 X 天"用得最多。

```js
// 距离下一次"农历正月初一"(春节)
this.dDay = Calendar.daysUntilLunar(1, 1)

// 距离下一次"公历 12 月 25 日"
this.xmas = Calendar.daysUntilSolar(12, 25)
```

- 参数是 `(month, day)`,**今天恰好是那天则返回 0**。
- 已过则自动取下一年(永远是"未来"的天数)。
- 若农历目标月不存在(比如今年没有闰二月),会自动向后找到最近的一年。

| 方法 | 含义 |
|------|------|
| `daysUntilLunar(month, day)` | 距离下一次农历 (月,日) 还有多少天 |
| `daysUntilSolar(month, day)` | 距离下一次公历 (月,日) 还有多少天 |

## 任意两个日期的天数

```js
// 距离一个固定日子(公历)
this.left = Calendar.daysFromNow("2026-10-01") // 未来正,已过负

// 两个具体日期之间的天数(to - from)
this.span = Calendar.daysBetween("2026-01-01", "2026-05-15") // 134
```

参数支持 `YYYY-MM-DD` / `YYYY/MM/DD` / `YYYY.MM.DD` 三种写法,解析失败返回 `0`。

| 方法 | 返回 |
|------|------|
| `daysFromNow(ymd)` | `target - 今天`,未来为正、已过为负 |
| `daysBetween(from, to)` | `to - from`,可正可负 |

## 公历转农历

把任意一天公历转成农历字符串:

```js
console.log(Calendar.lunarFromSolar("2026-02-17"))
// "丙午正月初一"
```

格式与 `getLunarDate()` 一致(`U`+`MMM`+`d`)。解析失败返回空字符串。

## 日历事件

```js
const result = await Calendar.getEvents()
const events = JSON.parse(result)
console.log(events)
```

返回当前时间到一个月后的所有事件,数组形式:

```json
[
  {
    "title": "团队周会",
    "startDate": "2026-05-03 10:00:00 +0000",
    "endDate":   "2026-05-03 11:00:00 +0000",
    "notes":     "讨论 Q2 计划",
    "color":     "FF6B6B"
  },
  ...
]
```

| 字段 | 说明 |
|------|------|
| `title` | 事件标题 |
| `startDate` / `endDate` | 起止时间字符串 |
| `notes` | 事件备注 |
| `color` | 来源日历的颜色(十六进制) |

## 例:展示最近 3 件事

```js
const result = await Calendar.getEvents()
const events = JSON.parse(result)
this.events = events.slice(0, 3)
```

vstack 设循环数据源 `{events[ev]}`,内部:

| 子组件 | 内容 |
|--------|------|
| text | `{ev.title}` |
| text(灰色) | `{ev.startDate}` |

## 权限提示

第一次调用 `getEvents()` 时,系统会弹窗请求"日历"访问。
**用户拒绝后,后续调用会返回错误**:

```js
try {
  const result = await Calendar.getEvents()
  // ...
} catch (e) {
  console.log("拿不到日历:", e)
}
```

iOS 17+ 使用"完整访问"(`requestFullAccessToEvents`),低版本用旧接口 — 行为一致。
