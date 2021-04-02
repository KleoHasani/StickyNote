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
      // Async operations
      .then(async () => {
        await this.settings.load();
        await this.store.load();
      })
      // Init and render
      .then(() => {
        // Get primary screen width to determine position of Sticky Note
        const screen_width = screen.getPrimaryDisplay().size.width;

        // fake window for testing
        this.notes.push(
          new Window("note", {
            x: screen_width,
            y: 0,
            isPinned: false,
          }),
        );
        // end of fake window for testing

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
      // Listeners
      .then(() => {})
      // errors
      .catch((err) => console.error(err));

    // Clean-up
    app.once("before-quit", async () => {
      console.log("Got here");
      await this.store.save();
    });

    // Quit when all windows are closed
    app.once("window-all-closed", () => app.quit());
  })();
else app.exit(0);
