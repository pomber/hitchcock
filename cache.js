"use strict";

exports.__esModule = true;
var cache = new Map();
var EMPTY = 0;
var PENDING = 1;
var RESOLVED = 4;

function getRecord(key) {
  var record = cache.get(key);
  if (record === undefined) {
    record = {
      key: key,
      status: EMPTY
    };
    cache.set(key, record);
  }
  return record;
}

var noopSpy = {
  willResolve: function willResolve(record) {
    return function (value) {
      return value;
    };
  },
  didResolve: function didResolve(record) {
    return function (value) {
      return value;
    };
  },
  didStart: function didStart(record) {
    return null;
  },
  didClear: function didClear(record) {
    return null;
  },
  didClearAll: function didClearAll(record) {
    return null;
  }
};

function load(_ref) {
  var key = _ref.key,
      getValue = _ref.getValue;
  var spy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noopSpy;

  var record = getRecord(key);
  if (record.status === RESOLVED) {
    console.log(key + " already resolved");
    return record.value;
  } else if (record.status === EMPTY) {
    console.log(key + " is new");
    record.status = PENDING;
    record.suspender = getValue().then(function (value) {
      return new Promise(function (resolve) {
        return resolve(value);
      });
    }).then(spy.willResolve(record)).then(function (value) {
      console.log(key + " is ready");
      record.status = RESOLVED;
      record.suspender = null;
      record.value = value;
      return value;
    }).then(spy.didResolve(record));
    spy.didStart(record);
  }
  console.log(key + " is pending");
  throw record.suspender;
}

function clear(key) {
  var spy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noopSpy;

  var record = cache.get(key);
  if (record !== undefined) {
    cache.delete(key);
    spy.didClear(record);
  }
}

function clearAll() {
  var spy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noopSpy;

  cache.clear();
  spy.didClearAll();
}

exports.default = {
  load: load,
  clear: clear,
  clearAll: clearAll
};