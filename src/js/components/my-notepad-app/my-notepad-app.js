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
    gap: 0.5rem;
    height: 25rem;
    width: 35rem;
  }
  textarea {
    flex: 1;
    background: transparent;
    border-radius: 0.4rem 0 0 0.4rem;
    border: 2px solid #4b5563;
    color: #E5E7EB;
  }
  button {
    padding: 0.1rem 0.3rem;
    height: 1.75rem;
    width: 1.75rem;
    background: transparent;
    border-radius: 0.4rem;
    border: 2px solid #4b5563;
    color: #E5E7EB;
    cursor: pointer;
    transition: all 150ms;
  }
  button:hover{
    border-color: #111827;
    background: #111827;
    box-shadow: 0 3px 10px rgba(22, 25, 32, 0.25);
  }
  #cut {
    margin-left: 0.5rem;
  }
</style>

<div id="controls">
  <button title="New" id="new">🗎</button>
  <button title="Open" id="open">📂</button>
  <button title="Save" id="save">💾</button>
  <button title="Cut" id="cut">✂️</button>
  <button title="Copy" id="copy">📑</button>
  <button title="Paste" id="paste">📋</button>



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

    /**
     * The actual file handle.
     *
     * @type {FileSystemFileHandle}
     */
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
      this.shadowRoot.querySelector('#new').addEventListener('click', () => this.#handleNewFileButtonClick(),
        { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('#open').addEventListener('click', () => this.#handleOpenFileButtonClick(),
        { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('#save').addEventListener('click', () => this.#handleSaveFileButtonClick(),
        { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('#cut').addEventListener('click', () => this.#handleCutButtonClick(),
        { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('#copy').addEventListener('click', () => this.#handleCopyButtonClick(),
        { signal: this.#abortController.signal })

      this.shadowRoot.querySelector('#paste').addEventListener('click', () => this.#handlePasteButtonClick(),
        { signal: this.#abortController.signal })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.#abortController.abort()
    }

    /**
     * Handles the new file button click.
     */
    #handleNewFileButtonClick () {
      this.#fileHandle = null
      this.shadowRoot.querySelector('textarea').value = ''
    }

    /**
     * Handles the open file button click.
     */
    async #handleOpenFileButtonClick () {
      try {
        [this.#fileHandle] = await window.showOpenFilePicker()
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }
      }
      const file = await this.#fileHandle.getFile()

      this.shadowRoot.querySelector('textarea').value = await file.text()
    }

    /**
     * Handles the save file button click.
     */
    async #handleSaveFileButtonClick () {
      if (!this.#fileHandle) {
        try {
          this.#fileHandle = await window.showSaveFilePicker()
        } catch (error) {
          if (error.name === 'AbortError') {
            return
          }
        }
      }

      const writableStream = await this.#fileHandle.createWritable()

      await writableStream.write(this.shadowRoot.querySelector('textarea').value)

      await writableStream.close()
    }

    /**
     * Handles the cut button click.
     */
    #handleCutButtonClick () {
      const textarea = this.shadowRoot.querySelector('textarea')
      const selectionStart = textarea.selectionStart
      const selectionEnd = textarea.selectionEnd
      const selectedText = textarea.value.substring(selectionStart, selectionEnd)

      textarea.value = textarea.value.substring(0, selectionStart) + textarea.value.substring(selectionEnd)

      textarea.focus()
      textarea.selectionEnd = selectionStart

      navigator.clipboard.writeText(selectedText)
    }

    /**
     * Handles the copy button click.
     */
    #handleCopyButtonClick () {
      const textarea = this.shadowRoot.querySelector('textarea')
      const selectionStart = textarea.selectionStart
      const selectionEnd = textarea.selectionEnd

      const selectedText = textarea.value.substring(selectionStart, selectionEnd)

      textarea.focus()
      textarea.selectionEnd = selectionEnd
      textarea.selectionStart = selectionStart

      navigator.clipboard.writeText(selectedText)
    }

    /**
     * Handles the paste button click.
     */
    async #handlePasteButtonClick () {
      const textToPaste = await navigator.clipboard.readText()

      const textarea = this.shadowRoot.querySelector('textarea')
      const valueBeforeSelection = textarea.value.substring(0, textarea.selectionStart)
      const valueAfterSelection = textarea.value.substring(textarea.selectionEnd, textarea.value.length)

      textarea.value = valueBeforeSelection + textToPaste + valueAfterSelection

      textarea.focus()
      textarea.selectionEnd = valueBeforeSelection.length + textToPaste.length
    }
  }
)
