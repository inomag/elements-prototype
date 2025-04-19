import {theme} from './../theme/index.js';
class Card extends HTMLElement {
    constructor() {
        super();
        const { colors, fonts, borders } = theme;
        const shadow = this.attachShadow({ mode: 'open' });
      
        // attributes
        /**
         * type: 'default' | 'success' | 'error' | 'info' | 'warning'
         */

        const type = this.getAttribute('type') || 'default';
        
        const children = this.innerHTML || 'Card';



        const style = document.createElement('style');
        style.textContent = `
      .card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      border: 1px solid #ccc;
      border-radius: ${borders.m};
      box-shadow: 0px 0px 4px #ccc;
      padding: 16px;
      transition: 0.3s;
      }
       .success {
        border-color: ${colors.success};
              box-shadow: 0px 0px 4px ${colors.success};

       }
        .warning {
        border-color: ${colors.warning};
              box-shadow: 0px 0px 4px ${colors.warning};

        }
        .info {
        border-color: ${colors.info};
              box-shadow: 0px 0px 4px ${colors.info};

        }
        .error {
        border-color: ${colors.error};
              box-shadow: 0px 0px 4px  ${colors.error};

        }
    `;

    const card = document.createElement('div');
        card.innerHTML = children;
        
    card.className = `card ${type}`;
    
        
    shadow.appendChild(style);
    shadow.appendChild(card);
  }
}

customElements.define('fj-card', Card);