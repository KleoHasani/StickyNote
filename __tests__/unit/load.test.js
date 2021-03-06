"use strict";

const {
  loadIcon,
  loadScript,
  loadTray,
  loadView,
} = require("../../src/core/load");

describe("Load View", () => {
  test("Return the path to index html view", () => {
    const view = loadView("index");
    const regex = /^([a-zA-Z]:)?((\\)+|(\/)+)(\w+((\\)+|(\/)+))+index.html$/g;
    expect(typeof view).toBe("string");
    expect(new RegExp(regex).test(view)).toBe(true);
    expect(view).toMatch("index.html");
  });

  test("Return the path to note html view", () => {
    const view = loadView("note");
    const regex = /^([a-zA-Z]:)?((\\)+|(\/)+)(\w+((\\)+|(\/)+))+note.html$/g;
    expect(typeof view).toBe("string");
    expect(new RegExp(regex).test(view)).toBe(true);
    expect(view).toMatch("note.html");
  });
});

describe("Load Icon and Load Tray", () => {
  test("Should return path to icon.png | (**).(png|ico|icns)", () => {
    const icon = loadIcon();
    const regex = /^([a-zA-Z]:)?((\\)+|(\/)+)(\w+((\\)+|(\/)+))+\w+.(png|ico|icns)$/g;
    expect(typeof icon).toBe("string");
    expect(new RegExp(regex).test(icon)).toBe(true);
  });

  test("Should return path to tray tray-light.png | tray-dark.png", () => {
    const tray = loadTray();
    const regex = /^([a-zA-Z]:)?((\\)+|(\/)+)(\w+((\\)+|(\/)+))+(tray-light|tray-dark).png$/g;
    expect(typeof tray).toBe("string");
    expect(new RegExp(regex).test(tray)).toBe(true);
  });
});

describe("Load Script", () => {
  test("Should return path to preload.js script", () => {
    const script = loadScript();
    const regex = /^([a-zA-Z]:)?((\\)+|(\/)+)(\w+((\\)+|(\/)+))+preload.js$/g;
    expect(typeof script).toBe("string");
    expect(new RegExp(regex).test(script)).toBe(true);
  });
});
