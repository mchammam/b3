/**
 * The my-username-form web component module.
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
  gap: 0.75rem;
}
.input-group {
  position: relative;
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
    <input id="username" type="text" required/>
    <label for="username">USERNAME</label>
  </div>
  <button type="submit" id="submit-btn">START CHAT</button>
</form>
`

customElements.define(
  'my-username-form',
  /**
   * Represents a my-username-form element.
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
      return ['username']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'username') {
        this.shadowRoot.querySelector('#username').focus()
        this.shadowRoot.querySelector('#username').value = newValue
        this.shadowRoot.querySelector('#submit-btn').removeAttribute('disabled')
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

          this.#handleSubmit()
        })
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
     */
    #handleSubmit () {
      this.shadowRoot.querySelector('#submit-btn').setAttribute('disabled', '')
      this.shadowRoot.querySelector('#submit-btn').textContent = 'RESUME CHAT'

      const username = this.shadowRoot.querySelector('#username').value

      this.dispatchEvent(
        new CustomEvent('my-username-form:answer', { detail: { username } })
      )
    }
  }
)
