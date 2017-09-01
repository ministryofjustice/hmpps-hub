!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ItemService=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],2:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],3:[function(_dereq_,module,exports){
(function (process){
// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    // Turn off strict mode for this function so we can assign to global.Q
    /* jshint strict: false */

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else {
        Q = definition();
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;

    function flush() {
        /* jshint loopfunc: true */

        while (head.next) {
            head = head.next;
            var task = head.task;
            head.task = void 0;
            var domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }

            try {
                task();

            } catch (e) {
                if (isNodeJS) {
                    // In node, uncaught exceptions are considered fatal errors.
                    // Re-throw them synchronously to interrupt flushing!

                    // Ensure continuation if the uncaught exception is suppressed
                    // listening "uncaughtException" events (as domains does).
                    // Continue in next event to avoid tick recursion.
                    if (domain) {
                        domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                        domain.enter();
                    }

                    throw e;

                } else {
                    // In browsers, uncaught exceptions are not fatal.
                    // Re-throw them asynchronously to avoid slow-downs.
                    setTimeout(function() {
                       throw e;
                    }, 0);
                }
            }

            if (domain) {
                domain.exit();
            }
        }

        flushing = false;
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process !== "undefined" && process.nextTick) {
        // Node.js before 0.9. Note that some fake-Node environments, like the
        // Mocha test runner, introduce a `process` global without a `nextTick`.
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }

    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (isPromise(value)) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become fulfilled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be fulfilled
 */
Q.race = race;
function race(answerPs) {
    return promise(function(resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function(answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return isObject(object) &&
        typeof object.promiseDispatch === "function" &&
        typeof object.inspect === "function";
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return result.value;
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return exception.value;
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var countDown = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++countDown;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--countDown === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (countDown === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {String} custom error message (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, message) {
    return Q(object).timeout(ms, message);
};

Promise.prototype.timeout = function (ms, message) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        deferred.reject(new Error(message || "Timed out after " + ms + " ms"));
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

}).call(this,_dereq_("+NscNm"))
},{"+NscNm":2}],4:[function(_dereq_,module,exports){
var exludes = [],
  keys = Object.getOwnPropertyNames( Array.prototype ),
  isObject = function ( obj ) {
    return obj === Object( obj );
  },
  isValidProperty = function ( obj, i ) {
    var value = obj[ i ],
      isExclude,
      type;

    exludes.forEach( function ( excludeKey ) {
      if ( excludeKey === i ) {
        isExclude = true;
      }
    } );

    if ( isExclude || value === void 0 ) {
      return false;
    }

    if ( !value ) {
      //if the property does not have any value, we force it to be a string
      //if we do not do this 
      value = "";
    }
    type = value.toString();

    if ( Array.isArray( value ) ) {
      return true;
    }

    return ( !isObject( value ) && type !== "[object Function]" && type !== "[object RegExp]" );
  };

var subscriptionManager = {
  subscribers: {
    any: []
  },
  subscribe: function ( action, fn, context ) {
    action = action || "any";
    fn = typeof fn === "function" ? fn : context[ fn ];

    if ( typeof this.subscribers[ action ] === "undefined" ) {
      this.subscribers[ action ] = [];
    }
    this.subscribers[ action ].push( {
      fn: fn,
      context: context || this
    } );
  },
  remove: function ( action, fn, context ) {
    this.processSubscribers( "unsubscribe", action, fn, context );
  },
  notify: function ( action, publication ) {
    this.processSubscribers( "publish", action, publication );
  },
  processSubscribers: function ( type, action, arg, context ) {
    var actionType = action || "any",
      subscribers = this.subscribers[ actionType ],
      anysubscribers = this.subscribers[ "any" ] || [],
      i,
      anysubscribersLength = anysubscribers.length,
      subscribersLength = subscribers ? subscribers.length : 0;

    for ( i = 0; i < subscribersLength; i++ ) {
      if ( type === "publish" ) {
        subscribers[ i ].fn.call( subscribers[ i ].context, arg );
      } else {
        if ( subscribers[ i ].fn === arg && subscribers[ i ].context === context ) {
          subscribers.splice( i, 1 );
        }
      }
    }

    for ( i = 0; i < anysubscribersLength; i++ ) {
      anysubscribers[ i ].fn.call( anysubscribers[ i ].context, this );
    }
  }
};

var makePublisher = function ( o ) {
  var i;

  for ( i in subscriptionManager ) {
    if ( subscriptionManager.hasOwnProperty( i ) && typeof subscriptionManager[ i ] === "function" ) {
      o[ i ] = subscriptionManager[ i ];
    }
  }
  o.subscribers = {
    any: []
  };
};

var ObservableArray = function ( arr ) {
  this.underlying = arr;

  makePublisher( this );
};

ObservableArray.prototype.actionList = {
  join: [ "change", "join" ],
  pop: [ "remove", "change", "pop" ],
  slice: [ "change", "slice" ],
  push: [ "add", "change", "push" ],
  concat: [ "add", "change", "concat" ],
  shift: [ "remove", "change", "shift" ],
  unshift: [ "add", "change", "unshift" ],
  reverse: [ "change", "reverse" ],
  sort: [ "change", "sort" ]
};

keys.forEach( function ( key ) {
  if ( key === "length" ) {
    return;
  }

  var action = ObservableArray.prototype.actionList[ key ];

  if ( action && key !== "toString" ) {
    ObservableArray.prototype[ key ] = function () {
      var self = this,
        args = arguments,
        underlyingArray = this.underlying,
        methodCallResult = Array.prototype[ key ].apply( underlyingArray, arguments ),
        events = this.actionList[ key ];

      events.forEach( function ( e ) {
        self.notify( e, args[ 0 ] );
      } );

      return methodCallResult;
    };
  } else {
    ObservableArray.prototype[ key ] = function () {
      var underlyingArray = this.underlying,
        methodCallResult = Array.prototype[ key ].apply( this.underlying, arguments );

      return methodCallResult;
    };
  }
} );

Object.defineProperty( ObservableArray.prototype, "length", {
  get: function () {
    return this.underlying.length;
  },
  set: function ( length ) {
    var currentLength = this.underlying.length;

    if ( length > currentLength ) {
      for ( var i = currentLength; i < length; i++ ) {
        this.push( void 0 );
      }
    } else {
      this.underlying.length = length;
    }
  }
} );

var makeObservableArray = function ( arr ) {
  //loop through Array.prototype and wrap the one in actionList
  var result = new ObservableArray( arr );

  return result;
};
var defineProperties = function ( obj ) {
  obj.__properties = {};

  Object.defineProperty( obj, "__observable", {
    value: true,
  } );

  var makeProperty = function ( property ) {
    if ( Array.isArray( oldValue ) ) {
      obj[ property ] = makeObservableArray( oldValue );
    } else {
      Object.defineProperty( obj, property, {
        get: function () {
          return this.__properties[ property ];
        },
        set: function ( newValue ) {
          if ( this.__properties[ property ] !== newValue ) {
            this.__properties[ property ] = newValue;
            this.notify( "change:" + property, newValue );
          }
        }
      } );

      obj[ property ] = oldValue;
    }
  };

  for ( var i in obj ) {

    if ( !subscriptionManager[ i ] && obj.hasOwnProperty( i ) && isValidProperty( obj, i ) ) {
      var oldValue = obj[ i ];
      makeProperty( i );
    }
  }
},
  observable = function ( o, ex ) {
    if ( o.__observable === true ) {
      return o;
    }
    exludes = ex || [];
    makePublisher( o );
    defineProperties( o );
    return o;
  };

module.exports = {
  publishable: makePublisher,
  observable: observable,
  observableArray: makeObservableArray
};
},{}],5:[function(_dereq_,module,exports){
var contains = _dereq_( "sc-contains" ),
  is = _dereq_( "sc-is" );

var cast = function ( _value, _castType, _default, _values, _additionalProperties ) {

  var parsedValue,
    castType = _castType.toLowerCase(),
    value,
    values = is.an.array( _values ) ? _values : [],
    alreadyCorrectlyTyped;

  switch ( true ) {
  case ( /float|integer/.test( castType ) ):
    castType = "number";
    break;
  }

  if ( is.a.hasOwnProperty( castType ) ) {
    alreadyCorrectlyTyped = is.a[ castType ]( _value );
  } else if ( castType === '*' ) {
    alreadyCorrectlyTyped = true;
  }

  if ( alreadyCorrectlyTyped ) {

    value = _value;

  } else {

    switch ( true ) {

    case castType === "array":

      try {
        if ( is.a.string( _value ) ) {
          value = JSON.parse( _value );
        }
        if ( is.not.an.array( value ) ) {
          throw "";
        }
      } catch ( e ) {
        if ( is.not.nullOrUndefined( _value ) ) {
          value = [ _value ];
        }
      }
      break;

    case castType === "boolean":

      try {
        value = /^(true|1|y|yes)$/i.test( _value.toString() ) ? true : undefined;
      } catch ( e ) {}

      if ( is.not.a.boolean( value ) ) {

        try {
          value = /^(false|-1|0|n|no)$/i.test( _value.toString() ) ? false : undefined;
        } catch ( e ) {}

      }

      value = is.a.boolean( value ) ? value : undefined;

      break;

    case ( castType === "date" || castType === "datetime" ):

      try {

        value = new Date( _value );

        value = isNaN( value.getTime() ) ? undefined : value;
      } catch ( e ) {}

      break;

    case castType === "string":
      if (is.a.string( _value )) {
        value = _value
      }

      if ( is.a.boolean( _value ) || is.a.number( _value ) ) {
        value = _value.toString();
      }

      break;

    case castType === "number":

      try {

        if( is.a.array( _value ) || is.a.guid( _value ) ) {
          throw "wrong number"; 
        }

        value = parseFloat( _value );

        if ( is.not.a.number( value ) || isNaN( value ) ) {
          value = undefined;
        }
      } catch ( e ) {
        value = undefined
      }

      if ( value !== undefined ) {
        switch ( true ) {
        case _castType === "integer":
          value = parseInt( value, 10 );
          break;
        }
      }

      break;

    default:

      try {
        value = cast( JSON.parse( _value ), castType )
      } catch ( e ) {}

      break;

    }

  }

  if ( values.length > 0 && !contains( values, value ) ) {
    value = values[ 0 ];
  }

  return is.not.undefined( value ) ? value : is.not.undefined( _default ) ? _default : null;

};

module.exports = cast;
},{"sc-contains":6,"sc-is":17}],6:[function(_dereq_,module,exports){
var contains = function ( data, item ) {
  var foundOne = false;

  if ( Array.isArray( data ) ) {

    data.forEach( function ( arrayItem ) {
      if ( foundOne === false && item === arrayItem ) {
        foundOne = true;
      }
    } );

  } else if ( Object( data ) === data ) {

    Object.keys( data ).forEach( function ( key ) {

      if ( foundOne === false && data[ key ] === item ) {
        foundOne = true;
      }

    } );

  }
  return foundOne;
};

module.exports = contains;
},{}],7:[function(_dereq_,module,exports){
module.exports={
  "defaultHttpMethod": "GET",
  "maxNumberOfConcurrentXhr": 5,
  "idKey": "ItemID"
}
},{}],8:[function(_dereq_,module,exports){
var is = _dereq_( "sc-is" ),
  Item = _dereq_( "./item" ),
  config = _dereq_( "./config.json" ),
  Query = _dereq_( "sc-query" ),
  q = _dereq_( "q" ),
  merge = _dereq_( "sc-merge" ),
  hasKey = _dereq_( "sc-hasKey" ),
  emitter = _dereq_( "emitter-component" ),
  optionify = _dereq_( "sc-optionify" ),
  extendify = _dereq_( "sc-extendify" );

var Data = extendify( {

  init: function ( options ) {
    var self = this;

    self.option( merge( {}, options ) );
    self.url = hasKey( self.options, "url", "string" ) ? self.options.url : "";
    self.type = hasKey( self.options, "type", "string" ) ? self.options.type : config.defaultHttpMethod;
    self.headers = hasKey( self.options, "headers", "object") ? self.options.headers : {};
  },

  get: function ( url, options ) {
    var self = this;
    url = is.a.string( url ) ? url : self.url;
    options = is.an.object( url ) ? url : options || {};
    options = merge( options, { headers: self.headers } );
    return new Query( self.url, "get", options );
  },

  put: function ( url, options ) {
    var self = this;
    url = is.a.string( url ) ? url : self.url;
    options = is.an.object( url ) ? url : options || {};
    options = merge( options, { headers: self.headers } );
    return new Query( self.url, "put", options );
  },

  post: function ( url, options ) {
    var self = this;
    url = is.a.string( url ) ? url : self.url;
    options = is.an.object( url ) ? url : options || {};
    options = merge( options, { headers: self.headers } );
    return new Query( self.url, "post", options );
  },

  delete: function ( url, options ) {
    var self = this;
    url = is.a.string( url ) ? url : self.url;
    options = is.an.object( url ) ? url : options || {};
    options = merge( options, { headers: self.headers } );
    return new Query( self.url, "delete", options );
  }

} );

emitter( Data.prototype );
optionify( Data.prototype );

exports = module.exports = Data;
exports.config = config;
exports.Query = Query;
exports.Item = Item;
},{"./config.json":7,"./item":9,"emitter-component":1,"q":3,"sc-extendify":11,"sc-hasKey":13,"sc-is":17,"sc-merge":23,"sc-optionify":26,"sc-query":29}],9:[function(_dereq_,module,exports){
var is = _dereq_( "sc-is" ),
  q = _dereq_( "q" ),
  pick = _dereq_( "sc-pick" ),
  hasKey = _dereq_( "sc-hasKey" ),
  emitter = _dereq_( "emitter-component" ),
  omit = _dereq_( "sc-omit" ),
  optionify = _dereq_( "sc-optionify" ),
  extendify = _dereq_( "sc-extendify" );

var defineProperties = function ( item, data ) {
  var self = item;

  data = is.an.object( data ) ? data : {};

  Object.defineProperties( self, {

    "isTrackable": {
      get: function () {
        return self[ "__trackable" ] === true;
      }
    },

    "__originalKeys": {
      value: Object.keys( data )
    }

  } );
};

var Item = extendify( {

  init: function ( data, options ) {

    this.option( is.an.object( options ) ? options : {} );

    defineProperties( this, data, options );

  },

  json: function ( json ) {
    var self = this

    json = json || pick( self, self.__originalKeys ); // TODO: handle if this is `raw`

    // If it's an observable array, omit the observable properties and methods to retrieve the raw array
    Object.keys( json ).forEach( function ( key ) {

      // Detect an observable array
      if ( ( hasKey( json, key + ".underlying", "array" ) || hasKey( json, key + ".array", "array" ) ) && hasKey( json, key + ".subscribe", "function" ) ) {
        json[ key ] = json[ key ].array || json[ key ].underlying;
      }

    } );

    if ( self[ "__optionify" ] ) {
      json = omit( json, [ "options" ] );
    }

    return json;
  }

} );

emitter( Item.prototype );
optionify( Item.prototype );

module.exports = Item;
},{"emitter-component":1,"q":3,"sc-extendify":11,"sc-hasKey":13,"sc-is":17,"sc-omit":25,"sc-optionify":26,"sc-pick":27}],10:[function(_dereq_,module,exports){
var extend = function ( object ) {

	/**
	 * John Resig's "Simple JavaScript Inheritance"
	 * @url http://ejohn.org/blog/simple-javascript-inheritance
	 */
	var initializing = false,
		fnTest = /xyz/.test( function () {
			xyz;
		} ) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	var Class = function () {};

	// Create a new Class that inherits from this class
	Class.extend = function ( prop ) {
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for ( var name in prop ) {
			// Check if we're overwriting an existing function
			prototype[ name ] = typeof prop[ name ] == "function" &&
				typeof _super[ name ] == "function" && fnTest.test( prop[ name ] ) ?
				( function ( name, fn ) {
				return function () {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[ name ];

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply( this, arguments );
					this._super = tmp;

					return ret;
				};
			} )( name, prop[ name ] ) :
				prop[ name ];
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if ( !initializing && this.init )
				this.init.apply( this, arguments );
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;

	};
	/* ---- */

	return Class.extend( object );

};

module.exports = extend;
},{}],11:[function(_dereq_,module,exports){
var hasKey = _dereq_( "sc-haskey" ),
  merge = _dereq_( "sc-merge" ),
  omit = _dereq_( "sc-omit" ),
  extend = _dereq_( "./extend.johnresig.js" ),
  noop = function () {};

var extendify = function ( fn ) {

  var object,
    protos;

  fn = typeof fn === "function" || typeof fn === "object" ? fn : {};
  protos = fn.prototype || fn;
  object = merge( omit( protos, [ "constructor", "init" ] ) );
  object.init = hasKey( fn, "prototype.constructor", "function" ) ? fn.prototype.constructor : hasKey( fn, "init", "function" ) ? fn.init : typeof fn === "function" ? fn : noop;

  return extend( object );

};

module.exports = extendify;
},{"./extend.johnresig.js":10,"sc-haskey":15,"sc-merge":23,"sc-omit":25}],12:[function(_dereq_,module,exports){
var guidRx = "{?[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}}?";

exports.generate = function () {
  var d = new Date().getTime();
  var guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace( /[xy]/g, function ( c ) {
    var r = ( d + Math.random() * 16 ) % 16 | 0;
    d = Math.floor( d / 16 );
    return ( c === "x" ? r : ( r & 0x7 | 0x8 ) ).toString( 16 );
  } );
  return guid;
};

exports.match = function ( string ) {
  var rx = new RegExp( guidRx, "g" ),
    matches = ( typeof string === "string" ? string : "" ).match( rx );
  return Array.isArray( matches ) ? matches : [];
};

exports.isValid = function ( guid ) {
  var rx = new RegExp( guidRx );
  return rx.test( guid );
};
},{}],13:[function(_dereq_,module,exports){
var type = _dereq_( "type-component" ),
  has = Object.prototype.hasOwnProperty;

function hasKey( object, keys, keyType ) {

  object = type( object ) === "object" ? object : {}, keys = type( keys ) === "array" ? keys : [];
  keyType = type( keyType ) === "string" ? keyType : "";

  var key = keys.length > 0 ? keys.shift() : "",
    keyExists = has.call( object, key ) || object[ key ] !== void 0,
    keyValue = keyExists ? object[ key ] : undefined,
    keyTypeIsCorrect = type( keyValue ) === keyType;

  if ( keys.length > 0 && keyExists ) {
    return hasKey( object[ key ], keys, keyType );
  }

  return keys.length > 0 || keyType === "" ? keyExists : keyExists && keyTypeIsCorrect;

}

module.exports = function ( object, keys, keyType ) {

  keys = type( keys ) === "string" ? keys.split( "." ) : [];

  return hasKey( object, keys, keyType );

};
},{"type-component":14}],14:[function(_dereq_,module,exports){

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val === Object(val)) return 'object';

  return typeof val;
};

},{}],15:[function(_dereq_,module,exports){
module.exports=_dereq_(13)
},{"type-component":16}],16:[function(_dereq_,module,exports){
module.exports=_dereq_(14)
},{}],17:[function(_dereq_,module,exports){
var type = _dereq_( "./ises/type" ),
  is = {
    a: {},
    an: {},
    not: {
      a: {},
      an: {}
    }
  };

var ises = {
  "arguments": [ "arguments", type( "arguments" ) ],
  "array": [ "array", type( "array" ) ],
  "boolean": [ "boolean", type( "boolean" ) ],
  "date": [ "date", type( "date" ) ],
  "function": [ "function", "func", "fn", type( "function" ) ],
  "null": [ "null", type( "null" ) ],
  "number": [ "number", "integer", "int", type( "number" ) ],
  "object": [ "object", type( "object" ) ],
  "regexp": [ "regexp", type( "regexp" ) ],
  "string": [ "string", type( "string" ) ],
  "undefined": [ "undefined", type( "undefined" ) ],
  "empty": [ "empty", _dereq_( "./ises/empty" ) ],
  "nullorundefined": [ "nullOrUndefined", "nullorundefined", _dereq_( "./ises/nullorundefined" ) ],
  "guid": [ "guid", _dereq_( "./ises/guid" ) ]
}

Object.keys( ises ).forEach( function ( key ) {

  var methods = ises[ key ].slice( 0, ises[ key ].length - 1 ),
    fn = ises[ key ][ ises[ key ].length - 1 ];

  methods.forEach( function ( methodKey ) {
    is[ methodKey ] = is.a[ methodKey ] = is.an[ methodKey ] = fn;
    is.not[ methodKey ] = is.not.a[ methodKey ] = is.not.an[ methodKey ] = function () {
      return fn.apply( this, arguments ) ? false : true;
    }
  } );

} );

exports = module.exports = is;
exports.type = type;
},{"./ises/empty":18,"./ises/guid":19,"./ises/nullorundefined":20,"./ises/type":21}],18:[function(_dereq_,module,exports){
var type = _dereq_("../type");

module.exports = function ( value ) {
  var empty = false;

  if ( type( value ) === "null" || type( value ) === "undefined" ) {
    empty = true;
  } else if ( type( value ) === "object" ) {
    empty = Object.keys( value ).length === 0;
  } else if ( type( value ) === "boolean" ) {
    empty = value === false;
  } else if ( type( value ) === "number" ) {
    empty = value === 0 || value === -1;
  } else if ( type( value ) === "array" || type( value ) === "string" ) {
    empty = value.length === 0;
  }

  return empty;

};
},{"../type":22}],19:[function(_dereq_,module,exports){
var guid = _dereq_( "sc-guid" );

module.exports = function ( value ) {
  return guid.isValid( value );
};
},{"sc-guid":12}],20:[function(_dereq_,module,exports){
module.exports = function ( value ) {
	return value === null || value === undefined || value === void 0;
};
},{}],21:[function(_dereq_,module,exports){
var type = _dereq_( "../type" );

module.exports = function ( _type ) {
  return function ( _value ) {
    return type( _value ) === _type;
  }
}
},{"../type":22}],22:[function(_dereq_,module,exports){
var toString = Object.prototype.toString;

module.exports = function ( val ) {
  switch ( toString.call( val ) ) {
  case '[object Function]':
    return 'function';
  case '[object Date]':
    return 'date';
  case '[object RegExp]':
    return 'regexp';
  case '[object Arguments]':
    return 'arguments';
  case '[object Array]':
    return 'array';
  }

  if ( val === null ) return 'null';
  if ( val === undefined ) return 'undefined';
  if ( val === Object( val ) ) return 'object';

  return typeof val;
};
},{}],23:[function(_dereq_,module,exports){
var type = _dereq_( "type-component" );

var merge = function () {

  var args = Array.prototype.slice.call( arguments ),
    deep = type( args[ 0 ] ) === "boolean" ? args.shift() : false,
    objects = args,
    result = {};

  objects.forEach( function ( objectn ) {

    if ( type( objectn ) !== "object" ) {
      return;
    }

    Object.keys( objectn ).forEach( function ( key ) {
      if ( Object.prototype.hasOwnProperty.call( objectn, key ) ) {
        if ( deep && type( objectn[ key ] ) === "object" ) {
          result[ key ] = merge( deep, {}, result[ key ], objectn[ key ] );
        } else {
          result[ key ] = objectn[ key ];
        }
      }
    } );

  } );

  return result;
};

module.exports = merge;
},{"type-component":24}],24:[function(_dereq_,module,exports){
module.exports=_dereq_(14)
},{}],25:[function(_dereq_,module,exports){
function omit( object, omittedKeys ) {
  var parsedObject = {};

  if ( object !== Object( object ) ) {
    return parsedObject;
  }

  omittedKeys = Array.isArray( omittedKeys ) ? omittedKeys : [];

  Object.keys( object ).forEach( function ( key ) {
    var keyOk = true;

    omittedKeys.forEach( function ( omittedKey ) {

      if ( keyOk === true && key === omittedKey ) {
        keyOk = false;
      }

    } );

    if ( keyOk === true ) {
      parsedObject[ key ] = object[ key ];
    }

  } );

  return parsedObject;
}

module.exports = omit;
},{}],26:[function(_dereq_,module,exports){
var merge = _dereq_( "sc-merge" );

var optionify = function ( value, options ) {
  var valueIsAFunction = typeof value === "function",
    obj = valueIsAFunction ? value.prototype : value;

  if ( Object.hasOwnProperty.call( obj, "__optionify" ) && obj.__optionify === true ) {
    return;
  }

  options = merge( {
    propertyName: "options",
    methodName: "option"
  }, options );

  obj[ options.propertyName ] = {};

  Object.defineProperty( obj, "__optionify", {
    value: true
  } );

  Object.defineProperty( obj, options.methodName, {

    value: function ( key, value ) {

      if ( typeof key === "string" ) {

        if ( arguments.length === 2 ) {
          this[ options.propertyName ][ key ] = value;
          return this;
        } else {
          return this[ options.propertyName ][ key ];
        }

      } else if ( typeof key === "object" ) {

        this[ options.propertyName ] = key;
        return this;

      }
    }

  } );

};

module.exports = optionify;
},{"sc-merge":23}],27:[function(_dereq_,module,exports){
function pick( object, validKeys ) {
  var parsedObject = {};

  if ( object !== Object( object ) ) {
    return parsedObject;
  }

  validKeys = Array.isArray( validKeys ) ? validKeys : [];

  Object.keys( object ).forEach( function ( key ) {
    var keyOk = false;

    validKeys.forEach( function ( validKey ) {
      if ( keyOk === false && key === validKey ) {
        keyOk = true;
      }
    } );

    if ( keyOk === true ) {
      parsedObject[ key ] = object[ key ];
    }

  } );

  return parsedObject;
}

module.exports = pick;
},{}],28:[function(_dereq_,module,exports){
module.exports={
	"defaults": {
		"defaultHttpMethod": "get"
	}
}
},{}],29:[function(_dereq_,module,exports){
/**
 * @namespace
 */

var q = _dereq_( "q" ),
  config = _dereq_( "./config.json" ),
  extendify = _dereq_( "sc-extendify" ),
  utils = _dereq_( "./utils" );

var Query = extendify( {

  /**
   * `Query` is a versatile XHR module with various helpers and utilities to make configuring,
   * executing and extending ajax related tasks very easy. `Query` is a small standalone module with
   * everything baked in including callbacks and error handling by <a href="http://npmjs.org/q" target="_blank">q</a>
   * which implements follows the standard <a href="http://promises-aplus.github.io/promises-spec/" target="_blank">promise</a> pattern.
   *
   * ```javascript
   * var personQuery = new Query( "/person", "get" );
   *
   * personQuery.param( "name", "Kelsey Mayer" ).execute().then( function ( kelsey ) {
   *
   *   kelsey.name.should.equal( "Kelsey Mayer" );
   *   _done();
   *
   * } );
   * ```
   *
   * @class Query
   * @constructor
   * @param  {String} url     The URL end point
   * @param  {String} type    The HTTP method
   * @param  {Object} [options] The options
   * @return {Query}
   */
  init: function ( url, type, options ) {
    var self = this;

    /**
     * The URL end point
     * @property {String} url
     */
    self.url = url;

    /**
     * The HTTP method
     * @property {String} type
     */
    self.type = utils.is.string( type ) ? type : config.defaults.defaultHttpMethod;

    /**
     * The options
     * @property {String} options
     */
    self.options = utils.is.an.object( options ) ? options : {};

    self.__parameters = {};
    self.__queries = {};
    self.__headers = {};

    if( self.options.headers ) {
      self.__headers = utils.merge( self.__headers, self.options.headers );
    }
  },

  /**
   * Gets or sets all the parameters. A parameter is typically the JSON body data of the request.
   *
   * @method parameters
   * @chainable
   * @param  {Object} [data] Merges the given data into the current parameters
   * @return {Mixed} If `data` was given, `self` is returned, otherwise all the parameters are returned
   */
  parameters: function ( data ) {
    var self = this;
    if ( utils.is.an.object( data ) ) {
      self.__parameters = utils.merge( self.__parameters, data );
      return self;
    }
    return self.__parameters;
  },

  /**
   * Gets or sets a parameter by a key/value pair. A parameter is typically the JSON body data of the request.
   *
   * @method parameter
   * @chainable
   * @param  {String} key   The parameter key
   * @param  {String} value The parameter value
   * @return {Mixed} If `key` and `value` was given `self` is returned, if only `key` was given, the value of that key is returned.
   */
  parameter: function ( key, value ) {
    var self = this;

    if ( self.__parameters.hasOwnProperty( key ) && utils.is.empty( value ) ) {
      return self.__parameters[ key ];
    }

    self.__parameters[ key ] = value;

    return self;
  },

  /**
   * Gets or sets all the queries. Queries are the key/value pairs added to the querystring of the request.
   *
   * @method queries
   * @chainable
   * @param  {Object} [data] Merges the given data into the current queries
   * @return {Mixed} If `data` was given, `self` is returned, otherwise all the queries are returned
   */
  queries: function ( data ) {
    var self = this;
    if ( utils.is.an.object( data ) ) {
      self.__queries = utils.merge( self.__queries, data );
      return self;
    }
    return self.__queries;
  },

  /**
   * Gets or sets a query by a key/value pair. A query is the key/value pair which is added to the queryingstring.
   *
   * @method query
   * @chainable
   * @param  {String} key   The query key
   * @param  {String} value The query value
   * @return {Mixed} If `key` and `value` was given `self` is returned, if only `key` was given, the value of that key is returned.
   */
  query: function ( key, value ) {
    var self = this;

    if ( self.__queries.hasOwnProperty( key ) && utils.is.empty( value ) ) {
      return self.__queries[ key ];
    }

    self.__queries[ key ] = value;

    return self;
  },

  /**
   * Gets or sets a header by a key/value pair. A header is the key/value pair which is added to the headers of the request.
   *
   * @method header
   * @chainable
   * @param  {String} key   The header key
   * @param  {String} value The header value
   * @return {Mixed} If `key` and `value` was given `self` is returned, if only `key` was given, the value of that key is returned.
   */
  header: function ( key, value ) {
    var self = this;

    if ( self.__headers.hasOwnProperty( key ) && utils.is.empty( value ) ) {
      return self.__headers[ key ];
    }

    self.__headers[ key ] = value;

    return self;
  },

  /**
   * Executes the query by triggering the XHR request to the given url (end point).
   *
   * @method execute
   * @return {Promise} This <a href="http://promises-aplus.github.io/promises-spec/" target="_blank">promise</a> is generated by <a href="http://npmjs.org/q" target="_blank">q</a>.
   */
  execute: function () {
    var self = this,
      preRequestDeferred = q.defer(),
      requestData,
      defer = q.defer();

    requestData = {
      type: self.type,
      url: self.url,
      data: self.__parameters,
      query: self.__queries,
      header: self.__headers
    };

    self.middleware( "preRequest", function ( error, middlewareResponse ) {

      middlewareResponse = error && !( error instanceof Error ) ? error : middlewareResponse;
      error = error instanceof Error ? error : null;

      if ( error ) {
        defer.reject( error );
      } else {
        preRequestDeferred.resolve( middlewareResponse );
      }

    }, requestData );

    preRequestDeferred.promise.then( function ( preRequestResponse ) {

      utils.request( preRequestResponse ).then( function ( postRequestResponse ) {

        self.middleware( "postRequest", function ( error, middlewareResponse ) {

          middlewareResponse = error && !( error instanceof Error ) ? error : middlewareResponse;
          error = error instanceof Error ? error : null;

          if ( error ) {
            defer.reject( error );
          } else {
            defer.resolve( middlewareResponse );
          }

        }, postRequestResponse );

      } ).fail( defer.reject );

    } ).fail( defer.reject );

    return defer.promise;
  }

} );

Query.prototype.param = Query.prototype.parameter;

utils.optionify( Query );

/**
 * Middleware integration using <a href="http://npmjs.org/sc-useify" target="_blank">sc-useify</a>.
 *
 * @static
 * @property {Function} useify
 *
 */
utils.useify( Query );

/**
 * Adds middleware using <a href="http://npmjs.org/sc-useify" target="_blank">sc-useify</a>. As of sc-query@0.0.11 there are two named middleware keys.
 *
 * - `preRequest` occurs just before the XHR request is made. The data is given to the middleware and should be given back when the callback is triggered.
 * - `postRequest` occurs after the XHR request resolves. The data is given to the middleware and should be given back when the callback is triggered.
 *
 * @static
 * @property {Function} use
 */

exports = module.exports = Query;

/**
 * A collection of helper utilities
 *
 * @static
 * @property {Object} utils
 */
exports.utils = utils;

/**
 * The configuration object
 *
 * @static
 * @property {Object} config
 *           @param {String} defaults.defaultHttpMethod="GET" The default HTTP method
 */
exports.config = config;

},{"./config.json":28,"./utils":30,"q":3,"sc-extendify":11}],30:[function(_dereq_,module,exports){
module.exports = {
  merge: _dereq_( "sc-merge" ),
  optionify: _dereq_( "sc-optionify" ),
  request: _dereq_( "sc-request" ),
  useify: _dereq_( "sc-useify" ),
  is: _dereq_( "sc-is" )
}
},{"sc-is":17,"sc-merge":23,"sc-optionify":26,"sc-request":32,"sc-useify":36}],31:[function(_dereq_,module,exports){
module.exports={
  "defaults": {
    "options": {
      "maxNumberOfConcurrentXhr": 5,
      "language": {
        "undefinedStatusMessage": "The server returned an undefined status message",
        "malformedServerResponse": "Malformed server response. Expected a JSON object but got plain text"
      }
    }
  }
}
},{}],32:[function(_dereq_,module,exports){
var config = _dereq_( "./config.json" ),
  q = _dereq_( "q" ),
  superagent = _dereq_( "superagent" ),
  Queue = _dereq_( "sc-queue" ),
  hasKey = _dereq_( "sc-haskey" ),
  guid = _dereq_( "sc-guid" ),
  merge = _dereq_( "sc-merge" ),
  is = _dereq_( "sc-is" ),
  useify = _dereq_( "sc-useify" ),
  queue;

var Request = function ( options ) {
  var self = this;

  options = merge( config.defaults.options, options );

  queue = new Queue( function ( task, callback ) {

    superagent( task.data.type, task.data.url )[ /get/i.test( task.data.type ) ? "query" : "send" ]( task.data.data )
      .query( task.data.query )
      .set( task.data.header || {} )
      .accept( "json" )
      .type( "json" )
      .end( function ( error, response ) {

        var hasBody = hasKey( response, "body", "object" ) || hasKey( response, "body", "array" ) ? response.body : null,
          responseText = hasKey( response, "text", "string" ) ? response.text.trim() : "",
          xhrStatusText = hasKey( response, "xhr.statusText", "string" ) ? response.xhr.statusText.trim() : "";

        if ( !error && response[ "ok" ] !== true ) {
          error = new Error( responseText || xhrStatusText || options.language.undefinedStatusMessage );
        }

        if ( !error && !hasBody && /^get$/i.test( task.data.type ) ) {
          error = new Error( options.language.malformedServerResponse );
        }

        self.middleware( "postRequest", function ( middlewareErrors, middlewareResponse ) {

          callback( error || middlewareErrors, {
            defer: task.defer,
            response: middlewareResponse || response
          } );

        }, error, response );

      } );

  }, options.maxNumberOfConcurrentXhr );

};

Request.prototype.call = function ( obj, options ) {
  var defer = q.defer(),
    task = {
      data: obj,
      defer: defer
    };

  task.data.query = is.an.object( task.data[ "query" ] ) ? task.data.query : {};

  queue.push( task, function ( error, task ) {
    defer[ error ? "reject" : "resolve" ]( error || task.response.body );
  } );

  return defer.promise;
};

useify( Request );

exports = module.exports = function ( obj, options ) {

  var defer = q.defer(),
    request = new Request( options );

  request.call( obj, options ).then( defer.resolve ).fail( defer.reject );

  return defer.promise;
};

exports.use = Request.use;
exports.useify = Request.useify;
},{"./config.json":31,"q":3,"sc-guid":12,"sc-haskey":15,"sc-is":17,"sc-merge":23,"sc-queue":33,"sc-useify":36,"superagent":37}],33:[function(_dereq_,module,exports){
/**
 * Based on : https://github.com/component/queue
 */

var is = _dereq_( "sc-is" ),
  drainedTimeout,
  noop = function () {};

function Queue( worker, concurrency ) {
  var self = this;

  self.worker = worker;
  self.concurrency = is.a.number( concurrency ) ? concurrency : 1;
  self.pending = 0;
  self.jobs = [];
  self.errors = [];

}

Queue.prototype.drain = noop;
Queue.prototype.push = function ( data, callback ) {
  var self = this;

  callback = is.a.func( callback ) ? callback : noop;

  self.jobs.push( {
    data: data,
    callback: callback
  } );

  setTimeout( self.run.bind( self ), 0 );
};

Queue.prototype.run = function () {
  var self = this;

  while ( self.pending < self.concurrency ) {
    var job = self.jobs.shift();
    if ( !job ) {
      break;
    }
    self.exec( job );
  }
};

Queue.prototype.exec = function ( job ) {
  var self = this;

  self.pending++;

  self.worker( job.data, function ( error ) {

    if ( error ) {
      self.errors.push( {
        data: job.data,
        error: error
      } );
    }
    job.callback.apply( self, arguments );
    self.pending--;
    self.run();

    clearTimeout( drainedTimeout );

    drainedTimeout = setTimeout( function () {
      if ( self.jobs.length === 0 ) {
        self.drain( self.errors.length > 0 ? self.errors : null );
        self.errors = [];
      }
    }, 10 );

  } );

};

module.exports = Queue;
},{"sc-is":17}],34:[function(_dereq_,module,exports){
var binding = _dereq_( "sc-bindingjs" ),
  is = _dereq_( "sc-is" );

var hasChangedKey = function ( delta ) {
  var hasChanged = false;
  for ( var key in delta ) {
    if ( delta.hasOwnProperty( key ) ) {
      if ( delta[ key ] && !hasChanged ) {
        hasChanged = true;
      }
    }
  }
  return hasChanged;
};

var valuesHaveActuallyChanged = function ( val1, val2 ) {
  var bothAreNullOrUndefinedOrEmptyStrings = ( is.nullOrUndefined( val1 ) || val1 === "" ) && ( is.nullOrUndefined( val2 ) || val2 === "" ),
    bothAreEqual = val1 === val2;

  return bothAreNullOrUndefinedOrEmptyStrings || bothAreEqual ? false : true;
};

var delta = function ( original, changed ) {
  var self = this,
    changes = {},
    hasChanged = false;

  for ( var key in original ) {
    if ( original.hasOwnProperty( key ) ) {
      if ( valuesHaveActuallyChanged( original[ key ], changed[ key ] ) ) {
        hasChanged = true;
        changes[ key ] = true;
      } else {
        changes[ key ] = false;
      }
    }
  }

  return changes;
};

var defineProperties = function ( self ) {

  Object.defineProperties( self, {

    "__trackable": {
      value: true
    },

    "__properties": {
      writable: true
    },

    "__original": {
      writable: true
    },

    "hasChanged": {
      value: function ( propertyName ) {
        var self = this,
          hasChanged;

        if ( propertyName && !self.__original.hasOwnProperty( propertyName ) ) {
          throw "invalid property name";
        }

        hasChanged = delta.apply( self, [ self.__original, self ] );

        if ( propertyName ) {
          return hasChanged[ propertyName ];
        } else {
          return hasChangedKey( hasChanged );
        }
      }
    },

    "resetOriginalValues": {
      value: function () {
        var self = this;
        self.__original = JSON.parse( JSON.stringify( self.__properties ) );
      }
    },

    "revertChanges": {
      value: function () {
        var self = this;

        for ( var i in self.__original ) {
          if ( self.__original.hasOwnProperty( i ) ) {
            self[ i ] = self.__original[ i ];
          }
        }
      }
    }

  } );

};

var trackable = function ( entity ) {
  var self = entity;

  if ( self.__trackable === true ) {
    return;
  }

  if ( self.__observable !== true ) {
    binding.observable( self );
  }

  defineProperties( self );
  self.resetOriginalValues();

  self.subscribe( "any", function ( newData ) {
    delta.apply( self, [ self.__original, newData ] );
    if ( typeof self[ "save" ] === "function" ) {
      var query = self.save();
      if ( is.an.object( query ) && typeof query[ "execute" ] === "function" ) {
        query.execute().then( function () {
          if ( typeof self[ "emit" ] === "function" ) {
            self.emit( "save" );
          }
        } ).fail( function ( error ) {
          self.emit( "save", error );
        } );
      }
    }
  } );

  if ( typeof self[ "on" ] === "function" ) {
    self.on( "save", function ( error ) {
      if ( error ) {
        return;
      }
      self.resetOriginalValues();
    } );
  }

};

module.exports = trackable;
},{"sc-bindingjs":4,"sc-is":17}],35:[function(_dereq_,module,exports){
module.exports={
	"defaults": {
		"middlewareKey": "all"
	}
}
},{}],36:[function(_dereq_,module,exports){
var is = _dereq_( "sc-is" ),
  config = _dereq_( "./config.json" ),
  noop = function () {};

var useifyFunction = function ( functions, key, fn ) {
  if ( is.not.empty( key ) && is.a.string( key ) ) {
    if ( is.not.an.array( functions[ key ] ) ) {
      functions[ key ] = [];
    }
    if ( is.a.func( fn ) ) {
      functions[ key ].push( fn );
    }
    return functions[ key ];
  }
}

var Useify = function () {
  this.functions = {
    all: []
  };
};

Useify.prototype.use = function () {
  var self = this,
    args = Array.prototype.slice.call( arguments ),
    key = is.a.string( args[ 0 ] ) ? args.shift() : config.defaults.middlewareKey,
    fn = is.a.func( args[ 0 ] ) ? args.shift() : noop;

  useifyFunction( self.functions, key, fn );
};

Useify.prototype.middleware = function () {

  var self = this,
    currentFunction = 0,
    args = Array.prototype.slice.call( arguments ),
    middlewareKey = is.a.string( args[ 0 ] ) && is.a.func( args[ 1 ] ) ? args.shift() : config.defaults.middlewareKey,
    callback = is.a.func( args[ 0 ] ) ? args.shift() : noop;

  useifyFunction( self.functions, middlewareKey );

  var next = function () {
    var fn = self.functions[ middlewareKey ][ currentFunction++ ],
      args = Array.prototype.slice.call( arguments );

    if ( !fn ) {
      callback.apply( self.context, args );
    } else {
      args.push( next );
      fn.apply( self.context, args );
    }

  };

  next.apply( self.context, args );

};

Useify.prototype.clear = function ( middlewareKey ) {
  if ( is.a.string( middlewareKey ) && is.not.empty( middlewareKey ) ) {
    this.functions[ middlewareKey ] = [];
  } else {
    this.functions = {
      all: []
    };
  }
};

module.exports = function ( _objectOrFunction ) {

  var useify = new Useify();

  if ( is.an.object( _objectOrFunction ) ) {

    Object.defineProperties( _objectOrFunction, {

      "use": {
        value: function () {
          useify.use.apply( useify, arguments );
          return _objectOrFunction;
        }
      },

      "middleware": {
        value: function () {
          useify.middleware.apply( useify, arguments );
        }
      },

      "useify": {
        value: useify
      }

    } );

    useify.context = _objectOrFunction;

  } else if ( is.a.fn( _objectOrFunction ) ) {

    _objectOrFunction.prototype.middleware = function () {
      useify.context = this;
      useify.middleware.apply( useify, arguments );
    };

    _objectOrFunction.use = function () {
      useify.use.apply( useify, arguments );
      return this;
    };

    _objectOrFunction.useify = useify;

  }

};
},{"./config.json":35,"sc-is":17}],37:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var Emitter = _dereq_('emitter');
var reduce = _dereq_('reduce');

/**
 * Root reference for iframes.
 */

var root = 'undefined' == typeof window
  ? this
  : window;

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Determine XHR.
 */

function getXHR() {
  if (root.XMLHttpRequest
    && ('file:' != root.location.protocol || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
}

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join('&');
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  this.text = this.xhr.responseText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this.parseBody(this.text)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = request.parse[this.type];
  return parse
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  var type = status / 100 | 0;

  // status / class
  this.status = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status || 1223 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var path = req.path;

  var msg = 'cannot ' + method + ' ' + path + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.path = path;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  Emitter.call(this);
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function(){
    var res = new Response(self);
    if ('HEAD' == method) res.text = null;
    self.callback(null, res);
  });
}

/**
 * Mixin `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass){
  var str = btoa(user + ':' + pass);
  this.set('Authorization', 'Basic ' + str);
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // querystring
 *       request.get('/search')
 *         .end(callback)
 *
 *       // multiple data "writes"
 *       request.get('/search')
 *         .send({ search: 'query' })
 *         .send({ range: '1..5' })
 *         .send({ order: 'desc' })
 *         .end(callback)
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"})
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.getHeader('Content-Type');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this.getHeader('Content-Type');
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  if (2 == fn.length) return fn(err, res);
  if (err) return this.emit('error', err);
  fn(res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
  err.crossDomain = true;
  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;
    if (0 == xhr.status) {
      if (self.aborted) return self.timeoutError();
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  if (xhr.upload) {
    xhr.upload.onprogress = function(e){
      e.percent = e.loaded / e.total * 100;
      self.emit('progress', e);
    };
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  xhr.open(this.method, this.url, true);

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var serialize = request.serialize[this.getHeader('Content-Type')];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  // send stuff
  xhr.send(data);
  return this;
};

/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(method, url) {
  // callback
  if ('function' == typeof url) {
    return new Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new Request('GET', method);
  }

  return new Request(method, url);
}

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.del = function(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * Expose `request`.
 */

module.exports = request;

},{"emitter":38,"reduce":39}],38:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = callbacks.indexOf(fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],39:[function(_dereq_,module,exports){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
},{}],40:[function(_dereq_,module,exports){
module.exports={}
},{}],41:[function(_dereq_,module,exports){
var DataService = _dereq_( "sc-data" ),
  Query = _dereq_( "./sc-query" ),
  utils = _dereq_( "./utils" ),
  Item = _dereq_( "./item" ),
  q = _dereq_( "q" ),
  superagent = _dereq_( "superagent" ),
  config = utils.merge( _dereq_( "./config.json" ), DataService.config );

_dereq_( "./middleware" );

var ItemService = DataService.extend( {

  /**
   * The ItemService is a standalone XHR library for creating, fetching, saving and deleting
   * Sitecore Items with many built it utilities and helpers to assist in the data transaction
   * between the front end and back end.
   *
   * ```javascript
   * var peopleService = new ItemService( {
   *   url: "/api/people"
   * } );
   *
   * var aNewGuy = {
   *   name: "David",
   *   isActive: true,
   *   gender: "male"
   * };
   *
   * peopleService.create( aNewGuy ).path( "/sitecore/content/home" ).execute().then( function ( david ) {
   *
   *   david.should.be.an.instanceOf( Item );
   *   david.name.should.eql( "David" );
   *   david.isActive.should.eql( true );
   *   david.gender.should.eql( "male" );
   *
   *   done();
   *
   * } ).fail( done );
   * ```
   *
   * @class ItemService
   * @constructor
   * @param  {Object} [options] ItemService options
   * @return {ItemService}
   */
  init: function ( options ) {
    var self = this;

    self._super( options );
  },

  /**
   * Create an item
   *
   * @for ItemService
   * @method create
   * @param  {Object} data    The item
   * @param  {Object} [options] The create item options (as of itemservice@0.0.0 options has not been fully defined)
   * @return {Query}         A Query object (or a <a href="http://promises-aplus.github.io/promises-spec" target="_blank">promise</a> if the data is empty)
   */
  create: function ( data, options ) {
    var self = this,
      defer = q.defer(),
      emptyItem,
      promise,
      query;

    switch ( true ) {

    case utils.is.an.object( data ):

      options = options || {};

      if(!options.headers) {
        options.headers = utils.is.an.object( options.headers ) ? options.headers : self.options.headers;
      }

      query = new Query( self.url, "POST", options );

      query
        .parameters( data )
        .option( "url", self.url )
        .option( "itemService", self );

      promise = query;

      break;

    case utils.is.not.an.object( data ):

      emptyItem = new Item( {}, utils.merge( {
        itemService: self
      }, options || self.options ) );

      defer.promise.path = function ( path ) {
        emptyItem.option( "path", path );
        return defer.promise;
      };

      defer.resolve( emptyItem );

      promise = defer.promise;

      break;
    }

    return promise;

  },

  /**
   * Fetches an Item by ID
   *
   * @method fetchItem
   * @param  {String} id The item's id (typically a GUID)
   * @param  {Object} [options] The fetchItem options (as of itemservice@0.0.0 options has not been fully defined)
   * @return {Query}
   */
  fetchItem: function ( id, options ) {
    var self = this,
      url = self.url.replace( /([^\/]*)(\/)?$/, "$1/" + id );

    options = options || {};

     if(!options.headers) {
        options.headers = utils.is.an.object( options.headers ) ? options.headers : self.options.headers;
     }

    var query = new Query( url, self.type, options );

    query
      .option( "url", url )
      .option( "itemService", self )
      .option( "single", true );

    return query;
  },

  /**
   * Fetchs an Item using a Sitecore query
   *
   * @method query
   * @param  {String} theQuery The Sitecore query e.g. "/sitecore//content/post"
   * @param  {Object} [options] The query options (as of itemservice@0.0.0 options has not been fully defined)
   * @return {Query}
   */
  query: function ( theQuery, options ) {
    var self = this,
      url = self.url.replace( /([^\/]*)(\/)?$/, "$1/" + theQuery + "/query" );

     options = options || {};

    if(!options.headers) {
      options.headers = utils.is.an.object( options.headers ) ? options.headers : self.options.headers;
    }

    var query = new Query( url, "GET", options );

    query
      .option( "url", url )
      .option( "itemService", self );


    return query;
  },

  /**
   * Searches for an Item
   *
   * @method search
   * @param  {String} theSearch The search term
   * @param  {Object} [options] The search options (as of itemservice@0.0.0 options has not been fully defined)
   * @return {Query}
   */
  search: function ( theSearch, options ) {
    var self = this,
      url = self.url.replace( /([^\/]*)(\/)?$/, "$1/search" );

    options = options || {};

    if(!options.headers) {
      options.headers = utils.is.an.object( options.headers ) ? options.headers : self.options.headers;
    }

    var query = new Query( url, "GET", options );

    query
      .option( "url", url )
      .option( "itemService", self )
      .parameter( "term", theSearch );

    return query;
  }

} );

utils.emitter( ItemService.prototype );
utils.optionify( ItemService.prototype );
utils.useify( ItemService );

exports = module.exports = ItemService;
exports.Item = Item;
exports.Query = Query;

/**
 * A collection of helper utilities
 *
 * @static
 * @property {Object} utils
 */
exports.utils = utils;

/**
 * The configuration object
 *
 * @static
 * @property {Object} config
 */
exports.config = config;
exports.superagent = superagent;

if ( typeof window !== "undefined" ) {
  window.ItemService = exports;
}
},{"./config.json":40,"./item":42,"./middleware":43,"./sc-query":46,"./utils":47,"q":3,"sc-data":8,"superagent":37}],42:[function(_dereq_,module,exports){
/**
 * @namespace ItemService
 */
var utils = _dereq_( "./utils" ),
  q = _dereq_( "q" ),
  DataService = _dereq_( "sc-data" ),
  Query = _dereq_( "./sc-query" ),
  trackable = _dereq_( "sc-trackable" ),
  binding = _dereq_( "sc-bindingjs" ),
  config = utils.merge( _dereq_( "./config.json" ), DataService.config );

var defineProperties = function () {
  var self = this;

  /**
   * Checks if the item `isNew` (aka dirty). This property will only be true if the Item was created
   * without passing an object to the ItemService.create method.
   *
   * @property {Boolean} isNew
   */
  Object.defineProperties( self, {
    isNew: {
      get: function () {
        return utils.is.empty( self[ config.idKey ] );
      }
    }
  } );

};

var Item = DataService.Item.extend( {

  /**
   * The ItemService Item
   *
   * @class Item
   * @constructor
   * @param  {Object} sanitizedData An object to be converted into a ItemService Item
   * @param  {Object} [options] Item options
   *                            @param {Boolean} [options.raw=false] If true, then a raw JSON Object will be returned, otherwise an Item will be returned
   *                            @param {Boolean} [options.binding=true] If true then the Item will be `bindable`, otherwise it will not
   *                            @param {Boolean} [options.trackable=true] If true then the Item will be `trackable`, otherwise it will not
   *                            @param {String} [options.url] If set, it overrides the base url set by itemservice that this Item was created from
   *
   * @return {Item}
   *
   */
  init: function ( sanitizedData, options ) {

    var self = this;

    options = utils.is.an.object( options ) ? options : {};
    options.raw = options[ "raw" ] === true;
    options.binding = options[ "binding" ] === false ? false : true;
    options.trackable = options[ "trackable" ] === true;
    options.url = utils.is.a.string( options[ "url" ] ) ? options[ "url" ] : "";
    options.headers = utils.is.a.object( options[ "headers" ] ) ? options[ "headers" ] : "";

    if ( options[ "raw" ] === true && ( options[ "binding" ] === true || options[ "trackable" ] === true ) ) {
      throw new Error( "An entity cannot be raw and have a binding or be trackable" );
    }

    sanitizedData = utils.is.an.object( sanitizedData ) ? sanitizedData : {};
    sanitizedData[ config.idKey ] = sanitizedData[ config.idKey ] ? sanitizedData[ config.idKey ] : "";

    self._super( sanitizedData, options );
    defineProperties.apply( self );

    Object.keys( sanitizedData ).forEach( function ( key ) {
      self[ key ] = sanitizedData[ key ];
    } );

    if ( options.binding === true && options.raw === false ) {
      binding.observable( self );
    }

    if ( options.trackable === true ) {
      self.trackable();
    }

  },

  /**
   * Destroys an Item
   *
   * @method destroy
   * @chainable
   * @param  {Object} [options] Options which is passed directly to the {{#crossLink "Query"}}{{/crossLink}}
   * @return {Query} A Query object
   */
  destroy: function ( options ) {
    var self = this,
      url = self.option( "url" ).replace( /([^\/]*)(\/)?$/, "$1/" + self[ config.idKey ] );

    options = options || {};

    if(!options.headers) {
        options.headers = utils.is.an.object( options.headers ) ? options.headers : self.options.headers;
    }

    var query = new Query( url, "DELETE", options );

    query
      .option( "url", url )
      .option( "itemService", self.option( "itemService" ) );

    return query;
  },

  /**
   * Fetches this `Item`s children based on this `Item`s ItemID
   *
   * @method fetchChildren
   * @chainable
   * @param  {Object} [options] Options which is passed directly to the {{#crossLink "Query"}}{{/crossLink}}
   * @return {Query} A Query object
   */
  fetchChildren: function ( options ) {
    var self = this,
      url = self.option( "url" ).replace( /([^\/]*)(\/)?$/, "$1/" + self[ config.idKey ] + "/children" );

    options = options || {};

    if(!options.headers) {
        options.headers = utils.is.an.object( options.headers ) ? options.headers : self.options.headers;
    }

    var query = new Query( url, "GET", options );

    query
      .option( "url", self.option( "url" ) )
      .option( "itemService", self.option( "itemService" ) );

    return query;
  },

  /**
   * Gets the JSON representation of the Item
   *
   * @method json
   * @param {Object} [json] Overrides the _actual_ json data bound to the Item
   * @return {Object} The JSON representation of the Item
   */
  json: function ( json ) {
    return this._super( json );
  },

  /**
   * Saves the `Item`
   *
   * @method save
   * @chainable
   * @param  {Object} [options] Options which is passed directly to the {{#crossLink "Query"}}{{/crossLink}}
   * @return {Query} A Query object
   */
  save: function ( options ) {
    var self = this,
      url = self.isNew ? self.option( "url" ) : self.option( "url" ).replace( /([^\/]*)(\/)?$/, "$1/" + self[ config.idKey ] ),
      type = self.isNew ? "POST" : "PATCH";

    options = options || {};

    if(!options.headers) {
        options.headers = utils.is.an.object( options.headers ) ? options.headers : self.options.headers;
    }

    var query = new Query( url, type, options ),
      queryKeysToCopyFromOptions = Object.keys( utils.omit( Query.prototype, [ "init", "constructor" ] ) ),
      json;

    queryKeysToCopyFromOptions.forEach( function ( queryParam ) {
      if ( utils.is.not.nullOrUndefined( self.option( queryParam ) ) ) {
        query[ queryParam ]( self.option( queryParam ) );
      }
    } );

    if ( self.isNew ) {
      json = self.json( utils.omit( self, [ "_super", "subscribe", "remove", "notify", "processSubscribers", "subscribers", "__properties" ] ) );
      delete json[ config.idKey ];
    } else {
      json = self.json();
    }

    query
      .parameters( json )
      .option( "url", url )
      .option( "itemService", self.option( "itemService" ) )
      .option( "item", self );

    if ( self.isNew && utils.is.a.string( self.option( "path" ) ) && utils.is.not.empty( self.option( "path" ) ) ) {
      query.path( self.option( "path" ) );
    }

    return query;
  },

  /**
   * Makes the `Item` trackable
   *
   * @method trackable
   * @chainable
   * @return {Item} Self
   */
  trackable: function () {
    var self = this;

    if ( self.option( "raw" ) === true ) {
      return self;
    }

    trackable( self );

    return self;
  }

} );

utils.optionify( Item );

module.exports = Item;
},{"./config.json":40,"./sc-query":46,"./utils":47,"q":3,"sc-bindingjs":4,"sc-data":8,"sc-trackable":34}],43:[function(_dereq_,module,exports){
var Query = _dereq_( "../sc-query" ),
  utils = _dereq_( "../utils" ),
  DataService = _dereq_( "sc-data" ),
  config = utils.merge( _dereq_( "../config.json" ), DataService.config );

// Query middleware
Query.useify.clear( "postRequest" );
Query.use( "postRequest", _dereq_( "./scQueryPostRequest" ) );

// Request middleware
utils.request.use( "postRequest", _dereq_( "./scRequestPostRequest" ) );
},{"../config.json":40,"../sc-query":46,"../utils":47,"./scQueryPostRequest":44,"./scRequestPostRequest":45,"sc-data":8}],44:[function(_dereq_,module,exports){
var utils = _dereq_( "../utils" ),
  Item = _dereq_( "../item" );

module.exports = function ( res, next ) {
  var self = this,
    itemService = utils.is.object( self.options[ "itemService" ] ) ? self.options[ "itemService" ] : {},
    raw = self.options[ "raw" ] === true,
    sanitizedItems = res,
    item = utils.is.an.object( res ) ? res : {},
    hasResults = utils.is.an.array( item[ "Results" ] ),
    items = hasResults ? item.Results : res,
    options = utils.merge( {}, self.options ),
    queryItem = self.option( "item" ),
    middlewareData;

  options.url = itemService.url;

  switch ( true ) {

  case ( /^post$/i.test( self.type ) ):
    sanitizedItems = new Item( utils.merge( self.parameters(), res ), options );
    break;

  case self.options[ "single" ]:
    sanitizedItems = raw ? item : new Item( item, options );
    break;

  case utils.is.an.array( items ):
    sanitizedItems = [];
    items.forEach( function ( item ) {
      sanitizedItems.push( raw ? item : new Item( item, options ) );
    } );
    break;

  }

  if ( hasResults ) {
    res.Results = sanitizedItems;
    sanitizedItems = res;
  }

  itemService.middleware( function ( error, middlewareResponse ) {

    if ( /patch/i.test( self.type ) && queryItem instanceof Item && queryItem.option( "trackable" ) !== true ) {
      queryItem.emit( "save" );
    }

    next( error, middlewareResponse );

  }, sanitizedItems );

};
},{"../item":42,"../utils":47}],45:[function(_dereq_,module,exports){
var utils = _dereq_( "../utils" ),
  DataService = _dereq_( "sc-data" ),
  config = utils.merge( _dereq_( "../config.json" ), DataService.config );

module.exports = function ( error, response, next ) {

  if ( utils.hasKey( response, "req.method", "string" ) && /^post$/i.test( response.req.method ) ) {

    var locationString = utils.hasKey( response, "header.location", "string" ) ? response.header.location : "",
      locationGuids = utils.guid.match( locationString ),
      lastGuid = locationGuids[ locationGuids.length - 1 ],
      id = utils.is.empty( lastGuid ) ? null : lastGuid;

    if ( !id ) {
      error = new Error( "While creating the entity the server did not return a valid Id" );
    } else {
      response.body = utils.is.an.object( response[ "body" ] ) ? response.body : {};
      response.body[ config.idKey ] = id;
    }

  }

  next( error, response );

};
},{"../config.json":40,"../utils":47,"sc-data":8}],46:[function(_dereq_,module,exports){
var Query = _dereq_( "sc-query" ),
  utils = _dereq_( "../utils" ),
  ExtendedQuery;

var ExtendedQuery = Query.extend( {

  init: function () {
    this._super.apply( this, arguments );
    this.__url = this.url;
  },

  /**
   * Adds a querystring paramater named `database`
   *
   * @for Query
   * @method database
   * @chainable
   * @param  {String} value The chosen database (<a href="http://docs.itemserviceapi.apiary.io/" target="_blank">read more</a>)
   * @return {Query}
   */
  database: function ( value ) {
    var database = utils.cast( value, "string", "" );
    if ( utils.hasKey( this, "options.itemService.options", "object" ) ) {
      this.options.itemService.options.database = database;
    }
    this.query( "database", database );
    return this;
  },

  execute: function () {
    var self = this,
      itemServiceOptions = utils.hasKey( self, "options.itemService.options", "object" ) ? self.options.itemService.options : {};

    [ "database", "language" ].forEach( function ( _property ) {
        var queryProperty = self.__queries[ _property ],
          serviceProperty = itemServiceOptions[ _property ];
        if ( utils.is.empty( queryProperty ) && utils.is.not.empty( serviceProperty ) ) {
          self.query( _property, serviceProperty );
        }
      } );

    return self._super.apply( self, arguments );
  },

  /**
   * Adds a querystring paramater named `facet`
   *
   * @for Query
   * @method facet
   * @chainable
   * @param  {String} value The facet (<a href="http://docs.itemserviceapi.apiary.io/" target="_blank">read more</a>)
   * @return {Query}
   */
  facet: function ( value ) {
    this.query( "facet", utils.cast( value, "string", "" ) );
    return this;
  },

  /**
   * Adds a querystring paramater named `fields`
   *
   * @for Query
   * @method fields
   * @chainable
   * @param  {String} value To restrict by fields (<a href="http://docs.itemserviceapi.apiary.io/" target="_blank">read more</a>)
   * @return {Query}
   */
  fields: function ( value ) {
    this.query( "fields", utils.cast( value, "string", "" ) );
    return this;
  },

  /**
   * Adds a querystring paramater named `includeMetadata`
   *
   * @for Query
   * @method includeMetadata
   * @chainable
   * @param  {String} value To include the metadata (<a href="http://docs.itemserviceapi.apiary.io/" target="_blank">read more</a>)
   * @return {Query}
   */
  includeMetadata: function ( value ) {
    this.query( "includeMetadata", utils.cast( value, "boolean", false ) );
    return this;
  },

  /**
   * Adds a querystring paramater named `includeStandardTemplateFields`
   *
   * @for Query
   * @method includeStandardTemplateFields
   * @chainable
   * @param  {String} value To include the standard template fields (<a href="http://docs.itemserviceapi.apiary.io/" target="_blank">read more</a>)
   * @return {Query}
   */
  includeStandardTemplateFields: function ( value ) {
    this.query( "includeStandardTemplateFields", utils.cast( value, "boolean", false ) );
    return this;
  },

  /**
   * Adds a querystring paramater named `language`
   *
   * @for Query
   * @method language
   * @chainable
   * @param  {String} value The chosen language (<a href="http://docs.itemserviceapi.apiary.io/" target="_blank">read more</a>)
   * @return {Query}
   */
  language: function ( value ) {
    var language = utils.cast( value, "string", "" );
    if ( utils.hasKey( this, "options.itemService.options", "object" ) ) {
      this.options.itemService.options.language = language;
    }
    this.query( "language", language );
    return this;
  },

  /**
   * Adds a querystring paramater named `page`
   *
   * @for Query
   * @method page
   * @chainable
   * @param  {String} value The chosen page (<a href="http://docs.itemserviceapi.apiary.io/" target="_blank">read more</a>)
   * @return {Query}
   */
  page: function ( value ) {
    this.query( "page", utils.cast( value, "number", 0 ) );
    return this;
  },

  /**
   * Appends the path to the given end point which specifies where an {{#crossLink "Itemservice.Item"}}Item{{/crossLink}} is to be {{#crossLink "Itemservice/create:method"}}created{{/crossLink}} is to be created. `path` is only useful when {{#crossLink "Itemservice/create:method"}}creating{{/crossLink}} an {{#crossLink "Itemservice.Item"}}Item{{/crossLink}}.
   *
   * @for Query
   * @method path
   * @chainable
   * @param  {String} value The chosen path (<a href="http://docs.itemserviceapi.apiary.io/" target="_blank">read more</a>)
   * @return {Query}
   */
  path: function ( value ) {
    this.__url = utils.hasKey( this, "__url", "string" ) && utils.is.not.empty( this.__url ) ? this.__url : this.url;
    this.url = this.__url.replace( /([^\/]*)(\/)?$/, "$1/" + value.replace( /^\//, "" ) );
    return this;
  },

  /**
   * Adds a querystring paramater named `sorting`
   *
   * @for Query
   * @method sort
   * @chainable
   * @param  {String} value The sort order by field (<a href="http://docs.itemserviceapi.apiary.io/" target="_blank">read more</a>)
   * @return {Query}
   */
  sort: function ( value ) {
    this.query( "sorting", utils.cast( value, "string" ) );
    return this;
  },

  /**
   * Adds a querystring paramater named `pageSize`
   *
   * @for Query
   * @method take
   * @chainable
   * @param  {String} value The page size (aka limit) (<a href="http://docs.itemserviceapi.apiary.io/" target="_blank">read more</a>)
   * @return {Query}
   */
  take: function ( value ) {
    this.query( "pageSize", utils.cast( value, "number", 10 ) );
    return this;
  },

  /**
   * Adds a querystring paramater named `version`
   *
   * @for Query
   * @method version
   * @chainable
   * @param  {String} value The chose version (<a href="http://docs.itemserviceapi.apiary.io/" target="_blank">read more</a>)
   * @return {Query}
   */
  version: function ( value ) {
    this.query( "version", utils.cast( value, "string", "" ) );
    return this;
  }

} );

// Sugar
ExtendedQuery.prototype.sorting = ExtendedQuery.prototype.sort;
ExtendedQuery.prototype.pageSize = ExtendedQuery.prototype.take;

exports = module.exports = ExtendedQuery;
exports.utils = Query.utils;
exports.config = Query.config;
exports.useify = Query.useify;
exports.use = Query.use;
},{"../utils":47,"sc-query":29}],47:[function(_dereq_,module,exports){
module.exports = {

  cast: _dereq_( "sc-cast" ),
  emitter: _dereq_( "emitter-component" ),
  guid: _dereq_( "sc-guid" ),
  hasKey: _dereq_( "sc-haskey" ),
  is: _dereq_( "sc-is" ),
  merge: _dereq_( "sc-merge" ),
  omit: _dereq_( "sc-omit" ),
  optionify: _dereq_( "sc-optionify" ),
  pick: _dereq_( "sc-pick" ),
  request: _dereq_( "sc-request" ),
  useify: _dereq_( "sc-useify" )

};
},{"emitter-component":1,"sc-cast":5,"sc-guid":12,"sc-haskey":15,"sc-is":17,"sc-merge":23,"sc-omit":25,"sc-optionify":26,"sc-pick":27,"sc-request":32,"sc-useify":36}]},{},[41])
(41)
});