class FjDivider extends HTMLElement {
    static get observedAttributes() {
      return ['orientation', 'variant', 'thickness'];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    attributeChangedCallback() {
      this.render();
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      const orientation = this.getAttribute('orientation') || 'horizontal';
      const variant = this.getAttribute('variant') || 'solid';
      const thickness = this.getAttribute('thickness') || '1px';
  
      const isHorizontal = orientation === 'horizontal';
      const borderStyle = variant;
  
      this.shadowRoot.innerHTML = `
        <style>
          .divider {
            ${isHorizontal 
              ? `width: 100%; border-top: ${thickness} ${borderStyle} #ccc;` 
              : `height: 100%; border-left: ${thickness} ${borderStyle} #ccc;`
            }
          }
        </style>
        <div class="divider"></div>
      `;
    }
  }
  
  customElements.define('fj-divider', FjDivider);
  