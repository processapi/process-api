import { buildSrcFile } from "./build-src.ts";
import { buildComponent, copyFilesToFolder } from "./build-component.ts";

async function cleaerDistFolder() {
    const hasDistFolder = await Deno.stat("dist").catch(() => null);

    if (hasDistFolder) {
        await Deno.remove("dist", { recursive: true });
    }

    await Deno.mkdir("dist");
    await Deno.mkdir("dist/src");
}

await cleaerDistFolder();

// Components

await buildComponent("material-icon");
await copyFilesToFolder("components/material-icon/icons", "dist/components/material-icon/icons");

await buildComponent("activity-state");
await buildComponent("app-header");
await buildComponent("dynamic-rows");
await buildComponent("dynamic-columns");

await buildComponent("material-icon");
await copyFilesToFolder("components/material-icon/icons", "dist/components/material-icon/icons");

await buildComponent("divider-item", "menu");
await buildComponent("menu-container", "menu");
await buildComponent("menu-group", "menu");
await buildComponent("menu-item", "menu");
await buildComponent("menu-label", "menu");
await buildComponent("toast-notification");
await buildComponent("tool-bar");
await buildComponent("tree-view");
await buildComponent("ollama-ui");

// Modules
await buildSrcFile("modules/canvas.js");
await buildSrcFile("modules/component.js");
await buildSrcFile("modules/css-grid.js");
await buildSrcFile("modules/dom-parser.js");
await buildSrcFile("modules/files.js");
await buildSrcFile("modules/idle.js");
await buildSrcFile("modules/canvas.js");
await buildSrcFile("modules/messaging.js");
await buildSrcFile("modules/ollama.js");
await buildSrcFile("modules/quadtree.js");
await buildSrcFile("modules/router.js");
await buildSrcFile("modules/surrealdb.js");
await buildSrcFile("modules/system.js");
await buildSrcFile("modules/tween.js");
await buildSrcFile("modules/view-loader.js");
await buildSrcFile("modules/virtualization.js");

// System Files
await buildSrcFile("system/assert.js");
await buildSrcFile("system/events-manager.js");
await buildSrcFile("system/logger.js");

// Validation Files
await buildSrcFile("validate/conditions.js");

await buildSrcFile("process-api.js");

Deno.kill(Deno.pid); // Exit the process
