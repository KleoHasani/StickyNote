"use strict";

const { app, screen, ipcMain } = require("electron");

const { loadTray, loadIcon } = require("./core/load");
const { Applet } = require("./core/Applet");
const { Store } = require("./core/Store");
const { Alert } = require("./core/Alert");

const { Application } = require("./components/Application");
const { Note } = require("./components/Note");

const { appletMenu } = require("./menu");

if (app.requestSingleInstanceLock())
  (() => {
    // globals to prevent memory leaks
    let m_store = new Store();
    let m_applet = null;
    let m_app = null;
    let m_notes = [];

    // start
    app
      .whenReady()
      .then(() => {
        m_app = new Application();
        m_applet = new Applet(loadTray(), appletMenu);
        new Alert({
          title: "Sticky Notes",
          body: 'Sticky Notes started! Click "New" for a new note.',
          icon: loadIcon(),
        });
      })
      .catch((err) => {
        new Alert({
          title: "Crashed!",
          body: "Oops, looks like the app crashed!" + `\n${err}`,
        });
        app.exit(0);
      });

    // ready
    app.on("ready", () => {
      // get screen size
      globalThis.m_x = screen.getPrimaryDisplay().size.width;

      // render new sticky for each sticky note
      if (m_store.length > 0)
        m_store.values.forEach((note, i) => {
          m_notes.push(new Note({ uuid: i, note }));
        });

      // listeners
      ipcMain.on("window:new", () => {
        m_store.setNote(m_store.length, []);
        m_notes.push(new Note({ uuid: m_store.length - 1, note: [] }));
      });

      ipcMain.on("window:reopen", () => {
        m_notes.forEach((note) => note.close());
        m_store.values.forEach((note, i) => {
          m_notes.push(new Note({ uuid: i, note }));
        });
      });

      ipcMain.on("window:deleteall", () => {
        m_store.clear();
        m_notes.forEach((win) => {
          win.close();
        });
        m_notes = [];
      });

      ipcMain.on("window:close", (args) => {
        if (!m_store.isSave) m_store.save();
        m_notes = m_notes.filter((note) => note.uuid !== args.uuid);
      });

      ipcMain.on("item:add", (e, args) => {
        m_store.setItem(args.uuid, args.item);
      });

      ipcMain.on("item:delete", (e, args) => {
        m_store.removeItem(args.uuid, parseInt(args.id, 10));
        e.reply("item:deleted", args.id);
      });

      ipcMain.on("item:update", (e, args) => {
        m_store.setItem(args.uuid, args.item);
      });
    });

    // clean-up
    app.on("before-quit", () => {
      if (!m_store.isSave) m_store.save();
      ipcMain.removeAllListeners();
      m_notes = null;
      m_store = null;
      m_applet = null;
      m_app = null;
    });

    // activate
    app.on("activate", () => {
      ipcMain.emit("window:reopen");
    });

    // exit
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
  })();
else app.quit();
