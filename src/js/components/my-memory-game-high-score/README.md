# &lt;my-memory-game-high-score&gt;

A web component that dislays the current player result and a list of high scores together with nicknames. The current player result are set using `setCurrentPlayerResult` method. High scores and nicknames are set using `setHighscores` method.

## Methods

### `setCurrentPlayerResult`

A public method that takes an object with `nickname` and `isWinner` properties and displays it as the current player result.

This method returns the element itself.

### `setHighscores`

A public method that takes an array of objects with `nickname` and `score` properties and displays them in the component. The array should be ordered before this method is called. If the highscore belongs to the current player, an additional property `isCurrentPlayer` is added to the object with the value `true`.

This method returns the element itself.

## Example

```js
const highscore = document.createElement('my-memory-game-high-score')

highscore.setCurrentPlayerResult({ nickname: 'Jane', isWinner: true })

highscore.setHighscores([
  { nickname: 'Jack', score: 4 },
  { nickname: 'John', score: 3 },
  { nickname: 'Jane', score: 2, isCurrentPlayer: true }
])
```
