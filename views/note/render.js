"use strict";

let uid;

const btnNew = document.querySelector("#btn-new");
const btnPin = document.querySelector("#btn-pin");
const btnSettings = document.querySelector("#btn-settings");
const btnClose = document.querySelector("#btn-close");

const txtArea = document.querySelector("#txt-area");

const btnItalic = document.querySelector("#btn-italic");
const btnBold = document.querySelector("#btn-bold");
const btnUnderline = document.querySelector("#btn-underline");
const btnStrike = document.querySelector("#btn-strike");
const btnList = document.querySelector("#btn-list");

// electron API listeners
window.electron.ipcOnce("window:ready", (e, data) => {
  if (!data)
    throw new Error("Unable to open window. Window data was not provided");
  uid = data.uid;
  btnPin.className = data.isPinned ? "btn btn-pin-active" : "btn";
});

window.electron.ipcOn("render:titlebar-update-btnSettings", (e, data) => {
  if (!data)
    throw new Error(
      "Unable to open window. Window visibility status was not provided",
    );
  btnSettings.style.display = data.isVisible ? "flex" : "none";
});

window.electron.ipcOn("render:window-update-btnPin", (e, data) => {
  if (!data)
    throw new Error(
      "Unable to open window. Window pinned status was not provided",
    );
  btnPin.className = data.isPinned ? "btn btn-pin-active" : "btn";
});

/**
 * @param {string} cmd
 * @param {string} value
 */
function format(cmd, value = null) {
  document.execCommand(cmd, false, value);
}

// render listeners
txtArea.onkeydown = (e) => {
  if (e.keyCode === 9) {
    e.preventDefault();
    format("insertHTML", "&emsp;");
  }
};

btnNew.onclick = () => {
  window.electron.ipcSend("window:new");
};

btnPin.onclick = () => {
  window.electron.ipcSend("window:pin", { uid });
};

btnSettings.onclick = () => {
  window.electron.ipcSend("window:toggle-settings", { isVisible: false, uid });
};

btnClose.onclick = () => {
  window.close();
};

btnItalic.onclick = () => {
  format("italic");
};

btnBold.onclick = () => {
  format("bold");
};

btnUnderline.onclick = () => {
  format("underline");
};

btnStrike.onclick = () => {
  format("strikethrough");
};

btnList.onclick = () => {
  format("insertorderedlist");
};
