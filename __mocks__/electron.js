const { resolve } = require("path");
module.exports.app = {
  getAppPath: jest.fn(() => ""),
  getPath: jest.fn(() => resolve(__dirname, "..")),
};
