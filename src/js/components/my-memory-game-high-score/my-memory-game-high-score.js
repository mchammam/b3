/**
 * The my-memory-game-high-score web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  h3 {
    margin-top: 2rem;
    text-align: center;
  }
  ol {
    margin-bottom: 2rem;
    margin-right: 1rem;
  }
  li p {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .current-player {
    font-weight: bold;
    color: #d97706;
  }
</style>

<h3>High scores</h3>
<ol id="high-scores">
</ol>

<template id="highscore-li">
  <li>
    <p>
      <span class="nickname"></span>
      <span class="score"></span>
    </p>
  </li>
</template>
`

customElements.define(
  'my-memory-game-high-score',
  /**
   * Represents a my-memory-game-high-score element.
   */
  class extends HTMLElement {
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
     * Public method to set high scores.
     *
     * @param {object[]} highScores - The high scores array.
     * @param {string} highScores[].nickname - Player nickname.
     * @param {number} highScores[].score - Player score.
     * @param {boolean} highScores[].isCurrentPlayer - True if the score belongs to the current player.
     */
    setHighscores (highScores) {
      this.shadowRoot.querySelector('#high-scores').replaceChildren(
        ...highScores.map(this.#createHighscoreListItem.bind(this))
      )
    }

    /**
     * Method to create a high score list item.
     *
     * @param {object} highScore - The high score object.
     * @param {string} highScore.nickname - Player nickname.
     * @param {number} highScore.score - Player score.
     * @param {boolean} highScore.isCurrentPlayer - True if the score belongs to the current player.
     * @returns {HTMLLIElement} - List element presenting the high score.
     */
    #createHighscoreListItem ({ nickname, score, isCurrentPlayer }) {
      const li = this.shadowRoot.querySelector('template#highscore-li').content.cloneNode(true)

      li.querySelector('.nickname').textContent = nickname
      li.querySelector('.score').textContent = `- ${score}`
      isCurrentPlayer && li.querySelector('li').classList.add('current-player')

      return li
    }
  }
)
