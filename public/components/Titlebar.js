"use strict";

const template = document.createElement("template");
template.innerHTML = `
<div class="titlebar">
  <div class="btn-group">
		<div id="btn-new" class="btn">&#65291;</div>
      <div id="btn-pin" class="btn">&#8226;</div>
    </div>
    <div class="btn-group">
      <div id="btn-settings" class="btn">&#8942;</div>
      <div id="btn-close" class="btn">&#x2715;</div>
    </div>
  </div>
</div>
`;

const style = document.createElement("style");
style.textContent = `
.titlebar {
  width: inherit;
  height: 2.5em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: var(--primary);
  color: var(--onPrimary);
  app-region: drag;
  -moz-app-region: drag;
  -webkit-app-region: drag;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

.btn-group {
  display: flex;
  flex-direction: row;
  margin: 0em 0.2em;
}

.btn {
  width: 2em;
  height: 2em;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  app-region: no-drag;
  -moz-app-region: no-drag;
  -webkit-app-region: no-drag;
}

.btn:hover {
  background: rgba(0, 0, 0, 0.3);
}

.btn:active {
  opacity: 0.8;
}

#btn-new:hover {
  color: var(--ok);
}

#btn-pin:hover {
  color: var(--warning);
}

#btn-close:hover {
  color: var(--danger);
}`;

class Titlebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.append(style, template.content.cloneNode(true));
    this.btnNew = this.shadowRoot.querySelector("#btn-new");
    this.btnPin = this.shadowRoot.querySelector("#btn-pin");
    this.btnSettings = this.shadowRoot.querySelector("#btn-settings");
    this.btnClose = this.shadowRoot.querySelector("#btn-close");

    this.btnNew.onclick = () => {
      window.electron.icpSend("window:new", { id: this._awid });
    };

    this.btnPin.onclick = () => {
      window.electron.icpSend("window:pin", { id: this._awid });
    };

    this.btnSettings.onclick = () => {};

    this.btnClose.onclick = () => {
      window.close();
    };
  }

  disconnectedCallback() {}

  adoptedCallback() {}
}

export { Titlebar };
