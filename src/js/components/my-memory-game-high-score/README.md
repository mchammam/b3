# &lt;my-memory-game-high-score&gt;

A web component that displays a list of high scores, if current player result is within the highscores it will be highlighted. High scores and nicknames are set using `setHighscores` method.

## Methods

### `setHighscores`

A public method that takes an array of objects with `nickname` and `score` properties and displays them in the order of the array. If the highscore belongs to the current player, an additional property `isCurrentPlayer` is added to the object with the value `true`.

## Example

```js
const highscore = document.createElement('my-memory-game-high-score')

highscore.setHighscores([
  { nickname: 'Jack', score: 4 },
  { nickname: 'John', score: 3 },
  { nickname: 'Jane', score: 2, isCurrentPlayer: true }
])
```