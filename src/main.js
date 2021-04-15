"use strict";

const { app, screen, ipcMain } = require("electron");
const { resolve } = require("path");
const { Storage } = require("./core/Storage");
const { uid } = require("./core/uid");
const { NoteWindow } = require("./windows/NoteWindow");

if (app.requestSingleInstanceLock())
  (() => {
    this.store = new Storage(resolve(app.getPath("userData"), "store.json"));
    this.notes = [];

    app
      .whenReady()
      // Async operations
      .then(async () => {
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
              new NoteWindow(
                item.key,
                {
                  x: screen_width,
                  y: 0,
                  isPinned: item.value.isPinned,
                },
                item.value.body,
              ),
            );
        else
          this.notes.push(
            new NoteWindow(uid(), {
              x: screen_width,
              y: 0,
              isPinned: true,
            }),
          );

        // Listeners
        ipcMain.on("window:new", () => {
          this.notes.push(
            new NoteWindow(uid(), {
              x: screen_width,
              y: 0,
              isPinned: true,
            }),
          );
        });

        ipcMain.on("window:pin", (e, data) => {
          const { uid } = data;
          if (!data)
            throw new Error("Unable to pin window. Window ID was not provided");
          this.notes.find((note) => {
            if (note.uid === uid) note.togglePin();
          });
        });

        ipcMain.on("window:close", async (e, data) => {
          const { uid, isPinned, body } = data;
          if (!data)
            throw new Error(
              "Unable to close window. Window ID was not provided",
            );
          if (body !== "")
            this.store.setItem({
              key: uid,
              value: {
                isPinned: isPinned,
                body: body,
              },
            });
          await this.store.save();
          this.notes = this.notes.filter((note) => note.uid !== uid);
          e.reply("window:closed");
        });
      })
      // errors
      .catch((err) => console.error(err));

    // Quit when all windows are closed
    app.once("window-all-closed", () => app.quit());
  })();
else app.exit(0);
