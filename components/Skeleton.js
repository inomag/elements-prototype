class FJSkeleton extends HTMLElement {
    static get observedAttributes() {
      return ['rounded', 'rect', 'lines', 'avatar'];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.rounded = false;
      this.rect = false;
      this.lines = 3;
      this.avatar = false;
    }
  
    connectedCallback() {
      this.render();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'rounded') this.rounded = this.hasAttribute('rounded');
      if (name === 'rect') this.rect = this.hasAttribute('rect');
      if (name === 'avatar') this.avatar = this.hasAttribute('avatar');
      if (name === 'lines') this.lines = parseInt(newValue) || 3;
  
      this.render();
    }
  
    render() {
      const skeletonClass = this.rounded ? 'rounded' : '';
      const lines = this.rect ? 1 : this.lines;
  
      let avatarHTML = '';
      if (this.avatar) {
        avatarHTML = `<div class="avatar ${skeletonClass}"></div>`;
      }
  
      let linesHTML = '';
      for (let i = 0; i < lines; i++) {
        linesHTML += `<div class="line ${skeletonClass}"></div>`;
      }
  
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
          .skeleton-container {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .avatar {
            width: 40px;
            height: 40px;
            flex-shrink: 0;
                        animation: pulse 1.5s infinite ease-in-out;

          }
          .line {
            height: 12px;
                       animation: pulse 1.5s infinite ease-in-out;

            flex-grow: 1;
            margin: 5px 0;
          }
          .rounded {
            border-radius: 999px;
          }
          .rect .line {
            width: 100%;
            height: 100px;
                        animation: pulse 1.5s infinite ease-in-out;

          }
          @keyframes pulse {
            0% { background-color: #eee; }
            50% { background-color: #ddd; }
            100% { background-color: #eee; }
          }
        </style>
        <div class="skeleton-container ${this.rect ? 'rect' : ''}">
          ${avatarHTML}
          <div style="flex-grow:1;">
            ${linesHTML}
          </div>
        </div>
      `;
    }
  }
  
  customElements.define('fj-skeleton', FJSkeleton);
  