/**
 * my-pwd web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

import '../my-window'
import '../my-dock'

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  #container {
    height: 100vh;
    width: 100vw;
  }
  my-dock button {
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
  my-dock button:hover {
    border-bottom: 3px solid #1F2937;

  }


</style>
<div id="container">
  <my-window title="My app">
    Window content.
  </my-window>
  <my-window title="My app 2">
    Window content 2.
  </my-window>
  <my-window title="My app 3">
    Window content 3.
  </my-window>
</div>
<my-dock>
  <button title="Memory game">🎮</button>
  <button title="Chat">💬</button>
  <button title="Notepad">🗒️</button>
</my-dock>
`

customElements.define(
  'my-pwd',
  /**
   * Represents a my-pwd element.
   */
  class extends HTMLElement {
    /**
     * The highest z-index of windows.
     *
     * @type {string}
     */
    #highestWindowZIndex = 0

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
      this.shadowRoot.addEventListener('mousedown', event => {
        if (event.target.nodeName !== 'MY-WINDOW') {
          return
        }

        this.#highestWindowZIndex++
        event.target.style.zIndex = this.#highestWindowZIndex
      })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {

    }
  }
)
