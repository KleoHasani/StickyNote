"use strict";

let _uid;

const txtArea = document.querySelector("#txt-area");
const btnList = document.querySelector("#button-list");
const btnStrike = document.querySelector("#button-strike");

/**
 * Format selected element with passed command
 * @param {string} cmd
 * @param {string} value
 */
function format(cmd, value = null) {
	if (!cmd) throw new Error("No command passed");
	txtArea.focus();
	return document.execCommand(cmd, false, value);
}

/**
 * Format element to have active style
 * @param {boolean} isActive
 * @param {Node} element
 */
function toggleIsActive(isActive, element) {
	element.classList = isActive ? "active" : "";
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

// Insert Tab on tab button press
txtArea.onkeydown = (e) => {
	if (e.which === 9) {
		e.preventDefault();
		format("insertHTML", "&emsp;");
	}
};

// Toggle formated button active on key up
txtArea.onkeyup = (e) => {
	toggleIsActive(document.queryCommandState("strikethrough"), btnStrike);
};

// Toggle formated button active on select or cursor position set on mouse click
txtArea.onclick = () => {
	toggleIsActive(document.queryCommandState("strikethrough"), btnStrike);
};

// Insert List
btnList.onclick = () => {
	format("insertOrderedList");
};

// Strike text out
btnStrike.onclick = () => {
	format("strikethrough");
	document.getSelection().collapseToEnd();
	toggleIsActive(document.queryCommandState("strikethrough"), btnStrike);
};
