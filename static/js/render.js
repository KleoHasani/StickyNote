"use strict";

let m_uuid;

/**
 * @param {object} data
 * @returns {Node}
 */
const ListItem = (data) => {
  const _wrap = document.createElement("li");
  const _text = document.createElement("label");
  const _check = document.createElement("input");
  const _delete = document.createElement("button");
  _delete.innerHTML = "&#x2717;";

  _delete.addEventListener("click", (e) => {
    e.preventDefault();
    window.api.ipcSend("item:delete", { uuid: m_uuid, id: _wrap.name });
    _delete.removeEventListener("click", () => {});
    _check.removeEventListener("change", () => {});
  });

  _check.type = "checkbox";
  _check.id = data.id;
  _check.checked = data.isChecked;

  _check.addEventListener("change", (e) => {
    data.isChecked = e.target.checked;
    window.api.ipcSend("item:update", { uuid: m_uuid, item: data });
  });

  _text.textContent = data.text;
  _text.htmlFor = data.id;
  _wrap.name = data.id.toString();

  _wrap.appendChild(_check);
  _wrap.appendChild(_text);
  _wrap.appendChild(_delete);
  return _wrap;
};

window.addEventListener("load", () => {
  const ui_close = document.querySelector(".btn");
  const ui_list = document.querySelector("ul");
  const ui_form = document.querySelector("form");

  window.api.ipcOn("window:open", (e, args) => {
    m_uuid = args.uuid;
    args.note.forEach((data) => {
      ui_list.appendChild(ListItem(data));
    });
  });

  window.api.ipcOn("window:new", (e, args) => {
    m_uuid = args.uuid;
  });

  ui_close.addEventListener("click", (e) => {
    e.preventDefault();
    //window.api.icpRemoveAllListeners();
    window.removeEventListener("load", () => {});
    window.close();
  });

  ui_form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (e.target.input.value !== "") {
      console.log(ui_list.children.length);
      console.log(m_uuid);
      const m_item = {
        id: ui_list.children.length,
        text: e.target.input.value,
        isChecked: false,
      };
      window.api.ipcSend("item:add", { uuid: m_uuid, item: m_item });
      ui_list.appendChild(ListItem(m_item));
      e.target.input.value = "";
    }
  });

  window.api.ipcOn("item:deleted", (e, args) => {
    ui_list.childNodes.forEach((item) => {
      if (item.name === args.toString()) ui_list.removeChild(item);
    });
  });
});
