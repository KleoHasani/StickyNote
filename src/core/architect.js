"use strict";

const { BrowserWindow, Notification, Tray, app } = require("electron");
const { loadView } = require("./load");

module.exports = {
  /**
   * @param {string} name
   * @param {BrowserWindowConstructorOptions} options
   * @returns {BrowserWindow}
   */
  createWindow: (name, options) => {
    const m_window = new BrowserWindow(options);
    m_window.loadFile(loadView(name));
    return m_window;
  },

  /**
   * @param {NotificationConstructorOptions} options
   * @returns {Notification}
   */
  createAlert: (options) => {
    return new Notification(options);
  },

  /**
   * @param {string | NativeImage}
   * @param {Menu}
   * @returns {Tray}
   */
  createApplet: (icon, context) => {
    const m_tray = new Tray(icon);
    m_tray.setContextMenu(context);
    m_tray.setToolTip(`${app.getName() - app.getVersion()}`);
    return m_tray;
  },
};
