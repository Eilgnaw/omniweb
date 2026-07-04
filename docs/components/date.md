---
sidebar_position: 6
---

# 日期 Date

显示一个日期 / 时间 / 计时器。利用 iOS 的 `Text(date:)` API,**系统帮你每秒刷新**,不用 JS 介入。

## 用法

从编辑器右上角 ➕ 添加 **date**,在"内容"字段填日期源。

### 内容字段可写

| 内容 | 含义 |
|------|------|
| `now` | 现在 |
| `tomorrow` | 明天此刻 |
| `yesterday` | 昨天此刻 |
| `startoftoday` | 今天 00:00 |
| `2024-08-20 10:00:00` | 指定时刻(格式必须严格) |
| `${ts}` | 占位符,JS 给定时间字符串 |

## 显示样式

属性面板里的"样式"字段决定怎么显示:

| 样式 | 效果(以 14:30 为例) |
|------|---------------------|
| `time` | `2:30 PM` 时钟 |
| `date` | `2024年8月20日` 日期 |
| `relative` | `5 分钟前` 相对时间 |
| `offset` | `+05:00` 时间差 |
| `timer` | `00:05:00` 倒计时 / 正计时 |

## 例:倒计时到指定时间

```js
this.target = "2026-01-01 00:00:00"
```

date 组件:
- 内容:`${target}`
- 样式:`timer`
- → 显示: 距离 2026 元旦的剩余时间,**自动刷新**

## 例:动态计时

```js
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(0, 0, 0, 0)

const fmt = (d) => {
  const p = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}
this.next = fmt(tomorrow)
```

date 组件内容填 `${next}`,样式 `timer`,即可显示距离明天 0 点的倒计时。

:::tip 为什么 date 能秒级刷新?
小组件本身不能秒刷,但 `Text(date:)` 是系统级的,iOS 在底层帮你跑这个时钟。
其它"实时"展示用 [实时活动](../api/control.md#实时活动控制)。
:::

## 关于裁剪

date 组件支持四方向裁剪(leading / trailing / top / bottom),可以做出"只显示数字、不显示冒号"等效果。这部分留给视觉党,普通使用不用管。
