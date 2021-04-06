"use strict";

let uid;

const btnNew = document.querySelector("#btn-new");
const btnPin = document.querySelector("#btn-pin");
const btnSettings = document.querySelector("#btn-settings");
const btnClose = document.querySelector("#btn-close");

// electron API listeners
window.electron.ipcOnce("window:ready", (e, data) => {
  uid = data.uid.toString();
  btnPin.className = data.isPinned ? "btn btn-pin-active" : "btn";
});

window.electron.ipcOn("render:titlebar-update-btnSettings", (e, data) => {
  btnSettings.style.display = data.isVisible ? "flex" : "none";
});

window.electron.ipcOn("render:window-update-btnPin", (e, data) => {
  console.log(data);
  btnPin.className = data.isPinned ? "btn btn-pin-active" : "btn";
});

// render listeners
btnNew.onclick = () => {
  window.electron.ipcSend("window:new");
};

btnPin.onclick = () => {
  window.electron.ipcSend("window:pin", { uid });
};

btnSettings.onclick = () => {
  window.electron.ipcSend("window:settings", { uid });
};

btnClose.onclick = () => {
  window.close();
};
