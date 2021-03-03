"use strict";

const { ipcMain } = require("electron");
const { createWindow } = require("../core/architect");
const { loadIcon, loadScript } = require("../core/load");

const m_opts = {
  width: 300,
  height: 300,
  minWidth: 300,
  minHeight: 300,
  fullscreenable: false,
  transparent: false,
  frame: false,
  show: false,
  alwaysOnTop: true,
  icon: loadIcon(),
  webPreferences: {
    preload: loadScript(),
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

class Note {
  /**
   * @param {object} data
   */
  constructor(data) {
    this.m_x = globalThis.m_x - 320;
    this.m_y = 50;
    this.uuid = data.uuid; // unique note id
    this.window = createWindow("note", m_opts);
    //    this.window.setMenu(null);
    // ready
    this.window.on("ready-to-show", () => {
      this.window.setBounds({ x: this.m_x, y: this.m_y });

      if (data.note) this.window.webContents.send("window:open", data);
      else this.window.webContents.send("window:new", data);

      this.window.show();
      this.window.focus();
    });

    // toggle always on top
    ipcMain.on("window:toptoggle", () => {
      this.window.setAlwaysOnTop(!this.window.isAlwaysOnTop());
    });

    // close
    this.window.on("close", () => {
      ipcMain.emit("window:close", { uuid: this.uuid });
    });
  }

  close() {
    this.window.close();
  }
}

module.exports = { Note };
