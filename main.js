"use strict";

const { app, screen, ipcMain } = require("electron");
const { createAlert, createApplet } = require("./src/core/architect");
const { loadTray } = require("./src/core/load");
const { Store } = require("./src/core/Store");

// load settings to global
require("./src/core/settings")(app);

const { Note } = require("./src/components/Note");

const { appletMenu } = require("./src/menu");
const { log } = require("./src/core/log");

if (app.requestSingleInstanceLock()) {
  // init
  app
    .whenReady()
    .then(() => {
      // create tray applet
      this.applet = createApplet(loadTray(), appletMenu);
    })
    .catch((err) => {
      createAlert({
        title: "Crashed",
        body: "Oops, looks like something went wrong!",
      }).show();
      log(`ERROR:${err}`);
      app.exit(0);
    });

  // ready
  app.on("ready", () => {
    this.store = new Store();
    this.notes = [];
    // get screen size
    globalThis.m_x = screen.getPrimaryDisplay().size.width;
    // // render new sticky for each sticky note
    if (this.store.length > 0)
      this.store.values.forEach((note, i) => {
        this.notes.push(new Note({ uuid: i, note }));
      });
    // new note window
    ipcMain.on("window:new", () => {
      this.store.setNote(this.store.length, []);
      this.notes.push(new Note({ uuid: this.store.length - 1, note: [] }));
    });
    // reopen all notes
    ipcMain.on("window:reopen", () => {
      this.notes.forEach((note) => note.close());
      this.store.values.forEach((note, i) => {
        this.notes.push(new Note({ uuid: i, note }));
      });
    });
    // delete all notes
    ipcMain.on("window:deleteall", () => {
      this.store.clear();
      this.notes.forEach((win) => {
        win.close();
      });
      this.notes = [];
    });
    // close note
    ipcMain.on("window:close", (args) => {
      if (!this.store.isSave) this.store.save();
      this.notes = this.notes.filter((note) => note.uuid !== args.uuid);
    });

    ipcMain.on("window:top", (args) => {
      this.notes.forEach((note) => note.window.setAlwaysOnTop(args.checked));
    });
    // add item to note
    ipcMain.on("item:add", (e, args) => {
      this.store.setItem(args.uuid, args.item);
    });

    // delete item to note
    ipcMain.on("item:delete", (e, args) => {
      this.store.removeItem(args.uuid, parseInt(args.id, 10));
      e.reply("item:deleted", args.id);
    });

    // update item in note
    ipcMain.on("item:update", (e, args) => {
      this.store.setItem(args.uuid, args.item);
    });
  });

  // clean-up before quit
  app.on("before-quit", () => {
    if (!this.store.isSave) this.store.save();
    this.store = null;
    this.notes = null;
    ipcMain.removeAllListeners();
    this.m_app = null;
  });

  // prevent app from quit when all windows are closed
  app.on("window-all-closed", () => {});
} else app.quit();
