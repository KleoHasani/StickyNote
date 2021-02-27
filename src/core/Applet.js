"use strict";

const { Tray, app } = require("electron");

class Applet extends Tray {
  /**
   * @param {string | NativeImage} icon
   * @param {Menu | null} context
   */
  constructor(icon, context) {
    super(icon);
    this.setToolTip(`${app.getName()} - ${app.getVersion()}`);
    this.setContextMenu(context);
  }
}

module.exports = { Applet };
