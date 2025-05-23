import {theme} from './../theme/index.js';
class Button extends HTMLElement {
    constructor() {
        super();
        const { colors, fonts } = theme;
        const shadow = this.attachShadow({ mode: 'open' });
      
        // attributes
        /**
         * 
         * type: 'primary' | 'secondary' | 'outlined' | 'text' | 'success' | 'error' | 'info' | 'warning'
         * label: string
         * size: 'medium' | 'small' | 'large'
         * rounded: boolean
         * disabled: boolean
         */
        const type = this.getAttribute('type') || 'primary';
        const label = this.textContent.trim() || 'Button';
        const size = this.getAttribute('size') || 'medium';
        const disabled = this.hasAttribute('disabled') || false;
        // separate variant will require nested styling
        // const variant = this.getAttribute('variant') || 'default';



        const style = document.createElement('style');
        style.textContent = `
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: ${fonts.m};
        font-weight: 500;
        line-height: 1.5;
        text-align: center;
        text-decoration: none;
        white-space: nowrap;
        cursor: pointer;
        border: none;
        padding: 8px 16px;
        transition: all 0.2s ease-in-out;
      }
      .primary {
        background-color: ${colors.primary};
        color: white;
                              box-shadow: 4px 4px 0px ${colors.secondary};
      }
      .secondary {
        background-color: ${colors.secondary};
        color: ${colors.primary};
                                      box-shadow: 4px 4px 0px ${colors.primary};

      }
      .outlined {
        border: 1px solid ${colors.primary};
        background: white;
        color: ${colors.primary};
                                              box-shadow: 4px 4px 0px ${colors.primary};

      }
      .text {
        background: none;
        color: ${colors.text};
        text-decoration: underline;
      }
        .success {
         background: ${colors.success};
         color: white;
                                               box-shadow: 4px 4px 0px #ccc;

        }
         .info {
          background: ${colors.info};
          color: white;
          box-shadow: 4px 4px 0px #ccc;
         }
          .warning {
          background: ${colors.warning};
          color: white;
          box-shadow: 4px 4px 0px #ccc;
          }
          .error {
          background: ${colors.error};
          color: white;
          box-shadow: 4px 4px 0px #ccc;
          }
          .small {
            font-size: ${fonts.s};
            padding: 3px 9px;
          }
            .large {
            font-size: ${fonts.l};
            padding: 5px 25px;
            }

            .disabled {
             opacity: 0.8;
             cursor: not-allowed;
             
            }
      .btn:hover {
        opacity: 0.8;
      }
    `;

    const btn = document.createElement('button');
        btn.textContent = label;
        btn.disabled = disabled;
    btn.className = `btn ${type} ${size} ${disabled ? 'disabled' : ''}`;

        btn.addEventListener('click', (e) => {
            if (!disabled) {
                e.stopPropagation();
                this.dispatchEvent(new Event('click'));
            }
});
        
    shadow.appendChild(style);
    shadow.appendChild(btn);
  }
}

customElements.define('fj-button', Button);