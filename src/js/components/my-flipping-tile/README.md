# &lt;my-flipping-tile&gt;

A web component that represents a flipping tile.

## Attributes

### `disabled`

A boolean attribute which, if present, indicates that the user should not be able to interact with the element.

Default value: undefined

### `face-up`

A boolean attribute which, if present, renders the element faced up, showing its front.

Default value: undefined

### `hidden`

A boolean attribute which, if present, hides the inner of the element and renders an outline.

Default value: undefined

## Events

| Event Name | Fired When           |
| ---------- | -------------------- |
| `my-flipping-tile:flip` | The tile is flipped. |

## Styling with CSS

The main element (button) is styleable using the part `tile-main`.

The front element (div) is styleable using the part `tile-front`.

The back element (div) is styleable using the part `tile-back`.

## Example

```html
<my-flipping-tile face-up>
    <img src="./images/2.png" alt="phonograph" />
</my-flipping-tile>
```

![Example](./images/flipping-tile.gif)
