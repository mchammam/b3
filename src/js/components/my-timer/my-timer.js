/**
 * The my-timer web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

// ------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------
const TIMER_INTERVAL_MS = 1000

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<span id="time"></span>
`
customElements.define(
  'my-timer',
  /**
   * Represents a countdown-timer element.
   */
  class extends HTMLElement {
    /**
     * The time in seconds.
     *
     * @type {number}
     */
    #time = 0

    /**
     * The timeout used for the timer.
     *
     * @type {number}
     */
    #timeoutID

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
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['stopped']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'stopped') {
        this.#stopTimer()
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      if (this.hasAttribute('stopped')) {
        return
      }

      this.#startTimer()
    }

    /**
     * Starts the timer.
     */
    #startTimer () {
      this.#render()

      if (this.#timeoutID) {
        return
      }

      // Self-adjusting timer.
      // Thanks Mats Loock for the idea! 😎
      // Inspiration taken from https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript

      const expectedTimeOnNextIteration = Date.now() + TIMER_INTERVAL_MS
      this.#timeoutID = setTimeout(this.#timerStep.bind(this), TIMER_INTERVAL_MS, expectedTimeOnNextIteration)
    }

    /**
     * Timer step method called recursively.
     *
     * @param {number} expectedTimeNow - Expected time when this iteration runs.
     */
    #timerStep (expectedTimeNow) {
      this.#time++
      this.#render()

      const expectedTimeOnNextIteration = expectedTimeNow + TIMER_INTERVAL_MS

      const difference = Date.now() - expectedTimeNow
      const correctedInterval = Math.max(0, TIMER_INTERVAL_MS - difference)

      this.#timeoutID = setTimeout(this.#timerStep.bind(this), correctedInterval, expectedTimeOnNextIteration)
    }

    /**
     * Method to stop the timer.
     */
    #stopTimer () {
      clearTimeout(this.#timeoutID)
      this.#timeoutID = null

      this.dispatchEvent(
        new CustomEvent('my-timer:stop', { detail: { time: this.#time } })
      )
    }

    /**
     * Render method, updates the shadowDOM.
     */
    #render () {
      this.shadowRoot.querySelector('#time').textContent = this.#time
    }
  }
)
