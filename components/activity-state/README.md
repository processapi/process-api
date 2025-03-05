# ActivityState Component

The `ActivityState` component is a custom HTML element that represents the state of an activity. It can display different states such as `busy`, `success`, and `error`.

## Usage

### Importing the Component

To use the `ActivityState` component, you need to import it into your project:

```javascript
import './components/activity-state/activity-state.js';
```

### Adding the Component to Your HTML

You can add the `ActivityState` component to your HTML as follows:

```html
<activity-state></activity-state>
```

### Setting the State

You can set the state of the `ActivityState` component using JavaScript:

```javascript
const activityStateElement = document.querySelector('activity-state');
activityStateElement.setState('busy'); // Sets the state to 'busy'
activityStateElement.setState('success'); // Sets the state to 'success'
activityStateElement.setState('error'); // Sets the state to 'error'
```

## States

The `ActivityState` component supports the following states:

- `busy`: Indicates that the activity is in progress.
- `success`: Indicates that the activity was successful.
- `error`: Indicates that there was an error in the activity.

## Accessibility

The `ActivityState` component uses ARIA attributes to ensure accessibility:

- `role="status"`: Indicates the live region where updates are announced.
- `aria-live="polite"`: Ensures updates are announced politely.

## Example

Here is a complete example of how to use the `ActivityState` component:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ActivityState Example</title>
    <script type="module" src="./components/activity-state/activity-state.js"></script>
</head>
<body>
    <activity-state id="activityState"></activity-state>

    <script>
        const activityStateElement = document.getElementById('activityState');
        
        // Set the state to 'busy'
        activityStateElement.setState('busy');

        // Simulate an activity completion
        setTimeout(() => {
            activityStateElement.setState('success');
        }, 3000);
    </script>
</body>
</html>
```

In this example, the `ActivityState` component is initially set to the `busy` state. After 3 seconds, the state is changed to `success`.
