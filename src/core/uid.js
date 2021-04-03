const { randomBytes } = require("crypto");

function uid() {
  return "xxxx-xx-xx-xx-xxxxxx".replaceAll("x", () =>
    randomBytes(1).toString("hex"),
  );
}

module.exports = { uid };
