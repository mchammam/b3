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
  .hidden {
    display: none;
  }
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
  }
  .current-player {
    font-weight: bold;
    color: #d97706;
  }
</style>

  <h3>High scores</h3>
  <p id="no-high-scores-message" class="hidden">No high scores to show.</p>
  <ol id="high-scores">
    <!-- Here will be inserted high scores. -->
  </ol>
`
const highScoreListItemTemplate = document.createElement('template')
highScoreListItemTemplate.innerHTML = `
<li>
  <p>
    <span class="nickname"><!-- Nickname here --></span>
    <span class="score"><!-- Score here --></span>
  </p>
</li>
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
     * @returns {HTMLElement} - the high-score element itself.
     */
    setHighscores (highScores) {
      if (highScores.length === 0) {
        this.shadowRoot.querySelector('#no-high-scores-message').classList.remove('hidden')
        return this
      }

      this.shadowRoot.querySelector('#high-scores').replaceChildren(
        ...highScores.map(this.#createHighscoreListItem)
      )

      return this
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
      const li = highScoreListItemTemplate.content.cloneNode(true)

      li.querySelector('.nickname').textContent = nickname
      li.querySelector('.score').textContent = `- ${score}s`
      isCurrentPlayer && li.querySelector('li').classList.add('current-player')

      return li
    }
  }
)
