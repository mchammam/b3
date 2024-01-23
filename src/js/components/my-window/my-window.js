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
    border-radius: 0.1rem;
    background:  #374151;
    box-shadow: rgba(22, 25, 32, 0.25) 0px 25px 50px -12px;
  }
  #title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid;
    cursor: default;
    user-select: none;
  }
  #title-bar button {
    padding: 0.3rem;
    background: #1F2937;
    border-radius: 1rem;
    border: 2px solid #1F2937;
    font-weight: bold;
    color: #E5E7EB;
    cursor: pointer;
    transition: all 150ms;
  }
  button:hover, button:focus {
    background: #111827;
    box-shadow: 0 3px 10px rgba(22, 25, 32, 0.25);
  }
  slot {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }
</style>

<div id="title-bar">
  <span id="title"></span>
  <button id="close" title="Close">X</button>
</div>

<slot>
</slot>
`

customElements.define(
  'my-window',
  /**
   * Represents a my-window element.
   */
  class extends HTMLElement {
    /**
     * Used to remove the event listeners on component disconnect.
     *
     * @type {AbortController}
     */
    #abortController = new AbortController()

    /**
     * Used to remove the mouse move event listener.
     *
     * @type {AbortController}
     */
    #mousemoveAbortController = new AbortController()

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
      this.shadowRoot.addEventListener('click', (event) => {
        this.dispatchEvent(new CustomEvent('my-window:focus'))
      }, { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('#close').addEventListener('click', () => this.remove(),
        { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('#title-bar').addEventListener('mousedown', (event) => {
        this.#handleTitleBarMouseDown(event.button, event.pageX, event.pageY)
      }, { signal: this.#abortController.signal })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.#abortController.abort()
      this.#mousemoveAbortController.abort()
    }

    /**
     * Handle mouse down on window title bar.
     *
     * @param {number} button - The mouse button.
     * @param {number} mousePageX - The mouse page X.
     * @param {number} mousePageY - The mouse page Y.
     */
    #handleTitleBarMouseDown (button, mousePageX, mousePageY) {
      if (button !== 0) {
        return
      }

      const mouseToWindowOffsetY = mousePageY - this.getBoundingClientRect().y
      const mouseToWindowOffsetX = mousePageX - this.getBoundingClientRect().x

      /**
       * Method to handle mouse move.
       *
       * @param {MouseEvent} event - The mouse move event.
       */
      window.addEventListener('mousemove', (event) => {
        this.dispatchEvent(new CustomEvent('my-window:move', {
          detail: {
            top: event.pageY - mouseToWindowOffsetY,
            left: event.pageX - mouseToWindowOffsetX
          }
        }))
      }, { signal: this.#mousemoveAbortController.signal })

      window.addEventListener('mouseup', (event) => {
        this.#mousemoveAbortController.abort()
        this.#mousemoveAbortController = new AbortController()
      }, { once: true })
    }
  }
)
