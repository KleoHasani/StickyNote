"use strict";

const { Menu, ipcMain, dialog, BrowserWindow } = require("electron");

const appletMenu = Menu.buildFromTemplate([
  {
    label: "New",
    type: "normal",
    click: () => {
      ipcMain.emit("window:new");
    },
  },
  {
    label: "Always On Top",
    type: "checkbox",
    checked: globalThis.settings.isAlwaysOnTop,
    click: (e) => {
      ipcMain.emit("window:top", { checked: e.checked });
      globalThis.settings.isAlwaysOnTop = e.checked;
    },
  },
  {
    type: "separator",
  },
  {
    label: "Re-Open",
    type: "normal",
    click: () => {
      ipcMain.emit("window:reopen");
    },
  },
  {
    label: "Delete All",
    type: "normal",
    click: () => {
      dialog
        .showMessageBox(BrowserWindow.getAllWindows[0], {
          title: "Are you sure?",
          message: "This will delete all notes and clear notes data",
          buttons: ["Yes", "No"],
          type: "warning",
        })
        .then((value) => {
          if (value.response === 0) ipcMain.emit("window:deleteall");
        });
    },
  },
  {
    type: "separator",
  },
  {
    role: "quit",
  },
]);

module.exports = { appletMenu };
