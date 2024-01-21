/**
 * The my-memory-game-start-form web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
form{
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 1rem;
}
.input-group {
  position: relative;
}
#board-size-btns {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #374151;
  font-size: 1.2rem;
  color: rgb(117, 117, 117);
  cursor: text;
  transition: all 200ms;
}
input:focus + label, input:valid + label{
  top: 0;
  left: 1.1rem;
  transform: translateY(-50%);
  padding-inline: 0.2rem;
  font-size: 0.85rem;
  color: unset;
  letter-spacing: 0.06rem;
  font-weight: bold;
}
input {
  padding: 0.3rem;
  background: #374151;
  border-radius: 1rem;
  border: 2px solid #E5E7EB;
  font-size: 1.2rem;
  text-align: center;
  color: #E5E7EB;
}
button {
  padding: 0.75rem 0.3rem;
  background: #1F2937;
  border-radius: 1rem;
  border: 2px solid #1F2937;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.12rem;
  color: #E5E7EB;
  cursor: pointer;
  transition: all 150ms;
  }
button:hover, button:focus {
  background: #111827;
  box-shadow: 0 3px 10px rgba(22, 25, 32, 0.25);
}
</style>
<form>
  <div class="input-group">
    <input id="nickname" type="text" required/>
    <label for="nickname">NICKNAME</label>
  </div>
  <div id="board-size-btns">
    <button type="submit" data-board-size="small">Small (2x2)</button>
    <button type="submit" data-board-size="medium">Medium (2x4)</button>
    <button type="submit" data-board-size="large">Large (4x4)</button>
  </div>
</form>
`

customElements.define(
  'my-memory-game-start-form',
  /**
   * Represents a my-memory-game-start-form element.
   */
  class extends HTMLElement {
    /**
     * Bound event handler.
     *
     * @type {Function}
     */
    #boundHandleSubmit

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
      return ['nickname']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'nickname') {
        this.shadowRoot.querySelector('#nickname').focus()
        this.shadowRoot.querySelector('#nickname').value = newValue
        this.shadowRoot.querySelectorAll('form button[type="submit"]').forEach(button => {
          button.removeAttribute('disabled')
        })
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      /**
       * Handle the form submit event.
       *
       * @param {SubmitEvent} event - the submit event.
       */
      this.shadowRoot.querySelector('form').addEventListener(
        'submit',
        (this.#boundHandleSubmit = (event) => {
          event.preventDefault()

          this.#handleSubmit(event.submitter.getAttribute('data-board-size'))
        })
      )

      this.shadowRoot.querySelector('form').addEventListener(
        'keydown', event => {
          if (event.key === 'Enter') {
            event.preventDefault()
          }
        }
      )
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.shadowRoot
        .querySelector('form')
        .removeEventListener('submit', this.#boundHandleSubmit)
    }

    /**
     * Handles the form submit event.
     *
     * @param boardSize
     */
    #handleSubmit (boardSize) {
      this.shadowRoot.querySelectorAll('form button[type="submit"]').forEach(button => {
        button.setAttribute('disabled', '')
      })

      const nickname = this.shadowRoot.querySelector('#nickname').value

      this.dispatchEvent(
        new CustomEvent('my-memory-game-start-form:submit', { detail: { nickname, boardSize } })
      )
    }
  }
)
