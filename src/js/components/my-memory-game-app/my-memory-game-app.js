/**
 * The my-memory-game-app web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

import '../my-memory-game'

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

<div id="choose-board-size">
  Choose board size here.
  <button data-board-size="small">Small</button>
  <button data-board-size="medium">Medium</button>
  <button data-board-size="large">Large</button>
</div>

<div id="active-game" class="hidden">
  Attempts: <span id="attempts"></span>
  <my-memory-game boardsize="small"></my-memory-game>
</div>

<div id="game-over" class="hidden">
  Game over.
  <button id="play-again">Play again</button>
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
    #attempts = 0

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
      this.shadowRoot
        .querySelectorAll('#choose-board-size button')
        .forEach((button) => {
          button.addEventListener('click', (event) => {
            const boardSize = event.target.getAttribute('data-board-size')

            this.shadowRoot
              .querySelector('#choose-board-size')
              .classList.add('hidden')
            this.shadowRoot
              .querySelector('#active-game')
              .classList.remove('hidden')
            this.shadowRoot
              .querySelector('my-memory-game')
              .setAttribute('boardsize', '')
            this.shadowRoot
              .querySelector('my-memory-game')
              .setAttribute('boardsize', boardSize)
          })
        })

      this.shadowRoot
        .querySelector('my-memory-game')
        .addEventListener('memory-game:tiles-match', (event) => {
          this.#attempts++
          this.shadowRoot.querySelector('#attempts').textContent =
            this.#attempts
        })

      this.shadowRoot
        .querySelector('my-memory-game')
        .addEventListener('memory-game:tiles-mismatch', (event) => {
          this.#attempts++
          this.shadowRoot.querySelector('#attempts').textContent =
            this.#attempts
        })

      this.shadowRoot
        .querySelector('my-memory-game')
        .addEventListener('memory-game:game-over', (event) => {
          setTimeout(() => {
            this.shadowRoot
              .querySelector('#active-game')
              .classList.add('hidden')
            this.shadowRoot
              .querySelector('#game-over')
              .classList.remove('hidden')
          }, 1000)
        })

      this.shadowRoot
        .querySelector('#play-again')
        .addEventListener('click', (event) => {
          this.shadowRoot
            .querySelector('#choose-board-size')
            .classList.remove('hidden')
          this.shadowRoot.querySelector('#game-over').classList.add('hidden')

          this.#attempts = 0
          this.shadowRoot.querySelector('#attempts').textContent =
            this.#attempts
        })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {}
  }
)
