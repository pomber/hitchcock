const cache = new Map();
const EMPTY = 0;
const PENDING = 1;
const RESOLVED = 4;

function getRecord(key) {
  let record = cache.get(key);
  if (record === undefined) {
    record = {
      key,
      status: EMPTY
    };
    cache.set(key, record);
  }
  return record;
}

const noopSpy = {
  willResolve: record => value => value,
  didResolve: record => value => value,
  didStart: record => null,
  didClear: record => null,
  didClearAll: record => null
};

function load({ key, getValue }, spy = noopSpy) {
  const record = getRecord(key);
  if (record.status === RESOLVED) {
    console.log(key + " already resolved");
    return record.value;
  } else if (record.status === EMPTY) {
    console.log(key + " is new");
    record.status = PENDING;
    record.suspender = getValue()
      .then(value => new Promise(resolve => resolve(value)))
      .then(spy.willResolve(record))
      .then(value => {
        console.log(key + " is ready");
        record.status = RESOLVED;
        record.suspender = null;
        record.value = value;
        return value;
      })
      .then(spy.didResolve(record));
    spy.didStart(record);
  }
  console.log(key + " is pending");
  throw record.suspender;
}

function clear(key, spy = noopSpy) {
  let record = cache.get(key);
  if (record !== undefined) {
    cache.delete(key);
    spy.didClear(record);
  }
}

function clearAll(spy = noopSpy) {
  cache.clear();
  spy.didClearAll();
}

export default {
  load,
  clear,
  clearAll
};
