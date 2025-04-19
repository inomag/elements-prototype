class Breadcrumb extends HTMLElement {
    static get observedAttributes() {
      return ['items', 'separator'];
    }
  
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'open' });
      this.showMenu = null;  // Store the index of the open menu, or null if no menu is open
      this.selectedMenuItem = null;
      this.render();
  
      // Bind event listeners for detecting click outside
      this.handleClickOutside = this.handleClickOutside.bind(this);
    }
  
    // Getter and Setter for 'items'
    get items() {
      return this._items || [];
    }
  
    set items(value) {
      if (Array.isArray(value)) {
        this._items = value;
        this.render();
      } else {
        console.error('fj-breadcrumb: items must be an array');
      }
    }
  
    // Getter and Setter for 'separator'
    get separator() {
      return this.getAttribute('separator') || '/';
    }
  
    set separator(value) {
      this.setAttribute('separator', value);
      this.render();
    }
  
    // connectedCallback is called when the component is connected to the DOM
    connectedCallback() {
      this.render();
      document.addEventListener('click', this.handleClickOutside);
    }
  
    // disconnectedCallback to remove the event listener
    disconnectedCallback() {
      document.removeEventListener('click', this.handleClickOutside);
    }
  
    // Handle click outside to close the menu
    handleClickOutside(event) {
      // If the click is outside the shadow root of the breadcrumb, close the menu
      if (!this.shadowRoot.contains(event.target)) {
        this.showMenu = null;  // Close the menu when clicked outside
        this.render();
      }
    }
  
    // handle menu item click
    handleMenuItemClick(menuItem, event) {
      event.preventDefault(); // Prevent bubbling up to document
      this.selectedMenuItem = menuItem;
      this.showMenu = null; // Close the menu after selecting an item
      this.dispatchEvent(new CustomEvent('menuItemSelect', {
        detail: menuItem,
        bubbles: true,
      }));
      this.render();
    }
  
    // render the breadcrumb HTML
    render() {
      const separator = this.separator;
      const rawItems = this.getAttribute('items') || '[]';
      let items;
  
      try {
        items = JSON.parse(rawItems);
      } catch (e) {
        console.error('Invalid JSON for Breadcrumb items:', e);
        items = [];
      }
  
      this.shadow.innerHTML = `
        <style>
          nav {
            display: flex;
            align-items: center;
          }
  
          .custom_breadcrumb {
            display: flex;
            gap: 10px;
            list-style-type: none;
            padding: 0;
            margin: 0;
          }
  
          .custom_breadcrumb a {
            color: inherit;
            text-decoration: none;
          }
  
          .custom_breadcrumb a:hover {
            text-decoration: underline;
          }
  
          .menu_container {
            position: relative;
            padding: 0 0 4px 0;
          }
  
          .menu {
            position: absolute;
            box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
                        0 6px 16px 0 rgba(0, 0, 0, 0.08),
                        0 9px 28px 8px rgba(0, 0, 0, 0.05);
            border-radius: 2px;
            background-color: #fff;
            padding: 4px 0;
            cursor: pointer;
            z-index: 10;
          }
  
          .menu div {
            padding: 4px 8px;
          }
  
          .menu div:hover {
            background-color: rgba(191, 191, 191, 0.1);
          }
  
          li {
            list-style: none;
          }
        </style>
  
        <nav aria-label="breadcrumb">
          <ul class="custom_breadcrumb">
            ${
              items.map((item, index) => `
                <li>
                  ${
                    index === items.length - 1 && !item.menu
                      ? `<fj-text bold>
                          <span tabindex="0" role="button">
                            ${item.title}
                          </span>
                        </fj-text>`
                      : item.menu?.length
                        ? `
                          <div class="menu_container">
                            <div class="menu_trigger" role="button" tabindex="0" 
                                 onclick="this.getRootNode().host.toggleMenu(${index}, event)">
                              <span>${this.selectedMenuItem?.label || item.title}</span> ▼
                            </div>
                            ${this.showMenu === index
                              ? `<div class="menu">
                                  ${item.menu.map(menuItem => `
                                    <div role="button" tabindex="0">
                                      ${
                                        menuItem.path
                                          ? `<a href="${menuItem.path}" tabindex="0" role="link"
                                               onclick="this.getRootNode().host.handleMenuItemClick(${JSON.stringify(menuItem)}, event)">
                                                ${menuItem.label}
                                             </a>`
                                          : `<span tabindex="0"
                                               onclick="this.getRootNode().host.handleMenuItemClick(${JSON.stringify(menuItem)}, event)">
                                                ${menuItem.label}
                                             </span>`
                                      }
                                    </div>
                                  `).join('')}
                                </div>`
                              : ''
                            }
                          </div>
                        `
                        : `<a href="${item.path || '#'}" tabindex="0" role="link">${item.title}</a>`
                  }
                </li>
                ${index !== items.length - 1 ? `<span>${separator}</span>` : ''}
              `).join('')
            }
          </ul>
        </nav>
      `;
    }
  
    // toggle the visibility of the nested menu
    toggleMenu(index, event) {
      // Toggle the menu visibility state
      event.stopPropagation();
      this.showMenu = this.showMenu === index ? null : index;
      this.render();
    }
  }
  
  // Define the custom element
  customElements.define('fj-breadcrumb', Breadcrumb);
  