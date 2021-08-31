const { randomBytes } = require("crypto");

/**
 * Generate 16 random bytes as HEX.
 * @returns {string}
 */
function uid() {
	return randomBytes(16).toString("hex");
}

module.exports = { uid };
