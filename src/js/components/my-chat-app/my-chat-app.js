/**
 * The my-chat-app web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

import '../my-chat-bubbles-container'
import '../my-chat-bubble'

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .hidden {
      display: none;
    }
  </style>

<div id="nickname-form">

</div>

<div>
  <my-chat-bubbles-container></my-chat-bubbles-container>
</div>

<form>
  <textarea></textarea>
  <button type="submit">Send</button>
</form>
`

/*
 * Define custom element.
 */
customElements.define(
  'my-chat-app',
  /**
   * Represents a memory game app
   */
  class extends HTMLElement {
    /**
     * Make it possible to remove the event listeners.
     *
     * @type {AbortController}
     */
    #abortController = new AbortController()

    #socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')

    #username = 'testuser'

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
      this.shadowRoot.querySelector('form').addEventListener('submit', event => {
        event.preventDefault()

        if (this.#socket.readyState !== 1) {
          console.log('Not ready!')
        }

        const message = this.shadowRoot.querySelector('textarea').value

        this.#socket.send(JSON.stringify({
          type: 'message',
          data: message,
          username: this.#username,
          channel: '1',
          key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
        }))

        this.shadowRoot.querySelector('textarea').value = ''
      },
      { signal: this.#abortController.signal }
      )

      this.#socket.addEventListener('message', event => {
        const data = JSON.parse(event.data)

        if (data.type !== 'message') {
          return
        }

        const chatBubble = document.createElement('my-chat-bubble')

        chatBubble.setAttribute('username', data.username)
        data.username === this.#username && chatBubble.setAttribute('self', '')

        chatBubble.textContent = `${data.data}`

        this.shadowRoot.querySelector('my-chat-bubbles-container').append(chatBubble)
      })
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
