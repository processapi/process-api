export const HTML = `
<link rel="stylesheet" href="__css__" />
<slot></slot>
`.replace("__css__", import.meta.url.replace(".html.js", ".css"));

