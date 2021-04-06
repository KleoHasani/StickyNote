"use strict";

let init_settings = [];

const btnSave = document.querySelector("#btn-save");
const btnClose = document.querySelector("#btn-close");

// electron API listeners
window.electron.ipcOnce("window:ready", (e, data) => {
  init_settings = data.settings;
});

// render listeners
btnClose.onclick = () => {
  window.electron.ipcSend("window:toggle-settings", { isVisible: true });
  window.close();
};
