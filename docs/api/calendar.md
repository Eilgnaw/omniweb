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

如果想要拆分的"年月日"组件:

```js
const s = Calendar.getLunarDate()
console.log(s) // 类似 "丙午三月十六"
```

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
