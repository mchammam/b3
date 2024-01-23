/**
 * The my-chat-app web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

import { cssTemplate } from './my-chat-app.css.js'
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
const htmlTemplate = document.createElement('template')
htmlTemplate.innerHTML = `
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
     * Used to remove socket event listeners.
     *
     * @type {AbortController}
     */
    #socketAbortController = new AbortController()

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

    /**
     * Interval id used to reconnect.
     *
     * @type {number}
     */
    #reconnectIntervalID

    /**
     * The default channel.
     *
     * @type {string}
     */
    #channel = '#general'

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' }).append(
        cssTemplate.content.cloneNode(true),
        htmlTemplate.content.cloneNode(true)
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
        this.#handleUsernameFormSubmit(event.detail.username)
      }, { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('my-chat-form').addEventListener('my-chat-form:submit', (event) => {
        this.#handleChatFormSubmit(event.detail.message)
      }, { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('form#add-channel').addEventListener('submit', (event) => {
        event.preventDefault()

        this.#handleAddChannelFormSubmit()
      }, { signal: this.#abortController.signal })

      this.#addSocketEventListeners()
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.#socket.close()
      this.#socketAbortController.abort()

      this.#abortController.abort()
    }

    /**
     * Adds the socket event listeners.
     */
    #addSocketEventListeners () {
      this.#socket.addEventListener('open', () => this.#handleSocketOpen(),
        { signal: this.#socketAbortController.signal })

      this.#socket.addEventListener('error', () => this.#handleSocketError(),
        { signal: this.#socketAbortController.signal })

      this.#socket.addEventListener('message', (event) => this.#handleSocketMessage(event.data),
        { signal: this.#socketAbortController.signal })
    }

    /**
     * Handles the socket open event.
     */
    #handleSocketOpen () {
      this.shadowRoot.querySelector('my-chat-form').removeAttribute('disabled')
      this.shadowRoot.querySelector('#status #connected').classList.remove('hidden')
      this.shadowRoot.querySelector('#status #connection-error').classList.add('hidden')

      clearInterval(this.#reconnectIntervalID)
    }

    /**
     * Handles the socket error event.
     */
    #handleSocketError () {
      this.shadowRoot.querySelector('my-chat-form').setAttribute('disabled', '')
      this.shadowRoot.querySelector('#status #connected').classList.add('hidden')
      this.shadowRoot.querySelector('#status #connection-error').classList.remove('hidden')

      // Prevent dublicate interals
      clearInterval(this.#reconnectIntervalID)

      this.#reconnectIntervalID = setInterval(() => {
        this.#socket.close()
        if (this.#socket.readyState === 3) {
          // Abort old socket event listeners
          this.#socketAbortController.abort()

          this.#socket = new WebSocket(SOCKET_URL)

          this.#addSocketEventListeners()
        }
      }, RECONNECT_INTERVAL_MS)
    }

    /**
     * Handles recieving a message.
     *
     * @param {string} recievedData - The recieved data.
     */
    #handleSocketMessage (recievedData) {
      const data = JSON.parse(recievedData)

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
    }

    /**
     * Handles the username form submit.
     *
     * @param {string} username - The username.
     */
    #handleUsernameFormSubmit (username) {
      this.#username = username

      this.shadowRoot.querySelector('#username-form').classList.add('hidden')

      localStorage.setItem('my-chat-app_username', this.#username)
    }

    /**
     * Handles the chat form submit.
     *
     * @param {string} message - The message.
     */
    #handleChatFormSubmit (message) {
      this.#socket.send(JSON.stringify({
        type: 'message',
        data: message,
        username: this.#username,
        channel: this.#channel,
        key: API_KEY
      }))
    }

    /**
     * Handles the add channel form submit.
     */
    #handleAddChannelFormSubmit () {
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
    }

    /**
     * Adds a channel to the UI.
     *
     * @param {string} channelName - The name of the channel.
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
     * Selects a channel in the chat.
     *
     * @param {string} channel - The channel.
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
