/**
 * The my-chat-bubbles-container web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

import '../my-spinner'

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
    word-break: break-word;
  }
  :host([self]) {
    margin-left: auto;
    margin-right: 0;
    border-radius: 10px 0 10px 10px;
  }
  .username-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    transform: translateY(100%);
    font-size: 0.6rem;
    padding-inline: 0.2rem;
  }
  :host([self]) .username-bar {
    display: none;
    right: 0;
    left: auto;
  }
  slot {
    white-space: pre-line;
  }
  my-spinner {
    display: none;
  }
  my-spinner::part(ring) {
    height: 9px;
    width: 9px;
  }
  my-spinner::part(ring-div) {
    width: 7px;
    height: 7px;
    margin: 3px;
    border: 2px solid #fff;
    border-color: #fff transparent transparent transparent;
  }
</style>

<slot></slot>
<div class="username-bar">
  <span id="username"></span>
  <my-spinner></my-spinner>
</div>
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
