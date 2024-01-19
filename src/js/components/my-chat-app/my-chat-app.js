/**
 * The my-chat-app web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .hidden {
      display: none;
    }
  </style>

<div class="container">
  container
</div>
`

/*
 * Define custom element.
 */
customElements.define(
  'my-chat-app',
  /**
   * Represents a memory game app
   */
  class extends HTMLElement {
    /**
     * Make it possible to remove the event listeners.
     *
     * @type {AbortController}
     */
    #abortController = new AbortController()

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
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {

    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      // Remove the event listener.
      this.#abortController.abort()
    }
  }
)
