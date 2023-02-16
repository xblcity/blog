# lodash部分源码

## omit

omit 函数：拷贝对象并去除一些对象中不用的属性

比较简单的实现方式

```js
function omit(obj, fields) {
  const shallowCopy = Object.assign({}, obj);
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}

export default omit;
```

lodash中实现相对比较复杂

[omit](https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L13496)

```js
// flatRest 超出两个的参数合并为两个
var omit = flatRest(function(object, paths) {
    var result = {};
    // 处理 object 异常情况，undefined 在 copyObject 有处理
    if (object == null) {
        return result;
    }
    var isDeep = false;
    // 对属性值进行 Map
    paths = arrayMap(paths, function(path) {
        path = castPath(path, object);
        isDeep || (isDeep = path.length > 1);
        return path;
    });
    // object深拷贝给 result
    copyObject(object, getAllKeysIn(object), result);
    // 对象不为一层的情况下，走下面逻辑
    if (isDeep) {
        result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
    }
    var length = paths.length;
    while (length--) {
        // 通过修改 result, 去掉 paths 里面的属性
        baseUnset(result, paths[length]);
    }
    return result;
});
```

两个关键的位置，一个是对对象进行拷贝，还有一个是删除属性，分别对应 `copyObject` `baseUnset`

```js
function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
        var key = props[index];

        var newValue = customizer
            ? customizer(object[key], source[key], key, object, source)
            : undefined;

        if (newValue === undefined) {
            newValue = source[key];
        }
        if (isNew) {
            // 对对象进行赋值操作
            baseAssignValue(object, key, newValue);
        } else {
            assignValue(object, key, newValue);
        }
    }
    return object;
}

function baseAssignValue(object, key, value) {
    if (key == '__proto__' && defineProperty) {
        defineProperty(object, key, {
            'configurable': true,
            'enumerable': true,
            'value': value,
            'writable': true
        });
    } else {
        object[key] = value;
    }
}
```
