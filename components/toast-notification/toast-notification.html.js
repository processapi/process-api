export const HTML = `
<link rel="stylesheet" href="__css__" />
<svg class="hidden">
  <symbol id="icon-info" viewBox="0 0 24 24">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
  </symbol>
  <symbol id="icon-error" viewBox="0 0 24 24">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
  </symbol>
  <symbol id="icon-success" viewBox="0 0 24 24">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
  </symbol>
  <symbol id="icon-warning" viewBox="0 0 24 24">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg>
  </symbol>
  <symbol id="icon-close" viewBox="0 0 24 24">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
  </symbol>
</svg>

<template id="info-toast">
  <div class="toast">
    <material-icon icon="info" class="info"></material-icon>
    <p class="message">This is an info toast.</p>
    <svg class="icon close"><use xlink:href="#icon-close"></use></svg>
  </div>
</template>

<template id="error-toast">
  <div class="toast toast-error">
    <material-icon icon="error_outline" class="error"></material-icon>
    <p class="message">This is an error toast.</p>
    <svg class="icon close"><use xlink:href="#icon-close"></use></svg>
  </div>
</template>

<template id="success-toast">
  <div class="toast">
    <material-icon icon="check" class="success"></material-icon>
    <p class="message">This is a success toast.</p>
    <svg class="icon close"><use xlink:href="#icon-close"></use></svg>
  </div>
</template>

<template id="warning-toast">
  <div class="toast">
    <material-icon icon="warning" class="warning"></material-icon>
    <p class="message">This is a warning toast.</p>
    <svg class="icon close"><use xlink:href="#icon-close"></use></svg>
  </div>
</template>

<div class="toast-container"></div>
`.replace("__css__", import.meta.url.replace(".html.js", ".css"));
