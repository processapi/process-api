import * as esbuild from "https://deno.land/x/esbuild@v0.17.12/mod.js";
import { copy } from "https://deno.land/std@0.97.0/fs/mod.ts";

export async function buildComponent(componentName: string) {
    console.log(`Building ${componentName}`);
    await build_src(componentName);
    await copy_files(componentName);
}

async function build_src(componentName: string) {
    const result = await esbuild.build({
        entryPoints: [`components/${componentName}/${componentName}.js`],
        outfile: `dist/components/${componentName}/${componentName}.js`,
        bundle: true,
        minify: true,
        sourcemap: true,
        target: ["es2020"],
        format: "esm",
        keepNames: true
    });
    esbuild.stop();
    
    if (result.errors.length > 0) {
        console.error(result.errors);
        Deno.exit(1);
    }
}

// Copy all files and folders.
// Ignore js files.
async function copy_files(componentName: string) {
    const srcFolder = `components/${componentName}`;
    const distFolder = `dist/components/${componentName}`;

    for await (const entry of Deno.readDir(srcFolder)) {
        if (entry.isFile && entry.name.endsWith(".js")) {
            continue;
        }

        if (entry.isDirectory) {
            await copyFilesToFolder(`${srcFolder}/${entry.name}`, `${distFolder}/${entry.name}`);
            continue;
        }
        
        const srcPath = `${srcFolder}/${entry.name}`;
        const distPath = `${distFolder}/${entry.name}`;
        await copy(srcPath, distPath, { overwrite: true });
    }
}

async function copyFilesToFolder(sourceDir: string, targetDir: string) {
    for await (const entry of Deno.readDir(sourceDir)) {
        const srcPath = `${sourceDir}/${entry.name}`;
        const distPath = `${targetDir}/${entry.name}`;
        await copy(srcPath, distPath, { overwrite: true });
    }
}