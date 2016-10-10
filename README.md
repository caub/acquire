## Async require

The syntax is like a classic CommonJS require, but it's asynchronous in the browser, so it works by adding yield (or await). Because of this, in this simple first version, it won't work when a require call is nested in a function.

file a.js:
```js
const {PI, floor, random} = Math;
exports.PI = PI;
exports.rand = n => floor(10*random());
```
file b.js:
```js
const {PI} = require('./a');
module.exports = deg => deg/180*PI;
```
file c.js:
```js
const [{rand}, toRadian] = require('./a', './b');
console.log('random angle:', toRadian(rand(360)))
```

could work on node with 
```js
const {parse: URL} = require('url');
const {readFile} = require('js'), fetch=url=>new Promise((res,rej)=>readFile(url, (err,data)=>err?rej(err):res({ text(){ return data }})));
// window, location, ..
```


### Tests
- https://caub.github.io/acquire/test.html
- https://caub.github.io/acquire/demo


<sub>inspired by [1](https://gist.github.com/caub/cf82c451120373dc1568#file-main-js)</sub>