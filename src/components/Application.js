"use strict";

const { BWindow } = require("../core/BWindow");

const m_opts = {
  width: 0,
  height: 0,
  frame: false,
  show: false,
  movable: false,
  transparent: true,
  skipTaskbar: true,
  show: false,
  webPreferences: {
    webSecurity: true,
    contextIsolation: true,
    worldSafeExecuteJavaScript: true,
    nodeIntegration: false,
    nodeIntegrationInWorker: false,
    enableRemoteModule: false,
    allowRunningInsecureContent: false,
    plugins: false,
    experimentalFeatures: false,
  },
};

class Application extends BWindow {
  constructor() {
    super("index", m_opts);
  }
}

module.exports = { Application };
