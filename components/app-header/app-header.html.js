
export const HTML = `
<link rel="stylesheet" href="__css__">
<slot name="prefix"></slot>

<button class="icon-button" data-action="home">
    <material-icon icon="home"></material-icon>
</button>

<slot></slot>
<slot name="suffix"></slot>
`.replace("__css__", import.meta.url.replace(".html.js", ".css"));