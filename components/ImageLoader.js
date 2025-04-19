class FJImageLoader extends HTMLElement {
    static get observedAttributes() {
      return ['src', 'alt', 'height', 'width'];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.src = '';
      this.alt = '';
      this.height = '100%';
      this.width = '100%';
      this.isLoaded = false;
    }
  
    connectedCallback() {
      this.render();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'src') this.src = newValue;
      if (name === 'alt') this.alt = newValue;
      if (name === 'height') this.height = newValue || '100%';
      if (name === 'width') this.width = newValue || '100%';
      this.render();
    }
  
    handleImageLoad() {
      this.isLoaded = true;
      const img = this.shadowRoot.querySelector('img');
      const skeleton = this.shadowRoot.querySelector('fj-skeleton');
  
      if (img) img.classList.add('imageLoaderWrapper__image__visible');
      if (skeleton) skeleton.style.display = 'none';
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
          }
          .imageLoaderWrapper {
            position: relative;
            display: inline-block;
            width: ${this.width};
            height: ${this.height};
          }
  
          .imageLoaderWrapper__image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            display: block;
            transition: opacity 0.2s ease-in-out;
          }
  
          .imageLoaderWrapper__image__visible {
            opacity: 1;
          }
        </style>
  
        <div class="imageLoaderWrapper">
          <fj-skeleton rect height="${this.height}" width="${this.width}"></fj-skeleton>
          <img
            src="${this.src}"
            alt="${this.alt}"
            height="${this.height}"
            width="${this.width}"
            class="imageLoaderWrapper__image"
          />
        </div>
      `;
  
      const img = this.shadowRoot.querySelector('img');
      img.addEventListener('load', () => this.handleImageLoad());
      img.addEventListener('error', () => this.handleImageLoad());
    }
  }
  
  customElements.define('fj-image-loader', FJImageLoader);
  