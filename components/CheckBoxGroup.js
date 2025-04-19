class FjCheckboxGroup extends HTMLElement {
    static get observedAttributes() {
      return ['disabled', 'orientation', 'size'];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.render();
    }
  
    connectedCallback() {
      this.addEventListener('change', this.handleChange.bind(this));
    }
  
    disconnectedCallback() {
      this.removeEventListener('change', this.handleChange.bind(this));
    }
  
    attributeChangedCallback() {
      this.render();
    }
  
    handleChange(event) {
      const checkboxes = this.querySelectorAll('fj-checkbox');
      const selectedValues = [];
      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          selectedValues.push(checkbox.getAttribute('value') || checkbox.innerText.trim());
        }
      });
  
      this.dispatchEvent(
        new CustomEvent('groupChange', {
          detail: { selectedValues, event },
          bubbles: true,
        })
      );
    }
  
    render() {
      const orientation = this.getAttribute('orientation') || 'vertical';
      const size = this.getAttribute('size') || 'medium';
      const disabled = this.hasAttribute('disabled');
  
      this.shadowRoot.innerHTML = `
        <style>
          .group {
            display: flex;
            flex-direction: ${orientation === 'horizontal' ? 'row' : 'column'};
          }
        </style>
        <div class="group">
          <slot></slot>
        </div>
      `;
  
      const slot = this.shadowRoot.querySelector('slot');
      slot.addEventListener('slotchange', () => {
        const nodes = slot.assignedElements();
        nodes.forEach(child => {
          if (disabled) {
            child.setAttribute('disabled', '');
          }
          if (!child.hasAttribute('size')) {
            child.setAttribute('size', size);
          }
        });
      });
    }
  }
  
  customElements.define('fj-checkbox-group', FjCheckboxGroup);
  