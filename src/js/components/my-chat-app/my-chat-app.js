/**
 * The my-chat-app web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

import '../my-chat-bubbles-container'
import '../my-chat-bubble'
import '../my-username-form'
import '../my-chat-form'

// ------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------
const API_KEY = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .hidden {
      display: none!important;
    }
    :host {
      height: 20rem;
    }
    #username-form {
      display: flex;
      align-items: center;
      height: 100%;
    }
    #chat {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  </style>

<div id="username-form">
  <my-username-form></my-username-form>
</div>

<div id="chat" class="hidden">
  <my-chat-bubbles-container></my-chat-bubbles-container>
  <my-chat-form></my-chat-form>
</div>
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

    #username = localStorage.getItem('my-chat-app_username')

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

      if (this.#username) {
        this.shadowRoot.querySelector('#username-form').classList.add('hidden')
        this.shadowRoot.querySelector('#chat').classList.remove('hidden')
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.shadowRoot.querySelector('my-username-form').addEventListener('my-username-form:answer', event => {
        this.#username = event.detail.username

        this.shadowRoot.querySelector('#username-form').classList.add('hidden')
        this.shadowRoot.querySelector('#chat').classList.remove('hidden')

        localStorage.setItem('my-chat-app_username', this.#username)
      })

      this.shadowRoot.querySelector('my-chat-form').addEventListener('my-chat-form:message', event => {
        if (this.#socket.readyState !== 1) {
          console.log('Not ready!')
        }

        const message = event.detail.message

        this.#socket.send(JSON.stringify({
          type: 'message',
          data: message,
          username: this.#username,
          channel: '1',
          key: API_KEY
        }))
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

        chatBubble.textContent = `${data.data.trim()}`

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
