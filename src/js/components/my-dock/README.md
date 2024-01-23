# &lt;my-dock&gt;
The dock component. This component is meant to be used as a container for dock buttons.

## Events
### `my-dock:app-launch`
This event is fired when a dock button is clicked. The event detail contains the name and title of the app to launch.

## Example
```html
<my-dock>
  <button title="Memory game" data-app="my-memory-game-app">🎮</button>
  <button title="Chat" data-app="my-chat-app">💬</button>
</my-dock>
```
