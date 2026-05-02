---
sidebar_position: 2
---

# 配置读写

Omni 提供 **3 种存储**,各自的作用域不同:

| 类型 | 跟着谁走 | 用途 |
|------|---------|------|
| 小组件配置 (`getConfig` / `setConfig`) | **每个小组件独立** | 这个小组件的 token、城市等 |
| 通用配置 (`getValue` / `setValue`) | **跨小组件共享**(同一种类型 + 同一槽位) | 用户全局信息;按钮代码里改的状态 |
| 设置项 (`Setting`) | **每个小组件独立** + 用户在设置面板填 | 模板分享后,让别人填自己的信息 |

## 小组件配置

每个小组件独立的存储空间。

```js
setConfig("token", "abcdef")    // 存
const t = getConfig("token")    // 取
console.log(t)                  // abcdef
```

也支持**快捷指令**读写,适合从快捷指令把数据塞进小组件。

## 通用配置

按"小组件类型 + 槽位"为键的存储。同一种小组件如果你加到桌面**两次**,就是两个槽位(slot 1、slot 2),互不干扰。
编辑器里运行时,槽位永远是 `999`(调试位)。

```js
setValue("database", "abcdefg")
const data = getValue("database")
console.log(data)
```

:::warning
"槽位"概念由系统决定,你换桌面位置可能导致槽位变化。**慎用**作为重要数据存储。
日常推荐用 `setConfig` / `getConfig`。
:::

## 设置项 (Setting)

如果你想把小组件**分享**给别人用,但需要别人填自己的 token / 城市 / 文件 — 用设置项。

### 流程

1. **编辑器里**:左下角 ⚙️ → 添加设置项,选类型(字符串 / 文件 / 选项 / 开关),给个 key
2. **JS 里**:`Setting.string("xxx")` 读用户填的值
3. **别人导入**后,会在小组件设置面板里看到这些设置项,填好就能用

### 读设置

```js
this.token   = Setting.string("token")     // 字符串
this.flag    = Setting.bool("notify")      // 开关
this.choice  = Setting.string("city")      // 选项(也是字符串)
this.fileTxt = Setting.fileString("rules") // 文件 → 文件内容
```

### 写设置(少用)

```js
Setting.set("uuid-12345", "userId")        // 把字符串写进去
const id = Setting.string("userId")
console.log(id)
```

通常用于:首次运行生成一个唯一 ID 写回去,下次运行直接用。

## 速查

```js
// 小组件级
setConfig(key, value)        // 写
getConfig(key) → string      // 读

// 通用(按类型 + 槽位)
setValue(key, value)         // 写
getValue(key) → string       // 读

// 用户填的设置项
Setting.string(key) → string
Setting.bool(key)   → bool
Setting.fileString(key) → string  // 文件内容
Setting.set(value, key)           // 仅写字符串
```
