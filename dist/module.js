define(["@grafana/data","@grafana/runtime","@grafana/ui","emotion","lodash","prismjs","react"], function(__WEBPACK_EXTERNAL_MODULE__grafana_data__, __WEBPACK_EXTERNAL_MODULE__grafana_runtime__, __WEBPACK_EXTERNAL_MODULE__grafana_ui__, __WEBPACK_EXTERNAL_MODULE_emotion__, __WEBPACK_EXTERNAL_MODULE_lodash__, __WEBPACK_EXTERNAL_MODULE_prismjs__, __WEBPACK_EXTERNAL_MODULE_react__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./module.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/rxjs/_esm5/internal/AsyncSubject.js":
/*!***********************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/AsyncSubject.js ***!
  \***********************************************************/
/*! exports provided: AsyncSubject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncSubject", function() { return AsyncSubject; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Subject */ "../node_modules/rxjs/_esm5/internal/Subject.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/** PURE_IMPORTS_START tslib,_Subject,_Subscription PURE_IMPORTS_END */



var AsyncSubject = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](AsyncSubject, _super);
    function AsyncSubject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.value = null;
        _this.hasNext = false;
        _this.hasCompleted = false;
        return _this;
    }
    AsyncSubject.prototype._subscribe = function (subscriber) {
        if (this.hasError) {
            subscriber.error(this.thrownError);
            return _Subscription__WEBPACK_IMPORTED_MODULE_2__["Subscription"].EMPTY;
        }
        else if (this.hasCompleted && this.hasNext) {
            subscriber.next(this.value);
            subscriber.complete();
            return _Subscription__WEBPACK_IMPORTED_MODULE_2__["Subscription"].EMPTY;
        }
        return _super.prototype._subscribe.call(this, subscriber);
    };
    AsyncSubject.prototype.next = function (value) {
        if (!this.hasCompleted) {
            this.value = value;
            this.hasNext = true;
        }
    };
    AsyncSubject.prototype.error = function (error) {
        if (!this.hasCompleted) {
            _super.prototype.error.call(this, error);
        }
    };
    AsyncSubject.prototype.complete = function () {
        this.hasCompleted = true;
        if (this.hasNext) {
            _super.prototype.next.call(this, this.value);
        }
        _super.prototype.complete.call(this);
    };
    return AsyncSubject;
}(_Subject__WEBPACK_IMPORTED_MODULE_1__["Subject"]));

//# sourceMappingURL=AsyncSubject.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/BehaviorSubject.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/BehaviorSubject.js ***!
  \**************************************************************/
/*! exports provided: BehaviorSubject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BehaviorSubject", function() { return BehaviorSubject; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Subject */ "../node_modules/rxjs/_esm5/internal/Subject.js");
/* harmony import */ var _util_ObjectUnsubscribedError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/ObjectUnsubscribedError */ "../node_modules/rxjs/_esm5/internal/util/ObjectUnsubscribedError.js");
/** PURE_IMPORTS_START tslib,_Subject,_util_ObjectUnsubscribedError PURE_IMPORTS_END */



var BehaviorSubject = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](BehaviorSubject, _super);
    function BehaviorSubject(_value) {
        var _this = _super.call(this) || this;
        _this._value = _value;
        return _this;
    }
    Object.defineProperty(BehaviorSubject.prototype, "value", {
        get: function () {
            return this.getValue();
        },
        enumerable: true,
        configurable: true
    });
    BehaviorSubject.prototype._subscribe = function (subscriber) {
        var subscription = _super.prototype._subscribe.call(this, subscriber);
        if (subscription && !subscription.closed) {
            subscriber.next(this._value);
        }
        return subscription;
    };
    BehaviorSubject.prototype.getValue = function () {
        if (this.hasError) {
            throw this.thrownError;
        }
        else if (this.closed) {
            throw new _util_ObjectUnsubscribedError__WEBPACK_IMPORTED_MODULE_2__["ObjectUnsubscribedError"]();
        }
        else {
            return this._value;
        }
    };
    BehaviorSubject.prototype.next = function (value) {
        _super.prototype.next.call(this, this._value = value);
    };
    return BehaviorSubject;
}(_Subject__WEBPACK_IMPORTED_MODULE_1__["Subject"]));

//# sourceMappingURL=BehaviorSubject.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/InnerSubscriber.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/InnerSubscriber.js ***!
  \**************************************************************/
/*! exports provided: InnerSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InnerSubscriber", function() { return InnerSubscriber; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


var InnerSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.outerValue = outerValue;
        _this.outerIndex = outerIndex;
        _this.index = 0;
        return _this;
    }
    InnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    };
    InnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    };
    return InnerSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));

//# sourceMappingURL=InnerSubscriber.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/Notification.js":
/*!***********************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/Notification.js ***!
  \***********************************************************/
/*! exports provided: NotificationKind, Notification */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotificationKind", function() { return NotificationKind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Notification", function() { return Notification; });
/* harmony import */ var _observable_empty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observable/empty */ "../node_modules/rxjs/_esm5/internal/observable/empty.js");
/* harmony import */ var _observable_of__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./observable/of */ "../node_modules/rxjs/_esm5/internal/observable/of.js");
/* harmony import */ var _observable_throwError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./observable/throwError */ "../node_modules/rxjs/_esm5/internal/observable/throwError.js");
/** PURE_IMPORTS_START _observable_empty,_observable_of,_observable_throwError PURE_IMPORTS_END */



var NotificationKind;
/*@__PURE__*/ (function (NotificationKind) {
    NotificationKind["NEXT"] = "N";
    NotificationKind["ERROR"] = "E";
    NotificationKind["COMPLETE"] = "C";
})(NotificationKind || (NotificationKind = {}));
var Notification = /*@__PURE__*/ (function () {
    function Notification(kind, value, error) {
        this.kind = kind;
        this.value = value;
        this.error = error;
        this.hasValue = kind === 'N';
    }
    Notification.prototype.observe = function (observer) {
        switch (this.kind) {
            case 'N':
                return observer.next && observer.next(this.value);
            case 'E':
                return observer.error && observer.error(this.error);
            case 'C':
                return observer.complete && observer.complete();
        }
    };
    Notification.prototype.do = function (next, error, complete) {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return next && next(this.value);
            case 'E':
                return error && error(this.error);
            case 'C':
                return complete && complete();
        }
    };
    Notification.prototype.accept = function (nextOrObserver, error, complete) {
        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
            return this.observe(nextOrObserver);
        }
        else {
            return this.do(nextOrObserver, error, complete);
        }
    };
    Notification.prototype.toObservable = function () {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return Object(_observable_of__WEBPACK_IMPORTED_MODULE_1__["of"])(this.value);
            case 'E':
                return Object(_observable_throwError__WEBPACK_IMPORTED_MODULE_2__["throwError"])(this.error);
            case 'C':
                return Object(_observable_empty__WEBPACK_IMPORTED_MODULE_0__["empty"])();
        }
        throw new Error('unexpected notification kind value');
    };
    Notification.createNext = function (value) {
        if (typeof value !== 'undefined') {
            return new Notification('N', value);
        }
        return Notification.undefinedValueNotification;
    };
    Notification.createError = function (err) {
        return new Notification('E', undefined, err);
    };
    Notification.createComplete = function () {
        return Notification.completeNotification;
    };
    Notification.completeNotification = new Notification('C');
    Notification.undefinedValueNotification = new Notification('N', undefined);
    return Notification;
}());

//# sourceMappingURL=Notification.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/Observable.js":
/*!*********************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/Observable.js ***!
  \*********************************************************/
/*! exports provided: Observable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Observable", function() { return Observable; });
/* harmony import */ var _util_canReportError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/canReportError */ "../node_modules/rxjs/_esm5/internal/util/canReportError.js");
/* harmony import */ var _util_toSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/toSubscriber */ "../node_modules/rxjs/_esm5/internal/util/toSubscriber.js");
/* harmony import */ var _symbol_observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./symbol/observable */ "../node_modules/rxjs/_esm5/internal/symbol/observable.js");
/* harmony import */ var _util_pipe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/pipe */ "../node_modules/rxjs/_esm5/internal/util/pipe.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config */ "../node_modules/rxjs/_esm5/internal/config.js");
/** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */





var Observable = /*@__PURE__*/ (function () {
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = Object(_util_toSubscriber__WEBPACK_IMPORTED_MODULE_1__["toSubscriber"])(observerOrNext, error, complete);
        if (operator) {
            sink.add(operator.call(sink, this.source));
        }
        else {
            sink.add(this.source || (_config__WEBPACK_IMPORTED_MODULE_4__["config"].useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                this._subscribe(sink) :
                this._trySubscribe(sink));
        }
        if (_config__WEBPACK_IMPORTED_MODULE_4__["config"].useDeprecatedSynchronousErrorHandling) {
            if (sink.syncErrorThrowable) {
                sink.syncErrorThrowable = false;
                if (sink.syncErrorThrown) {
                    throw sink.syncErrorValue;
                }
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            if (_config__WEBPACK_IMPORTED_MODULE_4__["config"].useDeprecatedSynchronousErrorHandling) {
                sink.syncErrorThrown = true;
                sink.syncErrorValue = err;
            }
            if (Object(_util_canReportError__WEBPACK_IMPORTED_MODULE_0__["canReportError"])(sink)) {
                sink.error(err);
            }
            else {
                console.warn(err);
            }
        }
    };
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var subscription;
            subscription = _this.subscribe(function (value) {
                try {
                    next(value);
                }
                catch (err) {
                    reject(err);
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        var source = this.source;
        return source && source.subscribe(subscriber);
    };
    Observable.prototype[_symbol_observable__WEBPACK_IMPORTED_MODULE_2__["observable"]] = function () {
        return this;
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return Object(_util_pipe__WEBPACK_IMPORTED_MODULE_3__["pipeFromArray"])(operations)(this);
    };
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());

function getPromiseCtor(promiseCtor) {
    if (!promiseCtor) {
        promiseCtor = _config__WEBPACK_IMPORTED_MODULE_4__["config"].Promise || Promise;
    }
    if (!promiseCtor) {
        throw new Error('no Promise impl found');
    }
    return promiseCtor;
}
//# sourceMappingURL=Observable.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/Observer.js":
/*!*******************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/Observer.js ***!
  \*******************************************************/
/*! exports provided: empty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "empty", function() { return empty; });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ "../node_modules/rxjs/_esm5/internal/config.js");
/* harmony import */ var _util_hostReportError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/hostReportError */ "../node_modules/rxjs/_esm5/internal/util/hostReportError.js");
/** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */


var empty = {
    closed: true,
    next: function (value) { },
    error: function (err) {
        if (_config__WEBPACK_IMPORTED_MODULE_0__["config"].useDeprecatedSynchronousErrorHandling) {
            throw err;
        }
        else {
            Object(_util_hostReportError__WEBPACK_IMPORTED_MODULE_1__["hostReportError"])(err);
        }
    },
    complete: function () { }
};
//# sourceMappingURL=Observer.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/OuterSubscriber.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/OuterSubscriber.js ***!
  \**************************************************************/
/*! exports provided: OuterSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OuterSubscriber", function() { return OuterSubscriber; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


var OuterSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](OuterSubscriber, _super);
    function OuterSubscriber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
        this.destination.error(error);
    };
    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
        this.destination.complete();
    };
    return OuterSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));

//# sourceMappingURL=OuterSubscriber.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/ReplaySubject.js":
/*!************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/ReplaySubject.js ***!
  \************************************************************/
/*! exports provided: ReplaySubject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReplaySubject", function() { return ReplaySubject; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Subject */ "../node_modules/rxjs/_esm5/internal/Subject.js");
/* harmony import */ var _scheduler_queue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scheduler/queue */ "../node_modules/rxjs/_esm5/internal/scheduler/queue.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/* harmony import */ var _operators_observeOn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./operators/observeOn */ "../node_modules/rxjs/_esm5/internal/operators/observeOn.js");
/* harmony import */ var _util_ObjectUnsubscribedError__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util/ObjectUnsubscribedError */ "../node_modules/rxjs/_esm5/internal/util/ObjectUnsubscribedError.js");
/* harmony import */ var _SubjectSubscription__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./SubjectSubscription */ "../node_modules/rxjs/_esm5/internal/SubjectSubscription.js");
/** PURE_IMPORTS_START tslib,_Subject,_scheduler_queue,_Subscription,_operators_observeOn,_util_ObjectUnsubscribedError,_SubjectSubscription PURE_IMPORTS_END */







var ReplaySubject = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ReplaySubject, _super);
    function ReplaySubject(bufferSize, windowTime, scheduler) {
        if (bufferSize === void 0) {
            bufferSize = Number.POSITIVE_INFINITY;
        }
        if (windowTime === void 0) {
            windowTime = Number.POSITIVE_INFINITY;
        }
        var _this = _super.call(this) || this;
        _this.scheduler = scheduler;
        _this._events = [];
        _this._infiniteTimeWindow = false;
        _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
        _this._windowTime = windowTime < 1 ? 1 : windowTime;
        if (windowTime === Number.POSITIVE_INFINITY) {
            _this._infiniteTimeWindow = true;
            _this.next = _this.nextInfiniteTimeWindow;
        }
        else {
            _this.next = _this.nextTimeWindow;
        }
        return _this;
    }
    ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
        var _events = this._events;
        _events.push(value);
        if (_events.length > this._bufferSize) {
            _events.shift();
        }
        _super.prototype.next.call(this, value);
    };
    ReplaySubject.prototype.nextTimeWindow = function (value) {
        this._events.push(new ReplayEvent(this._getNow(), value));
        this._trimBufferThenGetEvents();
        _super.prototype.next.call(this, value);
    };
    ReplaySubject.prototype._subscribe = function (subscriber) {
        var _infiniteTimeWindow = this._infiniteTimeWindow;
        var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
        var scheduler = this.scheduler;
        var len = _events.length;
        var subscription;
        if (this.closed) {
            throw new _util_ObjectUnsubscribedError__WEBPACK_IMPORTED_MODULE_5__["ObjectUnsubscribedError"]();
        }
        else if (this.isStopped || this.hasError) {
            subscription = _Subscription__WEBPACK_IMPORTED_MODULE_3__["Subscription"].EMPTY;
        }
        else {
            this.observers.push(subscriber);
            subscription = new _SubjectSubscription__WEBPACK_IMPORTED_MODULE_6__["SubjectSubscription"](this, subscriber);
        }
        if (scheduler) {
            subscriber.add(subscriber = new _operators_observeOn__WEBPACK_IMPORTED_MODULE_4__["ObserveOnSubscriber"](subscriber, scheduler));
        }
        if (_infiniteTimeWindow) {
            for (var i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i]);
            }
        }
        else {
            for (var i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i].value);
            }
        }
        if (this.hasError) {
            subscriber.error(this.thrownError);
        }
        else if (this.isStopped) {
            subscriber.complete();
        }
        return subscription;
    };
    ReplaySubject.prototype._getNow = function () {
        return (this.scheduler || _scheduler_queue__WEBPACK_IMPORTED_MODULE_2__["queue"]).now();
    };
    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
        var now = this._getNow();
        var _bufferSize = this._bufferSize;
        var _windowTime = this._windowTime;
        var _events = this._events;
        var eventsCount = _events.length;
        var spliceCount = 0;
        while (spliceCount < eventsCount) {
            if ((now - _events[spliceCount].time) < _windowTime) {
                break;
            }
            spliceCount++;
        }
        if (eventsCount > _bufferSize) {
            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
        }
        if (spliceCount > 0) {
            _events.splice(0, spliceCount);
        }
        return _events;
    };
    return ReplaySubject;
}(_Subject__WEBPACK_IMPORTED_MODULE_1__["Subject"]));

var ReplayEvent = /*@__PURE__*/ (function () {
    function ReplayEvent(time, value) {
        this.time = time;
        this.value = value;
    }
    return ReplayEvent;
}());
//# sourceMappingURL=ReplaySubject.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/Scheduler.js":
/*!********************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/Scheduler.js ***!
  \********************************************************/
/*! exports provided: Scheduler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Scheduler", function() { return Scheduler; });
var Scheduler = /*@__PURE__*/ (function () {
    function Scheduler(SchedulerAction, now) {
        if (now === void 0) {
            now = Scheduler.now;
        }
        this.SchedulerAction = SchedulerAction;
        this.now = now;
    }
    Scheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) {
            delay = 0;
        }
        return new this.SchedulerAction(this, work).schedule(state, delay);
    };
    Scheduler.now = function () { return Date.now(); };
    return Scheduler;
}());

//# sourceMappingURL=Scheduler.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/Subject.js":
/*!******************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/Subject.js ***!
  \******************************************************/
/*! exports provided: SubjectSubscriber, Subject, AnonymousSubject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SubjectSubscriber", function() { return SubjectSubscriber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Subject", function() { return Subject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnonymousSubject", function() { return AnonymousSubject; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/* harmony import */ var _util_ObjectUnsubscribedError__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util/ObjectUnsubscribedError */ "../node_modules/rxjs/_esm5/internal/util/ObjectUnsubscribedError.js");
/* harmony import */ var _SubjectSubscription__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SubjectSubscription */ "../node_modules/rxjs/_esm5/internal/SubjectSubscription.js");
/* harmony import */ var _internal_symbol_rxSubscriber__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../internal/symbol/rxSubscriber */ "../node_modules/rxjs/_esm5/internal/symbol/rxSubscriber.js");
/** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */







var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SubjectSubscriber, _super);
    function SubjectSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        return _this;
    }
    return SubjectSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_2__["Subscriber"]));

var Subject = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](Subject, _super);
    function Subject() {
        var _this = _super.call(this) || this;
        _this.observers = [];
        _this.closed = false;
        _this.isStopped = false;
        _this.hasError = false;
        _this.thrownError = null;
        return _this;
    }
    Subject.prototype[_internal_symbol_rxSubscriber__WEBPACK_IMPORTED_MODULE_6__["rxSubscriber"]] = function () {
        return new SubjectSubscriber(this);
    };
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype.next = function (value) {
        if (this.closed) {
            throw new _util_ObjectUnsubscribedError__WEBPACK_IMPORTED_MODULE_4__["ObjectUnsubscribedError"]();
        }
        if (!this.isStopped) {
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    };
    Subject.prototype.error = function (err) {
        if (this.closed) {
            throw new _util_ObjectUnsubscribedError__WEBPACK_IMPORTED_MODULE_4__["ObjectUnsubscribedError"]();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    };
    Subject.prototype.complete = function () {
        if (this.closed) {
            throw new _util_ObjectUnsubscribedError__WEBPACK_IMPORTED_MODULE_4__["ObjectUnsubscribedError"]();
        }
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    };
    Subject.prototype._trySubscribe = function (subscriber) {
        if (this.closed) {
            throw new _util_ObjectUnsubscribedError__WEBPACK_IMPORTED_MODULE_4__["ObjectUnsubscribedError"]();
        }
        else {
            return _super.prototype._trySubscribe.call(this, subscriber);
        }
    };
    Subject.prototype._subscribe = function (subscriber) {
        if (this.closed) {
            throw new _util_ObjectUnsubscribedError__WEBPACK_IMPORTED_MODULE_4__["ObjectUnsubscribedError"]();
        }
        else if (this.hasError) {
            subscriber.error(this.thrownError);
            return _Subscription__WEBPACK_IMPORTED_MODULE_3__["Subscription"].EMPTY;
        }
        else if (this.isStopped) {
            subscriber.complete();
            return _Subscription__WEBPACK_IMPORTED_MODULE_3__["Subscription"].EMPTY;
        }
        else {
            this.observers.push(subscriber);
            return new _SubjectSubscription__WEBPACK_IMPORTED_MODULE_5__["SubjectSubscription"](this, subscriber);
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new _Observable__WEBPACK_IMPORTED_MODULE_1__["Observable"]();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(_Observable__WEBPACK_IMPORTED_MODULE_1__["Observable"]));

var AnonymousSubject = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        _this.source = source;
        return _this;
    }
    AnonymousSubject.prototype.next = function (value) {
        var destination = this.destination;
        if (destination && destination.next) {
            destination.next(value);
        }
    };
    AnonymousSubject.prototype.error = function (err) {
        var destination = this.destination;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    };
    AnonymousSubject.prototype.complete = function () {
        var destination = this.destination;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var source = this.source;
        if (source) {
            return this.source.subscribe(subscriber);
        }
        else {
            return _Subscription__WEBPACK_IMPORTED_MODULE_3__["Subscription"].EMPTY;
        }
    };
    return AnonymousSubject;
}(Subject));

//# sourceMappingURL=Subject.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/SubjectSubscription.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/SubjectSubscription.js ***!
  \******************************************************************/
/*! exports provided: SubjectSubscription */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SubjectSubscription", function() { return SubjectSubscription; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */


var SubjectSubscription = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SubjectSubscription, _super);
    function SubjectSubscription(subject, subscriber) {
        var _this = _super.call(this) || this;
        _this.subject = subject;
        _this.subscriber = subscriber;
        _this.closed = false;
        return _this;
    }
    SubjectSubscription.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        var subject = this.subject;
        var observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        var subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    };
    return SubjectSubscription;
}(_Subscription__WEBPACK_IMPORTED_MODULE_1__["Subscription"]));

//# sourceMappingURL=SubjectSubscription.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/Subscriber.js":
/*!*********************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/Subscriber.js ***!
  \*********************************************************/
/*! exports provided: Subscriber, SafeSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Subscriber", function() { return Subscriber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SafeSubscriber", function() { return SafeSubscriber; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/isFunction */ "../node_modules/rxjs/_esm5/internal/util/isFunction.js");
/* harmony import */ var _Observer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Observer */ "../node_modules/rxjs/_esm5/internal/Observer.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/* harmony import */ var _internal_symbol_rxSubscriber__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../internal/symbol/rxSubscriber */ "../node_modules/rxjs/_esm5/internal/symbol/rxSubscriber.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./config */ "../node_modules/rxjs/_esm5/internal/config.js");
/* harmony import */ var _util_hostReportError__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./util/hostReportError */ "../node_modules/rxjs/_esm5/internal/util/hostReportError.js");
/** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */







var Subscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](Subscriber, _super);
    function Subscriber(destinationOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this.syncErrorValue = null;
        _this.syncErrorThrown = false;
        _this.syncErrorThrowable = false;
        _this.isStopped = false;
        switch (arguments.length) {
            case 0:
                _this.destination = _Observer__WEBPACK_IMPORTED_MODULE_2__["empty"];
                break;
            case 1:
                if (!destinationOrNext) {
                    _this.destination = _Observer__WEBPACK_IMPORTED_MODULE_2__["empty"];
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                        _this.destination = destinationOrNext;
                        destinationOrNext.add(_this);
                    }
                    else {
                        _this.syncErrorThrowable = true;
                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
                    }
                    break;
                }
            default:
                _this.syncErrorThrowable = true;
                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                break;
        }
        return _this;
    }
    Subscriber.prototype[_internal_symbol_rxSubscriber__WEBPACK_IMPORTED_MODULE_4__["rxSubscriber"]] = function () { return this; };
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _parentOrParents = this._parentOrParents;
        this._parentOrParents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parentOrParents = _parentOrParents;
        return this;
    };
    return Subscriber;
}(_Subscription__WEBPACK_IMPORTED_MODULE_3__["Subscription"]));

var SafeSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this._parentSubscriber = _parentSubscriber;
        var next;
        var context = _this;
        if (Object(_util_isFunction__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== _Observer__WEBPACK_IMPORTED_MODULE_2__["empty"]) {
                context = Object.create(observerOrNext);
                if (Object(_util_isFunction__WEBPACK_IMPORTED_MODULE_1__["isFunction"])(context.unsubscribe)) {
                    _this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = _this.unsubscribe.bind(_this);
            }
        }
        _this._context = context;
        _this._next = next;
        _this._error = error;
        _this._complete = complete;
        return _this;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!_config__WEBPACK_IMPORTED_MODULE_5__["config"].useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            var useDeprecatedSynchronousErrorHandling = _config__WEBPACK_IMPORTED_MODULE_5__["config"].useDeprecatedSynchronousErrorHandling;
            if (this._error) {
                if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                if (useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                Object(_util_hostReportError__WEBPACK_IMPORTED_MODULE_6__["hostReportError"])(err);
            }
            else {
                if (useDeprecatedSynchronousErrorHandling) {
                    _parentSubscriber.syncErrorValue = err;
                    _parentSubscriber.syncErrorThrown = true;
                }
                else {
                    Object(_util_hostReportError__WEBPACK_IMPORTED_MODULE_6__["hostReportError"])(err);
                }
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function () { return _this._complete.call(_this._context); };
                if (!_config__WEBPACK_IMPORTED_MODULE_5__["config"].useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            if (_config__WEBPACK_IMPORTED_MODULE_5__["config"].useDeprecatedSynchronousErrorHandling) {
                throw err;
            }
            else {
                Object(_util_hostReportError__WEBPACK_IMPORTED_MODULE_6__["hostReportError"])(err);
            }
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        if (!_config__WEBPACK_IMPORTED_MODULE_5__["config"].useDeprecatedSynchronousErrorHandling) {
            throw new Error('bad call');
        }
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            if (_config__WEBPACK_IMPORTED_MODULE_5__["config"].useDeprecatedSynchronousErrorHandling) {
                parent.syncErrorValue = err;
                parent.syncErrorThrown = true;
                return true;
            }
            else {
                Object(_util_hostReportError__WEBPACK_IMPORTED_MODULE_6__["hostReportError"])(err);
                return true;
            }
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));

//# sourceMappingURL=Subscriber.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/Subscription.js":
/*!***********************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/Subscription.js ***!
  \***********************************************************/
/*! exports provided: Subscription */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Subscription", function() { return Subscription; });
/* harmony import */ var _util_isArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/isArray */ "../node_modules/rxjs/_esm5/internal/util/isArray.js");
/* harmony import */ var _util_isObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/isObject */ "../node_modules/rxjs/_esm5/internal/util/isObject.js");
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/isFunction */ "../node_modules/rxjs/_esm5/internal/util/isFunction.js");
/* harmony import */ var _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/UnsubscriptionError */ "../node_modules/rxjs/_esm5/internal/util/UnsubscriptionError.js");
/** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */




var Subscription = /*@__PURE__*/ (function () {
    function Subscription(unsubscribe) {
        this.closed = false;
        this._parentOrParents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._ctorUnsubscribe = true;
            this._unsubscribe = unsubscribe;
        }
    }
    Subscription.prototype.unsubscribe = function () {
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parentOrParents = _a._parentOrParents, _ctorUnsubscribe = _a._ctorUnsubscribe, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parentOrParents = null;
        this._subscriptions = null;
        if (_parentOrParents instanceof Subscription) {
            _parentOrParents.remove(this);
        }
        else if (_parentOrParents !== null) {
            for (var index = 0; index < _parentOrParents.length; ++index) {
                var parent_1 = _parentOrParents[index];
                parent_1.remove(this);
            }
        }
        if (Object(_util_isFunction__WEBPACK_IMPORTED_MODULE_2__["isFunction"])(_unsubscribe)) {
            if (_ctorUnsubscribe) {
                this._unsubscribe = undefined;
            }
            try {
                _unsubscribe.call(this);
            }
            catch (e) {
                errors = e instanceof _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_3__["UnsubscriptionError"] ? flattenUnsubscriptionErrors(e.errors) : [e];
            }
        }
        if (Object(_util_isArray__WEBPACK_IMPORTED_MODULE_0__["isArray"])(_subscriptions)) {
            var index = -1;
            var len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (Object(_util_isObject__WEBPACK_IMPORTED_MODULE_1__["isObject"])(sub)) {
                    try {
                        sub.unsubscribe();
                    }
                    catch (e) {
                        errors = errors || [];
                        if (e instanceof _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_3__["UnsubscriptionError"]) {
                            errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
                        }
                        else {
                            errors.push(e);
                        }
                    }
                }
            }
        }
        if (errors) {
            throw new _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_3__["UnsubscriptionError"](errors);
        }
    };
    Subscription.prototype.add = function (teardown) {
        var subscription = teardown;
        if (!teardown) {
            return Subscription.EMPTY;
        }
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (!(subscription instanceof Subscription)) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default: {
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
            }
        }
        var _parentOrParents = subscription._parentOrParents;
        if (_parentOrParents === null) {
            subscription._parentOrParents = this;
        }
        else if (_parentOrParents instanceof Subscription) {
            if (_parentOrParents === this) {
                return subscription;
            }
            subscription._parentOrParents = [_parentOrParents, this];
        }
        else if (_parentOrParents.indexOf(this) === -1) {
            _parentOrParents.push(this);
        }
        else {
            return subscription;
        }
        var subscriptions = this._subscriptions;
        if (subscriptions === null) {
            this._subscriptions = [subscription];
        }
        else {
            subscriptions.push(subscription);
        }
        return subscription;
    };
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());

function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_3__["UnsubscriptionError"]) ? err.errors : err); }, []);
}
//# sourceMappingURL=Subscription.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/config.js":
/*!*****************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/config.js ***!
  \*****************************************************/
/*! exports provided: config */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return config; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var _enable_super_gross_mode_that_will_cause_bad_things = false;
var config = {
    Promise: undefined,
    set useDeprecatedSynchronousErrorHandling(value) {
        if (value) {
            var error = /*@__PURE__*/ new Error();
            /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
        }
        else if (_enable_super_gross_mode_that_will_cause_bad_things) {
            /*@__PURE__*/ console.log('RxJS: Back to a better error behavior. Thank you. <3');
        }
        _enable_super_gross_mode_that_will_cause_bad_things = value;
    },
    get useDeprecatedSynchronousErrorHandling() {
        return _enable_super_gross_mode_that_will_cause_bad_things;
    },
};
//# sourceMappingURL=config.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js":
/*!*************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/innerSubscribe.js ***!
  \*************************************************************/
/*! exports provided: SimpleInnerSubscriber, ComplexInnerSubscriber, SimpleOuterSubscriber, ComplexOuterSubscriber, innerSubscribe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleInnerSubscriber", function() { return SimpleInnerSubscriber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComplexInnerSubscriber", function() { return ComplexInnerSubscriber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleOuterSubscriber", function() { return SimpleOuterSubscriber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComplexOuterSubscriber", function() { return ComplexOuterSubscriber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "innerSubscribe", function() { return innerSubscribe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _util_subscribeTo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/subscribeTo */ "../node_modules/rxjs/_esm5/internal/util/subscribeTo.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_Observable,_util_subscribeTo PURE_IMPORTS_END */




var SimpleInnerSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SimpleInnerSubscriber, _super);
    function SimpleInnerSubscriber(parent) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        return _this;
    }
    SimpleInnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(value);
    };
    SimpleInnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error);
        this.unsubscribe();
    };
    SimpleInnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete();
        this.unsubscribe();
    };
    return SimpleInnerSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));

var ComplexInnerSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ComplexInnerSubscriber, _super);
    function ComplexInnerSubscriber(parent, outerValue, outerIndex) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.outerValue = outerValue;
        _this.outerIndex = outerIndex;
        return _this;
    }
    ComplexInnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this);
    };
    ComplexInnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error);
        this.unsubscribe();
    };
    ComplexInnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    };
    return ComplexInnerSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));

var SimpleOuterSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SimpleOuterSubscriber, _super);
    function SimpleOuterSubscriber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SimpleOuterSubscriber.prototype.notifyNext = function (innerValue) {
        this.destination.next(innerValue);
    };
    SimpleOuterSubscriber.prototype.notifyError = function (err) {
        this.destination.error(err);
    };
    SimpleOuterSubscriber.prototype.notifyComplete = function () {
        this.destination.complete();
    };
    return SimpleOuterSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));

var ComplexOuterSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ComplexOuterSubscriber, _super);
    function ComplexOuterSubscriber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ComplexOuterSubscriber.prototype.notifyNext = function (_outerValue, innerValue, _outerIndex, _innerSub) {
        this.destination.next(innerValue);
    };
    ComplexOuterSubscriber.prototype.notifyError = function (error) {
        this.destination.error(error);
    };
    ComplexOuterSubscriber.prototype.notifyComplete = function (_innerSub) {
        this.destination.complete();
    };
    return ComplexOuterSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));

function innerSubscribe(result, innerSubscriber) {
    if (innerSubscriber.closed) {
        return undefined;
    }
    if (result instanceof _Observable__WEBPACK_IMPORTED_MODULE_2__["Observable"]) {
        return result.subscribe(innerSubscriber);
    }
    return Object(_util_subscribeTo__WEBPACK_IMPORTED_MODULE_3__["subscribeTo"])(result)(innerSubscriber);
}
//# sourceMappingURL=innerSubscribe.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/observable/ConnectableObservable.js":
/*!*******************************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/observable/ConnectableObservable.js ***!
  \*******************************************************************************/
/*! exports provided: ConnectableObservable, connectableObservableDescriptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectableObservable", function() { return ConnectableObservable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "connectableObservableDescriptor", function() { return connectableObservableDescriptor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subject */ "../node_modules/rxjs/_esm5/internal/Subject.js");
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/* harmony import */ var _operators_refCount__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../operators/refCount */ "../node_modules/rxjs/_esm5/internal/operators/refCount.js");
/** PURE_IMPORTS_START tslib,_Subject,_Observable,_Subscriber,_Subscription,_operators_refCount PURE_IMPORTS_END */






var ConnectableObservable = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ConnectableObservable, _super);
    function ConnectableObservable(source, subjectFactory) {
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.subjectFactory = subjectFactory;
        _this._refCount = 0;
        _this._isComplete = false;
        return _this;
    }
    ConnectableObservable.prototype._subscribe = function (subscriber) {
        return this.getSubject().subscribe(subscriber);
    };
    ConnectableObservable.prototype.getSubject = function () {
        var subject = this._subject;
        if (!subject || subject.isStopped) {
            this._subject = this.subjectFactory();
        }
        return this._subject;
    };
    ConnectableObservable.prototype.connect = function () {
        var connection = this._connection;
        if (!connection) {
            this._isComplete = false;
            connection = this._connection = new _Subscription__WEBPACK_IMPORTED_MODULE_4__["Subscription"]();
            connection.add(this.source
                .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
            if (connection.closed) {
                this._connection = null;
                connection = _Subscription__WEBPACK_IMPORTED_MODULE_4__["Subscription"].EMPTY;
            }
        }
        return connection;
    };
    ConnectableObservable.prototype.refCount = function () {
        return Object(_operators_refCount__WEBPACK_IMPORTED_MODULE_5__["refCount"])()(this);
    };
    return ConnectableObservable;
}(_Observable__WEBPACK_IMPORTED_MODULE_2__["Observable"]));

var connectableObservableDescriptor = /*@__PURE__*/ (function () {
    var connectableProto = ConnectableObservable.prototype;
    return {
        operator: { value: null },
        _refCount: { value: 0, writable: true },
        _subject: { value: null, writable: true },
        _connection: { value: null, writable: true },
        _subscribe: { value: connectableProto._subscribe },
        _isComplete: { value: connectableProto._isComplete, writable: true },
        getSubject: { value: connectableProto.getSubject },
        connect: { value: connectableProto.connect },
        refCount: { value: connectableProto.refCount }
    };
})();
var ConnectableSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ConnectableSubscriber, _super);
    function ConnectableSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
    }
    ConnectableSubscriber.prototype._error = function (err) {
        this._unsubscribe();
        _super.prototype._error.call(this, err);
    };
    ConnectableSubscriber.prototype._complete = function () {
        this.connectable._isComplete = true;
        this._unsubscribe();
        _super.prototype._complete.call(this);
    };
    ConnectableSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (connectable) {
            this.connectable = null;
            var connection = connectable._connection;
            connectable._refCount = 0;
            connectable._subject = null;
            connectable._connection = null;
            if (connection) {
                connection.unsubscribe();
            }
        }
    };
    return ConnectableSubscriber;
}(_Subject__WEBPACK_IMPORTED_MODULE_1__["SubjectSubscriber"]));
var RefCountOperator = /*@__PURE__*/ (function () {
    function RefCountOperator(connectable) {
        this.connectable = connectable;
    }
    RefCountOperator.prototype.call = function (subscriber, source) {
        var connectable = this.connectable;
        connectable._refCount++;
        var refCounter = new RefCountSubscriber(subscriber, connectable);
        var subscription = source.subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    };
    return RefCountOperator;
}());
var RefCountSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](RefCountSubscriber, _super);
    function RefCountSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
    }
    RefCountSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        var refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    };
    return RefCountSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_3__["Subscriber"]));
//# sourceMappingURL=ConnectableObservable.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/observable/SubscribeOnObservable.js":
/*!*******************************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/observable/SubscribeOnObservable.js ***!
  \*******************************************************************************/
/*! exports provided: SubscribeOnObservable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SubscribeOnObservable", function() { return SubscribeOnObservable; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _scheduler_asap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scheduler/asap */ "../node_modules/rxjs/_esm5/internal/scheduler/asap.js");
/* harmony import */ var _util_isNumeric__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/isNumeric */ "../node_modules/rxjs/_esm5/internal/util/isNumeric.js");
/** PURE_IMPORTS_START tslib,_Observable,_scheduler_asap,_util_isNumeric PURE_IMPORTS_END */




var SubscribeOnObservable = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SubscribeOnObservable, _super);
    function SubscribeOnObservable(source, delayTime, scheduler) {
        if (delayTime === void 0) {
            delayTime = 0;
        }
        if (scheduler === void 0) {
            scheduler = _scheduler_asap__WEBPACK_IMPORTED_MODULE_2__["asap"];
        }
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.delayTime = delayTime;
        _this.scheduler = scheduler;
        if (!Object(_util_isNumeric__WEBPACK_IMPORTED_MODULE_3__["isNumeric"])(delayTime) || delayTime < 0) {
            _this.delayTime = 0;
        }
        if (!scheduler || typeof scheduler.schedule !== 'function') {
            _this.scheduler = _scheduler_asap__WEBPACK_IMPORTED_MODULE_2__["asap"];
        }
        return _this;
    }
    SubscribeOnObservable.create = function (source, delay, scheduler) {
        if (delay === void 0) {
            delay = 0;
        }
        if (scheduler === void 0) {
            scheduler = _scheduler_asap__WEBPACK_IMPORTED_MODULE_2__["asap"];
        }
        return new SubscribeOnObservable(source, delay, scheduler);
    };
    SubscribeOnObservable.dispatch = function (arg) {
        var source = arg.source, subscriber = arg.subscriber;
        return this.add(source.subscribe(subscriber));
    };
    SubscribeOnObservable.prototype._subscribe = function (subscriber) {
        var delay = this.delayTime;
        var source = this.source;
        var scheduler = this.scheduler;
        return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
            source: source, subscriber: subscriber
        });
    };
    return SubscribeOnObservable;
}(_Observable__WEBPACK_IMPORTED_MODULE_1__["Observable"]));

//# sourceMappingURL=SubscribeOnObservable.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/observable/combineLatest.js":
/*!***********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/observable/combineLatest.js ***!
  \***********************************************************************/
/*! exports provided: combineLatest, CombineLatestOperator, CombineLatestSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "combineLatest", function() { return combineLatest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CombineLatestOperator", function() { return CombineLatestOperator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CombineLatestSubscriber", function() { return CombineLatestSubscriber; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _util_isScheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/isScheduler */ "../node_modules/rxjs/_esm5/internal/util/isScheduler.js");
/* harmony import */ var _util_isArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/isArray */ "../node_modules/rxjs/_esm5/internal/util/isArray.js");
/* harmony import */ var _OuterSubscriber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../OuterSubscriber */ "../node_modules/rxjs/_esm5/internal/OuterSubscriber.js");
/* harmony import */ var _util_subscribeToResult__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/subscribeToResult */ "../node_modules/rxjs/_esm5/internal/util/subscribeToResult.js");
/* harmony import */ var _fromArray__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./fromArray */ "../node_modules/rxjs/_esm5/internal/observable/fromArray.js");
/** PURE_IMPORTS_START tslib,_util_isScheduler,_util_isArray,_OuterSubscriber,_util_subscribeToResult,_fromArray PURE_IMPORTS_END */






var NONE = {};
function combineLatest() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    var resultSelector = undefined;
    var scheduler = undefined;
    if (Object(_util_isScheduler__WEBPACK_IMPORTED_MODULE_1__["isScheduler"])(observables[observables.length - 1])) {
        scheduler = observables.pop();
    }
    if (typeof observables[observables.length - 1] === 'function') {
        resultSelector = observables.pop();
    }
    if (observables.length === 1 && Object(_util_isArray__WEBPACK_IMPORTED_MODULE_2__["isArray"])(observables[0])) {
        observables = observables[0];
    }
    return Object(_fromArray__WEBPACK_IMPORTED_MODULE_5__["fromArray"])(observables, scheduler).lift(new CombineLatestOperator(resultSelector));
}
var CombineLatestOperator = /*@__PURE__*/ (function () {
    function CombineLatestOperator(resultSelector) {
        this.resultSelector = resultSelector;
    }
    CombineLatestOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new CombineLatestSubscriber(subscriber, this.resultSelector));
    };
    return CombineLatestOperator;
}());

var CombineLatestSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](CombineLatestSubscriber, _super);
    function CombineLatestSubscriber(destination, resultSelector) {
        var _this = _super.call(this, destination) || this;
        _this.resultSelector = resultSelector;
        _this.active = 0;
        _this.values = [];
        _this.observables = [];
        return _this;
    }
    CombineLatestSubscriber.prototype._next = function (observable) {
        this.values.push(NONE);
        this.observables.push(observable);
    };
    CombineLatestSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            this.active = len;
            this.toRespond = len;
            for (var i = 0; i < len; i++) {
                var observable = observables[i];
                this.add(Object(_util_subscribeToResult__WEBPACK_IMPORTED_MODULE_4__["subscribeToResult"])(this, observable, undefined, i));
            }
        }
    };
    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
        if ((this.active -= 1) === 0) {
            this.destination.complete();
        }
    };
    CombineLatestSubscriber.prototype.notifyNext = function (_outerValue, innerValue, outerIndex) {
        var values = this.values;
        var oldVal = values[outerIndex];
        var toRespond = !this.toRespond
            ? 0
            : oldVal === NONE ? --this.toRespond : this.toRespond;
        values[outerIndex] = innerValue;
        if (toRespond === 0) {
            if (this.resultSelector) {
                this._tryResultSelector(values);
            }
            else {
                this.destination.next(values.slice());
            }
        }
    };
    CombineLatestSubscriber.prototype._tryResultSelector = function (values) {
        var result;
        try {
            result = this.resultSelector.apply(this, values);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return CombineLatestSubscriber;
}(_OuterSubscriber__WEBPACK_IMPORTED_MODULE_3__["OuterSubscriber"]));

//# sourceMappingURL=combineLatest.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/observable/concat.js":
/*!****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/observable/concat.js ***!
  \****************************************************************/
/*! exports provided: concat */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "concat", function() { return concat; });
/* harmony import */ var _of__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./of */ "../node_modules/rxjs/_esm5/internal/observable/of.js");
/* harmony import */ var _operators_concatAll__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../operators/concatAll */ "../node_modules/rxjs/_esm5/internal/operators/concatAll.js");
/** PURE_IMPORTS_START _of,_operators_concatAll PURE_IMPORTS_END */


function concat() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    return Object(_operators_concatAll__WEBPACK_IMPORTED_MODULE_1__["concatAll"])()(_of__WEBPACK_IMPORTED_MODULE_0__["of"].apply(void 0, observables));
}
//# sourceMappingURL=concat.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/observable/defer.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/observable/defer.js ***!
  \***************************************************************/
/*! exports provided: defer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defer", function() { return defer; });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _from__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./from */ "../node_modules/rxjs/_esm5/internal/observable/from.js");
/* harmony import */ var _empty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./empty */ "../node_modules/rxjs/_esm5/internal/observable/empty.js");
/** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */



function defer(observableFactory) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"](function (subscriber) {
        var input;
        try {
            input = observableFactory();
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        var source = input ? Object(_from__WEBPACK_IMPORTED_MODULE_1__["from"])(input) : Object(_empty__WEBPACK_IMPORTED_MODULE_2__["empty"])();
        return source.subscribe(subscriber);
    });
}
//# sourceMappingURL=defer.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/observable/empty.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/observable/empty.js ***!
  \***************************************************************/
/*! exports provided: EMPTY, empty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EMPTY", function() { return EMPTY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "empty", function() { return empty; });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */

var EMPTY = /*@__PURE__*/ new _Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"](function (subscriber) { return subscriber.complete(); });
function empty(scheduler) {
    return scheduler ? emptyScheduled(scheduler) : EMPTY;
}
function emptyScheduled(scheduler) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"](function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
}
//# sourceMappingURL=empty.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/observable/from.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/observable/from.js ***!
  \**************************************************************/
/*! exports provided: from */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "from", function() { return from; });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _util_subscribeTo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/subscribeTo */ "../node_modules/rxjs/_esm5/internal/util/subscribeTo.js");
/* harmony import */ var _scheduled_scheduled__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scheduled/scheduled */ "../node_modules/rxjs/_esm5/internal/scheduled/scheduled.js");
/** PURE_IMPORTS_START _Observable,_util_subscribeTo,_scheduled_scheduled PURE_IMPORTS_END */



function from(input, scheduler) {
    if (!scheduler) {
        if (input instanceof _Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"]) {
            return input;
        }
        return new _Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"](Object(_util_subscribeTo__WEBPACK_IMPORTED_MODULE_1__["subscribeTo"])(input));
    }
    else {
        return Object(_scheduled_scheduled__WEBPACK_IMPORTED_MODULE_2__["scheduled"])(input, scheduler);
    }
}
//# sourceMappingURL=from.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/observable/fromArray.js":
/*!*******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/observable/fromArray.js ***!
  \*******************************************************************/
/*! exports provided: fromArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromArray", function() { return fromArray; });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _util_subscribeToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/subscribeToArray */ "../node_modules/rxjs/_esm5/internal/util/subscribeToArray.js");
/* harmony import */ var _scheduled_scheduleArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scheduled/scheduleArray */ "../node_modules/rxjs/_esm5/internal/scheduled/scheduleArray.js");
/** PURE_IMPORTS_START _Observable,_util_subscribeToArray,_scheduled_scheduleArray PURE_IMPORTS_END */



function fromArray(input, scheduler) {
    if (!scheduler) {
        return new _Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"](Object(_util_subscribeToArray__WEBPACK_IMPORTED_MODULE_1__["subscribeToArray"])(input));
    }
    else {
        return Object(_scheduled_scheduleArray__WEBPACK_IMPORTED_MODULE_2__["scheduleArray"])(input, scheduler);
    }
}
//# sourceMappingURL=fromArray.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/observable/merge.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/observable/merge.js ***!
  \***************************************************************/
/*! exports provided: merge */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "merge", function() { return merge; });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _util_isScheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/isScheduler */ "../node_modules/rxjs/_esm5/internal/util/isScheduler.js");
/* harmony import */ var _operators_mergeAll__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../operators/mergeAll */ "../node_modules/rxjs/_esm5/internal/operators/mergeAll.js");
/* harmony import */ var _fromArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fromArray */ "../node_modules/rxjs/_esm5/internal/observable/fromArray.js");
/** PURE_IMPORTS_START _Observable,_util_isScheduler,_operators_mergeAll,_fromArray PURE_IMPORTS_END */




function merge() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    var concurrent = Number.POSITIVE_INFINITY;
    var scheduler = null;
    var last = observables[observables.length - 1];
    if (Object(_util_isScheduler__WEBPACK_IMPORTED_MODULE_1__["isScheduler"])(last)) {
        scheduler = observables.pop();
        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
            concurrent = observables.pop();
        }
    }
    else if (typeof last === 'number') {
        concurrent = observables.pop();
    }
    if (scheduler === null && observables.length === 1 && observables[0] instanceof _Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"]) {
        return observables[0];
    }
    return Object(_operators_mergeAll__WEBPACK_IMPORTED_MODULE_2__["mergeAll"])(concurrent)(Object(_fromArray__WEBPACK_IMPORTED_MODULE_3__["fromArray"])(observables, scheduler));
}
//# sourceMappingURL=merge.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/observable/of.js":
/*!************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/observable/of.js ***!
  \************************************************************/
/*! exports provided: of */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "of", function() { return of; });
/* harmony import */ var _util_isScheduler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/isScheduler */ "../node_modules/rxjs/_esm5/internal/util/isScheduler.js");
/* harmony import */ var _fromArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fromArray */ "../node_modules/rxjs/_esm5/internal/observable/fromArray.js");
/* harmony import */ var _scheduled_scheduleArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scheduled/scheduleArray */ "../node_modules/rxjs/_esm5/internal/scheduled/scheduleArray.js");
/** PURE_IMPORTS_START _util_isScheduler,_fromArray,_scheduled_scheduleArray PURE_IMPORTS_END */



function of() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var scheduler = args[args.length - 1];
    if (Object(_util_isScheduler__WEBPACK_IMPORTED_MODULE_0__["isScheduler"])(scheduler)) {
        args.pop();
        return Object(_scheduled_scheduleArray__WEBPACK_IMPORTED_MODULE_2__["scheduleArray"])(args, scheduler);
    }
    else {
        return Object(_fromArray__WEBPACK_IMPORTED_MODULE_1__["fromArray"])(args);
    }
}
//# sourceMappingURL=of.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/observable/race.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/observable/race.js ***!
  \**************************************************************/
/*! exports provided: race, RaceOperator, RaceSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "race", function() { return race; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RaceOperator", function() { return RaceOperator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RaceSubscriber", function() { return RaceSubscriber; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _util_isArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/isArray */ "../node_modules/rxjs/_esm5/internal/util/isArray.js");
/* harmony import */ var _fromArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fromArray */ "../node_modules/rxjs/_esm5/internal/observable/fromArray.js");
/* harmony import */ var _OuterSubscriber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../OuterSubscriber */ "../node_modules/rxjs/_esm5/internal/OuterSubscriber.js");
/* harmony import */ var _util_subscribeToResult__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/subscribeToResult */ "../node_modules/rxjs/_esm5/internal/util/subscribeToResult.js");
/** PURE_IMPORTS_START tslib,_util_isArray,_fromArray,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */





function race() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    if (observables.length === 1) {
        if (Object(_util_isArray__WEBPACK_IMPORTED_MODULE_1__["isArray"])(observables[0])) {
            observables = observables[0];
        }
        else {
            return observables[0];
        }
    }
    return Object(_fromArray__WEBPACK_IMPORTED_MODULE_2__["fromArray"])(observables, undefined).lift(new RaceOperator());
}
var RaceOperator = /*@__PURE__*/ (function () {
    function RaceOperator() {
    }
    RaceOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RaceSubscriber(subscriber));
    };
    return RaceOperator;
}());

var RaceSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](RaceSubscriber, _super);
    function RaceSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.hasFirst = false;
        _this.observables = [];
        _this.subscriptions = [];
        return _this;
    }
    RaceSubscriber.prototype._next = function (observable) {
        this.observables.push(observable);
    };
    RaceSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            for (var i = 0; i < len && !this.hasFirst; i++) {
                var observable = observables[i];
                var subscription = Object(_util_subscribeToResult__WEBPACK_IMPORTED_MODULE_4__["subscribeToResult"])(this, observable, undefined, i);
                if (this.subscriptions) {
                    this.subscriptions.push(subscription);
                }
                this.add(subscription);
            }
            this.observables = null;
        }
    };
    RaceSubscriber.prototype.notifyNext = function (_outerValue, innerValue, outerIndex) {
        if (!this.hasFirst) {
            this.hasFirst = true;
            for (var i = 0; i < this.subscriptions.length; i++) {
                if (i !== outerIndex) {
                    var subscription = this.subscriptions[i];
                    subscription.unsubscribe();
                    this.remove(subscription);
                }
            }
            this.subscriptions = null;
        }
        this.destination.next(innerValue);
    };
    return RaceSubscriber;
}(_OuterSubscriber__WEBPACK_IMPORTED_MODULE_3__["OuterSubscriber"]));

//# sourceMappingURL=race.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/observable/throwError.js":
/*!********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/observable/throwError.js ***!
  \********************************************************************/
/*! exports provided: throwError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "throwError", function() { return throwError; });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */

function throwError(error, scheduler) {
    if (!scheduler) {
        return new _Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"](function (subscriber) { return subscriber.error(error); });
    }
    else {
        return new _Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"](function (subscriber) { return scheduler.schedule(dispatch, 0, { error: error, subscriber: subscriber }); });
    }
}
function dispatch(_a) {
    var error = _a.error, subscriber = _a.subscriber;
    subscriber.error(error);
}
//# sourceMappingURL=throwError.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/observable/timer.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/observable/timer.js ***!
  \***************************************************************/
/*! exports provided: timer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "timer", function() { return timer; });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scheduler/async */ "../node_modules/rxjs/_esm5/internal/scheduler/async.js");
/* harmony import */ var _util_isNumeric__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/isNumeric */ "../node_modules/rxjs/_esm5/internal/util/isNumeric.js");
/* harmony import */ var _util_isScheduler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/isScheduler */ "../node_modules/rxjs/_esm5/internal/util/isScheduler.js");
/** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */




function timer(dueTime, periodOrScheduler, scheduler) {
    if (dueTime === void 0) {
        dueTime = 0;
    }
    var period = -1;
    if (Object(_util_isNumeric__WEBPACK_IMPORTED_MODULE_2__["isNumeric"])(periodOrScheduler)) {
        period = Number(periodOrScheduler) < 1 && 1 || Number(periodOrScheduler);
    }
    else if (Object(_util_isScheduler__WEBPACK_IMPORTED_MODULE_3__["isScheduler"])(periodOrScheduler)) {
        scheduler = periodOrScheduler;
    }
    if (!Object(_util_isScheduler__WEBPACK_IMPORTED_MODULE_3__["isScheduler"])(scheduler)) {
        scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_1__["async"];
    }
    return new _Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"](function (subscriber) {
        var due = Object(_util_isNumeric__WEBPACK_IMPORTED_MODULE_2__["isNumeric"])(dueTime)
            ? dueTime
            : (+dueTime - scheduler.now());
        return scheduler.schedule(dispatch, due, {
            index: 0, period: period, subscriber: subscriber
        });
    });
}
function dispatch(state) {
    var index = state.index, period = state.period, subscriber = state.subscriber;
    subscriber.next(index);
    if (subscriber.closed) {
        return;
    }
    else if (period === -1) {
        return subscriber.complete();
    }
    state.index = index + 1;
    this.schedule(state, period);
}
//# sourceMappingURL=timer.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/observable/zip.js":
/*!*************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/observable/zip.js ***!
  \*************************************************************/
/*! exports provided: zip, ZipOperator, ZipSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zip", function() { return zip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ZipOperator", function() { return ZipOperator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ZipSubscriber", function() { return ZipSubscriber; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _fromArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fromArray */ "../node_modules/rxjs/_esm5/internal/observable/fromArray.js");
/* harmony import */ var _util_isArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/isArray */ "../node_modules/rxjs/_esm5/internal/util/isArray.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _internal_symbol_iterator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../internal/symbol/iterator */ "../node_modules/rxjs/_esm5/internal/symbol/iterator.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_fromArray,_util_isArray,_Subscriber,_.._internal_symbol_iterator,_innerSubscribe PURE_IMPORTS_END */






function zip() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    var resultSelector = observables[observables.length - 1];
    if (typeof resultSelector === 'function') {
        observables.pop();
    }
    return Object(_fromArray__WEBPACK_IMPORTED_MODULE_1__["fromArray"])(observables, undefined).lift(new ZipOperator(resultSelector));
}
var ZipOperator = /*@__PURE__*/ (function () {
    function ZipOperator(resultSelector) {
        this.resultSelector = resultSelector;
    }
    ZipOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ZipSubscriber(subscriber, this.resultSelector));
    };
    return ZipOperator;
}());

var ZipSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ZipSubscriber, _super);
    function ZipSubscriber(destination, resultSelector, values) {
        if (values === void 0) {
            values = Object.create(null);
        }
        var _this = _super.call(this, destination) || this;
        _this.resultSelector = resultSelector;
        _this.iterators = [];
        _this.active = 0;
        _this.resultSelector = (typeof resultSelector === 'function') ? resultSelector : undefined;
        return _this;
    }
    ZipSubscriber.prototype._next = function (value) {
        var iterators = this.iterators;
        if (Object(_util_isArray__WEBPACK_IMPORTED_MODULE_2__["isArray"])(value)) {
            iterators.push(new StaticArrayIterator(value));
        }
        else if (typeof value[_internal_symbol_iterator__WEBPACK_IMPORTED_MODULE_4__["iterator"]] === 'function') {
            iterators.push(new StaticIterator(value[_internal_symbol_iterator__WEBPACK_IMPORTED_MODULE_4__["iterator"]]()));
        }
        else {
            iterators.push(new ZipBufferIterator(this.destination, this, value));
        }
    };
    ZipSubscriber.prototype._complete = function () {
        var iterators = this.iterators;
        var len = iterators.length;
        this.unsubscribe();
        if (len === 0) {
            this.destination.complete();
            return;
        }
        this.active = len;
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            if (iterator.stillUnsubscribed) {
                var destination = this.destination;
                destination.add(iterator.subscribe());
            }
            else {
                this.active--;
            }
        }
    };
    ZipSubscriber.prototype.notifyInactive = function () {
        this.active--;
        if (this.active === 0) {
            this.destination.complete();
        }
    };
    ZipSubscriber.prototype.checkIterators = function () {
        var iterators = this.iterators;
        var len = iterators.length;
        var destination = this.destination;
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            if (typeof iterator.hasValue === 'function' && !iterator.hasValue()) {
                return;
            }
        }
        var shouldComplete = false;
        var args = [];
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            var result = iterator.next();
            if (iterator.hasCompleted()) {
                shouldComplete = true;
            }
            if (result.done) {
                destination.complete();
                return;
            }
            args.push(result.value);
        }
        if (this.resultSelector) {
            this._tryresultSelector(args);
        }
        else {
            destination.next(args);
        }
        if (shouldComplete) {
            destination.complete();
        }
    };
    ZipSubscriber.prototype._tryresultSelector = function (args) {
        var result;
        try {
            result = this.resultSelector.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return ZipSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_3__["Subscriber"]));

var StaticIterator = /*@__PURE__*/ (function () {
    function StaticIterator(iterator) {
        this.iterator = iterator;
        this.nextResult = iterator.next();
    }
    StaticIterator.prototype.hasValue = function () {
        return true;
    };
    StaticIterator.prototype.next = function () {
        var result = this.nextResult;
        this.nextResult = this.iterator.next();
        return result;
    };
    StaticIterator.prototype.hasCompleted = function () {
        var nextResult = this.nextResult;
        return Boolean(nextResult && nextResult.done);
    };
    return StaticIterator;
}());
var StaticArrayIterator = /*@__PURE__*/ (function () {
    function StaticArrayIterator(array) {
        this.array = array;
        this.index = 0;
        this.length = 0;
        this.length = array.length;
    }
    StaticArrayIterator.prototype[_internal_symbol_iterator__WEBPACK_IMPORTED_MODULE_4__["iterator"]] = function () {
        return this;
    };
    StaticArrayIterator.prototype.next = function (value) {
        var i = this.index++;
        var array = this.array;
        return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
    };
    StaticArrayIterator.prototype.hasValue = function () {
        return this.array.length > this.index;
    };
    StaticArrayIterator.prototype.hasCompleted = function () {
        return this.array.length === this.index;
    };
    return StaticArrayIterator;
}());
var ZipBufferIterator = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ZipBufferIterator, _super);
    function ZipBufferIterator(destination, parent, observable) {
        var _this = _super.call(this, destination) || this;
        _this.parent = parent;
        _this.observable = observable;
        _this.stillUnsubscribed = true;
        _this.buffer = [];
        _this.isComplete = false;
        return _this;
    }
    ZipBufferIterator.prototype[_internal_symbol_iterator__WEBPACK_IMPORTED_MODULE_4__["iterator"]] = function () {
        return this;
    };
    ZipBufferIterator.prototype.next = function () {
        var buffer = this.buffer;
        if (buffer.length === 0 && this.isComplete) {
            return { value: null, done: true };
        }
        else {
            return { value: buffer.shift(), done: false };
        }
    };
    ZipBufferIterator.prototype.hasValue = function () {
        return this.buffer.length > 0;
    };
    ZipBufferIterator.prototype.hasCompleted = function () {
        return this.buffer.length === 0 && this.isComplete;
    };
    ZipBufferIterator.prototype.notifyComplete = function () {
        if (this.buffer.length > 0) {
            this.isComplete = true;
            this.parent.notifyInactive();
        }
        else {
            this.destination.complete();
        }
    };
    ZipBufferIterator.prototype.notifyNext = function (innerValue) {
        this.buffer.push(innerValue);
        this.parent.checkIterators();
    };
    ZipBufferIterator.prototype.subscribe = function () {
        return Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_5__["innerSubscribe"])(this.observable, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_5__["SimpleInnerSubscriber"](this));
    };
    return ZipBufferIterator;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_5__["SimpleOuterSubscriber"]));
//# sourceMappingURL=zip.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/audit.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/audit.js ***!
  \**************************************************************/
/*! exports provided: audit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "audit", function() { return audit; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_innerSubscribe PURE_IMPORTS_END */


function audit(durationSelector) {
    return function auditOperatorFunction(source) {
        return source.lift(new AuditOperator(durationSelector));
    };
}
var AuditOperator = /*@__PURE__*/ (function () {
    function AuditOperator(durationSelector) {
        this.durationSelector = durationSelector;
    }
    AuditOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new AuditSubscriber(subscriber, this.durationSelector));
    };
    return AuditOperator;
}());
var AuditSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](AuditSubscriber, _super);
    function AuditSubscriber(destination, durationSelector) {
        var _this = _super.call(this, destination) || this;
        _this.durationSelector = durationSelector;
        _this.hasValue = false;
        return _this;
    }
    AuditSubscriber.prototype._next = function (value) {
        this.value = value;
        this.hasValue = true;
        if (!this.throttled) {
            var duration = void 0;
            try {
                var durationSelector = this.durationSelector;
                duration = durationSelector(value);
            }
            catch (err) {
                return this.destination.error(err);
            }
            var innerSubscription = Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["innerSubscribe"])(duration, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleInnerSubscriber"](this));
            if (!innerSubscription || innerSubscription.closed) {
                this.clearThrottle();
            }
            else {
                this.add(this.throttled = innerSubscription);
            }
        }
    };
    AuditSubscriber.prototype.clearThrottle = function () {
        var _a = this, value = _a.value, hasValue = _a.hasValue, throttled = _a.throttled;
        if (throttled) {
            this.remove(throttled);
            this.throttled = undefined;
            throttled.unsubscribe();
        }
        if (hasValue) {
            this.value = undefined;
            this.hasValue = false;
            this.destination.next(value);
        }
    };
    AuditSubscriber.prototype.notifyNext = function () {
        this.clearThrottle();
    };
    AuditSubscriber.prototype.notifyComplete = function () {
        this.clearThrottle();
    };
    return AuditSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleOuterSubscriber"]));
//# sourceMappingURL=audit.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/auditTime.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/auditTime.js ***!
  \******************************************************************/
/*! exports provided: auditTime */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "auditTime", function() { return auditTime; });
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scheduler/async */ "../node_modules/rxjs/_esm5/internal/scheduler/async.js");
/* harmony import */ var _audit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./audit */ "../node_modules/rxjs/_esm5/internal/operators/audit.js");
/* harmony import */ var _observable_timer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../observable/timer */ "../node_modules/rxjs/_esm5/internal/observable/timer.js");
/** PURE_IMPORTS_START _scheduler_async,_audit,_observable_timer PURE_IMPORTS_END */



function auditTime(duration, scheduler) {
    if (scheduler === void 0) {
        scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_0__["async"];
    }
    return Object(_audit__WEBPACK_IMPORTED_MODULE_1__["audit"])(function () { return Object(_observable_timer__WEBPACK_IMPORTED_MODULE_2__["timer"])(duration, scheduler); });
}
//# sourceMappingURL=auditTime.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/buffer.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/buffer.js ***!
  \***************************************************************/
/*! exports provided: buffer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buffer", function() { return buffer; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_innerSubscribe PURE_IMPORTS_END */


function buffer(closingNotifier) {
    return function bufferOperatorFunction(source) {
        return source.lift(new BufferOperator(closingNotifier));
    };
}
var BufferOperator = /*@__PURE__*/ (function () {
    function BufferOperator(closingNotifier) {
        this.closingNotifier = closingNotifier;
    }
    BufferOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new BufferSubscriber(subscriber, this.closingNotifier));
    };
    return BufferOperator;
}());
var BufferSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](BufferSubscriber, _super);
    function BufferSubscriber(destination, closingNotifier) {
        var _this = _super.call(this, destination) || this;
        _this.buffer = [];
        _this.add(Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["innerSubscribe"])(closingNotifier, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleInnerSubscriber"](_this)));
        return _this;
    }
    BufferSubscriber.prototype._next = function (value) {
        this.buffer.push(value);
    };
    BufferSubscriber.prototype.notifyNext = function () {
        var buffer = this.buffer;
        this.buffer = [];
        this.destination.next(buffer);
    };
    return BufferSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleOuterSubscriber"]));
//# sourceMappingURL=buffer.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/bufferCount.js":
/*!********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/bufferCount.js ***!
  \********************************************************************/
/*! exports provided: bufferCount */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bufferCount", function() { return bufferCount; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function bufferCount(bufferSize, startBufferEvery) {
    if (startBufferEvery === void 0) {
        startBufferEvery = null;
    }
    return function bufferCountOperatorFunction(source) {
        return source.lift(new BufferCountOperator(bufferSize, startBufferEvery));
    };
}
var BufferCountOperator = /*@__PURE__*/ (function () {
    function BufferCountOperator(bufferSize, startBufferEvery) {
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        if (!startBufferEvery || bufferSize === startBufferEvery) {
            this.subscriberClass = BufferCountSubscriber;
        }
        else {
            this.subscriberClass = BufferSkipCountSubscriber;
        }
    }
    BufferCountOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new this.subscriberClass(subscriber, this.bufferSize, this.startBufferEvery));
    };
    return BufferCountOperator;
}());
var BufferCountSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](BufferCountSubscriber, _super);
    function BufferCountSubscriber(destination, bufferSize) {
        var _this = _super.call(this, destination) || this;
        _this.bufferSize = bufferSize;
        _this.buffer = [];
        return _this;
    }
    BufferCountSubscriber.prototype._next = function (value) {
        var buffer = this.buffer;
        buffer.push(value);
        if (buffer.length == this.bufferSize) {
            this.destination.next(buffer);
            this.buffer = [];
        }
    };
    BufferCountSubscriber.prototype._complete = function () {
        var buffer = this.buffer;
        if (buffer.length > 0) {
            this.destination.next(buffer);
        }
        _super.prototype._complete.call(this);
    };
    return BufferCountSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
var BufferSkipCountSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](BufferSkipCountSubscriber, _super);
    function BufferSkipCountSubscriber(destination, bufferSize, startBufferEvery) {
        var _this = _super.call(this, destination) || this;
        _this.bufferSize = bufferSize;
        _this.startBufferEvery = startBufferEvery;
        _this.buffers = [];
        _this.count = 0;
        return _this;
    }
    BufferSkipCountSubscriber.prototype._next = function (value) {
        var _a = this, bufferSize = _a.bufferSize, startBufferEvery = _a.startBufferEvery, buffers = _a.buffers, count = _a.count;
        this.count++;
        if (count % startBufferEvery === 0) {
            buffers.push([]);
        }
        for (var i = buffers.length; i--;) {
            var buffer = buffers[i];
            buffer.push(value);
            if (buffer.length === bufferSize) {
                buffers.splice(i, 1);
                this.destination.next(buffer);
            }
        }
    };
    BufferSkipCountSubscriber.prototype._complete = function () {
        var _a = this, buffers = _a.buffers, destination = _a.destination;
        while (buffers.length > 0) {
            var buffer = buffers.shift();
            if (buffer.length > 0) {
                destination.next(buffer);
            }
        }
        _super.prototype._complete.call(this);
    };
    return BufferSkipCountSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=bufferCount.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/bufferTime.js":
/*!*******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/bufferTime.js ***!
  \*******************************************************************/
/*! exports provided: bufferTime */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bufferTime", function() { return bufferTime; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scheduler/async */ "../node_modules/rxjs/_esm5/internal/scheduler/async.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _util_isScheduler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/isScheduler */ "../node_modules/rxjs/_esm5/internal/util/isScheduler.js");
/** PURE_IMPORTS_START tslib,_scheduler_async,_Subscriber,_util_isScheduler PURE_IMPORTS_END */




function bufferTime(bufferTimeSpan) {
    var length = arguments.length;
    var scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_1__["async"];
    if (Object(_util_isScheduler__WEBPACK_IMPORTED_MODULE_3__["isScheduler"])(arguments[arguments.length - 1])) {
        scheduler = arguments[arguments.length - 1];
        length--;
    }
    var bufferCreationInterval = null;
    if (length >= 2) {
        bufferCreationInterval = arguments[1];
    }
    var maxBufferSize = Number.POSITIVE_INFINITY;
    if (length >= 3) {
        maxBufferSize = arguments[2];
    }
    return function bufferTimeOperatorFunction(source) {
        return source.lift(new BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler));
    };
}
var BufferTimeOperator = /*@__PURE__*/ (function () {
    function BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
        this.bufferTimeSpan = bufferTimeSpan;
        this.bufferCreationInterval = bufferCreationInterval;
        this.maxBufferSize = maxBufferSize;
        this.scheduler = scheduler;
    }
    BufferTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new BufferTimeSubscriber(subscriber, this.bufferTimeSpan, this.bufferCreationInterval, this.maxBufferSize, this.scheduler));
    };
    return BufferTimeOperator;
}());
var Context = /*@__PURE__*/ (function () {
    function Context() {
        this.buffer = [];
    }
    return Context;
}());
var BufferTimeSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](BufferTimeSubscriber, _super);
    function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.bufferTimeSpan = bufferTimeSpan;
        _this.bufferCreationInterval = bufferCreationInterval;
        _this.maxBufferSize = maxBufferSize;
        _this.scheduler = scheduler;
        _this.contexts = [];
        var context = _this.openContext();
        _this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
        if (_this.timespanOnly) {
            var timeSpanOnlyState = { subscriber: _this, context: context, bufferTimeSpan: bufferTimeSpan };
            _this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        }
        else {
            var closeState = { subscriber: _this, context: context };
            var creationState = { bufferTimeSpan: bufferTimeSpan, bufferCreationInterval: bufferCreationInterval, subscriber: _this, scheduler: scheduler };
            _this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
            _this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
        }
        return _this;
    }
    BufferTimeSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        var len = contexts.length;
        var filledBufferContext;
        for (var i = 0; i < len; i++) {
            var context_1 = contexts[i];
            var buffer = context_1.buffer;
            buffer.push(value);
            if (buffer.length == this.maxBufferSize) {
                filledBufferContext = context_1;
            }
        }
        if (filledBufferContext) {
            this.onBufferFull(filledBufferContext);
        }
    };
    BufferTimeSubscriber.prototype._error = function (err) {
        this.contexts.length = 0;
        _super.prototype._error.call(this, err);
    };
    BufferTimeSubscriber.prototype._complete = function () {
        var _a = this, contexts = _a.contexts, destination = _a.destination;
        while (contexts.length > 0) {
            var context_2 = contexts.shift();
            destination.next(context_2.buffer);
        }
        _super.prototype._complete.call(this);
    };
    BufferTimeSubscriber.prototype._unsubscribe = function () {
        this.contexts = null;
    };
    BufferTimeSubscriber.prototype.onBufferFull = function (context) {
        this.closeContext(context);
        var closeAction = context.closeAction;
        closeAction.unsubscribe();
        this.remove(closeAction);
        if (!this.closed && this.timespanOnly) {
            context = this.openContext();
            var bufferTimeSpan = this.bufferTimeSpan;
            var timeSpanOnlyState = { subscriber: this, context: context, bufferTimeSpan: bufferTimeSpan };
            this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        }
    };
    BufferTimeSubscriber.prototype.openContext = function () {
        var context = new Context();
        this.contexts.push(context);
        return context;
    };
    BufferTimeSubscriber.prototype.closeContext = function (context) {
        this.destination.next(context.buffer);
        var contexts = this.contexts;
        var spliceIndex = contexts ? contexts.indexOf(context) : -1;
        if (spliceIndex >= 0) {
            contexts.splice(contexts.indexOf(context), 1);
        }
    };
    return BufferTimeSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_2__["Subscriber"]));
function dispatchBufferTimeSpanOnly(state) {
    var subscriber = state.subscriber;
    var prevContext = state.context;
    if (prevContext) {
        subscriber.closeContext(prevContext);
    }
    if (!subscriber.closed) {
        state.context = subscriber.openContext();
        state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
    }
}
function dispatchBufferCreation(state) {
    var bufferCreationInterval = state.bufferCreationInterval, bufferTimeSpan = state.bufferTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler;
    var context = subscriber.openContext();
    var action = this;
    if (!subscriber.closed) {
        subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber: subscriber, context: context }));
        action.schedule(state, bufferCreationInterval);
    }
}
function dispatchBufferClose(arg) {
    var subscriber = arg.subscriber, context = arg.context;
    subscriber.closeContext(context);
}
//# sourceMappingURL=bufferTime.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/bufferToggle.js":
/*!*********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/bufferToggle.js ***!
  \*********************************************************************/
/*! exports provided: bufferToggle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bufferToggle", function() { return bufferToggle; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/* harmony import */ var _util_subscribeToResult__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/subscribeToResult */ "../node_modules/rxjs/_esm5/internal/util/subscribeToResult.js");
/* harmony import */ var _OuterSubscriber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../OuterSubscriber */ "../node_modules/rxjs/_esm5/internal/OuterSubscriber.js");
/** PURE_IMPORTS_START tslib,_Subscription,_util_subscribeToResult,_OuterSubscriber PURE_IMPORTS_END */




function bufferToggle(openings, closingSelector) {
    return function bufferToggleOperatorFunction(source) {
        return source.lift(new BufferToggleOperator(openings, closingSelector));
    };
}
var BufferToggleOperator = /*@__PURE__*/ (function () {
    function BufferToggleOperator(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    BufferToggleOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new BufferToggleSubscriber(subscriber, this.openings, this.closingSelector));
    };
    return BufferToggleOperator;
}());
var BufferToggleSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](BufferToggleSubscriber, _super);
    function BufferToggleSubscriber(destination, openings, closingSelector) {
        var _this = _super.call(this, destination) || this;
        _this.closingSelector = closingSelector;
        _this.contexts = [];
        _this.add(Object(_util_subscribeToResult__WEBPACK_IMPORTED_MODULE_2__["subscribeToResult"])(_this, openings));
        return _this;
    }
    BufferToggleSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        var len = contexts.length;
        for (var i = 0; i < len; i++) {
            contexts[i].buffer.push(value);
        }
    };
    BufferToggleSubscriber.prototype._error = function (err) {
        var contexts = this.contexts;
        while (contexts.length > 0) {
            var context_1 = contexts.shift();
            context_1.subscription.unsubscribe();
            context_1.buffer = null;
            context_1.subscription = null;
        }
        this.contexts = null;
        _super.prototype._error.call(this, err);
    };
    BufferToggleSubscriber.prototype._complete = function () {
        var contexts = this.contexts;
        while (contexts.length > 0) {
            var context_2 = contexts.shift();
            this.destination.next(context_2.buffer);
            context_2.subscription.unsubscribe();
            context_2.buffer = null;
            context_2.subscription = null;
        }
        this.contexts = null;
        _super.prototype._complete.call(this);
    };
    BufferToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue) {
        outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
    };
    BufferToggleSubscriber.prototype.notifyComplete = function (innerSub) {
        this.closeBuffer(innerSub.context);
    };
    BufferToggleSubscriber.prototype.openBuffer = function (value) {
        try {
            var closingSelector = this.closingSelector;
            var closingNotifier = closingSelector.call(this, value);
            if (closingNotifier) {
                this.trySubscribe(closingNotifier);
            }
        }
        catch (err) {
            this._error(err);
        }
    };
    BufferToggleSubscriber.prototype.closeBuffer = function (context) {
        var contexts = this.contexts;
        if (contexts && context) {
            var buffer = context.buffer, subscription = context.subscription;
            this.destination.next(buffer);
            contexts.splice(contexts.indexOf(context), 1);
            this.remove(subscription);
            subscription.unsubscribe();
        }
    };
    BufferToggleSubscriber.prototype.trySubscribe = function (closingNotifier) {
        var contexts = this.contexts;
        var buffer = [];
        var subscription = new _Subscription__WEBPACK_IMPORTED_MODULE_1__["Subscription"]();
        var context = { buffer: buffer, subscription: subscription };
        contexts.push(context);
        var innerSubscription = Object(_util_subscribeToResult__WEBPACK_IMPORTED_MODULE_2__["subscribeToResult"])(this, closingNotifier, context);
        if (!innerSubscription || innerSubscription.closed) {
            this.closeBuffer(context);
        }
        else {
            innerSubscription.context = context;
            this.add(innerSubscription);
            subscription.add(innerSubscription);
        }
    };
    return BufferToggleSubscriber;
}(_OuterSubscriber__WEBPACK_IMPORTED_MODULE_3__["OuterSubscriber"]));
//# sourceMappingURL=bufferToggle.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/bufferWhen.js":
/*!*******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/bufferWhen.js ***!
  \*******************************************************************/
/*! exports provided: bufferWhen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bufferWhen", function() { return bufferWhen; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_Subscription,_innerSubscribe PURE_IMPORTS_END */



function bufferWhen(closingSelector) {
    return function (source) {
        return source.lift(new BufferWhenOperator(closingSelector));
    };
}
var BufferWhenOperator = /*@__PURE__*/ (function () {
    function BufferWhenOperator(closingSelector) {
        this.closingSelector = closingSelector;
    }
    BufferWhenOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new BufferWhenSubscriber(subscriber, this.closingSelector));
    };
    return BufferWhenOperator;
}());
var BufferWhenSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](BufferWhenSubscriber, _super);
    function BufferWhenSubscriber(destination, closingSelector) {
        var _this = _super.call(this, destination) || this;
        _this.closingSelector = closingSelector;
        _this.subscribing = false;
        _this.openBuffer();
        return _this;
    }
    BufferWhenSubscriber.prototype._next = function (value) {
        this.buffer.push(value);
    };
    BufferWhenSubscriber.prototype._complete = function () {
        var buffer = this.buffer;
        if (buffer) {
            this.destination.next(buffer);
        }
        _super.prototype._complete.call(this);
    };
    BufferWhenSubscriber.prototype._unsubscribe = function () {
        this.buffer = undefined;
        this.subscribing = false;
    };
    BufferWhenSubscriber.prototype.notifyNext = function () {
        this.openBuffer();
    };
    BufferWhenSubscriber.prototype.notifyComplete = function () {
        if (this.subscribing) {
            this.complete();
        }
        else {
            this.openBuffer();
        }
    };
    BufferWhenSubscriber.prototype.openBuffer = function () {
        var closingSubscription = this.closingSubscription;
        if (closingSubscription) {
            this.remove(closingSubscription);
            closingSubscription.unsubscribe();
        }
        var buffer = this.buffer;
        if (this.buffer) {
            this.destination.next(buffer);
        }
        this.buffer = [];
        var closingNotifier;
        try {
            var closingSelector = this.closingSelector;
            closingNotifier = closingSelector();
        }
        catch (err) {
            return this.error(err);
        }
        closingSubscription = new _Subscription__WEBPACK_IMPORTED_MODULE_1__["Subscription"]();
        this.closingSubscription = closingSubscription;
        this.add(closingSubscription);
        this.subscribing = true;
        closingSubscription.add(Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_2__["innerSubscribe"])(closingNotifier, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_2__["SimpleInnerSubscriber"](this)));
        this.subscribing = false;
    };
    return BufferWhenSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_2__["SimpleOuterSubscriber"]));
//# sourceMappingURL=bufferWhen.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/catchError.js":
/*!*******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/catchError.js ***!
  \*******************************************************************/
/*! exports provided: catchError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "catchError", function() { return catchError; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_innerSubscribe PURE_IMPORTS_END */


function catchError(selector) {
    return function catchErrorOperatorFunction(source) {
        var operator = new CatchOperator(selector);
        var caught = source.lift(operator);
        return (operator.caught = caught);
    };
}
var CatchOperator = /*@__PURE__*/ (function () {
    function CatchOperator(selector) {
        this.selector = selector;
    }
    CatchOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
    };
    return CatchOperator;
}());
var CatchSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](CatchSubscriber, _super);
    function CatchSubscriber(destination, selector, caught) {
        var _this = _super.call(this, destination) || this;
        _this.selector = selector;
        _this.caught = caught;
        return _this;
    }
    CatchSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var result = void 0;
            try {
                result = this.selector(err, this.caught);
            }
            catch (err2) {
                _super.prototype.error.call(this, err2);
                return;
            }
            this._unsubscribeAndRecycle();
            var innerSubscriber = new _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleInnerSubscriber"](this);
            this.add(innerSubscriber);
            var innerSubscription = Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["innerSubscribe"])(result, innerSubscriber);
            if (innerSubscription !== innerSubscriber) {
                this.add(innerSubscription);
            }
        }
    };
    return CatchSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleOuterSubscriber"]));
//# sourceMappingURL=catchError.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/combineAll.js":
/*!*******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/combineAll.js ***!
  \*******************************************************************/
/*! exports provided: combineAll */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "combineAll", function() { return combineAll; });
/* harmony import */ var _observable_combineLatest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observable/combineLatest */ "../node_modules/rxjs/_esm5/internal/observable/combineLatest.js");
/** PURE_IMPORTS_START _observable_combineLatest PURE_IMPORTS_END */

function combineAll(project) {
    return function (source) { return source.lift(new _observable_combineLatest__WEBPACK_IMPORTED_MODULE_0__["CombineLatestOperator"](project)); };
}
//# sourceMappingURL=combineAll.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/combineLatest.js":
/*!**********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/combineLatest.js ***!
  \**********************************************************************/
/*! exports provided: combineLatest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "combineLatest", function() { return combineLatest; });
/* harmony import */ var _util_isArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/isArray */ "../node_modules/rxjs/_esm5/internal/util/isArray.js");
/* harmony import */ var _observable_combineLatest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../observable/combineLatest */ "../node_modules/rxjs/_esm5/internal/observable/combineLatest.js");
/* harmony import */ var _observable_from__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../observable/from */ "../node_modules/rxjs/_esm5/internal/observable/from.js");
/** PURE_IMPORTS_START _util_isArray,_observable_combineLatest,_observable_from PURE_IMPORTS_END */



var none = {};
function combineLatest() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    var project = null;
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    if (observables.length === 1 && Object(_util_isArray__WEBPACK_IMPORTED_MODULE_0__["isArray"])(observables[0])) {
        observables = observables[0].slice();
    }
    return function (source) { return source.lift.call(Object(_observable_from__WEBPACK_IMPORTED_MODULE_2__["from"])([source].concat(observables)), new _observable_combineLatest__WEBPACK_IMPORTED_MODULE_1__["CombineLatestOperator"](project)); };
}
//# sourceMappingURL=combineLatest.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/concat.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/concat.js ***!
  \***************************************************************/
/*! exports provided: concat */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "concat", function() { return concat; });
/* harmony import */ var _observable_concat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observable/concat */ "../node_modules/rxjs/_esm5/internal/observable/concat.js");
/** PURE_IMPORTS_START _observable_concat PURE_IMPORTS_END */

function concat() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    return function (source) { return source.lift.call(_observable_concat__WEBPACK_IMPORTED_MODULE_0__["concat"].apply(void 0, [source].concat(observables))); };
}
//# sourceMappingURL=concat.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/concatAll.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/concatAll.js ***!
  \******************************************************************/
/*! exports provided: concatAll */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "concatAll", function() { return concatAll; });
/* harmony import */ var _mergeAll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mergeAll */ "../node_modules/rxjs/_esm5/internal/operators/mergeAll.js");
/** PURE_IMPORTS_START _mergeAll PURE_IMPORTS_END */

function concatAll() {
    return Object(_mergeAll__WEBPACK_IMPORTED_MODULE_0__["mergeAll"])(1);
}
//# sourceMappingURL=concatAll.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/concatMap.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/concatMap.js ***!
  \******************************************************************/
/*! exports provided: concatMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "concatMap", function() { return concatMap; });
/* harmony import */ var _mergeMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mergeMap */ "../node_modules/rxjs/_esm5/internal/operators/mergeMap.js");
/** PURE_IMPORTS_START _mergeMap PURE_IMPORTS_END */

function concatMap(project, resultSelector) {
    return Object(_mergeMap__WEBPACK_IMPORTED_MODULE_0__["mergeMap"])(project, resultSelector, 1);
}
//# sourceMappingURL=concatMap.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/concatMapTo.js":
/*!********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/concatMapTo.js ***!
  \********************************************************************/
/*! exports provided: concatMapTo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "concatMapTo", function() { return concatMapTo; });
/* harmony import */ var _concatMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./concatMap */ "../node_modules/rxjs/_esm5/internal/operators/concatMap.js");
/** PURE_IMPORTS_START _concatMap PURE_IMPORTS_END */

function concatMapTo(innerObservable, resultSelector) {
    return Object(_concatMap__WEBPACK_IMPORTED_MODULE_0__["concatMap"])(function () { return innerObservable; }, resultSelector);
}
//# sourceMappingURL=concatMapTo.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/count.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/count.js ***!
  \**************************************************************/
/*! exports provided: count */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "count", function() { return count; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function count(predicate) {
    return function (source) { return source.lift(new CountOperator(predicate, source)); };
}
var CountOperator = /*@__PURE__*/ (function () {
    function CountOperator(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    CountOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new CountSubscriber(subscriber, this.predicate, this.source));
    };
    return CountOperator;
}());
var CountSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](CountSubscriber, _super);
    function CountSubscriber(destination, predicate, source) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.source = source;
        _this.count = 0;
        _this.index = 0;
        return _this;
    }
    CountSubscriber.prototype._next = function (value) {
        if (this.predicate) {
            this._tryPredicate(value);
        }
        else {
            this.count++;
        }
    };
    CountSubscriber.prototype._tryPredicate = function (value) {
        var result;
        try {
            result = this.predicate(value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.count++;
        }
    };
    CountSubscriber.prototype._complete = function () {
        this.destination.next(this.count);
        this.destination.complete();
    };
    return CountSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=count.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/debounce.js":
/*!*****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/debounce.js ***!
  \*****************************************************************/
/*! exports provided: debounce */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return debounce; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_innerSubscribe PURE_IMPORTS_END */


function debounce(durationSelector) {
    return function (source) { return source.lift(new DebounceOperator(durationSelector)); };
}
var DebounceOperator = /*@__PURE__*/ (function () {
    function DebounceOperator(durationSelector) {
        this.durationSelector = durationSelector;
    }
    DebounceOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DebounceSubscriber(subscriber, this.durationSelector));
    };
    return DebounceOperator;
}());
var DebounceSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](DebounceSubscriber, _super);
    function DebounceSubscriber(destination, durationSelector) {
        var _this = _super.call(this, destination) || this;
        _this.durationSelector = durationSelector;
        _this.hasValue = false;
        return _this;
    }
    DebounceSubscriber.prototype._next = function (value) {
        try {
            var result = this.durationSelector.call(this, value);
            if (result) {
                this._tryNext(value, result);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    DebounceSubscriber.prototype._complete = function () {
        this.emitValue();
        this.destination.complete();
    };
    DebounceSubscriber.prototype._tryNext = function (value, duration) {
        var subscription = this.durationSubscription;
        this.value = value;
        this.hasValue = true;
        if (subscription) {
            subscription.unsubscribe();
            this.remove(subscription);
        }
        subscription = Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["innerSubscribe"])(duration, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleInnerSubscriber"](this));
        if (subscription && !subscription.closed) {
            this.add(this.durationSubscription = subscription);
        }
    };
    DebounceSubscriber.prototype.notifyNext = function () {
        this.emitValue();
    };
    DebounceSubscriber.prototype.notifyComplete = function () {
        this.emitValue();
    };
    DebounceSubscriber.prototype.emitValue = function () {
        if (this.hasValue) {
            var value = this.value;
            var subscription = this.durationSubscription;
            if (subscription) {
                this.durationSubscription = undefined;
                subscription.unsubscribe();
                this.remove(subscription);
            }
            this.value = undefined;
            this.hasValue = false;
            _super.prototype._next.call(this, value);
        }
    };
    return DebounceSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleOuterSubscriber"]));
//# sourceMappingURL=debounce.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/debounceTime.js":
/*!*********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/debounceTime.js ***!
  \*********************************************************************/
/*! exports provided: debounceTime */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debounceTime", function() { return debounceTime; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scheduler/async */ "../node_modules/rxjs/_esm5/internal/scheduler/async.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async PURE_IMPORTS_END */



function debounceTime(dueTime, scheduler) {
    if (scheduler === void 0) {
        scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_2__["async"];
    }
    return function (source) { return source.lift(new DebounceTimeOperator(dueTime, scheduler)); };
}
var DebounceTimeOperator = /*@__PURE__*/ (function () {
    function DebounceTimeOperator(dueTime, scheduler) {
        this.dueTime = dueTime;
        this.scheduler = scheduler;
    }
    DebounceTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
    };
    return DebounceTimeOperator;
}());
var DebounceTimeSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](DebounceTimeSubscriber, _super);
    function DebounceTimeSubscriber(destination, dueTime, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.dueTime = dueTime;
        _this.scheduler = scheduler;
        _this.debouncedSubscription = null;
        _this.lastValue = null;
        _this.hasValue = false;
        return _this;
    }
    DebounceTimeSubscriber.prototype._next = function (value) {
        this.clearDebounce();
        this.lastValue = value;
        this.hasValue = true;
        this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
    };
    DebounceTimeSubscriber.prototype._complete = function () {
        this.debouncedNext();
        this.destination.complete();
    };
    DebounceTimeSubscriber.prototype.debouncedNext = function () {
        this.clearDebounce();
        if (this.hasValue) {
            var lastValue = this.lastValue;
            this.lastValue = null;
            this.hasValue = false;
            this.destination.next(lastValue);
        }
    };
    DebounceTimeSubscriber.prototype.clearDebounce = function () {
        var debouncedSubscription = this.debouncedSubscription;
        if (debouncedSubscription !== null) {
            this.remove(debouncedSubscription);
            debouncedSubscription.unsubscribe();
            this.debouncedSubscription = null;
        }
    };
    return DebounceTimeSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
function dispatchNext(subscriber) {
    subscriber.debouncedNext();
}
//# sourceMappingURL=debounceTime.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/defaultIfEmpty.js":
/*!***********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/defaultIfEmpty.js ***!
  \***********************************************************************/
/*! exports provided: defaultIfEmpty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultIfEmpty", function() { return defaultIfEmpty; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function defaultIfEmpty(defaultValue) {
    if (defaultValue === void 0) {
        defaultValue = null;
    }
    return function (source) { return source.lift(new DefaultIfEmptyOperator(defaultValue)); };
}
var DefaultIfEmptyOperator = /*@__PURE__*/ (function () {
    function DefaultIfEmptyOperator(defaultValue) {
        this.defaultValue = defaultValue;
    }
    DefaultIfEmptyOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DefaultIfEmptySubscriber(subscriber, this.defaultValue));
    };
    return DefaultIfEmptyOperator;
}());
var DefaultIfEmptySubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](DefaultIfEmptySubscriber, _super);
    function DefaultIfEmptySubscriber(destination, defaultValue) {
        var _this = _super.call(this, destination) || this;
        _this.defaultValue = defaultValue;
        _this.isEmpty = true;
        return _this;
    }
    DefaultIfEmptySubscriber.prototype._next = function (value) {
        this.isEmpty = false;
        this.destination.next(value);
    };
    DefaultIfEmptySubscriber.prototype._complete = function () {
        if (this.isEmpty) {
            this.destination.next(this.defaultValue);
        }
        this.destination.complete();
    };
    return DefaultIfEmptySubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=defaultIfEmpty.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/delay.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/delay.js ***!
  \**************************************************************/
/*! exports provided: delay */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "delay", function() { return delay; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scheduler/async */ "../node_modules/rxjs/_esm5/internal/scheduler/async.js");
/* harmony import */ var _util_isDate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/isDate */ "../node_modules/rxjs/_esm5/internal/util/isDate.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _Notification__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Notification */ "../node_modules/rxjs/_esm5/internal/Notification.js");
/** PURE_IMPORTS_START tslib,_scheduler_async,_util_isDate,_Subscriber,_Notification PURE_IMPORTS_END */





function delay(delay, scheduler) {
    if (scheduler === void 0) {
        scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_1__["async"];
    }
    var absoluteDelay = Object(_util_isDate__WEBPACK_IMPORTED_MODULE_2__["isDate"])(delay);
    var delayFor = absoluteDelay ? (+delay - scheduler.now()) : Math.abs(delay);
    return function (source) { return source.lift(new DelayOperator(delayFor, scheduler)); };
}
var DelayOperator = /*@__PURE__*/ (function () {
    function DelayOperator(delay, scheduler) {
        this.delay = delay;
        this.scheduler = scheduler;
    }
    DelayOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DelaySubscriber(subscriber, this.delay, this.scheduler));
    };
    return DelayOperator;
}());
var DelaySubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](DelaySubscriber, _super);
    function DelaySubscriber(destination, delay, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.delay = delay;
        _this.scheduler = scheduler;
        _this.queue = [];
        _this.active = false;
        _this.errored = false;
        return _this;
    }
    DelaySubscriber.dispatch = function (state) {
        var source = state.source;
        var queue = source.queue;
        var scheduler = state.scheduler;
        var destination = state.destination;
        while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
            queue.shift().notification.observe(destination);
        }
        if (queue.length > 0) {
            var delay_1 = Math.max(0, queue[0].time - scheduler.now());
            this.schedule(state, delay_1);
        }
        else {
            this.unsubscribe();
            source.active = false;
        }
    };
    DelaySubscriber.prototype._schedule = function (scheduler) {
        this.active = true;
        var destination = this.destination;
        destination.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
            source: this, destination: this.destination, scheduler: scheduler
        }));
    };
    DelaySubscriber.prototype.scheduleNotification = function (notification) {
        if (this.errored === true) {
            return;
        }
        var scheduler = this.scheduler;
        var message = new DelayMessage(scheduler.now() + this.delay, notification);
        this.queue.push(message);
        if (this.active === false) {
            this._schedule(scheduler);
        }
    };
    DelaySubscriber.prototype._next = function (value) {
        this.scheduleNotification(_Notification__WEBPACK_IMPORTED_MODULE_4__["Notification"].createNext(value));
    };
    DelaySubscriber.prototype._error = function (err) {
        this.errored = true;
        this.queue = [];
        this.destination.error(err);
        this.unsubscribe();
    };
    DelaySubscriber.prototype._complete = function () {
        this.scheduleNotification(_Notification__WEBPACK_IMPORTED_MODULE_4__["Notification"].createComplete());
        this.unsubscribe();
    };
    return DelaySubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_3__["Subscriber"]));
var DelayMessage = /*@__PURE__*/ (function () {
    function DelayMessage(time, notification) {
        this.time = time;
        this.notification = notification;
    }
    return DelayMessage;
}());
//# sourceMappingURL=delay.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/delayWhen.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/delayWhen.js ***!
  \******************************************************************/
/*! exports provided: delayWhen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "delayWhen", function() { return delayWhen; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _OuterSubscriber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../OuterSubscriber */ "../node_modules/rxjs/_esm5/internal/OuterSubscriber.js");
/* harmony import */ var _util_subscribeToResult__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/subscribeToResult */ "../node_modules/rxjs/_esm5/internal/util/subscribeToResult.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_Observable,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */





function delayWhen(delayDurationSelector, subscriptionDelay) {
    if (subscriptionDelay) {
        return function (source) {
            return new SubscriptionDelayObservable(source, subscriptionDelay)
                .lift(new DelayWhenOperator(delayDurationSelector));
        };
    }
    return function (source) { return source.lift(new DelayWhenOperator(delayDurationSelector)); };
}
var DelayWhenOperator = /*@__PURE__*/ (function () {
    function DelayWhenOperator(delayDurationSelector) {
        this.delayDurationSelector = delayDurationSelector;
    }
    DelayWhenOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DelayWhenSubscriber(subscriber, this.delayDurationSelector));
    };
    return DelayWhenOperator;
}());
var DelayWhenSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](DelayWhenSubscriber, _super);
    function DelayWhenSubscriber(destination, delayDurationSelector) {
        var _this = _super.call(this, destination) || this;
        _this.delayDurationSelector = delayDurationSelector;
        _this.completed = false;
        _this.delayNotifierSubscriptions = [];
        _this.index = 0;
        return _this;
    }
    DelayWhenSubscriber.prototype.notifyNext = function (outerValue, _innerValue, _outerIndex, _innerIndex, innerSub) {
        this.destination.next(outerValue);
        this.removeSubscription(innerSub);
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
        var value = this.removeSubscription(innerSub);
        if (value) {
            this.destination.next(value);
        }
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype._next = function (value) {
        var index = this.index++;
        try {
            var delayNotifier = this.delayDurationSelector(value, index);
            if (delayNotifier) {
                this.tryDelay(delayNotifier, value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    DelayWhenSubscriber.prototype._complete = function () {
        this.completed = true;
        this.tryComplete();
        this.unsubscribe();
    };
    DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
        subscription.unsubscribe();
        var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
        if (subscriptionIdx !== -1) {
            this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
        }
        return subscription.outerValue;
    };
    DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
        var notifierSubscription = Object(_util_subscribeToResult__WEBPACK_IMPORTED_MODULE_4__["subscribeToResult"])(this, delayNotifier, value);
        if (notifierSubscription && !notifierSubscription.closed) {
            var destination = this.destination;
            destination.add(notifierSubscription);
            this.delayNotifierSubscriptions.push(notifierSubscription);
        }
    };
    DelayWhenSubscriber.prototype.tryComplete = function () {
        if (this.completed && this.delayNotifierSubscriptions.length === 0) {
            this.destination.complete();
        }
    };
    return DelayWhenSubscriber;
}(_OuterSubscriber__WEBPACK_IMPORTED_MODULE_3__["OuterSubscriber"]));
var SubscriptionDelayObservable = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SubscriptionDelayObservable, _super);
    function SubscriptionDelayObservable(source, subscriptionDelay) {
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.subscriptionDelay = subscriptionDelay;
        return _this;
    }
    SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
        this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
    };
    return SubscriptionDelayObservable;
}(_Observable__WEBPACK_IMPORTED_MODULE_2__["Observable"]));
var SubscriptionDelaySubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SubscriptionDelaySubscriber, _super);
    function SubscriptionDelaySubscriber(parent, source) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.source = source;
        _this.sourceSubscribed = false;
        return _this;
    }
    SubscriptionDelaySubscriber.prototype._next = function (unused) {
        this.subscribeToSource();
    };
    SubscriptionDelaySubscriber.prototype._error = function (err) {
        this.unsubscribe();
        this.parent.error(err);
    };
    SubscriptionDelaySubscriber.prototype._complete = function () {
        this.unsubscribe();
        this.subscribeToSource();
    };
    SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
        if (!this.sourceSubscribed) {
            this.sourceSubscribed = true;
            this.unsubscribe();
            this.source.subscribe(this.parent);
        }
    };
    return SubscriptionDelaySubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=delayWhen.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/dematerialize.js":
/*!**********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/dematerialize.js ***!
  \**********************************************************************/
/*! exports provided: dematerialize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dematerialize", function() { return dematerialize; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function dematerialize() {
    return function dematerializeOperatorFunction(source) {
        return source.lift(new DeMaterializeOperator());
    };
}
var DeMaterializeOperator = /*@__PURE__*/ (function () {
    function DeMaterializeOperator() {
    }
    DeMaterializeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DeMaterializeSubscriber(subscriber));
    };
    return DeMaterializeOperator;
}());
var DeMaterializeSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](DeMaterializeSubscriber, _super);
    function DeMaterializeSubscriber(destination) {
        return _super.call(this, destination) || this;
    }
    DeMaterializeSubscriber.prototype._next = function (value) {
        value.observe(this.destination);
    };
    return DeMaterializeSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=dematerialize.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/distinct.js":
/*!*****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/distinct.js ***!
  \*****************************************************************/
/*! exports provided: distinct, DistinctSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "distinct", function() { return distinct; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DistinctSubscriber", function() { return DistinctSubscriber; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_innerSubscribe PURE_IMPORTS_END */


function distinct(keySelector, flushes) {
    return function (source) { return source.lift(new DistinctOperator(keySelector, flushes)); };
}
var DistinctOperator = /*@__PURE__*/ (function () {
    function DistinctOperator(keySelector, flushes) {
        this.keySelector = keySelector;
        this.flushes = flushes;
    }
    DistinctOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DistinctSubscriber(subscriber, this.keySelector, this.flushes));
    };
    return DistinctOperator;
}());
var DistinctSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](DistinctSubscriber, _super);
    function DistinctSubscriber(destination, keySelector, flushes) {
        var _this = _super.call(this, destination) || this;
        _this.keySelector = keySelector;
        _this.values = new Set();
        if (flushes) {
            _this.add(Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["innerSubscribe"])(flushes, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleInnerSubscriber"](_this)));
        }
        return _this;
    }
    DistinctSubscriber.prototype.notifyNext = function () {
        this.values.clear();
    };
    DistinctSubscriber.prototype.notifyError = function (error) {
        this._error(error);
    };
    DistinctSubscriber.prototype._next = function (value) {
        if (this.keySelector) {
            this._useKeySelector(value);
        }
        else {
            this._finalizeNext(value, value);
        }
    };
    DistinctSubscriber.prototype._useKeySelector = function (value) {
        var key;
        var destination = this.destination;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this._finalizeNext(key, value);
    };
    DistinctSubscriber.prototype._finalizeNext = function (key, value) {
        var values = this.values;
        if (!values.has(key)) {
            values.add(key);
            this.destination.next(value);
        }
    };
    return DistinctSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleOuterSubscriber"]));

//# sourceMappingURL=distinct.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/distinctUntilChanged.js":
/*!*****************************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/distinctUntilChanged.js ***!
  \*****************************************************************************/
/*! exports provided: distinctUntilChanged */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "distinctUntilChanged", function() { return distinctUntilChanged; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function distinctUntilChanged(compare, keySelector) {
    return function (source) { return source.lift(new DistinctUntilChangedOperator(compare, keySelector)); };
}
var DistinctUntilChangedOperator = /*@__PURE__*/ (function () {
    function DistinctUntilChangedOperator(compare, keySelector) {
        this.compare = compare;
        this.keySelector = keySelector;
    }
    DistinctUntilChangedOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
    };
    return DistinctUntilChangedOperator;
}());
var DistinctUntilChangedSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](DistinctUntilChangedSubscriber, _super);
    function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
        var _this = _super.call(this, destination) || this;
        _this.keySelector = keySelector;
        _this.hasKey = false;
        if (typeof compare === 'function') {
            _this.compare = compare;
        }
        return _this;
    }
    DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
        return x === y;
    };
    DistinctUntilChangedSubscriber.prototype._next = function (value) {
        var key;
        try {
            var keySelector = this.keySelector;
            key = keySelector ? keySelector(value) : value;
        }
        catch (err) {
            return this.destination.error(err);
        }
        var result = false;
        if (this.hasKey) {
            try {
                var compare = this.compare;
                result = compare(this.key, key);
            }
            catch (err) {
                return this.destination.error(err);
            }
        }
        else {
            this.hasKey = true;
        }
        if (!result) {
            this.key = key;
            this.destination.next(value);
        }
    };
    return DistinctUntilChangedSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=distinctUntilChanged.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/distinctUntilKeyChanged.js":
/*!********************************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/distinctUntilKeyChanged.js ***!
  \********************************************************************************/
/*! exports provided: distinctUntilKeyChanged */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "distinctUntilKeyChanged", function() { return distinctUntilKeyChanged; });
/* harmony import */ var _distinctUntilChanged__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./distinctUntilChanged */ "../node_modules/rxjs/_esm5/internal/operators/distinctUntilChanged.js");
/** PURE_IMPORTS_START _distinctUntilChanged PURE_IMPORTS_END */

function distinctUntilKeyChanged(key, compare) {
    return Object(_distinctUntilChanged__WEBPACK_IMPORTED_MODULE_0__["distinctUntilChanged"])(function (x, y) { return compare ? compare(x[key], y[key]) : x[key] === y[key]; });
}
//# sourceMappingURL=distinctUntilKeyChanged.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/elementAt.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/elementAt.js ***!
  \******************************************************************/
/*! exports provided: elementAt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "elementAt", function() { return elementAt; });
/* harmony import */ var _util_ArgumentOutOfRangeError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/ArgumentOutOfRangeError */ "../node_modules/rxjs/_esm5/internal/util/ArgumentOutOfRangeError.js");
/* harmony import */ var _filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filter */ "../node_modules/rxjs/_esm5/internal/operators/filter.js");
/* harmony import */ var _throwIfEmpty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./throwIfEmpty */ "../node_modules/rxjs/_esm5/internal/operators/throwIfEmpty.js");
/* harmony import */ var _defaultIfEmpty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./defaultIfEmpty */ "../node_modules/rxjs/_esm5/internal/operators/defaultIfEmpty.js");
/* harmony import */ var _take__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./take */ "../node_modules/rxjs/_esm5/internal/operators/take.js");
/** PURE_IMPORTS_START _util_ArgumentOutOfRangeError,_filter,_throwIfEmpty,_defaultIfEmpty,_take PURE_IMPORTS_END */





function elementAt(index, defaultValue) {
    if (index < 0) {
        throw new _util_ArgumentOutOfRangeError__WEBPACK_IMPORTED_MODULE_0__["ArgumentOutOfRangeError"]();
    }
    var hasDefaultValue = arguments.length >= 2;
    return function (source) {
        return source.pipe(Object(_filter__WEBPACK_IMPORTED_MODULE_1__["filter"])(function (v, i) { return i === index; }), Object(_take__WEBPACK_IMPORTED_MODULE_4__["take"])(1), hasDefaultValue
            ? Object(_defaultIfEmpty__WEBPACK_IMPORTED_MODULE_3__["defaultIfEmpty"])(defaultValue)
            : Object(_throwIfEmpty__WEBPACK_IMPORTED_MODULE_2__["throwIfEmpty"])(function () { return new _util_ArgumentOutOfRangeError__WEBPACK_IMPORTED_MODULE_0__["ArgumentOutOfRangeError"](); }));
    };
}
//# sourceMappingURL=elementAt.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/endWith.js":
/*!****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/endWith.js ***!
  \****************************************************************/
/*! exports provided: endWith */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "endWith", function() { return endWith; });
/* harmony import */ var _observable_concat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observable/concat */ "../node_modules/rxjs/_esm5/internal/observable/concat.js");
/* harmony import */ var _observable_of__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../observable/of */ "../node_modules/rxjs/_esm5/internal/observable/of.js");
/** PURE_IMPORTS_START _observable_concat,_observable_of PURE_IMPORTS_END */


function endWith() {
    var array = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        array[_i] = arguments[_i];
    }
    return function (source) { return Object(_observable_concat__WEBPACK_IMPORTED_MODULE_0__["concat"])(source, _observable_of__WEBPACK_IMPORTED_MODULE_1__["of"].apply(void 0, array)); };
}
//# sourceMappingURL=endWith.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/every.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/every.js ***!
  \**************************************************************/
/*! exports provided: every */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "every", function() { return every; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function every(predicate, thisArg) {
    return function (source) { return source.lift(new EveryOperator(predicate, thisArg, source)); };
}
var EveryOperator = /*@__PURE__*/ (function () {
    function EveryOperator(predicate, thisArg, source) {
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.source = source;
    }
    EveryOperator.prototype.call = function (observer, source) {
        return source.subscribe(new EverySubscriber(observer, this.predicate, this.thisArg, this.source));
    };
    return EveryOperator;
}());
var EverySubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](EverySubscriber, _super);
    function EverySubscriber(destination, predicate, thisArg, source) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.thisArg = thisArg;
        _this.source = source;
        _this.index = 0;
        _this.thisArg = thisArg || _this;
        return _this;
    }
    EverySubscriber.prototype.notifyComplete = function (everyValueMatch) {
        this.destination.next(everyValueMatch);
        this.destination.complete();
    };
    EverySubscriber.prototype._next = function (value) {
        var result = false;
        try {
            result = this.predicate.call(this.thisArg, value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (!result) {
            this.notifyComplete(false);
        }
    };
    EverySubscriber.prototype._complete = function () {
        this.notifyComplete(true);
    };
    return EverySubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=every.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/exhaust.js":
/*!****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/exhaust.js ***!
  \****************************************************************/
/*! exports provided: exhaust */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exhaust", function() { return exhaust; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_innerSubscribe PURE_IMPORTS_END */


function exhaust() {
    return function (source) { return source.lift(new SwitchFirstOperator()); };
}
var SwitchFirstOperator = /*@__PURE__*/ (function () {
    function SwitchFirstOperator() {
    }
    SwitchFirstOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SwitchFirstSubscriber(subscriber));
    };
    return SwitchFirstOperator;
}());
var SwitchFirstSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SwitchFirstSubscriber, _super);
    function SwitchFirstSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.hasCompleted = false;
        _this.hasSubscription = false;
        return _this;
    }
    SwitchFirstSubscriber.prototype._next = function (value) {
        if (!this.hasSubscription) {
            this.hasSubscription = true;
            this.add(Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["innerSubscribe"])(value, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleInnerSubscriber"](this)));
        }
    };
    SwitchFirstSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
            this.destination.complete();
        }
    };
    SwitchFirstSubscriber.prototype.notifyComplete = function () {
        this.hasSubscription = false;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    };
    return SwitchFirstSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleOuterSubscriber"]));
//# sourceMappingURL=exhaust.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/exhaustMap.js":
/*!*******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/exhaustMap.js ***!
  \*******************************************************************/
/*! exports provided: exhaustMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exhaustMap", function() { return exhaustMap; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./map */ "../node_modules/rxjs/_esm5/internal/operators/map.js");
/* harmony import */ var _observable_from__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../observable/from */ "../node_modules/rxjs/_esm5/internal/observable/from.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_map,_observable_from,_innerSubscribe PURE_IMPORTS_END */




function exhaustMap(project, resultSelector) {
    if (resultSelector) {
        return function (source) { return source.pipe(exhaustMap(function (a, i) { return Object(_observable_from__WEBPACK_IMPORTED_MODULE_2__["from"])(project(a, i)).pipe(Object(_map__WEBPACK_IMPORTED_MODULE_1__["map"])(function (b, ii) { return resultSelector(a, b, i, ii); })); })); };
    }
    return function (source) {
        return source.lift(new ExhaustMapOperator(project));
    };
}
var ExhaustMapOperator = /*@__PURE__*/ (function () {
    function ExhaustMapOperator(project) {
        this.project = project;
    }
    ExhaustMapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ExhaustMapSubscriber(subscriber, this.project));
    };
    return ExhaustMapOperator;
}());
var ExhaustMapSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ExhaustMapSubscriber, _super);
    function ExhaustMapSubscriber(destination, project) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.hasSubscription = false;
        _this.hasCompleted = false;
        _this.index = 0;
        return _this;
    }
    ExhaustMapSubscriber.prototype._next = function (value) {
        if (!this.hasSubscription) {
            this.tryNext(value);
        }
    };
    ExhaustMapSubscriber.prototype.tryNext = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.hasSubscription = true;
        this._innerSub(result);
    };
    ExhaustMapSubscriber.prototype._innerSub = function (result) {
        var innerSubscriber = new _innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["SimpleInnerSubscriber"](this);
        var destination = this.destination;
        destination.add(innerSubscriber);
        var innerSubscription = Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["innerSubscribe"])(result, innerSubscriber);
        if (innerSubscription !== innerSubscriber) {
            destination.add(innerSubscription);
        }
    };
    ExhaustMapSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
            this.destination.complete();
        }
        this.unsubscribe();
    };
    ExhaustMapSubscriber.prototype.notifyNext = function (innerValue) {
        this.destination.next(innerValue);
    };
    ExhaustMapSubscriber.prototype.notifyError = function (err) {
        this.destination.error(err);
    };
    ExhaustMapSubscriber.prototype.notifyComplete = function () {
        this.hasSubscription = false;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    };
    return ExhaustMapSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["SimpleOuterSubscriber"]));
//# sourceMappingURL=exhaustMap.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/expand.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/expand.js ***!
  \***************************************************************/
/*! exports provided: expand, ExpandOperator, ExpandSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "expand", function() { return expand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExpandOperator", function() { return ExpandOperator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExpandSubscriber", function() { return ExpandSubscriber; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_innerSubscribe PURE_IMPORTS_END */


function expand(project, concurrent, scheduler) {
    if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
    }
    concurrent = (concurrent || 0) < 1 ? Number.POSITIVE_INFINITY : concurrent;
    return function (source) { return source.lift(new ExpandOperator(project, concurrent, scheduler)); };
}
var ExpandOperator = /*@__PURE__*/ (function () {
    function ExpandOperator(project, concurrent, scheduler) {
        this.project = project;
        this.concurrent = concurrent;
        this.scheduler = scheduler;
    }
    ExpandOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ExpandSubscriber(subscriber, this.project, this.concurrent, this.scheduler));
    };
    return ExpandOperator;
}());

var ExpandSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ExpandSubscriber, _super);
    function ExpandSubscriber(destination, project, concurrent, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.concurrent = concurrent;
        _this.scheduler = scheduler;
        _this.index = 0;
        _this.active = 0;
        _this.hasCompleted = false;
        if (concurrent < Number.POSITIVE_INFINITY) {
            _this.buffer = [];
        }
        return _this;
    }
    ExpandSubscriber.dispatch = function (arg) {
        var subscriber = arg.subscriber, result = arg.result, value = arg.value, index = arg.index;
        subscriber.subscribeToProjection(result, value, index);
    };
    ExpandSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        if (destination.closed) {
            this._complete();
            return;
        }
        var index = this.index++;
        if (this.active < this.concurrent) {
            destination.next(value);
            try {
                var project = this.project;
                var result = project(value, index);
                if (!this.scheduler) {
                    this.subscribeToProjection(result, value, index);
                }
                else {
                    var state = { subscriber: this, result: result, value: value, index: index };
                    var destination_1 = this.destination;
                    destination_1.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
                }
            }
            catch (e) {
                destination.error(e);
            }
        }
        else {
            this.buffer.push(value);
        }
    };
    ExpandSubscriber.prototype.subscribeToProjection = function (result, value, index) {
        this.active++;
        var destination = this.destination;
        destination.add(Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["innerSubscribe"])(result, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleInnerSubscriber"](this)));
    };
    ExpandSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
        this.unsubscribe();
    };
    ExpandSubscriber.prototype.notifyNext = function (innerValue) {
        this._next(innerValue);
    };
    ExpandSubscriber.prototype.notifyComplete = function () {
        var buffer = this.buffer;
        this.active--;
        if (buffer && buffer.length > 0) {
            this._next(buffer.shift());
        }
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
    };
    return ExpandSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleOuterSubscriber"]));

//# sourceMappingURL=expand.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/filter.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/filter.js ***!
  \***************************************************************/
/*! exports provided: filter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filter", function() { return filter; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function filter(predicate, thisArg) {
    return function filterOperatorFunction(source) {
        return source.lift(new FilterOperator(predicate, thisArg));
    };
}
var FilterOperator = /*@__PURE__*/ (function () {
    function FilterOperator(predicate, thisArg) {
        this.predicate = predicate;
        this.thisArg = thisArg;
    }
    FilterOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
    };
    return FilterOperator;
}());
var FilterSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](FilterSubscriber, _super);
    function FilterSubscriber(destination, predicate, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.thisArg = thisArg;
        _this.count = 0;
        return _this;
    }
    FilterSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.predicate.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.destination.next(value);
        }
    };
    return FilterSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=filter.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/finalize.js":
/*!*****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/finalize.js ***!
  \*****************************************************************/
/*! exports provided: finalize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "finalize", function() { return finalize; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_Subscription PURE_IMPORTS_END */



function finalize(callback) {
    return function (source) { return source.lift(new FinallyOperator(callback)); };
}
var FinallyOperator = /*@__PURE__*/ (function () {
    function FinallyOperator(callback) {
        this.callback = callback;
    }
    FinallyOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new FinallySubscriber(subscriber, this.callback));
    };
    return FinallyOperator;
}());
var FinallySubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](FinallySubscriber, _super);
    function FinallySubscriber(destination, callback) {
        var _this = _super.call(this, destination) || this;
        _this.add(new _Subscription__WEBPACK_IMPORTED_MODULE_2__["Subscription"](callback));
        return _this;
    }
    return FinallySubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=finalize.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/find.js":
/*!*************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/find.js ***!
  \*************************************************************/
/*! exports provided: find, FindValueOperator, FindValueSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "find", function() { return find; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FindValueOperator", function() { return FindValueOperator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FindValueSubscriber", function() { return FindValueSubscriber; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function find(predicate, thisArg) {
    if (typeof predicate !== 'function') {
        throw new TypeError('predicate is not a function');
    }
    return function (source) { return source.lift(new FindValueOperator(predicate, source, false, thisArg)); };
}
var FindValueOperator = /*@__PURE__*/ (function () {
    function FindValueOperator(predicate, source, yieldIndex, thisArg) {
        this.predicate = predicate;
        this.source = source;
        this.yieldIndex = yieldIndex;
        this.thisArg = thisArg;
    }
    FindValueOperator.prototype.call = function (observer, source) {
        return source.subscribe(new FindValueSubscriber(observer, this.predicate, this.source, this.yieldIndex, this.thisArg));
    };
    return FindValueOperator;
}());

var FindValueSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](FindValueSubscriber, _super);
    function FindValueSubscriber(destination, predicate, source, yieldIndex, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.source = source;
        _this.yieldIndex = yieldIndex;
        _this.thisArg = thisArg;
        _this.index = 0;
        return _this;
    }
    FindValueSubscriber.prototype.notifyComplete = function (value) {
        var destination = this.destination;
        destination.next(value);
        destination.complete();
        this.unsubscribe();
    };
    FindValueSubscriber.prototype._next = function (value) {
        var _a = this, predicate = _a.predicate, thisArg = _a.thisArg;
        var index = this.index++;
        try {
            var result = predicate.call(thisArg || this, value, index, this.source);
            if (result) {
                this.notifyComplete(this.yieldIndex ? index : value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    FindValueSubscriber.prototype._complete = function () {
        this.notifyComplete(this.yieldIndex ? -1 : undefined);
    };
    return FindValueSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));

//# sourceMappingURL=find.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/findIndex.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/findIndex.js ***!
  \******************************************************************/
/*! exports provided: findIndex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findIndex", function() { return findIndex; });
/* harmony import */ var _operators_find__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../operators/find */ "../node_modules/rxjs/_esm5/internal/operators/find.js");
/** PURE_IMPORTS_START _operators_find PURE_IMPORTS_END */

function findIndex(predicate, thisArg) {
    return function (source) { return source.lift(new _operators_find__WEBPACK_IMPORTED_MODULE_0__["FindValueOperator"](predicate, source, true, thisArg)); };
}
//# sourceMappingURL=findIndex.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/first.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/first.js ***!
  \**************************************************************/
/*! exports provided: first */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "first", function() { return first; });
/* harmony import */ var _util_EmptyError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/EmptyError */ "../node_modules/rxjs/_esm5/internal/util/EmptyError.js");
/* harmony import */ var _filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filter */ "../node_modules/rxjs/_esm5/internal/operators/filter.js");
/* harmony import */ var _take__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./take */ "../node_modules/rxjs/_esm5/internal/operators/take.js");
/* harmony import */ var _defaultIfEmpty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./defaultIfEmpty */ "../node_modules/rxjs/_esm5/internal/operators/defaultIfEmpty.js");
/* harmony import */ var _throwIfEmpty__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./throwIfEmpty */ "../node_modules/rxjs/_esm5/internal/operators/throwIfEmpty.js");
/* harmony import */ var _util_identity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../util/identity */ "../node_modules/rxjs/_esm5/internal/util/identity.js");
/** PURE_IMPORTS_START _util_EmptyError,_filter,_take,_defaultIfEmpty,_throwIfEmpty,_util_identity PURE_IMPORTS_END */






function first(predicate, defaultValue) {
    var hasDefaultValue = arguments.length >= 2;
    return function (source) { return source.pipe(predicate ? Object(_filter__WEBPACK_IMPORTED_MODULE_1__["filter"])(function (v, i) { return predicate(v, i, source); }) : _util_identity__WEBPACK_IMPORTED_MODULE_5__["identity"], Object(_take__WEBPACK_IMPORTED_MODULE_2__["take"])(1), hasDefaultValue ? Object(_defaultIfEmpty__WEBPACK_IMPORTED_MODULE_3__["defaultIfEmpty"])(defaultValue) : Object(_throwIfEmpty__WEBPACK_IMPORTED_MODULE_4__["throwIfEmpty"])(function () { return new _util_EmptyError__WEBPACK_IMPORTED_MODULE_0__["EmptyError"](); })); };
}
//# sourceMappingURL=first.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/groupBy.js":
/*!****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/groupBy.js ***!
  \****************************************************************/
/*! exports provided: groupBy, GroupedObservable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "groupBy", function() { return groupBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupedObservable", function() { return GroupedObservable; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Subject */ "../node_modules/rxjs/_esm5/internal/Subject.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_Subscription,_Observable,_Subject PURE_IMPORTS_END */





function groupBy(keySelector, elementSelector, durationSelector, subjectSelector) {
    return function (source) {
        return source.lift(new GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector));
    };
}
var GroupByOperator = /*@__PURE__*/ (function () {
    function GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector) {
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
        this.subjectSelector = subjectSelector;
    }
    GroupByOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
    };
    return GroupByOperator;
}());
var GroupBySubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](GroupBySubscriber, _super);
    function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
        var _this = _super.call(this, destination) || this;
        _this.keySelector = keySelector;
        _this.elementSelector = elementSelector;
        _this.durationSelector = durationSelector;
        _this.subjectSelector = subjectSelector;
        _this.groups = null;
        _this.attemptedToUnsubscribe = false;
        _this.count = 0;
        return _this;
    }
    GroupBySubscriber.prototype._next = function (value) {
        var key;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            this.error(err);
            return;
        }
        this._group(value, key);
    };
    GroupBySubscriber.prototype._group = function (value, key) {
        var groups = this.groups;
        if (!groups) {
            groups = this.groups = new Map();
        }
        var group = groups.get(key);
        var element;
        if (this.elementSelector) {
            try {
                element = this.elementSelector(value);
            }
            catch (err) {
                this.error(err);
            }
        }
        else {
            element = value;
        }
        if (!group) {
            group = (this.subjectSelector ? this.subjectSelector() : new _Subject__WEBPACK_IMPORTED_MODULE_4__["Subject"]());
            groups.set(key, group);
            var groupedObservable = new GroupedObservable(key, group, this);
            this.destination.next(groupedObservable);
            if (this.durationSelector) {
                var duration = void 0;
                try {
                    duration = this.durationSelector(new GroupedObservable(key, group));
                }
                catch (err) {
                    this.error(err);
                    return;
                }
                this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
            }
        }
        if (!group.closed) {
            group.next(element);
        }
    };
    GroupBySubscriber.prototype._error = function (err) {
        var groups = this.groups;
        if (groups) {
            groups.forEach(function (group, key) {
                group.error(err);
            });
            groups.clear();
        }
        this.destination.error(err);
    };
    GroupBySubscriber.prototype._complete = function () {
        var groups = this.groups;
        if (groups) {
            groups.forEach(function (group, key) {
                group.complete();
            });
            groups.clear();
        }
        this.destination.complete();
    };
    GroupBySubscriber.prototype.removeGroup = function (key) {
        this.groups.delete(key);
    };
    GroupBySubscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.attemptedToUnsubscribe = true;
            if (this.count === 0) {
                _super.prototype.unsubscribe.call(this);
            }
        }
    };
    return GroupBySubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
var GroupDurationSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](GroupDurationSubscriber, _super);
    function GroupDurationSubscriber(key, group, parent) {
        var _this = _super.call(this, group) || this;
        _this.key = key;
        _this.group = group;
        _this.parent = parent;
        return _this;
    }
    GroupDurationSubscriber.prototype._next = function (value) {
        this.complete();
    };
    GroupDurationSubscriber.prototype._unsubscribe = function () {
        var _a = this, parent = _a.parent, key = _a.key;
        this.key = this.parent = null;
        if (parent) {
            parent.removeGroup(key);
        }
    };
    return GroupDurationSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
var GroupedObservable = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](GroupedObservable, _super);
    function GroupedObservable(key, groupSubject, refCountSubscription) {
        var _this = _super.call(this) || this;
        _this.key = key;
        _this.groupSubject = groupSubject;
        _this.refCountSubscription = refCountSubscription;
        return _this;
    }
    GroupedObservable.prototype._subscribe = function (subscriber) {
        var subscription = new _Subscription__WEBPACK_IMPORTED_MODULE_2__["Subscription"]();
        var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
        if (refCountSubscription && !refCountSubscription.closed) {
            subscription.add(new InnerRefCountSubscription(refCountSubscription));
        }
        subscription.add(groupSubject.subscribe(subscriber));
        return subscription;
    };
    return GroupedObservable;
}(_Observable__WEBPACK_IMPORTED_MODULE_3__["Observable"]));

var InnerRefCountSubscription = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](InnerRefCountSubscription, _super);
    function InnerRefCountSubscription(parent) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        parent.count++;
        return _this;
    }
    InnerRefCountSubscription.prototype.unsubscribe = function () {
        var parent = this.parent;
        if (!parent.closed && !this.closed) {
            _super.prototype.unsubscribe.call(this);
            parent.count -= 1;
            if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                parent.unsubscribe();
            }
        }
    };
    return InnerRefCountSubscription;
}(_Subscription__WEBPACK_IMPORTED_MODULE_2__["Subscription"]));
//# sourceMappingURL=groupBy.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/ignoreElements.js":
/*!***********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/ignoreElements.js ***!
  \***********************************************************************/
/*! exports provided: ignoreElements */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ignoreElements", function() { return ignoreElements; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function ignoreElements() {
    return function ignoreElementsOperatorFunction(source) {
        return source.lift(new IgnoreElementsOperator());
    };
}
var IgnoreElementsOperator = /*@__PURE__*/ (function () {
    function IgnoreElementsOperator() {
    }
    IgnoreElementsOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new IgnoreElementsSubscriber(subscriber));
    };
    return IgnoreElementsOperator;
}());
var IgnoreElementsSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](IgnoreElementsSubscriber, _super);
    function IgnoreElementsSubscriber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IgnoreElementsSubscriber.prototype._next = function (unused) {
    };
    return IgnoreElementsSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=ignoreElements.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/isEmpty.js":
/*!****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/isEmpty.js ***!
  \****************************************************************/
/*! exports provided: isEmpty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isEmpty", function() { return isEmpty; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function isEmpty() {
    return function (source) { return source.lift(new IsEmptyOperator()); };
}
var IsEmptyOperator = /*@__PURE__*/ (function () {
    function IsEmptyOperator() {
    }
    IsEmptyOperator.prototype.call = function (observer, source) {
        return source.subscribe(new IsEmptySubscriber(observer));
    };
    return IsEmptyOperator;
}());
var IsEmptySubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](IsEmptySubscriber, _super);
    function IsEmptySubscriber(destination) {
        return _super.call(this, destination) || this;
    }
    IsEmptySubscriber.prototype.notifyComplete = function (isEmpty) {
        var destination = this.destination;
        destination.next(isEmpty);
        destination.complete();
    };
    IsEmptySubscriber.prototype._next = function (value) {
        this.notifyComplete(false);
    };
    IsEmptySubscriber.prototype._complete = function () {
        this.notifyComplete(true);
    };
    return IsEmptySubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=isEmpty.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/last.js":
/*!*************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/last.js ***!
  \*************************************************************/
/*! exports provided: last */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "last", function() { return last; });
/* harmony import */ var _util_EmptyError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/EmptyError */ "../node_modules/rxjs/_esm5/internal/util/EmptyError.js");
/* harmony import */ var _filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filter */ "../node_modules/rxjs/_esm5/internal/operators/filter.js");
/* harmony import */ var _takeLast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./takeLast */ "../node_modules/rxjs/_esm5/internal/operators/takeLast.js");
/* harmony import */ var _throwIfEmpty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./throwIfEmpty */ "../node_modules/rxjs/_esm5/internal/operators/throwIfEmpty.js");
/* harmony import */ var _defaultIfEmpty__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./defaultIfEmpty */ "../node_modules/rxjs/_esm5/internal/operators/defaultIfEmpty.js");
/* harmony import */ var _util_identity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../util/identity */ "../node_modules/rxjs/_esm5/internal/util/identity.js");
/** PURE_IMPORTS_START _util_EmptyError,_filter,_takeLast,_throwIfEmpty,_defaultIfEmpty,_util_identity PURE_IMPORTS_END */






function last(predicate, defaultValue) {
    var hasDefaultValue = arguments.length >= 2;
    return function (source) { return source.pipe(predicate ? Object(_filter__WEBPACK_IMPORTED_MODULE_1__["filter"])(function (v, i) { return predicate(v, i, source); }) : _util_identity__WEBPACK_IMPORTED_MODULE_5__["identity"], Object(_takeLast__WEBPACK_IMPORTED_MODULE_2__["takeLast"])(1), hasDefaultValue ? Object(_defaultIfEmpty__WEBPACK_IMPORTED_MODULE_4__["defaultIfEmpty"])(defaultValue) : Object(_throwIfEmpty__WEBPACK_IMPORTED_MODULE_3__["throwIfEmpty"])(function () { return new _util_EmptyError__WEBPACK_IMPORTED_MODULE_0__["EmptyError"](); })); };
}
//# sourceMappingURL=last.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/map.js":
/*!************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/map.js ***!
  \************************************************************/
/*! exports provided: map, MapOperator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "map", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapOperator", function() { return MapOperator; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function map(project, thisArg) {
    return function mapOperation(source) {
        if (typeof project !== 'function') {
            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
        }
        return source.lift(new MapOperator(project, thisArg));
    };
}
var MapOperator = /*@__PURE__*/ (function () {
    function MapOperator(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
    }
    MapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
    };
    return MapOperator;
}());

var MapSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](MapSubscriber, _super);
    function MapSubscriber(destination, project, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.count = 0;
        _this.thisArg = thisArg || _this;
        return _this;
    }
    MapSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.project.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return MapSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=map.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/mapTo.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/mapTo.js ***!
  \**************************************************************/
/*! exports provided: mapTo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapTo", function() { return mapTo; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function mapTo(value) {
    return function (source) { return source.lift(new MapToOperator(value)); };
}
var MapToOperator = /*@__PURE__*/ (function () {
    function MapToOperator(value) {
        this.value = value;
    }
    MapToOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MapToSubscriber(subscriber, this.value));
    };
    return MapToOperator;
}());
var MapToSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](MapToSubscriber, _super);
    function MapToSubscriber(destination, value) {
        var _this = _super.call(this, destination) || this;
        _this.value = value;
        return _this;
    }
    MapToSubscriber.prototype._next = function (x) {
        this.destination.next(this.value);
    };
    return MapToSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=mapTo.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/materialize.js":
/*!********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/materialize.js ***!
  \********************************************************************/
/*! exports provided: materialize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "materialize", function() { return materialize; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _Notification__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Notification */ "../node_modules/rxjs/_esm5/internal/Notification.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */



function materialize() {
    return function materializeOperatorFunction(source) {
        return source.lift(new MaterializeOperator());
    };
}
var MaterializeOperator = /*@__PURE__*/ (function () {
    function MaterializeOperator() {
    }
    MaterializeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MaterializeSubscriber(subscriber));
    };
    return MaterializeOperator;
}());
var MaterializeSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](MaterializeSubscriber, _super);
    function MaterializeSubscriber(destination) {
        return _super.call(this, destination) || this;
    }
    MaterializeSubscriber.prototype._next = function (value) {
        this.destination.next(_Notification__WEBPACK_IMPORTED_MODULE_2__["Notification"].createNext(value));
    };
    MaterializeSubscriber.prototype._error = function (err) {
        var destination = this.destination;
        destination.next(_Notification__WEBPACK_IMPORTED_MODULE_2__["Notification"].createError(err));
        destination.complete();
    };
    MaterializeSubscriber.prototype._complete = function () {
        var destination = this.destination;
        destination.next(_Notification__WEBPACK_IMPORTED_MODULE_2__["Notification"].createComplete());
        destination.complete();
    };
    return MaterializeSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=materialize.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/max.js":
/*!************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/max.js ***!
  \************************************************************/
/*! exports provided: max */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "max", function() { return max; });
/* harmony import */ var _reduce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reduce */ "../node_modules/rxjs/_esm5/internal/operators/reduce.js");
/** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */

function max(comparer) {
    var max = (typeof comparer === 'function')
        ? function (x, y) { return comparer(x, y) > 0 ? x : y; }
        : function (x, y) { return x > y ? x : y; };
    return Object(_reduce__WEBPACK_IMPORTED_MODULE_0__["reduce"])(max);
}
//# sourceMappingURL=max.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/merge.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/merge.js ***!
  \**************************************************************/
/*! exports provided: merge */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "merge", function() { return merge; });
/* harmony import */ var _observable_merge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observable/merge */ "../node_modules/rxjs/_esm5/internal/observable/merge.js");
/** PURE_IMPORTS_START _observable_merge PURE_IMPORTS_END */

function merge() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    return function (source) { return source.lift.call(_observable_merge__WEBPACK_IMPORTED_MODULE_0__["merge"].apply(void 0, [source].concat(observables))); };
}
//# sourceMappingURL=merge.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/mergeAll.js":
/*!*****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/mergeAll.js ***!
  \*****************************************************************/
/*! exports provided: mergeAll */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeAll", function() { return mergeAll; });
/* harmony import */ var _mergeMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mergeMap */ "../node_modules/rxjs/_esm5/internal/operators/mergeMap.js");
/* harmony import */ var _util_identity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/identity */ "../node_modules/rxjs/_esm5/internal/util/identity.js");
/** PURE_IMPORTS_START _mergeMap,_util_identity PURE_IMPORTS_END */


function mergeAll(concurrent) {
    if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
    }
    return Object(_mergeMap__WEBPACK_IMPORTED_MODULE_0__["mergeMap"])(_util_identity__WEBPACK_IMPORTED_MODULE_1__["identity"], concurrent);
}
//# sourceMappingURL=mergeAll.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/mergeMap.js":
/*!*****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/mergeMap.js ***!
  \*****************************************************************/
/*! exports provided: mergeMap, MergeMapOperator, MergeMapSubscriber, flatMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeMap", function() { return mergeMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MergeMapOperator", function() { return MergeMapOperator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MergeMapSubscriber", function() { return MergeMapSubscriber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flatMap", function() { return flatMap; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./map */ "../node_modules/rxjs/_esm5/internal/operators/map.js");
/* harmony import */ var _observable_from__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../observable/from */ "../node_modules/rxjs/_esm5/internal/observable/from.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_map,_observable_from,_innerSubscribe PURE_IMPORTS_END */




function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
    }
    if (typeof resultSelector === 'function') {
        return function (source) { return source.pipe(mergeMap(function (a, i) { return Object(_observable_from__WEBPACK_IMPORTED_MODULE_2__["from"])(project(a, i)).pipe(Object(_map__WEBPACK_IMPORTED_MODULE_1__["map"])(function (b, ii) { return resultSelector(a, b, i, ii); })); }, concurrent)); };
    }
    else if (typeof resultSelector === 'number') {
        concurrent = resultSelector;
    }
    return function (source) { return source.lift(new MergeMapOperator(project, concurrent)); };
}
var MergeMapOperator = /*@__PURE__*/ (function () {
    function MergeMapOperator(project, concurrent) {
        if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
        }
        this.project = project;
        this.concurrent = concurrent;
    }
    MergeMapOperator.prototype.call = function (observer, source) {
        return source.subscribe(new MergeMapSubscriber(observer, this.project, this.concurrent));
    };
    return MergeMapOperator;
}());

var MergeMapSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](MergeMapSubscriber, _super);
    function MergeMapSubscriber(destination, project, concurrent) {
        if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
        }
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.concurrent = concurrent;
        _this.hasCompleted = false;
        _this.buffer = [];
        _this.active = 0;
        _this.index = 0;
        return _this;
    }
    MergeMapSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            this._tryNext(value);
        }
        else {
            this.buffer.push(value);
        }
    };
    MergeMapSubscriber.prototype._tryNext = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.active++;
        this._innerSub(result);
    };
    MergeMapSubscriber.prototype._innerSub = function (ish) {
        var innerSubscriber = new _innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["SimpleInnerSubscriber"](this);
        var destination = this.destination;
        destination.add(innerSubscriber);
        var innerSubscription = Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["innerSubscribe"])(ish, innerSubscriber);
        if (innerSubscription !== innerSubscriber) {
            destination.add(innerSubscription);
        }
    };
    MergeMapSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
        this.unsubscribe();
    };
    MergeMapSubscriber.prototype.notifyNext = function (innerValue) {
        this.destination.next(innerValue);
    };
    MergeMapSubscriber.prototype.notifyComplete = function () {
        var buffer = this.buffer;
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    };
    return MergeMapSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["SimpleOuterSubscriber"]));

var flatMap = mergeMap;
//# sourceMappingURL=mergeMap.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/mergeMapTo.js":
/*!*******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/mergeMapTo.js ***!
  \*******************************************************************/
/*! exports provided: mergeMapTo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeMapTo", function() { return mergeMapTo; });
/* harmony import */ var _mergeMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mergeMap */ "../node_modules/rxjs/_esm5/internal/operators/mergeMap.js");
/** PURE_IMPORTS_START _mergeMap PURE_IMPORTS_END */

function mergeMapTo(innerObservable, resultSelector, concurrent) {
    if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
    }
    if (typeof resultSelector === 'function') {
        return Object(_mergeMap__WEBPACK_IMPORTED_MODULE_0__["mergeMap"])(function () { return innerObservable; }, resultSelector, concurrent);
    }
    if (typeof resultSelector === 'number') {
        concurrent = resultSelector;
    }
    return Object(_mergeMap__WEBPACK_IMPORTED_MODULE_0__["mergeMap"])(function () { return innerObservable; }, concurrent);
}
//# sourceMappingURL=mergeMapTo.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/mergeScan.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/mergeScan.js ***!
  \******************************************************************/
/*! exports provided: mergeScan, MergeScanOperator, MergeScanSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeScan", function() { return mergeScan; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MergeScanOperator", function() { return MergeScanOperator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MergeScanSubscriber", function() { return MergeScanSubscriber; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_innerSubscribe PURE_IMPORTS_END */


function mergeScan(accumulator, seed, concurrent) {
    if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
    }
    return function (source) { return source.lift(new MergeScanOperator(accumulator, seed, concurrent)); };
}
var MergeScanOperator = /*@__PURE__*/ (function () {
    function MergeScanOperator(accumulator, seed, concurrent) {
        this.accumulator = accumulator;
        this.seed = seed;
        this.concurrent = concurrent;
    }
    MergeScanOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MergeScanSubscriber(subscriber, this.accumulator, this.seed, this.concurrent));
    };
    return MergeScanOperator;
}());

var MergeScanSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](MergeScanSubscriber, _super);
    function MergeScanSubscriber(destination, accumulator, acc, concurrent) {
        var _this = _super.call(this, destination) || this;
        _this.accumulator = accumulator;
        _this.acc = acc;
        _this.concurrent = concurrent;
        _this.hasValue = false;
        _this.hasCompleted = false;
        _this.buffer = [];
        _this.active = 0;
        _this.index = 0;
        return _this;
    }
    MergeScanSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            var index = this.index++;
            var destination = this.destination;
            var ish = void 0;
            try {
                var accumulator = this.accumulator;
                ish = accumulator(this.acc, value, index);
            }
            catch (e) {
                return destination.error(e);
            }
            this.active++;
            this._innerSub(ish);
        }
        else {
            this.buffer.push(value);
        }
    };
    MergeScanSubscriber.prototype._innerSub = function (ish) {
        var innerSubscriber = new _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleInnerSubscriber"](this);
        var destination = this.destination;
        destination.add(innerSubscriber);
        var innerSubscription = Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["innerSubscribe"])(ish, innerSubscriber);
        if (innerSubscription !== innerSubscriber) {
            destination.add(innerSubscription);
        }
    };
    MergeScanSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
        this.unsubscribe();
    };
    MergeScanSubscriber.prototype.notifyNext = function (innerValue) {
        var destination = this.destination;
        this.acc = innerValue;
        this.hasValue = true;
        destination.next(innerValue);
    };
    MergeScanSubscriber.prototype.notifyComplete = function () {
        var buffer = this.buffer;
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
    };
    return MergeScanSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleOuterSubscriber"]));

//# sourceMappingURL=mergeScan.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/min.js":
/*!************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/min.js ***!
  \************************************************************/
/*! exports provided: min */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "min", function() { return min; });
/* harmony import */ var _reduce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reduce */ "../node_modules/rxjs/_esm5/internal/operators/reduce.js");
/** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */

function min(comparer) {
    var min = (typeof comparer === 'function')
        ? function (x, y) { return comparer(x, y) < 0 ? x : y; }
        : function (x, y) { return x < y ? x : y; };
    return Object(_reduce__WEBPACK_IMPORTED_MODULE_0__["reduce"])(min);
}
//# sourceMappingURL=min.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/multicast.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/multicast.js ***!
  \******************************************************************/
/*! exports provided: multicast, MulticastOperator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multicast", function() { return multicast; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MulticastOperator", function() { return MulticastOperator; });
/* harmony import */ var _observable_ConnectableObservable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observable/ConnectableObservable */ "../node_modules/rxjs/_esm5/internal/observable/ConnectableObservable.js");
/** PURE_IMPORTS_START _observable_ConnectableObservable PURE_IMPORTS_END */

function multicast(subjectOrSubjectFactory, selector) {
    return function multicastOperatorFunction(source) {
        var subjectFactory;
        if (typeof subjectOrSubjectFactory === 'function') {
            subjectFactory = subjectOrSubjectFactory;
        }
        else {
            subjectFactory = function subjectFactory() {
                return subjectOrSubjectFactory;
            };
        }
        if (typeof selector === 'function') {
            return source.lift(new MulticastOperator(subjectFactory, selector));
        }
        var connectable = Object.create(source, _observable_ConnectableObservable__WEBPACK_IMPORTED_MODULE_0__["connectableObservableDescriptor"]);
        connectable.source = source;
        connectable.subjectFactory = subjectFactory;
        return connectable;
    };
}
var MulticastOperator = /*@__PURE__*/ (function () {
    function MulticastOperator(subjectFactory, selector) {
        this.subjectFactory = subjectFactory;
        this.selector = selector;
    }
    MulticastOperator.prototype.call = function (subscriber, source) {
        var selector = this.selector;
        var subject = this.subjectFactory();
        var subscription = selector(subject).subscribe(subscriber);
        subscription.add(source.subscribe(subject));
        return subscription;
    };
    return MulticastOperator;
}());

//# sourceMappingURL=multicast.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/observeOn.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/observeOn.js ***!
  \******************************************************************/
/*! exports provided: observeOn, ObserveOnOperator, ObserveOnSubscriber, ObserveOnMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "observeOn", function() { return observeOn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObserveOnOperator", function() { return ObserveOnOperator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObserveOnSubscriber", function() { return ObserveOnSubscriber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObserveOnMessage", function() { return ObserveOnMessage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _Notification__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Notification */ "../node_modules/rxjs/_esm5/internal/Notification.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */



function observeOn(scheduler, delay) {
    if (delay === void 0) {
        delay = 0;
    }
    return function observeOnOperatorFunction(source) {
        return source.lift(new ObserveOnOperator(scheduler, delay));
    };
}
var ObserveOnOperator = /*@__PURE__*/ (function () {
    function ObserveOnOperator(scheduler, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        this.scheduler = scheduler;
        this.delay = delay;
    }
    ObserveOnOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
    };
    return ObserveOnOperator;
}());

var ObserveOnSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ObserveOnSubscriber, _super);
    function ObserveOnSubscriber(destination, scheduler, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        var _this = _super.call(this, destination) || this;
        _this.scheduler = scheduler;
        _this.delay = delay;
        return _this;
    }
    ObserveOnSubscriber.dispatch = function (arg) {
        var notification = arg.notification, destination = arg.destination;
        notification.observe(destination);
        this.unsubscribe();
    };
    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
        var destination = this.destination;
        destination.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
    };
    ObserveOnSubscriber.prototype._next = function (value) {
        this.scheduleMessage(_Notification__WEBPACK_IMPORTED_MODULE_2__["Notification"].createNext(value));
    };
    ObserveOnSubscriber.prototype._error = function (err) {
        this.scheduleMessage(_Notification__WEBPACK_IMPORTED_MODULE_2__["Notification"].createError(err));
        this.unsubscribe();
    };
    ObserveOnSubscriber.prototype._complete = function () {
        this.scheduleMessage(_Notification__WEBPACK_IMPORTED_MODULE_2__["Notification"].createComplete());
        this.unsubscribe();
    };
    return ObserveOnSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));

var ObserveOnMessage = /*@__PURE__*/ (function () {
    function ObserveOnMessage(notification, destination) {
        this.notification = notification;
        this.destination = destination;
    }
    return ObserveOnMessage;
}());

//# sourceMappingURL=observeOn.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/onErrorResumeNext.js":
/*!**************************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/onErrorResumeNext.js ***!
  \**************************************************************************/
/*! exports provided: onErrorResumeNext, onErrorResumeNextStatic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onErrorResumeNext", function() { return onErrorResumeNext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onErrorResumeNextStatic", function() { return onErrorResumeNextStatic; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _observable_from__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../observable/from */ "../node_modules/rxjs/_esm5/internal/observable/from.js");
/* harmony import */ var _util_isArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/isArray */ "../node_modules/rxjs/_esm5/internal/util/isArray.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_observable_from,_util_isArray,_innerSubscribe PURE_IMPORTS_END */




function onErrorResumeNext() {
    var nextSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nextSources[_i] = arguments[_i];
    }
    if (nextSources.length === 1 && Object(_util_isArray__WEBPACK_IMPORTED_MODULE_2__["isArray"])(nextSources[0])) {
        nextSources = nextSources[0];
    }
    return function (source) { return source.lift(new OnErrorResumeNextOperator(nextSources)); };
}
function onErrorResumeNextStatic() {
    var nextSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nextSources[_i] = arguments[_i];
    }
    var source = undefined;
    if (nextSources.length === 1 && Object(_util_isArray__WEBPACK_IMPORTED_MODULE_2__["isArray"])(nextSources[0])) {
        nextSources = nextSources[0];
    }
    source = nextSources.shift();
    return Object(_observable_from__WEBPACK_IMPORTED_MODULE_1__["from"])(source).lift(new OnErrorResumeNextOperator(nextSources));
}
var OnErrorResumeNextOperator = /*@__PURE__*/ (function () {
    function OnErrorResumeNextOperator(nextSources) {
        this.nextSources = nextSources;
    }
    OnErrorResumeNextOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new OnErrorResumeNextSubscriber(subscriber, this.nextSources));
    };
    return OnErrorResumeNextOperator;
}());
var OnErrorResumeNextSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](OnErrorResumeNextSubscriber, _super);
    function OnErrorResumeNextSubscriber(destination, nextSources) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.nextSources = nextSources;
        return _this;
    }
    OnErrorResumeNextSubscriber.prototype.notifyError = function () {
        this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype.notifyComplete = function () {
        this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype._error = function (err) {
        this.subscribeToNextSource();
        this.unsubscribe();
    };
    OnErrorResumeNextSubscriber.prototype._complete = function () {
        this.subscribeToNextSource();
        this.unsubscribe();
    };
    OnErrorResumeNextSubscriber.prototype.subscribeToNextSource = function () {
        var next = this.nextSources.shift();
        if (!!next) {
            var innerSubscriber = new _innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["SimpleInnerSubscriber"](this);
            var destination = this.destination;
            destination.add(innerSubscriber);
            var innerSubscription = Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["innerSubscribe"])(next, innerSubscriber);
            if (innerSubscription !== innerSubscriber) {
                destination.add(innerSubscription);
            }
        }
        else {
            this.destination.complete();
        }
    };
    return OnErrorResumeNextSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["SimpleOuterSubscriber"]));
//# sourceMappingURL=onErrorResumeNext.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/pairwise.js":
/*!*****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/pairwise.js ***!
  \*****************************************************************/
/*! exports provided: pairwise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pairwise", function() { return pairwise; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function pairwise() {
    return function (source) { return source.lift(new PairwiseOperator()); };
}
var PairwiseOperator = /*@__PURE__*/ (function () {
    function PairwiseOperator() {
    }
    PairwiseOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new PairwiseSubscriber(subscriber));
    };
    return PairwiseOperator;
}());
var PairwiseSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](PairwiseSubscriber, _super);
    function PairwiseSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.hasPrev = false;
        return _this;
    }
    PairwiseSubscriber.prototype._next = function (value) {
        var pair;
        if (this.hasPrev) {
            pair = [this.prev, value];
        }
        else {
            this.hasPrev = true;
        }
        this.prev = value;
        if (pair) {
            this.destination.next(pair);
        }
    };
    return PairwiseSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=pairwise.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/partition.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/partition.js ***!
  \******************************************************************/
/*! exports provided: partition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "partition", function() { return partition; });
/* harmony import */ var _util_not__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/not */ "../node_modules/rxjs/_esm5/internal/util/not.js");
/* harmony import */ var _filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filter */ "../node_modules/rxjs/_esm5/internal/operators/filter.js");
/** PURE_IMPORTS_START _util_not,_filter PURE_IMPORTS_END */


function partition(predicate, thisArg) {
    return function (source) {
        return [
            Object(_filter__WEBPACK_IMPORTED_MODULE_1__["filter"])(predicate, thisArg)(source),
            Object(_filter__WEBPACK_IMPORTED_MODULE_1__["filter"])(Object(_util_not__WEBPACK_IMPORTED_MODULE_0__["not"])(predicate, thisArg))(source)
        ];
    };
}
//# sourceMappingURL=partition.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/pluck.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/pluck.js ***!
  \**************************************************************/
/*! exports provided: pluck */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pluck", function() { return pluck; });
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./map */ "../node_modules/rxjs/_esm5/internal/operators/map.js");
/** PURE_IMPORTS_START _map PURE_IMPORTS_END */

function pluck() {
    var properties = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        properties[_i] = arguments[_i];
    }
    var length = properties.length;
    if (length === 0) {
        throw new Error('list of properties cannot be empty.');
    }
    return function (source) { return Object(_map__WEBPACK_IMPORTED_MODULE_0__["map"])(plucker(properties, length))(source); };
}
function plucker(props, length) {
    var mapper = function (x) {
        var currentProp = x;
        for (var i = 0; i < length; i++) {
            var p = currentProp != null ? currentProp[props[i]] : undefined;
            if (p !== void 0) {
                currentProp = p;
            }
            else {
                return undefined;
            }
        }
        return currentProp;
    };
    return mapper;
}
//# sourceMappingURL=pluck.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/publish.js":
/*!****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/publish.js ***!
  \****************************************************************/
/*! exports provided: publish */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "publish", function() { return publish; });
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Subject */ "../node_modules/rxjs/_esm5/internal/Subject.js");
/* harmony import */ var _multicast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./multicast */ "../node_modules/rxjs/_esm5/internal/operators/multicast.js");
/** PURE_IMPORTS_START _Subject,_multicast PURE_IMPORTS_END */


function publish(selector) {
    return selector ?
        Object(_multicast__WEBPACK_IMPORTED_MODULE_1__["multicast"])(function () { return new _Subject__WEBPACK_IMPORTED_MODULE_0__["Subject"](); }, selector) :
        Object(_multicast__WEBPACK_IMPORTED_MODULE_1__["multicast"])(new _Subject__WEBPACK_IMPORTED_MODULE_0__["Subject"]());
}
//# sourceMappingURL=publish.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/publishBehavior.js":
/*!************************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/publishBehavior.js ***!
  \************************************************************************/
/*! exports provided: publishBehavior */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "publishBehavior", function() { return publishBehavior; });
/* harmony import */ var _BehaviorSubject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BehaviorSubject */ "../node_modules/rxjs/_esm5/internal/BehaviorSubject.js");
/* harmony import */ var _multicast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./multicast */ "../node_modules/rxjs/_esm5/internal/operators/multicast.js");
/** PURE_IMPORTS_START _BehaviorSubject,_multicast PURE_IMPORTS_END */


function publishBehavior(value) {
    return function (source) { return Object(_multicast__WEBPACK_IMPORTED_MODULE_1__["multicast"])(new _BehaviorSubject__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](value))(source); };
}
//# sourceMappingURL=publishBehavior.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/publishLast.js":
/*!********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/publishLast.js ***!
  \********************************************************************/
/*! exports provided: publishLast */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "publishLast", function() { return publishLast; });
/* harmony import */ var _AsyncSubject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../AsyncSubject */ "../node_modules/rxjs/_esm5/internal/AsyncSubject.js");
/* harmony import */ var _multicast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./multicast */ "../node_modules/rxjs/_esm5/internal/operators/multicast.js");
/** PURE_IMPORTS_START _AsyncSubject,_multicast PURE_IMPORTS_END */


function publishLast() {
    return function (source) { return Object(_multicast__WEBPACK_IMPORTED_MODULE_1__["multicast"])(new _AsyncSubject__WEBPACK_IMPORTED_MODULE_0__["AsyncSubject"]())(source); };
}
//# sourceMappingURL=publishLast.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/publishReplay.js":
/*!**********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/publishReplay.js ***!
  \**********************************************************************/
/*! exports provided: publishReplay */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "publishReplay", function() { return publishReplay; });
/* harmony import */ var _ReplaySubject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ReplaySubject */ "../node_modules/rxjs/_esm5/internal/ReplaySubject.js");
/* harmony import */ var _multicast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./multicast */ "../node_modules/rxjs/_esm5/internal/operators/multicast.js");
/** PURE_IMPORTS_START _ReplaySubject,_multicast PURE_IMPORTS_END */


function publishReplay(bufferSize, windowTime, selectorOrScheduler, scheduler) {
    if (selectorOrScheduler && typeof selectorOrScheduler !== 'function') {
        scheduler = selectorOrScheduler;
    }
    var selector = typeof selectorOrScheduler === 'function' ? selectorOrScheduler : undefined;
    var subject = new _ReplaySubject__WEBPACK_IMPORTED_MODULE_0__["ReplaySubject"](bufferSize, windowTime, scheduler);
    return function (source) { return Object(_multicast__WEBPACK_IMPORTED_MODULE_1__["multicast"])(function () { return subject; }, selector)(source); };
}
//# sourceMappingURL=publishReplay.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/race.js":
/*!*************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/race.js ***!
  \*************************************************************/
/*! exports provided: race */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "race", function() { return race; });
/* harmony import */ var _util_isArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/isArray */ "../node_modules/rxjs/_esm5/internal/util/isArray.js");
/* harmony import */ var _observable_race__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../observable/race */ "../node_modules/rxjs/_esm5/internal/observable/race.js");
/** PURE_IMPORTS_START _util_isArray,_observable_race PURE_IMPORTS_END */


function race() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    return function raceOperatorFunction(source) {
        if (observables.length === 1 && Object(_util_isArray__WEBPACK_IMPORTED_MODULE_0__["isArray"])(observables[0])) {
            observables = observables[0];
        }
        return source.lift.call(_observable_race__WEBPACK_IMPORTED_MODULE_1__["race"].apply(void 0, [source].concat(observables)));
    };
}
//# sourceMappingURL=race.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/reduce.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/reduce.js ***!
  \***************************************************************/
/*! exports provided: reduce */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reduce", function() { return reduce; });
/* harmony import */ var _scan__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scan */ "../node_modules/rxjs/_esm5/internal/operators/scan.js");
/* harmony import */ var _takeLast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./takeLast */ "../node_modules/rxjs/_esm5/internal/operators/takeLast.js");
/* harmony import */ var _defaultIfEmpty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./defaultIfEmpty */ "../node_modules/rxjs/_esm5/internal/operators/defaultIfEmpty.js");
/* harmony import */ var _util_pipe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/pipe */ "../node_modules/rxjs/_esm5/internal/util/pipe.js");
/** PURE_IMPORTS_START _scan,_takeLast,_defaultIfEmpty,_util_pipe PURE_IMPORTS_END */




function reduce(accumulator, seed) {
    if (arguments.length >= 2) {
        return function reduceOperatorFunctionWithSeed(source) {
            return Object(_util_pipe__WEBPACK_IMPORTED_MODULE_3__["pipe"])(Object(_scan__WEBPACK_IMPORTED_MODULE_0__["scan"])(accumulator, seed), Object(_takeLast__WEBPACK_IMPORTED_MODULE_1__["takeLast"])(1), Object(_defaultIfEmpty__WEBPACK_IMPORTED_MODULE_2__["defaultIfEmpty"])(seed))(source);
        };
    }
    return function reduceOperatorFunction(source) {
        return Object(_util_pipe__WEBPACK_IMPORTED_MODULE_3__["pipe"])(Object(_scan__WEBPACK_IMPORTED_MODULE_0__["scan"])(function (acc, value, index) { return accumulator(acc, value, index + 1); }), Object(_takeLast__WEBPACK_IMPORTED_MODULE_1__["takeLast"])(1))(source);
    };
}
//# sourceMappingURL=reduce.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/refCount.js":
/*!*****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/refCount.js ***!
  \*****************************************************************/
/*! exports provided: refCount */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "refCount", function() { return refCount; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function refCount() {
    return function refCountOperatorFunction(source) {
        return source.lift(new RefCountOperator(source));
    };
}
var RefCountOperator = /*@__PURE__*/ (function () {
    function RefCountOperator(connectable) {
        this.connectable = connectable;
    }
    RefCountOperator.prototype.call = function (subscriber, source) {
        var connectable = this.connectable;
        connectable._refCount++;
        var refCounter = new RefCountSubscriber(subscriber, connectable);
        var subscription = source.subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    };
    return RefCountOperator;
}());
var RefCountSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](RefCountSubscriber, _super);
    function RefCountSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
    }
    RefCountSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        var refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    };
    return RefCountSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=refCount.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/repeat.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/repeat.js ***!
  \***************************************************************/
/*! exports provided: repeat */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "repeat", function() { return repeat; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _observable_empty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../observable/empty */ "../node_modules/rxjs/_esm5/internal/observable/empty.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_observable_empty PURE_IMPORTS_END */



function repeat(count) {
    if (count === void 0) {
        count = -1;
    }
    return function (source) {
        if (count === 0) {
            return Object(_observable_empty__WEBPACK_IMPORTED_MODULE_2__["empty"])();
        }
        else if (count < 0) {
            return source.lift(new RepeatOperator(-1, source));
        }
        else {
            return source.lift(new RepeatOperator(count - 1, source));
        }
    };
}
var RepeatOperator = /*@__PURE__*/ (function () {
    function RepeatOperator(count, source) {
        this.count = count;
        this.source = source;
    }
    RepeatOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RepeatSubscriber(subscriber, this.count, this.source));
    };
    return RepeatOperator;
}());
var RepeatSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](RepeatSubscriber, _super);
    function RepeatSubscriber(destination, count, source) {
        var _this = _super.call(this, destination) || this;
        _this.count = count;
        _this.source = source;
        return _this;
    }
    RepeatSubscriber.prototype.complete = function () {
        if (!this.isStopped) {
            var _a = this, source = _a.source, count = _a.count;
            if (count === 0) {
                return _super.prototype.complete.call(this);
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            source.subscribe(this._unsubscribeAndRecycle());
        }
    };
    return RepeatSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=repeat.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/repeatWhen.js":
/*!*******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/repeatWhen.js ***!
  \*******************************************************************/
/*! exports provided: repeatWhen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "repeatWhen", function() { return repeatWhen; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subject */ "../node_modules/rxjs/_esm5/internal/Subject.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_Subject,_innerSubscribe PURE_IMPORTS_END */



function repeatWhen(notifier) {
    return function (source) { return source.lift(new RepeatWhenOperator(notifier)); };
}
var RepeatWhenOperator = /*@__PURE__*/ (function () {
    function RepeatWhenOperator(notifier) {
        this.notifier = notifier;
    }
    RepeatWhenOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RepeatWhenSubscriber(subscriber, this.notifier, source));
    };
    return RepeatWhenOperator;
}());
var RepeatWhenSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](RepeatWhenSubscriber, _super);
    function RepeatWhenSubscriber(destination, notifier, source) {
        var _this = _super.call(this, destination) || this;
        _this.notifier = notifier;
        _this.source = source;
        _this.sourceIsBeingSubscribedTo = true;
        return _this;
    }
    RepeatWhenSubscriber.prototype.notifyNext = function () {
        this.sourceIsBeingSubscribedTo = true;
        this.source.subscribe(this);
    };
    RepeatWhenSubscriber.prototype.notifyComplete = function () {
        if (this.sourceIsBeingSubscribedTo === false) {
            return _super.prototype.complete.call(this);
        }
    };
    RepeatWhenSubscriber.prototype.complete = function () {
        this.sourceIsBeingSubscribedTo = false;
        if (!this.isStopped) {
            if (!this.retries) {
                this.subscribeToRetries();
            }
            if (!this.retriesSubscription || this.retriesSubscription.closed) {
                return _super.prototype.complete.call(this);
            }
            this._unsubscribeAndRecycle();
            this.notifications.next(undefined);
        }
    };
    RepeatWhenSubscriber.prototype._unsubscribe = function () {
        var _a = this, notifications = _a.notifications, retriesSubscription = _a.retriesSubscription;
        if (notifications) {
            notifications.unsubscribe();
            this.notifications = undefined;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = undefined;
        }
        this.retries = undefined;
    };
    RepeatWhenSubscriber.prototype._unsubscribeAndRecycle = function () {
        var _unsubscribe = this._unsubscribe;
        this._unsubscribe = null;
        _super.prototype._unsubscribeAndRecycle.call(this);
        this._unsubscribe = _unsubscribe;
        return this;
    };
    RepeatWhenSubscriber.prototype.subscribeToRetries = function () {
        this.notifications = new _Subject__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        var retries;
        try {
            var notifier = this.notifier;
            retries = notifier(this.notifications);
        }
        catch (e) {
            return _super.prototype.complete.call(this);
        }
        this.retries = retries;
        this.retriesSubscription = Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_2__["innerSubscribe"])(retries, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_2__["SimpleInnerSubscriber"](this));
    };
    return RepeatWhenSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_2__["SimpleOuterSubscriber"]));
//# sourceMappingURL=repeatWhen.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/retry.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/retry.js ***!
  \**************************************************************/
/*! exports provided: retry */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "retry", function() { return retry; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function retry(count) {
    if (count === void 0) {
        count = -1;
    }
    return function (source) { return source.lift(new RetryOperator(count, source)); };
}
var RetryOperator = /*@__PURE__*/ (function () {
    function RetryOperator(count, source) {
        this.count = count;
        this.source = source;
    }
    RetryOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RetrySubscriber(subscriber, this.count, this.source));
    };
    return RetryOperator;
}());
var RetrySubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](RetrySubscriber, _super);
    function RetrySubscriber(destination, count, source) {
        var _this = _super.call(this, destination) || this;
        _this.count = count;
        _this.source = source;
        return _this;
    }
    RetrySubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _a = this, source = _a.source, count = _a.count;
            if (count === 0) {
                return _super.prototype.error.call(this, err);
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            source.subscribe(this._unsubscribeAndRecycle());
        }
    };
    return RetrySubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=retry.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/retryWhen.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/retryWhen.js ***!
  \******************************************************************/
/*! exports provided: retryWhen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "retryWhen", function() { return retryWhen; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subject */ "../node_modules/rxjs/_esm5/internal/Subject.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_Subject,_innerSubscribe PURE_IMPORTS_END */



function retryWhen(notifier) {
    return function (source) { return source.lift(new RetryWhenOperator(notifier, source)); };
}
var RetryWhenOperator = /*@__PURE__*/ (function () {
    function RetryWhenOperator(notifier, source) {
        this.notifier = notifier;
        this.source = source;
    }
    RetryWhenOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RetryWhenSubscriber(subscriber, this.notifier, this.source));
    };
    return RetryWhenOperator;
}());
var RetryWhenSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](RetryWhenSubscriber, _super);
    function RetryWhenSubscriber(destination, notifier, source) {
        var _this = _super.call(this, destination) || this;
        _this.notifier = notifier;
        _this.source = source;
        return _this;
    }
    RetryWhenSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var errors = this.errors;
            var retries = this.retries;
            var retriesSubscription = this.retriesSubscription;
            if (!retries) {
                errors = new _Subject__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
                try {
                    var notifier = this.notifier;
                    retries = notifier(errors);
                }
                catch (e) {
                    return _super.prototype.error.call(this, e);
                }
                retriesSubscription = Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_2__["innerSubscribe"])(retries, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_2__["SimpleInnerSubscriber"](this));
            }
            else {
                this.errors = undefined;
                this.retriesSubscription = undefined;
            }
            this._unsubscribeAndRecycle();
            this.errors = errors;
            this.retries = retries;
            this.retriesSubscription = retriesSubscription;
            errors.next(err);
        }
    };
    RetryWhenSubscriber.prototype._unsubscribe = function () {
        var _a = this, errors = _a.errors, retriesSubscription = _a.retriesSubscription;
        if (errors) {
            errors.unsubscribe();
            this.errors = undefined;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = undefined;
        }
        this.retries = undefined;
    };
    RetryWhenSubscriber.prototype.notifyNext = function () {
        var _unsubscribe = this._unsubscribe;
        this._unsubscribe = null;
        this._unsubscribeAndRecycle();
        this._unsubscribe = _unsubscribe;
        this.source.subscribe(this);
    };
    return RetryWhenSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_2__["SimpleOuterSubscriber"]));
//# sourceMappingURL=retryWhen.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/sample.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/sample.js ***!
  \***************************************************************/
/*! exports provided: sample */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sample", function() { return sample; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_innerSubscribe PURE_IMPORTS_END */


function sample(notifier) {
    return function (source) { return source.lift(new SampleOperator(notifier)); };
}
var SampleOperator = /*@__PURE__*/ (function () {
    function SampleOperator(notifier) {
        this.notifier = notifier;
    }
    SampleOperator.prototype.call = function (subscriber, source) {
        var sampleSubscriber = new SampleSubscriber(subscriber);
        var subscription = source.subscribe(sampleSubscriber);
        subscription.add(Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["innerSubscribe"])(this.notifier, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleInnerSubscriber"](sampleSubscriber)));
        return subscription;
    };
    return SampleOperator;
}());
var SampleSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SampleSubscriber, _super);
    function SampleSubscriber() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hasValue = false;
        return _this;
    }
    SampleSubscriber.prototype._next = function (value) {
        this.value = value;
        this.hasValue = true;
    };
    SampleSubscriber.prototype.notifyNext = function () {
        this.emitValue();
    };
    SampleSubscriber.prototype.notifyComplete = function () {
        this.emitValue();
    };
    SampleSubscriber.prototype.emitValue = function () {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.value);
        }
    };
    return SampleSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleOuterSubscriber"]));
//# sourceMappingURL=sample.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/sampleTime.js":
/*!*******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/sampleTime.js ***!
  \*******************************************************************/
/*! exports provided: sampleTime */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sampleTime", function() { return sampleTime; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scheduler/async */ "../node_modules/rxjs/_esm5/internal/scheduler/async.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async PURE_IMPORTS_END */



function sampleTime(period, scheduler) {
    if (scheduler === void 0) {
        scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_2__["async"];
    }
    return function (source) { return source.lift(new SampleTimeOperator(period, scheduler)); };
}
var SampleTimeOperator = /*@__PURE__*/ (function () {
    function SampleTimeOperator(period, scheduler) {
        this.period = period;
        this.scheduler = scheduler;
    }
    SampleTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SampleTimeSubscriber(subscriber, this.period, this.scheduler));
    };
    return SampleTimeOperator;
}());
var SampleTimeSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SampleTimeSubscriber, _super);
    function SampleTimeSubscriber(destination, period, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.period = period;
        _this.scheduler = scheduler;
        _this.hasValue = false;
        _this.add(scheduler.schedule(dispatchNotification, period, { subscriber: _this, period: period }));
        return _this;
    }
    SampleTimeSubscriber.prototype._next = function (value) {
        this.lastValue = value;
        this.hasValue = true;
    };
    SampleTimeSubscriber.prototype.notifyNext = function () {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.lastValue);
        }
    };
    return SampleTimeSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
function dispatchNotification(state) {
    var subscriber = state.subscriber, period = state.period;
    subscriber.notifyNext();
    this.schedule(state, period);
}
//# sourceMappingURL=sampleTime.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/scan.js":
/*!*************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/scan.js ***!
  \*************************************************************/
/*! exports provided: scan */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scan", function() { return scan; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function scan(accumulator, seed) {
    var hasSeed = false;
    if (arguments.length >= 2) {
        hasSeed = true;
    }
    return function scanOperatorFunction(source) {
        return source.lift(new ScanOperator(accumulator, seed, hasSeed));
    };
}
var ScanOperator = /*@__PURE__*/ (function () {
    function ScanOperator(accumulator, seed, hasSeed) {
        if (hasSeed === void 0) {
            hasSeed = false;
        }
        this.accumulator = accumulator;
        this.seed = seed;
        this.hasSeed = hasSeed;
    }
    ScanOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed, this.hasSeed));
    };
    return ScanOperator;
}());
var ScanSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ScanSubscriber, _super);
    function ScanSubscriber(destination, accumulator, _seed, hasSeed) {
        var _this = _super.call(this, destination) || this;
        _this.accumulator = accumulator;
        _this._seed = _seed;
        _this.hasSeed = hasSeed;
        _this.index = 0;
        return _this;
    }
    Object.defineProperty(ScanSubscriber.prototype, "seed", {
        get: function () {
            return this._seed;
        },
        set: function (value) {
            this.hasSeed = true;
            this._seed = value;
        },
        enumerable: true,
        configurable: true
    });
    ScanSubscriber.prototype._next = function (value) {
        if (!this.hasSeed) {
            this.seed = value;
            this.destination.next(value);
        }
        else {
            return this._tryNext(value);
        }
    };
    ScanSubscriber.prototype._tryNext = function (value) {
        var index = this.index++;
        var result;
        try {
            result = this.accumulator(this.seed, value, index);
        }
        catch (err) {
            this.destination.error(err);
        }
        this.seed = result;
        this.destination.next(result);
    };
    return ScanSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=scan.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/sequenceEqual.js":
/*!**********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/sequenceEqual.js ***!
  \**********************************************************************/
/*! exports provided: sequenceEqual, SequenceEqualOperator, SequenceEqualSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sequenceEqual", function() { return sequenceEqual; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SequenceEqualOperator", function() { return SequenceEqualOperator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SequenceEqualSubscriber", function() { return SequenceEqualSubscriber; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function sequenceEqual(compareTo, comparator) {
    return function (source) { return source.lift(new SequenceEqualOperator(compareTo, comparator)); };
}
var SequenceEqualOperator = /*@__PURE__*/ (function () {
    function SequenceEqualOperator(compareTo, comparator) {
        this.compareTo = compareTo;
        this.comparator = comparator;
    }
    SequenceEqualOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SequenceEqualSubscriber(subscriber, this.compareTo, this.comparator));
    };
    return SequenceEqualOperator;
}());

var SequenceEqualSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SequenceEqualSubscriber, _super);
    function SequenceEqualSubscriber(destination, compareTo, comparator) {
        var _this = _super.call(this, destination) || this;
        _this.compareTo = compareTo;
        _this.comparator = comparator;
        _this._a = [];
        _this._b = [];
        _this._oneComplete = false;
        _this.destination.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, _this)));
        return _this;
    }
    SequenceEqualSubscriber.prototype._next = function (value) {
        if (this._oneComplete && this._b.length === 0) {
            this.emit(false);
        }
        else {
            this._a.push(value);
            this.checkValues();
        }
    };
    SequenceEqualSubscriber.prototype._complete = function () {
        if (this._oneComplete) {
            this.emit(this._a.length === 0 && this._b.length === 0);
        }
        else {
            this._oneComplete = true;
        }
        this.unsubscribe();
    };
    SequenceEqualSubscriber.prototype.checkValues = function () {
        var _c = this, _a = _c._a, _b = _c._b, comparator = _c.comparator;
        while (_a.length > 0 && _b.length > 0) {
            var a = _a.shift();
            var b = _b.shift();
            var areEqual = false;
            try {
                areEqual = comparator ? comparator(a, b) : a === b;
            }
            catch (e) {
                this.destination.error(e);
            }
            if (!areEqual) {
                this.emit(false);
            }
        }
    };
    SequenceEqualSubscriber.prototype.emit = function (value) {
        var destination = this.destination;
        destination.next(value);
        destination.complete();
    };
    SequenceEqualSubscriber.prototype.nextB = function (value) {
        if (this._oneComplete && this._a.length === 0) {
            this.emit(false);
        }
        else {
            this._b.push(value);
            this.checkValues();
        }
    };
    SequenceEqualSubscriber.prototype.completeB = function () {
        if (this._oneComplete) {
            this.emit(this._a.length === 0 && this._b.length === 0);
        }
        else {
            this._oneComplete = true;
        }
    };
    return SequenceEqualSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));

var SequenceEqualCompareToSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SequenceEqualCompareToSubscriber, _super);
    function SequenceEqualCompareToSubscriber(destination, parent) {
        var _this = _super.call(this, destination) || this;
        _this.parent = parent;
        return _this;
    }
    SequenceEqualCompareToSubscriber.prototype._next = function (value) {
        this.parent.nextB(value);
    };
    SequenceEqualCompareToSubscriber.prototype._error = function (err) {
        this.parent.error(err);
        this.unsubscribe();
    };
    SequenceEqualCompareToSubscriber.prototype._complete = function () {
        this.parent.completeB();
        this.unsubscribe();
    };
    return SequenceEqualCompareToSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=sequenceEqual.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/share.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/share.js ***!
  \**************************************************************/
/*! exports provided: share */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "share", function() { return share; });
/* harmony import */ var _multicast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./multicast */ "../node_modules/rxjs/_esm5/internal/operators/multicast.js");
/* harmony import */ var _refCount__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./refCount */ "../node_modules/rxjs/_esm5/internal/operators/refCount.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Subject */ "../node_modules/rxjs/_esm5/internal/Subject.js");
/** PURE_IMPORTS_START _multicast,_refCount,_Subject PURE_IMPORTS_END */



function shareSubjectFactory() {
    return new _Subject__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
}
function share() {
    return function (source) { return Object(_refCount__WEBPACK_IMPORTED_MODULE_1__["refCount"])()(Object(_multicast__WEBPACK_IMPORTED_MODULE_0__["multicast"])(shareSubjectFactory)(source)); };
}
//# sourceMappingURL=share.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/shareReplay.js":
/*!********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/shareReplay.js ***!
  \********************************************************************/
/*! exports provided: shareReplay */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shareReplay", function() { return shareReplay; });
/* harmony import */ var _ReplaySubject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ReplaySubject */ "../node_modules/rxjs/_esm5/internal/ReplaySubject.js");
/** PURE_IMPORTS_START _ReplaySubject PURE_IMPORTS_END */

function shareReplay(configOrBufferSize, windowTime, scheduler) {
    var config;
    if (configOrBufferSize && typeof configOrBufferSize === 'object') {
        config = configOrBufferSize;
    }
    else {
        config = {
            bufferSize: configOrBufferSize,
            windowTime: windowTime,
            refCount: false,
            scheduler: scheduler
        };
    }
    return function (source) { return source.lift(shareReplayOperator(config)); };
}
function shareReplayOperator(_a) {
    var _b = _a.bufferSize, bufferSize = _b === void 0 ? Number.POSITIVE_INFINITY : _b, _c = _a.windowTime, windowTime = _c === void 0 ? Number.POSITIVE_INFINITY : _c, useRefCount = _a.refCount, scheduler = _a.scheduler;
    var subject;
    var refCount = 0;
    var subscription;
    var hasError = false;
    var isComplete = false;
    return function shareReplayOperation(source) {
        refCount++;
        var innerSub;
        if (!subject || hasError) {
            hasError = false;
            subject = new _ReplaySubject__WEBPACK_IMPORTED_MODULE_0__["ReplaySubject"](bufferSize, windowTime, scheduler);
            innerSub = subject.subscribe(this);
            subscription = source.subscribe({
                next: function (value) { subject.next(value); },
                error: function (err) {
                    hasError = true;
                    subject.error(err);
                },
                complete: function () {
                    isComplete = true;
                    subscription = undefined;
                    subject.complete();
                },
            });
        }
        else {
            innerSub = subject.subscribe(this);
        }
        this.add(function () {
            refCount--;
            innerSub.unsubscribe();
            if (subscription && !isComplete && useRefCount && refCount === 0) {
                subscription.unsubscribe();
                subscription = undefined;
                subject = undefined;
            }
        });
    };
}
//# sourceMappingURL=shareReplay.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/single.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/single.js ***!
  \***************************************************************/
/*! exports provided: single */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "single", function() { return single; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _util_EmptyError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/EmptyError */ "../node_modules/rxjs/_esm5/internal/util/EmptyError.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_util_EmptyError PURE_IMPORTS_END */



function single(predicate) {
    return function (source) { return source.lift(new SingleOperator(predicate, source)); };
}
var SingleOperator = /*@__PURE__*/ (function () {
    function SingleOperator(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    SingleOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SingleSubscriber(subscriber, this.predicate, this.source));
    };
    return SingleOperator;
}());
var SingleSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SingleSubscriber, _super);
    function SingleSubscriber(destination, predicate, source) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.source = source;
        _this.seenValue = false;
        _this.index = 0;
        return _this;
    }
    SingleSubscriber.prototype.applySingleValue = function (value) {
        if (this.seenValue) {
            this.destination.error('Sequence contains more than one element');
        }
        else {
            this.seenValue = true;
            this.singleValue = value;
        }
    };
    SingleSubscriber.prototype._next = function (value) {
        var index = this.index++;
        if (this.predicate) {
            this.tryNext(value, index);
        }
        else {
            this.applySingleValue(value);
        }
    };
    SingleSubscriber.prototype.tryNext = function (value, index) {
        try {
            if (this.predicate(value, index, this.source)) {
                this.applySingleValue(value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    SingleSubscriber.prototype._complete = function () {
        var destination = this.destination;
        if (this.index > 0) {
            destination.next(this.seenValue ? this.singleValue : undefined);
            destination.complete();
        }
        else {
            destination.error(new _util_EmptyError__WEBPACK_IMPORTED_MODULE_2__["EmptyError"]);
        }
    };
    return SingleSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=single.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/skip.js":
/*!*************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/skip.js ***!
  \*************************************************************/
/*! exports provided: skip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "skip", function() { return skip; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function skip(count) {
    return function (source) { return source.lift(new SkipOperator(count)); };
}
var SkipOperator = /*@__PURE__*/ (function () {
    function SkipOperator(total) {
        this.total = total;
    }
    SkipOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SkipSubscriber(subscriber, this.total));
    };
    return SkipOperator;
}());
var SkipSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SkipSubscriber, _super);
    function SkipSubscriber(destination, total) {
        var _this = _super.call(this, destination) || this;
        _this.total = total;
        _this.count = 0;
        return _this;
    }
    SkipSubscriber.prototype._next = function (x) {
        if (++this.count > this.total) {
            this.destination.next(x);
        }
    };
    return SkipSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=skip.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/skipLast.js":
/*!*****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/skipLast.js ***!
  \*****************************************************************/
/*! exports provided: skipLast */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "skipLast", function() { return skipLast; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _util_ArgumentOutOfRangeError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/ArgumentOutOfRangeError */ "../node_modules/rxjs/_esm5/internal/util/ArgumentOutOfRangeError.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError PURE_IMPORTS_END */



function skipLast(count) {
    return function (source) { return source.lift(new SkipLastOperator(count)); };
}
var SkipLastOperator = /*@__PURE__*/ (function () {
    function SkipLastOperator(_skipCount) {
        this._skipCount = _skipCount;
        if (this._skipCount < 0) {
            throw new _util_ArgumentOutOfRangeError__WEBPACK_IMPORTED_MODULE_2__["ArgumentOutOfRangeError"];
        }
    }
    SkipLastOperator.prototype.call = function (subscriber, source) {
        if (this._skipCount === 0) {
            return source.subscribe(new _Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"](subscriber));
        }
        else {
            return source.subscribe(new SkipLastSubscriber(subscriber, this._skipCount));
        }
    };
    return SkipLastOperator;
}());
var SkipLastSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SkipLastSubscriber, _super);
    function SkipLastSubscriber(destination, _skipCount) {
        var _this = _super.call(this, destination) || this;
        _this._skipCount = _skipCount;
        _this._count = 0;
        _this._ring = new Array(_skipCount);
        return _this;
    }
    SkipLastSubscriber.prototype._next = function (value) {
        var skipCount = this._skipCount;
        var count = this._count++;
        if (count < skipCount) {
            this._ring[count] = value;
        }
        else {
            var currentIndex = count % skipCount;
            var ring = this._ring;
            var oldValue = ring[currentIndex];
            ring[currentIndex] = value;
            this.destination.next(oldValue);
        }
    };
    return SkipLastSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=skipLast.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/skipUntil.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/skipUntil.js ***!
  \******************************************************************/
/*! exports provided: skipUntil */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "skipUntil", function() { return skipUntil; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_innerSubscribe PURE_IMPORTS_END */


function skipUntil(notifier) {
    return function (source) { return source.lift(new SkipUntilOperator(notifier)); };
}
var SkipUntilOperator = /*@__PURE__*/ (function () {
    function SkipUntilOperator(notifier) {
        this.notifier = notifier;
    }
    SkipUntilOperator.prototype.call = function (destination, source) {
        return source.subscribe(new SkipUntilSubscriber(destination, this.notifier));
    };
    return SkipUntilOperator;
}());
var SkipUntilSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SkipUntilSubscriber, _super);
    function SkipUntilSubscriber(destination, notifier) {
        var _this = _super.call(this, destination) || this;
        _this.hasValue = false;
        var innerSubscriber = new _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleInnerSubscriber"](_this);
        _this.add(innerSubscriber);
        _this.innerSubscription = innerSubscriber;
        var innerSubscription = Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["innerSubscribe"])(notifier, innerSubscriber);
        if (innerSubscription !== innerSubscriber) {
            _this.add(innerSubscription);
            _this.innerSubscription = innerSubscription;
        }
        return _this;
    }
    SkipUntilSubscriber.prototype._next = function (value) {
        if (this.hasValue) {
            _super.prototype._next.call(this, value);
        }
    };
    SkipUntilSubscriber.prototype.notifyNext = function () {
        this.hasValue = true;
        if (this.innerSubscription) {
            this.innerSubscription.unsubscribe();
        }
    };
    SkipUntilSubscriber.prototype.notifyComplete = function () {
    };
    return SkipUntilSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleOuterSubscriber"]));
//# sourceMappingURL=skipUntil.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/skipWhile.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/skipWhile.js ***!
  \******************************************************************/
/*! exports provided: skipWhile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "skipWhile", function() { return skipWhile; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function skipWhile(predicate) {
    return function (source) { return source.lift(new SkipWhileOperator(predicate)); };
}
var SkipWhileOperator = /*@__PURE__*/ (function () {
    function SkipWhileOperator(predicate) {
        this.predicate = predicate;
    }
    SkipWhileOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SkipWhileSubscriber(subscriber, this.predicate));
    };
    return SkipWhileOperator;
}());
var SkipWhileSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SkipWhileSubscriber, _super);
    function SkipWhileSubscriber(destination, predicate) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.skipping = true;
        _this.index = 0;
        return _this;
    }
    SkipWhileSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        if (this.skipping) {
            this.tryCallPredicate(value);
        }
        if (!this.skipping) {
            destination.next(value);
        }
    };
    SkipWhileSubscriber.prototype.tryCallPredicate = function (value) {
        try {
            var result = this.predicate(value, this.index++);
            this.skipping = Boolean(result);
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    return SkipWhileSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=skipWhile.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/startWith.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/startWith.js ***!
  \******************************************************************/
/*! exports provided: startWith */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "startWith", function() { return startWith; });
/* harmony import */ var _observable_concat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observable/concat */ "../node_modules/rxjs/_esm5/internal/observable/concat.js");
/* harmony import */ var _util_isScheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/isScheduler */ "../node_modules/rxjs/_esm5/internal/util/isScheduler.js");
/** PURE_IMPORTS_START _observable_concat,_util_isScheduler PURE_IMPORTS_END */


function startWith() {
    var array = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        array[_i] = arguments[_i];
    }
    var scheduler = array[array.length - 1];
    if (Object(_util_isScheduler__WEBPACK_IMPORTED_MODULE_1__["isScheduler"])(scheduler)) {
        array.pop();
        return function (source) { return Object(_observable_concat__WEBPACK_IMPORTED_MODULE_0__["concat"])(array, source, scheduler); };
    }
    else {
        return function (source) { return Object(_observable_concat__WEBPACK_IMPORTED_MODULE_0__["concat"])(array, source); };
    }
}
//# sourceMappingURL=startWith.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/subscribeOn.js":
/*!********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/subscribeOn.js ***!
  \********************************************************************/
/*! exports provided: subscribeOn */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subscribeOn", function() { return subscribeOn; });
/* harmony import */ var _observable_SubscribeOnObservable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observable/SubscribeOnObservable */ "../node_modules/rxjs/_esm5/internal/observable/SubscribeOnObservable.js");
/** PURE_IMPORTS_START _observable_SubscribeOnObservable PURE_IMPORTS_END */

function subscribeOn(scheduler, delay) {
    if (delay === void 0) {
        delay = 0;
    }
    return function subscribeOnOperatorFunction(source) {
        return source.lift(new SubscribeOnOperator(scheduler, delay));
    };
}
var SubscribeOnOperator = /*@__PURE__*/ (function () {
    function SubscribeOnOperator(scheduler, delay) {
        this.scheduler = scheduler;
        this.delay = delay;
    }
    SubscribeOnOperator.prototype.call = function (subscriber, source) {
        return new _observable_SubscribeOnObservable__WEBPACK_IMPORTED_MODULE_0__["SubscribeOnObservable"](source, this.delay, this.scheduler).subscribe(subscriber);
    };
    return SubscribeOnOperator;
}());
//# sourceMappingURL=subscribeOn.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/switchAll.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/switchAll.js ***!
  \******************************************************************/
/*! exports provided: switchAll */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "switchAll", function() { return switchAll; });
/* harmony import */ var _switchMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./switchMap */ "../node_modules/rxjs/_esm5/internal/operators/switchMap.js");
/* harmony import */ var _util_identity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/identity */ "../node_modules/rxjs/_esm5/internal/util/identity.js");
/** PURE_IMPORTS_START _switchMap,_util_identity PURE_IMPORTS_END */


function switchAll() {
    return Object(_switchMap__WEBPACK_IMPORTED_MODULE_0__["switchMap"])(_util_identity__WEBPACK_IMPORTED_MODULE_1__["identity"]);
}
//# sourceMappingURL=switchAll.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/switchMap.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/switchMap.js ***!
  \******************************************************************/
/*! exports provided: switchMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "switchMap", function() { return switchMap; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./map */ "../node_modules/rxjs/_esm5/internal/operators/map.js");
/* harmony import */ var _observable_from__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../observable/from */ "../node_modules/rxjs/_esm5/internal/observable/from.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_map,_observable_from,_innerSubscribe PURE_IMPORTS_END */




function switchMap(project, resultSelector) {
    if (typeof resultSelector === 'function') {
        return function (source) { return source.pipe(switchMap(function (a, i) { return Object(_observable_from__WEBPACK_IMPORTED_MODULE_2__["from"])(project(a, i)).pipe(Object(_map__WEBPACK_IMPORTED_MODULE_1__["map"])(function (b, ii) { return resultSelector(a, b, i, ii); })); })); };
    }
    return function (source) { return source.lift(new SwitchMapOperator(project)); };
}
var SwitchMapOperator = /*@__PURE__*/ (function () {
    function SwitchMapOperator(project) {
        this.project = project;
    }
    SwitchMapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SwitchMapSubscriber(subscriber, this.project));
    };
    return SwitchMapOperator;
}());
var SwitchMapSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SwitchMapSubscriber, _super);
    function SwitchMapSubscriber(destination, project) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.index = 0;
        return _this;
    }
    SwitchMapSubscriber.prototype._next = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (error) {
            this.destination.error(error);
            return;
        }
        this._innerSub(result);
    };
    SwitchMapSubscriber.prototype._innerSub = function (result) {
        var innerSubscription = this.innerSubscription;
        if (innerSubscription) {
            innerSubscription.unsubscribe();
        }
        var innerSubscriber = new _innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["SimpleInnerSubscriber"](this);
        var destination = this.destination;
        destination.add(innerSubscriber);
        this.innerSubscription = Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["innerSubscribe"])(result, innerSubscriber);
        if (this.innerSubscription !== innerSubscriber) {
            destination.add(this.innerSubscription);
        }
    };
    SwitchMapSubscriber.prototype._complete = function () {
        var innerSubscription = this.innerSubscription;
        if (!innerSubscription || innerSubscription.closed) {
            _super.prototype._complete.call(this);
        }
        this.unsubscribe();
    };
    SwitchMapSubscriber.prototype._unsubscribe = function () {
        this.innerSubscription = undefined;
    };
    SwitchMapSubscriber.prototype.notifyComplete = function () {
        this.innerSubscription = undefined;
        if (this.isStopped) {
            _super.prototype._complete.call(this);
        }
    };
    SwitchMapSubscriber.prototype.notifyNext = function (innerValue) {
        this.destination.next(innerValue);
    };
    return SwitchMapSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["SimpleOuterSubscriber"]));
//# sourceMappingURL=switchMap.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/switchMapTo.js":
/*!********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/switchMapTo.js ***!
  \********************************************************************/
/*! exports provided: switchMapTo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "switchMapTo", function() { return switchMapTo; });
/* harmony import */ var _switchMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./switchMap */ "../node_modules/rxjs/_esm5/internal/operators/switchMap.js");
/** PURE_IMPORTS_START _switchMap PURE_IMPORTS_END */

function switchMapTo(innerObservable, resultSelector) {
    return resultSelector ? Object(_switchMap__WEBPACK_IMPORTED_MODULE_0__["switchMap"])(function () { return innerObservable; }, resultSelector) : Object(_switchMap__WEBPACK_IMPORTED_MODULE_0__["switchMap"])(function () { return innerObservable; });
}
//# sourceMappingURL=switchMapTo.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/take.js":
/*!*************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/take.js ***!
  \*************************************************************/
/*! exports provided: take */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "take", function() { return take; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _util_ArgumentOutOfRangeError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/ArgumentOutOfRangeError */ "../node_modules/rxjs/_esm5/internal/util/ArgumentOutOfRangeError.js");
/* harmony import */ var _observable_empty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../observable/empty */ "../node_modules/rxjs/_esm5/internal/observable/empty.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError,_observable_empty PURE_IMPORTS_END */




function take(count) {
    return function (source) {
        if (count === 0) {
            return Object(_observable_empty__WEBPACK_IMPORTED_MODULE_3__["empty"])();
        }
        else {
            return source.lift(new TakeOperator(count));
        }
    };
}
var TakeOperator = /*@__PURE__*/ (function () {
    function TakeOperator(total) {
        this.total = total;
        if (this.total < 0) {
            throw new _util_ArgumentOutOfRangeError__WEBPACK_IMPORTED_MODULE_2__["ArgumentOutOfRangeError"];
        }
    }
    TakeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TakeSubscriber(subscriber, this.total));
    };
    return TakeOperator;
}());
var TakeSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](TakeSubscriber, _super);
    function TakeSubscriber(destination, total) {
        var _this = _super.call(this, destination) || this;
        _this.total = total;
        _this.count = 0;
        return _this;
    }
    TakeSubscriber.prototype._next = function (value) {
        var total = this.total;
        var count = ++this.count;
        if (count <= total) {
            this.destination.next(value);
            if (count === total) {
                this.destination.complete();
                this.unsubscribe();
            }
        }
    };
    return TakeSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=take.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/takeLast.js":
/*!*****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/takeLast.js ***!
  \*****************************************************************/
/*! exports provided: takeLast */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "takeLast", function() { return takeLast; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _util_ArgumentOutOfRangeError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/ArgumentOutOfRangeError */ "../node_modules/rxjs/_esm5/internal/util/ArgumentOutOfRangeError.js");
/* harmony import */ var _observable_empty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../observable/empty */ "../node_modules/rxjs/_esm5/internal/observable/empty.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError,_observable_empty PURE_IMPORTS_END */




function takeLast(count) {
    return function takeLastOperatorFunction(source) {
        if (count === 0) {
            return Object(_observable_empty__WEBPACK_IMPORTED_MODULE_3__["empty"])();
        }
        else {
            return source.lift(new TakeLastOperator(count));
        }
    };
}
var TakeLastOperator = /*@__PURE__*/ (function () {
    function TakeLastOperator(total) {
        this.total = total;
        if (this.total < 0) {
            throw new _util_ArgumentOutOfRangeError__WEBPACK_IMPORTED_MODULE_2__["ArgumentOutOfRangeError"];
        }
    }
    TakeLastOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TakeLastSubscriber(subscriber, this.total));
    };
    return TakeLastOperator;
}());
var TakeLastSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](TakeLastSubscriber, _super);
    function TakeLastSubscriber(destination, total) {
        var _this = _super.call(this, destination) || this;
        _this.total = total;
        _this.ring = new Array();
        _this.count = 0;
        return _this;
    }
    TakeLastSubscriber.prototype._next = function (value) {
        var ring = this.ring;
        var total = this.total;
        var count = this.count++;
        if (ring.length < total) {
            ring.push(value);
        }
        else {
            var index = count % total;
            ring[index] = value;
        }
    };
    TakeLastSubscriber.prototype._complete = function () {
        var destination = this.destination;
        var count = this.count;
        if (count > 0) {
            var total = this.count >= this.total ? this.total : this.count;
            var ring = this.ring;
            for (var i = 0; i < total; i++) {
                var idx = (count++) % total;
                destination.next(ring[idx]);
            }
        }
        destination.complete();
    };
    return TakeLastSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=takeLast.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/takeUntil.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/takeUntil.js ***!
  \******************************************************************/
/*! exports provided: takeUntil */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "takeUntil", function() { return takeUntil; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_innerSubscribe PURE_IMPORTS_END */


function takeUntil(notifier) {
    return function (source) { return source.lift(new TakeUntilOperator(notifier)); };
}
var TakeUntilOperator = /*@__PURE__*/ (function () {
    function TakeUntilOperator(notifier) {
        this.notifier = notifier;
    }
    TakeUntilOperator.prototype.call = function (subscriber, source) {
        var takeUntilSubscriber = new TakeUntilSubscriber(subscriber);
        var notifierSubscription = Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["innerSubscribe"])(this.notifier, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleInnerSubscriber"](takeUntilSubscriber));
        if (notifierSubscription && !takeUntilSubscriber.seenValue) {
            takeUntilSubscriber.add(notifierSubscription);
            return source.subscribe(takeUntilSubscriber);
        }
        return takeUntilSubscriber;
    };
    return TakeUntilOperator;
}());
var TakeUntilSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](TakeUntilSubscriber, _super);
    function TakeUntilSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.seenValue = false;
        return _this;
    }
    TakeUntilSubscriber.prototype.notifyNext = function () {
        this.seenValue = true;
        this.complete();
    };
    TakeUntilSubscriber.prototype.notifyComplete = function () {
    };
    return TakeUntilSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleOuterSubscriber"]));
//# sourceMappingURL=takeUntil.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/takeWhile.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/takeWhile.js ***!
  \******************************************************************/
/*! exports provided: takeWhile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "takeWhile", function() { return takeWhile; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */


function takeWhile(predicate, inclusive) {
    if (inclusive === void 0) {
        inclusive = false;
    }
    return function (source) {
        return source.lift(new TakeWhileOperator(predicate, inclusive));
    };
}
var TakeWhileOperator = /*@__PURE__*/ (function () {
    function TakeWhileOperator(predicate, inclusive) {
        this.predicate = predicate;
        this.inclusive = inclusive;
    }
    TakeWhileOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TakeWhileSubscriber(subscriber, this.predicate, this.inclusive));
    };
    return TakeWhileOperator;
}());
var TakeWhileSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](TakeWhileSubscriber, _super);
    function TakeWhileSubscriber(destination, predicate, inclusive) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.inclusive = inclusive;
        _this.index = 0;
        return _this;
    }
    TakeWhileSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        var result;
        try {
            result = this.predicate(value, this.index++);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this.nextOrComplete(value, result);
    };
    TakeWhileSubscriber.prototype.nextOrComplete = function (value, predicateResult) {
        var destination = this.destination;
        if (Boolean(predicateResult)) {
            destination.next(value);
        }
        else {
            if (this.inclusive) {
                destination.next(value);
            }
            destination.complete();
        }
    };
    return TakeWhileSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=takeWhile.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/tap.js":
/*!************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/tap.js ***!
  \************************************************************/
/*! exports provided: tap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tap", function() { return tap; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _util_noop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/noop */ "../node_modules/rxjs/_esm5/internal/util/noop.js");
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/isFunction */ "../node_modules/rxjs/_esm5/internal/util/isFunction.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_util_noop,_util_isFunction PURE_IMPORTS_END */




function tap(nextOrObserver, error, complete) {
    return function tapOperatorFunction(source) {
        return source.lift(new DoOperator(nextOrObserver, error, complete));
    };
}
var DoOperator = /*@__PURE__*/ (function () {
    function DoOperator(nextOrObserver, error, complete) {
        this.nextOrObserver = nextOrObserver;
        this.error = error;
        this.complete = complete;
    }
    DoOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TapSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
    };
    return DoOperator;
}());
var TapSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](TapSubscriber, _super);
    function TapSubscriber(destination, observerOrNext, error, complete) {
        var _this = _super.call(this, destination) || this;
        _this._tapNext = _util_noop__WEBPACK_IMPORTED_MODULE_2__["noop"];
        _this._tapError = _util_noop__WEBPACK_IMPORTED_MODULE_2__["noop"];
        _this._tapComplete = _util_noop__WEBPACK_IMPORTED_MODULE_2__["noop"];
        _this._tapError = error || _util_noop__WEBPACK_IMPORTED_MODULE_2__["noop"];
        _this._tapComplete = complete || _util_noop__WEBPACK_IMPORTED_MODULE_2__["noop"];
        if (Object(_util_isFunction__WEBPACK_IMPORTED_MODULE_3__["isFunction"])(observerOrNext)) {
            _this._context = _this;
            _this._tapNext = observerOrNext;
        }
        else if (observerOrNext) {
            _this._context = observerOrNext;
            _this._tapNext = observerOrNext.next || _util_noop__WEBPACK_IMPORTED_MODULE_2__["noop"];
            _this._tapError = observerOrNext.error || _util_noop__WEBPACK_IMPORTED_MODULE_2__["noop"];
            _this._tapComplete = observerOrNext.complete || _util_noop__WEBPACK_IMPORTED_MODULE_2__["noop"];
        }
        return _this;
    }
    TapSubscriber.prototype._next = function (value) {
        try {
            this._tapNext.call(this._context, value);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(value);
    };
    TapSubscriber.prototype._error = function (err) {
        try {
            this._tapError.call(this._context, err);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.error(err);
    };
    TapSubscriber.prototype._complete = function () {
        try {
            this._tapComplete.call(this._context);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        return this.destination.complete();
    };
    return TapSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=tap.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/throttle.js":
/*!*****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/throttle.js ***!
  \*****************************************************************/
/*! exports provided: defaultThrottleConfig, throttle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultThrottleConfig", function() { return defaultThrottleConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "throttle", function() { return throttle; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_innerSubscribe PURE_IMPORTS_END */


var defaultThrottleConfig = {
    leading: true,
    trailing: false
};
function throttle(durationSelector, config) {
    if (config === void 0) {
        config = defaultThrottleConfig;
    }
    return function (source) { return source.lift(new ThrottleOperator(durationSelector, !!config.leading, !!config.trailing)); };
}
var ThrottleOperator = /*@__PURE__*/ (function () {
    function ThrottleOperator(durationSelector, leading, trailing) {
        this.durationSelector = durationSelector;
        this.leading = leading;
        this.trailing = trailing;
    }
    ThrottleOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ThrottleSubscriber(subscriber, this.durationSelector, this.leading, this.trailing));
    };
    return ThrottleOperator;
}());
var ThrottleSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ThrottleSubscriber, _super);
    function ThrottleSubscriber(destination, durationSelector, _leading, _trailing) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.durationSelector = durationSelector;
        _this._leading = _leading;
        _this._trailing = _trailing;
        _this._hasValue = false;
        return _this;
    }
    ThrottleSubscriber.prototype._next = function (value) {
        this._hasValue = true;
        this._sendValue = value;
        if (!this._throttled) {
            if (this._leading) {
                this.send();
            }
            else {
                this.throttle(value);
            }
        }
    };
    ThrottleSubscriber.prototype.send = function () {
        var _a = this, _hasValue = _a._hasValue, _sendValue = _a._sendValue;
        if (_hasValue) {
            this.destination.next(_sendValue);
            this.throttle(_sendValue);
        }
        this._hasValue = false;
        this._sendValue = undefined;
    };
    ThrottleSubscriber.prototype.throttle = function (value) {
        var duration = this.tryDurationSelector(value);
        if (!!duration) {
            this.add(this._throttled = Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["innerSubscribe"])(duration, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleInnerSubscriber"](this)));
        }
    };
    ThrottleSubscriber.prototype.tryDurationSelector = function (value) {
        try {
            return this.durationSelector(value);
        }
        catch (err) {
            this.destination.error(err);
            return null;
        }
    };
    ThrottleSubscriber.prototype.throttlingDone = function () {
        var _a = this, _throttled = _a._throttled, _trailing = _a._trailing;
        if (_throttled) {
            _throttled.unsubscribe();
        }
        this._throttled = undefined;
        if (_trailing) {
            this.send();
        }
    };
    ThrottleSubscriber.prototype.notifyNext = function () {
        this.throttlingDone();
    };
    ThrottleSubscriber.prototype.notifyComplete = function () {
        this.throttlingDone();
    };
    return ThrottleSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_1__["SimpleOuterSubscriber"]));
//# sourceMappingURL=throttle.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/throttleTime.js":
/*!*********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/throttleTime.js ***!
  \*********************************************************************/
/*! exports provided: throttleTime */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "throttleTime", function() { return throttleTime; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scheduler/async */ "../node_modules/rxjs/_esm5/internal/scheduler/async.js");
/* harmony import */ var _throttle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./throttle */ "../node_modules/rxjs/_esm5/internal/operators/throttle.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async,_throttle PURE_IMPORTS_END */




function throttleTime(duration, scheduler, config) {
    if (scheduler === void 0) {
        scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_2__["async"];
    }
    if (config === void 0) {
        config = _throttle__WEBPACK_IMPORTED_MODULE_3__["defaultThrottleConfig"];
    }
    return function (source) { return source.lift(new ThrottleTimeOperator(duration, scheduler, config.leading, config.trailing)); };
}
var ThrottleTimeOperator = /*@__PURE__*/ (function () {
    function ThrottleTimeOperator(duration, scheduler, leading, trailing) {
        this.duration = duration;
        this.scheduler = scheduler;
        this.leading = leading;
        this.trailing = trailing;
    }
    ThrottleTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ThrottleTimeSubscriber(subscriber, this.duration, this.scheduler, this.leading, this.trailing));
    };
    return ThrottleTimeOperator;
}());
var ThrottleTimeSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ThrottleTimeSubscriber, _super);
    function ThrottleTimeSubscriber(destination, duration, scheduler, leading, trailing) {
        var _this = _super.call(this, destination) || this;
        _this.duration = duration;
        _this.scheduler = scheduler;
        _this.leading = leading;
        _this.trailing = trailing;
        _this._hasTrailingValue = false;
        _this._trailingValue = null;
        return _this;
    }
    ThrottleTimeSubscriber.prototype._next = function (value) {
        if (this.throttled) {
            if (this.trailing) {
                this._trailingValue = value;
                this._hasTrailingValue = true;
            }
        }
        else {
            this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.duration, { subscriber: this }));
            if (this.leading) {
                this.destination.next(value);
            }
            else if (this.trailing) {
                this._trailingValue = value;
                this._hasTrailingValue = true;
            }
        }
    };
    ThrottleTimeSubscriber.prototype._complete = function () {
        if (this._hasTrailingValue) {
            this.destination.next(this._trailingValue);
            this.destination.complete();
        }
        else {
            this.destination.complete();
        }
    };
    ThrottleTimeSubscriber.prototype.clearThrottle = function () {
        var throttled = this.throttled;
        if (throttled) {
            if (this.trailing && this._hasTrailingValue) {
                this.destination.next(this._trailingValue);
                this._trailingValue = null;
                this._hasTrailingValue = false;
            }
            throttled.unsubscribe();
            this.remove(throttled);
            this.throttled = null;
        }
    };
    return ThrottleTimeSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
function dispatchNext(arg) {
    var subscriber = arg.subscriber;
    subscriber.clearThrottle();
}
//# sourceMappingURL=throttleTime.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/throwIfEmpty.js":
/*!*********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/throwIfEmpty.js ***!
  \*********************************************************************/
/*! exports provided: throwIfEmpty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "throwIfEmpty", function() { return throwIfEmpty; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _util_EmptyError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/EmptyError */ "../node_modules/rxjs/_esm5/internal/util/EmptyError.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START tslib,_util_EmptyError,_Subscriber PURE_IMPORTS_END */



function throwIfEmpty(errorFactory) {
    if (errorFactory === void 0) {
        errorFactory = defaultErrorFactory;
    }
    return function (source) {
        return source.lift(new ThrowIfEmptyOperator(errorFactory));
    };
}
var ThrowIfEmptyOperator = /*@__PURE__*/ (function () {
    function ThrowIfEmptyOperator(errorFactory) {
        this.errorFactory = errorFactory;
    }
    ThrowIfEmptyOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ThrowIfEmptySubscriber(subscriber, this.errorFactory));
    };
    return ThrowIfEmptyOperator;
}());
var ThrowIfEmptySubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ThrowIfEmptySubscriber, _super);
    function ThrowIfEmptySubscriber(destination, errorFactory) {
        var _this = _super.call(this, destination) || this;
        _this.errorFactory = errorFactory;
        _this.hasValue = false;
        return _this;
    }
    ThrowIfEmptySubscriber.prototype._next = function (value) {
        this.hasValue = true;
        this.destination.next(value);
    };
    ThrowIfEmptySubscriber.prototype._complete = function () {
        if (!this.hasValue) {
            var err = void 0;
            try {
                err = this.errorFactory();
            }
            catch (e) {
                err = e;
            }
            this.destination.error(err);
        }
        else {
            return this.destination.complete();
        }
    };
    return ThrowIfEmptySubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_2__["Subscriber"]));
function defaultErrorFactory() {
    return new _util_EmptyError__WEBPACK_IMPORTED_MODULE_1__["EmptyError"]();
}
//# sourceMappingURL=throwIfEmpty.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/timeInterval.js":
/*!*********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/timeInterval.js ***!
  \*********************************************************************/
/*! exports provided: timeInterval, TimeInterval */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "timeInterval", function() { return timeInterval; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimeInterval", function() { return TimeInterval; });
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scheduler/async */ "../node_modules/rxjs/_esm5/internal/scheduler/async.js");
/* harmony import */ var _scan__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scan */ "../node_modules/rxjs/_esm5/internal/operators/scan.js");
/* harmony import */ var _observable_defer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../observable/defer */ "../node_modules/rxjs/_esm5/internal/observable/defer.js");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./map */ "../node_modules/rxjs/_esm5/internal/operators/map.js");
/** PURE_IMPORTS_START _scheduler_async,_scan,_observable_defer,_map PURE_IMPORTS_END */




function timeInterval(scheduler) {
    if (scheduler === void 0) {
        scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_0__["async"];
    }
    return function (source) {
        return Object(_observable_defer__WEBPACK_IMPORTED_MODULE_2__["defer"])(function () {
            return source.pipe(Object(_scan__WEBPACK_IMPORTED_MODULE_1__["scan"])(function (_a, value) {
                var current = _a.current;
                return ({ value: value, current: scheduler.now(), last: current });
            }, { current: scheduler.now(), value: undefined, last: undefined }), Object(_map__WEBPACK_IMPORTED_MODULE_3__["map"])(function (_a) {
                var current = _a.current, last = _a.last, value = _a.value;
                return new TimeInterval(value, current - last);
            }));
        });
    };
}
var TimeInterval = /*@__PURE__*/ (function () {
    function TimeInterval(value, interval) {
        this.value = value;
        this.interval = interval;
    }
    return TimeInterval;
}());

//# sourceMappingURL=timeInterval.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/timeout.js":
/*!****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/timeout.js ***!
  \****************************************************************/
/*! exports provided: timeout */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "timeout", function() { return timeout; });
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scheduler/async */ "../node_modules/rxjs/_esm5/internal/scheduler/async.js");
/* harmony import */ var _util_TimeoutError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/TimeoutError */ "../node_modules/rxjs/_esm5/internal/util/TimeoutError.js");
/* harmony import */ var _timeoutWith__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./timeoutWith */ "../node_modules/rxjs/_esm5/internal/operators/timeoutWith.js");
/* harmony import */ var _observable_throwError__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../observable/throwError */ "../node_modules/rxjs/_esm5/internal/observable/throwError.js");
/** PURE_IMPORTS_START _scheduler_async,_util_TimeoutError,_timeoutWith,_observable_throwError PURE_IMPORTS_END */




function timeout(due, scheduler) {
    if (scheduler === void 0) {
        scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_0__["async"];
    }
    return Object(_timeoutWith__WEBPACK_IMPORTED_MODULE_2__["timeoutWith"])(due, Object(_observable_throwError__WEBPACK_IMPORTED_MODULE_3__["throwError"])(new _util_TimeoutError__WEBPACK_IMPORTED_MODULE_1__["TimeoutError"]()), scheduler);
}
//# sourceMappingURL=timeout.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/timeoutWith.js":
/*!********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/timeoutWith.js ***!
  \********************************************************************/
/*! exports provided: timeoutWith */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "timeoutWith", function() { return timeoutWith; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scheduler/async */ "../node_modules/rxjs/_esm5/internal/scheduler/async.js");
/* harmony import */ var _util_isDate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/isDate */ "../node_modules/rxjs/_esm5/internal/util/isDate.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_scheduler_async,_util_isDate,_innerSubscribe PURE_IMPORTS_END */




function timeoutWith(due, withObservable, scheduler) {
    if (scheduler === void 0) {
        scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_1__["async"];
    }
    return function (source) {
        var absoluteTimeout = Object(_util_isDate__WEBPACK_IMPORTED_MODULE_2__["isDate"])(due);
        var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
        return source.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
    };
}
var TimeoutWithOperator = /*@__PURE__*/ (function () {
    function TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
    }
    TimeoutWithOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
    };
    return TimeoutWithOperator;
}());
var TimeoutWithSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](TimeoutWithSubscriber, _super);
    function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.absoluteTimeout = absoluteTimeout;
        _this.waitFor = waitFor;
        _this.withObservable = withObservable;
        _this.scheduler = scheduler;
        _this.scheduleTimeout();
        return _this;
    }
    TimeoutWithSubscriber.dispatchTimeout = function (subscriber) {
        var withObservable = subscriber.withObservable;
        subscriber._unsubscribeAndRecycle();
        subscriber.add(Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["innerSubscribe"])(withObservable, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["SimpleInnerSubscriber"](subscriber)));
    };
    TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
        var action = this.action;
        if (action) {
            this.action = action.schedule(this, this.waitFor);
        }
        else {
            this.add(this.action = this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, this));
        }
    };
    TimeoutWithSubscriber.prototype._next = function (value) {
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
        _super.prototype._next.call(this, value);
    };
    TimeoutWithSubscriber.prototype._unsubscribe = function () {
        this.action = undefined;
        this.scheduler = null;
        this.withObservable = null;
    };
    return TimeoutWithSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_3__["SimpleOuterSubscriber"]));
//# sourceMappingURL=timeoutWith.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/timestamp.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/timestamp.js ***!
  \******************************************************************/
/*! exports provided: timestamp, Timestamp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "timestamp", function() { return timestamp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Timestamp", function() { return Timestamp; });
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scheduler/async */ "../node_modules/rxjs/_esm5/internal/scheduler/async.js");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./map */ "../node_modules/rxjs/_esm5/internal/operators/map.js");
/** PURE_IMPORTS_START _scheduler_async,_map PURE_IMPORTS_END */


function timestamp(scheduler) {
    if (scheduler === void 0) {
        scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_0__["async"];
    }
    return Object(_map__WEBPACK_IMPORTED_MODULE_1__["map"])(function (value) { return new Timestamp(value, scheduler.now()); });
}
var Timestamp = /*@__PURE__*/ (function () {
    function Timestamp(value, timestamp) {
        this.value = value;
        this.timestamp = timestamp;
    }
    return Timestamp;
}());

//# sourceMappingURL=timestamp.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/toArray.js":
/*!****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/toArray.js ***!
  \****************************************************************/
/*! exports provided: toArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toArray", function() { return toArray; });
/* harmony import */ var _reduce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reduce */ "../node_modules/rxjs/_esm5/internal/operators/reduce.js");
/** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */

function toArrayReducer(arr, item, index) {
    if (index === 0) {
        return [item];
    }
    arr.push(item);
    return arr;
}
function toArray() {
    return Object(_reduce__WEBPACK_IMPORTED_MODULE_0__["reduce"])(toArrayReducer, []);
}
//# sourceMappingURL=toArray.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/window.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/window.js ***!
  \***************************************************************/
/*! exports provided: window */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "window", function() { return window; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subject */ "../node_modules/rxjs/_esm5/internal/Subject.js");
/* harmony import */ var _innerSubscribe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../innerSubscribe */ "../node_modules/rxjs/_esm5/internal/innerSubscribe.js");
/** PURE_IMPORTS_START tslib,_Subject,_innerSubscribe PURE_IMPORTS_END */



function window(windowBoundaries) {
    return function windowOperatorFunction(source) {
        return source.lift(new WindowOperator(windowBoundaries));
    };
}
var WindowOperator = /*@__PURE__*/ (function () {
    function WindowOperator(windowBoundaries) {
        this.windowBoundaries = windowBoundaries;
    }
    WindowOperator.prototype.call = function (subscriber, source) {
        var windowSubscriber = new WindowSubscriber(subscriber);
        var sourceSubscription = source.subscribe(windowSubscriber);
        if (!sourceSubscription.closed) {
            windowSubscriber.add(Object(_innerSubscribe__WEBPACK_IMPORTED_MODULE_2__["innerSubscribe"])(this.windowBoundaries, new _innerSubscribe__WEBPACK_IMPORTED_MODULE_2__["SimpleInnerSubscriber"](windowSubscriber)));
        }
        return sourceSubscription;
    };
    return WindowOperator;
}());
var WindowSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](WindowSubscriber, _super);
    function WindowSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.window = new _Subject__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        destination.next(_this.window);
        return _this;
    }
    WindowSubscriber.prototype.notifyNext = function () {
        this.openWindow();
    };
    WindowSubscriber.prototype.notifyError = function (error) {
        this._error(error);
    };
    WindowSubscriber.prototype.notifyComplete = function () {
        this._complete();
    };
    WindowSubscriber.prototype._next = function (value) {
        this.window.next(value);
    };
    WindowSubscriber.prototype._error = function (err) {
        this.window.error(err);
        this.destination.error(err);
    };
    WindowSubscriber.prototype._complete = function () {
        this.window.complete();
        this.destination.complete();
    };
    WindowSubscriber.prototype._unsubscribe = function () {
        this.window = null;
    };
    WindowSubscriber.prototype.openWindow = function () {
        var prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        var destination = this.destination;
        var newWindow = this.window = new _Subject__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        destination.next(newWindow);
    };
    return WindowSubscriber;
}(_innerSubscribe__WEBPACK_IMPORTED_MODULE_2__["SimpleOuterSubscriber"]));
//# sourceMappingURL=window.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/windowCount.js":
/*!********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/windowCount.js ***!
  \********************************************************************/
/*! exports provided: windowCount */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "windowCount", function() { return windowCount; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Subject */ "../node_modules/rxjs/_esm5/internal/Subject.js");
/** PURE_IMPORTS_START tslib,_Subscriber,_Subject PURE_IMPORTS_END */



function windowCount(windowSize, startWindowEvery) {
    if (startWindowEvery === void 0) {
        startWindowEvery = 0;
    }
    return function windowCountOperatorFunction(source) {
        return source.lift(new WindowCountOperator(windowSize, startWindowEvery));
    };
}
var WindowCountOperator = /*@__PURE__*/ (function () {
    function WindowCountOperator(windowSize, startWindowEvery) {
        this.windowSize = windowSize;
        this.startWindowEvery = startWindowEvery;
    }
    WindowCountOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new WindowCountSubscriber(subscriber, this.windowSize, this.startWindowEvery));
    };
    return WindowCountOperator;
}());
var WindowCountSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](WindowCountSubscriber, _super);
    function WindowCountSubscriber(destination, windowSize, startWindowEvery) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.windowSize = windowSize;
        _this.startWindowEvery = startWindowEvery;
        _this.windows = [new _Subject__WEBPACK_IMPORTED_MODULE_2__["Subject"]()];
        _this.count = 0;
        destination.next(_this.windows[0]);
        return _this;
    }
    WindowCountSubscriber.prototype._next = function (value) {
        var startWindowEvery = (this.startWindowEvery > 0) ? this.startWindowEvery : this.windowSize;
        var destination = this.destination;
        var windowSize = this.windowSize;
        var windows = this.windows;
        var len = windows.length;
        for (var i = 0; i < len && !this.closed; i++) {
            windows[i].next(value);
        }
        var c = this.count - windowSize + 1;
        if (c >= 0 && c % startWindowEvery === 0 && !this.closed) {
            windows.shift().complete();
        }
        if (++this.count % startWindowEvery === 0 && !this.closed) {
            var window_1 = new _Subject__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
            windows.push(window_1);
            destination.next(window_1);
        }
    };
    WindowCountSubscriber.prototype._error = function (err) {
        var windows = this.windows;
        if (windows) {
            while (windows.length > 0 && !this.closed) {
                windows.shift().error(err);
            }
        }
        this.destination.error(err);
    };
    WindowCountSubscriber.prototype._complete = function () {
        var windows = this.windows;
        if (windows) {
            while (windows.length > 0 && !this.closed) {
                windows.shift().complete();
            }
        }
        this.destination.complete();
    };
    WindowCountSubscriber.prototype._unsubscribe = function () {
        this.count = 0;
        this.windows = null;
    };
    return WindowCountSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__["Subscriber"]));
//# sourceMappingURL=windowCount.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/windowTime.js":
/*!*******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/windowTime.js ***!
  \*******************************************************************/
/*! exports provided: windowTime */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "windowTime", function() { return windowTime; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subject */ "../node_modules/rxjs/_esm5/internal/Subject.js");
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scheduler/async */ "../node_modules/rxjs/_esm5/internal/scheduler/async.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _util_isNumeric__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/isNumeric */ "../node_modules/rxjs/_esm5/internal/util/isNumeric.js");
/* harmony import */ var _util_isScheduler__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../util/isScheduler */ "../node_modules/rxjs/_esm5/internal/util/isScheduler.js");
/** PURE_IMPORTS_START tslib,_Subject,_scheduler_async,_Subscriber,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */






function windowTime(windowTimeSpan) {
    var scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_2__["async"];
    var windowCreationInterval = null;
    var maxWindowSize = Number.POSITIVE_INFINITY;
    if (Object(_util_isScheduler__WEBPACK_IMPORTED_MODULE_5__["isScheduler"])(arguments[3])) {
        scheduler = arguments[3];
    }
    if (Object(_util_isScheduler__WEBPACK_IMPORTED_MODULE_5__["isScheduler"])(arguments[2])) {
        scheduler = arguments[2];
    }
    else if (Object(_util_isNumeric__WEBPACK_IMPORTED_MODULE_4__["isNumeric"])(arguments[2])) {
        maxWindowSize = Number(arguments[2]);
    }
    if (Object(_util_isScheduler__WEBPACK_IMPORTED_MODULE_5__["isScheduler"])(arguments[1])) {
        scheduler = arguments[1];
    }
    else if (Object(_util_isNumeric__WEBPACK_IMPORTED_MODULE_4__["isNumeric"])(arguments[1])) {
        windowCreationInterval = Number(arguments[1]);
    }
    return function windowTimeOperatorFunction(source) {
        return source.lift(new WindowTimeOperator(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler));
    };
}
var WindowTimeOperator = /*@__PURE__*/ (function () {
    function WindowTimeOperator(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
        this.windowTimeSpan = windowTimeSpan;
        this.windowCreationInterval = windowCreationInterval;
        this.maxWindowSize = maxWindowSize;
        this.scheduler = scheduler;
    }
    WindowTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new WindowTimeSubscriber(subscriber, this.windowTimeSpan, this.windowCreationInterval, this.maxWindowSize, this.scheduler));
    };
    return WindowTimeOperator;
}());
var CountedSubject = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](CountedSubject, _super);
    function CountedSubject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._numberOfNextedValues = 0;
        return _this;
    }
    CountedSubject.prototype.next = function (value) {
        this._numberOfNextedValues++;
        _super.prototype.next.call(this, value);
    };
    Object.defineProperty(CountedSubject.prototype, "numberOfNextedValues", {
        get: function () {
            return this._numberOfNextedValues;
        },
        enumerable: true,
        configurable: true
    });
    return CountedSubject;
}(_Subject__WEBPACK_IMPORTED_MODULE_1__["Subject"]));
var WindowTimeSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](WindowTimeSubscriber, _super);
    function WindowTimeSubscriber(destination, windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.windowTimeSpan = windowTimeSpan;
        _this.windowCreationInterval = windowCreationInterval;
        _this.maxWindowSize = maxWindowSize;
        _this.scheduler = scheduler;
        _this.windows = [];
        var window = _this.openWindow();
        if (windowCreationInterval !== null && windowCreationInterval >= 0) {
            var closeState = { subscriber: _this, window: window, context: null };
            var creationState = { windowTimeSpan: windowTimeSpan, windowCreationInterval: windowCreationInterval, subscriber: _this, scheduler: scheduler };
            _this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
            _this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
        }
        else {
            var timeSpanOnlyState = { subscriber: _this, window: window, windowTimeSpan: windowTimeSpan };
            _this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
        }
        return _this;
    }
    WindowTimeSubscriber.prototype._next = function (value) {
        var windows = this.windows;
        var len = windows.length;
        for (var i = 0; i < len; i++) {
            var window_1 = windows[i];
            if (!window_1.closed) {
                window_1.next(value);
                if (window_1.numberOfNextedValues >= this.maxWindowSize) {
                    this.closeWindow(window_1);
                }
            }
        }
    };
    WindowTimeSubscriber.prototype._error = function (err) {
        var windows = this.windows;
        while (windows.length > 0) {
            windows.shift().error(err);
        }
        this.destination.error(err);
    };
    WindowTimeSubscriber.prototype._complete = function () {
        var windows = this.windows;
        while (windows.length > 0) {
            var window_2 = windows.shift();
            if (!window_2.closed) {
                window_2.complete();
            }
        }
        this.destination.complete();
    };
    WindowTimeSubscriber.prototype.openWindow = function () {
        var window = new CountedSubject();
        this.windows.push(window);
        var destination = this.destination;
        destination.next(window);
        return window;
    };
    WindowTimeSubscriber.prototype.closeWindow = function (window) {
        window.complete();
        var windows = this.windows;
        windows.splice(windows.indexOf(window), 1);
    };
    return WindowTimeSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_3__["Subscriber"]));
function dispatchWindowTimeSpanOnly(state) {
    var subscriber = state.subscriber, windowTimeSpan = state.windowTimeSpan, window = state.window;
    if (window) {
        subscriber.closeWindow(window);
    }
    state.window = subscriber.openWindow();
    this.schedule(state, windowTimeSpan);
}
function dispatchWindowCreation(state) {
    var windowTimeSpan = state.windowTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler, windowCreationInterval = state.windowCreationInterval;
    var window = subscriber.openWindow();
    var action = this;
    var context = { action: action, subscription: null };
    var timeSpanState = { subscriber: subscriber, window: window, context: context };
    context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
    action.add(context.subscription);
    action.schedule(state, windowCreationInterval);
}
function dispatchWindowClose(state) {
    var subscriber = state.subscriber, window = state.window, context = state.context;
    if (context && context.action && context.subscription) {
        context.action.remove(context.subscription);
    }
    subscriber.closeWindow(window);
}
//# sourceMappingURL=windowTime.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/windowToggle.js":
/*!*********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/windowToggle.js ***!
  \*********************************************************************/
/*! exports provided: windowToggle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "windowToggle", function() { return windowToggle; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subject */ "../node_modules/rxjs/_esm5/internal/Subject.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/* harmony import */ var _OuterSubscriber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../OuterSubscriber */ "../node_modules/rxjs/_esm5/internal/OuterSubscriber.js");
/* harmony import */ var _util_subscribeToResult__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/subscribeToResult */ "../node_modules/rxjs/_esm5/internal/util/subscribeToResult.js");
/** PURE_IMPORTS_START tslib,_Subject,_Subscription,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */





function windowToggle(openings, closingSelector) {
    return function (source) { return source.lift(new WindowToggleOperator(openings, closingSelector)); };
}
var WindowToggleOperator = /*@__PURE__*/ (function () {
    function WindowToggleOperator(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    WindowToggleOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new WindowToggleSubscriber(subscriber, this.openings, this.closingSelector));
    };
    return WindowToggleOperator;
}());
var WindowToggleSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](WindowToggleSubscriber, _super);
    function WindowToggleSubscriber(destination, openings, closingSelector) {
        var _this = _super.call(this, destination) || this;
        _this.openings = openings;
        _this.closingSelector = closingSelector;
        _this.contexts = [];
        _this.add(_this.openSubscription = Object(_util_subscribeToResult__WEBPACK_IMPORTED_MODULE_4__["subscribeToResult"])(_this, openings, openings));
        return _this;
    }
    WindowToggleSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        if (contexts) {
            var len = contexts.length;
            for (var i = 0; i < len; i++) {
                contexts[i].window.next(value);
            }
        }
    };
    WindowToggleSubscriber.prototype._error = function (err) {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context_1 = contexts[index];
                context_1.window.error(err);
                context_1.subscription.unsubscribe();
            }
        }
        _super.prototype._error.call(this, err);
    };
    WindowToggleSubscriber.prototype._complete = function () {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context_2 = contexts[index];
                context_2.window.complete();
                context_2.subscription.unsubscribe();
            }
        }
        _super.prototype._complete.call(this);
    };
    WindowToggleSubscriber.prototype._unsubscribe = function () {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context_3 = contexts[index];
                context_3.window.unsubscribe();
                context_3.subscription.unsubscribe();
            }
        }
    };
    WindowToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (outerValue === this.openings) {
            var closingNotifier = void 0;
            try {
                var closingSelector = this.closingSelector;
                closingNotifier = closingSelector(innerValue);
            }
            catch (e) {
                return this.error(e);
            }
            var window_1 = new _Subject__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
            var subscription = new _Subscription__WEBPACK_IMPORTED_MODULE_2__["Subscription"]();
            var context_4 = { window: window_1, subscription: subscription };
            this.contexts.push(context_4);
            var innerSubscription = Object(_util_subscribeToResult__WEBPACK_IMPORTED_MODULE_4__["subscribeToResult"])(this, closingNotifier, context_4);
            if (innerSubscription.closed) {
                this.closeWindow(this.contexts.length - 1);
            }
            else {
                innerSubscription.context = context_4;
                subscription.add(innerSubscription);
            }
            this.destination.next(window_1);
        }
        else {
            this.closeWindow(this.contexts.indexOf(outerValue));
        }
    };
    WindowToggleSubscriber.prototype.notifyError = function (err) {
        this.error(err);
    };
    WindowToggleSubscriber.prototype.notifyComplete = function (inner) {
        if (inner !== this.openSubscription) {
            this.closeWindow(this.contexts.indexOf(inner.context));
        }
    };
    WindowToggleSubscriber.prototype.closeWindow = function (index) {
        if (index === -1) {
            return;
        }
        var contexts = this.contexts;
        var context = contexts[index];
        var window = context.window, subscription = context.subscription;
        contexts.splice(index, 1);
        window.complete();
        subscription.unsubscribe();
    };
    return WindowToggleSubscriber;
}(_OuterSubscriber__WEBPACK_IMPORTED_MODULE_3__["OuterSubscriber"]));
//# sourceMappingURL=windowToggle.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/windowWhen.js":
/*!*******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/windowWhen.js ***!
  \*******************************************************************/
/*! exports provided: windowWhen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "windowWhen", function() { return windowWhen; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subject */ "../node_modules/rxjs/_esm5/internal/Subject.js");
/* harmony import */ var _OuterSubscriber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../OuterSubscriber */ "../node_modules/rxjs/_esm5/internal/OuterSubscriber.js");
/* harmony import */ var _util_subscribeToResult__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/subscribeToResult */ "../node_modules/rxjs/_esm5/internal/util/subscribeToResult.js");
/** PURE_IMPORTS_START tslib,_Subject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */




function windowWhen(closingSelector) {
    return function windowWhenOperatorFunction(source) {
        return source.lift(new WindowOperator(closingSelector));
    };
}
var WindowOperator = /*@__PURE__*/ (function () {
    function WindowOperator(closingSelector) {
        this.closingSelector = closingSelector;
    }
    WindowOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new WindowSubscriber(subscriber, this.closingSelector));
    };
    return WindowOperator;
}());
var WindowSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](WindowSubscriber, _super);
    function WindowSubscriber(destination, closingSelector) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.closingSelector = closingSelector;
        _this.openWindow();
        return _this;
    }
    WindowSubscriber.prototype.notifyNext = function (_outerValue, _innerValue, _outerIndex, _innerIndex, innerSub) {
        this.openWindow(innerSub);
    };
    WindowSubscriber.prototype.notifyError = function (error) {
        this._error(error);
    };
    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
        this.openWindow(innerSub);
    };
    WindowSubscriber.prototype._next = function (value) {
        this.window.next(value);
    };
    WindowSubscriber.prototype._error = function (err) {
        this.window.error(err);
        this.destination.error(err);
        this.unsubscribeClosingNotification();
    };
    WindowSubscriber.prototype._complete = function () {
        this.window.complete();
        this.destination.complete();
        this.unsubscribeClosingNotification();
    };
    WindowSubscriber.prototype.unsubscribeClosingNotification = function () {
        if (this.closingNotification) {
            this.closingNotification.unsubscribe();
        }
    };
    WindowSubscriber.prototype.openWindow = function (innerSub) {
        if (innerSub === void 0) {
            innerSub = null;
        }
        if (innerSub) {
            this.remove(innerSub);
            innerSub.unsubscribe();
        }
        var prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        var window = this.window = new _Subject__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.destination.next(window);
        var closingNotifier;
        try {
            var closingSelector = this.closingSelector;
            closingNotifier = closingSelector();
        }
        catch (e) {
            this.destination.error(e);
            this.window.error(e);
            return;
        }
        this.add(this.closingNotification = Object(_util_subscribeToResult__WEBPACK_IMPORTED_MODULE_3__["subscribeToResult"])(this, closingNotifier));
    };
    return WindowSubscriber;
}(_OuterSubscriber__WEBPACK_IMPORTED_MODULE_2__["OuterSubscriber"]));
//# sourceMappingURL=windowWhen.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/withLatestFrom.js":
/*!***********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/withLatestFrom.js ***!
  \***********************************************************************/
/*! exports provided: withLatestFrom */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withLatestFrom", function() { return withLatestFrom; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _OuterSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../OuterSubscriber */ "../node_modules/rxjs/_esm5/internal/OuterSubscriber.js");
/* harmony import */ var _util_subscribeToResult__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/subscribeToResult */ "../node_modules/rxjs/_esm5/internal/util/subscribeToResult.js");
/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */



function withLatestFrom() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (source) {
        var project;
        if (typeof args[args.length - 1] === 'function') {
            project = args.pop();
        }
        var observables = args;
        return source.lift(new WithLatestFromOperator(observables, project));
    };
}
var WithLatestFromOperator = /*@__PURE__*/ (function () {
    function WithLatestFromOperator(observables, project) {
        this.observables = observables;
        this.project = project;
    }
    WithLatestFromOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new WithLatestFromSubscriber(subscriber, this.observables, this.project));
    };
    return WithLatestFromOperator;
}());
var WithLatestFromSubscriber = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](WithLatestFromSubscriber, _super);
    function WithLatestFromSubscriber(destination, observables, project) {
        var _this = _super.call(this, destination) || this;
        _this.observables = observables;
        _this.project = project;
        _this.toRespond = [];
        var len = observables.length;
        _this.values = new Array(len);
        for (var i = 0; i < len; i++) {
            _this.toRespond.push(i);
        }
        for (var i = 0; i < len; i++) {
            var observable = observables[i];
            _this.add(Object(_util_subscribeToResult__WEBPACK_IMPORTED_MODULE_2__["subscribeToResult"])(_this, observable, undefined, i));
        }
        return _this;
    }
    WithLatestFromSubscriber.prototype.notifyNext = function (_outerValue, innerValue, outerIndex) {
        this.values[outerIndex] = innerValue;
        var toRespond = this.toRespond;
        if (toRespond.length > 0) {
            var found = toRespond.indexOf(outerIndex);
            if (found !== -1) {
                toRespond.splice(found, 1);
            }
        }
    };
    WithLatestFromSubscriber.prototype.notifyComplete = function () {
    };
    WithLatestFromSubscriber.prototype._next = function (value) {
        if (this.toRespond.length === 0) {
            var args = [value].concat(this.values);
            if (this.project) {
                this._tryProject(args);
            }
            else {
                this.destination.next(args);
            }
        }
    };
    WithLatestFromSubscriber.prototype._tryProject = function (args) {
        var result;
        try {
            result = this.project.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return WithLatestFromSubscriber;
}(_OuterSubscriber__WEBPACK_IMPORTED_MODULE_1__["OuterSubscriber"]));
//# sourceMappingURL=withLatestFrom.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/zip.js":
/*!************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/zip.js ***!
  \************************************************************/
/*! exports provided: zip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zip", function() { return zip; });
/* harmony import */ var _observable_zip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observable/zip */ "../node_modules/rxjs/_esm5/internal/observable/zip.js");
/** PURE_IMPORTS_START _observable_zip PURE_IMPORTS_END */

function zip() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    return function zipOperatorFunction(source) {
        return source.lift.call(_observable_zip__WEBPACK_IMPORTED_MODULE_0__["zip"].apply(void 0, [source].concat(observables)));
    };
}
//# sourceMappingURL=zip.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/operators/zipAll.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/operators/zipAll.js ***!
  \***************************************************************/
/*! exports provided: zipAll */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zipAll", function() { return zipAll; });
/* harmony import */ var _observable_zip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observable/zip */ "../node_modules/rxjs/_esm5/internal/observable/zip.js");
/** PURE_IMPORTS_START _observable_zip PURE_IMPORTS_END */

function zipAll(project) {
    return function (source) { return source.lift(new _observable_zip__WEBPACK_IMPORTED_MODULE_0__["ZipOperator"](project)); };
}
//# sourceMappingURL=zipAll.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduled/scheduleArray.js":
/*!**********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduled/scheduleArray.js ***!
  \**********************************************************************/
/*! exports provided: scheduleArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scheduleArray", function() { return scheduleArray; });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */


function scheduleArray(input, scheduler) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"](function (subscriber) {
        var sub = new _Subscription__WEBPACK_IMPORTED_MODULE_1__["Subscription"]();
        var i = 0;
        sub.add(scheduler.schedule(function () {
            if (i === input.length) {
                subscriber.complete();
                return;
            }
            subscriber.next(input[i++]);
            if (!subscriber.closed) {
                sub.add(this.schedule());
            }
        }));
        return sub;
    });
}
//# sourceMappingURL=scheduleArray.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduled/scheduleIterable.js":
/*!*************************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduled/scheduleIterable.js ***!
  \*************************************************************************/
/*! exports provided: scheduleIterable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scheduleIterable", function() { return scheduleIterable; });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/* harmony import */ var _symbol_iterator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../symbol/iterator */ "../node_modules/rxjs/_esm5/internal/symbol/iterator.js");
/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator PURE_IMPORTS_END */



function scheduleIterable(input, scheduler) {
    if (!input) {
        throw new Error('Iterable cannot be null');
    }
    return new _Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"](function (subscriber) {
        var sub = new _Subscription__WEBPACK_IMPORTED_MODULE_1__["Subscription"]();
        var iterator;
        sub.add(function () {
            if (iterator && typeof iterator.return === 'function') {
                iterator.return();
            }
        });
        sub.add(scheduler.schedule(function () {
            iterator = input[_symbol_iterator__WEBPACK_IMPORTED_MODULE_2__["iterator"]]();
            sub.add(scheduler.schedule(function () {
                if (subscriber.closed) {
                    return;
                }
                var value;
                var done;
                try {
                    var result = iterator.next();
                    value = result.value;
                    done = result.done;
                }
                catch (err) {
                    subscriber.error(err);
                    return;
                }
                if (done) {
                    subscriber.complete();
                }
                else {
                    subscriber.next(value);
                    this.schedule();
                }
            }));
        }));
        return sub;
    });
}
//# sourceMappingURL=scheduleIterable.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduled/scheduleObservable.js":
/*!***************************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduled/scheduleObservable.js ***!
  \***************************************************************************/
/*! exports provided: scheduleObservable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scheduleObservable", function() { return scheduleObservable; });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/* harmony import */ var _symbol_observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../symbol/observable */ "../node_modules/rxjs/_esm5/internal/symbol/observable.js");
/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable PURE_IMPORTS_END */



function scheduleObservable(input, scheduler) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"](function (subscriber) {
        var sub = new _Subscription__WEBPACK_IMPORTED_MODULE_1__["Subscription"]();
        sub.add(scheduler.schedule(function () {
            var observable = input[_symbol_observable__WEBPACK_IMPORTED_MODULE_2__["observable"]]();
            sub.add(observable.subscribe({
                next: function (value) { sub.add(scheduler.schedule(function () { return subscriber.next(value); })); },
                error: function (err) { sub.add(scheduler.schedule(function () { return subscriber.error(err); })); },
                complete: function () { sub.add(scheduler.schedule(function () { return subscriber.complete(); })); },
            }));
        }));
        return sub;
    });
}
//# sourceMappingURL=scheduleObservable.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduled/schedulePromise.js":
/*!************************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduled/schedulePromise.js ***!
  \************************************************************************/
/*! exports provided: schedulePromise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "schedulePromise", function() { return schedulePromise; });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */


function schedulePromise(input, scheduler) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"](function (subscriber) {
        var sub = new _Subscription__WEBPACK_IMPORTED_MODULE_1__["Subscription"]();
        sub.add(scheduler.schedule(function () {
            return input.then(function (value) {
                sub.add(scheduler.schedule(function () {
                    subscriber.next(value);
                    sub.add(scheduler.schedule(function () { return subscriber.complete(); }));
                }));
            }, function (err) {
                sub.add(scheduler.schedule(function () { return subscriber.error(err); }));
            });
        }));
        return sub;
    });
}
//# sourceMappingURL=schedulePromise.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduled/scheduled.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduled/scheduled.js ***!
  \******************************************************************/
/*! exports provided: scheduled */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scheduled", function() { return scheduled; });
/* harmony import */ var _scheduleObservable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scheduleObservable */ "../node_modules/rxjs/_esm5/internal/scheduled/scheduleObservable.js");
/* harmony import */ var _schedulePromise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./schedulePromise */ "../node_modules/rxjs/_esm5/internal/scheduled/schedulePromise.js");
/* harmony import */ var _scheduleArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scheduleArray */ "../node_modules/rxjs/_esm5/internal/scheduled/scheduleArray.js");
/* harmony import */ var _scheduleIterable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scheduleIterable */ "../node_modules/rxjs/_esm5/internal/scheduled/scheduleIterable.js");
/* harmony import */ var _util_isInteropObservable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/isInteropObservable */ "../node_modules/rxjs/_esm5/internal/util/isInteropObservable.js");
/* harmony import */ var _util_isPromise__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../util/isPromise */ "../node_modules/rxjs/_esm5/internal/util/isPromise.js");
/* harmony import */ var _util_isArrayLike__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../util/isArrayLike */ "../node_modules/rxjs/_esm5/internal/util/isArrayLike.js");
/* harmony import */ var _util_isIterable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../util/isIterable */ "../node_modules/rxjs/_esm5/internal/util/isIterable.js");
/** PURE_IMPORTS_START _scheduleObservable,_schedulePromise,_scheduleArray,_scheduleIterable,_util_isInteropObservable,_util_isPromise,_util_isArrayLike,_util_isIterable PURE_IMPORTS_END */








function scheduled(input, scheduler) {
    if (input != null) {
        if (Object(_util_isInteropObservable__WEBPACK_IMPORTED_MODULE_4__["isInteropObservable"])(input)) {
            return Object(_scheduleObservable__WEBPACK_IMPORTED_MODULE_0__["scheduleObservable"])(input, scheduler);
        }
        else if (Object(_util_isPromise__WEBPACK_IMPORTED_MODULE_5__["isPromise"])(input)) {
            return Object(_schedulePromise__WEBPACK_IMPORTED_MODULE_1__["schedulePromise"])(input, scheduler);
        }
        else if (Object(_util_isArrayLike__WEBPACK_IMPORTED_MODULE_6__["isArrayLike"])(input)) {
            return Object(_scheduleArray__WEBPACK_IMPORTED_MODULE_2__["scheduleArray"])(input, scheduler);
        }
        else if (Object(_util_isIterable__WEBPACK_IMPORTED_MODULE_7__["isIterable"])(input) || typeof input === 'string') {
            return Object(_scheduleIterable__WEBPACK_IMPORTED_MODULE_3__["scheduleIterable"])(input, scheduler);
        }
    }
    throw new TypeError((input !== null && typeof input || input) + ' is not observable');
}
//# sourceMappingURL=scheduled.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduler/Action.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduler/Action.js ***!
  \***************************************************************/
/*! exports provided: Action */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Action", function() { return Action; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscription */ "../node_modules/rxjs/_esm5/internal/Subscription.js");
/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */


var Action = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](Action, _super);
    function Action(scheduler, work) {
        return _super.call(this) || this;
    }
    Action.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        return this;
    };
    return Action;
}(_Subscription__WEBPACK_IMPORTED_MODULE_1__["Subscription"]));

//# sourceMappingURL=Action.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduler/AsapAction.js":
/*!*******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduler/AsapAction.js ***!
  \*******************************************************************/
/*! exports provided: AsapAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsapAction", function() { return AsapAction; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _util_Immediate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/Immediate */ "../node_modules/rxjs/_esm5/internal/util/Immediate.js");
/* harmony import */ var _AsyncAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AsyncAction */ "../node_modules/rxjs/_esm5/internal/scheduler/AsyncAction.js");
/** PURE_IMPORTS_START tslib,_util_Immediate,_AsyncAction PURE_IMPORTS_END */



var AsapAction = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](AsapAction, _super);
    function AsapAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
    }
    AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay !== null && delay > 0) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        scheduler.actions.push(this);
        return scheduler.scheduled || (scheduler.scheduled = _util_Immediate__WEBPACK_IMPORTED_MODULE_1__["Immediate"].setImmediate(scheduler.flush.bind(scheduler, null)));
    };
    AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
        }
        if (scheduler.actions.length === 0) {
            _util_Immediate__WEBPACK_IMPORTED_MODULE_1__["Immediate"].clearImmediate(id);
            scheduler.scheduled = undefined;
        }
        return undefined;
    };
    return AsapAction;
}(_AsyncAction__WEBPACK_IMPORTED_MODULE_2__["AsyncAction"]));

//# sourceMappingURL=AsapAction.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduler/AsapScheduler.js":
/*!**********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduler/AsapScheduler.js ***!
  \**********************************************************************/
/*! exports provided: AsapScheduler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsapScheduler", function() { return AsapScheduler; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _AsyncScheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AsyncScheduler */ "../node_modules/rxjs/_esm5/internal/scheduler/AsyncScheduler.js");
/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */


var AsapScheduler = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](AsapScheduler, _super);
    function AsapScheduler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AsapScheduler.prototype.flush = function (action) {
        this.active = true;
        this.scheduled = undefined;
        var actions = this.actions;
        var error;
        var index = -1;
        var count = actions.length;
        action = action || actions.shift();
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (++index < count && (action = actions.shift()));
        this.active = false;
        if (error) {
            while (++index < count && (action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AsapScheduler;
}(_AsyncScheduler__WEBPACK_IMPORTED_MODULE_1__["AsyncScheduler"]));

//# sourceMappingURL=AsapScheduler.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduler/AsyncAction.js":
/*!********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduler/AsyncAction.js ***!
  \********************************************************************/
/*! exports provided: AsyncAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncAction", function() { return AsyncAction; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Action */ "../node_modules/rxjs/_esm5/internal/scheduler/Action.js");
/** PURE_IMPORTS_START tslib,_Action PURE_IMPORTS_END */


var AsyncAction = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](AsyncAction, _super);
    function AsyncAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        _this.pending = false;
        return _this;
    }
    AsyncAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (this.closed) {
            return this;
        }
        this.state = state;
        var id = this.id;
        var scheduler = this.scheduler;
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
        }
        this.pending = true;
        this.delay = delay;
        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
        return this;
    };
    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        return setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay !== null && this.delay === delay && this.pending === false) {
            return id;
        }
        clearInterval(id);
        return undefined;
    };
    AsyncAction.prototype.execute = function (state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        var error = this._execute(state, delay);
        if (error) {
            return error;
        }
        else if (this.pending === false && this.id != null) {
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
    };
    AsyncAction.prototype._execute = function (state, delay) {
        var errored = false;
        var errorValue = undefined;
        try {
            this.work(state);
        }
        catch (e) {
            errored = true;
            errorValue = !!e && e || new Error(e);
        }
        if (errored) {
            this.unsubscribe();
            return errorValue;
        }
    };
    AsyncAction.prototype._unsubscribe = function () {
        var id = this.id;
        var scheduler = this.scheduler;
        var actions = scheduler.actions;
        var index = actions.indexOf(this);
        this.work = null;
        this.state = null;
        this.pending = false;
        this.scheduler = null;
        if (index !== -1) {
            actions.splice(index, 1);
        }
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, null);
        }
        this.delay = null;
    };
    return AsyncAction;
}(_Action__WEBPACK_IMPORTED_MODULE_1__["Action"]));

//# sourceMappingURL=AsyncAction.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduler/AsyncScheduler.js":
/*!***********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduler/AsyncScheduler.js ***!
  \***********************************************************************/
/*! exports provided: AsyncScheduler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncScheduler", function() { return AsyncScheduler; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Scheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Scheduler */ "../node_modules/rxjs/_esm5/internal/Scheduler.js");
/** PURE_IMPORTS_START tslib,_Scheduler PURE_IMPORTS_END */


var AsyncScheduler = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](AsyncScheduler, _super);
    function AsyncScheduler(SchedulerAction, now) {
        if (now === void 0) {
            now = _Scheduler__WEBPACK_IMPORTED_MODULE_1__["Scheduler"].now;
        }
        var _this = _super.call(this, SchedulerAction, function () {
            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
                return AsyncScheduler.delegate.now();
            }
            else {
                return now();
            }
        }) || this;
        _this.actions = [];
        _this.active = false;
        _this.scheduled = undefined;
        return _this;
    }
    AsyncScheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) {
            delay = 0;
        }
        if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
            return AsyncScheduler.delegate.schedule(work, delay, state);
        }
        else {
            return _super.prototype.schedule.call(this, work, delay, state);
        }
    };
    AsyncScheduler.prototype.flush = function (action) {
        var actions = this.actions;
        if (this.active) {
            actions.push(action);
            return;
        }
        var error;
        this.active = true;
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (action = actions.shift());
        this.active = false;
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AsyncScheduler;
}(_Scheduler__WEBPACK_IMPORTED_MODULE_1__["Scheduler"]));

//# sourceMappingURL=AsyncScheduler.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduler/QueueAction.js":
/*!********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduler/QueueAction.js ***!
  \********************************************************************/
/*! exports provided: QueueAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueueAction", function() { return QueueAction; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _AsyncAction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AsyncAction */ "../node_modules/rxjs/_esm5/internal/scheduler/AsyncAction.js");
/** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */


var QueueAction = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](QueueAction, _super);
    function QueueAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
    }
    QueueAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay > 0) {
            return _super.prototype.schedule.call(this, state, delay);
        }
        this.delay = delay;
        this.state = state;
        this.scheduler.flush(this);
        return this;
    };
    QueueAction.prototype.execute = function (state, delay) {
        return (delay > 0 || this.closed) ?
            _super.prototype.execute.call(this, state, delay) :
            this._execute(state, delay);
    };
    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        return scheduler.flush(this);
    };
    return QueueAction;
}(_AsyncAction__WEBPACK_IMPORTED_MODULE_1__["AsyncAction"]));

//# sourceMappingURL=QueueAction.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduler/QueueScheduler.js":
/*!***********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduler/QueueScheduler.js ***!
  \***********************************************************************/
/*! exports provided: QueueScheduler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueueScheduler", function() { return QueueScheduler; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _AsyncScheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AsyncScheduler */ "../node_modules/rxjs/_esm5/internal/scheduler/AsyncScheduler.js");
/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */


var QueueScheduler = /*@__PURE__*/ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](QueueScheduler, _super);
    function QueueScheduler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueueScheduler;
}(_AsyncScheduler__WEBPACK_IMPORTED_MODULE_1__["AsyncScheduler"]));

//# sourceMappingURL=QueueScheduler.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduler/asap.js":
/*!*************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduler/asap.js ***!
  \*************************************************************/
/*! exports provided: asapScheduler, asap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "asapScheduler", function() { return asapScheduler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "asap", function() { return asap; });
/* harmony import */ var _AsapAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AsapAction */ "../node_modules/rxjs/_esm5/internal/scheduler/AsapAction.js");
/* harmony import */ var _AsapScheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AsapScheduler */ "../node_modules/rxjs/_esm5/internal/scheduler/AsapScheduler.js");
/** PURE_IMPORTS_START _AsapAction,_AsapScheduler PURE_IMPORTS_END */


var asapScheduler = /*@__PURE__*/ new _AsapScheduler__WEBPACK_IMPORTED_MODULE_1__["AsapScheduler"](_AsapAction__WEBPACK_IMPORTED_MODULE_0__["AsapAction"]);
var asap = asapScheduler;
//# sourceMappingURL=asap.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduler/async.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduler/async.js ***!
  \**************************************************************/
/*! exports provided: asyncScheduler, async */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "asyncScheduler", function() { return asyncScheduler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "async", function() { return async; });
/* harmony import */ var _AsyncAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AsyncAction */ "../node_modules/rxjs/_esm5/internal/scheduler/AsyncAction.js");
/* harmony import */ var _AsyncScheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AsyncScheduler */ "../node_modules/rxjs/_esm5/internal/scheduler/AsyncScheduler.js");
/** PURE_IMPORTS_START _AsyncAction,_AsyncScheduler PURE_IMPORTS_END */


var asyncScheduler = /*@__PURE__*/ new _AsyncScheduler__WEBPACK_IMPORTED_MODULE_1__["AsyncScheduler"](_AsyncAction__WEBPACK_IMPORTED_MODULE_0__["AsyncAction"]);
var async = asyncScheduler;
//# sourceMappingURL=async.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/scheduler/queue.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/scheduler/queue.js ***!
  \**************************************************************/
/*! exports provided: queueScheduler, queue */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "queueScheduler", function() { return queueScheduler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "queue", function() { return queue; });
/* harmony import */ var _QueueAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./QueueAction */ "../node_modules/rxjs/_esm5/internal/scheduler/QueueAction.js");
/* harmony import */ var _QueueScheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./QueueScheduler */ "../node_modules/rxjs/_esm5/internal/scheduler/QueueScheduler.js");
/** PURE_IMPORTS_START _QueueAction,_QueueScheduler PURE_IMPORTS_END */


var queueScheduler = /*@__PURE__*/ new _QueueScheduler__WEBPACK_IMPORTED_MODULE_1__["QueueScheduler"](_QueueAction__WEBPACK_IMPORTED_MODULE_0__["QueueAction"]);
var queue = queueScheduler;
//# sourceMappingURL=queue.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/symbol/iterator.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/symbol/iterator.js ***!
  \**************************************************************/
/*! exports provided: getSymbolIterator, iterator, $$iterator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSymbolIterator", function() { return getSymbolIterator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iterator", function() { return iterator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$$iterator", function() { return $$iterator; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function getSymbolIterator() {
    if (typeof Symbol !== 'function' || !Symbol.iterator) {
        return '@@iterator';
    }
    return Symbol.iterator;
}
var iterator = /*@__PURE__*/ getSymbolIterator();
var $$iterator = iterator;
//# sourceMappingURL=iterator.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/symbol/observable.js":
/*!****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/symbol/observable.js ***!
  \****************************************************************/
/*! exports provided: observable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "observable", function() { return observable; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var observable = /*@__PURE__*/ (function () { return typeof Symbol === 'function' && Symbol.observable || '@@observable'; })();
//# sourceMappingURL=observable.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/symbol/rxSubscriber.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/symbol/rxSubscriber.js ***!
  \******************************************************************/
/*! exports provided: rxSubscriber, $$rxSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rxSubscriber", function() { return rxSubscriber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$$rxSubscriber", function() { return $$rxSubscriber; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var rxSubscriber = /*@__PURE__*/ (function () {
    return typeof Symbol === 'function'
        ? /*@__PURE__*/ Symbol('rxSubscriber')
        : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();
})();
var $$rxSubscriber = rxSubscriber;
//# sourceMappingURL=rxSubscriber.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/ArgumentOutOfRangeError.js":
/*!***************************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/ArgumentOutOfRangeError.js ***!
  \***************************************************************************/
/*! exports provided: ArgumentOutOfRangeError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArgumentOutOfRangeError", function() { return ArgumentOutOfRangeError; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var ArgumentOutOfRangeErrorImpl = /*@__PURE__*/ (function () {
    function ArgumentOutOfRangeErrorImpl() {
        Error.call(this);
        this.message = 'argument out of range';
        this.name = 'ArgumentOutOfRangeError';
        return this;
    }
    ArgumentOutOfRangeErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
    return ArgumentOutOfRangeErrorImpl;
})();
var ArgumentOutOfRangeError = ArgumentOutOfRangeErrorImpl;
//# sourceMappingURL=ArgumentOutOfRangeError.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/EmptyError.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/EmptyError.js ***!
  \**************************************************************/
/*! exports provided: EmptyError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmptyError", function() { return EmptyError; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var EmptyErrorImpl = /*@__PURE__*/ (function () {
    function EmptyErrorImpl() {
        Error.call(this);
        this.message = 'no elements in sequence';
        this.name = 'EmptyError';
        return this;
    }
    EmptyErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
    return EmptyErrorImpl;
})();
var EmptyError = EmptyErrorImpl;
//# sourceMappingURL=EmptyError.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/Immediate.js":
/*!*************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/Immediate.js ***!
  \*************************************************************/
/*! exports provided: Immediate, TestTools */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Immediate", function() { return Immediate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TestTools", function() { return TestTools; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var nextHandle = 1;
var RESOLVED = /*@__PURE__*/ (function () { return /*@__PURE__*/ Promise.resolve(); })();
var activeHandles = {};
function findAndClearHandle(handle) {
    if (handle in activeHandles) {
        delete activeHandles[handle];
        return true;
    }
    return false;
}
var Immediate = {
    setImmediate: function (cb) {
        var handle = nextHandle++;
        activeHandles[handle] = true;
        RESOLVED.then(function () { return findAndClearHandle(handle) && cb(); });
        return handle;
    },
    clearImmediate: function (handle) {
        findAndClearHandle(handle);
    },
};
var TestTools = {
    pending: function () {
        return Object.keys(activeHandles).length;
    }
};
//# sourceMappingURL=Immediate.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/ObjectUnsubscribedError.js":
/*!***************************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/ObjectUnsubscribedError.js ***!
  \***************************************************************************/
/*! exports provided: ObjectUnsubscribedError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObjectUnsubscribedError", function() { return ObjectUnsubscribedError; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var ObjectUnsubscribedErrorImpl = /*@__PURE__*/ (function () {
    function ObjectUnsubscribedErrorImpl() {
        Error.call(this);
        this.message = 'object unsubscribed';
        this.name = 'ObjectUnsubscribedError';
        return this;
    }
    ObjectUnsubscribedErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
    return ObjectUnsubscribedErrorImpl;
})();
var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;
//# sourceMappingURL=ObjectUnsubscribedError.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/TimeoutError.js":
/*!****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/TimeoutError.js ***!
  \****************************************************************/
/*! exports provided: TimeoutError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimeoutError", function() { return TimeoutError; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var TimeoutErrorImpl = /*@__PURE__*/ (function () {
    function TimeoutErrorImpl() {
        Error.call(this);
        this.message = 'Timeout has occurred';
        this.name = 'TimeoutError';
        return this;
    }
    TimeoutErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
    return TimeoutErrorImpl;
})();
var TimeoutError = TimeoutErrorImpl;
//# sourceMappingURL=TimeoutError.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/UnsubscriptionError.js":
/*!***********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/UnsubscriptionError.js ***!
  \***********************************************************************/
/*! exports provided: UnsubscriptionError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UnsubscriptionError", function() { return UnsubscriptionError; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var UnsubscriptionErrorImpl = /*@__PURE__*/ (function () {
    function UnsubscriptionErrorImpl(errors) {
        Error.call(this);
        this.message = errors ?
            errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
        return this;
    }
    UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
    return UnsubscriptionErrorImpl;
})();
var UnsubscriptionError = UnsubscriptionErrorImpl;
//# sourceMappingURL=UnsubscriptionError.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/canReportError.js":
/*!******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/canReportError.js ***!
  \******************************************************************/
/*! exports provided: canReportError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "canReportError", function() { return canReportError; });
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */

function canReportError(observer) {
    while (observer) {
        var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
        if (closed_1 || isStopped) {
            return false;
        }
        else if (destination && destination instanceof _Subscriber__WEBPACK_IMPORTED_MODULE_0__["Subscriber"]) {
            observer = destination;
        }
        else {
            observer = null;
        }
    }
    return true;
}
//# sourceMappingURL=canReportError.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/hostReportError.js":
/*!*******************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/hostReportError.js ***!
  \*******************************************************************/
/*! exports provided: hostReportError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hostReportError", function() { return hostReportError; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function hostReportError(err) {
    setTimeout(function () { throw err; }, 0);
}
//# sourceMappingURL=hostReportError.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/identity.js":
/*!************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/identity.js ***!
  \************************************************************/
/*! exports provided: identity */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "identity", function() { return identity; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function identity(x) {
    return x;
}
//# sourceMappingURL=identity.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/isArray.js":
/*!***********************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/isArray.js ***!
  \***********************************************************/
/*! exports provided: isArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isArray", function() { return isArray; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArray = /*@__PURE__*/ (function () { return Array.isArray || (function (x) { return x && typeof x.length === 'number'; }); })();
//# sourceMappingURL=isArray.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/isArrayLike.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/isArrayLike.js ***!
  \***************************************************************/
/*! exports provided: isArrayLike */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isArrayLike", function() { return isArrayLike; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });
//# sourceMappingURL=isArrayLike.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/isDate.js":
/*!**********************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/isDate.js ***!
  \**********************************************************/
/*! exports provided: isDate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDate", function() { return isDate; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isDate(value) {
    return value instanceof Date && !isNaN(+value);
}
//# sourceMappingURL=isDate.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/isFunction.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/isFunction.js ***!
  \**************************************************************/
/*! exports provided: isFunction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isFunction", function() { return isFunction; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isFunction(x) {
    return typeof x === 'function';
}
//# sourceMappingURL=isFunction.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/isInteropObservable.js":
/*!***********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/isInteropObservable.js ***!
  \***********************************************************************/
/*! exports provided: isInteropObservable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isInteropObservable", function() { return isInteropObservable; });
/* harmony import */ var _symbol_observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../symbol/observable */ "../node_modules/rxjs/_esm5/internal/symbol/observable.js");
/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */

function isInteropObservable(input) {
    return input && typeof input[_symbol_observable__WEBPACK_IMPORTED_MODULE_0__["observable"]] === 'function';
}
//# sourceMappingURL=isInteropObservable.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/isIterable.js":
/*!**************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/isIterable.js ***!
  \**************************************************************/
/*! exports provided: isIterable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isIterable", function() { return isIterable; });
/* harmony import */ var _symbol_iterator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../symbol/iterator */ "../node_modules/rxjs/_esm5/internal/symbol/iterator.js");
/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */

function isIterable(input) {
    return input && typeof input[_symbol_iterator__WEBPACK_IMPORTED_MODULE_0__["iterator"]] === 'function';
}
//# sourceMappingURL=isIterable.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/isNumeric.js":
/*!*************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/isNumeric.js ***!
  \*************************************************************/
/*! exports provided: isNumeric */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNumeric", function() { return isNumeric; });
/* harmony import */ var _isArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray */ "../node_modules/rxjs/_esm5/internal/util/isArray.js");
/** PURE_IMPORTS_START _isArray PURE_IMPORTS_END */

function isNumeric(val) {
    return !Object(_isArray__WEBPACK_IMPORTED_MODULE_0__["isArray"])(val) && (val - parseFloat(val) + 1) >= 0;
}
//# sourceMappingURL=isNumeric.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/isObject.js":
/*!************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/isObject.js ***!
  \************************************************************/
/*! exports provided: isObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isObject", function() { return isObject; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isObject(x) {
    return x !== null && typeof x === 'object';
}
//# sourceMappingURL=isObject.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/isPromise.js":
/*!*************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/isPromise.js ***!
  \*************************************************************/
/*! exports provided: isPromise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPromise", function() { return isPromise; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isPromise(value) {
    return !!value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}
//# sourceMappingURL=isPromise.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/isScheduler.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/isScheduler.js ***!
  \***************************************************************/
/*! exports provided: isScheduler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isScheduler", function() { return isScheduler; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isScheduler(value) {
    return value && typeof value.schedule === 'function';
}
//# sourceMappingURL=isScheduler.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/noop.js":
/*!********************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/noop.js ***!
  \********************************************************/
/*! exports provided: noop */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "noop", function() { return noop; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function noop() { }
//# sourceMappingURL=noop.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/not.js":
/*!*******************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/not.js ***!
  \*******************************************************/
/*! exports provided: not */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "not", function() { return not; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function not(pred, thisArg) {
    function notPred() {
        return !(notPred.pred.apply(notPred.thisArg, arguments));
    }
    notPred.pred = pred;
    notPred.thisArg = thisArg;
    return notPred;
}
//# sourceMappingURL=not.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/pipe.js":
/*!********************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/pipe.js ***!
  \********************************************************/
/*! exports provided: pipe, pipeFromArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pipe", function() { return pipe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pipeFromArray", function() { return pipeFromArray; });
/* harmony import */ var _identity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./identity */ "../node_modules/rxjs/_esm5/internal/util/identity.js");
/** PURE_IMPORTS_START _identity PURE_IMPORTS_END */

function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return pipeFromArray(fns);
}
function pipeFromArray(fns) {
    if (fns.length === 0) {
        return _identity__WEBPACK_IMPORTED_MODULE_0__["identity"];
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}
//# sourceMappingURL=pipe.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/subscribeTo.js":
/*!***************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/subscribeTo.js ***!
  \***************************************************************/
/*! exports provided: subscribeTo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subscribeTo", function() { return subscribeTo; });
/* harmony import */ var _subscribeToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./subscribeToArray */ "../node_modules/rxjs/_esm5/internal/util/subscribeToArray.js");
/* harmony import */ var _subscribeToPromise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subscribeToPromise */ "../node_modules/rxjs/_esm5/internal/util/subscribeToPromise.js");
/* harmony import */ var _subscribeToIterable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./subscribeToIterable */ "../node_modules/rxjs/_esm5/internal/util/subscribeToIterable.js");
/* harmony import */ var _subscribeToObservable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./subscribeToObservable */ "../node_modules/rxjs/_esm5/internal/util/subscribeToObservable.js");
/* harmony import */ var _isArrayLike__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isArrayLike */ "../node_modules/rxjs/_esm5/internal/util/isArrayLike.js");
/* harmony import */ var _isPromise__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isPromise */ "../node_modules/rxjs/_esm5/internal/util/isPromise.js");
/* harmony import */ var _isObject__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isObject */ "../node_modules/rxjs/_esm5/internal/util/isObject.js");
/* harmony import */ var _symbol_iterator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../symbol/iterator */ "../node_modules/rxjs/_esm5/internal/symbol/iterator.js");
/* harmony import */ var _symbol_observable__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../symbol/observable */ "../node_modules/rxjs/_esm5/internal/symbol/observable.js");
/** PURE_IMPORTS_START _subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */









var subscribeTo = function (result) {
    if (!!result && typeof result[_symbol_observable__WEBPACK_IMPORTED_MODULE_8__["observable"]] === 'function') {
        return Object(_subscribeToObservable__WEBPACK_IMPORTED_MODULE_3__["subscribeToObservable"])(result);
    }
    else if (Object(_isArrayLike__WEBPACK_IMPORTED_MODULE_4__["isArrayLike"])(result)) {
        return Object(_subscribeToArray__WEBPACK_IMPORTED_MODULE_0__["subscribeToArray"])(result);
    }
    else if (Object(_isPromise__WEBPACK_IMPORTED_MODULE_5__["isPromise"])(result)) {
        return Object(_subscribeToPromise__WEBPACK_IMPORTED_MODULE_1__["subscribeToPromise"])(result);
    }
    else if (!!result && typeof result[_symbol_iterator__WEBPACK_IMPORTED_MODULE_7__["iterator"]] === 'function') {
        return Object(_subscribeToIterable__WEBPACK_IMPORTED_MODULE_2__["subscribeToIterable"])(result);
    }
    else {
        var value = Object(_isObject__WEBPACK_IMPORTED_MODULE_6__["isObject"])(result) ? 'an invalid object' : "'" + result + "'";
        var msg = "You provided " + value + " where a stream was expected."
            + ' You can provide an Observable, Promise, Array, or Iterable.';
        throw new TypeError(msg);
    }
};
//# sourceMappingURL=subscribeTo.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/subscribeToArray.js":
/*!********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/subscribeToArray.js ***!
  \********************************************************************/
/*! exports provided: subscribeToArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subscribeToArray", function() { return subscribeToArray; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var subscribeToArray = function (array) {
    return function (subscriber) {
        for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
            subscriber.next(array[i]);
        }
        subscriber.complete();
    };
};
//# sourceMappingURL=subscribeToArray.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/subscribeToIterable.js":
/*!***********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/subscribeToIterable.js ***!
  \***********************************************************************/
/*! exports provided: subscribeToIterable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subscribeToIterable", function() { return subscribeToIterable; });
/* harmony import */ var _symbol_iterator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../symbol/iterator */ "../node_modules/rxjs/_esm5/internal/symbol/iterator.js");
/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */

var subscribeToIterable = function (iterable) {
    return function (subscriber) {
        var iterator = iterable[_symbol_iterator__WEBPACK_IMPORTED_MODULE_0__["iterator"]]();
        do {
            var item = void 0;
            try {
                item = iterator.next();
            }
            catch (err) {
                subscriber.error(err);
                return subscriber;
            }
            if (item.done) {
                subscriber.complete();
                break;
            }
            subscriber.next(item.value);
            if (subscriber.closed) {
                break;
            }
        } while (true);
        if (typeof iterator.return === 'function') {
            subscriber.add(function () {
                if (iterator.return) {
                    iterator.return();
                }
            });
        }
        return subscriber;
    };
};
//# sourceMappingURL=subscribeToIterable.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/subscribeToObservable.js":
/*!*************************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/subscribeToObservable.js ***!
  \*************************************************************************/
/*! exports provided: subscribeToObservable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subscribeToObservable", function() { return subscribeToObservable; });
/* harmony import */ var _symbol_observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../symbol/observable */ "../node_modules/rxjs/_esm5/internal/symbol/observable.js");
/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */

var subscribeToObservable = function (obj) {
    return function (subscriber) {
        var obs = obj[_symbol_observable__WEBPACK_IMPORTED_MODULE_0__["observable"]]();
        if (typeof obs.subscribe !== 'function') {
            throw new TypeError('Provided object does not correctly implement Symbol.observable');
        }
        else {
            return obs.subscribe(subscriber);
        }
    };
};
//# sourceMappingURL=subscribeToObservable.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/subscribeToPromise.js":
/*!**********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/subscribeToPromise.js ***!
  \**********************************************************************/
/*! exports provided: subscribeToPromise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subscribeToPromise", function() { return subscribeToPromise; });
/* harmony import */ var _hostReportError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hostReportError */ "../node_modules/rxjs/_esm5/internal/util/hostReportError.js");
/** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */

var subscribeToPromise = function (promise) {
    return function (subscriber) {
        promise.then(function (value) {
            if (!subscriber.closed) {
                subscriber.next(value);
                subscriber.complete();
            }
        }, function (err) { return subscriber.error(err); })
            .then(null, _hostReportError__WEBPACK_IMPORTED_MODULE_0__["hostReportError"]);
        return subscriber;
    };
};
//# sourceMappingURL=subscribeToPromise.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/subscribeToResult.js":
/*!*********************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/subscribeToResult.js ***!
  \*********************************************************************/
/*! exports provided: subscribeToResult */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subscribeToResult", function() { return subscribeToResult; });
/* harmony import */ var _InnerSubscriber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InnerSubscriber */ "../node_modules/rxjs/_esm5/internal/InnerSubscriber.js");
/* harmony import */ var _subscribeTo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subscribeTo */ "../node_modules/rxjs/_esm5/internal/util/subscribeTo.js");
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Observable */ "../node_modules/rxjs/_esm5/internal/Observable.js");
/** PURE_IMPORTS_START _InnerSubscriber,_subscribeTo,_Observable PURE_IMPORTS_END */



function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, innerSubscriber) {
    if (innerSubscriber === void 0) {
        innerSubscriber = new _InnerSubscriber__WEBPACK_IMPORTED_MODULE_0__["InnerSubscriber"](outerSubscriber, outerValue, outerIndex);
    }
    if (innerSubscriber.closed) {
        return undefined;
    }
    if (result instanceof _Observable__WEBPACK_IMPORTED_MODULE_2__["Observable"]) {
        return result.subscribe(innerSubscriber);
    }
    return Object(_subscribeTo__WEBPACK_IMPORTED_MODULE_1__["subscribeTo"])(result)(innerSubscriber);
}
//# sourceMappingURL=subscribeToResult.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/internal/util/toSubscriber.js":
/*!****************************************************************!*\
  !*** ../node_modules/rxjs/_esm5/internal/util/toSubscriber.js ***!
  \****************************************************************/
/*! exports provided: toSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toSubscriber", function() { return toSubscriber; });
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Subscriber */ "../node_modules/rxjs/_esm5/internal/Subscriber.js");
/* harmony import */ var _symbol_rxSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../symbol/rxSubscriber */ "../node_modules/rxjs/_esm5/internal/symbol/rxSubscriber.js");
/* harmony import */ var _Observer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Observer */ "../node_modules/rxjs/_esm5/internal/Observer.js");
/** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */



function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof _Subscriber__WEBPACK_IMPORTED_MODULE_0__["Subscriber"]) {
            return nextOrObserver;
        }
        if (nextOrObserver[_symbol_rxSubscriber__WEBPACK_IMPORTED_MODULE_1__["rxSubscriber"]]) {
            return nextOrObserver[_symbol_rxSubscriber__WEBPACK_IMPORTED_MODULE_1__["rxSubscriber"]]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new _Subscriber__WEBPACK_IMPORTED_MODULE_0__["Subscriber"](_Observer__WEBPACK_IMPORTED_MODULE_2__["empty"]);
    }
    return new _Subscriber__WEBPACK_IMPORTED_MODULE_0__["Subscriber"](nextOrObserver, error, complete);
}
//# sourceMappingURL=toSubscriber.js.map


/***/ }),

/***/ "../node_modules/rxjs/_esm5/operators/index.js":
/*!*****************************************************!*\
  !*** ../node_modules/rxjs/_esm5/operators/index.js ***!
  \*****************************************************/
/*! exports provided: audit, auditTime, buffer, bufferCount, bufferTime, bufferToggle, bufferWhen, catchError, combineAll, combineLatest, concat, concatAll, concatMap, concatMapTo, count, debounce, debounceTime, defaultIfEmpty, delay, delayWhen, dematerialize, distinct, distinctUntilChanged, distinctUntilKeyChanged, elementAt, endWith, every, exhaust, exhaustMap, expand, filter, finalize, find, findIndex, first, groupBy, ignoreElements, isEmpty, last, map, mapTo, materialize, max, merge, mergeAll, mergeMap, flatMap, mergeMapTo, mergeScan, min, multicast, observeOn, onErrorResumeNext, pairwise, partition, pluck, publish, publishBehavior, publishLast, publishReplay, race, reduce, repeat, repeatWhen, retry, retryWhen, refCount, sample, sampleTime, scan, sequenceEqual, share, shareReplay, single, skip, skipLast, skipUntil, skipWhile, startWith, subscribeOn, switchAll, switchMap, switchMapTo, take, takeLast, takeUntil, takeWhile, tap, throttle, throttleTime, throwIfEmpty, timeInterval, timeout, timeoutWith, timestamp, toArray, window, windowCount, windowTime, windowToggle, windowWhen, withLatestFrom, zip, zipAll */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _internal_operators_audit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../internal/operators/audit */ "../node_modules/rxjs/_esm5/internal/operators/audit.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "audit", function() { return _internal_operators_audit__WEBPACK_IMPORTED_MODULE_0__["audit"]; });

/* harmony import */ var _internal_operators_auditTime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../internal/operators/auditTime */ "../node_modules/rxjs/_esm5/internal/operators/auditTime.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "auditTime", function() { return _internal_operators_auditTime__WEBPACK_IMPORTED_MODULE_1__["auditTime"]; });

/* harmony import */ var _internal_operators_buffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../internal/operators/buffer */ "../node_modules/rxjs/_esm5/internal/operators/buffer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "buffer", function() { return _internal_operators_buffer__WEBPACK_IMPORTED_MODULE_2__["buffer"]; });

/* harmony import */ var _internal_operators_bufferCount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../internal/operators/bufferCount */ "../node_modules/rxjs/_esm5/internal/operators/bufferCount.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "bufferCount", function() { return _internal_operators_bufferCount__WEBPACK_IMPORTED_MODULE_3__["bufferCount"]; });

/* harmony import */ var _internal_operators_bufferTime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../internal/operators/bufferTime */ "../node_modules/rxjs/_esm5/internal/operators/bufferTime.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "bufferTime", function() { return _internal_operators_bufferTime__WEBPACK_IMPORTED_MODULE_4__["bufferTime"]; });

/* harmony import */ var _internal_operators_bufferToggle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../internal/operators/bufferToggle */ "../node_modules/rxjs/_esm5/internal/operators/bufferToggle.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "bufferToggle", function() { return _internal_operators_bufferToggle__WEBPACK_IMPORTED_MODULE_5__["bufferToggle"]; });

/* harmony import */ var _internal_operators_bufferWhen__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../internal/operators/bufferWhen */ "../node_modules/rxjs/_esm5/internal/operators/bufferWhen.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "bufferWhen", function() { return _internal_operators_bufferWhen__WEBPACK_IMPORTED_MODULE_6__["bufferWhen"]; });

/* harmony import */ var _internal_operators_catchError__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../internal/operators/catchError */ "../node_modules/rxjs/_esm5/internal/operators/catchError.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "catchError", function() { return _internal_operators_catchError__WEBPACK_IMPORTED_MODULE_7__["catchError"]; });

/* harmony import */ var _internal_operators_combineAll__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../internal/operators/combineAll */ "../node_modules/rxjs/_esm5/internal/operators/combineAll.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "combineAll", function() { return _internal_operators_combineAll__WEBPACK_IMPORTED_MODULE_8__["combineAll"]; });

/* harmony import */ var _internal_operators_combineLatest__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../internal/operators/combineLatest */ "../node_modules/rxjs/_esm5/internal/operators/combineLatest.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "combineLatest", function() { return _internal_operators_combineLatest__WEBPACK_IMPORTED_MODULE_9__["combineLatest"]; });

/* harmony import */ var _internal_operators_concat__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../internal/operators/concat */ "../node_modules/rxjs/_esm5/internal/operators/concat.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "concat", function() { return _internal_operators_concat__WEBPACK_IMPORTED_MODULE_10__["concat"]; });

/* harmony import */ var _internal_operators_concatAll__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../internal/operators/concatAll */ "../node_modules/rxjs/_esm5/internal/operators/concatAll.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "concatAll", function() { return _internal_operators_concatAll__WEBPACK_IMPORTED_MODULE_11__["concatAll"]; });

/* harmony import */ var _internal_operators_concatMap__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../internal/operators/concatMap */ "../node_modules/rxjs/_esm5/internal/operators/concatMap.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "concatMap", function() { return _internal_operators_concatMap__WEBPACK_IMPORTED_MODULE_12__["concatMap"]; });

/* harmony import */ var _internal_operators_concatMapTo__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../internal/operators/concatMapTo */ "../node_modules/rxjs/_esm5/internal/operators/concatMapTo.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "concatMapTo", function() { return _internal_operators_concatMapTo__WEBPACK_IMPORTED_MODULE_13__["concatMapTo"]; });

/* harmony import */ var _internal_operators_count__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../internal/operators/count */ "../node_modules/rxjs/_esm5/internal/operators/count.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "count", function() { return _internal_operators_count__WEBPACK_IMPORTED_MODULE_14__["count"]; });

/* harmony import */ var _internal_operators_debounce__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../internal/operators/debounce */ "../node_modules/rxjs/_esm5/internal/operators/debounce.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return _internal_operators_debounce__WEBPACK_IMPORTED_MODULE_15__["debounce"]; });

/* harmony import */ var _internal_operators_debounceTime__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../internal/operators/debounceTime */ "../node_modules/rxjs/_esm5/internal/operators/debounceTime.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "debounceTime", function() { return _internal_operators_debounceTime__WEBPACK_IMPORTED_MODULE_16__["debounceTime"]; });

/* harmony import */ var _internal_operators_defaultIfEmpty__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../internal/operators/defaultIfEmpty */ "../node_modules/rxjs/_esm5/internal/operators/defaultIfEmpty.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defaultIfEmpty", function() { return _internal_operators_defaultIfEmpty__WEBPACK_IMPORTED_MODULE_17__["defaultIfEmpty"]; });

/* harmony import */ var _internal_operators_delay__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../internal/operators/delay */ "../node_modules/rxjs/_esm5/internal/operators/delay.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "delay", function() { return _internal_operators_delay__WEBPACK_IMPORTED_MODULE_18__["delay"]; });

/* harmony import */ var _internal_operators_delayWhen__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../internal/operators/delayWhen */ "../node_modules/rxjs/_esm5/internal/operators/delayWhen.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "delayWhen", function() { return _internal_operators_delayWhen__WEBPACK_IMPORTED_MODULE_19__["delayWhen"]; });

/* harmony import */ var _internal_operators_dematerialize__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../internal/operators/dematerialize */ "../node_modules/rxjs/_esm5/internal/operators/dematerialize.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "dematerialize", function() { return _internal_operators_dematerialize__WEBPACK_IMPORTED_MODULE_20__["dematerialize"]; });

/* harmony import */ var _internal_operators_distinct__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../internal/operators/distinct */ "../node_modules/rxjs/_esm5/internal/operators/distinct.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "distinct", function() { return _internal_operators_distinct__WEBPACK_IMPORTED_MODULE_21__["distinct"]; });

/* harmony import */ var _internal_operators_distinctUntilChanged__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../internal/operators/distinctUntilChanged */ "../node_modules/rxjs/_esm5/internal/operators/distinctUntilChanged.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "distinctUntilChanged", function() { return _internal_operators_distinctUntilChanged__WEBPACK_IMPORTED_MODULE_22__["distinctUntilChanged"]; });

/* harmony import */ var _internal_operators_distinctUntilKeyChanged__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../internal/operators/distinctUntilKeyChanged */ "../node_modules/rxjs/_esm5/internal/operators/distinctUntilKeyChanged.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "distinctUntilKeyChanged", function() { return _internal_operators_distinctUntilKeyChanged__WEBPACK_IMPORTED_MODULE_23__["distinctUntilKeyChanged"]; });

/* harmony import */ var _internal_operators_elementAt__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../internal/operators/elementAt */ "../node_modules/rxjs/_esm5/internal/operators/elementAt.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "elementAt", function() { return _internal_operators_elementAt__WEBPACK_IMPORTED_MODULE_24__["elementAt"]; });

/* harmony import */ var _internal_operators_endWith__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../internal/operators/endWith */ "../node_modules/rxjs/_esm5/internal/operators/endWith.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "endWith", function() { return _internal_operators_endWith__WEBPACK_IMPORTED_MODULE_25__["endWith"]; });

/* harmony import */ var _internal_operators_every__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../internal/operators/every */ "../node_modules/rxjs/_esm5/internal/operators/every.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "every", function() { return _internal_operators_every__WEBPACK_IMPORTED_MODULE_26__["every"]; });

/* harmony import */ var _internal_operators_exhaust__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../internal/operators/exhaust */ "../node_modules/rxjs/_esm5/internal/operators/exhaust.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "exhaust", function() { return _internal_operators_exhaust__WEBPACK_IMPORTED_MODULE_27__["exhaust"]; });

/* harmony import */ var _internal_operators_exhaustMap__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../internal/operators/exhaustMap */ "../node_modules/rxjs/_esm5/internal/operators/exhaustMap.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "exhaustMap", function() { return _internal_operators_exhaustMap__WEBPACK_IMPORTED_MODULE_28__["exhaustMap"]; });

/* harmony import */ var _internal_operators_expand__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../internal/operators/expand */ "../node_modules/rxjs/_esm5/internal/operators/expand.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "expand", function() { return _internal_operators_expand__WEBPACK_IMPORTED_MODULE_29__["expand"]; });

/* harmony import */ var _internal_operators_filter__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../internal/operators/filter */ "../node_modules/rxjs/_esm5/internal/operators/filter.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "filter", function() { return _internal_operators_filter__WEBPACK_IMPORTED_MODULE_30__["filter"]; });

/* harmony import */ var _internal_operators_finalize__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ../internal/operators/finalize */ "../node_modules/rxjs/_esm5/internal/operators/finalize.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "finalize", function() { return _internal_operators_finalize__WEBPACK_IMPORTED_MODULE_31__["finalize"]; });

/* harmony import */ var _internal_operators_find__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ../internal/operators/find */ "../node_modules/rxjs/_esm5/internal/operators/find.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "find", function() { return _internal_operators_find__WEBPACK_IMPORTED_MODULE_32__["find"]; });

/* harmony import */ var _internal_operators_findIndex__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ../internal/operators/findIndex */ "../node_modules/rxjs/_esm5/internal/operators/findIndex.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "findIndex", function() { return _internal_operators_findIndex__WEBPACK_IMPORTED_MODULE_33__["findIndex"]; });

/* harmony import */ var _internal_operators_first__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ../internal/operators/first */ "../node_modules/rxjs/_esm5/internal/operators/first.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "first", function() { return _internal_operators_first__WEBPACK_IMPORTED_MODULE_34__["first"]; });

/* harmony import */ var _internal_operators_groupBy__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ../internal/operators/groupBy */ "../node_modules/rxjs/_esm5/internal/operators/groupBy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "groupBy", function() { return _internal_operators_groupBy__WEBPACK_IMPORTED_MODULE_35__["groupBy"]; });

/* harmony import */ var _internal_operators_ignoreElements__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ../internal/operators/ignoreElements */ "../node_modules/rxjs/_esm5/internal/operators/ignoreElements.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ignoreElements", function() { return _internal_operators_ignoreElements__WEBPACK_IMPORTED_MODULE_36__["ignoreElements"]; });

/* harmony import */ var _internal_operators_isEmpty__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ../internal/operators/isEmpty */ "../node_modules/rxjs/_esm5/internal/operators/isEmpty.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isEmpty", function() { return _internal_operators_isEmpty__WEBPACK_IMPORTED_MODULE_37__["isEmpty"]; });

/* harmony import */ var _internal_operators_last__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ../internal/operators/last */ "../node_modules/rxjs/_esm5/internal/operators/last.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "last", function() { return _internal_operators_last__WEBPACK_IMPORTED_MODULE_38__["last"]; });

/* harmony import */ var _internal_operators_map__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ../internal/operators/map */ "../node_modules/rxjs/_esm5/internal/operators/map.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "map", function() { return _internal_operators_map__WEBPACK_IMPORTED_MODULE_39__["map"]; });

/* harmony import */ var _internal_operators_mapTo__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ../internal/operators/mapTo */ "../node_modules/rxjs/_esm5/internal/operators/mapTo.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mapTo", function() { return _internal_operators_mapTo__WEBPACK_IMPORTED_MODULE_40__["mapTo"]; });

/* harmony import */ var _internal_operators_materialize__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ../internal/operators/materialize */ "../node_modules/rxjs/_esm5/internal/operators/materialize.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "materialize", function() { return _internal_operators_materialize__WEBPACK_IMPORTED_MODULE_41__["materialize"]; });

/* harmony import */ var _internal_operators_max__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ../internal/operators/max */ "../node_modules/rxjs/_esm5/internal/operators/max.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "max", function() { return _internal_operators_max__WEBPACK_IMPORTED_MODULE_42__["max"]; });

/* harmony import */ var _internal_operators_merge__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ../internal/operators/merge */ "../node_modules/rxjs/_esm5/internal/operators/merge.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "merge", function() { return _internal_operators_merge__WEBPACK_IMPORTED_MODULE_43__["merge"]; });

/* harmony import */ var _internal_operators_mergeAll__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ../internal/operators/mergeAll */ "../node_modules/rxjs/_esm5/internal/operators/mergeAll.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeAll", function() { return _internal_operators_mergeAll__WEBPACK_IMPORTED_MODULE_44__["mergeAll"]; });

/* harmony import */ var _internal_operators_mergeMap__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! ../internal/operators/mergeMap */ "../node_modules/rxjs/_esm5/internal/operators/mergeMap.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeMap", function() { return _internal_operators_mergeMap__WEBPACK_IMPORTED_MODULE_45__["mergeMap"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "flatMap", function() { return _internal_operators_mergeMap__WEBPACK_IMPORTED_MODULE_45__["flatMap"]; });

/* harmony import */ var _internal_operators_mergeMapTo__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! ../internal/operators/mergeMapTo */ "../node_modules/rxjs/_esm5/internal/operators/mergeMapTo.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeMapTo", function() { return _internal_operators_mergeMapTo__WEBPACK_IMPORTED_MODULE_46__["mergeMapTo"]; });

/* harmony import */ var _internal_operators_mergeScan__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! ../internal/operators/mergeScan */ "../node_modules/rxjs/_esm5/internal/operators/mergeScan.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeScan", function() { return _internal_operators_mergeScan__WEBPACK_IMPORTED_MODULE_47__["mergeScan"]; });

/* harmony import */ var _internal_operators_min__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(/*! ../internal/operators/min */ "../node_modules/rxjs/_esm5/internal/operators/min.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "min", function() { return _internal_operators_min__WEBPACK_IMPORTED_MODULE_48__["min"]; });

/* harmony import */ var _internal_operators_multicast__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(/*! ../internal/operators/multicast */ "../node_modules/rxjs/_esm5/internal/operators/multicast.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "multicast", function() { return _internal_operators_multicast__WEBPACK_IMPORTED_MODULE_49__["multicast"]; });

/* harmony import */ var _internal_operators_observeOn__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(/*! ../internal/operators/observeOn */ "../node_modules/rxjs/_esm5/internal/operators/observeOn.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "observeOn", function() { return _internal_operators_observeOn__WEBPACK_IMPORTED_MODULE_50__["observeOn"]; });

/* harmony import */ var _internal_operators_onErrorResumeNext__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(/*! ../internal/operators/onErrorResumeNext */ "../node_modules/rxjs/_esm5/internal/operators/onErrorResumeNext.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onErrorResumeNext", function() { return _internal_operators_onErrorResumeNext__WEBPACK_IMPORTED_MODULE_51__["onErrorResumeNext"]; });

/* harmony import */ var _internal_operators_pairwise__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(/*! ../internal/operators/pairwise */ "../node_modules/rxjs/_esm5/internal/operators/pairwise.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "pairwise", function() { return _internal_operators_pairwise__WEBPACK_IMPORTED_MODULE_52__["pairwise"]; });

/* harmony import */ var _internal_operators_partition__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(/*! ../internal/operators/partition */ "../node_modules/rxjs/_esm5/internal/operators/partition.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "partition", function() { return _internal_operators_partition__WEBPACK_IMPORTED_MODULE_53__["partition"]; });

/* harmony import */ var _internal_operators_pluck__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(/*! ../internal/operators/pluck */ "../node_modules/rxjs/_esm5/internal/operators/pluck.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "pluck", function() { return _internal_operators_pluck__WEBPACK_IMPORTED_MODULE_54__["pluck"]; });

/* harmony import */ var _internal_operators_publish__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(/*! ../internal/operators/publish */ "../node_modules/rxjs/_esm5/internal/operators/publish.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "publish", function() { return _internal_operators_publish__WEBPACK_IMPORTED_MODULE_55__["publish"]; });

/* harmony import */ var _internal_operators_publishBehavior__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(/*! ../internal/operators/publishBehavior */ "../node_modules/rxjs/_esm5/internal/operators/publishBehavior.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "publishBehavior", function() { return _internal_operators_publishBehavior__WEBPACK_IMPORTED_MODULE_56__["publishBehavior"]; });

/* harmony import */ var _internal_operators_publishLast__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__(/*! ../internal/operators/publishLast */ "../node_modules/rxjs/_esm5/internal/operators/publishLast.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "publishLast", function() { return _internal_operators_publishLast__WEBPACK_IMPORTED_MODULE_57__["publishLast"]; });

/* harmony import */ var _internal_operators_publishReplay__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__(/*! ../internal/operators/publishReplay */ "../node_modules/rxjs/_esm5/internal/operators/publishReplay.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "publishReplay", function() { return _internal_operators_publishReplay__WEBPACK_IMPORTED_MODULE_58__["publishReplay"]; });

/* harmony import */ var _internal_operators_race__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__(/*! ../internal/operators/race */ "../node_modules/rxjs/_esm5/internal/operators/race.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "race", function() { return _internal_operators_race__WEBPACK_IMPORTED_MODULE_59__["race"]; });

/* harmony import */ var _internal_operators_reduce__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__(/*! ../internal/operators/reduce */ "../node_modules/rxjs/_esm5/internal/operators/reduce.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "reduce", function() { return _internal_operators_reduce__WEBPACK_IMPORTED_MODULE_60__["reduce"]; });

/* harmony import */ var _internal_operators_repeat__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__(/*! ../internal/operators/repeat */ "../node_modules/rxjs/_esm5/internal/operators/repeat.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "repeat", function() { return _internal_operators_repeat__WEBPACK_IMPORTED_MODULE_61__["repeat"]; });

/* harmony import */ var _internal_operators_repeatWhen__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__(/*! ../internal/operators/repeatWhen */ "../node_modules/rxjs/_esm5/internal/operators/repeatWhen.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "repeatWhen", function() { return _internal_operators_repeatWhen__WEBPACK_IMPORTED_MODULE_62__["repeatWhen"]; });

/* harmony import */ var _internal_operators_retry__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__(/*! ../internal/operators/retry */ "../node_modules/rxjs/_esm5/internal/operators/retry.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "retry", function() { return _internal_operators_retry__WEBPACK_IMPORTED_MODULE_63__["retry"]; });

/* harmony import */ var _internal_operators_retryWhen__WEBPACK_IMPORTED_MODULE_64__ = __webpack_require__(/*! ../internal/operators/retryWhen */ "../node_modules/rxjs/_esm5/internal/operators/retryWhen.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "retryWhen", function() { return _internal_operators_retryWhen__WEBPACK_IMPORTED_MODULE_64__["retryWhen"]; });

/* harmony import */ var _internal_operators_refCount__WEBPACK_IMPORTED_MODULE_65__ = __webpack_require__(/*! ../internal/operators/refCount */ "../node_modules/rxjs/_esm5/internal/operators/refCount.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "refCount", function() { return _internal_operators_refCount__WEBPACK_IMPORTED_MODULE_65__["refCount"]; });

/* harmony import */ var _internal_operators_sample__WEBPACK_IMPORTED_MODULE_66__ = __webpack_require__(/*! ../internal/operators/sample */ "../node_modules/rxjs/_esm5/internal/operators/sample.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "sample", function() { return _internal_operators_sample__WEBPACK_IMPORTED_MODULE_66__["sample"]; });

/* harmony import */ var _internal_operators_sampleTime__WEBPACK_IMPORTED_MODULE_67__ = __webpack_require__(/*! ../internal/operators/sampleTime */ "../node_modules/rxjs/_esm5/internal/operators/sampleTime.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "sampleTime", function() { return _internal_operators_sampleTime__WEBPACK_IMPORTED_MODULE_67__["sampleTime"]; });

/* harmony import */ var _internal_operators_scan__WEBPACK_IMPORTED_MODULE_68__ = __webpack_require__(/*! ../internal/operators/scan */ "../node_modules/rxjs/_esm5/internal/operators/scan.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "scan", function() { return _internal_operators_scan__WEBPACK_IMPORTED_MODULE_68__["scan"]; });

/* harmony import */ var _internal_operators_sequenceEqual__WEBPACK_IMPORTED_MODULE_69__ = __webpack_require__(/*! ../internal/operators/sequenceEqual */ "../node_modules/rxjs/_esm5/internal/operators/sequenceEqual.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "sequenceEqual", function() { return _internal_operators_sequenceEqual__WEBPACK_IMPORTED_MODULE_69__["sequenceEqual"]; });

/* harmony import */ var _internal_operators_share__WEBPACK_IMPORTED_MODULE_70__ = __webpack_require__(/*! ../internal/operators/share */ "../node_modules/rxjs/_esm5/internal/operators/share.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "share", function() { return _internal_operators_share__WEBPACK_IMPORTED_MODULE_70__["share"]; });

/* harmony import */ var _internal_operators_shareReplay__WEBPACK_IMPORTED_MODULE_71__ = __webpack_require__(/*! ../internal/operators/shareReplay */ "../node_modules/rxjs/_esm5/internal/operators/shareReplay.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shareReplay", function() { return _internal_operators_shareReplay__WEBPACK_IMPORTED_MODULE_71__["shareReplay"]; });

/* harmony import */ var _internal_operators_single__WEBPACK_IMPORTED_MODULE_72__ = __webpack_require__(/*! ../internal/operators/single */ "../node_modules/rxjs/_esm5/internal/operators/single.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "single", function() { return _internal_operators_single__WEBPACK_IMPORTED_MODULE_72__["single"]; });

/* harmony import */ var _internal_operators_skip__WEBPACK_IMPORTED_MODULE_73__ = __webpack_require__(/*! ../internal/operators/skip */ "../node_modules/rxjs/_esm5/internal/operators/skip.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "skip", function() { return _internal_operators_skip__WEBPACK_IMPORTED_MODULE_73__["skip"]; });

/* harmony import */ var _internal_operators_skipLast__WEBPACK_IMPORTED_MODULE_74__ = __webpack_require__(/*! ../internal/operators/skipLast */ "../node_modules/rxjs/_esm5/internal/operators/skipLast.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "skipLast", function() { return _internal_operators_skipLast__WEBPACK_IMPORTED_MODULE_74__["skipLast"]; });

/* harmony import */ var _internal_operators_skipUntil__WEBPACK_IMPORTED_MODULE_75__ = __webpack_require__(/*! ../internal/operators/skipUntil */ "../node_modules/rxjs/_esm5/internal/operators/skipUntil.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "skipUntil", function() { return _internal_operators_skipUntil__WEBPACK_IMPORTED_MODULE_75__["skipUntil"]; });

/* harmony import */ var _internal_operators_skipWhile__WEBPACK_IMPORTED_MODULE_76__ = __webpack_require__(/*! ../internal/operators/skipWhile */ "../node_modules/rxjs/_esm5/internal/operators/skipWhile.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "skipWhile", function() { return _internal_operators_skipWhile__WEBPACK_IMPORTED_MODULE_76__["skipWhile"]; });

/* harmony import */ var _internal_operators_startWith__WEBPACK_IMPORTED_MODULE_77__ = __webpack_require__(/*! ../internal/operators/startWith */ "../node_modules/rxjs/_esm5/internal/operators/startWith.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "startWith", function() { return _internal_operators_startWith__WEBPACK_IMPORTED_MODULE_77__["startWith"]; });

/* harmony import */ var _internal_operators_subscribeOn__WEBPACK_IMPORTED_MODULE_78__ = __webpack_require__(/*! ../internal/operators/subscribeOn */ "../node_modules/rxjs/_esm5/internal/operators/subscribeOn.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "subscribeOn", function() { return _internal_operators_subscribeOn__WEBPACK_IMPORTED_MODULE_78__["subscribeOn"]; });

/* harmony import */ var _internal_operators_switchAll__WEBPACK_IMPORTED_MODULE_79__ = __webpack_require__(/*! ../internal/operators/switchAll */ "../node_modules/rxjs/_esm5/internal/operators/switchAll.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "switchAll", function() { return _internal_operators_switchAll__WEBPACK_IMPORTED_MODULE_79__["switchAll"]; });

/* harmony import */ var _internal_operators_switchMap__WEBPACK_IMPORTED_MODULE_80__ = __webpack_require__(/*! ../internal/operators/switchMap */ "../node_modules/rxjs/_esm5/internal/operators/switchMap.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "switchMap", function() { return _internal_operators_switchMap__WEBPACK_IMPORTED_MODULE_80__["switchMap"]; });

/* harmony import */ var _internal_operators_switchMapTo__WEBPACK_IMPORTED_MODULE_81__ = __webpack_require__(/*! ../internal/operators/switchMapTo */ "../node_modules/rxjs/_esm5/internal/operators/switchMapTo.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "switchMapTo", function() { return _internal_operators_switchMapTo__WEBPACK_IMPORTED_MODULE_81__["switchMapTo"]; });

/* harmony import */ var _internal_operators_take__WEBPACK_IMPORTED_MODULE_82__ = __webpack_require__(/*! ../internal/operators/take */ "../node_modules/rxjs/_esm5/internal/operators/take.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "take", function() { return _internal_operators_take__WEBPACK_IMPORTED_MODULE_82__["take"]; });

/* harmony import */ var _internal_operators_takeLast__WEBPACK_IMPORTED_MODULE_83__ = __webpack_require__(/*! ../internal/operators/takeLast */ "../node_modules/rxjs/_esm5/internal/operators/takeLast.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "takeLast", function() { return _internal_operators_takeLast__WEBPACK_IMPORTED_MODULE_83__["takeLast"]; });

/* harmony import */ var _internal_operators_takeUntil__WEBPACK_IMPORTED_MODULE_84__ = __webpack_require__(/*! ../internal/operators/takeUntil */ "../node_modules/rxjs/_esm5/internal/operators/takeUntil.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "takeUntil", function() { return _internal_operators_takeUntil__WEBPACK_IMPORTED_MODULE_84__["takeUntil"]; });

/* harmony import */ var _internal_operators_takeWhile__WEBPACK_IMPORTED_MODULE_85__ = __webpack_require__(/*! ../internal/operators/takeWhile */ "../node_modules/rxjs/_esm5/internal/operators/takeWhile.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "takeWhile", function() { return _internal_operators_takeWhile__WEBPACK_IMPORTED_MODULE_85__["takeWhile"]; });

/* harmony import */ var _internal_operators_tap__WEBPACK_IMPORTED_MODULE_86__ = __webpack_require__(/*! ../internal/operators/tap */ "../node_modules/rxjs/_esm5/internal/operators/tap.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "tap", function() { return _internal_operators_tap__WEBPACK_IMPORTED_MODULE_86__["tap"]; });

/* harmony import */ var _internal_operators_throttle__WEBPACK_IMPORTED_MODULE_87__ = __webpack_require__(/*! ../internal/operators/throttle */ "../node_modules/rxjs/_esm5/internal/operators/throttle.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "throttle", function() { return _internal_operators_throttle__WEBPACK_IMPORTED_MODULE_87__["throttle"]; });

/* harmony import */ var _internal_operators_throttleTime__WEBPACK_IMPORTED_MODULE_88__ = __webpack_require__(/*! ../internal/operators/throttleTime */ "../node_modules/rxjs/_esm5/internal/operators/throttleTime.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "throttleTime", function() { return _internal_operators_throttleTime__WEBPACK_IMPORTED_MODULE_88__["throttleTime"]; });

/* harmony import */ var _internal_operators_throwIfEmpty__WEBPACK_IMPORTED_MODULE_89__ = __webpack_require__(/*! ../internal/operators/throwIfEmpty */ "../node_modules/rxjs/_esm5/internal/operators/throwIfEmpty.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "throwIfEmpty", function() { return _internal_operators_throwIfEmpty__WEBPACK_IMPORTED_MODULE_89__["throwIfEmpty"]; });

/* harmony import */ var _internal_operators_timeInterval__WEBPACK_IMPORTED_MODULE_90__ = __webpack_require__(/*! ../internal/operators/timeInterval */ "../node_modules/rxjs/_esm5/internal/operators/timeInterval.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "timeInterval", function() { return _internal_operators_timeInterval__WEBPACK_IMPORTED_MODULE_90__["timeInterval"]; });

/* harmony import */ var _internal_operators_timeout__WEBPACK_IMPORTED_MODULE_91__ = __webpack_require__(/*! ../internal/operators/timeout */ "../node_modules/rxjs/_esm5/internal/operators/timeout.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "timeout", function() { return _internal_operators_timeout__WEBPACK_IMPORTED_MODULE_91__["timeout"]; });

/* harmony import */ var _internal_operators_timeoutWith__WEBPACK_IMPORTED_MODULE_92__ = __webpack_require__(/*! ../internal/operators/timeoutWith */ "../node_modules/rxjs/_esm5/internal/operators/timeoutWith.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "timeoutWith", function() { return _internal_operators_timeoutWith__WEBPACK_IMPORTED_MODULE_92__["timeoutWith"]; });

/* harmony import */ var _internal_operators_timestamp__WEBPACK_IMPORTED_MODULE_93__ = __webpack_require__(/*! ../internal/operators/timestamp */ "../node_modules/rxjs/_esm5/internal/operators/timestamp.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "timestamp", function() { return _internal_operators_timestamp__WEBPACK_IMPORTED_MODULE_93__["timestamp"]; });

/* harmony import */ var _internal_operators_toArray__WEBPACK_IMPORTED_MODULE_94__ = __webpack_require__(/*! ../internal/operators/toArray */ "../node_modules/rxjs/_esm5/internal/operators/toArray.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toArray", function() { return _internal_operators_toArray__WEBPACK_IMPORTED_MODULE_94__["toArray"]; });

/* harmony import */ var _internal_operators_window__WEBPACK_IMPORTED_MODULE_95__ = __webpack_require__(/*! ../internal/operators/window */ "../node_modules/rxjs/_esm5/internal/operators/window.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "window", function() { return _internal_operators_window__WEBPACK_IMPORTED_MODULE_95__["window"]; });

/* harmony import */ var _internal_operators_windowCount__WEBPACK_IMPORTED_MODULE_96__ = __webpack_require__(/*! ../internal/operators/windowCount */ "../node_modules/rxjs/_esm5/internal/operators/windowCount.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "windowCount", function() { return _internal_operators_windowCount__WEBPACK_IMPORTED_MODULE_96__["windowCount"]; });

/* harmony import */ var _internal_operators_windowTime__WEBPACK_IMPORTED_MODULE_97__ = __webpack_require__(/*! ../internal/operators/windowTime */ "../node_modules/rxjs/_esm5/internal/operators/windowTime.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "windowTime", function() { return _internal_operators_windowTime__WEBPACK_IMPORTED_MODULE_97__["windowTime"]; });

/* harmony import */ var _internal_operators_windowToggle__WEBPACK_IMPORTED_MODULE_98__ = __webpack_require__(/*! ../internal/operators/windowToggle */ "../node_modules/rxjs/_esm5/internal/operators/windowToggle.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "windowToggle", function() { return _internal_operators_windowToggle__WEBPACK_IMPORTED_MODULE_98__["windowToggle"]; });

/* harmony import */ var _internal_operators_windowWhen__WEBPACK_IMPORTED_MODULE_99__ = __webpack_require__(/*! ../internal/operators/windowWhen */ "../node_modules/rxjs/_esm5/internal/operators/windowWhen.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "windowWhen", function() { return _internal_operators_windowWhen__WEBPACK_IMPORTED_MODULE_99__["windowWhen"]; });

/* harmony import */ var _internal_operators_withLatestFrom__WEBPACK_IMPORTED_MODULE_100__ = __webpack_require__(/*! ../internal/operators/withLatestFrom */ "../node_modules/rxjs/_esm5/internal/operators/withLatestFrom.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withLatestFrom", function() { return _internal_operators_withLatestFrom__WEBPACK_IMPORTED_MODULE_100__["withLatestFrom"]; });

/* harmony import */ var _internal_operators_zip__WEBPACK_IMPORTED_MODULE_101__ = __webpack_require__(/*! ../internal/operators/zip */ "../node_modules/rxjs/_esm5/internal/operators/zip.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "zip", function() { return _internal_operators_zip__WEBPACK_IMPORTED_MODULE_101__["zip"]; });

/* harmony import */ var _internal_operators_zipAll__WEBPACK_IMPORTED_MODULE_102__ = __webpack_require__(/*! ../internal/operators/zipAll */ "../node_modules/rxjs/_esm5/internal/operators/zipAll.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "zipAll", function() { return _internal_operators_zipAll__WEBPACK_IMPORTED_MODULE_102__["zipAll"]; });

/** PURE_IMPORTS_START  PURE_IMPORTS_END */







































































































//# sourceMappingURL=index.js.map


/***/ }),

/***/ "../node_modules/tslib/tslib.es6.js":
/*!******************************************!*\
  !*** ../node_modules/tslib/tslib.es6.js ***!
  \******************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ "./ConfigEditor.tsx":
/*!**************************!*\
  !*** ./ConfigEditor.tsx ***!
  \**************************/
/*! exports provided: ConfigEditor, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigEditor", function() { return ConfigEditor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @grafana/ui */ "@grafana/ui");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @grafana/data */ "@grafana/data");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_grafana_data__WEBPACK_IMPORTED_MODULE_3__);



var Select = _grafana_ui__WEBPACK_IMPORTED_MODULE_2__["LegacyForms"].Select,
    Input = _grafana_ui__WEBPACK_IMPORTED_MODULE_2__["LegacyForms"].Input;

var authProviderOptions = [{
  label: 'Access & secret key',
  value: 'keys'
}, {
  label: 'Credentials file',
  value: 'credentials'
}, {
  label: 'ARN',
  value: 'arn'
}];

var ConfigEditor =
/** @class */
function (_super) {
  Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(ConfigEditor, _super);

  function ConfigEditor(props) {
    var _this = _super.call(this, props) || this;

    _this.state = {
      // TODO: we have an api to load this but the problem is at this moment we do not have credentials. We will have
      //  them on the backend after saving the datasource
      regions: defaultRegions.map(function (region) {
        return {
          value: region,
          label: region
        };
      })
    };
    return _this;
  }

  ConfigEditor.prototype.render = function () {
    var _this = this;

    var _a, _b;

    var regions = this.state.regions;
    var options = this.props.options;
    var secureJsonData = options.secureJsonData || {};
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h3", {
      className: "page-heading"
    }, "X-Ray Details"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form-group"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form-inline"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__["InlineFormLabel"], {
      className: "width-14"
    }, "Auth Provider"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Select, {
      className: "width-30",
      value: authProviderOptions.find(function (authProvider) {
        return authProvider.value === options.jsonData.authType;
      }),
      options: authProviderOptions,
      defaultValue: options.jsonData.authType,
      onChange: function onChange(option) {
        if (options.jsonData.authType === 'arn' && option.value !== 'arn') {
          delete _this.props.options.jsonData.assumeRoleArn;
        }

        Object(_grafana_data__WEBPACK_IMPORTED_MODULE_3__["onUpdateDatasourceJsonDataOptionSelect"])(_this.props, 'authType')(option);
      }
    }))), options.jsonData.authType === 'credentials' && react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form-inline"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__["InlineFormLabel"], {
      className: "width-14",
      tooltip: "Credentials profile name, as specified in ~/.aws/credentials, leave blank for default."
    }, "Credentials Profile Name"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "width-30"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Input, {
      className: "width-30",
      placeholder: "default",
      value: options.jsonData.database,
      onChange: Object(_grafana_data__WEBPACK_IMPORTED_MODULE_3__["onUpdateDatasourceJsonDataOptionSelect"])(this.props, 'profile')
    })))), options.jsonData.authType === 'keys' && react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, ((_a = options.secureJsonFields) === null || _a === void 0 ? void 0 : _a.accessKey) ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form-inline"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__["InlineFormLabel"], {
      className: "width-14"
    }, "Access Key ID"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Input, {
      className: "width-25",
      placeholder: "Configured",
      disabled: true
    })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "max-width-30 gf-form-inline"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      variant: "secondary",
      type: "button",
      onClick: Object(_grafana_data__WEBPACK_IMPORTED_MODULE_3__["onUpdateDatasourceResetOption"])(this.props, 'accessKey')
    }, "Reset")))) : react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form-inline"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__["InlineFormLabel"], {
      className: "width-14"
    }, "Access Key ID"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "width-30"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Input, {
      className: "width-30",
      value: secureJsonData.accessKey || '',
      onChange: Object(_grafana_data__WEBPACK_IMPORTED_MODULE_3__["onUpdateDatasourceSecureJsonDataOption"])(this.props, 'accessKey')
    })))), ((_b = options.secureJsonFields) === null || _b === void 0 ? void 0 : _b.secretKey) ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form-inline"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__["InlineFormLabel"], {
      className: "width-14"
    }, "Secret Access Key"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Input, {
      className: "width-25",
      placeholder: "Configured",
      disabled: true
    })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "max-width-30 gf-form-inline"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      variant: "secondary",
      type: "button",
      onClick: Object(_grafana_data__WEBPACK_IMPORTED_MODULE_3__["onUpdateDatasourceResetOption"])(this.props, 'secretKey')
    }, "Reset")))) : react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form-inline"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__["InlineFormLabel"], {
      className: "width-14"
    }, "Secret Access Key"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "width-30"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Input, {
      className: "width-30",
      value: secureJsonData.secretKey || '',
      onChange: Object(_grafana_data__WEBPACK_IMPORTED_MODULE_3__["onUpdateDatasourceSecureJsonDataOption"])(this.props, 'secretKey')
    }))))), options.jsonData.authType === 'arn' && react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form-inline"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__["InlineFormLabel"], {
      className: "width-14",
      tooltip: "ARN of Assume Role"
    }, "Assume Role ARN"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "width-30"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Input, {
      className: "width-30",
      placeholder: "arn:aws:iam:*",
      value: options.jsonData.assumeRoleArn || '',
      onChange: Object(_grafana_data__WEBPACK_IMPORTED_MODULE_3__["onUpdateDatasourceJsonDataOption"])(this.props, 'assumeRoleArn')
    })))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form-inline"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__["InlineFormLabel"], {
      className: "width-14",
      tooltip: "Specify the region, such as for US West (Oregon) use ` us-west-2 ` as the region."
    }, "Default Region"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Select, {
      className: "width-30",
      value: regions.find(function (region) {
        return region.value === options.jsonData.defaultRegion;
      }),
      options: regions,
      defaultValue: options.jsonData.defaultRegion,
      onChange: Object(_grafana_data__WEBPACK_IMPORTED_MODULE_3__["onUpdateDatasourceJsonDataOptionSelect"])(this.props, 'defaultRegion')
    })))));
  };

  return ConfigEditor;
}(react__WEBPACK_IMPORTED_MODULE_1__["PureComponent"]);


/* harmony default export */ __webpack_exports__["default"] = (ConfigEditor);
var defaultRegions = ['ap-east-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'ca-central-1', 'cn-north-1', 'cn-northwest-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'me-south-1', 'sa-east-1', 'us-east-1', 'us-east-2', 'us-gov-east-1', 'us-gov-west-1', 'us-iso-east-1', 'us-isob-east-1', 'us-west-1', 'us-west-2'];

/***/ }),

/***/ "./DataSource.ts":
/*!***********************!*\
  !*** ./DataSource.ts ***!
  \***********************/
/*! exports provided: XrayDataSource */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XrayDataSource", function() { return XrayDataSource; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @grafana/data */ "@grafana/data");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_grafana_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _grafana_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @grafana/runtime */ "@grafana/runtime");
/* harmony import */ var _grafana_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_grafana_runtime__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./types */ "./types.ts");
/* harmony import */ var utils_transform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! utils/transform */ "./utils/transform.ts");
/* harmony import */ var language_provider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! language_provider */ "./language_provider.ts");








var XrayDataSource =
/** @class */
function (_super) {
  XrayDataSource.$inject = ["instanceSettings"];

  Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(XrayDataSource, _super);
  /** @ngInject */


  function XrayDataSource(instanceSettings) {
    var _this = _super.call(this, instanceSettings) || this;

    _this.languageProvider = new language_provider__WEBPACK_IMPORTED_MODULE_6__["XRayLanguageProvider"](_this);
    _this.instanceSettings = instanceSettings;
    return _this;
  }

  XrayDataSource.prototype.query = function (request) {
    var _this = this;

    var processedRequest = processRequest(request, Object(_grafana_runtime__WEBPACK_IMPORTED_MODULE_2__["getTemplateSrv"])());

    var response = _super.prototype.query.call(this, processedRequest);

    return response.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (dataQueryResponse) {
      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, dataQueryResponse), {
        data: dataQueryResponse.data.map(function (frame) {
          return _this.parseResponse(frame);
        })
      });
    }));
  };

  XrayDataSource.prototype.getGroups = function () {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, Promise, function () {
      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
        return [2
        /*return*/
        , this.getResource('/groups')];
      });
    });
  };

  XrayDataSource.prototype.getRegions = function () {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, Promise, function () {
      var response, suggestions;
      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.awsRequest({
              queries: [{
                refId: 'getRegions',
                datasourceId: this.id,
                type: 'getRegions'
              }]
            })];

          case 1:
            response = _a.sent();
            suggestions = this.transformSuggestDataFromTable(response);
            return [2
            /*return*/
            , Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([{
              label: 'default',
              value: 'default',
              text: 'default'
            }], suggestions)];
        }
      });
    });
  };

  XrayDataSource.prototype.awsRequest = function (data) {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
      var options, result;
      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
        switch (_a.label) {
          case 0:
            options = {
              method: 'POST',
              url: '/api/tsdb/query',
              data: data
            };
            return [4
            /*yield*/
            , Object(_grafana_runtime__WEBPACK_IMPORTED_MODULE_2__["getBackendSrv"])().datasourceRequest(options)];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , result.data];
        }
      });
    });
  };

  XrayDataSource.prototype.getServiceMapUrl = function () {
    return this.getXrayUrl() + "#/service-map/";
  };

  XrayDataSource.prototype.getXrayUrlForQuery = function (query, timeRange) {
    var section;
    var urlQuery = new URLSearchParams();

    if (query.query) {
      urlQuery.append('filter', query.query);
    }

    if (timeRange) {
      urlQuery.append('timeRange', timeRange.from.toISOString() + "~" + timeRange.to.toISOString());
    }

    if (query.group && query.group.GroupName !== 'Default') {
      urlQuery.append('group', query.group.GroupName);
    }

    switch (query.queryType) {
      case _types__WEBPACK_IMPORTED_MODULE_4__["XrayQueryType"].getTraceSummaries:
        section = 'traces';
        break;

      case _types__WEBPACK_IMPORTED_MODULE_4__["XrayQueryType"].getTrace:
        section = "traces/" + query.query;
        urlQuery = undefined;
        break;

      case _types__WEBPACK_IMPORTED_MODULE_4__["XrayQueryType"].getInsights:
        // Insights don't use url params
        section = 'insights';
        urlQuery = undefined;
        break;
      // There is not real equivalent for this so lets point to analytics

      case _types__WEBPACK_IMPORTED_MODULE_4__["XrayQueryType"].getTimeSeriesServiceStatistics:
      default:
        section = 'analytics';
    } // Check if we either dropped the params because they are not needed for some query types or they are empty.


    var queryParams = (urlQuery === null || urlQuery === void 0 ? void 0 : urlQuery.toString()) ? // For some reason the analytics view of X-ray does not handle some url escapes
    '?' + (urlQuery === null || urlQuery === void 0 ? void 0 : urlQuery.toString().replace(/\+/g, '%20').replace(/%3A/g, ':').replace(/%7E/g, '~')) : '';
    return this.getXrayUrl() + "#/" + section + queryParams;
  };

  XrayDataSource.prototype.getXrayUrl = function () {
    var region = this.instanceSettings.jsonData.defaultRegion;
    return "https://" + region + ".console.aws.amazon.com/xray/home?region=" + region;
  };

  XrayDataSource.prototype.transformSuggestDataFromTable = function (suggestData) {
    return suggestData.results['metricFindQuery'].tables[0].rows.map(function (value) {
      return {
        text: value,
        value: value,
        label: value
      };
    });
  };

  XrayDataSource.prototype.parseResponse = function (response) {
    // TODO this would better be based on type but backend Go def does not have dataFrame.type
    switch (response.name) {
      case 'Traces':
        return parseTraceResponse(response);

      case 'TraceSummaries':
        return parseTracesListResponse(response, this.instanceSettings.uid);

      case 'InsightSummaries':
        return this.parseInsightsResponse(response);

      default:
        return response;
    }
  };

  XrayDataSource.prototype.parseInsightsResponse = function (response) {
    var urlToAwsConsole = this.getXrayUrl() + "#/insights/";
    var idField = response.fields.find(function (f) {
      return f.name === 'InsightId';
    });

    if (idField) {
      idField.config.links = [{
        title: '',
        url: urlToAwsConsole + '${__value.raw}',
        targetBlank: true
      }];
    }

    var duration = response.fields.find(function (f) {
      return f.name === 'Duration';
    });

    if (duration) {
      duration.type = _grafana_data__WEBPACK_IMPORTED_MODULE_1__["FieldType"].string;

      duration.display = function (val) {
        var momentDuration = Object(_grafana_data__WEBPACK_IMPORTED_MODULE_1__["toDuration"])(val);
        return {
          numeric: val,
          text: getDurationText(momentDuration)
        };
      };
    }

    return response;
  };

  return XrayDataSource;
}(_grafana_runtime__WEBPACK_IMPORTED_MODULE_2__["DataSourceWithBackend"]);



function getDurationText(duration) {
  var result = '';

  if (duration.hours()) {
    result = duration.hours() + " hours ";
  }

  if (duration.minutes()) {
    result += duration.minutes() + " minutes ";
  }

  if (duration.seconds()) {
    result += duration.seconds() + " seconds";
  }

  return result;
}
/**
 The x-ray trace has a bit strange format where it comes as json and then some parts are string which also contains
 json, so some parts are escaped and we have to double parse that.
 */


function parseTraceResponse(response) {
  // Again assuming this will ge single field with single value which will be the trace data blob
  var traceData = response.fields[0].values.get(0);
  var traceParsed = JSON.parse(traceData);
  var parsedSegments = traceParsed.Segments.map(function (segment) {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, segment), {
      Document: JSON.parse(segment.Document)
    });
  });

  var traceParsedForReal = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, traceParsed), {
    Segments: parsedSegments
  });

  return new _grafana_data__WEBPACK_IMPORTED_MODULE_1__["MutableDataFrame"]({
    name: 'Trace',
    fields: [{
      name: 'trace',
      type: _grafana_data__WEBPACK_IMPORTED_MODULE_1__["FieldType"].trace,
      values: new _grafana_data__WEBPACK_IMPORTED_MODULE_1__["ArrayVector"]([Object(utils_transform__WEBPACK_IMPORTED_MODULE_5__["transformResponse"])(traceParsedForReal)])
    }],
    meta: {
      preferredVisualisationType: 'trace'
    }
  });
}
/**
 * Adds links to the Id field of the dataframe. This is later processed in grafana to create actual context dependant
 * link that works both in explore and in dashboards.
 * TODO This mutates the dataframe, probably just copy it but seems like new MutableDataframe(response) errors out
 */


function parseTracesListResponse(response, datasourceUid) {
  var idField = response.fields.find(function (f) {
    return f.name === 'Id';
  });
  idField.config.links = [{
    title: 'Trace: ${__value.raw}',
    url: '',
    internal: {
      datasourceUid: datasourceUid,
      query: {
        query: '${__value.raw}',
        queryType: 'getTrace'
      }
    }
  }];
  return response;
}

function processRequest(request, templateSrv) {
  return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, request), {
    targets: request.targets.map(function (target) {
      var newTarget = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, target); // Handle interval => resolution mapping


      if (newTarget.queryType === _types__WEBPACK_IMPORTED_MODULE_4__["XrayQueryType"].getTimeSeriesServiceStatistics) {
        if (request.intervalMs && !newTarget.resolution) {
          var intervalSeconds = Math.floor(request.intervalMs / 1000);
          newTarget.resolution = intervalSeconds <= 60 ? 60 : 300;
        }
      } // Variable interpolation


      newTarget.query = templateSrv.replace(newTarget.query, request.scopedVars); // Add Group filter expression to the query filter expression. This seems to mimic what x-ray console is doing
      // as there are APIs that do not expect group just the filter expression. At the same time some APIs like Insights
      // do not accept filter expression just the groupARN so this will have to be adjusted for them.

      if (target.group && target.group.FilterExpression && target.queryType !== _types__WEBPACK_IMPORTED_MODULE_4__["XrayQueryType"].getTrace) {
        if (newTarget.query) {
          newTarget.query = target.group.FilterExpression + ' AND ' + newTarget.query;
        } else {
          newTarget.query = target.group.FilterExpression;
        }
      }

      return newTarget;
    })
  });
}

/***/ }),

/***/ "./components/CheatSheet.tsx":
/*!***********************************!*\
  !*** ./components/CheatSheet.tsx ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CheatSheet; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var emotion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! emotion */ "emotion");
/* harmony import */ var emotion__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(emotion__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! types */ "./types.ts");





function renderExpression(expr, onClickExample) {
  return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "cheat-sheet-item__example",
    key: expr,
    onClick: function onClick() {
      return onClickExample({
        refId: 'A',
        query: expr,
        queryType: types__WEBPACK_IMPORTED_MODULE_3__["XrayQueryType"].getTraceSummaries
      });
    }
  }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("code", null, expr));
}

function CheatSheet(_a) {
  var onClickExample = _a.onClickExample;
  return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h2", null, "X-Ray Cheat Sheet"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "cheat-sheet-item"
  }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("p", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("span", null, "Use the search bar to display traces for a service, trace ID, or filter expression."), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("a", {
    target: "_blank",
    href: "https://docs.aws.amazon.com/console/xray/xray-filter-expressions"
  }, "Learn more")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "cheat-sheet-item__title"
  }, "Filter expressions"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "You can use custom expressions to narrow down your search."), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "Traces where response time was more than 5 seconds:"), renderExpression('responsetime > 5', onClickExample), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "Traces where the total duration was 5 to 8 seconds:"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, renderExpression('duration > 5 AND duration < 8', onClickExample)), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "Traces that included a call to 'api.example.com' with a fault (500 series error) or response time above 2.5 seconds, and with one or more segments having an annotation named 'account' with value '12345':"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, renderExpression('service("api.example.com") AND annotation.account = "12345"', onClickExample)), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "Traces where the service 'api.example.com' made a call to 'backend.example.com' that failed with a fault:"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, renderExpression('edge("api.example.com", "backend.example.com")', onClickExample)), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "Traces where the URL begins with 'http://api.example.com/' and contains '/v2/' but does not reach a service named 'api.example.com':"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, renderExpression('http.url BEGINSWITH "http://api.example.com/" AND http.url CONTAINS "/v2/" AND !service("api.example.com")', onClickExample)), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "Traces that completed successfully in under 3 seconds, including all downstream calls:"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, renderExpression('ok !partial duration < 3', onClickExample)), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "If you have multiple services with the same name but different types, you can use an ID function to distinguish between them in a service or edge filter expression:"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, renderExpression('service(id(name: "api.example.com", type: "AWS::EC2::Instance"))', onClickExample)), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "cheat-sheet-item"
  }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "cheat-sheet-item__title"
  }, "Filter keywords"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("table", {
    className: Object(emotion__WEBPACK_IMPORTED_MODULE_1__["css"])(templateObject_1 || (templateObject_1 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__makeTemplateObject"])(["\n              td {\n                padding: 5px 10px 5px 10px;\n              }\n            "], ["\n              td {\n                padding: 5px 10px 5px 10px;\n              }\n            "])))
  }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("th", null, "Attribute"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("th", null, "Type"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("th", null, "Description"))), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tbody", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "ok"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Boolean"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Response status code was 2XX Success.")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "error"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Boolean"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Response status code was 4XX Client Error.")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "fault"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Boolean"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Response status code was 5XX Server Error.")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "partial"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Boolean"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Request has incomplete segments.")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "responsetime"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Number"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Time that the server took to send a response.")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "duration"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Number"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Total request duration including all downstream calls.")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "http.status"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Number"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Response status code.")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "http.url"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "String"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Request URL.")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "http.method"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "String"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Request method.")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "http.useragent"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "String"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Request user agent string.")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "http.clientip"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "String"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Requestor's IP address.")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "user"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "String"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Value of user field on any segment in the trace.")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "annotation.*key*"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "String"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Value of annotation with field *key*.")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "service(*name*) "), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Complex"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Service with name *name*. Optional curly braces can contain a filter expression that applies to segments created by the service.")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "edge(*source*, *destination*) "), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Complex"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("td", null, "Connection between services *source* and *destination*. Optional curly braces can contain a filter expression that applies to segments on this connection.")))))));
}
var templateObject_1;

/***/ }),

/***/ "./components/QueryEditor/QueryEditor.tsx":
/*!************************************************!*\
  !*** ./components/QueryEditor/QueryEditor.tsx ***!
  \************************************************/
/*! exports provided: QueryEditor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueryEditor", function() { return QueryEditor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @grafana/ui */ "@grafana/ui");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _useGroups__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useGroups */ "./components/QueryEditor/useGroups.ts");
/* harmony import */ var _QueryEditorForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./QueryEditorForm */ "./components/QueryEditor/QueryEditorForm.tsx");





/**
 * Simple wrapper that is only responsible to load groups and delay actual render of the QueryEditorForm. Main reason
 * for that is that there is queryInit code that requires groups to be already loaded and is separate hook and it
 * cannot be inside a condition. There are other ways to put it into single component but this seems cleaner than
 * alternatives.
 */

function QueryEditor(props) {
  var groups = Object(_useGroups__WEBPACK_IMPORTED_MODULE_3__["useGroups"])(props.datasource); // We need this wrapper to wait for the groups and only after that run the useInitQuery as it needs to know the groups
  // at that point.

  if (!groups) {
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__["Spinner"], null);
  } else {
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_QueryEditorForm__WEBPACK_IMPORTED_MODULE_4__["QueryEditorForm"], Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, props), {
      groups: groups
    })));
  }
}

/***/ }),

/***/ "./components/QueryEditor/QueryEditorForm.tsx":
/*!****************************************************!*\
  !*** ./components/QueryEditor/QueryEditorForm.tsx ***!
  \****************************************************/
/*! exports provided: queryTypeToQueryTypeOptions, queryTypeOptionToQueryType, QueryEditorForm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "queryTypeToQueryTypeOptions", function() { return queryTypeToQueryTypeOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "queryTypeOptionToQueryType", function() { return queryTypeOptionToQueryType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueryEditorForm", function() { return QueryEditorForm; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../types */ "./types.ts");
/* harmony import */ var _useInitQuery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useInitQuery */ "./components/QueryEditor/useInitQuery.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "./components/QueryEditor/constants.ts");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @grafana/ui */ "@grafana/ui");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_grafana_ui__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _QuerySection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./QuerySection */ "./components/QueryEditor/QuerySection.tsx");
/* harmony import */ var emotion__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! emotion */ "emotion");
/* harmony import */ var emotion__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(emotion__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _XrayLinks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./XrayLinks */ "./components/QueryEditor/XrayLinks.tsx");










function findOptionForQueryType(queryType, options) {
  var e_1, _a;

  if (options === void 0) {
    options = _constants__WEBPACK_IMPORTED_MODULE_3__["queryTypeOptions"];
  }

  try {
    for (var options_1 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(options), options_1_1 = options_1.next(); !options_1_1.done; options_1_1 = options_1.next()) {
      var option = options_1_1.value;
      var selected = [];

      if (option.queryType === queryType) {
        selected.push(option);
        return selected;
      }

      if (option.children) {
        var found = findOptionForQueryType(queryType, option.children);

        if (found.length) {
          selected.push.apply(selected, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([option], found));
          return selected;
        }
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (options_1_1 && !options_1_1.done && (_a = options_1["return"])) _a.call(options_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return [];
}
/**
 * We do some mapping of the actual queryTypes to options user can select. Mainly don't want user to choose
 * between trace list and single trace and we detect that based on query. So trace list option returns single trace
 * if query contains single traceID.
 */


function queryTypeToQueryTypeOptions(queryType) {
  if (!queryType || queryType === _types__WEBPACK_IMPORTED_MODULE_1__["XrayQueryType"].getTimeSeriesServiceStatistics) {
    return [_constants__WEBPACK_IMPORTED_MODULE_3__["traceStatisticsOption"]];
  }

  if (queryType === _types__WEBPACK_IMPORTED_MODULE_1__["XrayQueryType"].getTrace || queryType === _types__WEBPACK_IMPORTED_MODULE_1__["XrayQueryType"].getTraceSummaries) {
    return [_constants__WEBPACK_IMPORTED_MODULE_3__["traceListOption"]];
  }

  if (queryType === _types__WEBPACK_IMPORTED_MODULE_1__["XrayQueryType"].getInsights) {
    return [_constants__WEBPACK_IMPORTED_MODULE_3__["insightsOption"]];
  }

  return findOptionForQueryType(queryType);
}
function queryTypeOptionToQueryType(selected, query) {
  var e_2, _a;

  var _b;

  if (selected[0] === _constants__WEBPACK_IMPORTED_MODULE_3__["traceListOption"].value) {
    var isTraceIdQuery = /^\d-\w{8}-\w{24}$/.test(query.trim());
    return isTraceIdQuery ? _types__WEBPACK_IMPORTED_MODULE_1__["XrayQueryType"].getTrace : _types__WEBPACK_IMPORTED_MODULE_1__["XrayQueryType"].getTraceSummaries;
  } else {
    var found = undefined;

    var _loop_1 = function _loop_1(path) {
      found = ((_b = found === null || found === void 0 ? void 0 : found.children) !== null && _b !== void 0 ? _b : _constants__WEBPACK_IMPORTED_MODULE_3__["queryTypeOptions"]).find(function (option) {
        return option.value === path;
      });
    };

    try {
      for (var selected_1 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(selected), selected_1_1 = selected_1.next(); !selected_1_1.done; selected_1_1 = selected_1.next()) {
        var path = selected_1_1.value;

        _loop_1(path);
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (selected_1_1 && !selected_1_1.done && (_a = selected_1["return"])) _a.call(selected_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    return found.queryType;
  }
}
var getStyles = Object(_grafana_ui__WEBPACK_IMPORTED_MODULE_4__["stylesFactory"])(function () {
  return {
    queryParamsRow: Object(emotion__WEBPACK_IMPORTED_MODULE_7__["css"])(templateObject_1 || (templateObject_1 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__makeTemplateObject"])(["\n    flex-wrap: wrap;\n  "], ["\n    flex-wrap: wrap;\n  "]))),
    spring: Object(emotion__WEBPACK_IMPORTED_MODULE_7__["css"])(templateObject_2 || (templateObject_2 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__makeTemplateObject"])(["\n    flex: 1;\n  "], ["\n    flex: 1;\n  "])))
  };
});
function QueryEditorForm(_a) {
  var _b, _c;

  var query = _a.query,
      _onChange = _a.onChange,
      datasource = _a.datasource,
      onRunQuery = _a.onRunQuery,
      groups = _a.groups,
      range = _a.range;
  var selectedOptions = queryTypeToQueryTypeOptions(query.queryType);
  Object(_useInitQuery__WEBPACK_IMPORTED_MODULE_2__["useInitQuery"])(query, _onChange, groups, datasource);
  var allGroups = selectedOptions[0] === _constants__WEBPACK_IMPORTED_MODULE_3__["insightsOption"] ? Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_constants__WEBPACK_IMPORTED_MODULE_3__["dummyAllGroup"]], groups) : groups;
  var styles = getStyles();
  return react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", null, selectedOptions[0] !== _constants__WEBPACK_IMPORTED_MODULE_3__["insightsOption"] && react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
    className: "gf-form"
  }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_QuerySection__WEBPACK_IMPORTED_MODULE_6__["QuerySection"], {
    query: query,
    datasource: datasource,
    onChange: _onChange,
    onRunQuery: onRunQuery,
    selectedOptions: selectedOptions
  })), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
    className: "gf-form " + styles.queryParamsRow
  }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
    className: "gf-form"
  }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_4__["InlineFormLabel"], {
    className: "query-keyword",
    width: "auto"
  }, "Query Type"), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_4__["ButtonCascader"], {
    value: selectedOptions.map(function (option) {
      return option.value;
    }),
    options: _constants__WEBPACK_IMPORTED_MODULE_3__["queryTypeOptions"],
    onChange: function onChange(value) {
      var newQueryType = queryTypeOptionToQueryType(value, query.query || '');

      _onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        queryType: newQueryType,
        columns: newQueryType === _types__WEBPACK_IMPORTED_MODULE_1__["XrayQueryType"].getTimeSeriesServiceStatistics ? ['all'] : undefined
      }));
    }
  }, selectedOptions[selectedOptions.length - 1].label)), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
    className: "gf-form"
  }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_4__["InlineFormLabel"], {
    className: "query-keyword",
    width: "auto"
  }, "Group"), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_4__["Segment"], {
    value: (_b = query.group) === null || _b === void 0 ? void 0 : _b.GroupName,
    options: allGroups.map(function (group) {
      return {
        value: group.GroupARN,
        label: group.GroupName
      };
    }),
    onChange: function onChange(value) {
      _onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        group: allGroups.find(function (g) {
          return g.GroupARN === value.value;
        })
      }));
    }
  })), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
    className: "gf-form"
  }, selectedOptions[0] === _constants__WEBPACK_IMPORTED_MODULE_3__["insightsOption"] && react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
    className: "gf-form"
  }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_4__["InlineFormLabel"], {
    className: "query-keyword",
    width: "auto"
  }, "State"), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_4__["Segment"], {
    value: (_c = query.state) !== null && _c !== void 0 ? _c : 'All',
    options: ['All', 'Active', 'Closed'].map(function (val) {
      return {
        value: val,
        label: val
      };
    }),
    onChange: function onChange(value) {
      _onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        state: value.value
      }));
    }
  }))), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
    className: "gf-form"
  }, selectedOptions[0] === _constants__WEBPACK_IMPORTED_MODULE_3__["traceStatisticsOption"] && react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
    className: "gf-form",
    "data-testid": "resolution",
    style: {
      flexWrap: 'wrap'
    }
  }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_4__["InlineFormLabel"], {
    className: "query-keyword",
    width: "auto"
  }, "Resolution"), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_4__["Segment"], {
    value: query.resolution ? query.resolution.toString() + 's' : 'auto',
    options: ['auto', '60s', '300s'].map(function (val) {
      return {
        value: val,
        label: val
      };
    }),
    onChange: function onChange(_a) {
      var value = _a.value;

      _onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        resolution: value === 'auto' ? undefined : parseInt(value, 10)
      }));
    }
  }))), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
    className: styles.spring
  }), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_XrayLinks__WEBPACK_IMPORTED_MODULE_8__["XrayLinks"], {
    datasource: datasource,
    query: query,
    range: range
  })), selectedOptions[0] === _constants__WEBPACK_IMPORTED_MODULE_3__["traceStatisticsOption"] && react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
    className: "gf-form",
    "data-testid": "column-filter",
    style: {
      flexWrap: 'wrap'
    }
  }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_4__["InlineFormLabel"], {
    className: "query-keyword",
    width: "auto"
  }, "Columns"), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
    style: {
      flex: 1
    }
  }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_4__["MultiSelect"], {
    allowCustomValue: false,
    options: Object.keys(_constants__WEBPACK_IMPORTED_MODULE_3__["columnNames"]).map(function (c) {
      return {
        label: _constants__WEBPACK_IMPORTED_MODULE_3__["columnNames"][c],
        value: c
      };
    }),
    value: (query.columns || []).map(function (c) {
      return {
        label: _constants__WEBPACK_IMPORTED_MODULE_3__["columnNames"][c],
        value: c
      };
    }),
    onChange: function onChange(values) {
      return _onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        columns: values.map(function (v) {
          return v.value;
        })
      }));
    },
    closeMenuOnSelect: false,
    isClearable: true,
    placeholder: "All columns",
    menuPlacement: "bottom"
  }))));
}
var templateObject_1, templateObject_2;

/***/ }),

/***/ "./components/QueryEditor/QuerySection.tsx":
/*!*************************************************!*\
  !*** ./components/QueryEditor/QuerySection.tsx ***!
  \*************************************************/
/*! exports provided: QuerySection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuerySection", function() { return QuerySection; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @grafana/ui */ "@grafana/ui");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _XRayQueryField__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./XRayQueryField */ "./components/QueryEditor/XRayQueryField.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _QueryEditorForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./QueryEditorForm */ "./components/QueryEditor/QueryEditorForm.tsx");
/* harmony import */ var emotion__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! emotion */ "emotion");
/* harmony import */ var emotion__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(emotion__WEBPACK_IMPORTED_MODULE_5__);






var getStyles = Object(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__["stylesFactory"])(function () {
  return {
    tooltipLink: Object(emotion__WEBPACK_IMPORTED_MODULE_5__["css"])(templateObject_1 || (templateObject_1 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__makeTemplateObject"])(["\n    color: #33a2e5;\n    &:hover {\n      color: #33a2e5;\n      filter: brightness(120%);\n    }\n  "], ["\n    color: #33a2e5;\n    &:hover {\n      color: #33a2e5;\n      filter: brightness(120%);\n    }\n  "])))
  };
});
function QuerySection(props) {
  var datasource = props.datasource,
      query = props.query,
      onRunQuery = props.onRunQuery,
      _onChange = props.onChange,
      selectedOptions = props.selectedOptions;
  var styles = getStyles();

  var onRunQueryLocal = function onRunQueryLocal() {
    _onChange(query); // Only run query if it has value


    if (query.query) {
      onRunQuery();
    }
  };

  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("div", {
    style: {
      flex: 1,
      display: 'flex'
    }
  }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__["InlineFormLabel"], {
    className: "query-keyword",
    width: "auto"
  }, "Query\xA0", react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__["Tooltip"], {
    placement: "top",
    content: react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("span", null, "See", ' ', react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("a", {
      href: "https://docs.aws.amazon.com/xray/latest/devguide/xray-console-filters.html?icmpid=docs_xray_console",
      target: "_blank",
      className: styles.tooltipLink
    }, "X-Ray documentation"), ' ', "for filter expression help."),
    theme: "info"
  }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__["Icon"], {
    className: "gf-form-help-icon gf-form-help-icon--right-normal",
    name: "info-circle",
    size: "sm"
  }))), react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(_XRayQueryField__WEBPACK_IMPORTED_MODULE_2__["XRayQueryField"], {
    query: query,
    history: [],
    datasource: datasource,
    onRunQuery: onRunQueryLocal,
    onChange: function onChange(e) {
      _onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        queryType: Object(_QueryEditorForm__WEBPACK_IMPORTED_MODULE_4__["queryTypeOptionToQueryType"])(selectedOptions.map(function (option) {
          return option.value;
        }), e.query),
        query: e.query
      }));
    }
  }));
}
var templateObject_1;

/***/ }),

/***/ "./components/QueryEditor/XRayQueryField.tsx":
/*!***************************************************!*\
  !*** ./components/QueryEditor/XRayQueryField.tsx ***!
  \***************************************************/
/*! exports provided: XRayQueryField */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XRayQueryField", function() { return XRayQueryField; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prismjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prismjs */ "prismjs");
/* harmony import */ var prismjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prismjs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @grafana/ui */ "@grafana/ui");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_grafana_ui__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! types */ "./types.ts");
/* harmony import */ var syntax__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! syntax */ "./syntax.ts");






var PRISM_LANGUAGE = 'xray';
var plugins = [Object(_grafana_ui__WEBPACK_IMPORTED_MODULE_3__["BracesPlugin"])(), Object(_grafana_ui__WEBPACK_IMPORTED_MODULE_3__["SlatePrism"])({
  onlyIn: function onlyIn(node) {
    return node.object === 'block' && node.type === 'code_block';
  },
  getSyntax: function getSyntax() {
    return PRISM_LANGUAGE;
  }
})];
function XRayQueryField(props) {
  var _this = this;

  var queryType = Object(react__WEBPACK_IMPORTED_MODULE_1__["useRef"])(props.query.queryType);
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    queryType.current = props.query.queryType;
  }, [props.query, props.query.queryType]);
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    prismjs__WEBPACK_IMPORTED_MODULE_2___default.a.languages[PRISM_LANGUAGE] = syntax__WEBPACK_IMPORTED_MODULE_5__["tokenizer"];
  }, []);

  var onChangeQuery = function onChangeQuery(value) {
    var query = props.query,
        onChange = props.onChange;

    var nextQuery = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
      query: value
    });

    onChange(nextQuery);
  };

  var onTypeAhead = function onTypeAhead(typeahead) {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(_this, void 0, Promise, function () {
      var datasource, xRayLanguageProvider;
      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
        switch (_a.label) {
          case 0:
            datasource = props.datasource; // Only show suggestions for getTraceSummaries

            if (!datasource.languageProvider || queryType.current === types__WEBPACK_IMPORTED_MODULE_4__["XrayQueryType"].getTrace) {
              return [2
              /*return*/
              , {
                suggestions: []
              }];
            }

            xRayLanguageProvider = datasource.languageProvider;
            return [4
            /*yield*/
            , xRayLanguageProvider.provideCompletionItems(typeahead)];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  };

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_3__["QueryField"], {
    additionalPlugins: plugins,
    query: props.query.query,
    portalOrigin: "xray",
    onChange: onChangeQuery,
    onTypeahead: onTypeAhead,
    placeholder: "Enter service name, annotation, trace ID.",
    onRunQuery: props.onRunQuery
  });
}

/***/ }),

/***/ "./components/QueryEditor/XrayLinks.tsx":
/*!**********************************************!*\
  !*** ./components/QueryEditor/XrayLinks.tsx ***!
  \**********************************************/
/*! exports provided: XrayLinks */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XrayLinks", function() { return XrayLinks; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @grafana/ui */ "@grafana/ui");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var emotion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! emotion */ "emotion");
/* harmony import */ var emotion__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(emotion__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);




var getStyles = Object(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__["stylesFactory"])(function () {
  return {
    container: Object(emotion__WEBPACK_IMPORTED_MODULE_2__["css"])(templateObject_1 || (templateObject_1 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__makeTemplateObject"])(["\n    display: flex;\n  "], ["\n    display: flex;\n  "]))),
    link: Object(emotion__WEBPACK_IMPORTED_MODULE_2__["css"])(templateObject_2 || (templateObject_2 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__makeTemplateObject"])(["\n    white-space: nowrap;\n  "], ["\n    white-space: nowrap;\n  "])))
  };
});
function XrayLinks(_a) {
  var datasource = _a.datasource,
      query = _a.query,
      range = _a.range;
  var styles = getStyles();
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("div", {
    className: styles.container
  }, [['To X-Ray service map', datasource.getServiceMapUrl()], ['Open in X-Ray console', datasource.getXrayUrlForQuery(query, range)]].map(function (_a) {
    var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(_a, 2),
        text = _b[0],
        href = _b[1];

    return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("a", {
      href: href,
      target: "_blank",
      rel: "noopener",
      key: href
    }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("span", {
      className: "gf-form-label gf-form-label--btn " + styles.link
    }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("i", {
      className: "fa fa-share-square-o"
    }), "\xA0", text));
  }));
}
var templateObject_1, templateObject_2;

/***/ }),

/***/ "./components/QueryEditor/constants.ts":
/*!*********************************************!*\
  !*** ./components/QueryEditor/constants.ts ***!
  \*********************************************/
/*! exports provided: traceListOption, insightsOption, traceStatisticsOption, queryTypeOptions, columnNames, dummyAllGroup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "traceListOption", function() { return traceListOption; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "insightsOption", function() { return insightsOption; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "traceStatisticsOption", function() { return traceStatisticsOption; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "queryTypeOptions", function() { return queryTypeOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "columnNames", function() { return columnNames; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dummyAllGroup", function() { return dummyAllGroup; });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../types */ "./types.ts");

var traceListOption = {
  label: 'Trace List',
  value: 'traceList'
};
var insightsOption = {
  label: 'Insights',
  value: 'insights',
  queryType: _types__WEBPACK_IMPORTED_MODULE_0__["XrayQueryType"].getInsights
};
var traceStatisticsOption = {
  label: 'Trace Statistics',
  value: 'traceStatistics',
  queryType: _types__WEBPACK_IMPORTED_MODULE_0__["XrayQueryType"].getTimeSeriesServiceStatistics
};
var queryTypeOptions = [traceListOption, traceStatisticsOption, insightsOption, {
  label: 'Trace Analytics',
  value: 'traceAnalytics',
  children: [{
    value: 'rootCause',
    label: 'Root Cause',
    children: [{
      value: 'responseTime',
      label: 'Response Time',
      children: [{
        value: 'rootCauseService',
        label: 'Root Cause',
        queryType: _types__WEBPACK_IMPORTED_MODULE_0__["XrayQueryType"].getAnalyticsRootCauseResponseTimeService
      }, {
        value: 'path',
        label: 'Path',
        queryType: _types__WEBPACK_IMPORTED_MODULE_0__["XrayQueryType"].getAnalyticsRootCauseResponseTimePath
      }]
    }, {
      value: 'error',
      label: 'Error',
      children: [{
        value: 'rootCauseService',
        label: 'Root Cause',
        queryType: _types__WEBPACK_IMPORTED_MODULE_0__["XrayQueryType"].getAnalyticsRootCauseErrorService
      }, {
        value: 'path',
        label: 'Path',
        queryType: _types__WEBPACK_IMPORTED_MODULE_0__["XrayQueryType"].getAnalyticsRootCauseErrorPath
      }, {
        value: 'message',
        label: 'Error Message',
        queryType: _types__WEBPACK_IMPORTED_MODULE_0__["XrayQueryType"].getAnalyticsRootCauseErrorMessage
      }]
    }, {
      value: 'fault',
      label: 'Fault',
      children: [{
        value: 'rootCauseService',
        label: 'Root Cause',
        queryType: _types__WEBPACK_IMPORTED_MODULE_0__["XrayQueryType"].getAnalyticsRootCauseFaultService
      }, {
        value: 'path',
        label: 'Path',
        queryType: _types__WEBPACK_IMPORTED_MODULE_0__["XrayQueryType"].getAnalyticsRootCauseFaultPath
      }, {
        value: 'message',
        label: 'Error Message',
        queryType: _types__WEBPACK_IMPORTED_MODULE_0__["XrayQueryType"].getAnalyticsRootCauseFaultMessage
      }]
    }]
  }, {
    value: 'user',
    label: 'End user impact',
    queryType: _types__WEBPACK_IMPORTED_MODULE_0__["XrayQueryType"].getAnalyticsUser
  }, {
    value: 'url',
    label: 'URL',
    queryType: _types__WEBPACK_IMPORTED_MODULE_0__["XrayQueryType"].getAnalyticsUrl
  }, {
    value: 'statusCode',
    label: 'HTTP status code',
    queryType: _types__WEBPACK_IMPORTED_MODULE_0__["XrayQueryType"].getAnalyticsStatusCode
  }]
}];
var columnNames = {
  'ErrorStatistics.ThrottleCount': 'Throttle Count',
  'ErrorStatistics.TotalCount': 'Error Count',
  'FaultStatistics.TotalCount': 'Fault Count',
  OkCount: 'Success Count',
  TotalCount: 'Total Count',
  'Computed.AverageResponseTime': 'Average Response Time'
}; // Dummy group that can be selected only in insights;

var dummyAllGroup = {
  GroupName: 'All',
  GroupARN: 'All'
};

/***/ }),

/***/ "./components/QueryEditor/useGroups.ts":
/*!*********************************************!*\
  !*** ./components/QueryEditor/useGroups.ts ***!
  \*********************************************/
/*! exports provided: useGroups */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useGroups", function() { return useGroups; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


function useGroups(datasource) {
  var _a = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(undefined), 2),
      groups = _a[0],
      setGroups = _a[1];

  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    // This should run in case we change between different x-ray datasources and so should clear old groups.
    setGroups(undefined);
    datasource.getGroups().then(function (groups) {
      setGroups(groups);
    });
  }, [datasource]);
  return groups;
}

/***/ }),

/***/ "./components/QueryEditor/useInitQuery.ts":
/*!************************************************!*\
  !*** ./components/QueryEditor/useInitQuery.ts ***!
  \************************************************/
/*! exports provided: useInitQuery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useInitQuery", function() { return useInitQuery; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../types */ "./types.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "./components/QueryEditor/constants.ts");




/**
 * Inits the query on mount or on datasource change.
 */

function useInitQuery(query, onChange, groups, dataSource) {
  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    var _a, _b; // We assume here the "Default" group is always there but lets fallback to first group if not. In case there are
    // no groups we don't have to actually crash as most queryTypes don't need group to be defined


    var defaultGroup = groups.find(function (g) {
      return g.GroupName === 'Default';
    }) || groups[0]; // We assume that if there is no queryType during mount there should not be any query so we do not need to
    // check if query has traceId or not as we do with the QueryTypeOptions mapping.

    if (!query.queryType) {
      onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
        queryType: _types__WEBPACK_IMPORTED_MODULE_1__["XrayQueryType"].getTraceSummaries,
        query: '',
        group: defaultGroup
      }));
    } else {
      // Check if we can keep the group from previous x-ray datasource or we need to set it to default again.
      var group = query.group;
      var allGroups = groups;

      if (query.queryType === _types__WEBPACK_IMPORTED_MODULE_1__["XrayQueryType"].getInsights) {
        allGroups = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([_constants__WEBPACK_IMPORTED_MODULE_3__["dummyAllGroup"]], groups);
      }

      var sameArnGroup = allGroups.find(function (g) {
        var _a;

        return g.GroupARN === ((_a = query.group) === null || _a === void 0 ? void 0 : _a.GroupARN);
      });

      if (!sameArnGroup) {
        group = defaultGroup;
      } else if ( // This is the case when the group changes ie has the same ARN but different filter for example. I assume this can
      // happen but not 100% sure.
      sameArnGroup.GroupName !== ((_a = query.group) === null || _a === void 0 ? void 0 : _a.GroupName) || sameArnGroup.FilterExpression !== ((_b = query.group) === null || _b === void 0 ? void 0 : _b.FilterExpression)) {
        group = sameArnGroup;
      }

      if (group !== query.group) {
        onChange(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, query), {
          group: group
        }));
      }
    }
  }, [query, groups, onChange, dataSource]);
}

/***/ }),

/***/ "./language_provider.ts":
/*!******************************!*\
  !*** ./language_provider.ts ***!
  \******************************/
/*! exports provided: XRayLanguageProvider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XRayLanguageProvider", function() { return XRayLanguageProvider; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @grafana/data */ "@grafana/data");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_grafana_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var syntax__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! syntax */ "./syntax.ts");



var booleanKeyWords = {
  prefixMatch: true,
  label: 'Boolean Keywords',
  items: syntax__WEBPACK_IMPORTED_MODULE_2__["BOOLEAN_KEYWORDS"]
};
var numberKeyWords = {
  prefixMatch: true,
  label: 'Number Keywords',
  items: syntax__WEBPACK_IMPORTED_MODULE_2__["NUMBER_KEYWORDS"]
};
var stringKeyWords = {
  prefixMatch: true,
  label: 'String Keywords',
  items: syntax__WEBPACK_IMPORTED_MODULE_2__["STRING_KEYWORDS"]
};
var complexKeyWords = {
  prefixMatch: true,
  label: 'Complex Keywords',
  items: syntax__WEBPACK_IMPORTED_MODULE_2__["COMPLEX_KEYWORDS"]
};

var XRayLanguageProvider =
/** @class */
function (_super) {
  Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(XRayLanguageProvider, _super);

  function XRayLanguageProvider(dataSource, initialValues) {
    var _this = _super.call(this) || this;

    _this.request = function () {
      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(_this, void 0, void 0, function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
          return [2
          /*return*/
          , Promise.resolve()];
        });
      });
    };

    _this.start = function () {
      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(_this, void 0, void 0, function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
          return [2
          /*return*/
          , []];
        });
      });
    };

    _this.getAllKeywords = function () {
      return {
        suggestions: [booleanKeyWords, numberKeyWords, stringKeyWords, complexKeyWords]
      };
    };

    _this.datasource = dataSource;
    Object.assign(_this, initialValues);
    return _this;
  }
  /**
   * Return suggestions based on input that can be then plugged into a type ahead dropdown.
   */


  XRayLanguageProvider.prototype.provideCompletionItems = function (_a) {
    var value = _a.value;
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, Promise, function () {
      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_b) {
        if (!value) {
          return [2
          /*return*/
          , {
            suggestions: []
          }];
        } // Get all the keyword for now every time


        return [2
        /*return*/
        , this.getAllKeywords()];
      });
    });
  };

  return XRayLanguageProvider;
}(_grafana_data__WEBPACK_IMPORTED_MODULE_1__["LanguageProvider"]);



/***/ }),

/***/ "./module.ts":
/*!*******************!*\
  !*** ./module.ts ***!
  \*******************/
/*! exports provided: plugin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "plugin", function() { return plugin; });
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @grafana/data */ "@grafana/data");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_grafana_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _DataSource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DataSource */ "./DataSource.ts");
/* harmony import */ var _ConfigEditor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ConfigEditor */ "./ConfigEditor.tsx");
/* harmony import */ var _components_QueryEditor_QueryEditor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/QueryEditor/QueryEditor */ "./components/QueryEditor/QueryEditor.tsx");
/* harmony import */ var _components_CheatSheet__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/CheatSheet */ "./components/CheatSheet.tsx");





var plugin = new _grafana_data__WEBPACK_IMPORTED_MODULE_0__["DataSourcePlugin"](_DataSource__WEBPACK_IMPORTED_MODULE_1__["XrayDataSource"]).setConfigEditor(_ConfigEditor__WEBPACK_IMPORTED_MODULE_2__["ConfigEditor"]).setExploreStartPage(_components_CheatSheet__WEBPACK_IMPORTED_MODULE_4__["default"]).setQueryEditor(_components_QueryEditor_QueryEditor__WEBPACK_IMPORTED_MODULE_3__["QueryEditor"]);

/***/ }),

/***/ "./syntax.ts":
/*!*******************!*\
  !*** ./syntax.ts ***!
  \*******************/
/*! exports provided: BOOLEAN_KEYWORDS, NUMBER_KEYWORDS, STRING_KEYWORDS, STRING_OPERATORS, COMPLEX_KEYWORDS, All_KEYWORDS, tokenizer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BOOLEAN_KEYWORDS", function() { return BOOLEAN_KEYWORDS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NUMBER_KEYWORDS", function() { return NUMBER_KEYWORDS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STRING_KEYWORDS", function() { return STRING_KEYWORDS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STRING_OPERATORS", function() { return STRING_OPERATORS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMPLEX_KEYWORDS", function() { return COMPLEX_KEYWORDS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "All_KEYWORDS", function() { return All_KEYWORDS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tokenizer", function() { return tokenizer; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");

var BOOLEAN_KEYWORDS = [{
  label: 'ok',
  documentation: 'Response status code was 2XX Success.'
}, {
  label: 'error',
  documentation: 'Response status code was 4XX Client Error.'
}, {
  label: 'throttle',
  documentation: 'Response status code was 429 Too Many Requests.'
}, {
  label: 'fault',
  documentation: 'Response status code was 5XX Server Error.'
}, {
  label: 'partial',
  documentation: 'Request has incomplete segments.'
}, {
  label: 'inferred',
  documentation: 'Request has inferred segments.'
}, {
  label: 'first',
  documentation: 'Element is the first of an enumerated list.'
}];
var NUMBER_KEYWORDS = [{
  label: 'responsetime',
  documentation: 'Time that the server took to send a response.'
}, {
  label: 'duration',
  documentation: 'Total request duration, including all downstream calls.'
}, {
  label: 'http.status',
  documentation: 'Response status code.'
}, {
  label: 'index',
  documentation: 'Position of an element in an enumerated list.'
}, {
  label: 'coverage',
  documentation: 'Decimal percentage of entity response time over root segment response time. Applicable only for response time root cause entities.'
}];
var STRING_KEYWORDS = [{
  label: 'http.url',
  documentation: 'Request URL.'
}, {
  label: 'http.method',
  documentation: 'Request method.'
}, {
  label: 'http.useragent',
  documentation: 'Request user agent string.'
}, {
  label: 'http.clientip',
  documentation: "Requestor's IP address."
}, {
  label: 'user',
  documentation: 'Value of the user field on any segment in the trace.'
}, {
  label: 'name',
  documentation: 'The name of a service or exception.'
}, {
  label: 'type',
  documentation: 'Service type.'
}, {
  label: 'message',
  documentation: 'Exception message.'
}, {
  label: 'availabilityzone',
  documentation: 'Value of the availabilityzone field on any segment in the trace.'
}, {
  label: 'instance.id',
  documentation: 'Value of the instance ID field on any segment in the trace.'
}, {
  label: 'resource.arn',
  documentation: 'Value of the resource ARN field on any segment in the trace.'
}];
var STRING_OPERATORS = ['=', '!=', 'CONTAINS', 'BEGINSWITH', 'ENDSWITH'];
var COMPLEX_KEYWORDS = [{
  label: 'service',
  documentation: "service(_name_) {_filter_}\n     Service with name _name_.\n     Optional curly braces can contain a filter expression that applies to segments created by the service."
}, {
  label: 'edge',
  documentation: "edge(_source_, _destination_) {_filter_}\n      Connection between services _source_ and _destination_.\n      Optional curly braces can contain a filter expression that applies to segments on this connection."
}, {
  label: 'annotation',
  documentation: "annotation.key\n    Value of an annotation with field _key_.\n    The value of an annotation can be a Boolean, number, or string, so you can use any of the comparison operators of those types.\n    You can't use this keyword in combination with the service or edge keyword."
}, {
  label: 'json',
  documentation: "JSON root cause object.\n    See Getting data from AWS X-Ray for steps to create JSON entities programmatically."
}, {
  label: 'id',
  documentation: "id(name: \"service-name\", type:\"service::type\")\n    You can use the id function in place of a service name in service and edge filters."
}];
var All_KEYWORDS = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(BOOLEAN_KEYWORDS, NUMBER_KEYWORDS, STRING_KEYWORDS, COMPLEX_KEYWORDS);
var tokenizer = {
  "function": {
    pattern: new RegExp("\\b(?:" + All_KEYWORDS.map(function (f) {
      return f.label;
    }).join('|') + ")\\b", 'i')
  },
  punctuation: /[{}()`,]/,
  whitespace: /\s+/,
  "boolean": /\btrue|false\b/,
  isTraceId: /^\d-\w{8}-\w{24}$/,
  logicalOperator: {
    pattern: /\band|or\b/i,
    alias: 'builtin'
  },
  number: /\b-?\d+((\.\d*)?([eE][+-]?\d+)?)?\b/
};

/***/ }),

/***/ "./types.ts":
/*!******************!*\
  !*** ./types.ts ***!
  \******************/
/*! exports provided: XrayQueryType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XrayQueryType", function() { return XrayQueryType; });
var XrayQueryType;

(function (XrayQueryType) {
  XrayQueryType["getTrace"] = "getTrace";
  XrayQueryType["getTraceSummaries"] = "getTraceSummaries";
  XrayQueryType["getTimeSeriesServiceStatistics"] = "getTimeSeriesServiceStatistics";
  XrayQueryType["getAnalyticsRootCauseResponseTimeService"] = "getAnalyticsRootCauseResponseTimeService";
  XrayQueryType["getAnalyticsRootCauseResponseTimePath"] = "getAnalyticsRootCauseResponseTimePath";
  XrayQueryType["getAnalyticsRootCauseErrorService"] = "getAnalyticsRootCauseErrorService";
  XrayQueryType["getAnalyticsRootCauseErrorPath"] = "getAnalyticsRootCauseErrorPath";
  XrayQueryType["getAnalyticsRootCauseErrorMessage"] = "getAnalyticsRootCauseErrorMessage";
  XrayQueryType["getAnalyticsRootCauseFaultService"] = "getAnalyticsRootCauseFaultService";
  XrayQueryType["getAnalyticsRootCauseFaultPath"] = "getAnalyticsRootCauseFaultPath";
  XrayQueryType["getAnalyticsRootCauseFaultMessage"] = "getAnalyticsRootCauseFaultMessage";
  XrayQueryType["getAnalyticsUser"] = "getAnalyticsUser";
  XrayQueryType["getAnalyticsUrl"] = "getAnalyticsUrl";
  XrayQueryType["getAnalyticsStatusCode"] = "getAnalyticsStatusCode";
  XrayQueryType["getInsights"] = "getInsights";
})(XrayQueryType || (XrayQueryType = {}));

/***/ }),

/***/ "./utils/flatten.ts":
/*!**************************!*\
  !*** ./utils/flatten.ts ***!
  \**************************/
/*! exports provided: flatten */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flatten", function() { return flatten; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

function flatten(target) {
  var output = {};

  function step(object, prev) {
    Object.keys(object).forEach(function (key) {
      var value = object[key];
      var newKey = prev ? prev + '.' + key : key;

      if (Object(lodash__WEBPACK_IMPORTED_MODULE_0__["isPlainObject"])(value) && Object.keys(value).length) {
        return step(value, newKey);
      }

      if (Array.isArray(value)) {
        value.forEach(function (val, index) {
          var keyWithArray = newKey + "[" + index + "]";

          if (Object(lodash__WEBPACK_IMPORTED_MODULE_0__["isPlainObject"])(val)) {
            step(val, keyWithArray);
          } else {
            output[keyWithArray] = val;
          }
        });
        return;
      }

      output[newKey] = value;
    });
  }

  step(target, null);
  return output;
}

/***/ }),

/***/ "./utils/transform.ts":
/*!****************************!*\
  !*** ./utils/transform.ts ***!
  \****************************/
/*! exports provided: transformResponse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transformResponse", function() { return transformResponse; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _flatten__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./flatten */ "./utils/flatten.ts");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }




var MS_MULTIPLIER = 1000000;
/**
 * Transforms response to format similar to Jaegers as we use Jaeger ui on the frontend.
 */

function transformResponse(data) {
  var processes = gatherProcesses(data.Segments);
  var subSegmentSpans = []; // parentSpans is used to group services that has the same name

  var parentSpans = [];
  var segmentSpans = data.Segments.map(function (segment) {
    var _a;

    var subSegmentProcessId = segment.Document.name;
    getSubSegments(segment.Document, function (subSegment, segmentParent) {
      var _a, _b;

      subSegmentProcessId = (_b = (_a = processes[subSegment.name]) === null || _a === void 0 ? void 0 : _a.serviceName) !== null && _b !== void 0 ? _b : subSegmentProcessId;
      subSegmentSpans.push(transformSegment(subSegment, subSegmentProcessId, segmentParent.id));
    });
    var parentSpan = parentSpans.find(function (ps) {
      return ps.spanID === segment.Document.name + segment.Document.origin;
    });

    if (!parentSpan) {
      parentSpan = {
        duration: 0,
        flags: 1,
        logs: [],
        operationName: (_a = segment.Document.origin) !== null && _a !== void 0 ? _a : segment.Document.name,
        processID: segment.Document.name,
        spanID: segment.Document.name + segment.Document.origin,
        startTime: segment.Document.start_time * MS_MULTIPLIER,
        traceID: segment.Document.trace_id
      };
      parentSpans.push(parentSpan);
    }

    return transformSegment(segment.Document, segment.Document.name, parentSpan.spanID);
  });
  return {
    processes: processes,
    traceID: data.Id,
    spans: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(subSegmentSpans, segmentSpans, parentSpans),
    warnings: null
  };
}

function getSubSegments(segment, callBack) {
  var _a;

  if ((_a = segment.subsegments) === null || _a === void 0 ? void 0 : _a.length) {
    segment.subsegments.forEach(function (subSegment) {
      callBack(subSegment, segment);
      getSubSegments(subSegment, callBack);
    });
  }
}

function transformSegment(segment, processID, parentId) {
  var references = [];

  if (parentId) {
    references.push({
      refType: 'CHILD_OF',
      spanID: parentId,
      traceID: segment.trace_id
    });
  }

  var duration = segment.end_time ? segment.end_time * MS_MULTIPLIER - segment.start_time * MS_MULTIPLIER : 0;
  var jaegerSpan = {
    duration: duration,
    flags: 1,
    logs: [],
    operationName: segment.name,
    processID: processID,
    startTime: segment.start_time * MS_MULTIPLIER,
    spanID: segment.id,
    traceID: segment.trace_id,
    stackTraces: getStackTrace(segment),
    tags: getTagsForSpan(segment),
    references: references,
    errorIconColor: getIconColor(segment)
  };
  return jaegerSpan;
}

function getIconColor(segment) {
  if (segment.error) {
    return '#FFC46E';
  }

  if (segment.throttle) {
    return 'mediumpurple';
  } // Fault should be red so we don't want to set it because it is the default color.


  return undefined;
}

function getStackTrace(segment) {
  var _a;

  if (!((_a = segment.cause) === null || _a === void 0 ? void 0 : _a.exceptions)) {
    return undefined;
  }

  var stackTraces = [];
  segment.cause.exceptions.forEach(function (exception) {
    var _a;

    var stackTrace = exception.type + ": " + exception.message;
    (_a = exception.stack) === null || _a === void 0 ? void 0 : _a.forEach(function (stack) {
      stackTrace = stackTrace.concat("\nat " + stack.label + " (" + stack.path + ":" + stack.line + ")");
    });
    stackTraces.push(stackTrace);
  });
  return stackTraces;
}

function getTagsForSpan(segment) {
  var tags = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(segmentToTag({
    aws: segment.aws
  }), segmentToTag({
    http: segment.http
  }), segmentToTag({
    annotations: segment.annotations
  }), segmentToTag({
    metadata: segment.metadata
  }), [{
    key: 'in progress',
    value: Boolean(segment.in_progress),
    type: 'boolean'
  }]);

  if (segment.origin) {
    tags.push({
      key: 'origin',
      value: segment.origin,
      type: 'string'
    });
  }

  var isError = segment.error || segment.fault || segment.throttle;

  if (isError) {
    tags.push({
      key: 'error',
      value: true,
      type: 'boolean'
    });
  }

  return tags;
}

function segmentToTag(segment) {
  var result = [];

  if (!segment) {
    return result;
  }

  var flattenedObject = Object(_flatten__WEBPACK_IMPORTED_MODULE_2__["flatten"])(segment);
  Object.keys(flattenedObject).map(function (key) {
    var tag = valueToTag(key, flattenedObject[key], _typeof(flattenedObject[key]));

    if (tag) {
      result.push(tag);
    }
  });
  return result;
}

function getTagsFromAws(aws) {
  var tags = [];

  if (!aws) {
    return tags;
  }
  /**
   * see https://docs.aws.amazon.com/xray/latest/devguide/xray-api-segmentdocuments.html#api-segmentdocuments-aws
   * for possible values on aws property
   */


  var awsKeys = ['ec2', 'ecs', 'elastic_beanstalk', 'region'];
  awsKeys.forEach(function (key) {
    if (aws[key]) {
      if (Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isPlainObject"])(aws[key])) {
        tags.push.apply(tags, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(segmentToTag(aws[key])));
      } else {
        tags.push({
          key: key,
          value: aws[key],
          type: 'string'
        });
      }
    }
  });
  return tags;
}

function gatherProcesses(segments) {
  var processes = segments.map(function (segment) {
    var _a, _b;

    var tags = [{
      key: 'name',
      value: segment.Document.name,
      type: 'string'
    }];
    tags.push.apply(tags, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])(getTagsFromAws(segment.Document.aws)));

    if ((_b = (_a = segment.Document.http) === null || _a === void 0 ? void 0 : _a.request) === null || _b === void 0 ? void 0 : _b.url) {
      var url = new URL(segment.Document.http.request.url);
      tags.push({
        key: 'hostname',
        value: url.hostname,
        type: 'string'
      });
    }

    return {
      serviceName: segment.Document.name,
      tags: tags
    };
  });
  return Object(lodash__WEBPACK_IMPORTED_MODULE_1__["keyBy"])(processes, 'serviceName');
}

function valueToTag(key, value, type) {
  if (!value || Array.isArray(value) && !value.length) {
    return undefined;
  }

  return {
    key: key,
    type: type,
    value: value
  };
}

/***/ }),

/***/ "@grafana/data":
/*!********************************!*\
  !*** external "@grafana/data" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__grafana_data__;

/***/ }),

/***/ "@grafana/runtime":
/*!***********************************!*\
  !*** external "@grafana/runtime" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__grafana_runtime__;

/***/ }),

/***/ "@grafana/ui":
/*!******************************!*\
  !*** external "@grafana/ui" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__grafana_ui__;

/***/ }),

/***/ "emotion":
/*!**************************!*\
  !*** external "emotion" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_emotion__;

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_lodash__;

/***/ }),

/***/ "prismjs":
/*!**************************!*\
  !*** external "prismjs" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_prismjs__;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_react__;

/***/ })

/******/ })});;
//# sourceMappingURL=module.js.map