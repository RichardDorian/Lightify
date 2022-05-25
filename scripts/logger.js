class Logger {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }

  log(...args) {
    console.log(`%c[${this.name}]`, `color: ${this.color}`, ...args);
  }

  error(...args) {
    console.error(`%c[${this.name}]`, `color: ${this.color}`, ...args);
  }

  warn(...args) {
    console.warn(`%c[${this.name}]`, `color: ${this.color}`, ...args);
  }
}
