"use strict";

const { BrowserWindow, ipcMain } = require("electron");
const { view, icon, preload } = require("../core/load");

class NoteWindow {
	/**
	 * @param {string} uid
	 * @param {number} opts.x
	 * @param {number} opts.y
	 * @param {string} body
	 */
	constructor(uid, opts = { x, y }, body = "") {
		this._window = new BrowserWindow({
			width: 300,
			height: 350,
			minWidth: 300,
			minHeight: 350,
			x: opts.x - 320,
			y: opts.y + 50,
			alwaysOnTop: opts.isPinned,
			fullscreenable: false,
			transparent: false,
			show: false,
			icon: icon(),
			webPreferences: {
				preload: preload,
				spellcheck: true,
				webSecurity: true,
				contextIsolation: true,
				worldSafeExecuteJavaScript: true,
				nodeIntegration: false,
				nodeIntegrationInWorker: false,
				nodeIntegrationInSubFrames: false,
				enableRemoteModule: false,
				allowRunningInsecureContent: false,
				plugins: false,
				experimentalFeatures: false,
			},
		});

		this._window.loadFile(view("note"));

		this._window.setMenu(null);

		this._window.once("ready-to-show", () => {
			this._window.show();
			this._window.focus();
			this._window.webContents.send("window:ready", {
				uid,
				body,
			});
		});

		this._window.once("close", (e) => {
			e.preventDefault();
			this._window.webContents.send("window:closing");
		});
	}

	togglePin() {
		const isPinned = !this._window.isAlwaysOnTop();
		this._window.setAlwaysOnTop(isPinned);
		this._window.webContents.send("render:window-update-btnPin", {
			isPinned,
		});
	}
}

module.exports = { NoteWindow };
