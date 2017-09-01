!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.EntityService=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
},{"+NscNm":3}],2:[function(_dereq_,module,exports){

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

},{}],3:[function(_dereq_,module,exports){
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

},{}],4:[function(_dereq_,module,exports){
module.exports=_dereq_(1)
},{"+NscNm":3}],5:[function(_dereq_,module,exports){
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
},{}],6:[function(_dereq_,module,exports){
module.exports={
  "defaultHttpMethod": "GET",
  "maxNumberOfConcurrentXhr": 5,
  "idKey": "ItemID"
}
},{}],7:[function(_dereq_,module,exports){
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
},{"./config.json":6,"./item":8,"emitter-component":2,"q":4,"sc-extendify":10,"sc-hasKey":12,"sc-is":16,"sc-merge":22,"sc-optionify":25,"sc-query":28}],8:[function(_dereq_,module,exports){
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
},{"emitter-component":2,"q":4,"sc-extendify":10,"sc-hasKey":12,"sc-is":16,"sc-omit":24,"sc-optionify":25,"sc-pick":26}],9:[function(_dereq_,module,exports){
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
},{}],10:[function(_dereq_,module,exports){
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
},{"./extend.johnresig.js":9,"sc-haskey":14,"sc-merge":22,"sc-omit":24}],11:[function(_dereq_,module,exports){
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
},{}],12:[function(_dereq_,module,exports){
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
},{"type-component":13}],13:[function(_dereq_,module,exports){

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

},{}],14:[function(_dereq_,module,exports){
module.exports=_dereq_(12)
},{"type-component":15}],15:[function(_dereq_,module,exports){
module.exports=_dereq_(13)
},{}],16:[function(_dereq_,module,exports){
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
},{"./ises/empty":17,"./ises/guid":18,"./ises/nullorundefined":19,"./ises/type":20}],17:[function(_dereq_,module,exports){
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
},{"../type":21}],18:[function(_dereq_,module,exports){
var guid = _dereq_( "sc-guid" );

module.exports = function ( value ) {
  return guid.isValid( value );
};
},{"sc-guid":11}],19:[function(_dereq_,module,exports){
module.exports = function ( value ) {
	return value === null || value === undefined || value === void 0;
};
},{}],20:[function(_dereq_,module,exports){
var type = _dereq_( "../type" );

module.exports = function ( _type ) {
  return function ( _value ) {
    return type( _value ) === _type;
  }
}
},{"../type":21}],21:[function(_dereq_,module,exports){
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
},{}],22:[function(_dereq_,module,exports){
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
},{"type-component":23}],23:[function(_dereq_,module,exports){
module.exports=_dereq_(13)
},{}],24:[function(_dereq_,module,exports){
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
},{}],25:[function(_dereq_,module,exports){
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
},{"sc-merge":22}],26:[function(_dereq_,module,exports){
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
},{}],27:[function(_dereq_,module,exports){
module.exports={
	"defaults": {
		"defaultHttpMethod": "get"
	}
}
},{}],28:[function(_dereq_,module,exports){
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

},{"./config.json":27,"./utils":29,"q":4,"sc-extendify":10}],29:[function(_dereq_,module,exports){
module.exports = {
  merge: _dereq_( "sc-merge" ),
  optionify: _dereq_( "sc-optionify" ),
  request: _dereq_( "sc-request" ),
  useify: _dereq_( "sc-useify" ),
  is: _dereq_( "sc-is" )
}
},{"sc-is":16,"sc-merge":22,"sc-optionify":25,"sc-request":31,"sc-useify":52}],30:[function(_dereq_,module,exports){
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
},{}],31:[function(_dereq_,module,exports){
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
},{"./config.json":30,"q":4,"sc-guid":11,"sc-haskey":14,"sc-is":16,"sc-merge":22,"sc-queue":32,"sc-useify":52,"superagent":33}],32:[function(_dereq_,module,exports){
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
},{"sc-is":16}],33:[function(_dereq_,module,exports){
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

},{"emitter":34,"reduce":35}],34:[function(_dereq_,module,exports){

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

},{}],35:[function(_dereq_,module,exports){

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
},{}],36:[function(_dereq_,module,exports){
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
},{"sc-contains":37,"sc-is":16}],37:[function(_dereq_,module,exports){
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
},{}],38:[function(_dereq_,module,exports){
/**
 * Using lodash temporarily. Should be replaced.
 */
module.exports = _dereq_( "../tmp/lodash.custom" )._.where;
},{"../tmp/lodash.custom":39}],39:[function(_dereq_,module,exports){
/**
 * @license
 * Lo-Dash 2.2.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash exports="commonjs" include="where"`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
;(function() {

  /** Used to pool arrays and objects used internally */
  var arrayPool = [];

  /** Used internally to indicate various things */
  var indicatorObject = {};

  /** Used as the max size of the `arrayPool` and `objectPool` */
  var maxPoolSize = 40;

  /** Used to detected named functions */
  var reFuncName = /^function[ \n\r\t]+\w/;

  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;

  /** Used to fix the JScript [[DontEnum]] bug */
  var shadowedProps = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    'toLocaleString', 'toString', 'valueOf'
  ];

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      errorClass = '[object Error]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Used as the property descriptor for `__bindData__` */
  var descriptor = {
    'configurable': false,
    'enumerable': false,
    'value': null,
    'writable': false
  };

  /** Used as the data object for `iteratorTemplate` */
  var iteratorData = {
    'args': '',
    'array': null,
    'bottom': '',
    'firstArg': '',
    'init': '',
    'keys': null,
    'loop': '',
    'shadowedProps': null,
    'support': null,
    'top': '',
    'useHas': false
  };

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /*--------------------------------------------------------------------------*/

  /**
   * Gets an array from the array pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Array} The array from the pool.
   */
  function getArray() {
    return arrayPool.pop() || [];
  }

  /**
   * Checks if `value` is a DOM node in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a DOM node, else `false`.
   */
  function isNode(value) {
    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
    // methods that are `typeof` "string" and still can coerce nodes to strings
    return typeof value.toString != 'function' && typeof (value + '') == 'string';
  }

  /**
   * A no-operation function.
   *
   * @private
   */
  function noop() {
    // no operation performed
  }

  /**
   * Releases the given array back to the array pool.
   *
   * @private
   * @param {Array} [array] The array to release.
   */
  function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
      arrayPool.push(array);
    }
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Used for `Array` method references.
   *
   * Normally `Array.prototype` would suffice, however, using an array literal
   * avoids issues in Narwhal.
   */
  var arrayRef = [];

  /** Used for native method references */
  var errorProto = Error.prototype,
      objectProto = Object.prototype,
      stringProto = String.prototype;

  /** Used to detect if a method is native */
  var reNative = RegExp('^' +
    String(objectProto.valueOf)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/valueOf|for [^\]]+/g, '.+?') + '$'
  );

  /** Native method shortcuts */
  var fnToString = Function.prototype.toString,
      hasOwnProperty = objectProto.hasOwnProperty,
      push = arrayRef.push,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      toString = objectProto.toString,
      unshift = arrayRef.unshift;

  var defineProperty = (function() {
    try {
      var o = {},
          func = reNative.test(func = Object.defineProperty) && func,
          result = func(o, o, o) && func;
    } catch(e) { }
    return result;
  }());

  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeBind = reNative.test(nativeBind = toString.bind) && nativeBind,
      nativeCreate = reNative.test(nativeCreate = Object.create) && nativeCreate,
      nativeIsArray = reNative.test(nativeIsArray = Array.isArray) && nativeIsArray,
      nativeKeys = reNative.test(nativeKeys = Object.keys) && nativeKeys,
      nativeSlice = arrayRef.slice;

  /** Detect various environments */
  var isIeOpera = reNative.test(root.attachEvent),
      isV8 = nativeBind && !/\n|true/.test(nativeBind + isIeOpera);

  /** Used to avoid iterating non-enumerable properties in IE < 9 */
  var nonEnumProps = {};
  nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
  nonEnumProps[boolClass] = nonEnumProps[stringClass] = { 'constructor': true, 'toString': true, 'valueOf': true };
  nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = { 'constructor': true, 'toString': true };
  nonEnumProps[objectClass] = { 'constructor': true };

  (function() {
    var length = shadowedProps.length;
    while (length--) {
      var prop = shadowedProps[length];
      for (var className in nonEnumProps) {
        if (hasOwnProperty.call(nonEnumProps, className) && !hasOwnProperty.call(nonEnumProps[className], prop)) {
          nonEnumProps[className][prop] = false;
        }
      }
    }
  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a `lodash` object which wraps the given value to enable intuitive
   * method chaining.
   *
   * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
   * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
   * and `unshift`
   *
   * Chaining is supported in custom builds as long as the `value` method is
   * implicitly or explicitly included in the build.
   *
   * The chainable wrapper functions are:
   * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
   * `compose`, `concat`, `countBy`, `createCallback`, `curry`, `debounce`,
   * `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`, `forEach`,
   * `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `functions`,
   * `groupBy`, `indexBy`, `initial`, `intersection`, `invert`, `invoke`, `keys`,
   * `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`, `once`, `pairs`,
   * `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`, `range`, `reject`,
   * `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`, `sortBy`, `splice`,
   * `tap`, `throttle`, `times`, `toArray`, `transform`, `union`, `uniq`, `unshift`,
   * `unzip`, `values`, `where`, `without`, `wrap`, and `zip`
   *
   * The non-chainable wrapper functions are:
   * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
   * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
   * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
   * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
   * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
   * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
   * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
   * `template`, `unescape`, `uniqueId`, and `value`
   *
   * The wrapper functions `first` and `last` return wrapped values when `n` is
   * provided, otherwise they return unwrapped values.
   *
   * Explicit chaining can be enabled by using the `_.chain` method.
   *
   * @name _
   * @constructor
   * @category Chaining
   * @param {*} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns a `lodash` instance.
   * @example
   *
   * var wrapped = _([1, 2, 3]);
   *
   * // returns an unwrapped value
   * wrapped.reduce(function(sum, num) {
   *   return sum + num;
   * });
   * // => 6
   *
   * // returns a wrapped value
   * var squares = wrapped.map(function(num) {
   *   return num * num;
   * });
   *
   * _.isArray(squares);
   * // => false
   *
   * _.isArray(squares.value());
   * // => true
   */
  function lodash() {
    // no operation performed
  }

  /**
   * An object used to flag environments features.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  var support = lodash.support = {};

  (function() {
    var ctor = function() { this.x = 1; },
        object = { '0': 1, 'length': 1 },
        props = [];

    ctor.prototype = { 'valueOf': 1, 'y': 1 };
    for (var prop in new ctor) { props.push(prop); }
    for (prop in arguments) { }

    /**
     * Detect if an `arguments` object's [[Class]] is resolvable (all but Firefox < 4, IE < 9).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.argsClass = toString.call(arguments) == argsClass;

    /**
     * Detect if `arguments` objects are `Object` objects (all but Narwhal and Opera < 10.5).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.argsObject = arguments.constructor == Object && !(arguments instanceof Array);

    /**
     * Detect if `name` or `message` properties of `Error.prototype` are
     * enumerable by default. (IE < 9, Safari < 5.1)
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') || propertyIsEnumerable.call(errorProto, 'name');

    /**
     * Detect if `prototype` properties are enumerable by default.
     *
     * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
     * (if the prototype or a property on the prototype has been set)
     * incorrectly sets a function's `prototype` property [[Enumerable]]
     * value to `true`.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumPrototypes = propertyIsEnumerable.call(ctor, 'prototype');

    /**
     * Detect if `Function#bind` exists and is inferred to be fast (all but V8).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.fastBind = nativeBind && !isV8;

    /**
     * Detect if functions can be decompiled by `Function#toString`
     * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcDecomp = !reNative.test(root.WinRTError) && reThis.test(function() { return this; });

    /**
     * Detect if `Function#name` is supported (all but IE).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcNames = typeof Function.name == 'string';

    /**
     * Detect if `arguments` object indexes are non-enumerable
     * (Firefox < 4, IE < 9, PhantomJS, Safari < 5.1).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.nonEnumArgs = prop != 0;

    /**
     * Detect if properties shadowing those on `Object.prototype` are non-enumerable.
     *
     * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
     * made non-enumerable as well (a.k.a the JScript [[DontEnum]] bug).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.nonEnumShadows = !/valueOf/.test(props);

    /**
     * Detect if `Array#shift` and `Array#splice` augment array-like objects correctly.
     *
     * Firefox < 10, IE compatibility mode, and IE < 9 have buggy Array `shift()`
     * and `splice()` functions that fail to remove the last element, `value[0]`,
     * of array-like objects even though the `length` property is set to `0`.
     * The `shift()` method is buggy in IE 8 compatibility mode, while `splice()`
     * is buggy regardless of mode in IE < 9 and buggy in compatibility mode in IE 9.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.spliceObjects = (arrayRef.splice.call(object, 0, 1), !object[0]);

    /**
     * Detect lack of support for accessing string characters by index.
     *
     * IE < 8 can't access characters by index and IE 8 can only access
     * characters by index on string literals.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';
  }(1));

  /*--------------------------------------------------------------------------*/

  /**
   * The template used to create iterator functions.
   *
   * @private
   * @param {Object} data The data object used to populate the text.
   * @returns {string} Returns the interpolated text.
   */
  var iteratorTemplate = function(obj) {

    var __p = 'var index, iterable = ' +
    (obj.firstArg) +
    ', result = ' +
    (obj.init) +
    ';\nif (!iterable) return result;\n' +
    (obj.top) +
    ';';
     if (obj.array) {
    __p += '\nvar length = iterable.length; index = -1;\nif (' +
    (obj.array) +
    ') {  ';
     if (support.unindexedChars) {
    __p += '\n  if (isString(iterable)) {\n    iterable = iterable.split(\'\')\n  }  ';
     }
    __p += '\n  while (++index < length) {\n    ' +
    (obj.loop) +
    ';\n  }\n}\nelse {  ';
     } else if (support.nonEnumArgs) {
    __p += '\n  var length = iterable.length; index = -1;\n  if (length && isArguments(iterable)) {\n    while (++index < length) {\n      index += \'\';\n      ' +
    (obj.loop) +
    ';\n    }\n  } else {  ';
     }

     if (support.enumPrototypes) {
    __p += '\n  var skipProto = typeof iterable == \'function\';\n  ';
     }

     if (support.enumErrorProps) {
    __p += '\n  var skipErrorProps = iterable === errorProto || iterable instanceof Error;\n  ';
     }

        var conditions = [];    if (support.enumPrototypes) { conditions.push('!(skipProto && index == "prototype")'); }    if (support.enumErrorProps)  { conditions.push('!(skipErrorProps && (index == "message" || index == "name"))'); }

     if (obj.useHas && obj.keys) {
    __p += '\n  var ownIndex = -1,\n      ownProps = objectTypes[typeof iterable] && keys(iterable),\n      length = ownProps ? ownProps.length : 0;\n\n  while (++ownIndex < length) {\n    index = ownProps[ownIndex];\n';
        if (conditions.length) {
    __p += '    if (' +
    (conditions.join(' && ')) +
    ') {\n  ';
     }
    __p +=
    (obj.loop) +
    ';    ';
     if (conditions.length) {
    __p += '\n    }';
     }
    __p += '\n  }  ';
     } else {
    __p += '\n  for (index in iterable) {\n';
        if (obj.useHas) { conditions.push("hasOwnProperty.call(iterable, index)"); }    if (conditions.length) {
    __p += '    if (' +
    (conditions.join(' && ')) +
    ') {\n  ';
     }
    __p +=
    (obj.loop) +
    ';    ';
     if (conditions.length) {
    __p += '\n    }';
     }
    __p += '\n  }    ';
     if (support.nonEnumShadows) {
    __p += '\n\n  if (iterable !== objectProto) {\n    var ctor = iterable.constructor,\n        isProto = iterable === (ctor && ctor.prototype),\n        className = iterable === stringProto ? stringClass : iterable === errorProto ? errorClass : toString.call(iterable),\n        nonEnum = nonEnumProps[className];\n      ';
     for (k = 0; k < 7; k++) {
    __p += '\n    index = \'' +
    (obj.shadowedProps[k]) +
    '\';\n    if ((!(isProto && nonEnum[index]) && hasOwnProperty.call(iterable, index))';
            if (!obj.useHas) {
    __p += ' || (!nonEnum[index] && iterable[index] !== objectProto[index])';
     }
    __p += ') {\n      ' +
    (obj.loop) +
    ';\n    }      ';
     }
    __p += '\n  }    ';
     }

     }

     if (obj.array || support.nonEnumArgs) {
    __p += '\n}';
     }
    __p +=
    (obj.bottom) +
    ';\nreturn result';

    return __p
  };

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `_.createCallback` without support for creating
   * "_.pluck" or "_.where" style callbacks.
   *
   * @private
   * @param {*} [func=identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of the created callback.
   * @param {number} [argCount] The number of arguments the callback accepts.
   * @returns {Function} Returns a callback function.
   */
  function baseCreateCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
      return identity;
    }
    // exit early if there is no `thisArg`
    if (typeof thisArg == 'undefined') {
      return func;
    }
    var bindData = func.__bindData__ || (support.funcNames && !func.name);
    if (typeof bindData == 'undefined') {
      var source = reThis && fnToString.call(func);
      if (!support.funcNames && source && !reFuncName.test(source)) {
        bindData = true;
      }
      if (support.funcNames || !bindData) {
        // checks if `func` references the `this` keyword and stores the result
        bindData = !support.funcDecomp || reThis.test(source);
        setBindData(func, bindData);
      }
    }
    // exit early if there are no `this` references or `func` is bound
    if (bindData !== true && (bindData && bindData[1] & 1)) {
      return func;
    }
    switch (argCount) {
      case 1: return function(value) {
        return func.call(thisArg, value);
      };
      case 2: return function(a, b) {
        return func.call(thisArg, a, b);
      };
      case 3: return function(value, index, collection) {
        return func.call(thisArg, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(thisArg, accumulator, value, index, collection);
      };
    }
    return bind(func, thisArg);
  }

  /**
   * The base implementation of `_.isEqual`, without support for `thisArg` binding,
   * that allows partial "_.where" style comparisons.
   *
   * @private
   * @param {*} a The value to compare.
   * @param {*} b The other value to compare.
   * @param {Function} [callback] The function to customize comparing values.
   * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
   * @param {Array} [stackA=[]] Tracks traversed `a` objects.
   * @param {Array} [stackB=[]] Tracks traversed `b` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
    // used to indicate that when comparing objects, `a` has at least the properties of `b`
    if (callback) {
      var result = callback(a, b);
      if (typeof result != 'undefined') {
        return !!result;
      }
    }
    // exit early for identical values
    if (a === b) {
      // treat `+0` vs. `-0` as not equal
      return a !== 0 || (1 / a == 1 / b);
    }
    var type = typeof a,
        otherType = typeof b;

    // exit early for unlike primitive values
    if (a === a &&
        !(a && objectTypes[type]) &&
        !(b && objectTypes[otherType])) {
      return false;
    }
    // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
    // http://es5.github.io/#x15.3.4.4
    if (a == null || b == null) {
      return a === b;
    }
    // compare [[Class]] names
    var className = toString.call(a),
        otherClass = toString.call(b);

    if (className == argsClass) {
      className = objectClass;
    }
    if (otherClass == argsClass) {
      otherClass = objectClass;
    }
    if (className != otherClass) {
      return false;
    }
    switch (className) {
      case boolClass:
      case dateClass:
        // coerce dates and booleans to numbers, dates to milliseconds and booleans
        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
        return +a == +b;

      case numberClass:
        // treat `NaN` vs. `NaN` as equal
        return (a != +a)
          ? b != +b
          // but treat `+0` vs. `-0` as not equal
          : (a == 0 ? (1 / a == 1 / b) : a == +b);

      case regexpClass:
      case stringClass:
        // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
        // treat string primitives and their corresponding object instances as equal
        return a == String(b);
    }
    var isArr = className == arrayClass;
    if (!isArr) {
      // unwrap any `lodash` wrapped values
      if (hasOwnProperty.call(a, '__wrapped__ ') || hasOwnProperty.call(b, '__wrapped__')) {
        return baseIsEqual(a.__wrapped__ || a, b.__wrapped__ || b, callback, isWhere, stackA, stackB);
      }
      // exit for functions and DOM nodes
      if (className != objectClass) {
        return false;
      }
      // in older versions of Opera, `arguments` objects have `Array` constructors
      var ctorA = !support.argsObject && isArguments(a) ? Object : a.constructor,
          ctorB = !support.argsObject && isArguments(b) ? Object : b.constructor;

      // non `Object` object instances with different constructors are not equal
      if (ctorA != ctorB && !(
            isFunction(ctorA) && ctorA instanceof ctorA &&
            isFunction(ctorB) && ctorB instanceof ctorB
          )) {
        return false;
      }
    }
    // assume cyclic structures are equal
    // the algorithm for detecting cyclic structures is adapted from ES 5.1
    // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
    var initedStack = !stackA;
    stackA || (stackA = getArray());
    stackB || (stackB = getArray());

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == a) {
        return stackB[length] == b;
      }
    }
    var size = 0;
    result = true;

    // add `a` and `b` to the stack of traversed objects
    stackA.push(a);
    stackB.push(b);

    // recursively compare objects and arrays (susceptible to call stack limits)
    if (isArr) {
      length = a.length;
      size = b.length;

      // compare lengths to determine if a deep comparison is necessary
      result = size == a.length;
      if (!result && !isWhere) {
        return result;
      }
      // deep compare the contents, ignoring non-numeric properties
      while (size--) {
        var index = length,
            value = b[size];

        if (isWhere) {
          while (index--) {
            if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
              break;
            }
          }
        } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
          break;
        }
      }
      return result;
    }
    // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
    // which, in this case, is more costly
    forIn(b, function(value, key, b) {
      if (hasOwnProperty.call(b, key)) {
        // count the number of properties.
        size++;
        // deep compare each property value.
        return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
      }
    });

    if (result && !isWhere) {
      // ensure both objects have the same number of properties
      forIn(a, function(value, key, a) {
        if (hasOwnProperty.call(a, key)) {
          // `size` will be `-1` if `a` has more properties than `b`
          return (result = --size > -1);
        }
      });
    }
    if (initedStack) {
      releaseArray(stackA);
      releaseArray(stackB);
    }
    return result;
  }

  /**
   * Creates a function that, when called, either curries or invokes `func`
   * with an optional `this` binding and partially applied arguments.
   *
   * @private
   * @param {Function|string} func The function or method name to reference.
   * @param {number} bitmask The bitmask of method flags to compose.
   *  The bitmask may be composed of the following flags:
   *  1 - `_.bind`
   *  2 - `_.bindKey`
   *  4 - `_.curry`
   *  8 - `_.curry` (bound)
   *  16 - `_.partial`
   *  32 - `_.partialRight`
   * @param {Array} [partialArgs] An array of arguments to prepend to those
   *  provided to the new function.
   * @param {Array} [partialRightArgs] An array of arguments to append to those
   *  provided to the new function.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new bound function.
   */
  function createBound(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
    var isBind = bitmask & 1,
        isBindKey = bitmask & 2,
        isCurry = bitmask & 4,
        isCurryBound = bitmask & 8,
        isPartial = bitmask & 16,
        isPartialRight = bitmask & 32,
        key = func;

    if (!isBindKey && !isFunction(func)) {
      throw new TypeError;
    }
    if (isPartial && !partialArgs.length) {
      bitmask &= ~16;
      isPartial = partialArgs = false;
    }
    if (isPartialRight && !partialRightArgs.length) {
      bitmask &= ~32;
      isPartialRight = partialRightArgs = false;
    }
    var bindData = func && func.__bindData__;
    if (bindData) {
      if (isBind && !(bindData[1] & 1)) {
        bindData[4] = thisArg;
      }
      if (!isBind && bindData[1] & 1) {
        bitmask |= 8;
      }
      if (isCurry && !(bindData[1] & 4)) {
        bindData[5] = arity;
      }
      if (isPartial) {
        push.apply(bindData[2] || (bindData[2] = []), partialArgs);
      }
      if (isPartialRight) {
        push.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
      }
      bindData[1] |= bitmask;
      return createBound.apply(null, bindData);
    }
    // use `Function#bind` if it exists and is fast
    // (in V8 `Function#bind` is slower except when partially applied)
    if (isBind && !(isBindKey || isCurry || isPartialRight) &&
        (support.fastBind || (nativeBind && isPartial))) {
      if (isPartial) {
        var args = [thisArg];
        push.apply(args, partialArgs);
      }
      var bound = isPartial
        ? nativeBind.apply(func, args)
        : nativeBind.call(func, thisArg);
    }
    else {
      bound = function() {
        // `Function#bind` spec
        // http://es5.github.io/#x15.3.4.5
        var args = arguments,
            thisBinding = isBind ? thisArg : this;

        if (isCurry || isPartial || isPartialRight) {
          args = nativeSlice.call(args);
          if (isPartial) {
            unshift.apply(args, partialArgs);
          }
          if (isPartialRight) {
            push.apply(args, partialRightArgs);
          }
          if (isCurry && args.length < arity) {
            bitmask |= 16 & ~32;
            return createBound(func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity);
          }
        }
        if (isBindKey) {
          func = thisBinding[key];
        }
        if (this instanceof bound) {
          // ensure `new bound` is an instance of `func`
          thisBinding = createObject(func.prototype);

          // mimic the constructor's `return` behavior
          // http://es5.github.io/#x13.2.2
          var result = func.apply(thisBinding, args);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisBinding, args);
      };
    }
    setBindData(bound, nativeSlice.call(arguments));
    return bound;
  }

  /**
   * Creates compiled iteration functions.
   *
   * @private
   * @param {...Object} [options] The compile options object(s).
   * @param {string} [options.array] Code to determine if the iterable is an array or array-like.
   * @param {boolean} [options.useHas] Specify using `hasOwnProperty` checks in the object loop.
   * @param {Function} [options.keys] A reference to `_.keys` for use in own property iteration.
   * @param {string} [options.args] A comma separated string of iteration function arguments.
   * @param {string} [options.top] Code to execute before the iteration branches.
   * @param {string} [options.loop] Code to execute in the object loop.
   * @param {string} [options.bottom] Code to execute after the iteration branches.
   * @returns {Function} Returns the compiled function.
   */
  function createIterator() {
    // data properties
    iteratorData.shadowedProps = shadowedProps;

    // iterator options
    iteratorData.array = iteratorData.bottom = iteratorData.loop = iteratorData.top = '';
    iteratorData.init = 'iterable';
    iteratorData.useHas = true;

    // merge options into a template data object
    for (var object, index = 0; object = arguments[index]; index++) {
      for (var key in object) {
        iteratorData[key] = object[key];
      }
    }
    var args = iteratorData.args;
    iteratorData.firstArg = /^[^,]+/.exec(args)[0];

    // create the function factory
    var factory = Function(
        'baseCreateCallback, errorClass, errorProto, hasOwnProperty, ' +
        'indicatorObject, isArguments, isArray, isString, keys, objectProto, ' +
        'objectTypes, nonEnumProps, stringClass, stringProto, toString',
      'return function(' + args + ') {\n' + iteratorTemplate(iteratorData) + '\n}'
    );

    // return the compiled function
    return factory(
      baseCreateCallback, errorClass, errorProto, hasOwnProperty,
      indicatorObject, isArguments, isArray, isString, iteratorData.keys, objectProto,
      objectTypes, nonEnumProps, stringClass, stringProto, toString
    );
  }

  /**
   * Creates a new object with the specified `prototype`.
   *
   * @private
   * @param {Object} prototype The prototype object.
   * @returns {Object} Returns the new object.
   */
  function createObject(prototype) {
    return isObject(prototype) ? nativeCreate(prototype) : {};
  }
  // fallback for browsers without `Object.create`
  if (!nativeCreate) {
    createObject = function(prototype) {
      if (isObject(prototype)) {
        noop.prototype = prototype;
        var result = new noop;
        noop.prototype = null;
      }
      return result || {};
    };
  }

  /**
   * Sets `this` binding data on a given function.
   *
   * @private
   * @param {Function} func The function to set data on.
   * @param {*} value The value to set.
   */
  var setBindData = !defineProperty ? noop : function(func, value) {
    descriptor.value = value;
    defineProperty(func, '__bindData__', descriptor);
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Checks if `value` is an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
   * @example
   *
   * (function() { return _.isArguments(arguments); })(1, 2, 3);
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    return value && typeof value == 'object' && typeof value.length == 'number' &&
      toString.call(value) == argsClass || false;
  }
  // fallback for browsers that can't detect `arguments` objects by [[Class]]
  if (!support.argsClass) {
    isArguments = function(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        hasOwnProperty.call(value, 'callee') || false;
    };
  }

  /**
   * Checks if `value` is an array.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
   * @example
   *
   * (function() { return _.isArray(arguments); })();
   * // => false
   *
   * _.isArray([1, 2, 3]);
   * // => true
   */
  var isArray = nativeIsArray || function(value) {
    return value && typeof value == 'object' && typeof value.length == 'number' &&
      toString.call(value) == arrayClass || false;
  };

  /**
   * A fallback implementation of `Object.keys` which produces an array of the
   * given object's own enumerable property names.
   *
   * @private
   * @type Function
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns an array of property names.
   */
  var shimKeys = createIterator({
    'args': 'object',
    'init': '[]',
    'top': 'if (!(objectTypes[typeof object])) return result',
    'loop': 'result.push(index)'
  });

  /**
   * Creates an array composed of the own enumerable property names of an object.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns an array of property names.
   * @example
   *
   * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
   * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
   */
  var keys = !nativeKeys ? shimKeys : function(object) {
    if (!isObject(object)) {
      return [];
    }
    if ((support.enumPrototypes && typeof object == 'function') ||
        (support.nonEnumArgs && object.length && isArguments(object))) {
      return shimKeys(object);
    }
    return nativeKeys(object);
  };

  /** Reusable iterator options shared by `each`, `forIn`, and `forOwn` */
  var eachIteratorOptions = {
    'args': 'collection, callback, thisArg',
    'top': "callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3)",
    'array': "typeof length == 'number'",
    'keys': keys,
    'loop': 'if (callback(iterable[index], index, collection) === false) return result'
  };

  /** Reusable iterator options for `forIn` and `forOwn` */
  var forOwnIteratorOptions = {
    'top': 'if (!objectTypes[typeof iterable]) return result;\n' + eachIteratorOptions.top,
    'array': false
  };

  /**
   * A function compiled to iterate `arguments` objects, arrays, objects, and
   * strings consistenly across environments, executing the callback for each
   * element in the collection. The callback is bound to `thisArg` and invoked
   * with three arguments; (value, index|key, collection). Callbacks may exit
   * iteration early by explicitly returning `false`.
   *
   * @private
   * @type Function
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Array|Object|string} Returns `collection`.
   */
  var baseEach = createIterator(eachIteratorOptions);

  /*--------------------------------------------------------------------------*/

  /**
   * Iterates over own and inherited enumerable properties of an object,
   * executing the callback for each property. The callback is bound to `thisArg`
   * and invoked with three arguments; (value, key, object). Callbacks may exit
   * iteration early by explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {Object} object The object to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function Dog(name) {
   *   this.name = name;
   * }
   *
   * Dog.prototype.bark = function() {
   *   console.log('Woof, woof!');
   * };
   *
   * _.forIn(new Dog('Dagny'), function(value, key) {
   *   console.log(key);
   * });
   * // => logs 'bark' and 'name' (property order is not guaranteed across environments)
   */
  var forIn = createIterator(eachIteratorOptions, forOwnIteratorOptions, {
    'useHas': false
  });

  /**
   * Checks if `value` is a function.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   */
  function isFunction(value) {
    return typeof value == 'function';
  }
  // fallback for older versions of Chrome and Safari
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value == 'function' && toString.call(value) == funcClass;
    };
  }

  /**
   * Checks if `value` is the language type of Object.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
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
    // check if the value is the ECMAScript language type of Object
    // http://es5.github.io/#x8
    // and avoid a V8 bug
    // http://code.google.com/p/v8/issues/detail?id=2291
    return !!(value && objectTypes[typeof value]);
  }

  /**
   * Checks if `value` is a string.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
   * @example
   *
   * _.isString('moe');
   * // => true
   */
  function isString(value) {
    return typeof value == 'string' || toString.call(value) == stringClass;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Iterates over elements of a collection, returning an array of all elements
   * the callback returns truey for. The callback is bound to `thisArg` and
   * invoked with three arguments; (value, index|key, collection).
   *
   * If a property name is provided for `callback` the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is provided for `callback` the created "_.where" style callback
   * will return `true` for elements that have the properties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @alias select
   * @category Collections
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [callback=identity] The function called
   *  per iteration. If a property name or object is provided it will be used
   *  to create a "_.pluck" or "_.where" style callback, respectively.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Array} Returns a new array of elements that passed the callback check.
   * @example
   *
   * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
   * // => [2, 4, 6]
   *
   * var food = [
   *   { 'name': 'apple',  'organic': false, 'type': 'fruit' },
   *   { 'name': 'carrot', 'organic': true,  'type': 'vegetable' }
   * ];
   *
   * // using "_.pluck" callback shorthand
   * _.filter(food, 'organic');
   * // => [{ 'name': 'carrot', 'organic': true, 'type': 'vegetable' }]
   *
   * // using "_.where" callback shorthand
   * _.filter(food, { 'type': 'fruit' });
   * // => [{ 'name': 'apple', 'organic': false, 'type': 'fruit' }]
   */
  function filter(collection, callback, thisArg) {
    var result = [];
    callback = lodash.createCallback(callback, thisArg, 3);

    if (isArray(collection)) {
      var index = -1,
          length = collection.length;

      while (++index < length) {
        var value = collection[index];
        if (callback(value, index, collection)) {
          result.push(value);
        }
      }
    } else {
      baseEach(collection, function(value, index, collection) {
        if (callback(value, index, collection)) {
          result.push(value);
        }
      });
    }
    return result;
  }

  /**
   * Performs a deep comparison of each element in a `collection` to the given
   * `properties` object, returning an array of all elements that have equivalent
   * property values.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Collections
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Object} properties The object of property values to filter by.
   * @returns {Array} Returns a new array of elements that have the given properties.
   * @example
   *
   * var stooges = [
   *   { 'name': 'curly', 'age': 30, 'quotes': ['Oh, a wise guy, eh?', 'Poifect!'] },
   *   { 'name': 'moe', 'age': 40, 'quotes': ['Spread out!', 'You knucklehead!'] }
   * ];
   *
   * _.where(stooges, { 'age': 40 });
   * // => [{ 'name': 'moe', 'age': 40, 'quotes': ['Spread out!', 'You knucklehead!'] }]
   *
   * _.where(stooges, { 'quotes': ['Poifect!'] });
   * // => [{ 'name': 'curly', 'age': 30, 'quotes': ['Oh, a wise guy, eh?', 'Poifect!'] }]
   */
  var where = filter;

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a function that, when called, invokes `func` with the `this`
   * binding of `thisArg` and prepends any additional `bind` arguments to those
   * provided to the bound function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to bind.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {...*} [arg] Arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * var func = function(greeting) {
   *   return greeting + ' ' + this.name;
   * };
   *
   * func = _.bind(func, { 'name': 'moe' }, 'hi');
   * func();
   * // => 'hi moe'
   */
  function bind(func, thisArg) {
    return arguments.length > 2
      ? createBound(func, 17, nativeSlice.call(arguments, 2), null, thisArg)
      : createBound(func, 1, null, null, thisArg);
  }

  /**
   * Produces a callback bound to an optional `thisArg`. If `func` is a property
   * name the created callback will return the property value for a given element.
   * If `func` is an object the created callback will return `true` for elements
   * that contain the equivalent object properties, otherwise it will return `false`.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {*} [func=identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of the created callback.
   * @param {number} [argCount] The number of arguments the callback accepts.
   * @returns {Function} Returns a callback function.
   * @example
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 }
   * ];
   *
   * // wrap to create custom callback shorthands
   * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
   *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
   *   return !match ? func(callback, thisArg) : function(object) {
   *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
   *   };
   * });
   *
   * _.filter(stooges, 'age__gt45');
   * // => [{ 'name': 'larry', 'age': 50 }]
   */
  function createCallback(func, thisArg, argCount) {
    var type = typeof func;
    if (func == null || type == 'function') {
      return baseCreateCallback(func, thisArg, argCount);
    }
    // handle "_.pluck" style callback shorthands
    if (type != 'object') {
      return function(object) {
        return object[func];
      };
    }
    var props = keys(func),
        key = props[0],
        a = func[key];

    // handle "_.where" style callback shorthands
    if (props.length == 1 && a === a && !isObject(a)) {
      // fast path the common case of providing an object with a single
      // property containing a primitive value
      return function(object) {
        var b = object[key];
        return a === b && (a !== 0 || (1 / a == 1 / b));
      };
    }
    return function(object) {
      var length = props.length,
          result = false;

      while (length--) {
        if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
          break;
        }
      }
      return result;
    };
  }

  /*--------------------------------------------------------------------------*/

  /**
   * This method returns the first argument provided to it.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var moe = { 'name': 'moe' };
   * moe === _.identity(moe);
   * // => true
   */
  function identity(value) {
    return value;
  }

  /*--------------------------------------------------------------------------*/

  lodash.bind = bind;
  lodash.createCallback = createCallback;
  lodash.filter = filter;
  lodash.forIn = forIn;
  lodash.keys = keys;
  lodash.where = where;

  lodash.select = filter;

  /*--------------------------------------------------------------------------*/

  lodash.identity = identity;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isFunction = isFunction;
  lodash.isObject = isObject;
  lodash.isString = isString;

  /*--------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type string
   */
  lodash.VERSION = '2.2.1';

  /*--------------------------------------------------------------------------*/

  if (freeExports && freeModule) {

      freeExports._ = lodash;
  }

}.call(this));

},{}],40:[function(_dereq_,module,exports){
var utils = _dereq_( "./utils" ),
  stores = {};

/**
 * TODO: considerations
 *
 * - Local storage (choose)
 * - Offline mode (perhaps sync when online)
 */

function getKey( parent, key ) {
  return parent.hasOwnProperty( key ) && utils.type( parent[ key ] ) === "object" ? parent[ key ] : parent[ key ] = {};
}

/**
 * Manage client side storage data with helpers to get, set and find data.
 *
 * <br>
 *
 * See also:
 * - {{#crossLink "Store"}}{{/crossLink}}
 * - {{#crossLink "StoreItem"}}{{/crossLink}}
 *
 * @class StoreManager
 * @constructor
 * @returns {StoreManger}
 *
 * @example
 *
 * ####Create a new store
 * ```
 * var storeMangager = new StoreManger(),
 *     colorStore = storeManger.store("colors")l
 *
 * colorStore.set("red", "a red color");
 * colorStore.set("blue", "a blue color");
 * colorStore.set("green", "a green color");
 *
 * // The value does not have to be a primitive - complex objects are ok
 * ```
 * <br>
 *
 * #### To get data by key
 * ```
 * var colorStoreItem = colorStore.get("red");
 * ```
 * <br>
 *
 * #### Output of _colorStoreItem_:{{#crossLink "StoreItem"}}{{/crossLink}}
 * ```
 * {
 *     "key": "red",
 *     "value": "a red color"
 * }
 * ```
 *
 */
var StoreManager = function ( options ) {
  var self = this;

};

/**
 * A **Store** object returned by the <a href="/classes/StoreManager.html">**StoreManager**</a>.
 *
 * @class Store
 * @constructor
 * @private
 *
 * @param {String} storeName The name of the store
 * @param {Object} options   Store options (incomplete as of 5th Nov 2013)
 */
var Store = function ( storeName, options ) {
  var self = this;

  // TODO: finish options (localstorage, ttl, datecreate etc)
  options = utils.type( options ) === "object" ? options : {};

  /**
   * The Store name
   * @property {String} name
   */
  self.name = storeName;

  /**
   * The Stores data
   * @property {Object} data
   */
  self.data = {};
};

/**
 * A {{#crossLink "StoreItem"}}{{/crossLink}}
 *
 * @class StoreItem
 * @constructor
 * @private
 *
 * @param {String} key   The item key
 * @param {Mixed} value  The items value
 * @returns {StoreItem}  A {{#crossLink "StoreItem"}}{{/crossLink}}
 */
var StoreItem = function ( key, value ) {
  var self = this;

  // TODO: consider adding more data here (ttl, datecreated etc)

  /**
   * The item key
   * @property {String} key
   */
  self.key = key;

  /**
   * The item value
   * @property {Mixed} value
   */
  self.value = value;

  return self;
};

/**
 * Creates or gets a {{#crossLink "Store"}}{{/crossLink}}.
 *
 * @for  StoreManager
 * @method store
 * @param  {String} storeName The name of the {{#crossLink "Store"}}{{/crossLink}}
 * @return {Store}            The {{#crossLink "Store"}}{{/crossLink}}
 */
StoreManager.prototype.store = function ( storeName ) {
  return stores[ storeName ] instanceof Store ? stores[ storeName ] : stores[ storeName ] = new Store( storeName );
};

/**
 * Destroys a {{#crossLink "Store"}}{{/crossLink}}
 *
 * @for  StoreManager
 * @method  destroy
 * @param  {String} storeName The {{#crossLink "Store"}}{{/crossLink}} name
 * @return {Boolean}          If the {{#crossLink "Store"}}{{/crossLink}} was destroyed successfully
 */
StoreManager.prototype.destroy = function ( storeName ) {
  var self = this,
    store = stores[ storeName ] instanceof Store ? self.store( storeName ) : null;

  return store ? store.destroy() : true;
};

/**
 * Retrieves all {{#crossLink "Store"}}{{/crossLink}}'s'
 *
 * @return {Array} An array of all the {{#crossLink "Store"}}{{/crossLink}}'s
 */
StoreManager.prototype.stores = function () {
  var allStores = [];

  for ( var key in stores ) {
    if ( stores.hasOwnProperty( key ) ) {
      allStores.push( stores[ key ] );
    }
  }

  return allStores;
};

/**
 * Destroys a {{#crossLink "Store"}}{{/crossLink}}
 *
 * @for  Store
 * @method destroy
 * @return {Boolean} If the {{#crossLink "Store"}}{{/crossLink}} was destroyed successfully
 */
Store.prototype.destroy = function () {
  var self = this;

  return delete stores[ self.name ];
};

/**
 * Retrieves an array of all the {{#crossLink "StoreItem"}}{{/crossLink}}'s
 *
 * @for  Store
 * @method all
 * @return {Array} All {{#crossLink "StoreItem"}}{{/crossLink}}'s in the {{#crossLink "Store"}}{{/crossLink}}
 */
Store.prototype.all = function () {
  var self = this,
    data = self.data,
    items = [];

  // TODO: Consider using an object to array function
  for ( var key in data ) {
    if ( data.hasOwnProperty( key ) ) {
      items.push( data[ key ] );
    }
  }

  return items;
};

/**
 * Set {{#crossLink "Store"}}{{/crossLink}} data
 *
 * @for  Store
 * @method set
 * @param {String} key   The key/index of your data
 * @param {Mixed} value  The value of your data
 */
Store.prototype.set = function ( key, value ) {
  var self = this;

  self.data[ key ] = new StoreItem( key, value );

  return self;
};

/**
 * Get {{#crossLink "Store"}}{{/crossLink}} data
 *
 * @for  Store
 * @method get
 *
 * @param  {String} key They key reference to previously stored date
 * @return {StoreItem}  If the key exists, a {{#crossLink "StoreItem"}}{{/crossLink}} will be returned
 */
Store.prototype.get = function ( key ) {
  var self = this;

  return self.data[ key ];
};

/**
 * Remove {{#crossLink "Store"}}{{/crossLink}} data
 *
 * @for  Store
 * @method remove
 *
 * @param  {String} key They key reference to previously stored date
 * @return {StoreItem}  If the key exists, a {{#crossLink "StoreItem"}}{{/crossLink}} will be returned
 */
Store.prototype.remove = function ( key ) {
  var self = this;

  delete self.data[ key ];

  return self;
};

/**
 * Finds {{#crossLink "Store"}}{{/crossLink}} data based on an object of key/value pairs
 *
 * @for  Store
 * @method find
 *
 * @param  {Object} properties An object that specifies key/value pairs to match
 * @return {Array}  An array of {{#crossLink "StoreItem"}}{{/crossLink}}'s
 */
Store.prototype.find = function ( properties ) {
  var self = this;

  properties = utils.type( properties ) === "object" ? properties : {};

  return utils.where( self.all(), properties );
};

module.exports = StoreManager;
},{"./utils":41}],41:[function(_dereq_,module,exports){
module.exports = {

  type: _dereq_( "type-component" ),
  isEmpty: _dereq_( "./isEmpty" ),
  where: _dereq_( "sc-wherejs" )

};
},{"./isEmpty":42,"sc-wherejs":38,"type-component":43}],42:[function(_dereq_,module,exports){
var isEmpty = function ( val ) {
  var result = true;

  if ( typeof val === "boolean" ) {
    result = false;
  } else if ( null === val ) {
    result = true;
  } else if ( "number" === typeof val ) {
    result = 0 === val;
  } else if ( undefined !== val.length ) {
    result = 0 === val.length;
  } else {

    for ( var key in val ) {
      if ( Object.prototype.hasOwnProperty.call( val, key ) ) {
        result = false;
      }
    }

  }

  return result;
};

module.exports = isEmpty;
},{}],43:[function(_dereq_,module,exports){
module.exports=_dereq_(13)
},{}],44:[function(_dereq_,module,exports){
var utils = _dereq_( "./utils" ),
  sanitize = _dereq_( "./sanitize" ),
  Validate = _dereq_( "./validate" );

/**
 * Schema sanitization and validation
 *
 * @class SPEAKschema
 * @constructor
 * @param {Object} options Schema options
 * @return {Schema} The Schema object
 *
 * @example
 *
 * The Schema can be extended in the following ways:
 *
 * #### Extend by adding additional validation rules
 *
 * ```
 * var schemaOptions = {
 *   "validate": {
 *     "rules": {
 *       "date": function ( val, params ) {
 *         return val instanceof Date;
 *       },
 *       "boolean": function ( val, params ) {
 *         return typeof val === "boolean";
 *       }
 *     }
 *   }
 * };
 *
 * var dateObject = {
 *   "key": "dob",
 *   "type": "date",
 *   "validators": [ {
 *     "validatorName": "date",
 *     "errorMessage": "A real date is required"
 *   } ]
 * };
 *
 * var booleanObject = {
 *   "key": "active",
 *   "type": "boolean",
 *   "validators": [ {
 *     "validatorName": "boolean",
 *     "errorMessage": "A real boolean is required"
 *   } ]
 * };
 *
 * schema = new Schema( schemaOptions );
 *
 * var badDateErrors = schema.validateProperty( dateObject, "a bad date" ),
 *   goodDateErrors = schema.validateProperty( dateObject, new Date( ) ),
 *   badBooleanErrors = schema.validateProperty( booleanObject, "a bad boolean" ),
 *   goodBooleanErrors = schema.validateProperty( booleanObject, false );
 *
 * // badDateErrors has 1 error
 * // goodDateErrors has no errors
 * // badBooleanErrors has 1 error
 * // goodBooleanErrors has no errors
 *
 * ```
 *
 */
var Schema = function ( options ) {
  var self = this;

  options = utils.type( options ) === "object" ? options : {};
  self.validate = new Validate( options[ "validate" ] );

  return this;
};

Schema.prototype.sanitize = function () {
  return sanitize.apply( this, arguments );
};

Schema.prototype.validateProperty = function () {
  return this.validate.validateProperty.apply( this, arguments );
};

Schema.prototype.validateObject = function () {
  return this.validate.validateObject.apply( this, arguments );
};

module.exports = Schema;
},{"./sanitize":45,"./utils":47,"./validate":49}],45:[function(_dereq_,module,exports){
var utils = _dereq_( "./utils" );

var isNullOrUndefined = function ( value ) {
  return value === null || value === undefined;
};

var sanitizeProperty = function ( result, value, properties ) {

  properties.forEach( function ( property ) {
    var optional = property[ "optional" ] === true,
      castMatch,
      castedValue;

    switch ( true ) {

    case (
      ( /^object$/i.test( property.datatype ) && utils.hasKey( property, "properties", "array" ) ) ||
      ( utils.hasKey( property.datatype, "properties", "array" ) ) ||
      ( property.datatype[ 0 ] && utils.type( property.datatype[ 0 ] ) === "object" )
      ):

      var metadata = /^object$/i.test( property.datatype ) ? property.properties : property.datatype.properties;

      metadata = metadata || property.datatype;

      castedValue = utils.type( value[ property.key ] ) === "object" ? value[ property.key ] : null;

      if ( !optional ) {
        castedValue = sanitizeProperty( result[ property.key ] = {}, castedValue || {}, metadata );
      }

      break;

    case ( utils.type( property.datatype ) === "array" ):

      castedValue = null;
      castMatch = utils.cast( value[ property.key ], "array" ) || null;

      if ( utils.type( castMatch ) === "array" ) {

        castedValue = [];

        switch ( true ) {

        case ( /^guid$/i.test( property.datatype[ 0 ] ) ):

          castMatch.forEach( function ( value ) {

            if ( utils.guid.isValid( value ) ) {
              castedValue.push( value );
            }

          } );

          break;

        case ( 
          utils.hasKey( property.datatype[ 0 ], "properties", "array" ) ||
          utils.type( property.datatype[ 0 ] ) === "array"
        ) :

          castMatch.forEach( function ( value ) {

            var castedArrayValue,
                metadata = property.datatype[ 0 ].properties ? property.datatype[ 0 ].properties : property.datatype[ 0 ];

            castedArrayValue = sanitizeProperty( castedArrayValue = {}, value || {}, metadata );

            castedValue.push( castedArrayValue );

          } );

        break;

        case utils.type( property.datatype[ 0 ] ) === "string":

          castMatch.forEach( function ( value ) {

            var castedArrayValue = utils.cast( value, property.datatype[ 0 ] );

            if ( utils.type( castedArrayValue ) === property.datatype[ 0 ] ) {
              castedValue.push( castedArrayValue );
            }

          } );

          break;

        }

      }

      break;

    case ( /^guid$/i.test( property.datatype ) ):
      castMatch = utils.cast( value[ property.key ], "string" ) || "";
      castMatch = utils.guid.match( castMatch );
      castedValue = utils.type( castMatch ) === "array" && castMatch.length > 0 ? castMatch[ 0 ] : null;
      break;

    default:
      castedValue = utils.cast( value[ property.key ], property.datatype.toLowerCase(), property[ "default" ] );
      break;

    }

    castedValue = isNullOrUndefined( castedValue ) && property.hasOwnProperty( "default" ) ? property[ "default" ] : castedValue;

    if ( isNullOrUndefined( castedValue ) && optional ) {
      return;
    }

    result[ property.key ] = castedValue;

  } );

  return result;
};

/**
 * Sanitizes an object based on a schema
 *
 * @method sanitize
 * @for SPEAKschema
 * @param {Object} schema The schema definition
 * @param {Object} objectToBeSanitized The object to be sanitized
 * @returns {Object} The sanitized object
 *
 * @example
 *
 * Create a schema defintion
 * ```
 * var mySchema = {
 *     "properties": [ {
 *         "key": "firstName",             // The key name
 *         "datatype": "String",           // Array, Boolean, Integer etc
 *         "optional": false,              // Whether this key is optional or not (all keys are required unless optional is explicitly set to true)
 *         "default": ""                   // The default value
 *     }, {
 *         "key": "subscribe",
 *         "datatype": "Boolean",
 *         "optional": false,
 *         "default": true
 *     }, {
 *         "key": "address",
 *         "datatype": "Object",
 *         "optional": false,
 *         "properties": { [                 // Deep objects are acceptable
 *             "key": "street",
 *             "datatype": "String",
 *             "optional": true,
 *             "default": "undefined"
 *         ] }
 *     } ]
 * };
 * ```
 *
 * <br>
 *
 * #### Create a new SchemaObject
 * ```
 * var schema = new SPEAKschema();
 * ```
 *
 * <br>
 *
 * #### Create an object to be santized
 * ```
 * var myObject = {
 *     "firstName": "David",
 *     "eyeColor": "brown"
 * }
 * ```
 *
 * <br>
 *
 * #### Call the sanitize method
 * ```
 * var mySanitizedObject = schema.sanitize(mySchema, myObject);
 * ```
 *
 * <br>
 *
 * #### Your santized object will be returned
 * ```
 * // Output of mySanitizedObject
 * {
 *     "firstName": "David",
 *     "subscribe": true,
 *     "address": {
 *         "street": "undefined"
 *     }
 * }
 * ```
 */

function sanitize( schema, objectToBeSanitized ) {
  var result;

  objectToBeSanitized = objectToBeSanitized instanceof Object ? objectToBeSanitized : {};
  result = sanitizeProperty( result = {}, objectToBeSanitized, schema.properties );

  return result;
}

module.exports = sanitize;
},{"./utils":47}],46:[function(_dereq_,module,exports){
var extend = function ( object, methods ) {

  for ( var i in methods ) {
    if ( methods.hasOwnProperty( i ) ) {
      object[ i ] = methods[ i ];
    }
  }
  return object;

};

module.exports = extend;
},{}],47:[function(_dereq_,module,exports){
module.exports = {

  extend: _dereq_( "./extend" ),
  cast: _dereq_( "sc-cast" ),
  guid: _dereq_( "sc-guid" ),
  isEmpty: _dereq_( "./isEmpty" ),
  type: _dereq_( "type-component" ),
  hasKey: _dereq_( "sc-haskey" )

};
},{"./extend":46,"./isEmpty":48,"sc-cast":36,"sc-guid":11,"sc-haskey":14,"type-component":43}],48:[function(_dereq_,module,exports){
var isEmpty = function ( val ) {
  var result = true;

  if ( typeof val === "boolean" ) {
    result = false;
  } else if ( null === val ) {
    result = true;
  } else if ( "number" === typeof val ) {
    result = 0 === val;
  } else if ( undefined !== val.length ) {
    result = 0 === val.length;
  } else {

    for ( var key in val ) {
      if ( Object.prototype.hasOwnProperty.call( val, key ) ) {
        result = false;
      }
    }

  }

  return result;
};

module.exports = isEmpty;
},{}],49:[function(_dereq_,module,exports){
var utils = _dereq_( "./utils" ),
  StoreManager = _dereq_( "sc-storejs" ),
  storeManager = new StoreManager(),
  rulesStore = storeManager.store( "rules" );

var noop = function () {};

/**
 * integer, date, string
 * creditCard
 * emailAddress
 * maxLength
 * regularExpression
 * required
 * url
 */
var emailRule = function ( val, param ) {
  var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailPattern.test( val );
};

var requiredRule = function ( val, param ) {
  var fulfilled = false;

  switch ( utils.type( val ) ) {
  case "array":
    fulfilled = val.length > 0;
    break;
  case "boolean":
    fulfilled = true;
    break;
  case "number":
    fulfilled = true;
    break;
  case "object":
    fulfilled = Object.keys( val ).length > 0;
    break;
  case "string":
    fulfilled = val.length > 0;
    break;
  default:
    fulfilled = val ? true : false;
    break;
  }

  return fulfilled;
};

var integerRule = function ( val, param ) {
  var result = true;

  if ( isNaN( val ) ) {
    result = false;
  } else {
    result = true;
  }
  if ( result && param.length > 0 ) {
    var number = parseInt( val, 10 );
    if ( number > param[ 0 ] && number < param[ 1 ] ) {
      result = true;
    } else {
      result = false;
    }
  }
  return result;
};

var regexRule = function ( val, param ) {
  result = false;
  var re = new RegExp( param );

  var t = re.test( val );
  if ( t ) {
    result = true;
  }
  return result;
};

var stringRule = function ( val, param ) {

  var validRule = true;

  if ( !param ) {
    throw "Invalid rule: param is empty or undefined";
  }
  if ( param.length < 1 || param.length > 2 ) {
    throw "Invalid rule: rule must have 2 params";
  }

  for ( var i = 0; i < param.length; i++ ) {
    if ( isNaN( param[ i ] ) ) {
      throw "Invalid rule: the param at " + i + " index is not a number";
    }
  }

  if ( validRule ) {
    if ( typeof val !== "string" ) {
      return false;
    }
    if ( val.length > param[ 0 ] && val.length < param[ 1 ] ) {
      return true;
    } else {
      return false;
    }
  } else {
    throw "Invalid Rule";
  }

};

var guidRule = function ( val, param ) {
  return utils.guid.isValid( val );
};

var defaultNativeTypeRule = function ( type ) {
  return function ( val, param ) {
    return utils.type( val ) === type;
  };
};

rulesStore.set( "email", emailRule );
rulesStore.set( "required", requiredRule );
rulesStore.set( "integer", integerRule );
rulesStore.set( "string", stringRule );
rulesStore.set( "regex", regexRule );
rulesStore.set( "guid", guidRule );

var getValidateFunction = function ( validatorName ) {
  var validateItem = rulesStore.get( validatorName ),
    fn = utils.type( validateItem ) === "object" && validateItem.hasOwnProperty( "value" ) && utils.type( validateItem.value ) === "function" ? validateItem.value : defaultNativeTypeRule( validatorName );

  return fn;
};

/**
 * Validate a property of an object based on MetaData
 *
 * @class ValidationPropertyObject
 * @constructor
 * @private
 * @extension schemaJS
 * @param {Object} schemaDefinition The schema definition
 * @param {String} prefix Prefix to add, used when nested object
 * @property {String} key The key of the property
 * @property {type} type The type of the property
 * @property {Array} validators List of Validator functions which will be executed when being validated
 * @property {prefix} type The prefix which would be use to build the key
 * @type {Object}
 * @returns {ValidationPropertyObject} A schema class
 *
 *
 */
var ValidationPropertyObject = function ( property, prefix ) {
  var self = this;

  self.prefix = prefix || "";
  self.key = property.key;
  self.datatype = property.datatype;
  self.validators = property.validators || [];
  self.optional = property.optional === true;

  self.validators.forEach( function ( validator ) {
    validator.fn = getValidateFunction( validator.validatorName );
  } );

};

/**
 * Validate a property
 *
 * @method validate
 * @private
 * @param  {value} value Value that needs to be validated
 * @return {array} Array of error
 */
ValidationPropertyObject.prototype.validate = function ( value ) {
  var errors = [],
    self = this;

  self.validators.forEach( function ( validator ) {
    var isNotOptional = value === void 0 && self.optional === true ? false : true,
      isInvalid = false;

    if ( utils.type( self.datatype ) === "array" ) {

      isInvalid = utils.type( value ) !== "array";

      if ( !isInvalid && /^required$/i.test( validator.validatorName ) && value.length === 0 ) {
        isInvalid = true;
      }

      if ( !isInvalid ) {
        value.forEach( function ( item ) {
          if ( !isInvalid && !validator.fn( item, validator.param ) ) {
            isInvalid = true;
          }
        } );
      }

    } else {

      // TODO: think we need to validate against the datatype

      isInvalid = !validator.fn( value, validator.param );
    }

    if ( isNotOptional && isInvalid ) {
      errors.push( {
        type: validator.validatorName,
        message: validator.errorMessage || ""
      } );
    }
  } );

  return errors;
};

/**
 * ValidationObject
 *
 * @class ValidationObject
 * @constructor
 * @private
 * @extension ValidationObject
 * @param {Object} schemaDefinition The schema definition
 * @param {String} prefix Prefix to add, used when nested object
 * @property {String} key The key of the property
 * @property {type} type The type of the property
 * @property {Array} properties List of all the properties for the object
 * @property {Array} validators List of Validator functions which will be executed when being validated
 * @property {prefix} type The prefix which would be use to build the key
 * @type {Object}
 * @returns {ValidationObject} A schema class
 */
var ValidationObject = function ( objectDefinition, key ) {
  var self = this;

  self.properties = objectDefinition.properties;
  self.validators = [];
  self.type = "Object";
  self.key = key || "";
  self.prefix = key ? ( key + "." ) : "";

  self.properties.forEach( function ( propertyDefinition ) {
    if ( /^object$/i.test( propertyDefinition.datatype ) || utils.hasKey( propertyDefinition.datatype, "properties", "array" ) ) {
      self.validators.push( new ValidationObject( /^object$/i.test( propertyDefinition.datatype ) ? propertyDefinition : propertyDefinition.datatype, propertyDefinition.key ) );
    } else {
      self.validators.push( new ValidationPropertyObject( propertyDefinition, key ) );
    }
  } );
};

ValidationObject.prototype.validate = function ( value ) {
  var errors = {},
    self = this;

  value = value || {};

  self.validators.forEach( function ( validator ) {

    var error = validator.validate( value[ validator.key ] );

    if ( validator instanceof ValidationPropertyObject ) {
      errors[ self.prefix + validator.key ] = ( error.length > 0 ) ? error : void 0;
    } else {
      for ( var k in error ) {
        if ( error.hasOwnProperty( k ) ) {
          errors[ self.prefix + k ] = error[ k ];
        }
      }
    }
  } );

  return errors;
};

/**
 * Validate a property
 *
 * @method validateProperty
 * @for  SPEAKschema
 * @param  {Object} schema The schema definition
 * @param  {Object} objectToBeValidated The object to be validated
 * @param  {String} [prefix=""] Prefix to add, used when nested object
 * @return {Array} Error Array of error objects
 *
 * @example
 *
 * Create a property defintion
 * ```
 * var propertySchema = {
 *     "key": "firstName",                              // The key name
 *     "datatype": "String",                            // Array, Boolean, Integer etc
 *     "validators": [ {                                // The validators
 *         "validatorName": "required",
 *         "errorMessage": "you need a first name"
 *     } ]
 * };
 * ```
 *
 * <br>
 *
 * #### Create a new SchemaObject
 * ```
 * var schema = new SPEAKschema();
 * ```
 *
 * <br>
 *
 * Create a new ValidationPropertyObject and pass in the schema definition
 * ```
 * var errors = new schema.validateProperty(propertySchema, "", "firstName");
 * ```
 *
 * Your errors would be
 * ```
 * [ {
 *   type: "required",
 *   message: "you need a first name"
 * } ]
 * ```
 *
 */

function validateProperty( schema, objectToBeValidated, prefix ) {
  var validator = new ValidationPropertyObject( schema, prefix );

  return validator.validate( objectToBeValidated );
}

/**
 * Validate an object
 *
 * @method validateObject
 * @for  SPEAKschema
 * @param  {Object} schema The schema definition
 * @param  {Object} objectToBeValidated The object to be validated
 * @param  {String} [key=""] Key
 * @return {Array} Error Array of error objects
 *
 * @example
 *
 * Create an object defintion
 * ```
 * var objectTest = {
 *    "key": "address",
 *    "datatype": "Object",
 *    "properties": [ {
 *        "key": "location",
 *        "datatype": "String",
 *        "validators": [ {
 *            "validatorName": "required"
 *        }, {
 *            "validatorName": "string",
 *            "param": [ 0, 25 ]
 *        } ]
 *    } ]
 *};
 * ```
 *
 * <br>
 *
 * #### Create a new SchemaObject
 * ```
 * var schema = new SPEAKschema();
 * ```
 *
 * <br>
 *
 * Create a new ValidationPropertyObject and pass in the schema definition
 * ```
 * var errors = new schema.validateObject(objectTest, {location: ""});
 * ```
 *
 * Your errors would be
 * ```
 * {
 *   "location": [ {
 *     type: "required"
 *     message: ""
 *   }, {
 *     type: "string",
 *     message: ""
 *   } ]
 * }
 * ```
 *
 */

function validateObject( schema, objectToBeValidated, key ) {
  var validator = new ValidationObject( schema, key );

  return validator.validate( objectToBeValidated );
}

function Validate( options ) {
  var self = this,
    rules;

  options = utils.type( options ) === "object" ? options : {};
  rules = utils.type( options[ "rules" ] ) === "object" ? options.rules : {};

  for ( var key in rules ) {

    if ( utils.type( rules[ key ] ) === "function" ) {

      rulesStore.set( key, rules[ key ] );

    }

  }

  self.validateProperty = validateProperty;
  self.validateObject = validateObject;
  self.rulesStore = rulesStore;

}

module.exports = Validate;
},{"./utils":47,"sc-storejs":40}],50:[function(_dereq_,module,exports){
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
},{"sc-bindingjs":5,"sc-is":16}],51:[function(_dereq_,module,exports){
module.exports={
	"defaults": {
		"middlewareKey": "all"
	}
}
},{}],52:[function(_dereq_,module,exports){
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
},{"./config.json":51,"sc-is":16}],53:[function(_dereq_,module,exports){
module.exports={
  "metadataValidatorScriptEndPoint": "/sitecore/api/ssc/script/metadata",
  "metadataValidatorScriptEndPointParamName": "scripts",
  "metadata": {
    "properties": [ {
      "key": "entity",
      "datatype": "object",
      "validators": [ {
        "validatorName": "required",
        "errorMessage": "An entity object is required"
      } ],
      "properties": [ {
        "key": "properties",
        "datatype": "array",
        "validators": [ {
          "validatorName": "array",
          "errorMessage": "The entity object requires a properties key as an array"
        } ]
      }, {
        "key": "key",
        "datatype": "string",
        "validators": [ {
          "validatorName": "required",
          "errorMessage": "The entity object requires a key to define which property to assign id's to"
        } ]
      } ]
    } ]
  }
}
},{}],54:[function(_dereq_,module,exports){
/**
 * @namespace EntityService
 */

var utils = _dereq_( "./utils" ),
  DataService = _dereq_( "sc-data" ),
  q = _dereq_( "q" ),
  trackable = _dereq_( "sc-trackable" ),
  Schema = _dereq_( "sc-schemajs" ),
  binding = _dereq_( "sc-bindingjs" );

var defineProperties = function ( entity, data, entityServiceSchema ) {
  var self = entity;

  Object.defineProperties( self, {

    "__schema": {
      value: {
        "ENTITY": utils.getEntitySchemaByType( entityServiceSchema ),
        "GETBYID": utils.getEntitySchemaByType( entityServiceSchema, "GET" ),
        "SAVE": utils.getEntitySchemaByType( entityServiceSchema, "PUT" ),
        "CREATE": utils.getEntitySchemaByType( entityServiceSchema, "POST" ),
        "REMOVE": utils.getEntitySchemaByType( entityServiceSchema, "DELETE" )
      }
    },

    "isNew": {
      get: function () {
        var self = this;
        return utils.is.empty( self[ self.__schema.ENTITY.key ] );
      }
    }

  } );
};

/**
 * Entity represent a Entity in client side
 *
 * @class  Entity
 * @constructor
 * @param {Object} sanitizedData An object that meets has been validated by the schema
 * @param {Object} entityServiceSchema The entity schema
 * @param {Object} options The entity options
 * @returns {Entity} An Entity
 */
var Entity = DataService.Item.extend( {

  init: function ( sanitizedData, entityServiceSchema, options ) {

    var self = this;

    options = utils.is.an.object( options ) ? options : {};
    options.raw = options[ "raw" ] === true;
    options.binding = options[ "binding" ] === false ? false : true;
    options.trackable = options[ "trackable" ] === true;
    options.url = utils.is.a.string( options[ "url" ] ) ? options[ "url" ] : "";
    options.headers = utils.is.an.object( options.headers ) ? options.headers : {};

    if ( options[ "raw" ] === true && ( options[ "binding" ] === true || options[ "trackable" ] === true ) ) {
      throw new Error( "An entity cannot be raw and have a binding or be trackable" );
    }

    entityServiceSchema = utils.is.an.object( entityServiceSchema ) ? entityServiceSchema : {};
    sanitizedData = utils.is.an.object( sanitizedData ) ? sanitizedData : {};

    self._super( sanitizedData, options );
    defineProperties( self, sanitizedData, entityServiceSchema );

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

  destroy: function () {
    var self = this,
      defer = q.defer();

    utils.request( {

      type: "DELETE",
      url: self.option( "url" ),
      data: self.json(),
      header: self.options.headers

    } ).then( function ( res ) {
      defer.resolve( self );
    } ).fail( defer.reject );

    return defer.promise;
  },

  isValid: function ( type ) {
    var self = this,
      isValid = true,
      errors = self.validate( type );

    Object.keys( errors ).forEach( function ( key ) {
      if ( isValid && errors[ key ] !== void 0 ) {
        isValid = false;
      }
    } );

    return isValid;
  },

  json: function () {
    var self = this;
    json = self._super( utils.pick( self, utils.metadata.getRootKeysAsArray( self.__schema.ENTITY ) ) );

    return json;
  },

  save: function ( options ) {
    var self = this,
      defer = q.defer();

    options = utils.is.an.object( options ) ? options : {};

    // Suppress a save if the entity is tracking and ...
    // - The id has changed (the id should only change when the entity was created with an empty object and then saved)
    // - The entity has not changed
    // - The entity is invalid
    if ( self.isTrackable ) {

      if ( ( self.hasChanged( self.__schema.ENTITY.key ) || self.hasChanged() === false ) ) {
        return self;
      }

      if ( self.isValid() === false ) {
        var validationErrors = self.validate(),
          oneOfTheValuesExcludingTheIdKeyIsInvalid = false;

        // If the entity is new, do not check the configured `key` for validitiy
        if ( self.isNew ) {
          validationErrors[ self.__schema.ENTITY.key ] = void 0;
        }

        Object.keys( validationErrors ).forEach( function ( validationErrorKey ) {
          if ( validationErrors[ validationErrorKey ] !== void 0 ) {
            oneOfTheValuesExcludingTheIdKeyIsInvalid = true;
          }
        } );

        if ( oneOfTheValuesExcludingTheIdKeyIsInvalid ) {
          self.emit( "save", validationErrors );
          return self;
        }

      }
    }


    utils.request( {

      type: self.isNew ? "POST" : "PUT",
      url: self.option( "url" ),
      data: self.json(),
      header: self.options.headers

    } ).then( function ( response ) {
      if ( utils.is.empty( self[ self.__schema.ENTITY.key ] ) ) {
        if ( utils.hasKey( response, "__id", "string" ) && !utils.is.empty( response.__id ) ) {
          self[ self.__schema.ENTITY.key ] = response.__id;
        } else {
          throw new Error( "While creating an entity, the server did not return a valid id" );
        }
      }

      self.emit( "save" );
      defer.resolve( self );

    } ).fail( function ( error ) {
      self.emit( "save", error );
      defer.reject( error );
    } );

    return defer.promise;
  },

  trackable: function () {
    var self = this;

    if ( self.option( "raw" ) === true ) {
      return self;
    }

    trackable( self );

    return self;
  },

  validate: function ( type ) {
    var self = this,
      schema = new Schema();

    type = type || "ENTITY";

    return self.option( "validate" ) === false || self.__schema.ENTITY === void 0 ? {} : schema.validateObject( self.__schema[ type ], self );
  }

} );

module.exports = Entity;
},{"./utils":63,"q":4,"sc-bindingjs":5,"sc-data":7,"sc-schemajs":44,"sc-trackable":50}],55:[function(_dereq_,module,exports){
/**
 * @namespace EntityService
 */

var Q = _dereq_( "q" ),
    DataService = _dereq_( "sc-data" ),
    Query = _dereq_( "./sc-query" ),
    utils = _dereq_( "./utils" ),
    Schema = _dereq_( "sc-schemajs" ),
    Entity = _dereq_( "./entity" ),
    config = utils.merge( _dereq_( "./config.json" ), DataService.config );

_dereq_( "./middleware" );

var EntityService = DataService.extend( {

    init: function EntityCtor( options ) {
        var self = this;

        self._super( options );
        self.hasMetaData = false;
        self.metadata = null;
    },

    create: function ( data, options ) {
        var self = this,
            defer = Q.defer(),
            emptyEntity,
            promise,
            schema = new Schema(),
            query;

        options = utils.is.an.object( options ) ? options : {};
        options.url = utils.is.a.string( options.url ) && !utils.is.empty( options.url ) ? options.url : self.url;
        options.trackable = utils.is.a.boolean( options.trackable ) ? options.trackable : self.options.trackable;
        options.binding = utils.is.a.boolean( options.binding ) ? options.binding : self.options.binding;
        options.raw = utils.is.a.boolean( options.raw ) ? options.raw : self.options.raw;

        options.headers = utils.is.an.object( options.headers ) ? options.headers : self.options.headers;

        switch ( true ) {

        case utils.is.not.null( data ) && utils.is.an.object( data ):

            query = new Query( options.url, "POST", options );

            query
                .parameters( data )
                .option( "url", options.url )
                .option( "entityService", self );

            promise = query;

            break;

        case utils.is.empty( data ):

            self.loadMetadata().then( function () {

                emptyEntity = new Entity( schema.sanitize( self.metadata.entity, {} ), self.metadata, options );
                defer.resolve( emptyEntity );

            } ).fail( defer.reject );

            promise = defer.promise;

            break;
        }

        return promise;
    },
    fetchEntity: function ( id, options ) {
        var self = this;

        options = utils.is.an.object( options ) ? options : {};
        options.headers = utils.is.an.object( options.headers ) ? options.headers : self.options.headers;

        var query = new Query( self.url, self.type, options );

        query
            .option( "url", self.url )
            .option( "entityService", self )
            .option( "single", true )
            .parameter( "id", id );

        self.loadMetadata();

        return query;
    },

    fetchEntities: function ( options ) {
        var self = this;

        options = utils.is.an.object( options ) ? options : {};
        options.headers = utils.is.an.object( options.headers ) ? options.headers : self.options.headers;

        var query = new Query( self.url, self.type, options );

        query
            .option( "url", self.url )
            .option( "entityService", self );

        self.loadMetadata();

        return query;
    },

    loadMetadata: function () {
        var self = this,
            defer = Q.defer();

        if ( self.metadataLoading ) {
            return;
        }

        if ( self.hasMetaData ) {

            defer.resolve( self.metadata );
            self.emit( "metadata:loaded", null, self.metadata );

        } else {

            self.metadataLoading = true;

            utils
                .request( {
                    url: self.url,
                    type: "OPTIONS",
                    header: self.options.headers || {}
                } )
                .then( function ( metadata ) {

                    var metadataError;

                    if ( utils.hasKey( metadata, "entity", "object" ) === false ) {
                        metadataError = new Error( "The server did not return a valid metadata object" );
                        defer.reject( metadataError );
                        self.emit( "metadata:loaded", metadataError );
                        return;
                    }

                    utils.metadataValidator.add( metadata.entity ).then( function ( newValidators ) {

                        self.metadataLoading = false;
                        self.hasMetaData = true;
                        self.metadata = metadata;
                        defer.resolve( self.metadata );
                        self.emit( "metadata:loaded", null, self.metadata );

                    } ).fail( function ( error ) {

                        defer.reject( new Error( "There was an error loading the custom validators" ) );

                    } );

                } )
                .fail( function ( error ) {
                    defer.reject( error );
                    self.emit( "metadata:loaded", error );
                } );

        }

        return defer.promise;
    }

} );

utils.emitter( EntityService.prototype );
utils.optionify( EntityService.prototype );
utils.useify( EntityService );

exports = module.exports = EntityService;
exports.Entity = Entity;
exports.utils = utils;

if ( typeof window !== "undefined" ) {
    window.EntityService = exports;
}

},{"./config.json":53,"./entity":54,"./middleware":56,"./sc-query":60,"./utils":63,"q":4,"sc-data":7,"sc-schemajs":44}],56:[function(_dereq_,module,exports){
var Query = _dereq_( "sc-query" ),
  utils = _dereq_( "../utils" ),
  Schema = _dereq_( "sc-schemajs" ),
  Model = _dereq_( "sc-data" ),
  config = utils.merge( _dereq_( "../config.json" ), Model.config );

// Query middleware
Query.useify.clear( "preRequest" );
Query.useify.clear( "postRequest" );
Query.use( "preRequest", _dereq_( "./scQueryPreRequest" ) );
Query.use( "postRequest", _dereq_( "./scQueryPostRequest" ) );

// Request middleware
utils.request.use( "postRequest", _dereq_( "./scRequestPostRequest" ) );

// Initialise the custom validators
( function () {

  var dummySchema = new Schema(),
    existingRules = [];

  dummySchema.validate.rulesStore.all().forEach( function ( rule ) {
    existingRules.push( rule.key );
  } );

  utils.metadataValidator.addButDoNotInject( existingRules );
  utils.metadataValidator.options.scriptEndPoint = config.metadataValidatorScriptEndPoint;
  utils.metadataValidator.options.scriptEntPointParamName = config.metadataValidatorScriptEndPointParamName;

} )();
},{"../config.json":53,"../utils":63,"./scQueryPostRequest":57,"./scQueryPreRequest":58,"./scRequestPostRequest":59,"sc-data":7,"sc-query":28,"sc-schemajs":44}],57:[function(_dereq_,module,exports){
var utils = _dereq_( "../utils" ),
  Entity = _dereq_( "../entity" ),
  Schema = _dereq_( "sc-schemajs" );

module.exports = function ( res, next ) {

  var self = this,
    entityService = utils.is.object( self.options[ "entityService" ] ) ? self.options[ "entityService" ] : {},
    entities = utils.is.an.array( res ) ? res : [],
    entity = utils.is.an.object( res ) ? res : {},
    schema = new Schema(),
    raw = self.options[ "raw" ] === true,
    hasMetaData = self.options.entityService[ "hasMetaData" ] === true,
    sanitizedEntities = [];

  

  switch ( true ) {

  case ( /^post$/i.test( self.type ) ):

    if ( utils.hasKey( entity, "__id", "string" ) && !utils.is.empty( entity.__id ) ) {
      entity[ self.options.entityService.metadata.entity.key ] = entity.__id;
    } else {
      return next( new Error( "While creating an entity, the server did not return a valid id" ) );
    }

    sanitizedEntities = raw || !hasMetaData ? entity : new Entity( schema.sanitize( self.options.entityService.metadata.entity, entity ), self.options.entityService.metadata, self.options );

    break;

  case self.options[ "single" ]:
    sanitizedEntities = raw || !hasMetaData ? entity : new Entity( schema.sanitize( self.options.entityService.metadata.entity, entity ), self.options.entityService.metadata, self.options );
    break;

  case !self.options[ "single" ]:
    entities.forEach( function ( entity ) {
      sanitizedEntities.push( raw || !hasMetaData ? entity : new Entity( schema.sanitize( self.options.entityService.metadata.entity, entity ), self.options.entityService.metadata, self.options ) );
    } );
    break;

  }

  if ( utils.hasKey( entityService, "middleware", "function" ) ) {

    entityService.middleware( function ( error, middlewareResponse ) {

      next( error, middlewareResponse );

    }, sanitizedEntities );

  }

};
},{"../entity":54,"../utils":63,"sc-schemajs":44}],58:[function(_dereq_,module,exports){
var utils = _dereq_( "../utils" ),
  Entity = _dereq_( "../entity" ),
  Schema = _dereq_( "sc-schemajs" ),
  Model = _dereq_( "sc-data" ),
  config = utils.merge( _dereq_( "../config.json" ), Model.config );

module.exports = function ( requestData, next ) {

  var self = this,
    entityService = utils.is.object( self.options[ "entityService" ] ) ? self.options[ "entityService" ] : {},
    metadataRequired = entityService.hasOwnProperty( "metadata" ) && !entityService[ "metadata" ] ? true : false,
    error;

  if ( metadataRequired ) {

    entityService.loadMetadata();

    entityService.once( "metadata:loaded", function ( error, metadata ) {

      if ( error ) {
        return next( error );
      }

      var schema = new Schema(),
        metadataErrors = schema.validateObject( config.metadata, metadata ),
        metadataHasErrors = false;

      Object.keys( metadataErrors ).forEach( function ( metadataErrorKey ) {

        if ( metadataHasErrors === false && metadataErrors[ metadataErrorKey ] !== void 0 ) {
          metadataHasErrors = true;
        }

      } );

      if ( metadataHasErrors === true ) {
        next( new Error( "The metadata returned by the server is invalid" ) );
      } else {
        next( null, requestData );
      }

    } );

  } else {

    next( null, requestData );

  }

};
},{"../config.json":53,"../entity":54,"../utils":63,"sc-data":7,"sc-schemajs":44}],59:[function(_dereq_,module,exports){
var utils = _dereq_( "../utils" );

var getId = function ( url ) {
  var parts = url.split( "/" ),
      hasTrailingSlash = url.lastIndexOf( "/" ) === ( url.length - 1 ),
      index = hasTrailingSlash ? ( parts.length - 2 ) : ( parts.length - 1 );

  return parts[ index ];
};

module.exports = function ( error, response, next ) {

  if ( utils.hasKey( response, "req.method", "string" ) && /^post$/i.test( response.req.method ) ) {

    var locationString = utils.hasKey( response, "header.location", "string" ) ? response.header.location : "",
      lastId = getId( locationString ),
      id = utils.is.empty( lastId ) ? null : lastId;

    if ( !id ) {
      error = new Error( "While creating the entity the server did not return a valid Id" );
    } else {
      response.body = utils.is.an.object( response[ "body" ] ) ? response.body : {};
      response.body.__id = id;
    }

  }

  next( error, response );

};
},{"../utils":63}],60:[function(_dereq_,module,exports){
var Query = _dereq_( "sc-query" ),
  utils = _dereq_( "../utils" ),
  ExtendedQuery;

var ExtendedQuery = Query.extend( {

  init: function () {
    this._super.apply( this, arguments );
    this.__url = this.url;
  }

} );

exports = module.exports = ExtendedQuery;
exports.utils = Query.utils;
exports.config = Query.config;
exports.useify = Query.useify;
exports.use = Query.use;
},{"../utils":63,"sc-query":28}],61:[function(_dereq_,module,exports){
var hasKey = _dereq_( "sc-haskey" );

var getEntitySchemaByType = function ( entityServiceSchema, type ) {
  var entitySchema = hasKey( entityServiceSchema, "entity.properties", "array" ) ? entityServiceSchema.entity : undefined,
    schema = hasKey( entityServiceSchema, "actions." + type + ".properties", "array" ) ? entityServiceSchema.actions[ type ] : undefined;

  return schema || entitySchema;
};

module.exports = getEntitySchemaByType;
},{"sc-haskey":14}],62:[function(_dereq_,module,exports){
module.exports = function ( sanitizedEntities, sanitizedEntity, res ) {
  return {
    sanitizedEntities: sanitizedEntities,
    sanitizedEntity: sanitizedEntity,
    res: res
  };
};
},{}],63:[function(_dereq_,module,exports){
module.exports = {

  emitter: _dereq_( "emitter-component" ),
  getEntitySchemaByType: _dereq_( "./getEntitySchemaByType" ),
  getResponseObject: _dereq_( "./getResponseObject" ),
  guid: _dereq_( "sc-guid" ),
  hasKey: _dereq_( "sc-haskey" ),
  is: _dereq_( "sc-is" ),
  merge: _dereq_( "sc-merge" ),
  metadata: _dereq_( "./metadata" ),
  metadataValidator: _dereq_( "./metadataValidator" ),
  omit: _dereq_( "sc-omit" ),
  optionify: _dereq_( "sc-optionify" ),
  pick: _dereq_( "sc-pick" ),
  request: _dereq_( "sc-request" ),
  useify: _dereq_( "sc-useify" ),
  validator: _dereq_( "./validator" )

};
},{"./getEntitySchemaByType":61,"./getResponseObject":62,"./metadata":65,"./metadataValidator":64,"./validator":66,"emitter-component":2,"sc-guid":11,"sc-haskey":14,"sc-is":16,"sc-merge":22,"sc-omit":24,"sc-optionify":25,"sc-pick":26,"sc-request":31,"sc-useify":52}],64:[function(_dereq_,module,exports){
var q = _dereq_( "Q" ),
  cache = {};

var isObject = function ( value ) {
  return typeof value === "object" && !Array.isArray( value );
};

var findAllValidatorsInMetadata = function ( metadata ) {
  var validators = {};

  var find = function ( properties ) {

    properties = Array.isArray( properties ) ? properties : [];

    properties.forEach( function ( property ) {

      var propertyValidators;

      property = isObject( property ) ? property : {};
      propertyValidators = Array.isArray( property[ "validators" ] ) ? property.validators : [];

      propertyValidators.forEach( function ( propertyValidator ) {

        propertyValidator = isObject( propertyValidator ) ? propertyValidator : {};

        if ( !validators.hasOwnProperty( propertyValidator[ "validatorName" ] ) ) {
          validators[ propertyValidator.validatorName ] = true;
        }

      } );

      find( property[ "properties" ] );

    } );

  };

  metadata = isObject( metadata ) ? metadata : {};

  find( metadata[ "properties" ] );

  return Object.keys( validators );
};

var injectNewValidators = function ( newValidators ) {

  var self = this,
    defer = q.defer(),
    script,
    src = self.options.scriptEndPoint + "?" + self.options.scriptEntPointParamName + "=" + encodeURIComponent( newValidators.join( "," ) );

  if ( "undefined" !== ( typeof window ) ) {

    script = document.createElement( "script" );

    script.type = "text\/javascript";
    script.async = true;
    script.src = src;

    script.onload = defer.resolve;
    script.onerror = defer.reject;

    document.getElementsByTagName( "body" )[ 0 ].appendChild( script );

  }

  return defer.promise;
};

var addValidatorsToCache = function ( validators ) {
  var newValidators = [];

  validators = Array.isArray( validators ) ? validators : [];

  validators.forEach( function ( validator ) {
    if ( !cache.hasOwnProperty( validator ) ) {
      newValidators.push( validator );
      cache[ validator ] = true;
    }
  } );

  return newValidators;
};

var MetadataValidator = function () {
  var self = this;

  self.options = {
    scriptEndPoint: "./",
    scriptEntPointParamName: "scripts"
  };

  Object.defineProperty( self, "validators", {
    get: function () {
      return Object.keys( cache );
    }
  } );

};

MetadataValidator.prototype.add = function ( metadata ) {
  var self = this,
    defer = q.defer(),
    validators = findAllValidatorsInMetadata( metadata ),
    newValidators = addValidatorsToCache( validators );

  if ( newValidators.length > 0 ) {
    injectNewValidators.apply( self, [ newValidators ] ).then( function () {
      defer.resolve( newValidators );
    } ).fail( defer.reject );
  } else {
    defer.resolve( [] );
  }

  return defer.promise;
};

MetadataValidator.prototype.addButDoNotInject = function ( arrayOfValidatorNames ) {
  addValidatorsToCache( arrayOfValidatorNames );
};

MetadataValidator.prototype.get = function ( validatorName ) {
  return cache[ validatorName ] || null;
};

module.exports = new MetadataValidator();
},{"Q":1}],65:[function(_dereq_,module,exports){
var hasKey = _dereq_( "sc-haskey" );

exports.getRootKeysAsArray = function ( metadata ) {
  var keys = [],
    properties = hasKey( metadata, "properties", "array" ) ? metadata.properties : [];

  properties.forEach( function ( property ) {

    if ( hasKey( property, "key", "string" ) ) {
      keys.push( property.key );
    }

  } );

  return keys;
};
},{"sc-haskey":14}],66:[function(_dereq_,module,exports){
var Schema = _dereq_( "sc-schemajs" );

exports.add = function ( name, fn ) {
  var dummySchema = new Schema(),
    rulesStore = dummySchema.validate.rulesStore;

  rulesStore.set( name, fn );

};
},{"sc-schemajs":44}]},{},[55])
(55)
});