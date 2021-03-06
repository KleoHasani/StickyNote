"use strict";

const { Application } = require("spectron");
const { resolve, join } = require("path");

describe("Application Launch", () => {
  jest.setTimeout(40000);

  beforeAll(async () => {
    this.app = new Application({
      path: resolve("node_modules", ".bin", "electron"),
      args: [join(__dirname, "..")],
    });
    await this.app.start();
  });

  test("Should be running", () => {
    expect(this.app.isRunning).toBe(true);
  });
});
