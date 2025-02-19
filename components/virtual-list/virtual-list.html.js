export const HTML = `
<link rel="stylesheet" href="__css__" />

<ul role="list"></ul>
`.replace("__css__", import.meta.url.replace(".html.js", ".css"));
