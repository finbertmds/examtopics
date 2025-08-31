class Debouncer {
  constructor(delay = 1000) {
    this.delay = delay;
    this.timeouts = new Map();
  }

  debounce(key, callback) {
    // Clear existing timeout for this key
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
    }

    // Set new timeout
    const timeoutId = setTimeout(() => {
      callback();
      this.timeouts.delete(key);
    }, this.delay);

    this.timeouts.set(key, timeoutId);
  }

  cancel(key) {
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
      this.timeouts.delete(key);
    }
  }

  cancelAll() {
    this.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.timeouts.clear();
  }
}

module.exports = Debouncer;
