"use strict";

const { app, screen } = require("electron");
const { resolve } = require("path");
const { Storage } = require("./core/Storage");
const { Window } = require("./core/Window");

if (app.requestSingleInstanceLock())
  (() => {
    this.settings = new Storage(
      resolve(app.getPath("userData"), "settings.json"),
      [
        {
          key: "isPinned",
          value: true,
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
      .then(() => {
        // Get primary screen width to determine position of Sticky Note
        const screen_width = screen.getPrimaryDisplay().size.width;

        // Render all sticky notes from store
        for (let item of this.store.items)
          this.notes.push(
            new Window("note", {
              x: screen_width,
              y: 0,
              isPinned: item.value.isPinned,
            }),
          );
      })
      .catch((err) => console.error(err));

    app.once("before-quit", async () => {
      await this.store.save();
    });

    app.once("window-all-closed", () => app.quit());
  })();
else app.exit(0);
