---
sidebar_position: 1
---
# 网络
:::info
网络模块是 Omni 小组件显示数据的主要来源
:::
# 网络


## GET请求
发起一个```get```请求
```js
try {
    let result = await http.get('https://v2.jinrishici.com/token')
    var obj = JSON.parse(result)
    token = obj.data
    setConfig("token", token)
    console.log(token)
} catch(error) {
    console.log(error)
}

$done()  //代码结束时请添加此行代码
```

## 传入 header
在请求中携带```header```
```js
var token = "abcdefg"
try {
    let result = await http.get("https://v2.jinrishici.com/sentence",{headers: {'X-User-Token':token}})
    let obj = JSON.parse(result)
    this.content = obj.data.content
} catch(error) {
 console.log(error)
}

$done()
```

## POST请求
发起一个```POST```请求
```js
try {
    let result = await http.post('https://v2.jinrishici.com/token', {
    body: {
      abc: 1,
    }
    })
    console.log(result)
} catch(error) {
    console.log(error)
}

$done()
```
