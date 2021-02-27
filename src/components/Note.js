"use strict";

const { ipcMain } = require("electron");
const { BWindow } = require("../core/BWindow");
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

class Note extends BWindow {
  /**
   * @param {object} data
   */
  constructor(data) {
    super("note", m_opts);

    this.m_x = globalThis.m_x - 320;
    this.m_y = 50;

    // unique note tracker
    this.uuid = data.uuid;

    //this.setMenu(null);

    this.addListener("ready-to-show", () => {
      this.setBounds({ x: this.m_x, y: this.m_y });

      if (data.note) this.webContents.send("window:open", data);
      else this.webContents.send("window:new", data);

      this.show();
      this.focus();

      this.on("close", () => {
        ipcMain.emit("window:close", { uuid: this.uuid });
      });
    });
  }
}

module.exports = { Note };
