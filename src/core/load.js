"use strict";
const { app } = require("electron");
const { resolve } = require("path");

const _base = app.getAppPath();

/**
 * Resolve index view path
 * @param {string} name
 */
function view(name) {
  if (!name) throw new Error("No view name provided");
  return resolve(_base, "views", `${name}`, "view.html");
}

/**
 * @returns {string}
 */
function icon() {
  let _ext = "png";
  switch (process.platform) {
    case "darwin":
      _ext = "icns";
    case "win32":
      _ext = "ico";
    default:
      break;
  }
  return resolve(_base, "icons", `icon.${_ext}`);
}

/**
 * Resolve file path for asset.
 * Supported asset extensions ["png", "jpg", "jpeg"]
 * @param {string} name
 * @param {string} ext
 * @returns {string}
 */
const asset = (name, ext) => {
  if (!name) throw new Error("Asset file name not provided");
  const ALLOWED_ASSET_EXT = ["png", "jpg", "jpeg"];
  if (!ALLOWED_ASSET_EXT.includes(ext))
    throw new Error("Unsupported asset type");
  return resolve(_base, "assets", `${name}.${ext}`);
};

const preload = resolve(_base, "src", "preload.js");

module.exports = { view, icon, asset, preload };
