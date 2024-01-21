/**
 * The my-memory-game-app web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

import '../my-memory-game'
import '../my-timer'
import '../my-memory-game-start-form'
import '../my-memory-game-high-score'

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .hidden {
      display: none!important;
    }
    .score-bar {
      display: flex;
      justify-content: space-between;
      margin: 0 0 1rem 0;
      font-size: 0.75rem;
    }
    :host {
      display:grid;
    }
    #active-game {
      grid-area: 1 / 1;
    }
    #game-over {
      display: flex;
      flex-direction: column;
      grid-area: 1 / 1;
      margin: -1rem;
      padding: 1rem;
      background-color: #374151e5;
      text-align: center;
      z-index: 1;
    }
    #game-over-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
    button {
      padding: 0.75rem 1.3rem;
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

<div id="choose-board-size">
  <my-memory-game-start-form></my-memory-game-start-form>
</div>

<div id="active-game" class="hidden">
  <div class="score-bar">
    <div><span id="attempts">0</span> attempts</div>
    <div>Time: <span id="time"></span>s</div>
  </div>
  <my-memory-game boardsize="small"></my-memory-game>
</div>

<div id="game-over" class="hidden">
  <div class="score-bar">
    <div><span id="final-attempts">0</span> attempts</div>
    <div>Time: <span id="final-time"></span>s</div>
  </div>
  <div id="game-over-container">
    <p>Good job, <span id="nickname"></span>!</p>
    <my-memory-game-high-score></my-memory-game-high-score>
    <p>Can you do better?</p>
    <button id="play-again">Play again</button>
  </div>
</div>
`

/*
 * Define custom element.
 */
customElements.define(
  'my-memory-game-app',
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

    /**
     * Number of attempts made by the player.
     *
     * @type {number}
     */
    #attempts = 0

    #nickname

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

      this.shadowRoot
        .querySelector('my-memory-game-start-form')
        .setAttribute(
          'nickname',
          localStorage.getItem('my-memory-game-app_nickname') ?? ''
        )
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.shadowRoot
        .querySelector('my-memory-game-start-form')
        .addEventListener(
          'my-memory-game-start-form:submit',
          (event) => {
            const nickname = event.detail.nickname
            const boardSize = event.detail.boardSize

            this.shadowRoot
              .querySelector('#choose-board-size')
              .classList.add('hidden')
            this.shadowRoot
              .querySelector('#active-game')
              .classList.remove('hidden')
            this.shadowRoot
              .querySelector('my-memory-game')
              .removeAttribute('boardsize')
            this.shadowRoot
              .querySelector('my-memory-game')
              .setAttribute('boardsize', boardSize)

            this.shadowRoot
              .querySelector('#time')
              .replaceChildren(document.createElement('my-timer'))

            this.#nickname = nickname
            localStorage.setItem('my-memory-game-app_nickname', nickname)
          },
          { signal: this.#abortController.signal }
        )

      this.shadowRoot.querySelector('my-memory-game').addEventListener(
        'memory-game:tiles-match',
        (event) => {
          this.#attempts++
          this.shadowRoot.querySelector('#attempts').textContent =
            this.#attempts
        },
        { signal: this.#abortController.signal }
      )

      this.shadowRoot
        .querySelector('my-memory-game')
        .addEventListener('memory-game:tiles-mismatch', (event) => {
          this.#attempts++
          this.shadowRoot.querySelector('#attempts').textContent =
            this.#attempts
        })

      this.shadowRoot.querySelector('my-memory-game').addEventListener(
        'memory-game:game-over',
        (event) => {
          this.shadowRoot.querySelector('my-timer').setAttribute('stopped', '')

          this.shadowRoot
            .querySelector('#game-over')
            .classList.remove('hidden')

          this.shadowRoot.querySelector('#final-attempts').textContent = this.#attempts
          this.shadowRoot.querySelector('#final-time').replaceChildren(this.shadowRoot.querySelector('my-timer'))
          this.shadowRoot.querySelector('#nickname').textContent = this.#nickname

          // high scores
          const highscores =
            JSON.parse(localStorage.getItem('my-memory-game-app_highscores')) ?? {}

          const thisBoardSizeHighscores = highscores[this.shadowRoot.querySelector('my-memory-game').getAttribute('boardSize')] ?? []
          thisBoardSizeHighscores.push({
            nickname: this.#nickname,
            score: this.#attempts,
            isCurrentPlayer: true
          })

          thisBoardSizeHighscores.sort((a, b) => a.score - b.score).splice(5)

          highscores[this.shadowRoot.querySelector('my-memory-game').getAttribute('boardSize')] = thisBoardSizeHighscores.map((highscore) => ({
            nickname: highscore.nickname,
            score: highscore.score
          }))

          localStorage.setItem('my-memory-game-app_highscores', JSON.stringify(highscores))

          this.shadowRoot
            .querySelector('my-memory-game-high-score')
            .setHighscores(thisBoardSizeHighscores)
        },
        { signal: this.#abortController.signal }
      )

      this.shadowRoot.querySelector('#play-again').addEventListener(
        'click',
        (event) => {
          this.shadowRoot.querySelector('#choose-board-size').classList.remove('hidden')
          this.shadowRoot.querySelector('#active-game').classList.add('hidden')
          this.shadowRoot.querySelector('#game-over').classList.add('hidden')

          this.#attempts = 0
          this.shadowRoot.querySelector('#attempts').textContent = this.#attempts
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
