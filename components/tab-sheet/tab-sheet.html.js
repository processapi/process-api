export const HTML = `
<link rel="stylesheet" href="${new URL("./tab-sheet.css", import.meta.url).href}" />
<div class="tab-sheet">
    <div class="header">
        <slot name="prefix"></slot>
        <slot name="tab"></slot>
        <slot name="suffix"></slot>
    </div>
    <div class="content">
        <slot></slot>
    </div>
</div>
`