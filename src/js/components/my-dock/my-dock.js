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
     * Bound event handler.
     *
     * @type {Function}
     */
    #boundHandleMouseMove

    /**
     * Bound event handler.
     *
     * @type {Function}
     */
    #boundHandleMouseDown

    /**
     * Bound event handler.
     *
     * @type {Function}
     */
    #boundHandleCloseButtonClick

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
      return ['title', 'top', 'left']
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

      if (name === 'top' && oldValue !== newValue) {
        this.shadowRoot.host.style.top = newValue + 'px'
      }

      if (name === 'left' && oldValue !== newValue) {
        this.shadowRoot.host.style.left = newValue + 'px'
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      /**
       * Method to handle mouse down on window title div (and move the window).
       *
       * @param {MouseEvent} event - The mouse down event.
       */
      this.shadowRoot.querySelector('#title-bar').addEventListener('mousedown', this.#boundHandleMouseDown = event => {
        if (event.button !== 0) {
          return
        }

        const windowTop = this.getAttribute('top') ?? 0
        const mouseToWindowOffsetY = event.pageY - windowTop

        const windowLeft = this.getAttribute('left') ?? 0
        const mouseToWindowOffsetX = event.pageX - windowLeft

        // TODO: is this the best way?
        /**
         * Method to handle mouse move.
         *
         * @param {MouseEvent} event - The mouse move event.
         */
        window.addEventListener('mousemove', this.#boundHandleMouseMove = event => {
          this.setAttribute('top', event.pageY - mouseToWindowOffsetY)
          this.setAttribute('left', event.pageX - mouseToWindowOffsetX)
        })

        window.addEventListener('mouseup', event => {
          window.removeEventListener('mousemove', this.#boundHandleMouseMove)
        }, { once: true })
      })

      /**
       * Method to handle click on close button.
       */
      this.shadowRoot.querySelector('#close').addEventListener('click', this.#boundHandleCloseButtonClick = () => {
        this.remove()
      })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.shadowRoot.querySelector('#title-bar').removeEventListener('mousedown', this.#boundHandleMouseDown)
      this.shadowRoot.querySelector('#close').removeEventListener('click', this.#boundHandleCloseButtonClick)
    }
  }
)
