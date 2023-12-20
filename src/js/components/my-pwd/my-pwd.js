/**
 * my-pwd web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

import '../my-window'

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  #container {
    height: 100vh;
    width: 100vw;
  }
</style>
<div id="container">
  <my-window title="My app">
    Window content.
  </my-window>
</div>
`

customElements.define(
  'my-pwd',
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
