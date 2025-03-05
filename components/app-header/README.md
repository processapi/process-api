# App Header Component

The `app-header` component is a custom HTML element that serves as the header for your application. It includes built-in event handling and navigation functionality.

## Usage

To use the `app-header` component in your project, follow these steps:

1. Import the `app-header` component in your HTML or JavaScript file.
2. Add the `app-header` element to your HTML.

### Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Header Example</title>
    <script type="module" src="./components/app-header/app-header.js"></script>
</head>
<body>
    <app-header></app-header>
</body>
</html>
```

In this example, the `app-header` component is included in the HTML file and will be displayed as the header of the page.

## Methods

The `app-header` component includes the following methods:

- `home()`: Navigates to the home page.

## Events

The `app-header` component handles pointer events such as clicks. You can add custom actions by defining data attributes on elements within the header.

### Example

```html
<app-header>
    <h1>App Header</h1>
</app-header>
```

In this example, the heading "App Header" will be displayed as the main content of the header.

## Slots

The `app-header` component supports `prefix` and `suffix` slots for adding custom content before and after the main header content.

### Example

```html
<app-header>
    <div slot="prefix">Prefix Content</div>
    <h1>App Header</h1>
    <div slot="suffix">Suffix Content</div>
</app-header>
```

In this example, "Prefix Content" will be displayed before the main header content, and "Suffix Content" will be displayed after the main header content.
