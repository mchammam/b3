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
</style>

<div id="controls">
  <div>
    <emoji-picker class="dark hidden"></emoji-picker>
  </div>
  <button id="emoji-picker-btn">😀</button>
</div>

<form>
  <textarea></textarea>
  <button type="submit">Send</button>
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

    // my-chat-form:message
    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.shadowRoot.querySelector('#emoji-picker-btn').addEventListener(
        'click',
        (event) => {
          const emojiPicker = this.shadowRoot.querySelector('emoji-picker')

          emojiPicker.classList.toggle('hidden')

          if (emojiPicker.classList.contains('hidden')) {
            return
          }

          // Prevent the click events on emoji button and emoji picker from being fired on the document
          event.stopPropagation()

          this.shadowRoot.querySelector('emoji-picker').addEventListener('click',
            (event) => {
              event.stopPropagation()
            }
          )

          // Since this event listener is intended to close the emoji picker when click outside of it, the event listener is on the document itself.
          document.addEventListener('click', (event) => {
            console.log(event.target)

            if (!event.target === emojiPicker || !emojiPicker.parentElement.contains(event.target)) {
              emojiPicker.classList.add('hidden')
            }
          }, { once: true })
        },
        { signal: this.#abortController.signal }
      )

      document.addEventListener('click', (event) => {
        console.log(event.target)
        const emojiPicker = this.shadowRoot.querySelector('emoji-picker')

        if (!event.target === emojiPicker || !emojiPicker.parentElement.contains(event.target)) {
          emojiPicker.classList.add('hidden')
        }
      })

      this.shadowRoot.querySelector('emoji-picker').addEventListener(
        'emoji-click',
        (event) => {
          const emoji = event.detail.unicode

          const textarea = this.shadowRoot.querySelector('textarea')
          const valueBeforeSelection = textarea.value.substring(
            0,
            textarea.selectionStart
          )
          const valueAfterSelection = textarea.value.substring(
            textarea.selectionEnd,
            textarea.value.length
          )

          textarea.value = valueBeforeSelection + emoji + valueAfterSelection

          textarea.focus()
          textarea.selectionEnd = valueBeforeSelection.length + emoji.length
        },
        { signal: this.#abortController.signal }
      )

      this.shadowRoot.querySelector('form').addEventListener(
        'submit',
        (event) => {
          event.preventDefault()

          const message = this.shadowRoot.querySelector('textarea').value
          this.dispatchEvent(
            new CustomEvent('my-chat-form:message', {
              detail: { message }
            })
          )

          this.shadowRoot.querySelector('textarea').value = ''
        },
        { signal: this.#abortController.signal }
      )
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      // Remove the event listener.
      this.#abortController.abort()
    }
  }
)
