"use strict";
import { Titlebar } from "./components/Titlebar.js";
customElements.define("app-titlebar", Titlebar);

window.electron.ipcOn("window:ready", (e, data) => {
  localStorage.setItem("uid", data.uid.toString());
});
