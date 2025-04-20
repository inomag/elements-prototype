class FjChip extends HTMLElement {
    static get observedAttributes() {
      return ['type', 'bold'];
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
      const type = this.getAttribute('type') || 'info';
      const isBold = this.hasAttribute('bold');
  
      let bgColor = '#e0f3ff'; // default info
      let fontColor = '#0077cc';
  
      if (type === 'success') {
        bgColor = '#e0ffe8';
        fontColor = '#1a7f37';
      } else if (type === 'error') {
        bgColor = '#ffe8e8';
        fontColor = '#cc1f1a';
      } else if (type === 'warning') {
        bgColor = '#fff7e0';
        fontColor = '#b38600';
      }
  
      this.shadowRoot.innerHTML = `
        <style>
          .chip {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
                  box-shadow: 2px 2px 0px #ccc;

            width: fit-content;
            background-color: ${bgColor};
            color: ${fontColor};
            font-size: 14px;
            ${isBold ? 'font-weight: bold;' : ''}
          }
          .icon {
            display: flex;
            align-items: center;
          }
        </style>
        <div class="chip">
          <slot name="icon"></slot>
          <slot></slot>
        </div>
      `;
    }
  }
  
  customElements.define('fj-chip', FjChip);
  