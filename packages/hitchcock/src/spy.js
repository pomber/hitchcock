import cache from "./cache";

const WAITING = 0;
const RUNNING = 1;
const PAUSED = 2;
const DONE = 3;

class Publisher {
  handlers = [];
  subscribe(handler) {
    this.handlers = [...this.handlers, handler];
  }
  unsubscribe(handler) {
    this.handlers = this.handlers.filter(h => h != handler);
  }
  notify(value) {
    this.handlers.forEach(h => h());
  }
}

class RecordPublisher extends Publisher {
  constructor(record) {
    super();
    this.key = record.key;
    this.status = WAITING;
    this.timer = null;
    this.interval = null;
  }
  fulfill(resolve, delay, startPaused) {
    // The original promis is fulfilled
    this.resolve = resolve;
    this.originalDelay = delay * 1000;
    this.remaining = delay * 1000;
    startPaused ? this.pause() : this.start();
  }
  start() {
    this.started = new Date();
    this.interval = setInterval(() => this.notify(), 100);
    this.timer = setTimeout(() => {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.resolve();
    }, this.remaining);
    this.status = RUNNING;
    this.notify();
  }
  pause() {
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
  }
  done() {
    this.status = DONE;
  }
  getCurrentValue() {
    const status = this.status;
    switch (this.status) {
      case WAITING:
        return { status, completion: 0 };
      case RUNNING:
        return {
          status,
          completion:
            100 -
            (100 * (this.remaining - (new Date() - this.started))) /
              this.originalDelay
        };
      case PAUSED:
        return {
          status,
          completion: 100 - (100 * this.remaining) / this.originalDelay
        };
      case DONE:
        return {
          status,
          completion: 100
        };
    }
  }
  clear() {
    cache.clear(this.key, spy);
  }
}

class CachePublisher extends Publisher {
  constructor() {
    super();
    this.pendingRecords = [];
    this.settledRecords = [];
    this.startPaused = false;
    this.delay = 1;
  }
  getCurrentValue() {
    return {
      pendingRecords: this.pendingRecords,
      settledRecords: this.settledRecords,
      delay: this.delay,
      startPause: this.startPaused
    };
  }
  setDelay(d) {
    this.delay = d;
    this.notify();
  }
  toggleStartPaused() {
    this.startPaused = !this.startPaused;
    this.notify();
  }
  addPending(rp) {
    this.pendingRecords = [rp, ...this.pendingRecords];
    this.notify();
  }
  fulfill(key, resolve) {
    const rs = this.pendingRecords.find(r => r.key === key);
    rs.fulfill(resolve, this.delay, this.startPaused);
  }
  moveResolved(key) {
    const rs = this.pendingRecords.find(r => r.key === key);
    rs.done();
    this.pendingRecords = this.pendingRecords.filter(r => r !== rs);
    this.settledRecords = [rs, ...this.settledRecords];
    // TODO wrap notify with setTimeout?
    this.notify();
  }
  removeAllResolved() {
    this.settledRecords = [];
    this.notify();
  }
  removeResolved(key) {
    this.settledRecords = this.settledRecords.filter(r => r.key !== key);
    this.notify();
  }
  clear(key) {
    const rs = this.settledRecords.find(r => r.key === key);
    rs.clear();
  }
  clearAll(key) {
    cache.clearAll(spy);
  }
  load(x) {
    return cache.load(x, spy);
  }
  preload(x) {
    return cache.preload(x, spy);
  }
}

const cachePublisher = new CachePublisher();

// TODO why not make the cachePublisher the spy?
const spy = {
  didStart: record => {
    cachePublisher.addPending(new RecordPublisher(record));
  },
  willResolve: record => value =>
    new Promise(resolve => {
      cachePublisher.fulfill(record.key, () => resolve(value));
    }),
  didResolve: record => value => {
    cachePublisher.moveResolved(record.key);
    return value;
  },
  didClear: record => cachePublisher.removeResolved(record.key),
  didClearAll: record => cachePublisher.removeAllResolved()
};

export { cachePublisher, WAITING, RUNNING, PAUSED, DONE };
