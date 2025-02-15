import * as esbuild from "https://deno.land/x/esbuild@v0.17.12/mod.js";
import { copy } from "https://deno.land/std@0.97.0/fs/mod.ts";
import init, {minify} from "https://wilsonl.in/minify-html/deno/0.9.2/index.js";

await init();
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function buildComponent(componentName: string, copyFolders: string[] = []) {
    console.log(`Building ${componentName}`);
    await build_src(componentName);
    await copy_files(componentName);

    if (copyFolders.length > 0) {
        for (const folder of copyFolders) {
            await copyFilesToFolder(`components/${componentName}/${folder}`, `dist/components/${componentName}/${folder}`);
        }
    }
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

        if (entry.name.endsWith(".css")) {
            await copyCSSFiles(`${srcFolder}/${entry.name}`, `${distFolder}/${entry.name}`);
            continue;
        }

        if (entry.name.endsWith(".html")) {
            await copyHTMLFiles(`${srcFolder}/${entry.name}`, `${distFolder}/${entry.name}`);
            continue;
        }
        
        const srcPath = `${srcFolder}/${entry.name}`;
        const distPath = `${distFolder}/${entry.name}`;
        await copy(srcPath, distPath, { overwrite: true });
    }
}

async function copyCSSFiles(srcFile: string, distFile: string) {
    const css = await Deno.readTextFile(srcFile);

    const result = await esbuild.transform(css, {
        loader: "css",
        minify: true,
    });

    await Deno.writeTextFile(distFile, result.code);
}

async function copyHTMLFiles(srcFolder: string, distFile: string) {
    const html = await Deno.readTextFile(srcFolder);

    const result = decoder.decode(minify(encoder.encode(html), {
        minify_css: true,
        minify_js: true,
        do_not_minify_doctype: true,
        keep_closing_tags: true
    }));

    await Deno.writeTextFile(distFile, result);
}

async function copyFilesToFolder(sourceDir: string, targetDir: string) {
    for await (const entry of Deno.readDir(sourceDir)) {
        const srcPath = `${sourceDir}/${entry.name}`;
        const distPath = `${targetDir}/${entry.name}`;

        await copy(srcPath, distPath, { overwrite: true });
    }
}