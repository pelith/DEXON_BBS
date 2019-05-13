// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"QVnC":[function(require,module,exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"PMvg":[function(require,module,exports) {
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":"QVnC"}],"FO+Z":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUser = exports.getTitle = exports.getParseText = exports.getUrlParameter = exports.htmlEntities = void 0;

var htmlEntities = function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

exports.htmlEntities = htmlEntities;

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName = [];

  for (var i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
  }
};

exports.getUrlParameter = getUrlParameter;

var getParseText = function getParseText(str, len) {
  var tmp = '',
      count = 0;

  for (var i = 0; i < str.length; i++) {
    if (str[i].match(/[\u4e00-\u9fa5]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\u0800-\u4e00]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\uff00-\uffff]/g)) tmp += str[i], count += 2;else tmp += str[i], count++;
    if (count === len) break;else if (count > len) tmp = tmp.substr(0, tmp.length - 1);
  }

  return tmp;
};

exports.getParseText = getParseText;

var getTitle = function getTitle(content) {
  content = getParseText(content, 42);
  var match = content.match(/^(\[).*(\])/);
  return {
    match: match,
    title: match ? match[0].substr(1, match[0].length - 2) : content
  };
};

exports.getTitle = getTitle;

var getUser = function getUser(address) {
  return address.replace(/^(0x.{4}).+(.{4})$/, '$1…$2');
};

exports.getUser = getUser;
},{}],"UN6U":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newReply = exports.newPost = exports.loginDexon = exports.initDexon = exports.web3js = exports.BBSExtContract = exports.BBSContract = exports.ABIBBSExt = exports.ABIBBS = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ABIBBS = [{
  "constant": !1,
  "inputs": [{
    "name": "content",
    "type": "string"
  }],
  "name": "Post",
  "outputs": [],
  "payable": !1,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "anonymous": !1,
  "inputs": [{
    "indexed": !1,
    "name": "content",
    "type": "string"
  }],
  "name": "Posted",
  "type": "event"
}];
exports.ABIBBS = ABIBBS;
var ABIBBSExt = [{
  "constant": false,
  "inputs": [{
    "name": "content",
    "type": "string"
  }],
  "name": "Post",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "origin",
    "type": "bytes32"
  }, {
    "name": "vote",
    "type": "uint256"
  }, {
    "name": "content",
    "type": "string"
  }],
  "name": "Reply",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "name": "origin",
    "type": "bytes32"
  }, {
    "indexed": false,
    "name": "vote",
    "type": "uint256"
  }, {
    "indexed": false,
    "name": "content",
    "type": "string"
  }],
  "name": "Replied",
  "type": "event"
}, {
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "bytes32"
  }],
  "name": "downvotes",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "bytes32"
  }],
  "name": "upvotes",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "address"
  }, {
    "name": "",
    "type": "bytes32"
  }],
  "name": "voted",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}];
exports.ABIBBSExt = ABIBBSExt;
var BBSContract = "0x663002C4E41E5d04860a76955A7B9B8234475952";
exports.BBSContract = BBSContract;
var BBSExtContract = "0xec368ba43010056abb3e5afd01957ea1fdbd3d8f";
exports.BBSExtContract = BBSExtContract;
var web3js = new Web3('https://mainnet-rpc.dexon.org');
exports.web3js = web3js;
var dexonWeb3 = '';
var activeAccount = '';

var initDexon =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(activeDexonRender) {
    var accounts;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!window.dexon) {
              _context.next = 6;
              break;
            }

            dexonWeb3 = new Web3(window.dexon);
            _context.next = 4;
            return dexonWeb3.eth.getAccounts();

          case 4:
            accounts = _context.sent;

            if (accounts.length) {
              detectDexonNetwrok(activeDexonRender);
            }

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function initDexon(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.initDexon = initDexon;

var loginDexon = function loginDexon(activeDexonRender) {
  if (window.dexon) {
    window.dexon.enable();
    detectDexonNetwrok(activeDexonRender);
  } else return alert('DEXON Wallet not detected. (請安裝 DEXON 瀏覽器擴充套件)');
};

exports.loginDexon = loginDexon;

var detectDexonNetwrok =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(activeDexonRender) {
    var networkID;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return dexonWeb3.eth.net.getId();

          case 2:
            networkID = _context2.sent;

            if (!(networkID === 237)) {
              _context2.next = 8;
              break;
            }

            startInteractingWithWeb3(activeDexonRender);
            console.log('DEXON Wallet connected');
            _context2.next = 9;
            break;

          case 8:
            return _context2.abrupt("return", alert('Wrong network'));

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function detectDexonNetwrok(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var startInteractingWithWeb3 = function startInteractingWithWeb3(activeDexonRender) {
  var start =
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee3() {
      var accounts;
      return _regenerator.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return dexonWeb3.eth.getAccounts();

            case 2:
              accounts = _context3.sent;

              if (accounts.length) {
                activeAccount = accounts[0];
                activeDexonRender(activeAccount);
              }

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function start() {
      return _ref3.apply(this, arguments);
    };
  }();

  start();
  setInterval(start, 1000);
};

var newPost =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(title, content) {
    var post, dexBBSExt, gas, receipt;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (dexonWeb3) {
              _context4.next = 2;
              break;
            }

            return _context4.abrupt("return", alert('Please connect to your DEXON Wallet.'));

          case 2:
            if (!(title.length > 40)) {
              _context4.next = 4;
              break;
            }

            return _context4.abrupt("return", alert('Title\'s length is over 40 characters.'));

          case 4:
            post = '[' + title + ']' + content;
            dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract);
            _context4.next = 8;
            return dexBBSExt.methods.Post(post).estimateGas();

          case 8:
            gas = _context4.sent;
            _context4.prev = 9;
            _context4.next = 12;
            return dexBBSExt.methods.Post(post).send({
              from: activeAccount,
              gas: gas
            });

          case 12:
            receipt = _context4.sent;
            window.location = 'index.html';
            _context4.next = 19;
            break;

          case 16:
            _context4.prev = 16;
            _context4.t0 = _context4["catch"](9);
            alert(_context4.t0);

          case 19:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[9, 16]]);
  }));

  return function newPost(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.newPost = newPost;

var newReply =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5(tx, replyType, content) {
    var dexBBSExt, gas, receipt;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (dexonWeb3) {
              _context5.next = 2;
              break;
            }

            return _context5.abrupt("return", alert('Please connect to your DEXON Wallet first.'));

          case 2:
            if ([0, 1, 2].includes(+replyType)) {
              _context5.next = 4;
              break;
            }

            return _context5.abrupt("return", alert('Wrong type of replyType.'));

          case 4:
            if (content.length) {
              _context5.next = 6;
              break;
            }

            return _context5.abrupt("return", alert('No content.'));

          case 6:
            if (!tx) {
              _context5.next = 21;
              break;
            }

            dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract);
            _context5.next = 10;
            return dexBBSExt.methods.Reply(tx, +replyType, content).estimateGas();

          case 10:
            gas = _context5.sent;
            _context5.prev = 11;
            _context5.next = 14;
            return dexBBSExt.methods.Reply(tx, +replyType, content).send({
              from: activeAccount,
              gas: gas
            });

          case 14:
            receipt = _context5.sent;
            window.location.reload();
            _context5.next = 21;
            break;

          case 18:
            _context5.prev = 18;
            _context5.t0 = _context5["catch"](11);
            alert(_context5.t0);

          case 21:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[11, 18]]);
  }));

  return function newReply(_x5, _x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}();

exports.newReply = newReply;
},{"@babel/runtime/regenerator":"PMvg"}],"pILq":[function(require,module,exports) {
"use strict";

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _utils = require("./utils.js");

var _dexon = require("./dexon.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var tx = '';
var account = '';
var isShowReply = false,
    isShowReplyType = false;

var activeDexonRender = function activeDexonRender(account) {
  account = (0, _utils.getUser)(account);

  if (account) {
    // show User
    $("#bbs-login").hide();
    $("#bbs-register").hide();
    $("#bbs-user").show(); // only show reply btn at first time

    if (!$("#reply-user").text()) $("#reply-btn").show();
  } else {
    // show Login/Register
    $("#bbs-login").show();
    $("#bbs-register").show();
    $("#bbs-user").hide(); // hide reply btn

    $("#reply-btn").hide();
  }

  $("#bbs-user").text(account);
  $("#reply-user").text(account);
};

var showReplyType = function showReplyType() {
  $('#reply-btn').hide();
  $('#reply-type0').show();
  $('#reply-type1').show();
  $('#reply-type2').show();
  isShowReplyType = true;
};

var hideReplyTypeBtn = function hideReplyTypeBtn() {
  $('#reply-type0').hide();
  $('#reply-type1').hide();
  $('#reply-type2').hide();
};

var showReply = function showReply(type) {
  hideReplyTypeBtn();
  $('#reply').show();
  $('#reply-send').show();
  $('#reply-cancel').show();
  var typeColor = {
    0: '#fff',
    1: '#ff6',
    2: '#f66'
  };
  $("#reply-type").css('color', typeColor[type]);
  $("#reply-type").val(type);
  $("html").stop().animate({
    scrollTop: $('#reply').position().top
  }, 500, 'swing');
  $("#reply-content").focus();
  isShowReply = true;
  isShowReplyType = false;
};

var hideReply = function hideReply() {
  hideReplyTypeBtn();
  $("#reply").hide();
  $('#reply-send').hide();
  $('#reply-cancel').hide();
  $('#reply-btn').show();
  $("#reply-content").val('');
  isShowReply = false;
};

var main =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3() {
    var transaction, content, title, contentDisplay, contentNormalized, BBSExt, originTx, events;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            tx = (0, _utils.getUrlParameter)('tx');

            if (tx) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return");

          case 3:
            (0, _dexon.initDexon)(activeDexonRender);
            $('#bbs-login').click(function () {
              (0, _dexon.loginDexon)(activeDexonRender);
            });
            $('#reply-btn').click(function () {
              showReplyType();
            });
            $('#reply-type0').click(function () {
              showReply(0);
            });
            $('#reply-type1').click(function () {
              showReply(1);
            });
            $('#reply-type2').click(function () {
              showReply(2);
            });
            $('#reply-cancel').click(function () {
              hideReply();
            });
            $('#reply-send').click(function () {
              (0, _dexon.newReply)(tx.substr(0, 66), $("#reply-type").val(), $("#reply-content").val());
            });
            $("#reply-content").blur(function () {
              $("#reply-content").val((0, _utils.getParseText)($("#reply-content").val(), 56));
            });
            keyboardHook();
            _context3.next = 15;
            return _dexon.web3js.eth.getTransaction(tx);

          case 15:
            transaction = _context3.sent;
            content = (0, _utils.htmlEntities)(_dexon.web3js.utils.hexToUtf8('0x' + transaction.input.slice(138)));
            title = (0, _utils.getTitle)(content.substr(0, 42));
            contentDisplay = title.match ? content.slice(title.title.length + 2) : content;
            contentNormalized = contentDisplay.trim().replace(/\n\s*?\n+/g, '\n\n');
            document.title = title.title + ' - Gossiping - DEXON BBS';
            $('#main-content-author').text((0, _utils.getUser)(transaction.from)); // $('#main-content-author').attr('href', 'https://dexonscan.app/address/'+transaction.from)

            $('#main-content-title').text(title.title);
            $('#main-content-content').text(contentNormalized);

            _dexon.web3js.eth.getBlock(transaction.blockNumber).then(function (block) {
              $('#main-content-date').text(('' + new Date(block.timestamp)).substr(0, 24));
            });

            $('#main-content-href').attr('href', window.location.href);
            $('#main-content-href').text(window.location.href);
            $('#main-content-from').text('@' + transaction.blockNumber);
            $('#main-content-from').attr('href', 'https://dexonscan.app/transaction/' + tx);
            BBSExt = new _dexon.web3js.eth.Contract(_dexon.ABIBBSExt, _dexon.BBSExtContract);
            originTx = (0, _utils.getUrlParameter)('tx').substr(0, 66);
            _context3.next = 33;
            return BBSExt.getPastEvents({
              fromBlock: '990000'
            });

          case 33:
            events = _context3.sent;
            events.slice().filter(function (event) {
              return originTx == event.returnValues.origin;
            }).map(
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee(event) {
                var transaction, block;
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _dexon.web3js.eth.getTransaction(event.transactionHash);

                      case 2:
                        transaction = _context.sent;
                        _context.next = 5;
                        return _dexon.web3js.eth.getBlock(event.blockNumber);

                      case 5:
                        block = _context.sent;
                        return _context.abrupt("return", [event.returnValues.content, transaction.from, block.timestamp, event.returnValues.vote]);

                      case 7:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }()).reduce(
            /*#__PURE__*/
            function () {
              var _ref3 = _asyncToGenerator(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee2(n, p) {
                return _regenerator.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return n;

                      case 2:
                        _context2.t0 = displayReply;
                        _context2.t1 = void 0;
                        _context2.t2 = _toConsumableArray;
                        _context2.next = 7;
                        return p;

                      case 7:
                        _context2.t3 = _context2.sent;
                        _context2.t4 = (0, _context2.t2)(_context2.t3);

                        _context2.t0.apply.call(_context2.t0, _context2.t1, _context2.t4);

                      case 10:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x2, _x3) {
                return _ref3.apply(this, arguments);
              };
            }(), Promise.resolve());

          case 35:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

var keyboardHook = function keyboardHook() {
  var ctrlKey = 17,
      returnCode = 13;
  var ctrlDown = false;
  $(document).keydown(function (e) {
    if (e.keyCode == ctrlKey) ctrlDown = true;
  }).keyup(function (e) {
    if (e.keyCode == ctrlKey) ctrlDown = false;
  });
  $(document).keyup(function (e) {
    if (!isShowReply && !isShowReplyType && e.keyCode == 'X'.charCodeAt()) {
      showReplyType();
    } else if (!isShowReply && isShowReplyType && '1'.charCodeAt() <= e.keyCode && e.keyCode <= '3'.charCodeAt()) {
      if (e.key == '1') showReply(1);else if (e.key == '2') showReply(2);else if (e.key == '3') showReply(0);
    } else if (isShowReply && !isShowReplyType && ctrlDown && e.keyCode == returnCode) {
      if ($("#reply-content").val().length > 0) (0, _dexon.newReply)(tx.substr(0, 66), $("#reply-type").val(), $("#reply-content").val());else hideReply();
    }
  });
};

var displayReply = function displayReply(content, from, timestamp, vote) {
  content = (0, _utils.htmlEntities)(content);
  var voteName = ["→", "推", "噓"];
  var elem = $('<div class="push"></div>');
  var date = new Date(timestamp);
  var formatDate = date.getMonth() + 1 + '/' + ('' + date.getDate()).padStart(2, '0') + ' ' + ('' + date.getHours()).padStart(2, '0') + ':' + ('' + date.getMinutes()).padStart(2, '0');
  elem.html("<span class=\"".concat(vote != 1 ? 'f1 ' : '', "hl push-tag\">").concat(voteName[vote], " </span><span class=\"f3 hl push-userid\">").concat((0, _utils.getUser)(from), "</span><span class=\"f3 push-content\">: ").concat(content, "</span><span class=\"push-ipdatetime\">").concat(formatDate, "</span>"));
  $('#main-content.bbs-screen.bbs-content').append(elem);
};

$(main);
},{"@babel/runtime/regenerator":"PMvg","./utils.js":"FO+Z","./dexon.js":"UN6U"}]},{},["pILq"], null)