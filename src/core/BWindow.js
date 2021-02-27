"use strict";

const { BrowserWindow } = require("electron");
const { loadView } = require("./load");

class BWindow extends BrowserWindow {
  /**
   * @param {string} name
   * @param {BrowserWindowConstructorOptions} options
   */
  constructor(name, options) {
    super(options);
    this.loadFile(loadView(name));
  }
}

module.exports = { BWindow };
