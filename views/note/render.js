"use strict";

let _uid;

const txtArea = document.querySelector("#txt-area");

/**
 * @param {string} cmd
 * @param {string} value
 */
function format(cmd, value = null) {
	if (!cmd) throw new Error("No command passed");
	txtArea.focus();
	return document.execCommand(cmd, false, value);
}

// electron API listeners
window.electron.ipcOnce("window:ready", (e, data) => {
	const { uid, body } = data;
	if (!data) throw new Error("Unable to open window. Window data was not provided");
	_uid = uid;
	txtArea.innerHTML = body;
});

window.electron.ipcOnce("window:closing", () => {
	window.electron.ipcSend("window:close", { key: _uid, value: txtArea.innerHTML });
});

window.electron.ipcOnce("window:closed", () => {
	window.electron.ipcRemoveAllListeners();
	window.close();
});

// render listeners
txtArea.onkeydown = (e) => {
	if (e.which === 9) {
		e.preventDefault();
		format("insertHTML", "&emsp;");
	}
};
