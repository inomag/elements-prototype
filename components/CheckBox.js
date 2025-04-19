import { theme } from './../theme/index.js';

const { colors, fonts } = theme;

class FjCheckbox extends HTMLElement {
  static get observedAttributes() {
    return ['checked', 'disabled', 'size', 'indeterminate'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._checked = false;
    this._indeterminate = false;
    this.render();
  }

  get checked() {
    return this.hasAttribute('checked');
  }

  set checked(value) {
    if (value) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }

  get indeterminate() {
    return this.hasAttribute('indeterminate');
  }

  set indeterminate(value) {
    if (value) {
      this.setAttribute('indeterminate', '');
    } else {
      this.removeAttribute('indeterminate');
    }
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const checked = this.checked;
    const disabled = this.hasAttribute('disabled');
    const size = this.getAttribute('size') || 'medium';
    const indeterminate = this.indeterminate;

    this.shadowRoot.innerHTML = `
      <style>
        .wrapper {
          display: flex;
          align-items: center;
          margin-right: 8px;
          opacity: ${disabled ? '0.5' : '1'};
          cursor: ${disabled ? 'not-allowed' : 'pointer'};
          font-size: ${size === 'medium' ? fonts.m : size === 'small' ? fonts.s : fonts.xl};
        }
        input {
          margin: 4px;
          width: 16px;
          height: 16px;
        }
        input:checked {
          accent-color: ${colors.primary};
        }
        label {
          color: ${colors.text};
          cursor: pointer;
        }
      </style>
      <div class="wrapper">
        <input type="checkbox" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
        <label><slot></slot></label>
      </div>
    `;

    const input = this.shadowRoot.querySelector('input');
    input.indeterminate = indeterminate;

    input.onclick = e => e.stopPropagation();

    input.onchange = e => {
      this.checked = e.target.checked;
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { checked: e.target.checked },
          bubbles: true,
        })
      );
    };
  }
}

customElements.define('fj-checkbox', FjCheckbox);
