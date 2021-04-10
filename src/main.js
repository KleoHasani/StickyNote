"use strict";

const { app, screen, ipcMain } = require("electron");
const { resolve } = require("path");
const { Storage } = require("./core/Storage");
const { uid } = require("./core/uid");
const { NoteWindow } = require("./windows/NoteWindow");

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

        globalThis.settings = Array.from(this.settings.items);

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

        ipcMain.on("window:pin", (e, data) => {
          if (!data)
            throw new Error("Unable to pin window. Window ID was not provided");
          this.notes.find((note) => {
            if (note.uid === data.uid) note.togglePin();
          });
        });

        ipcMain.on("window:toggle-settings", (e, data) => {
          if (!data)
            throw new Error(
              "Unable to open settings. Window ID or window visibility status was not provided",
            );
          this.notes.forEach((note) => {
            if (note.uid && note.uid === data.uid)
              note.spawnSettingsChildWindow();
            note.toggleTitlebarSettingsButton(data.isVisible);
          });
        });

        ipcMain.on("window:close", (e, data) => {
          if (!data)
            throw new Error(
              "Unable to close window. Window ID was not provided",
            );
          this.notes = this.notes.filter((note) => note.uid !== data.uid);
          e.reply("window:closed");
        });
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
