export const cssTemplate = document.createElement('template')

cssTemplate.innerHTML = `
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
`
