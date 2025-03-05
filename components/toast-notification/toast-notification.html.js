export const HTML = `
<link rel="stylesheet" href="__css__" />

<template id="info-toast">
  <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <material-icon icon="info" class="info"></material-icon>
    <p class="message">This is an info toast.</p>
    <svg class="icon close" role="button" aria-label="Close"><use xlink:href="#icon-close"></use></svg>
  </div>
</template>

<template id="error-toast">
  <div class="toast toast-error" role="alert" aria-live="assertive" aria-atomic="true">
    <material-icon icon="error_outline" class="error"></material-icon>
    <p class="message">This is an error toast.</p>
    <svg class="icon close" role="button" aria-label="Close"><use xlink:href="#icon-close"></use></svg>
  </div>
</template>

<template id="success-toast">
  <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <material-icon icon="check" class="success"></material-icon>
    <p class="message">This is a success toast.</p>
    <svg class="icon close" role="button" aria-label="Close"><use xlink:href="#icon-close"></use></svg>
  </div>
</template>

<template id="warning-toast">
  <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <material-icon icon="warning" class="warning"></material-icon>
    <p class="message">This is a warning toast.</p>
    <svg class="icon close" role="button" aria-label="Close"><use xlink:href="#icon-close"></use></svg>
  </div>
</template>

<div class="toast-container"></div>
`.replace("__css__", import.meta.url.replace(".html.js", ".css"));
