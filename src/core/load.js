"use strict";

const { app, nativeTheme } = require("electron");
const { resolve } = require("path");

const m_base = resolve(app.getAppPath());

module.exports = {
  /**
   * @param {string} name
   * @returns {string}
   */
  loadView: (name) => {
    return resolve(m_base, "static", `${name}.html`);
  },

  /**
   * @returns {string}
   */
  loadIcon: () => {
    switch (process.platform) {
      case "win32":
        return resolve(m_base, "static", "icons", "win", "icon.ico");
      case "darwin":
        return resolve(m_base, "static", "icons", "mac", "icon.icns");
      default:
        return resolve(m_base, "static", "icons", "png", "icon.png");
    }
  },

  /**
   * @returns {string}
   */
  loadTray: () => {
    let m_trayIconName;

    if (process.platform === "linux") m_trayIconName = "tray-dark.png";
    else
      m_trayIconName = nativeTheme.shouldUseDarkColors
        ? "tray-dark.png"
        : "tray-light.png";

    return resolve(m_base, "static", "icons", "png", m_trayIconName);
  },

  /**
   * @returns {string}
   */
  loadScript: () => {
    return resolve(m_base, "src", "preload.js");
  },
};
