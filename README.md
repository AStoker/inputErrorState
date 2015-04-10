# inputErrorState
A Knockout binding to use on inputs (or input like elements) to display an error state and include messages describing the error.  

## Options:
#### Array:
* `array`:
  * An array of error messages to display to the user, where the message is contained within the `Message` property on the object.
  * If `messages` array is empty, then there is no error state, and the error indicator will be hidden.

#### Object:
* `messages`: array _(optional)_  
  * Contains an array of objects containing the error message to display to the user, where the message is contained within the `Message` property on the object.
  * If `messages` array is empty, then there is no error state, and the error indicator will be hidden.
  * _If not provided, then there will be no additional messages displayed when the user focuses on the element._ 
* `focusElement`: string|selector _(optional)_  
  * A string which is the selector for an element. This element will be used to listen to a focus state, indicating to the error message element to display the errors to the user.
  * _If not provided, the default `focusElement` is the element which is using the binding._  


## Example:
###### Javascript
```javascript
var options = {
		messages: [
			{Message: 'Is Required'},
			{Message: 'Invalid Value'}
		],
		focusElement: $('#InputErrorStateTest')	
	}, 
	errors = [
		{Message: 'Is Required'},
		{Message: 'Invalid Value'}
	];
```
###### HTML
```html
<input id="InputErrorStateTest" data-bind="inputErrorState: options"/>
<input id="InputErrorStateTest2" data-bind="inputErrorState: errors"/>
```

## Quirks:
*  Whatever element used for this binding, it must be contained within an element that will allow an absolutely positioned element (the error indicator) to be placed at the bottom right. Using a container that is `position: relative` will accomplish this.