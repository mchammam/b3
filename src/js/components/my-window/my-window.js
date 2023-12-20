/**
 * my-window web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  :host {
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid;
  }
</style>
<div id="title">

</div>
<slot>
</slot>
`

customElements.define(
  'my-window',
  /**
   * Represents a quiz-application element.
   */
  class extends HTMLElement {
    /**
     * The user nickname.
     *
     * @type {string}
     */
    #nickname

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
      return ['title']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'title' && oldValue !== newValue) {
        this.shadowRoot.querySelector('#title').textContent = newValue
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {

    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {

    }
  }
)
