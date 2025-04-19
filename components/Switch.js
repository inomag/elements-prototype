import {theme} from './../theme/index.js';

const {colors, fonts} = theme;

class FJSwitch extends HTMLElement {
    static get observedAttributes() {
      return ['value', 'size'];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.value = false;
      this.size = 'medium';
    }
  
    connectedCallback() {
      this.render();
      this.updateInnerPosition();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'value') {
        this.value = newValue === 'true';
        this.updateInnerPosition();
      }

      if(name === 'size'){
        this.size = newValue;
      }
    }
  
    updateInnerPosition() {
        const inner = this.shadowRoot.querySelector('.switch__inner');
        const container = this.shadowRoot.querySelector('.switch');
      
        if (inner) {
          const selfHeight = inner.offsetHeight;
          const left = this.value
            ? `calc(100% - ${selfHeight}px - 2px)`
            : '2px';
          inner.style.left = left;
        }
      
        if (container) {
          container.classList.remove('switch__on', 'switch__off');
          container.classList.add(this.value ? 'switch__on' : 'switch__off');
        }
      }
  
    render() {
        this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: inline-block;
            }
      
            .switch {
              position: relative;
              background-color: #ccc;
              transition: all 0.3s ease;
              margin-right: 3px;
            }

            .switch__off {
               background: #ccc;
            }
      
            .switch__on {
              background-color: ${colors.primary};
            }
      
            .switch__inner {
              position: absolute;
              top: 2px;
              border-radius: 50%;
              background-color: #fff;
              transition: all 0.3s ease;
              height: calc(100% - 4px);
              aspect-ratio: 1/1;
            }
      
            .switch__disabled {
              opacity: 0.5;
            }
      
            input[type='checkbox'] {
              position: absolute;
              width: 100%;
              height: 100%;
              margin: 0;
              opacity: 0;
              cursor: pointer;
            }
      
            input[type='checkbox'].checkbox__disabled {
              cursor: not-allowed;
            }
      
            .switch__medium {
              width: calc((${fonts.xl} * 2) + 4px);
              height: calc((${fonts.xl} + 2px));
              border-radius: calc((${fonts.xl} + 2px));
            }
      
            .switch__small {
              width: calc(${fonts.m} * 2);
              height: ${fonts.l};
              border-radius: ${fonts.l};
            }
          </style>
      
          <div class="switch switch__${this.size} ${this.value ? 'switch__on' : 'switch__off'}">
            <input type="checkbox" ${this.value ? 'checked' : ''} />
            <span class="switch__inner"></span>
          </div>
        `;
      
        this.shadowRoot.querySelector('input')
          .addEventListener('change', (e) => {
            this.value = e.target.checked;
            this.setAttribute('value', String(this.value));
            this.updateInnerPosition();
      
            this.dispatchEvent(new CustomEvent('change', {
              detail: { value: this.value },
              bubbles: true,
              composed: true
            }));
          });
      }
      
  }
  
  customElements.define('fj-switch', FJSwitch);
  