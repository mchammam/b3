/**
 * my-pwd web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

import '../my-window'
import '../my-dock'
import '../my-spinner'

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
  <button title="Memory game" data-app="my-memory-game-app">🎮</button>
  <button title="Chat" data-app="my-chat-app">💬</button>
  <button title="Notepad" data-app="my-notepad-app">🗒️</button>
</my-dock>
`

customElements.define(
  'my-pwd',
  /**
   * Represents a my-pwd element.
   */
  class extends HTMLElement {
    /**
     * Used to remove the event listeners on component disconnect.
     *
     * @type {AbortController}
     */
    #abortController = new AbortController()

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
      this.shadowRoot.querySelector('my-dock').addEventListener('my-dock:app-open', (event) => {
        const title = event.detail.title
        const app = event.detail.app

        this.#openApp(title, app)
      }, { signal: this.#abortController.signal })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.#abortController.abort()
    }

    /**
     * Opens an app.
     *
     * @param {string} title - The title of the app.
     * @param {string} app - The name of the app.
     */
    async #openApp (title, app) {
      const newWindow = document.createElement('my-window')

      const numberOfWindows = this.shadowRoot.querySelectorAll('my-window').length
      newWindow.style.top = `${numberOfWindows * 15 + 100}px`
      newWindow.style.left = `${numberOfWindows * 15 + 100}px`

      newWindow.setAttribute('title', title)
      newWindow.style.zIndex = ++this.#highestWindowZIndex
      newWindow.append(document.createElement('my-spinner'))

      this.shadowRoot.append(newWindow)

      await import(`../${app}`)
      const newApp = document.createElement(app)
      newWindow.replaceChildren(newApp)

      newWindow.addEventListener('my-window:focus', (event) => {
        event.currentTarget.style.zIndex = ++this.#highestWindowZIndex
      }, { signal: this.#abortController.signal })

      newWindow.addEventListener('my-window:move', (event) => {
        const newTop = event.detail.top
        const newLeft = event.detail.left

        event.currentTarget.style.top = `${newTop}px`
        event.currentTarget.style.left = `${newLeft}px`
      }, { signal: this.#abortController.signal })
    }
  }
)
