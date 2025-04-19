import { theme } from "../theme/index.js";
const { colors } = theme;

class FJSlider extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'min', 'max', 'display-suffix'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.min = 0;
    this.max = 100;
    this.value = 50;
    this.displaySuffix = '%';

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'min' || name === 'max' || name === 'value') {
      this[name] = parseFloat(newValue);
    } else if (name === 'display-suffix') {
      this.displaySuffix = newValue;
    }

    this.updateUI();
  }

  handleInputChange(e) {
    const newValue = parseFloat(e.target.value);
    this.value = newValue;
    this.setAttribute('value', newValue);

    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: newValue },
      bubbles: true,
      composed: true,
    }));

    this.updateUI();
  }

  updateUI() {
    const svg = this.shadowRoot.querySelector('svg');
    const track = this.shadowRoot.querySelector('.filledTrack');
    const knob = this.shadowRoot.querySelector('.knob');
    const label = this.shadowRoot.querySelector('.valueLabel');
  
    if (!svg) return;
  
    const knobRadius = 10;
    const extraPadding = 2;  // add a little more space from the edges
    const svgWidth = svg.clientWidth;
    
    const percent = (this.value - this.min) / (this.max - this.min);
    const clampedX = knobRadius + extraPadding + percent * (svgWidth - 2 * (knobRadius + extraPadding));
    if (track) track.setAttribute('width', `${percent * 100}%`);
    if (knob) knob.setAttribute('cx', `${clampedX}`);
    if (label) label.textContent = `${this.value} ${this.displaySuffix}`;
  }
  

  render() {
    const percent = ((this.value - this.min) / (this.max - this.min)) * 100;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; max-width: 400px; position: relative; text-align: center; }
        .sliderContainer { width: 100%; position: relative; }
        .track { width: 100%; fill: lightgrey; height: 4px; }
        .filledTrack { fill: ${colors.primary}; height: 4px; }
        .knob { transform: scale(1); cursor: pointer; stroke: ${colors.primary}; fill: lightgrey; stroke-width: 3px; }
        .knob:hover { transform: scale(1.3); }
        .hiddenInput { width: 100%; position: absolute; left: 0; top: 0; opacity: 0; height: 30px; cursor: pointer; }
        .valueLabel { position: absolute; top: 17px; left: calc(50% - 25px); width: fit-content; text-align: center; }
      </style>
      <div class="sliderContainer">
        <svg width="100%" height="30">
          <rect x="0" y="10" rx="5" width="100%" class="track" />
          <rect x="0" y="10" rx="5" width="${percent}%" class="filledTrack" />
          <circle cy="13" r="10" cx="${percent}%" class="knob"></circle>
        </svg>
        <input type="range"
               min="${this.min}"
               max="${this.max}"
               value="${this.value}"
               step="0.01"
               class="hiddenInput" />
        <div class="valueLabel">${this.value} ${this.displaySuffix}</div>
      </div>
    `;

    this.shadowRoot.querySelector('input')
      .addEventListener('input', this.handleInputChange);
  }
}

customElements.define('fj-slider', FJSlider);
