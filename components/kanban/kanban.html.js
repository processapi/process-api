export const HTML = `
<link rel="stylesheet" href="__css__" />
<canvas></canvas>
`.replace("__css__", import.meta.url.replace(".html.js", ".css"));