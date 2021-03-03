"use strict";

const { resolve } = require("path");
const { existsSync, writeFileSync, readFileSync } = require("fs");

const DEFAULT_SETTINGS = {
  isAlwaysOnTop: true,
};

/**
 * @param {app} app
 * @returns {object}
 */
module.exports = (app) => {
  this.m_base = resolve(app.getPath("userData"), "settings.json");
  if (!existsSync(this.m_base)) {
    writeFileSync(this.m_base, JSON.stringify(DEFAULT_SETTINGS), {
      encoding: "utf-8",
      flag: "w",
    });
  }
  globalThis.settings = JSON.parse(
    readFileSync(this.m_base, { encoding: "utf-8", flag: "r" })
  );
};
