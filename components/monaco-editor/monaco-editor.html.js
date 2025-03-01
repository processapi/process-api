const thisCSSUrl = import.meta.url.replace(".html.js", ".css");
const monacoCSSUrl = new URL("./node_modules/monaco-editor/min/vs/editor/editor.main.css", import.meta.url).href;

export const HTML = `
<link rel="stylesheet" href="${thisCSSUrl}"/>
<link rel="stylesheet" href="${monacoCSSUrl}" data-name="vs/editor/editor.main"/>
`;