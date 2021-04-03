"use strict";

const { app, screen, ipcMain } = require("electron");
const { resolve } = require("path");
const { Storage } = require("./core/Storage");
const { uid } = require("./core/uid");
const { NoteWindow } = require("./views/NoteWindow");

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
      // Async operations
      .then(async () => {
        await this.settings.load();
        await this.store.load();
      })
      // Init and Listeners
      .then(() => {
        // Get primary screen width to determine position of Sticky Note
        const screen_width = screen.getPrimaryDisplay().size.width;

        if (this.store.length > 0)
          // Render all sticky notes from store
          for (let item of this.store.items)
            this.notes.push(
              new NoteWindow(uid(), {
                x: screen_width,
                y: 0,
                isPinned: item.value.isPinned,
              }),
            );
        else
          this.notes.push(
            new NoteWindow(uid(), {
              x: screen_width,
              y: 0,
              isPinned: this.settings.getItem("isPinned"),
            }),
          );

        // Listeners
        ipcMain.on("window:new", () => {
          this.notes.push(
            new NoteWindow(uid(), {
              x: screen_width,
              y: 0,
              isPinned: this.settings.getItem("isPinned"),
            }),
          );
        });

        ipcMain.on("window:pin", () => {});

        ipcMain.on("window:settings", () => {});
      })
      // errors
      .catch((err) => console.error(err));

    // Clean-up
    app.once("before-quit", async () => {
      await this.store.save();
    });

    // Quit when all windows are closed
    app.once("window-all-closed", () => app.quit());
  })();
else app.exit(0);
