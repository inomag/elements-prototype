import { theme } from '../theme/index.js';

const { colors, fonts } = theme;

class FJCarousel extends HTMLElement {
  static get observedAttributes() {
    return ['shownavarrows', 'shownavdots', 'autoslide', 'autoslideinterval', 'slides', 'height', 'width'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.currentIndex = 0;
    this.autoSlideTimer = null;

    this.height = '100%';
    this.width = '100%';
    this.showNavArrows = true;
    this.showNavDots = true;
    this.autoSlide = false;
    this.autoSlideInterval = 3000;
    this.slides = [];
  }

  connectedCallback() {
    this.parseAttributes();
    this.render();
    this.initAutoSlide();
  }

  attributeChangedCallback() {
    this.parseAttributes();
    this.render();
    this.initAutoSlide();
  }

  parseAttributes() {
    this.showNavArrows = this.hasAttribute('shownavarrows') ? this.getAttribute('shownavarrows') !== 'false' : true;
    this.showNavDots = this.hasAttribute('shownavdots') ? this.getAttribute('shownavdots') !== 'false' : true;
    this.autoSlide = this.hasAttribute('autoslide') ? this.getAttribute('autoslide') !== 'false' : false;
    this.autoSlideInterval = parseInt(this.getAttribute('autoslideinterval')) || 3000;
    this.height = this.getAttribute('height') || '100%';
    this.width = this.getAttribute('width') || '100%';

    const slidesAttr = this.getAttribute('slides');
    try {
      this.slides = slidesAttr ? JSON.parse(slidesAttr) : [];
    } catch {
      this.slides = [];
    }

    // Reset index if out of bounds
    if (this.currentIndex >= this.slides.length) {
      this.currentIndex = 0;
    }
  }

  initAutoSlide() {
    clearInterval(this.autoSlideTimer);
    if (this.autoSlide && this.slides.length > 1) {
      this.autoSlideTimer = setInterval(() => this.nextSlide(), this.autoSlideInterval);
    }
  }

  nextSlide() {
    if (!this.slides.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlidePosition();
  }

  prevSlide() {
    if (!this.slides.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlidePosition();
  }

  goToSlide(index) {
    if (index >= 0 && index < this.slides.length) {
      this.currentIndex = index;
      this.updateSlidePosition();
    }
  }

  updateSlidePosition() {
    const inner = this.shadowRoot.querySelector('.carousel__inner');
    if (inner) {
      inner.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }
    this.updateDots();
  }

  updateDots() {
    const dots = this.shadowRoot.querySelectorAll('.carousel__dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('carousel__activeDot', index === this.currentIndex);
    });
  }

  render() {
    if (!this.slides.length) {
      this.shadowRoot.innerHTML = `<style>:host { display: none; }</style>`;
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          overflow: hidden;
          position: relative;
          height: ${this.height};
          width: ${this.width};
        }
        .carousel {
          height: ${this.height};
          width: ${this.width};
        }
        .carousel__inner {
          display: flex;
          transition: transform 0.5s ease-in-out;
        }
        .carousel__slide {
          min-width: 100%;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .carousel__slide.active {
          opacity: 1;
        }
        .carousel__button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.5);
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5em;
        }
        .carousel__button.prev { left: 10px; }
        .carousel__button.next { right: 10px; }
        .carousel__dots {
          text-align: center;
          margin-top: 10px;
        }
        .carousel__dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin: 0 5px;
          border-radius: 50%;
          background: #ccc;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .carousel__activeDot {
          background: ${colors.text};
        }
      </style>

      <div class="carousel">
        <div class="carousel__inner">
          ${this.slides.map((_, index) => `
            <div class="carousel__slide active">
              <fj-image-loader></fj-image-loader>
            </div>
          `).join('')}
        </div>

        ${this.showNavArrows && this.slides.length > 1 ? `
          <button class="carousel__button prev">&#10094;</button>
          <button class="carousel__button next">&#10095;</button>
        ` : ''}

        ${this.showNavDots && this.slides.length > 1 ? `
          <div class="carousel__dots">
            ${this.slides.map((_, index) => `
              <span class="carousel__dot ${index === this.currentIndex ? 'carousel__activeDot' : ''}" data-index="${index}"></span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    // Now bind image URLs and alt attributes AFTER the shadow DOM is ready:
    const imageElements = this.shadowRoot.querySelectorAll('fj-image-loader');
    imageElements.forEach((img, index) => {
      img.setAttribute('src', this.slides[index]);
      img.setAttribute('alt', `Slide ${index + 1}`);
    });

    // Dot navigation
    this.shadowRoot.querySelectorAll('.carousel__dot').forEach(dot => {
      dot.addEventListener('click', e => this.goToSlide(Number(e.target.dataset.index)));
    });

    // Arrow navigation
    if (this.showNavArrows) {
      this.shadowRoot.querySelector('.carousel__button.prev')?.addEventListener('click', () => this.prevSlide());
      this.shadowRoot.querySelector('.carousel__button.next')?.addEventListener('click', () => this.nextSlide());
    }

    this.updateSlidePosition();
  }
}

customElements.define('fj-carousel', FJCarousel);
