const { randomBytes } = require("crypto");

function uid() {
  return randomBytes(16).toString("hex");
}

module.exports = { uid };
