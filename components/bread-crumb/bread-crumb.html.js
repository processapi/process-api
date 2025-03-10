export const HTML = `
<link rel="stylesheet" href="__css__">
<slot name="prefix"></slot>
<ul>
    <slot></slot>
</ul>
<slot name="suffix"></slot>
`.replace("__css__", import.meta.url.replace(".html.js", ".css"));
