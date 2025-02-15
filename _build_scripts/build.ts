import { buildSrcFile } from "./build-src.ts";
import { buildComponent } from "./build-component.ts";

async function cleaerDistFolder() {
    await Deno.remove("dist", { recursive: true });
    await Deno.mkdir("dist");
    await Deno.mkdir("dist/src");
}

await cleaerDistFolder();

// Components
// await buildComponent("activity-state");
// await buildComponent("app-header");
// await buildComponent("dynamic-rows");
// await buildComponent("dynamic-columns");
await buildComponent("material-icon", ["icons"]);
// await buildComponent("menu");
// await buildComponent("ollama-ui");
// await buildComponent("toast-notification");
// await buildComponent("toolbar");
// await buildComponent("tree-view");

// System Files
// await buildSrcFile("system/assert.js");
// await buildSrcFile("system/events-manager.js");
// await buildSrcFile("system/logger.js");

// Validation Files
// await buildSrcFile("validate/conditions.js");

  
