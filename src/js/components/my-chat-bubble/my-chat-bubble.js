/**
 * The my-chat-bubbles-container web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  :host {
    position: relative;
    margin-right: auto;
    padding: 0.2rem 0.5rem;
    border-radius: 0 10px 10px 10px;
    background-color: #111827;
  }
  :host([self]) {
    margin-left: auto;
    margin-right: 0;
    border-radius: 10px 0 10px 10px;
  }
  #username {
    position: absolute;
    left: 0;
    bottom: 0;
    transform: translateY(100%);
    font-size: 0.6rem;
    padding-inline: 0.2rem;
  }
  :host([self]) #username {
    right: 0;
    left: auto;
  }

</style>

<span id="username"></span>
<slot></slot>
`
customElements.define(
  'my-chat-bubble',
  /**
   * Represents a my-chat-bubbles-container element.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' }).append(
        template.content.cloneNode(true)
      )
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['username']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'username') {
        this.shadowRoot.querySelector('#username').textContent = newValue
      }
    }
  }
)
