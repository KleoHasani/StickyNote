"use strict";

const { Notification } = require("electron");

class Alert extends Notification {
  /**
   * @param {NotificationConstructorOptions} options
   */
  constructor(options) {
    super(options);
    this.show();
  }
}

module.exports = { Alert };
