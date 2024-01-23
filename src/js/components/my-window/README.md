# &lt;my-window&gt;
The window component.

## Attributes
### `title`
The title of the window.

## Events
### `my-window:focus`
This event is fired when the window is focused.

### `my-window:move`
This event is fired when the window is moved. The event detail contains the new position of the window. Example:

```js
{
  top: 100,
  left: 10
}
```

## Example

```html
<my-window title="Window Title"></my-window>
```
