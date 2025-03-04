
export const HTML = `
<link rel="stylesheet" href="${new URL("./app-header.css", import.meta.url)}">
<slot name="prefix"></slot>

<button class="icon" data-action="home">
    <material-icon icon="home"></material-icon>
</button>

<slot></slot>
<slot name="suffix"></slot>
`;