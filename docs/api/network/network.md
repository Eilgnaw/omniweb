---
sidebar_position: 1
---
# 网络请求
:::info
网络 (Network) 模块是 Omni 小组件与互联网通信的桥梁，是动态数据显示的核心。无论是获取天气信息、新闻头条，还是与您自己的服务器 API 交互，都依赖于此模块。它提供了简单而强大的 API 来发起网络请求并处理响应。
:::
### 新版 API

新版 API 提供了更灵活的链式调用和配置方式。

#### 发起请求

1.  **初始化请求**: 使用 `new Request(url)` 创建一个请求实例。
2.  **配置请求 (可选)**:
    *   `method`: 设置请求方法，如 `GET` (默认), `POST`, `PUT` 等。
    *   `headers`: 设置请求头，格式为 JSON 对象。
    *   `body`: 设置请求体，通常用于 `POST` 或 `PUT` 请求。
3.  **发送请求并获取数据**:
    *   `fetch()`: 发送请求并返回原始响应。
    *   `fetchJSON()`: 发送请求并将响应解析为 JSON 对象。
    *   `fetchString()`: 发送请求并将响应解析为字符串。

#### 示例

##### GET 请求

```javascript
const req = new Request("https://2f0.cn/api/omni");
req.headers = { "Content-Type": "application/json" };

// 获取 JSON 数据
const jsonData = await req.fetchJSON();
console.log(jsonData.omni);

// 获取字符串数据
const stringData = await req.fetchString();
console.log(stringData);
```

##### POST 请求

```javascript
const req = new Request("https://2f0.cn/api/omni");
req.method = "POST";
req.headers = { "Content-Type": "application/json" };
req.body = { "omni": "hello OmniWidgets"};

const response = await req.fetchJSON();
console.log(response);
```

### 旧版本
#### GET请求
发起一个```get```请求
```js
try {
    let result = await http.get('https://2f0.cn/api/omni')
    var obj = JSON.parse(result)
    console.log(obj.omni)
} catch(error) {
    console.log(error)
}

$done()  //代码结束时请添加此行代码
```

#### 传入 header
在请求中携带```header```
```js
try {
    let result = await http.get("https://2f0.cn/api/omni",{headers: {'Content-Type':"application/json"}})
    let obj = JSON.parse(result)
    console.log(obj.omni)
} catch(error) {
 console.log(error)
}

$done()
```

#### POST请求
发起一个```POST```请求
```js
try {
    let result = await http.post('https://2f0.cn/api/omni', {
    body: {
      omni: "hello OmniWidgets",
    }
    })
    console.log(result)
} catch(error) {
    console.log(error)
}

$done()
```
