---
sidebar_position: 1
---
# Network Requests
:::tip
The Network module is how Omni widgets talk to the internet — it's the core of any dynamic data display. Whether you're pulling weather, news headlines, or hitting your own server API, it all goes through this module. The API is simple and gives you everything you need to fire off requests and handle responses.
:::
The new API supports flexible chaining and configuration.

#### Making a Request

1.  **Initialize**: Use `new Request(url)` to create a request instance.
2.  **Configure (optional)**:
    *   `method`: The HTTP method — `GET` (default), `POST`, `PUT`, etc.
    *   `headers`: Request headers, as a JSON object.
    *   `body`: Request body, typically for `POST` or `PUT` requests.
3.  **Send and read the response**:
    *   `fetch()`: Send the request and return the raw response.
    *   `fetchJSON()`: Send the request and parse the response as JSON.
    *   `fetchString()`: Send the request and parse the response as a string.

#### Examples

##### GET Request

```javascript
const req = new Request("https://2f0.cn/api/omni");
req.headers = { "Content-Type": "application/json" };

// Get JSON data
const jsonData = await req.fetchJSON();
console.log(jsonData.omni);

// Get string data
const stringData = await req.fetchString();
console.log(stringData);
```

##### POST Request

```javascript
const req = new Request("https://2f0.cn/api/omni");
req.method = "POST";
req.headers = { "Content-Type": "application/json" };
req.body = { "omni": "hello OmniWidgets"};

const response = await req.fetchJSON();
console.log(response);
```
