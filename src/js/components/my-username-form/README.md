# &lt;my-username-form&gt;

A component consisting of a text input and a submit button used to submit a username.

## Attributes

### `username`
Attribute to set a prefilled username.

## Events

### `my-username-form:answer`

An event that is emitted when the username is submitted. The event detail is an object with a `username` property. Example:

```js
{
  username: 'John'
}
```

## Example

```js
const usernameForm = document.createElement('username-form')
usernameform.setAttribute('username', 'John')

Or

```html
<username-form username="John"></username-form>
```
