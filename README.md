## Async require

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

it doesn't work currently if a require call is not at top level

### Tests
- https://caub.github.io/require/test.html
- https://caub.github.io/require/demo


<sub>inspired by [1](https://gist.github.com/caub/cf82c451120373dc1568#file-main-js)</sub>