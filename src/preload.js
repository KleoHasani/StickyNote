"use strict";

const { contextBridge, ipcRenderer, BrowserWindow } = require("electron");

const allowed_channels = [
  "window:close",
  "window:open",
  "window:deleteall",
  "window:new",
  "window:reopen",
  "item:add",
  "item:delete",
  "item:deleted",
  "item:update",
];

contextBridge.exposeInMainWorld("api", {
  /**
   * @param {string} channel
   * @param {any} data
   */
  ipcSend: (channel, data) => {
    if (allowed_channels.includes(channel)) ipcRenderer.send(channel, data);
    else return;
  },

  /**
   * @param {string} channel
   * @param {function} listener
   */
  ipcOn: (channel, listener) => {
    if (allowed_channels.includes(channel)) ipcRenderer.on(channel, listener);
    else return;
  },

  icpRemoveAllListeners: () => {
    ipcRenderer.removeAllListeners();
  },
});
