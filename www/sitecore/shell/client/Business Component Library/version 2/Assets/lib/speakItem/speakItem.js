!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.speakItem=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to compact.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */
function compact(array) {
  var index = -1,
      length = array ? array.length : 0,
      resIndex = -1,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value) {
      result[++resIndex] = value;
    }
  }
  return result;
}

module.exports = compact;

},{}],2:[function(_dereq_,module,exports){
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],3:[function(_dereq_,module,exports){
var arrayFilter = _dereq_('../internal/arrayFilter'),
    baseCallback = _dereq_('../internal/baseCallback'),
    baseFilter = _dereq_('../internal/baseFilter'),
    isArray = _dereq_('../lang/isArray');

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
 * invoked with three arguments: (value, index|key, collection).
 *
 * If a property name is provided for `predicate` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `predicate` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * @static
 * @memberOf _
 * @alias select
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [predicate=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {Array} Returns the new filtered array.
 * @example
 *
 * _.filter([4, 5, 6], function(n) {
 *   return n % 2 == 0;
 * });
 * // => [4, 6]
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // using the `_.matches` callback shorthand
 * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
 * // => ['barney']
 *
 * // using the `_.matchesProperty` callback shorthand
 * _.pluck(_.filter(users, 'active', false), 'user');
 * // => ['fred']
 *
 * // using the `_.property` callback shorthand
 * _.pluck(_.filter(users, 'active'), 'user');
 * // => ['barney']
 */
function filter(collection, predicate, thisArg) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  predicate = baseCallback(predicate, thisArg, 3);
  return func(collection, predicate);
}

module.exports = filter;

},{"../internal/arrayFilter":7,"../internal/baseCallback":11,"../internal/baseFilter":13,"../lang/isArray":51}],4:[function(_dereq_,module,exports){
var baseEach = _dereq_('../internal/baseEach'),
    createFind = _dereq_('../internal/createFind');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
 * invoked with three arguments: (value, index|key, collection).
 *
 * If a property name is provided for `predicate` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `predicate` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * @static
 * @memberOf _
 * @alias detect
 * @category Collection
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function|Object|string} [predicate=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.result(_.find(users, function(chr) {
 *   return chr.age < 40;
 * }), 'user');
 * // => 'barney'
 *
 * // using the `_.matches` callback shorthand
 * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
 * // => 'pebbles'
 *
 * // using the `_.matchesProperty` callback shorthand
 * _.result(_.find(users, 'active', false), 'user');
 * // => 'fred'
 *
 * // using the `_.property` callback shorthand
 * _.result(_.find(users, 'active'), 'user');
 * // => 'barney'
 */
var find = createFind(baseEach);

module.exports = find;

},{"../internal/baseEach":12,"../internal/createFind":33}],5:[function(_dereq_,module,exports){
var arrayMap = _dereq_('../internal/arrayMap'),
    baseCallback = _dereq_('../internal/baseCallback'),
    baseMap = _dereq_('../internal/baseMap'),
    isArray = _dereq_('../lang/isArray');

/**
 * Creates an array of values by running each element in `collection` through
 * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
 * arguments: (value, index|key, collection).
 *
 * If a property name is provided for `iteratee` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `iteratee` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
 * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
 * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
 * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
 * `sum`, `uniq`, and `words`
 *
 * @static
 * @memberOf _
 * @alias collect
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [iteratee=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function timesThree(n) {
 *   return n * 3;
 * }
 *
 * _.map([1, 2], timesThree);
 * // => [3, 6]
 *
 * _.map({ 'a': 1, 'b': 2 }, timesThree);
 * // => [3, 6] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // using the `_.property` callback shorthand
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee, thisArg) {
  var func = isArray(collection) ? arrayMap : baseMap;
  iteratee = baseCallback(iteratee, thisArg, 3);
  return func(collection, iteratee);
}

module.exports = map;

},{"../internal/arrayMap":8,"../internal/baseCallback":11,"../internal/baseMap":22,"../lang/isArray":51}],6:[function(_dereq_,module,exports){
var arrayReduce = _dereq_('../internal/arrayReduce'),
    baseEach = _dereq_('../internal/baseEach'),
    createReduce = _dereq_('../internal/createReduce');

/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` through `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not provided the first element of `collection` is used as the initial
 * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `sortByAll`,
 * and `sortByOrder`
 *
 * @static
 * @memberOf _
 * @alias foldl, inject
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * _.reduce([1, 2], function(total, n) {
 *   return total + n;
 * });
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
 *   result[key] = n * 3;
 *   return result;
 * }, {});
 * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
 */
var reduce = createReduce(arrayReduce, baseEach);

module.exports = reduce;

},{"../internal/arrayReduce":9,"../internal/baseEach":12,"../internal/createReduce":34}],7:[function(_dereq_,module,exports){
/**
 * A specialized version of `_.filter` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array.length,
      resIndex = -1,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[++resIndex] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],8:[function(_dereq_,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],9:[function(_dereq_,module,exports){
/**
 * A specialized version of `_.reduce` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initFromArray] Specify using the first element of `array`
 *  as the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initFromArray) {
  var index = -1,
      length = array.length;

  if (initFromArray && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

},{}],10:[function(_dereq_,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],11:[function(_dereq_,module,exports){
var baseMatches = _dereq_('./baseMatches'),
    baseMatchesProperty = _dereq_('./baseMatchesProperty'),
    bindCallback = _dereq_('./bindCallback'),
    identity = _dereq_('../utility/identity'),
    property = _dereq_('../utility/property');

/**
 * The base implementation of `_.callback` which supports specifying the
 * number of arguments to provide to `func`.
 *
 * @private
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function baseCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (type == 'function') {
    return thisArg === undefined
      ? func
      : bindCallback(func, thisArg, argCount);
  }
  if (func == null) {
    return identity;
  }
  if (type == 'object') {
    return baseMatches(func);
  }
  return thisArg === undefined
    ? property(func)
    : baseMatchesProperty(func, thisArg);
}

module.exports = baseCallback;

},{"../utility/identity":60,"../utility/property":61,"./baseMatches":23,"./baseMatchesProperty":24,"./bindCallback":30}],12:[function(_dereq_,module,exports){
var baseForOwn = _dereq_('./baseForOwn'),
    createBaseEach = _dereq_('./createBaseEach');

/**
 * The base implementation of `_.forEach` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object|string} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./baseForOwn":17,"./createBaseEach":31}],13:[function(_dereq_,module,exports){
var baseEach = _dereq_('./baseEach');

/**
 * The base implementation of `_.filter` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;

},{"./baseEach":12}],14:[function(_dereq_,module,exports){
/**
 * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
 * without support for callback shorthands and `this` binding, which iterates
 * over `collection` using the provided `eachFunc`.
 *
 * @private
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @param {boolean} [retKey] Specify returning the key of the found element
 *  instead of the element itself.
 * @returns {*} Returns the found element or its key, else `undefined`.
 */
function baseFind(collection, predicate, eachFunc, retKey) {
  var result;
  eachFunc(collection, function(value, key, collection) {
    if (predicate(value, key, collection)) {
      result = retKey ? key : value;
      return false;
    }
  });
  return result;
}

module.exports = baseFind;

},{}],15:[function(_dereq_,module,exports){
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for callback shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromRight) {
  var length = array.length,
      index = fromRight ? length : -1;

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],16:[function(_dereq_,module,exports){
var createBaseFor = _dereq_('./createBaseFor');

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./createBaseFor":32}],17:[function(_dereq_,module,exports){
var baseFor = _dereq_('./baseFor'),
    keys = _dereq_('../object/keys');

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"../object/keys":57,"./baseFor":16}],18:[function(_dereq_,module,exports){
var toObject = _dereq_('./toObject');

/**
 * The base implementation of `get` without support for string paths
 * and default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path of the property to get.
 * @param {string} [pathKey] The key representation of path.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path, pathKey) {
  if (object == null) {
    return;
  }
  if (pathKey !== undefined && pathKey in toObject(object)) {
    path = [pathKey];
  }
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[path[index++]];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./toObject":48}],19:[function(_dereq_,module,exports){
var baseIsEqualDeep = _dereq_('./baseIsEqualDeep'),
    isObject = _dereq_('../lang/isObject'),
    isObjectLike = _dereq_('./isObjectLike');

/**
 * The base implementation of `_.isEqual` without support for `this` binding
 * `customizer` functions.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
}

module.exports = baseIsEqual;

},{"../lang/isObject":54,"./baseIsEqualDeep":20,"./isObjectLike":45}],20:[function(_dereq_,module,exports){
var equalArrays = _dereq_('./equalArrays'),
    equalByTag = _dereq_('./equalByTag'),
    equalObjects = _dereq_('./equalObjects'),
    isArray = _dereq_('../lang/isArray'),
    isTypedArray = _dereq_('../lang/isTypedArray');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag == argsTag) {
      objTag = objectTag;
    } else if (objTag != objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag == argsTag) {
      othTag = objectTag;
    } else if (othTag != objectTag) {
      othIsArr = isTypedArray(other);
    }
  }
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  if (!isLoose) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
    }
  }
  if (!isSameTag) {
    return false;
  }
  // Assume cyclic values are equal.
  // For more information on detecting circular references see https://es5.github.io/#JO.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == object) {
      return stackB[length] == other;
    }
  }
  // Add `object` and `other` to the stack of traversed objects.
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

module.exports = baseIsEqualDeep;

},{"../lang/isArray":51,"../lang/isTypedArray":56,"./equalArrays":35,"./equalByTag":36,"./equalObjects":37}],21:[function(_dereq_,module,exports){
var baseIsEqual = _dereq_('./baseIsEqual'),
    toObject = _dereq_('./toObject');

/**
 * The base implementation of `_.isMatch` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Array} matchData The propery names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = toObject(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var result = customizer ? customizer(objValue, srcValue, key) : undefined;
      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./baseIsEqual":19,"./toObject":48}],22:[function(_dereq_,module,exports){
var baseEach = _dereq_('./baseEach'),
    isArrayLike = _dereq_('./isArrayLike');

/**
 * The base implementation of `_.map` without support for callback shorthands
 * and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;

},{"./baseEach":12,"./isArrayLike":41}],23:[function(_dereq_,module,exports){
var baseIsMatch = _dereq_('./baseIsMatch'),
    getMatchData = _dereq_('./getMatchData'),
    toObject = _dereq_('./toObject');

/**
 * The base implementation of `_.matches` which does not clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    var key = matchData[0][0],
        value = matchData[0][1];

    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === value && (value !== undefined || (key in toObject(object)));
    };
  }
  return function(object) {
    return baseIsMatch(object, matchData);
  };
}

module.exports = baseMatches;

},{"./baseIsMatch":21,"./getMatchData":39,"./toObject":48}],24:[function(_dereq_,module,exports){
var baseGet = _dereq_('./baseGet'),
    baseIsEqual = _dereq_('./baseIsEqual'),
    baseSlice = _dereq_('./baseSlice'),
    isArray = _dereq_('../lang/isArray'),
    isKey = _dereq_('./isKey'),
    isStrictComparable = _dereq_('./isStrictComparable'),
    last = _dereq_('../array/last'),
    toObject = _dereq_('./toObject'),
    toPath = _dereq_('./toPath');

/**
 * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to compare.
 * @returns {Function} Returns the new function.
 */
function baseMatchesProperty(path, srcValue) {
  var isArr = isArray(path),
      isCommon = isKey(path) && isStrictComparable(srcValue),
      pathKey = (path + '');

  path = toPath(path);
  return function(object) {
    if (object == null) {
      return false;
    }
    var key = pathKey;
    object = toObject(object);
    if ((isArr || !isCommon) && !(key in object)) {
      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
      if (object == null) {
        return false;
      }
      key = last(path);
      object = toObject(object);
    }
    return object[key] === srcValue
      ? (srcValue !== undefined || (key in object))
      : baseIsEqual(srcValue, object[key], undefined, true);
  };
}

module.exports = baseMatchesProperty;

},{"../array/last":2,"../lang/isArray":51,"./baseGet":18,"./baseIsEqual":19,"./baseSlice":28,"./isKey":43,"./isStrictComparable":46,"./toObject":48,"./toPath":49}],25:[function(_dereq_,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],26:[function(_dereq_,module,exports){
var baseGet = _dereq_('./baseGet'),
    toPath = _dereq_('./toPath');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 */
function basePropertyDeep(path) {
  var pathKey = (path + '');
  path = toPath(path);
  return function(object) {
    return baseGet(object, path, pathKey);
  };
}

module.exports = basePropertyDeep;

},{"./baseGet":18,"./toPath":49}],27:[function(_dereq_,module,exports){
/**
 * The base implementation of `_.reduce` and `_.reduceRight` without support
 * for callback shorthands and `this` binding, which iterates over `collection`
 * using the provided `eachFunc`.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initFromCollection Specify using the first or last element
 *  of `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
  eachFunc(collection, function(value, index, collection) {
    accumulator = initFromCollection
      ? (initFromCollection = false, value)
      : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

module.exports = baseReduce;

},{}],28:[function(_dereq_,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  start = start == null ? 0 : (+start || 0);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : (+end || 0);
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],29:[function(_dereq_,module,exports){
/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],30:[function(_dereq_,module,exports){
var identity = _dereq_('../utility/identity');

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

module.exports = bindCallback;

},{"../utility/identity":60}],31:[function(_dereq_,module,exports){
var getLength = _dereq_('./getLength'),
    isLength = _dereq_('./isLength'),
    toObject = _dereq_('./toObject');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    var length = collection ? getLength(collection) : 0;
    if (!isLength(length)) {
      return eachFunc(collection, iteratee);
    }
    var index = fromRight ? length : -1,
        iterable = toObject(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./getLength":38,"./isLength":44,"./toObject":48}],32:[function(_dereq_,module,exports){
var toObject = _dereq_('./toObject');

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{"./toObject":48}],33:[function(_dereq_,module,exports){
var baseCallback = _dereq_('./baseCallback'),
    baseFind = _dereq_('./baseFind'),
    baseFindIndex = _dereq_('./baseFindIndex'),
    isArray = _dereq_('../lang/isArray');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new find function.
 */
function createFind(eachFunc, fromRight) {
  return function(collection, predicate, thisArg) {
    predicate = baseCallback(predicate, thisArg, 3);
    if (isArray(collection)) {
      var index = baseFindIndex(collection, predicate, fromRight);
      return index > -1 ? collection[index] : undefined;
    }
    return baseFind(collection, predicate, eachFunc);
  };
}

module.exports = createFind;

},{"../lang/isArray":51,"./baseCallback":11,"./baseFind":14,"./baseFindIndex":15}],34:[function(_dereq_,module,exports){
var baseCallback = _dereq_('./baseCallback'),
    baseReduce = _dereq_('./baseReduce'),
    isArray = _dereq_('../lang/isArray');

/**
 * Creates a function for `_.reduce` or `_.reduceRight`.
 *
 * @private
 * @param {Function} arrayFunc The function to iterate over an array.
 * @param {Function} eachFunc The function to iterate over a collection.
 * @returns {Function} Returns the new each function.
 */
function createReduce(arrayFunc, eachFunc) {
  return function(collection, iteratee, accumulator, thisArg) {
    var initFromArray = arguments.length < 3;
    return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
      ? arrayFunc(collection, iteratee, accumulator, initFromArray)
      : baseReduce(collection, baseCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
  };
}

module.exports = createReduce;

},{"../lang/isArray":51,"./baseCallback":11,"./baseReduce":27}],35:[function(_dereq_,module,exports){
var arraySome = _dereq_('./arraySome');

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing arrays.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var index = -1,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
    return false;
  }
  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index],
        result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

    if (result !== undefined) {
      if (result) {
        continue;
      }
      return false;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (isLoose) {
      if (!arraySome(other, function(othValue) {
            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
          })) {
        return false;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
      return false;
    }
  }
  return true;
}

module.exports = equalArrays;

},{"./arraySome":10}],36:[function(_dereq_,module,exports){
/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag) {
  switch (tag) {
    case boolTag:
    case dateTag:
      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object)
        ? other != +other
        : object == +other;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings primitives and string
      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
      return object == (other + '');
  }
  return false;
}

module.exports = equalByTag;

},{}],37:[function(_dereq_,module,exports){
var keys = _dereq_('../object/keys');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isLoose) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  var skipCtor = isLoose;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key],
        result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

    // Recursively compare objects (susceptible to call stack limits).
    if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
      return false;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (!skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      return false;
    }
  }
  return true;
}

module.exports = equalObjects;

},{"../object/keys":57}],38:[function(_dereq_,module,exports){
var baseProperty = _dereq_('./baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./baseProperty":25}],39:[function(_dereq_,module,exports){
var isStrictComparable = _dereq_('./isStrictComparable'),
    pairs = _dereq_('../object/pairs');

/**
 * Gets the propery names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = pairs(object),
      length = result.length;

  while (length--) {
    result[length][2] = isStrictComparable(result[length][1]);
  }
  return result;
}

module.exports = getMatchData;

},{"../object/pairs":59,"./isStrictComparable":46}],40:[function(_dereq_,module,exports){
var isNative = _dereq_('../lang/isNative');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"../lang/isNative":53}],41:[function(_dereq_,module,exports){
var getLength = _dereq_('./getLength'),
    isLength = _dereq_('./isLength');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"./getLength":38,"./isLength":44}],42:[function(_dereq_,module,exports){
/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],43:[function(_dereq_,module,exports){
var isArray = _dereq_('../lang/isArray'),
    toObject = _dereq_('./toObject');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  var type = typeof value;
  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
    return true;
  }
  if (isArray(value)) {
    return false;
  }
  var result = !reIsDeepProp.test(value);
  return result || (object != null && value in toObject(object));
}

module.exports = isKey;

},{"../lang/isArray":51,"./toObject":48}],44:[function(_dereq_,module,exports){
/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],45:[function(_dereq_,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],46:[function(_dereq_,module,exports){
var isObject = _dereq_('../lang/isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"../lang/isObject":54}],47:[function(_dereq_,module,exports){
var isArguments = _dereq_('../lang/isArguments'),
    isArray = _dereq_('../lang/isArray'),
    isIndex = _dereq_('./isIndex'),
    isLength = _dereq_('./isLength'),
    keysIn = _dereq_('../object/keysIn');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = shimKeys;

},{"../lang/isArguments":50,"../lang/isArray":51,"../object/keysIn":58,"./isIndex":42,"./isLength":44}],48:[function(_dereq_,module,exports){
var isObject = _dereq_('../lang/isObject');

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

module.exports = toObject;

},{"../lang/isObject":54}],49:[function(_dereq_,module,exports){
var baseToString = _dereq_('./baseToString'),
    isArray = _dereq_('../lang/isArray');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `value` to property path array if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Array} Returns the property path array.
 */
function toPath(value) {
  if (isArray(value)) {
    return value;
  }
  var result = [];
  baseToString(value).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

module.exports = toPath;

},{"../lang/isArray":51,"./baseToString":29}],50:[function(_dereq_,module,exports){
var isArrayLike = _dereq_('../internal/isArrayLike'),
    isObjectLike = _dereq_('../internal/isObjectLike');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{"../internal/isArrayLike":41,"../internal/isObjectLike":45}],51:[function(_dereq_,module,exports){
var getNative = _dereq_('../internal/getNative'),
    isLength = _dereq_('../internal/isLength'),
    isObjectLike = _dereq_('../internal/isObjectLike');

/** `Object#toString` result references. */
var arrayTag = '[object Array]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

module.exports = isArray;

},{"../internal/getNative":40,"../internal/isLength":44,"../internal/isObjectLike":45}],52:[function(_dereq_,module,exports){
var isObject = _dereq_('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 which returns 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

module.exports = isFunction;

},{"./isObject":54}],53:[function(_dereq_,module,exports){
var isFunction = _dereq_('./isFunction'),
    isObjectLike = _dereq_('../internal/isObjectLike');

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isNative;

},{"../internal/isObjectLike":45,"./isFunction":52}],54:[function(_dereq_,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],55:[function(_dereq_,module,exports){
var isObjectLike = _dereq_('../internal/isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
}

module.exports = isString;

},{"../internal/isObjectLike":45}],56:[function(_dereq_,module,exports){
var isLength = _dereq_('../internal/isLength'),
    isObjectLike = _dereq_('../internal/isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

module.exports = isTypedArray;

},{"../internal/isLength":44,"../internal/isObjectLike":45}],57:[function(_dereq_,module,exports){
var getNative = _dereq_('../internal/getNative'),
    isArrayLike = _dereq_('../internal/isArrayLike'),
    isObject = _dereq_('../lang/isObject'),
    shimKeys = _dereq_('../internal/shimKeys');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? undefined : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

module.exports = keys;

},{"../internal/getNative":40,"../internal/isArrayLike":41,"../internal/shimKeys":47,"../lang/isObject":54}],58:[function(_dereq_,module,exports){
var isArguments = _dereq_('../lang/isArguments'),
    isArray = _dereq_('../lang/isArray'),
    isIndex = _dereq_('../internal/isIndex'),
    isLength = _dereq_('../internal/isLength'),
    isObject = _dereq_('../lang/isObject');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"../internal/isIndex":42,"../internal/isLength":44,"../lang/isArguments":50,"../lang/isArray":51,"../lang/isObject":54}],59:[function(_dereq_,module,exports){
var keys = _dereq_('./keys'),
    toObject = _dereq_('../internal/toObject');

/**
 * Creates a two dimensional array of the key-value pairs for `object`,
 * e.g. `[[key1, value1], [key2, value2]]`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the new array of key-value pairs.
 * @example
 *
 * _.pairs({ 'barney': 36, 'fred': 40 });
 * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
 */
function pairs(object) {
  object = toObject(object);

  var index = -1,
      props = keys(object),
      length = props.length,
      result = Array(length);

  while (++index < length) {
    var key = props[index];
    result[index] = [key, object[key]];
  }
  return result;
}

module.exports = pairs;

},{"../internal/toObject":48,"./keys":57}],60:[function(_dereq_,module,exports){
/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],61:[function(_dereq_,module,exports){
var baseProperty = _dereq_('../internal/baseProperty'),
    basePropertyDeep = _dereq_('../internal/basePropertyDeep'),
    isKey = _dereq_('../internal/isKey');

/**
 * Creates a function that returns the property value at `path` on a
 * given object.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': { 'c': 2 } } },
 *   { 'a': { 'b': { 'c': 1 } } }
 * ];
 *
 * _.map(objects, _.property('a.b.c'));
 * // => [2, 1]
 *
 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
}

module.exports = property;

},{"../internal/baseProperty":25,"../internal/basePropertyDeep":26,"../internal/isKey":43}],62:[function(_dereq_,module,exports){
module.exports = {
    options: function(method, data) {
        return {
            dataType: "json",
            type: method,
            data: data
        };
    },
    convertResponse: function(data) {
        if (data.statusCode !== 200) {
            return $.Deferred().reject({
                readyState: 4,
                status: data.statusCode,
                responseText: data.error.message
            });
        }

        return data.result;
    },
    triggerCreated: function(item) {
        _sc.trigger("item:created", item);
        return item;
    },
    get: function(url) {
        return $.ajax({
            url: url,
            dataType: "JSON"
        });
    }
};

},{}],63:[function(_dereq_,module,exports){
var isString = _dereq_("lodash/lang/isString");

module.exports = {
    isId: function(value) {
        if (!isString(value)) {
            return false;
        }

        return (/^\{?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}?$/i).test(value);
    }
};

},{"lodash/lang/isString":55}],64:[function(_dereq_,module,exports){
var Item = _dereq_("../model/item");

var convertToItems = function(data) {
    if (!data.result) {
        console.debug("ERROR: No data from server");
        return {
            items: [],
            totalCount: 0,
            data: data
        };
    }

    if (!data.result.items) {
        console.debug("ERROR: No items from server");
        return {
            items: [],
            totalCount: 0,
            data: data
        };
    }

    var items = [];

    data.result.items.forEach(function(itemData) {
        items.push(new Item(itemData));
    });

    return {
        items: items,
        total: data.result.totalCount,
        data: data.result
    };
};

var convertToItem = function(data) {
    var response = { item: null, data: data };

    if (!data.result) {
        console.debug("ERROR: No data from server");
        return response;
    }

    if (!data.result.items) {
        console.debug("ERROR: No items from server");
        return response;
    }

    if (data.result.items.length === 0) {
        return response;
    }

    if (data.result.items.length > 1) {
        console.debug("ERROR: Expected a single item");
        return response;
    }

    response.item = new Item(data.result.items[0]);
    return response;
};

module.exports = {
    convertToItem: convertToItem,
    convertToItems: convertToItems
};

},{"../model/item":74}],65:[function(_dereq_,module,exports){
var urlHelper = _dereq_("./urlHelper");
var compact = _dereq_("lodash/array/compact");
var isString = _dereq_("lodash/lang/isString");
var isArray = _dereq_("lodash/lang/isArray");
var map = _dereq_("lodash/collection/map");
var idHelper = _dereq_("./idHelper");

var takeValidScope = function(elem) {
        switch (elem) {
            case "self":
                return "s";
            case "children":
                return "c";
            case "parent":
                return "p";
            default:
                throw "Unsupported scope. It must be either 'self', 'children' or 'parent'";
        }
    },
    addScope = function(url, scope) {
        if (scope && isArray(scope)) {
            var result = compact(map(scope, takeValidScope)).join("|");

            url = urlHelper.addQueryParameters(url, {
                scope: result
            });
        }

        return url;
    },
    addDatabase = function(url, database) {
        if (database && isString(database)) {
            url = urlHelper.addQueryParameters(url, {
                sc_database: database
            });
        }

        return url;
    },
    addContentDatabase = function(url, database) {
        if (database && isString(database)) {
            url = urlHelper.addQueryParameters(url, {
                sc_content: database
            });
        }

        return url;
    },
    addItemSelectorUrlPortion = function(url, itemSelector, options) {
        if (itemSelector && isString(itemSelector)) {
            if (options && options.facetsRootItemId) {
                url = urlHelper.addQueryParameters(url, {
                    facetsRootItemId: options.facetsRootItemId
                });
            }

            if (itemSelector.indexOf("search:") === 0) {
                url = urlHelper.addQueryParameters(url, {
                    search: itemSelector.substr("search:".length)
                });

                if (options && options.root && idHelper.isId(options.root)) {
                    url = urlHelper.addQueryParameters(url, {
                        root: options.root
                    });
                }

                if (options && options.searchConfig) {
                    url = urlHelper.addQueryParameters(url, {
                        searchConfig: options.searchConfig
                    });
                }
            } else if (itemSelector.indexOf("query:") === 0) {
                url = urlHelper.addQueryParameters(url, {
                    query: itemSelector.substr("query:".length)
                });
            } else if (idHelper.isId(itemSelector)) {
                url = urlHelper.addQueryParameters(url, {
                    sc_itemid: itemSelector
                });
            } else {
                url = urlHelper.combine(url, itemSelector);
            }
        }
        return url;
    },
    addLanguage = function(url, language) {
        if (language) {
            url = urlHelper.addQueryParameters(url, {
                language: language
            });
        }
        return url;
    },
    addItemVersion = function(url, version) {
        if (version) {
            url = urlHelper.addQueryParameters(url, {
                sc_itemversion: version
            });
        }

        return url;
    },
    buildUrl = function(itemSelector, options) {
        options = options || {};

        var webApi = "/-/item/v1";
        var virtualFolder = "";

        if (options.webApi) {
            webApi = options.webApi;
        }

        if (options.virtualFolder) {
            virtualFolder = options.virtualFolder;
        }

        var url = urlHelper.combine(webApi, virtualFolder);
        url = addItemSelectorUrlPortion(url, itemSelector, options);

        if (options.scope) {
            url = addScope(url, options.scope);
        }

        // for search datasource we should use Content Database
        if (options.database && itemSelector !== "" && itemSelector.indexOf("search:") === 0) {
            url = addContentDatabase(url, options.database);
        } else if (options.database) {
            url = addDatabase(url, options.database);
        }

        if (options.language) {
            url = addLanguage(url, options.language);
        }

        if (options.version) {
            url = addItemVersion(url, options.version);
        }

        if (options.payLoad) {
            url = urlHelper.addQueryParameters(url, {
                payload: "full"
            });
        }

        if (options.formatting) {
            url = urlHelper.addQueryParameters(url, {
                format: options.formatting
            });
        }

        if (options.sorting) {
            url = urlHelper.addQueryParameters(url, {
                sorting: options.sorting
            });
        }

        if (options.showHiddenItems) {
            url = urlHelper.addQueryParameters(url, {
                showHiddenItems: options.showHiddenItems
            });
        }

        if (options.fields) {
            url = urlHelper.addQueryParameters(url, {
                fields: options.fields.join("|")
            });
        }

        if (options.pageSize && options.pageSize > 0) {
            url = urlHelper.addQueryParameters(url, {
                pageIndex: options.pageIndex,
                pageSize: options.pageSize
            });
        }

        return url;
    };

module.exports = {
    buildUrl: buildUrl,
    getUrl: function(itemSelector, databaseUri, options) {
        options = options || {};

        if (!options.database) {
            options.database = databaseUri.databaseName;
        }

        if (!options.webApi) {
            options.webApi = databaseUri.webApi;
        }

        if (!options.virtualFolder) {
            options.virtualFolder = databaseUri.virtualFolder;
        }

        var url = buildUrl(itemSelector, options);

        return url;
    }
};

},{"./idHelper":63,"./urlHelper":66,"lodash/array/compact":1,"lodash/collection/map":5,"lodash/lang/isArray":51,"lodash/lang/isString":55}],66:[function(_dereq_,module,exports){
var reduce = _dereq_("lodash/collection/reduce");
var compact = _dereq_("lodash/array/compact");
var pairs = _dereq_("lodash/object/pairs");


var isParameterNameAlreadyInUrl = function(uri, parameterName) {
    return uri.indexOf("?" + parameterName + "=") >= 0 || uri.indexOf("&" + parameterName + "=") >= 0;
};

module.exports = {
    combine: function() {
        if (arguments.length === 0) {
            return "";
        }

        var result = reduce(arguments, function(memo, part) {
            if (part) {
                return memo + "/" + compact(part.split("/")).join("/");
            }
            return memo;
        });

        if (!result) {
            return "";
        }

        if (result.indexOf("/") === 0) {
            return result;
        }

        return "/" + result;
    },
    isParameterNameAlreadyInUrl: isParameterNameAlreadyInUrl,
    addQueryParameters: function(url, parameterObject) {
        var p = pairs(parameterObject),
            matchEncodedParamNamePattern = "([\\?&])({{param}}=[^&]+)",
            regexMatchEncodedParam,
            result = url;

        p.forEach(function(pair) {
            if (isParameterNameAlreadyInUrl(result, pair[0])) {
                regexMatchEncodedParam = new RegExp(matchEncodedParamNamePattern.replace("{{param}}", encodeURIComponent(pair[0])), "i");
                result = result.replace(regexMatchEncodedParam, "$1" + pair[0] + "=" + pair[1]);
            } else {
                result = ~result.indexOf("?") ? result += "&" : result += "?";
                result += encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1]);
            }
        });

        return result;
    },

    getQueryParameters: function(url) {
        var result = {},
            parts;

        if (!url) {
            return result;
        }

        parts = url.split("?");

        if (parts.length > 1) { //it is a full url
            parts = parts[1].split("&");
        } else { //it is not
            parts = parts[0].split("&");
        }

        if (!parts) {
            return undefined;
        }
        parts.forEach(function(part) {
            var p = part.split("=");
            if (p.length === 2) {
                result[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
        });
        //some comment
        return result;
    }
};

},{"lodash/array/compact":1,"lodash/collection/reduce":6,"lodash/object/pairs":59}],67:[function(_dereq_,module,exports){
var DatabaseUri = _dereq_("./model/databaseUri");
var Database = _dereq_("./model/database");
var itemWebApiUrlHelper = _dereq_("./helpers/itemWebApiUrlHelper");

module.exports = {
    search: function(options, done) {
        if (typeof options === "string" || options instanceof String) {
            options = {
                searchText: options
            };
        } else {
            options = options || {};
        }

        var databaseUri = new DatabaseUri(options.database);
        var database = new Database(databaseUri);

        return database.search(options.searchText, done, options);
    },
    query: function(options, done) {
        if (typeof options === "string" || options instanceof String) {
            options = {
                query: options
            };
        } else {
            options = options || {};
        }

        var databaseUri = new DatabaseUri(options.database);
        var database = new Database(databaseUri);

        return database.query(options.query, done, options);
    },
    fetch: function(id, options, done) {
        var optionsParameter, completed;

        if (arguments.length < 3) {
            completed = options;
            optionsParameter = {};
        } else {
            optionsParameter = options;
            completed = done;
        }

        var databaseUri = new DatabaseUri(optionsParameter.database);
        var database = new Database(databaseUri);

        return database.fetch(id, completed, optionsParameter);
    },
    fetchChildren: function(id, options, done) {
        var optionsParameter, completed;

        if (arguments.length === 2) {
            completed = options;
            optionsParameter = {};
        } else {
            optionsParameter = options;
            completed = done;
        }

        var databaseUri = new DatabaseUri(optionsParameter.database);
        var database = new Database(databaseUri);

        return database.fetchChildren(id, completed, optionsParameter);
    },
    create: _dereq_("./repo").create
};

},{"./helpers/itemWebApiUrlHelper":65,"./model/database":70,"./model/databaseUri":71,"./repo":75}],68:[function(_dereq_,module,exports){
var ItemUri = function(databaseUri, itemId) {
    if (!databaseUri) {
        throw "Parameter 'databaseUri' is null or empty";
    }

    if (!itemId) {
        throw "Parameter 'itemId' is null or empty";
    }

    this.databaseUri = databaseUri;
    this.itemId = itemId;
};

ItemUri.prototype.getDatabaseName = function() {
    return this.databaseUri.databaseName;
};

ItemUri.prototype.getDatabaseUri = function() {
    return this.databaseUri;
};

ItemUri.prototype.getItemId = function() {
    return this.itemId;
};

module.exports = ItemUri;

},{}],69:[function(_dereq_,module,exports){
var ItemVersionUri = function(itemUri, language, version) {
    if (!itemUri) {
        throw "Parameter 'itemUri' is null";
    }

    if (!language) {
        throw "Parameter 'language' is null or empty";
    }

    if (!_.isNumber(version)) {
        throw "Parameter 'version' is null or not a number";
    }

    this.itemUri = itemUri;
    this.language = language;
    this.version = version;
};

ItemVersionUri.prototype.getDatabaseUri = function() {
    return this.itemUri.getDatabaseUri();
};

ItemVersionUri.prototype.getDatabaseName = function() {
    return this.itemUri.getDatabaseName();
};

ItemVersionUri.prototype.getItemId = function() {
    return this.itemUri.getItemId();
};

module.exports = ItemVersionUri;

},{}],70:[function(_dereq_,module,exports){
var itemWebApiUrlHelper = _dereq_("../helpers/itemWebApiUrlHelper");
var itemHelper = _dereq_("../helpers/itemHelper");
var ajaxHelper = _dereq_("../helpers/ajaxHelper");
var ItemUri = _dereq_("./ItemUri");
var ItemVersionUri = _dereq_("./ItemVersionUri");
var noop = function() {};

var Database = function(databaseUri) {
    if (!databaseUri) {
        throw "Parameter 'databaseUri' is null";
    }

    this.databaseUri = databaseUri;
};


Database.prototype.fetch = function(id, completed, options) {
    if (!id) {
        throw "Parameter 'id' is null";
    }

    options = options || {};
    completed = completed || noop;

    if (id instanceof ItemUri) {
        options.database = id.getDatabaseName();
        id = id.getItemId();
    }

    if (id instanceof ItemVersionUri) {
        options.database = id.getDatabaseName();
        options.language = id.getLanguage();
        options.version = id.getVersion();
        id = id.getItemId();
    }

    var url = itemWebApiUrlHelper.getUrl(id, this.databaseUri, options);

    if (options["scope"] && (_.contains(options["scope"], "parent") || _.contains(options["scope"], "children"))) {
        return ajaxHelper.get(url).pipe(itemHelper.convertToItems).then(completed);
    } else {
        return ajaxHelper.get(url).pipe(itemHelper.convertToItem).then(function (data) {
            completed(data.item, data.data);
        });
    }
};

Database.prototype.search = function(searchText, completed, options) {
    if (!searchText && !options.root && !options.searchConfig) {
        throw new Error("No search parameters has been passed");
    }

    completed = completed || noop;

    var url = itemWebApiUrlHelper.getUrl("search:" + searchText, this.databaseUri, options);

    return ajaxHelper.get(url).pipe(itemHelper.convertToItems).then(function(data) {
        completed(data.items, data.total, data.data);
    });
};

Database.prototype.query = function(queryExpression, completed, options) {
    if (!queryExpression) {
        throw "Parameter 'queryExpression' is null";
    }

    completed = completed || noop;

    var url = itemWebApiUrlHelper.getUrl("query:" + queryExpression, this.databaseUri, options);

    return ajaxHelper.get(url).pipe(itemHelper.convertToItems).then(function(data) {
        completed(data.items, data.total, data.data);
    });
};

Database.prototype.fetchChildren = function(id, completed, options) {
    if (!id) {
        throw "Parameter 'id' is null";
    }

    options = options || {};
    completed = completed || noop;

    if (!options.scope) {
        options.scope = ["children"];
    }

    var url = itemWebApiUrlHelper.getUrl(id, this.databaseUri, options);

    return ajaxHelper.get(url).pipe(itemHelper.convertToItems).then(function(data) {
        completed(data.items, data.total, data.data);
    });
};

module.exports = Database;

},{"../helpers/ajaxHelper":62,"../helpers/itemHelper":64,"../helpers/itemWebApiUrlHelper":65,"./ItemUri":68,"./ItemVersionUri":69}],71:[function(_dereq_,module,exports){
var DatabaseUri = function(databaseName) {
    this.databaseName = databaseName || "core";
    this.webApi = "";
    this.virtualFolder = "/sitecore/shell";
};

module.exports = DatabaseUri;

},{}],72:[function(_dereq_,module,exports){
var FieldUri = _dereq_("./fieldUri");

var Field = function(item, fieldUri, fieldName, value, type) {
    if (!item) {
        throw "Parameter 'item' is null";
    }

    if (!(fieldUri instanceof FieldUri)) {
        throw "Parameter 'fieldUri' is null";
    }

    this.item = item;
    this.fieldUri = fieldUri;
    this.fieldName = fieldName || "";
    this.value = value || "";
    this.type = type || "Single-Line Text";
};

module.exports = Field;

},{"./fieldUri":73}],73:[function(_dereq_,module,exports){
var FieldUri = function(itemVersionUri, fieldId) {
    if (!itemVersionUri) {
        throw "Parameter 'itemVersionUri' is null or empty";
    }

    if (!fieldId) {
        throw "Parameter 'fieldId' is null or empty";
    }

    this.itemVersionUri = itemVersionUri;
    this.fieldId = fieldId;
};

FieldUri.prototype.getDatabaseUri = function() {
    return this.itemVersionUri.getDatabaseUri();
};

FieldUri.prototype.getDatabaseName = function() {
    return this.itemVersionUri.getDatabaseName();
};

FieldUri.prototype.getItemUri = function() {
    return this.itemVersionUri.getItemUri();
};

FieldUri.prototype.getItemId = function() {
    return this.itemVersionUri.getItemId();
};

FieldUri.prototype.getLanguage = function() {
    return this.itemVersionUri.getLanguage();
};

FieldUri.prototype.getVersion = function() {
    return this.itemVersionUri.getVersion();
};

module.exports = FieldUri;

},{}],74:[function(_dereq_,module,exports){
var map = _dereq_("lodash/collection/map");
var find = _dereq_("lodash/collection/find");
var filter = _dereq_("lodash/collection/filter");
var FieldUri = _dereq_("./fieldUri");
var DatabaseUri = _dereq_("./databaseUri");
var ItemUri = _dereq_("./ItemUri");
var ajaxHelper = _dereq_("../helpers/ajaxHelper");
var Field = _dereq_("./field");
var itemWebApiUrlHelper = _dereq_("../helpers/itemWebApiUrlHelper");

var shallowCopy = function(item) {
    this.$fields = item.$fields;

    var self = this;

    item.$fields.forEach(function(field, fieldId) {
        self[field.Name] = field.Value;
    });

    this.$itemUri = item.$itemUri;
    this.$itemId = item.$itemId;
    this.$itemName = item.$itemName;
    this.$displayName = item.$displayName;
    this.$language = item.$language;
    this.$version = item.$version;
    this.$templateName = item.$templateName;
    this.$templateId = item.$templateId;
    this.$hasChildren = item.$hasChildren;
    this.$path = item.$path;
    this.$url = item.$url;
    this.$mediaurl = item.$mediaurl;
};

var Item = function(itemData, itemUri) {
    itemData = itemData || {};

    this.databaseUri = new DatabaseUri(itemData.Database);

    if (!itemUri) {
        if (itemData.itemUri) {
            itemUri = itemData.itemUri;
        } else {
            itemUri = new ItemUri(this.databaseUri, itemData.ID);
        }
    }


    if (itemData instanceof Item) {
        shallowCopy.call(this, itemData);
        return;
    }

    this.$fields = [];

    var self = this;
    var fields = itemData.Fields || {};

    for (var fieldId in fields) {
        if (fields.hasOwnProperty(fieldId)) {
            var field = fields[fieldId];

            self[field.Name] = field.Value;

            var fieldUri = new FieldUri(itemUri, fieldId);

            var itemField = new Field(self, fieldUri, field.Name, field.Value, field.Type);

            if (field.FormattedValue) {
                itemField.formattedValue = field.FormattedValue;
            }
            if (field.LongDateValue) {
                itemField.longDateValue = field.LongDateValue;
            }
            if (field.ShortDateValue) {
                itemField.shortDateValue = field.ShortDateValue;
            }
            self.$fields.push(itemField);
        }
    }

    this.$itemUri = itemUri;
    this.$itemId = itemUri.getItemId();
    this.$itemName = itemData.Name || "";
    /*not field on the Item on Sitecore */
    this.$displayName = itemData.DisplayName || "";
    this.$database = itemData.Database || "";
    this.$language = itemData.Language || "";
    this.$version = itemData.Version || 0;
    this.$templateName = itemData.TemplateName || "";
    this.$templateId = itemData.TemplateId || "";
    this.$hasChildren = itemData.HasChildren || false;
    this.$path = itemData.Path || "";
    this.$url = itemData.Url || "";
    this.$mediaurl = itemData.MediaUrl || "";
    this.$icon = itemData.Icon || "";
};

Item.prototype.getFieldById = function(fieldId) {
    return find(this.$fields, function(field) {
        return field.fieldUri.getFieldId() === fieldId;
    }, this);
};

Item.prototype.save = function(completed, context) {
    var dataToSend = map(this.$fields, function(field) {
        return {
            name: field.fieldName,
            value: this[field.fieldName]
        };
    }, this);


    var url = itemWebApiUrlHelper.getUrl(this.$itemId, this.databaseUri);

    var ajaxOptions = {
        dataType: "json",
        type: "PUT",
        data: dataToSend
    };

    return $.when($.ajax(url, ajaxOptions)).pipe(ajaxHelper.convertResponse).then($.proxy(completed, context));
};

Item.prototype.rename = function(newName, completed, context) {
    var data = [{
        name: "__itemName",
        value: newName
    }];

    var url = itemWebApiUrlHelper.getUrl(this.$itemId, this.databaseUri);
    var ajaxOptions = {
        dataType: "json",
        type: "PUT",
        data: data
    };

    return $.when($.ajax(url, ajaxOptions)).pipe(ajaxHelper.convertResponse).then($.proxy(completed, context));
};

Item.prototype.remove = function(completed, context) {
    var url = itemWebApiUrlHelper.getUrl(this.$itemId, this.databaseUri);
    var ajaxOptions = {
        dataType: "json",
        type: "DELETE"
    };

    return $.when($.ajax(url, ajaxOptions)).pipe(ajaxHelper.convertResponse).then($.proxy(completed, context));
};

module.exports = Item;

},{"../helpers/ajaxHelper":62,"../helpers/itemWebApiUrlHelper":65,"./ItemUri":68,"./databaseUri":71,"./field":72,"./fieldUri":73,"lodash/collection/filter":3,"lodash/collection/find":4,"lodash/collection/map":5}],75:[function(_dereq_,module,exports){
var itemWebApiUrlHelper = _dereq_("../helpers/itemWebApiUrlHelper");
var itemHelper = _dereq_("../helpers/itemHelper");
var urlHelper = _dereq_("../helpers/urlHelper");
var ajaxHelper = _dereq_("../helpers/ajaxHelper");
var Item = _dereq_("../model/item");
var Field = _dereq_("../model/field");
var noop = function() {};

var repo = {
    create: function(itemDefinition, completed) {
        var item = itemDefinition;

        completed = completed || noop;

        if (!itemDefinition.Name || !itemDefinition.TemplateId || !itemDefinition.ParentId) {
            throw "Provide valid parameter in order to create an Item";
        }

        if (!itemDefinition.Database) {
            itemDefinition.Database = "core";
        }

        var url = itemWebApiUrlHelper.buildUrl(item.ParentId, {
            webApi: "/-/item/v1/sitecore/shell",
            database: itemDefinition.Database
        });

        url = urlHelper.addQueryParameters(url, {
            name: itemDefinition.Name
        });

        url = urlHelper.addQueryParameters(url, {
            template: itemDefinition.TemplateId
        });

        return $.when($.ajax(url, ajaxHelper.options("POST", itemDefinition.Fields)))
            .pipe(ajaxHelper.convertResponse)
            .pipe(function(data) {
                return new Item(data.items);
            })
            //.pipe(ajaxHelper.triggerCreated)
            .then(completed);
    }
};

module.exports = repo;

},{"../helpers/ajaxHelper":62,"../helpers/itemHelper":64,"../helpers/itemWebApiUrlHelper":65,"../helpers/urlHelper":66,"../model/field":72,"../model/item":74}]},{},[67])
(67)
});