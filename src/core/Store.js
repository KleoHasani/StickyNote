"use strict";

const { app } = require("electron");
const { resolve } = require("path");
const { existsSync, readFileSync, writeFileSync, chmodSync } = require("fs");

const readonly = 0o444;
const writeonly = 0o222;

class Store {
  constructor() {
    this.m_base = resolve(app.getPath("userData"), "data.json");
    if (!existsSync(this.m_base)) {
      writeFileSync(this.m_base, "[]", {
        encoding: "utf-8",
        flag: "w",
      });
      chmodSync(this.m_base, readonly);
    }

    this.m_store = JSON.parse(
      readFileSync(this.m_base, { encoding: "utf-8", flag: "r" })
    );
    this.length = this.m_store.length;
    this.isSave = true;
  }

  /**
   * @param {number} id
   * @param {object} note
   */
  setNote(id, note) {
    if (this.m_store[id]) this.m_store[id] = note;
    else this.m_store.push(note);
    this.isSave = false;
  }

  /**
   * @param {number} id
   */
  getNote(id) {
    if (this.m_store[id]) return this.m_store[id];
    return null;
  }

  /**
   * @param {number} id
   * @param {object} item
   */
  setItem(id, item) {
    if (this.m_store[id]) this.m_store[id].push(item);
    this.isSave = false;
  }

  /**
   * @param {number} id
   * @param {number} iID
   */
  getItem(id, iID) {
    if (this.m_store[id][iID]) return this.m_store[id][iID];
    return null;
  }

  /**
   * @param {number} id
   * @param {number} iID
   */
  removeItem(id, iID) {
    if (this.m_store[id]) {
      this.m_store[id] = this.m_store[id].filter((item) => item.id !== iID);
      this.isSave = false;
    }
  }

  /**
   * @param {number} id
   * @param {object} item
   */
  updateItem(id, item) {
    if (this.m_store[id]) {
      this.m_store[id][item.id].isChecked = item.isChecked;
      this.isSave = false;
    }
  }

  save() {
    if (!existsSync(this.m_base)) {
      writeFileSync(this.m_base, "[]", {
        encoding: "utf-8",
        flag: "w",
      });
    } else {
      chmodSync(this.m_base, writeonly);
    }

    this.m_store = this.m_store.filter((note) => note.length > 0);
    writeFileSync(this.m_base, JSON.stringify(this.m_store), {
      encoding: "utf-8",
      flag: "w",
    });

    chmodSync(this.m_base, readonly);

    this.isSave = true;
  }

  clear() {
    this.m_store = [];
    this.length = 0;
    this.isSave = false;
  }

  get values() {
    return Object.values(this.m_store);
  }
}

module.exports = { Store };
