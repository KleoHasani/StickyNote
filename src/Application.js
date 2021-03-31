"use strict";

class Application {
  /**
   * @param {App} app
   */
  constructor(app) {
    this.settings = null;
    this.store = null;

    app
      .whenReady()
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  }
}

module.exports = { Application };
