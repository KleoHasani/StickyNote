"use strict";

const { contextBridge, ipcRenderer } = require("electron");

const ALLOWED_CHANNELS = [
  "window:new",
  "window:ready",
  "window:pin",
  "window:settings",
];

contextBridge.exposeInMainWorld("electron", {
  /**
   * @param {string} channel
   * @param {any} data
   * @returns {void}
   */
  ipcSend: (channel, data) => {
    if (ALLOWED_CHANNELS.includes(channel))
      return ipcRenderer.send(channel, data);
    else throw new Error(`Channel "${channel}" is not allowed`);
  },

  /**
   * @param {string} channel
   * @param {function} listener
   * @param {IpcRendererEvent} listener.event
   * @param {any[]} listener.args
   * @returns {void}
   */
  ipcOn: (channel, listener) => {
    if (ALLOWED_CHANNELS.includes(channel))
      return ipcRenderer.on(channel, listener);
    else throw new Error(`Channel "${channel}" is not allowed`);
  },

  /**
   * @param {string} channel
   * @param {function} listener
   * @param {IpcRendererEvent} listener.event
   * @param {any[]} listener.args
   * @returns {void}
   */
  ipcOnce: (channel, listener) => {
    if (ALLOWED_CHANNELS.includes(channel))
      return ipcRenderer.once(channel, listener);
    else throw new Error(`Channel "${channel}" is not allowed`);
  },

  /**
   * @returns {IpcRenderer}
   */
  ipcRemoveAllListeners: () => {
    return ipcRenderer.removeAllListeners();
  },
});
