"use strict";

const { app } = require("electron");
const { resolve } = require("path");
const { Storage } = require("./core/Storage");

if (app.requestSingleInstanceLock())
  (() => {
    this.settings = new Storage(
      resolve(app.getPath("userData"), "settings.json"),
      [
        {
          key: "isPinned",
          data: true,
        },
      ],
    );
    this.store = new Storage(resolve(app.getPath("userData"), "store.json"));
    this.notes = [];

    app
      .whenReady()
      .then(async () => {
        await this.settings.load();
        await this.store.load();
      })
      .then(() => {})
      .catch((err) => console.error(err));

    app.once("window-all-closed", () => app.quit());
  })();
else app.exit(0);
