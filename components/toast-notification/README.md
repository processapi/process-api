# Toast Notification Component

The `toast-notification` component is a custom web component for displaying toast notifications. It supports different types of toasts such as informational, success, warning, and error messages. The component is designed to work in both light and dark modes and is accessible.

## Usage

### Installation

Include the `toast-notification` component in your HTML:

```html
<script type="module" src="./components/toast-notification/toast-notification.js"></script>
```

### Adding the Component

Add the `toast-notification` element to your HTML:

```html
<toast-notification></toast-notification>
```

### Displaying Toasts

Use the global `toastNotification` object to display different types of toasts:

```javascript
toastNotification.info("This is an informational message.");
toastNotification.success("This is a success message.");
toastNotification.warning("This is a warning message.");
toastNotification.error("This is an error message.");
```

## Attributes

- `duration`: The duration (in milliseconds) for which the toast is displayed. Default is `3000`.

## Accessibility

The component uses ARIA roles and properties to ensure accessibility:
- Each toast has `role="alert"`, `aria-live="assertive"`, and `aria-atomic="true"` to notify screen readers.
- The close button has `role="button"` and `aria-label="Close"`.

## CSS Variables

The component uses the following CSS variables for styling:

- `--padding`
- `--border`
- `--border-radius`
- `--drop-shadow`
- `--cl-background-light2`
- `--color-text`
- `--cl-progress`
- `--cl-invalid`
- `--cl-valid`
- `--cl-danger`

These variables can be customized in your global CSS to match your design system.

## License

This project is licensed under the MIT License.
