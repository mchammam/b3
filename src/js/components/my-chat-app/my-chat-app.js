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
const SOCKET_URL = 'wss://courselab.lnu.se/message-app/socket'
const API_KEY = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
const RECONNECT_INTERVAL_MS = 3000

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
    display: grid;
    grid-template-columns: 9rem 18rem;
    gap: 1rem;
    height: 20rem;
  }
  #username-form {
    grid-area: 1 / 1 / 2 / 3;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #374151e5;
    z-index: 1;
  }
  #channels {
    grid-area: 1 / 1 / 2 / 2;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-right: 1rem;
    border-right: 1px dashed #1f2937;
    overflow: auto;
  }
  #channels-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  #chat {
    grid-area: 1 / 2 / 2 / 3;
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
    width: 100%;
  }
#status {
  display: flex;
  align-items: end;
  justify-content: end;
  margin-bottom: -1rem;
  margin-right: -1rem;
  padding-right: 0.25rem;
  height: 1rem;
  font-size: 0.75rem;
  font-weight: bold;
  text-align: right;
}
#connected {
  color: #16a34a;
}
#connection-error {
  color: #450A0A;
}
h4 {
  margin: 0;
}
.channel-label {
  margin-left: 0.125rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.4rem;
  background: #4b5563;
  overflow-wrap: anywhere;
  cursor: pointer;
}
.channel-label:focus, .channel-label:hover, .channel-label:has(input:checked), .channel-label:has(input:focus) {
  outline: 0.125rem solid #1f2937;
}
.unread-msg-count {
  padding: 0.1rem 0.5rem;
  border-radius: 1rem;
  background: #111827;
  font-size: 0.6rem;
  font-weight: bold;
  font-weight: bold;
}
input[type="radio"] {
  display: none;
}
#add-channel {
  display: grid;
  grid-column-template: auto auto;
  grid-row-template: auto auto;
  margin-block: 1rem;
}
#add-channel .input-group {
  grid-area: 1 / 1 / 2 / 2;
  width: 100%;
}
#add-channel button {
  grid-area: 1 / 2 / 2 / 3;
}
#name-taken-msg {
  grid-area: 2 / 1 / 3 / 3;
  margin: 0.15rem 0 0 0;
  font-size: 0.6rem;
  font-weight: bold;
  text-align: center;
  color: #450A0A;
}

.input-group {
  position: relative;
}
#add-channel label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #374151;
  font-size: 0.6rem;
  color: rgb(117, 117, 117);
  cursor: text;
  transition: all 200ms;
}
#add-channel input:focus + label, #add-channel input:valid + label{
  top: 0;
  left: 0;
  transform: translateY(-50%);
  padding-inline: 0.2rem;
  color: unset;
  letter-spacing: 0.06rem;
  font-weight: bold;
}
#add-channel input {
  margin-left: 0.125rem;
  padding: 0.3rem;
  background: #374151;
  border-radius: 1rem 0 0 1rem;
  border: 2px solid #4b5563;
  border-right: 0;
  width: calc(100% - 0.6rem - 2px);
  text-align: center;
  color: #E5E7EB;
}
button {
  padding: 0 0.3rem;
  background: #4b5563;
  border-radius: 0 1rem 1rem 0;
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
.border-danger {
  border-color: #450A0A!important;
}
</style>

<div id="username-form">
  <my-username-form></my-username-form>
</div>

<div id="channels">
  <h4>Channels</h4>
  <div id="channels-list">
    <template id="channel-label-template">
      <label class="channel-label" for="channel-">
        <span class="channel-name">#</span>
        <span class="unread-msg-count hidden"></span>
        <input type="radio" name="channel" id="channel-" value="#"/>
      </label>
    </template>
  </div>
  <form id="add-channel">
    <div class="input-group">
      <input type="text" name="channel" id="channel-name" required/>
      <label for="channel-name">#channelName</label>
    </div>
    <button type="submit">+</button>
      <p id="name-taken-msg" class="hidden">Already taken!</p>
</form>
</div>

<div id="chat">
  <my-chat-form disabled></my-chat-form>
  <div id="status">
    <div id="connected" class="hidden">Connected</div>
    <div id="connection-error" class="hidden">Connection error</div>
  </div>
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
     * Used to remove the event listeners on component disconnect.
     *
     * @type {AbortController}
     */
    #abortController = new AbortController()

    /**
     * The websocket used for the chat.
     *
     * @type {WebSocket}
     */
    #socket = new WebSocket(SOCKET_URL)

    /**
     * The username.
     *
     * @type {string | null}
     */
    #username = localStorage.getItem('my-chat-app_username')

    #reconnectIntervalID

    #channel = '#general'

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
      }

      this.#addChannel(this.#channel)
      this.#selectChannel(this.#channel)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.shadowRoot.querySelector('my-username-form').addEventListener('my-username-form:answer', (event) => {
        this.#username = event.detail.username

        this.shadowRoot.querySelector('#username-form').classList.add('hidden')

        localStorage.setItem('my-chat-app_username', this.#username)
      })

      this.shadowRoot.querySelector('my-chat-form').addEventListener('my-chat-form:message', (event) => {
        console.log(this.#socket.readyState)
        if (this.#socket.readyState !== 1) {
          console.log('Not ready!')
          return
        }

        const message = event.detail.message

        this.#socket.send(JSON.stringify({
          type: 'message',
          data: message,
          username: this.#username,
          channel: this.#channel,
          key: API_KEY
        }))
      },
      { signal: this.#abortController.signal }
      )

      this.shadowRoot.querySelector('#add-channel').addEventListener('submit', (event) => {
        event.preventDefault()

        const input = this.shadowRoot.querySelector('#add-channel input')
        const channelName = input.value

        if (this.shadowRoot.querySelector(`#channels-list input[value="${channelName}"]`)) {
          input.classList.add('border-danger')
          this.shadowRoot.querySelector('#add-channel button').classList.add('border-danger')
          this.shadowRoot.querySelector('#name-taken-msg').classList.remove('hidden')
          return
        }

        input.value = ''
        input.classList.remove('border-danger')
        this.shadowRoot.querySelector('#add-channel button').classList.remove('border-danger')
        this.shadowRoot.querySelector('#name-taken-msg').classList.add('hidden')

        this.#addChannel(channelName)
        this.#selectChannel(channelName)
      })
      this.#addSocketEventListeners()
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      // Remove the event listener.
      this.#abortController.abort()

      this.#socket.close()
    }

    /**
     *
     */
    #addSocketEventListeners () {
      this.#socket.addEventListener('open', (event) => {
        this.shadowRoot.querySelector('my-chat-form').removeAttribute('disabled')
        this.shadowRoot.querySelector('#status #connected').classList.remove('hidden')
        this.shadowRoot.querySelector('#status #connection-error').classList.add('hidden')

        clearInterval(this.#reconnectIntervalID)
      })

      this.#socket.addEventListener('error', (event) => {
        this.shadowRoot.querySelector('my-chat-form').setAttribute('disabled', '')
        this.shadowRoot.querySelector('#status #connected').classList.add('hidden')
        this.shadowRoot.querySelector('#status #connection-error').classList.remove('hidden')

        clearInterval(this.#reconnectIntervalID)
        this.#socket.close()

        this.#reconnectIntervalID = setInterval(() => {
          this.#socket.close()
          if (this.#socket.readyState === 3) {
            // abort socket event listeners!
            this.#socket = new WebSocket(SOCKET_URL)

            this.#addSocketEventListeners()
          }
        }, RECONNECT_INTERVAL_MS)
      })

      this.#socket.addEventListener('message', event => {
        const data = JSON.parse(event.data)

        if (data.type !== 'message') {
          return
        }

        const chatBubble = document.createElement('my-chat-bubble')

        chatBubble.setAttribute('username', data.username)
        data.username === this.#username && chatBubble.setAttribute('self', '')

        chatBubble.textContent = `${data.data.trim()}`

        let channelChatBubblesContainer = this.shadowRoot.querySelector(`my-chat-bubbles-container[data-channel="${data.channel}"]`)

        channelChatBubblesContainer ?? this.#addChannel(data.channel)
        channelChatBubblesContainer = this.shadowRoot.querySelector(`my-chat-bubbles-container[data-channel="${data.channel}"]`)

        channelChatBubblesContainer.append(chatBubble)

        chatBubble.scrollIntoView({ behavior: 'smooth' })

        if (this.#channel !== data.channel) {
          const unreadMsgBadge = this.shadowRoot.querySelector(`label[for="channel-${data.channel}"] .unread-msg-count`)
          unreadMsgBadge.textContent = unreadMsgBadge.textContent ? parseInt(unreadMsgBadge.textContent) + 1 : 1
          unreadMsgBadge.classList.remove('hidden')
        }
      })
    }

    /**
     *
     * @param channelName
     */
    #addChannel (channelName) {
      const channelChatBubblesContainer = document.createElement('my-chat-bubbles-container')
      channelChatBubblesContainer.setAttribute('data-channel', channelName)
      channelChatBubblesContainer.classList.add('hidden')
      this.shadowRoot.querySelector('#chat').prepend(channelChatBubblesContainer)

      const channelLabel = this.shadowRoot.querySelector('#channel-label-template').content.cloneNode(true)
      channelLabel.querySelector('label').setAttribute('for', `channel-${channelName}`)
      channelLabel.querySelector('.channel-name').textContent = channelName
      channelLabel.querySelector('input').setAttribute('id', `channel-${channelName}`)
      channelLabel.querySelector('input').setAttribute('value', channelName)
      channelLabel.querySelector('input').addEventListener('change', (event) => {
        this.#selectChannel(event.target.value)
      })

      this.shadowRoot.querySelector('#channels-list').append(channelLabel)
    }

    /**
     *
     * @param channel
     */
    #selectChannel (channel) {
      this.#channel = channel

      console.log(`input[value="${channel}"]`)

      this.shadowRoot.querySelector(`input[value="${channel}"]`).setAttribute('checked', '')

      this.shadowRoot.querySelectorAll('my-chat-bubbles-container')
        .forEach((chatBubblesContainer) => chatBubblesContainer.classList.add('hidden'))
      this.shadowRoot.querySelector(`my-chat-bubbles-container[data-channel="${channel}"]`).classList.remove('hidden')

      const unreadMsgBadge = this.shadowRoot.querySelector(`label[for="channel-${channel}"] .unread-msg-count`)
      unreadMsgBadge.textContent = ''
      unreadMsgBadge.classList.add('hidden')
    }
  }
)
