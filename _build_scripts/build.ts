import { buildSrcFile } from "./build-src.ts";
import { buildComponent } from "./build-component.ts";

async function cleaerDistFolder() {
    await Deno.remove("dist", { recursive: true });
    await Deno.mkdir("dist");
    await Deno.mkdir("dist/src");
}

await cleaerDistFolder();

// Components
await buildComponent("activity-state");

// System Files
await buildSrcFile("system/assert.js");
await buildSrcFile("system/events-manager.js");
await buildSrcFile("system/logger.js");

// Validation Files
await buildSrcFile("validate/conditions.js");

  
