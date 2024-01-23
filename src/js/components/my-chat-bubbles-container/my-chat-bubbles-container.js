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
    flex: 1;
    padding-right: 0.5rem;
    min-height: 0;
    height: 100%;
    min-width: 15rem;
    overflow-y: auto;
  }
  ::slotted(my-chat-bubble[username]:first-of-type){
    margin-top: 0;
  }
  ::slotted(my-chat-bubble) {
    margin-top: 1rem;
  }
  ::slotted(my-chat-bubble[self]) {
    margin-top: 0.25rem;
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
