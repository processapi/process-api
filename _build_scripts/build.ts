import { buildSrcFile } from "./build-src.ts";
import { buildComponent } from "./build-component.ts";

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
await buildComponent("activity-state");
await buildComponent("app-header");
await buildComponent("dynamic-rows");
await buildComponent("dynamic-columns");
await buildComponent("material-icon", "", ["icons"]);
await buildComponent("divider-item", "menu");
await buildComponent("menu-container", "menu");
await buildComponent("menu-group", "menu");
await buildComponent("menu-item", "menu");
await buildComponent("menu-label", "menu");
await buildComponent("toast-notification");
await buildComponent("tool-bar");
await buildComponent("tree-view");
// await buildComponent("ollama-ui");

// System Files
await buildSrcFile("system/assert.js");
await buildSrcFile("system/events-manager.js");
await buildSrcFile("system/logger.js");

// Validation Files
await buildSrcFile("validate/conditions.js");

Deno.kill(Deno.pid); // Exit the process
