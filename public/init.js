"use strict";

import { Titlebar } from "./components/Titlebar.js";
customElements.define("app-titlebar", Titlebar);

const app = document.querySelector("#app");

// Get date from main process
window.electron.ipcOnce("window:ready", (e, data) => {
  console.log(data.uid);
  app.appendChild(new Titlebar(data.uid.toString()));
});
