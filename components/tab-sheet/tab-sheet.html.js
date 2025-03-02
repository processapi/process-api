export const HTML = `
<link rel="stylesheet" href="${new URL("./tab-sheet.css", import.meta.url).href}" />
<slot name="prefix"></slot>
<div class="tab-sheet">
    <div class="header">
        <slot name="tab"></slot>
    </div>
    <div class="content">
        <slot></slot>
    </div>
</div>
<slot name="suffix"></slot>
`