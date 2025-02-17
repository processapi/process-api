
export const HTML = `
<link rel="stylesheet" href="__css__" />
<material-icon></material-icon>
`.replace("__css__", import.meta.url.replace(".html.js", ".css"));
