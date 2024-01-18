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
  :host {
    height: 100vh;
    width: 100vw;
  }
</style>

<my-dock>
  <button title="Memory game" data-app="my-window">🎮</button>
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

        event.target.style.zIndex = ++this.#highestWindowZIndex
      })

      this.shadowRoot.querySelector('my-dock').addEventListener('click', async event => {
        if (event.target.nodeName !== 'BUTTON') {
          return
        }

        const newWindow = document.createElement('my-window')

        const numberOfWindows = this.shadowRoot.querySelectorAll('my-window').length
        newWindow.setAttribute('top', numberOfWindows * 15 + 100)
        newWindow.setAttribute('left', numberOfWindows * 15 + 100)

        newWindow.setAttribute('title', event.target.getAttribute('title'))
        newWindow.style.zIndex = ++this.#highestWindowZIndex
        newWindow.innerHTML = 'Loading...'

        this.shadowRoot.append(newWindow)

        const appName = event.target.getAttribute('data-app')
        await import(`../${appName}`)
        const newApp = document.createElement(appName)
        newWindow.replaceChildren(newApp)
      })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {

    }
  }
)
