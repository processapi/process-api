export const HTML = `
<link rel="stylesheet" href="__css__" />

<ul id="container" role="list"></ul>
`.replace("__css__", import.meta.url.replace(".html.js", ".css"));
