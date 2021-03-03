"use strict";

const { app } = require("electron");
const { resolve } = require("path");
const { writeFileSync } = require("fs");

module.exports = {
  /**
   * @param {string} data
   */
  log: (data) => {
    const m_base = resolve(app.getPath("userData"), "logs.log");
    writeFileSync(m_base, data + "\n", {
      encoding: "utf-8",
      flag: "a",
    });
  },
};
