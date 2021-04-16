"use strict";

let _uid;

const btnNew = document.querySelector("#btn-new");
const btnPin = document.querySelector("#btn-pin");
const btnClose = document.querySelector("#btn-close");
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
	const { uid, isPinned, body } = data;
	if (!data) throw new Error("Unable to open window. Window data was not provided");
	_uid = uid;
	btnPin.className = isPinned ? "btn btn-pin-active" : "btn";
	txtArea.innerHTML = body;
});

window.electron.ipcOnce("window:closed", () => {
	window.electron.ipcRemoveAllListeners();
	window.close();
});

window.electron.ipcOn("render:window-update-btnPin", (e, data) => {
	const { isPinned } = data;
	if (!data) throw new Error("Unable to open window. Window pinned status was not provided");
	btnPin.className = isPinned ? "btn btn-pin-active" : "btn";
});

// render listeners
btnNew.onclick = () => {
	window.electron.ipcSend("window:new");
};

btnPin.onclick = () => {
	window.electron.ipcSend("window:pin", { uid: _uid });
};

btnClose.onclick = () => {
	window.electron.ipcSend("window:close", {
		uid: _uid,
		isPinned: btnPin.classList.contains("btn-pin-active"),
		body: txtArea.innerHTML,
	});
};

txtArea.onkeydown = (e) => {
	if (e.which === 9) {
		e.preventDefault();
		format("insertHTML", "&emsp;");
	}
};
