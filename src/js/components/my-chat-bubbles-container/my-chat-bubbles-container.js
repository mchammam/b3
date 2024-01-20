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
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 20rem;
    min-width: 15rem;
    max-width: 15rem;
    overflow-y: auto;
  }
</style>
<slot></slot>
`
customElements.define(
  'my-chat-bubbles-container',
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
  }
)
