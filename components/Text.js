import {theme} from './../theme/index.js';
class Text extends HTMLElement {
    constructor() {
        super();
        const { colors, fonts } = theme;
        const shadow = this.attachShadow({ mode: 'open' });
      
        // attributes
        /**
         * bold: boolean
         * semiBold: boolean
         * italic: boolean
         * underline: boolean
         * type: 'default' | 'h1' | 'h2' | 'h3' | 'label'
         * variant: 'default' | 'success' | 'warning' | 'info' | 'error'
         */
        const variant = this.getAttribute('variant') || 'default';
        const type = this.getAttribute('type') || 'default';
        const italic = this.hasAttribute('italic') || false;
        const underline = this.hasAttribute('underline') || false;
        const bold = this.hasAttribute('bold') || false;
        const semiBold = this.hasAttribute('semiBold') || false;
        
        const label = this.textContent.trim() || 'Text';



        const style = document.createElement('style');
        style.textContent = `
      .text {
       font-size: ${fonts.medium};
       color: ${colors.text};
      }
       .success {
        color: ${colors.success};
       }
        .warning {
        color: ${colors.warning};
        }
        .info {
        color: ${colors.info};
        }
        .error {
        color: ${colors.error};
        }
        .h1 {
        font-size: ${fonts.xxl};
        font-weight: 700;
        }


.h2 {
        font-size: ${fonts.xl};
        font-weight: 700;
        }

.h3 {
        font-size: ${fonts.l};
        font-weight: 700;
        }

        .label {
            font-size: ${fonts.m};
            color: ${colors.label};
        }

        .bold {
        font-weight: 700;
        }

        .semiBold {
        font-weight: 600;
        }

        .italic {
        font-style: italic;
        }
        .underline {
        text-decoration: underline;
        }
    `;

    const text = document.createElement('span');
        text.textContent = label;
        
    text.className = `text ${variant} ${type} ${italic ? 'italic' : ''} ${underline ? 'underline' : ''} ${semiBold ? 'semiBold' : ''} ${bold ? 'bold' : ''}`;
    
        
    shadow.appendChild(style);
    shadow.appendChild(text);
  }
}

customElements.define('fj-text', Text);