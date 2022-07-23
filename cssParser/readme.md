# mParser.js/cssParser
cssParser 是一个解析css的库，能够将css解析成ast，支持格式化css，压缩css， 实现css模块化的功能
## 使用方法   
```js
var cssAst = cssParser('.name{ display: block; color: red; }')
```
## 格式化
```js
var cssFormatString = cssFormat(cssAst)
```
## 压缩
```js
var cssCompressString = cssPress(cssAst)
```


