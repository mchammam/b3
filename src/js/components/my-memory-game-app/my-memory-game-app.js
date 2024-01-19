/**
 * The my-memory-game-app web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

import '../my-memory-game'

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
  </style>

<my-memory-game></my-memory-game>
`

/*
 * Define custom element.
 */
customElements.define(
  'my-memory-game-app',
  /**
   * Represents a memory game app
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
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {}

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {}
  }
)
