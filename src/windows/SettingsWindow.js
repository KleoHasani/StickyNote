"use strict";

const { BrowserWindow, ipcMain } = require("electron");
const { view, icon, script } = require("../core/load");

class SettingsWindow {
  /**
   * @param {BrowserWindow} parent
   * @param {boolean} isModal
   */
  constructor(parent, isModal) {
    this.uid = parent.uid;
    this.parent = parent._window;
    this._window = new BrowserWindow({
      width: 600,
      height: 400,
      minWidth: 600,
      minHeight: 400,
      maxWidth: 600,
      maxHeight: 400,
      fullscreenable: false,
      transparent: false,
      frame: false,
      show: false,
      icon: icon(),
      parent: this.parent,
      modal: isModal,
      webPreferences: {
        preload: script("preload"),
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

    this._window.loadFile(view("settings"));

    this._window.once("ready-to-show", () => {
      this._window.show();
      this._window.focus();
      this._window.webContents.send("window:ready", {
        settings: globalThis.settings,
      });
    });
  }
}

module.exports = { SettingsWindow };
