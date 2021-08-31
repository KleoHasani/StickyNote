"use strict";

const { app, screen, ipcMain } = require("electron");
const { resolve } = require("path");
const { Storage } = require("./core/Storage");
const { uid } = require("./core/uid");
const { NoteWindow } = require("./windows/NoteWindow");

if (app.requestSingleInstanceLock())
	(() => {
		this.store = new Storage(resolve(app.getPath("userData"), "store.json"));
		this.notes = [];

		app.whenReady()
			// Async operations
			.then(async () => {
				await this.store.load();
			})
			// Init and Listeners
			.then(() => {
				// Get primary screen width to determine position of Sticky Note
				const screen_width = screen.getPrimaryDisplay().size.width;

				// Render notes
				if (this.store.length > 0)
					for (let item of this.store.items)
						this.notes.push(
							new NoteWindow(
								item.key,
								{
									x: screen_width,
									y: 0,
								},
								item.value
							)
						);
				else
					this.notes.push(
						new NoteWindow(uid(), {
							x: screen_width,
							y: 0,
						})
					);

				// Listeners
				// New window
				ipcMain.on("window:new", () => {
					this.notes.push(
						new NoteWindow(uid(), {
							x: screen_width,
							y: 0,
						})
					);
				});

				// Save on window looses focus
				ipcMain.on("window:save", async (e, data) => {
					const { key, value } = data;
					if (!data) throw new Error("Unable to close window. Window ID was not provided");

					if (value === "") this.store.removeItem(key);
					else
						this.store.setItem({
							key: key,
							value: value,
						});

					await this.store.save();
				});

				// Close window
				ipcMain.on("window:close", async (e, data) => {
					const { key, value } = data;
					if (!data) throw new Error("Unable to close window. Window ID was not provided");

					if (value === "" || value == "<br>") this.store.removeItem(key);
					else
						this.store.setItem({
							key: key,
							value: value,
						});

					await this.store.save();
					this.notes = this.notes.filter((note) => note._uid !== key);
					e.reply("window:closed");
				});
			})
			// errors
			.catch((err) => console.error(err));

		// Quit when all windows are closed
		app.once("window-all-closed", () => app.quit());
	})();
else app.exit(0);
