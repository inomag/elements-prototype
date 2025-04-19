import { theme } from './../theme/index.js';

class Avatar extends HTMLElement {
    static get observedAttributes() {
        return ['url', 'text', 'shape', 'size', 'background'];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    getTextColor(bgHex = '#f8e7ea') {
        const hex = bgHex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const brightness = (r + g + b) / 3;
        return brightness > 128 ? '#172b4d' : '#f8e7ea';
    }

    render() {
        const imageUrl = this.getAttribute('url');
        const text = this.getAttribute('text');
        const shape = this.getAttribute('shape') || 'circle';
        const size = this.getAttribute('size') || 'medium';
        const background = this.getAttribute('background') || '#f8e7ea';

        this.shadow.innerHTML = `
            <style>
                .avatar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    background-color: ${background};
                    width: 48px;
                    height: 48px;
                }
                .avatar__image {
                    width: 100%;
                }
                .avatar__circle { border-radius: 50%; }
                .avatar__rounded { border-radius: 8px; }
                .avatar__square { border-radius: 0; }
                .avatar__small { width: 24px; height: 24px; }
                .avatar__large { width: 64px; height: 64px; }
                .avatar__text {
                    font-size: 24px;
                    color: ${this.getTextColor(background)};
                }
                .avatar__text__small { font-size: 18px; }
                .avatar__text__large { font-size: 32px; }
            </style>
            <div class="avatar avatar__${shape} avatar__${size}">
                ${imageUrl 
                    ? `<img src="${imageUrl}" alt="${text || ''}" class="avatar__image" />`
                    : text 
                        ? `<span class="avatar__text avatar__text__${size}">${text}</span>`
                        : ''
                }
            </div>
        `;
    }
}

customElements.define('fj-avatar', Avatar);
