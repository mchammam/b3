/**
 * The my-chat-form web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

import 'emoji-picker-element'

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  .hidden {
      display: none!important;
    }
  #controls {
    position: relative;
    margin-block: 0.25rem;
  }
  emoji-picker {
    --num-columns: 7;
    --emoji-size: 1rem;
    --background: #111827;
    position: absolute;
    height: 16rem;
    bottom: 100%;
    width: 16rem;
  }
  form {
    display: flex;
  }
  textarea {
    flex: 1;
    height: 2.5rem;
    background: transparent;
    border-radius: 0.4rem 0 0 0.4rem;
    border: 2px solid #4b5563;
    border-right: 0;
    color: #E5E7EB;
  }
  form button {
    border-radius: 0 0.4rem 0.4rem 0;
    border-left: 0;
  }
  button {
    padding: 0.1rem 0.3rem;
    background: transparent;
    border-radius: 0.4rem;
    border: 2px solid #4b5563;
    color: #E5E7EB;
    cursor: pointer;
    transition: all 150ms;
  }
  button:hover, button:focus {
    border-color: #111827;
    background: #111827;
    box-shadow: 0 3px 10px rgba(22, 25, 32, 0.25);
  }
</style>

<div id="controls">
  <div>
    <emoji-picker class="dark hidden"></emoji-picker>
  </div>
  <button id="emoji-picker-btn">😀</button>
</div>

<form>
  <textarea title="Message" placeholder="Type message here.."></textarea>
  <button type="submit" disabled>Send</button>
</form>
`
customElements.define(
  'my-chat-form',
  /**
   * Represents a my-chat-form element.
   */
  class extends HTMLElement {
    /**
     * Make it possible to remove the event listeners.
     *
     * @type {AbortController}
     */
    #abortController = new AbortController()

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
      this.shadowRoot.querySelector('emoji-picker').addEventListener('click', (event) => {
        // Prevent accidentally close of emoji-picker when click event propagates to window.
        event.stopPropagation()
      }, { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('#emoji-picker-btn').addEventListener('click', (event) => {
        if (this.shadowRoot.querySelector('emoji-picker').classList.contains('hidden')) {
          // Prevent accidentally close of emoji-picker when click event propagates to window.
          event.stopPropagation()
        }

        this.#handleEmojiPickerButtonClick()
      }, { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('emoji-picker').addEventListener('emoji-click', (event) => {
        this.#handleEmojiClick(event.detail.unicode)
      }, { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault()

        this.#handleFormSubmit()
      }, { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('textarea').addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()

          this.shadowRoot.querySelector('form').dispatchEvent(new Event('submit'))
        }
      }, { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('textarea').addEventListener('keyup', () => this.#handleTexareaKeyup()
        , { signal: this.#abortController.signal })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      // Remove the event listener.
      this.#abortController.abort()
    }

    /**
     * Handles the form submit event.
     */
    #handleFormSubmit () {
      const message = this.shadowRoot.querySelector('textarea').value

      if (message.trim() === '') {
        return
      }

      this.dispatchEvent(new CustomEvent('my-chat-form:submit', { detail: { message } }))

      this.shadowRoot.querySelector('textarea').value = ''
    }

    /**
     * Handles the textarea keyup event.
     */
    #handleTexareaKeyup () {
      const button = this.shadowRoot.querySelector('button[type="submit"]')

      if (this.shadowRoot.querySelector('textarea').value.trim() === '') {
        button.setAttribute('disabled', '')
      } else {
        button.removeAttribute('disabled')
      }
    }

    /**
     * Handles the emoji picker button click event.
     */
    #handleEmojiPickerButtonClick () {
      const emojiPicker = this.shadowRoot.querySelector('emoji-picker')

      emojiPicker.classList.toggle('hidden')

      if (emojiPicker.classList.contains('hidden')) {
        return
      }

      // Since this event listener is intended to close the emoji picker when click outside of it, the event listener is on the window object.
      window.addEventListener('click', (event) => {
        emojiPicker.classList.add('hidden')
      }, { once: true })
    }

    /**
     * Handles the emoji click event and inserts the emoji into the textarea.
     *
     * @param {string} emoji - The emoji.
     */
    #handleEmojiClick (emoji) {
      const textarea = this.shadowRoot.querySelector('textarea')
      const valueBeforeSelection = textarea.value.substring(0, textarea.selectionStart)
      const valueAfterSelection = textarea.value.substring(textarea.selectionEnd, textarea.value.length)

      textarea.value = valueBeforeSelection + emoji + valueAfterSelection

      textarea.focus()
      textarea.selectionEnd = valueBeforeSelection.length + emoji.length
    }
  }
)
