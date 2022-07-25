# jsonParser
jsonParser 是一个解析json的库，它的效果与JSON.parse()是一致的   
## 使用方法   
```js
const json = jsonParser('{ "a": 1, "b": "2", "c": true, "d": null, "e": [] }')
console.log(json)
```
输出
```js
{ a: 1, b: "2", c: true, d: null, e: [] }
```


