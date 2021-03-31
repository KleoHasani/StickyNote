"use strict";
const { app, nativeImage } = require("electron");
const { resolve } = require("path");

const _base = app.getAppPath();

/**
 * @param {string} name
 * @returns {string}
 */
const view = (name) => {
  return resolve(_base, "public", `${name}.html`);
};

/**
 * @returns {NativeImage}
 */
const icon = () => {
  let _ext = "png";

  switch (process.platform) {
    case "darwin":
      _ext = "icns";
    case "win32":
      _ext = "ico";
    default:
      break;
  }

  return resolve(_base, "public", "icons", `icon.${_ext}`);
};

/**
 * Resolve file path for asset. Supported asset extensions ["png", "jpg", "jpeg"]
 * @param {string} name
 * @param {string} ext
 * @returns {string}
 */
const asset = (name, ext) => {
  if (!name || name === "") throw new Error("Asset file name can not be empty");

  const ALLOWED_ASSET_EXT = ["png", "jpg", "jpeg"];
  if (!ALLOWED_ASSET_EXT.includes(ext))
    throw new Error("Unsupported asset type");

  return resolve(_base, "assets", `${name}.${ext}`);
};

const script = (name) => {
  if (!name || name === "")
    throw new Error("Script file name can not be empty");

  return resolve(_base, "scripts", `${name}.js`);
};

module.exports = { view, icon, asset, script };
