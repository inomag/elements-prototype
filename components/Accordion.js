import {theme} from '../theme/index.js';
const {colors, fonts, borders} = theme;
class FJAccordion extends HTMLElement {
    static get observedAttributes() {
      return ['title', 'description', 'open', 'toggleIcon', 'border', 'status'];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.isOpen = false;
    }
  
    connectedCallback() {
      this.parseAttributes();
      this.render();
    }
  
    attributeChangedCallback() {
      this.parseAttributes();
      this.render();
    }
  
    parseAttributes() {
      this.title = this.getAttribute('title') || '';
      this.description = this.getAttribute('description') || '';
      this.isOpen = this.hasAttribute('open') && this.getAttribute('open') !== 'false';
      this.toggleIcon = this.getAttribute('toggleIcon') || '';
      this.border = !this.hasAttribute('border') || this.getAttribute('border') !== 'false';
  
      const statusAttr = this.getAttribute('status');
      try {
        this.status = statusAttr ? JSON.parse(statusAttr) : null;
      } catch {
        this.status = null;
      }
    }
  
    toggle() {
      if (!this.innerHTML.trim()) return;
      this.isOpen = !this.isOpen;
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>

          .collapsible {
            display: flex;
            flex-direction: column;
            transition: 0.3s;
            width: 100%;
          }
  
          .collapsible__border {
            border: 1px solid #aaa;
                  box-shadow: 4px 4px 0px #ccc;

          }
  
          .collapsible__toggle {
            cursor: pointer;
          }
  
          .collapsible__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 6px 12px;
          }
  
          .collapsible__header__prefixIcon {
            margin-right: 2%;
            display: flex;
          }
  
          .collapsible__header__text {
            display: flex;
            flex-direction: column;
            gap: 6px;
            width: 100%;
          }
  
          .collapsible__header__title {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            font-size: 14px;
            gap: 10px;
          }
  
          .collapsible__content {
            overflow: hidden;
            opacity: 0;
            height: 0;
            display: flex;
            flex-direction: column;
          }
  
          .collapsible__content__show {
            overflow: visible;
            opacity: 1;
            transition: ease-in-out, opacity 300ms;
            height: auto;
                        padding: 8px;

          }
  
          .collapsible__content__message {
            padding: 0 20px;
          }
        </style>
  
        <div class="collapsible ${this.border ? 'collapsible__border' : ''}">
          <div class="collapsible__header" aria-expanded="${this.isOpen}" onclick="this.getRootNode().host.toggle()">
  
            <div class="collapsible__header__text">
              <div class="collapsible__header__title">
                <fj-text semiBold>${this.title}</fj-text>
                ${this.status ? `<fj-chip type="${this.status.type}">${this.status.text}</fj-chip>` : ''}
              </div>
              ${this.description ? `<fj-text type="label">${this.description}</fj-text>` : ''}
            </div>
  
            ${this.innerHTML.trim() !== '' ? `
              <div class="collapsible__toggle">
                ${this.toggleIcon ? `<img src="${this.toggleIcon}" height="16" />`
                  : `<span>${this.isOpen ? '▲' : '▼'}</span>`}
              </div>` : ''
            }
          </div>
  
          <div class="collapsible__content ${this.isOpen ? 'collapsible__content__show' : ''}">
            <slot></slot>
          </div>
        </div>
      `;
    }
  }
  
  customElements.define('fj-accordion', FJAccordion);
  