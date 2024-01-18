/**
 * my-dock web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  :host {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3rem;
    background:  #374151;
    box-shadow: rgba(22, 25, 32, 0.25) 0px 25px 50px -12px;
    z-index: 9999;
  }
  slot {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    padding: 0rem 1rem;
    cursor: default;
    user-select: none;
  }
  ::slotted(button) {
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    border-radius: 0rem;
    border: 0px solid #1F2937;
    height: 3rem;
    width: 3rem;
    font-size: 2rem;
    font-weight: bold;
    color: #E5E7EB;
    cursor: pointer;
    transition: all 50ms;
  }
  ::slotted(button:hover) {
    border-bottom: 3px solid #1F2937;

  }
</style>

<slot>
</slot>
`

customElements.define(
  'my-dock',
  /**
   * Represents a my-dock element.
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
