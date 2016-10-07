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


inspired by [1](https://gist.github.com/awalGarg/6fbf685ff0deeeeaa5fe)