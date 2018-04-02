"use strict";

exports.__esModule = true;
exports.DONE = exports.PAUSED = exports.RUNNING = exports.WAITING = exports.cachePublisher = undefined;

var _cache = require("./cache");

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WAITING = 0;
var RUNNING = 1;
var PAUSED = 2;
var DONE = 3;

var Publisher = function () {
  function Publisher() {
    _classCallCheck(this, Publisher);

    this.handlers = [];
  }

  Publisher.prototype.subscribe = function subscribe(handler) {
    this.handlers = [].concat(this.handlers, [handler]);
  };

  Publisher.prototype.unsubscribe = function unsubscribe(handler) {
    this.handlers = this.handlers.filter(function (h) {
      return h != handler;
    });
  };

  Publisher.prototype.notify = function notify(value) {
    this.handlers.forEach(function (h) {
      return h();
    });
  };

  return Publisher;
}();

var RecordPublisher = function (_Publisher) {
  _inherits(RecordPublisher, _Publisher);

  function RecordPublisher(record) {
    _classCallCheck(this, RecordPublisher);

    var _this = _possibleConstructorReturn(this, _Publisher.call(this));

    _this.key = record.key;
    _this.status = WAITING;
    _this.timer = null;
    _this.interval = null;
    return _this;
  }

  RecordPublisher.prototype.fulfill = function fulfill(resolve, delay, startPaused) {
    // The original promis is fulfilled
    this.resolve = resolve;
    this.originalDelay = delay * 1000;
    this.remaining = delay * 1000;
    startPaused ? this.pause() : this.start();
  };

  RecordPublisher.prototype.start = function start() {
    var _this2 = this;

    this.started = new Date();
    this.interval = setInterval(function () {
      return _this2.notify();
    }, 100);
    this.timer = setTimeout(function () {
      if (_this2.interval) {
        clearInterval(_this2.interval);
      }
      _this2.resolve();
    }, this.remaining);
    this.status = RUNNING;
    this.notify();
  };

  RecordPublisher.prototype.pause = function pause() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.started) {
      this.remaining -= new Date() - this.started;
    }
    this.status = PAUSED;
    this.notify();
  };

  RecordPublisher.prototype.done = function done() {
    this.status = DONE;
  };

  RecordPublisher.prototype.getCurrentValue = function getCurrentValue() {
    var status = this.status;
    switch (this.status) {
      case WAITING:
        return { status: status, completion: 0 };
      case RUNNING:
        return {
          status: status,
          completion: 100 - 100 * (this.remaining - (new Date() - this.started)) / this.originalDelay
        };
      case PAUSED:
        return {
          status: status,
          completion: 100 - 100 * this.remaining / this.originalDelay
        };
      case DONE:
        return {
          status: status,
          completion: 100
        };
    }
  };

  RecordPublisher.prototype.clear = function clear() {
    _cache2.default.clear(this.key, spy);
  };

  return RecordPublisher;
}(Publisher);

var CachePublisher = function (_Publisher2) {
  _inherits(CachePublisher, _Publisher2);

  function CachePublisher() {
    _classCallCheck(this, CachePublisher);

    var _this3 = _possibleConstructorReturn(this, _Publisher2.call(this));

    _this3.pendingRecords = [];
    _this3.settledRecords = [];
    _this3.startPaused = false;
    _this3.delay = 1;
    return _this3;
  }

  CachePublisher.prototype.getCurrentValue = function getCurrentValue() {
    return {
      pendingRecords: this.pendingRecords,
      settledRecords: this.settledRecords,
      delay: this.delay,
      startPause: this.startPaused
    };
  };

  CachePublisher.prototype.setDelay = function setDelay(d) {
    this.delay = d;
    this.notify();
  };

  CachePublisher.prototype.toggleStartPaused = function toggleStartPaused() {
    this.startPaused = !this.startPaused;
    this.notify();
  };

  CachePublisher.prototype.addPending = function addPending(rp) {
    this.pendingRecords = [rp].concat(this.pendingRecords);
    this.notify();
  };

  CachePublisher.prototype.fulfill = function fulfill(key, resolve) {
    var rs = this.pendingRecords.find(function (r) {
      return r.key === key;
    });
    rs.fulfill(resolve, this.delay, this.startPaused);
  };

  CachePublisher.prototype.moveResolved = function moveResolved(key) {
    var rs = this.pendingRecords.find(function (r) {
      return r.key === key;
    });
    rs.done();
    this.pendingRecords = this.pendingRecords.filter(function (r) {
      return r !== rs;
    });
    this.settledRecords = [rs].concat(this.settledRecords);
    // TODO wrap notify with setTimeout?
    this.notify();
  };

  CachePublisher.prototype.removeAllResolved = function removeAllResolved() {
    this.settledRecords = [];
    this.notify();
  };

  CachePublisher.prototype.removeResolved = function removeResolved(key) {
    this.settledRecords = this.settledRecords.filter(function (r) {
      return r.key !== key;
    });
    this.notify();
  };

  CachePublisher.prototype.clear = function clear(key) {
    var rs = this.settledRecords.find(function (r) {
      return r.key === key;
    });
    rs.clear();
  };

  CachePublisher.prototype.clearAll = function clearAll(key) {
    _cache2.default.clearAll(spy);
  };

  CachePublisher.prototype.load = function load(x) {
    return _cache2.default.load(x, spy);
  };

  return CachePublisher;
}(Publisher);

var cachePublisher = new CachePublisher();

// TODO why not make the cachePublisher the spy?
var spy = {
  didStart: function didStart(record) {
    cachePublisher.addPending(new RecordPublisher(record));
  },
  willResolve: function willResolve(record) {
    return function (value) {
      return new Promise(function (resolve) {
        cachePublisher.fulfill(record.key, function () {
          return resolve(value);
        });
      });
    };
  },
  didResolve: function didResolve(record) {
    return function (value) {
      cachePublisher.moveResolved(record.key);
      return value;
    };
  },
  didClear: function didClear(record) {
    return cachePublisher.removeResolved(record.key);
  },
  didClearAll: function didClearAll(record) {
    return cachePublisher.removeAllResolved();
  }
};

exports.cachePublisher = cachePublisher;
exports.WAITING = WAITING;
exports.RUNNING = RUNNING;
exports.PAUSED = PAUSED;
exports.DONE = DONE;