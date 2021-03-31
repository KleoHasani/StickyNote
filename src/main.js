"use strict";

const { app } = require("electron");
const { Application } = require("./Application");

if (app.requestSingleInstanceLock()) new Application(app);
else app.exit(0);
