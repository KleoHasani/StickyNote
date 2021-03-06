"use strict";

const { rmSync, accessSync, constants } = require("fs");
const { resolve } = require("path");
const { Store } = require("../../src/core/Store");

beforeAll(() => {
  this.store = new Store();
  this.mock_id = 0;
  this.mock_note = [{ id: 0, text: "Updated", isChecked: false }];
  this.mock_item = { id: 0, text: "New Item", isChecked: true };
});

afterAll(() => {
  // ensure file is readonly
  try {
    accessSync(this.store.m_base, constants.R_OK);
  } catch (err) {
    expect(err).toBeUndefined();
  }
  // clear data
  this.store = null;
  rmSync(resolve(__dirname, "../..", "data.json"));
});

describe("Store", () => {
  test("Should be initialize", async () => {
    expect(this.store).not.toBeNull();
    expect(this.store instanceof Store).toEqual(true);
    expect(this.store.length).toStrictEqual(0);
    try {
      accessSync(this.store.m_base, constants.R_OK);
    } catch (err) {
      expect(err).toBeUndefined();
    }
  });
});

describe("Set Note", () => {
  test("Should create new empty note", () => {
    this.store.setNote(this.mock_id, []);
    expect(this.store.length).toEqual(1);
  });

  test("Should update empty note with mock_note at id 0", () => {
    this.store.setNote(this.mock_id, this.mock_note);
    expect(this.store.length).toStrictEqual(1);
  });

  test("Should update isSave var on set note", () => {
    expect(this.store.isSave).toEqual(false);
  });
});

describe("Get Note", () => {
  test("Should get note at index 0", () => {
    expect(this.store.getNote(this.mock_id)).toEqual(this.mock_note);
  });

  test("Should fail to get note at invalid index", () => {
    expect(this.store.getNote(this.mock_id + 1)).toBeNull();
  });

  test("Should fail to get note at NaN index", () => {
    expect(this.store.getNote(NaN)).toBeNull();
  });

  describe("Remove Item", () => {
    test("Should fail to remove item at invalid note id", () => {
      this.store.removeItem(1, 0);
      expect(this.store.getNote(this.mock_id).length).toStrictEqual(1);
    });

    test("Should fail to remove item at note id = mock_id with invalid item id", () => {
      this.store.removeItem(this.mock_id, 1);
      expect(this.store.getNote(this.mock_id).length).toStrictEqual(1);
    });

    test("Should remove item at note id = mock_id with item id = 0", () => {
      this.store.removeItem(this.mock_id, 0);
      expect(this.store.getNote(this.mock_id).length).toStrictEqual(0);
    });

    test("Should update isSave var on remove item", () => {
      expect(this.store.isSave).toEqual(false);
    });
  });

  describe("Set Item", () => {
    test("Should set item to note id = mock_item item id = 0", () => {
      this.store.setItem(this.mock_id, this.mock_item);
      expect(this.store.getNote(this.mock_id).length).toStrictEqual(1);
    });

    test("Should replace item to note id = mock_item item id = 0", () => {
      this.store.setItem(this.mock_id, this.mock_item);
      expect(this.store.getNote(this.mock_id).length).toStrictEqual(1);
    });

    test("Should set item to note id = mock_item item id = 1", () => {
      this.mock_item.id = 1;
      this.store.setItem(this.mock_id, this.mock_item);
      expect(this.store.getNote(this.mock_id).length).toStrictEqual(2);
    });

    test("Should update isSave var on set item", () => {
      expect(this.store.isSave).toEqual(false);
    });
  });

  describe("Save", () => {
    test("Should save data", () => {
      // file should be readonly before change writeonly during save and change back to readonly if changes
      try {
        accessSync(this.store.m_base, constants.R_OK); // readonly before
        this.store.save();
        accessSync(this.store.m_base, constants.R_OK); // readonly after
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });

    test("Should change isSave to true", () => {
      expect(this.store.isSave).toEqual(true);
    });
  });

  describe("Clear Data", () => {
    test("Should remove all data", () => {
      this.store.clear();
      expect(this.store.length).toStrictEqual(0);
    });

    test("Should update isSave var on clear", () => {
      expect(this.store.isSave).toEqual(false);
    });
  });
});
