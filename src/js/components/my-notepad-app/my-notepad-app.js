/**
 * The my-notepad-app web component module.
 *
 * @author Mohammed Chammam <mc223gr@student.lnu.se>
 * @version 1.0.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  .hidden {
      display: none!important;
    }
  :host {
    display: flex;
    flex-direction: column;
  }
</style>

<div id="controls">
  <button id="open">Open</button>
  <button id="save">Save</button>

</div>
<textarea></textarea>
`
customElements.define(
  'my-notepad-app',
  /**
   * Represents a my-notepad-app element.
   */
  class extends HTMLElement {
    /**
     * Make it possible to remove the event listeners.
     *
     * @type {AbortController}
     */
    #abortController = new AbortController()

    #fileHandle

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
      this.shadowRoot.querySelector('#open').addEventListener('click', async () => {
        [this.#fileHandle] = await window.showOpenFilePicker()
        const file = await this.#fileHandle.getFile()

        this.shadowRoot.querySelector('textarea').value = await file.text()
      })

      this.shadowRoot.querySelector('#save').addEventListener('click', async () => {
        const writableStream = await this.#fileHandle.createWritable()

        await writableStream.write(this.shadowRoot.querySelector('textarea').value)

        await writableStream.close()
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
