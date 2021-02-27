"use strict";

const { Menu, ipcMain } = require("electron");

const appletMenu = Menu.buildFromTemplate([
  {
    label: "New",
    type: "normal",
    click: () => {
      ipcMain.emit("window:new");
    },
  },
  {
    type: "separator",
  },
  {
    label: "Clear All",
    type: "normal",
    click: () => {
      ipcMain.emit("window:clear");
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
