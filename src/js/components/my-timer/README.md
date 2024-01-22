# &lt;my-timer&gt;

A timer component.

## Attributes

### `stopped`

Boolean attribute that stops the timer. If stopped once the timer will not be able to resume.

## Events

### `my-timer:tick`
Emitted every second. The event detail is an object with a `time` property. Example:

```js
{
  time: 19
}
```

## Example

### HTML

```html
<!-- A timer set to be counting down from 20 seconds -->
<my-timer></my-timer>

<!-- A stopped timer -->
<my-timer stopped></my-timer>
```