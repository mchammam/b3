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

// ------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------
const MAX_NUMBER_OF_HIGH_SCORESS = 5

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
  #game-board-container {
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

<my-memory-game-start-form></my-memory-game-start-form>

<div id="game-board-container" class="hidden">
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
     * Used to remove the event listeners on component disconnect.
     *
     * @type {AbortController}
     */
    #abortController = new AbortController()

    /**
     * The player nickname.
     *
     * @type {string}
     */
    #nickname

    /**
     * Number of attempts made by the player.
     *
     * @type {number}
     */
    #attempts = 0

    /**
     * Time elapsed during game round.
     *
     * @type {number}
     */
    #time = 0

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
        .setAttribute('nickname',
          localStorage.getItem('my-memory-game-app_nickname') ?? ''
        )
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.shadowRoot.querySelector('my-memory-game-start-form')
        .addEventListener('my-memory-game-start-form:submit', (event) => {
          const nickname = event.detail.nickname
          const boardSize = event.detail.boardSize

          this.#handleStartFormSubmit(nickname, boardSize)
        }, { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('my-memory-game')
        .addEventListener('memory-game:tiles-match', () => this.#incrementAttempts(),
          { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('my-memory-game')
        .addEventListener('memory-game:tiles-mismatch', () => this.#incrementAttempts(),
          { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('my-memory-game')
        .addEventListener('memory-game:game-over', () => this.#handleGameOver(),
          { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('#play-again').addEventListener('click',
        () => this.#playAgain(),
        { signal: this.#abortController.signal })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.#abortController.abort()
    }

    /**
     * Handles the start form submit event and starts the game.
     *
     * @param {string} nickname - The player nickname.
     * @param {'small'|'medium'|'large'} boardSize - The board size.
     */
    #handleStartFormSubmit (nickname, boardSize) {
      this.#nickname = nickname
      localStorage.setItem('my-memory-game-app_nickname', nickname)

      this.#attempts = 0
      this.shadowRoot.querySelector('#attempts').textContent = this.#attempts

      this.#time = 0
      this.shadowRoot.querySelector('#time').replaceChildren(document.createElement('my-timer'))
      this.shadowRoot.querySelector('my-timer').addEventListener('my-timer:tick', (event) => {
        this.#time = event.detail.time
      }, { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('my-memory-game-start-form').classList.add('hidden')
      this.shadowRoot.querySelector('#game-board-container').classList.remove('hidden')
      this.shadowRoot.querySelector('my-memory-game').removeAttribute('boardsize')
      this.shadowRoot.querySelector('my-memory-game').setAttribute('boardsize', boardSize)
    }

    /**
     * Method to increment number of attempts.
     */
    #incrementAttempts () {
      this.#attempts++
      this.shadowRoot.querySelector('#attempts').textContent = this.#attempts
    }

    /**
     * Handle game over.
     */
    #handleGameOver () {
      this.shadowRoot.querySelector('#nickname').textContent = this.#nickname
      this.shadowRoot.querySelector('#final-attempts').textContent = this.#attempts
      this.shadowRoot.querySelector('#final-time').textContent = this.#time

      this.shadowRoot.querySelector('my-timer').setAttribute('stopped', '')

      const highscores = JSON.parse(localStorage.getItem('my-memory-game-app_highscores')) ?? {}
      const boardSize = this.shadowRoot.querySelector('my-memory-game').getAttribute('boardSize')

      const thisBoardSizeHighscores = highscores[boardSize] ?? []
      thisBoardSizeHighscores.push({
        nickname: this.#nickname,
        score: this.#time,
        isCurrentPlayer: true
      })

      thisBoardSizeHighscores.sort((a, b) => a.score - b.score).splice(MAX_NUMBER_OF_HIGH_SCORESS)

      highscores[boardSize] = thisBoardSizeHighscores.map((highscore) => ({
        nickname: highscore.nickname,
        score: highscore.score
      }))

      localStorage.setItem('my-memory-game-app_highscores', JSON.stringify(highscores))

      this.shadowRoot.querySelector('my-memory-game-high-score').setHighscores(
        thisBoardSizeHighscores.map((highscore) => ({
          ...highscore,
          score: `${highscore.score}s`
        }))
      )

      this.shadowRoot.querySelector('#game-over').classList.remove('hidden')
    }

    /**
     * Restart the game.
     */
    #playAgain () {
      this.shadowRoot.querySelector('my-memory-game-start-form').classList.remove('hidden')
      this.shadowRoot.querySelector('#game-board-container').classList.add('hidden')
      this.shadowRoot.querySelector('#game-over').classList.add('hidden')
    }
  }
)
