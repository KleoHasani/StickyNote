"use strict";

const { writeFile, readFile, access, chmod, rm } = require("fs/promises");

// File permisions.
const READ_ONLY = 0o444;
const READ_WRITE = 0o666;

// Handle data store.
class Storage {
	/**
	 * @param {string} path
	 */
	constructor(path, defaults = []) {
		if (!path) throw new Error("Path was not supplied");
		this._path = path;
		this._storage = defaults;
		this._isSaved = false;
	}

	/**
	 * Load JSON into in-memory store.
	 * @returns {Promise<void>}
	 */
	load() {
		return new Promise((accept, reject) => {
			access(this._path)
				.catch(() => {
					writeFile(this._path, JSON.stringify(this._storage), {
						encoding: "utf-8",
						flag: "w",
						mode: READ_ONLY,
					}).catch((err) => reject(err));
				})
				.finally(() => {
					readFile(this._path, {
						encoding: "utf-8",
						flag: "r",
					})
						.then((data) => {
							this._storage = JSON.parse(data);
							this._isSaved = true;
							accept();
						})
						.catch(() => reject());
				});
		});
	}

	/**
	 * Get length of store.
	 * @returns {number}
	 */
	get length() {
		return this._storage.length;
	}

	/**
	 * Get items
	 * @returns {IterableIterator}
	 */
	get items() {
		return this._storage.values();
	}

	/**
	 * Set item in memory store.
	 * @param {object} item
	 * @param {any} item.key
	 * @param {any} item.value
	 */
	setItem(item) {
		if (!item) throw new Error("No item provided");
		const found_item = this._storage.find((itm) => itm.key === item.key);
		if (found_item) found_item.value = item.value;
		else this._storage.push(item);
		this._isSaved = false;
	}

	/**
	 * Retrieve item by key from in-memory store
	 * return object or undefined if not found.
	 * @param {any} key
	 * @returns {object | undefined}
	 */
	getItem(key) {
		if (!key) throw new Error("No key provided");
		return this._storage.find((itm) => itm.key === key);
	}

	/**
	 * Remove item from in-memory store.
	 * @param {any} key
	 * @returns {void}
	 */
	removeItem(key) {
		if (!key) throw new Error("No key provided");
		this._storage = this._storage.filter((itm) => itm.key !== key);
		this._isSaved = false;
	}

	/**
	 * Clear in-memory store.
	 * @returns {void}
	 */
	clear() {
		this._storage = [];
		this._isSaved = false;
	}

	/**
	 * Save in-memory store to JSON file.
	 * @returns {Promise<void> | void}
	 */
	save() {
		if (!this._isSaved) {
			this._storage = this._storage.filter((items) => items.value.body !== "");
			return new Promise((accept, reject) => {
				chmod(this._path, READ_WRITE)
					.then(() => {
						writeFile(this._path, JSON.stringify(this._storage), {
							encoding: "utf-8",
							flag: "w",
						})
							.catch((err) => reject(err))
							.finally(() => {
								chmod(this._path, READ_ONLY)
									.then(() => {
										this._isSaved = true;
										accept();
									})
									.catch((err) => reject(err));
							});
					})
					.catch((err) => reject(err));
			});
		}
	}

	/**
	 * Delete JSON file.
	 * @returns {Promise<boolean>}
	 */
	delete() {
		return new Promise((accept, reject) => {
			rm(this._path)
				.then(() => {
					this._isSaved = false;
					accept(true);
				})
				.catch(() => reject(false));
		});
	}
}

module.exports = { Storage };
