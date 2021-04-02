"use strict";

function addNew() {
  console.log("new");
}

function togglePin() {
  console.log("pin");
}

function openSettings() {
  console.log("settings");
}

function closeWindow() {
  window.close();
}

window.onload = () => {
  const btnNew = document.querySelector("#btn-new");
  const btnPin = document.querySelector("#btn-pin");
  const btnSettings = document.querySelector("#btn-settings");
  const btnClose = document.querySelector("#btn-close");

  btnNew.onclick = addNew;
  btnPin.onclick = togglePin;
  btnSettings.onclick = openSettings;
  btnClose.onclick = closeWindow;
};
