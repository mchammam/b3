# &lt;my-memory-game-start-form&gt;

A component consisting of a text input for nickname and three buttons to choose board size.

## Attributes

### `nickname`
Attribute to set a prefilled nickname.

## Events

### `my-memory-game-start-form:submit`
An event that is emitted when the form is submitted. The event detail is an object with a `nickname` and `boardSize` properties. Example:

```js
{
  nickname: 'John',
  boardSize: 'medium'
}
```

## Example
```html
<my-memory-game-start-form nickname="John"></my-memory-game-start-form>
```
