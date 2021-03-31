"use strict";

const { BrowserWindow } = require("electron");
const { view, icon, script } = require("./load");

class Window {
  /**
   * @param {string} name
   * @param {number} opts.x
   * @param {number} opts.y
   * @param {boolean} opts.isPinned
   */
  constructor(name, opts = { x, y, isPinned }) {
    this._window = new BrowserWindow({
      width: 300,
      height: 350,
      minWidth: 300,
      minHeight: 350,
      x: opts.x - 320,
      y: opts.y + 50,
      alwaysOnTop: opts.isPinned,
      fullscreenable: false,
      transparent: false,
      frame: false,
      show: false,
      icon: icon(),
      webPreferences: {
        preload: script("preload"),
        spellcheck: true,
        webSecurity: true,
        contextIsolation: true,
        worldSafeExecuteJavaScript: true,
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        nodeIntegrationInSubFrames: false,
        enableRemoteModule: false,
        allowRunningInsecureContent: false,
        plugins: false,
        experimentalFeatures: false,
      },
    });

    this._window.loadFile(view(name));
    this._window.once("ready-to-show", () => {
      this._window.show();
      this._window.focus();
    });
  }

  close() {
    this._window.close();
  }
}

module.exports = { Window };
