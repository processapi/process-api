import * as esbuild from "https://deno.land/x/esbuild@v0.17.12/mod.js";

async function cleaerDistFolder() {
    await Deno.remove("dist", { recursive: true });
    await Deno.mkdir("dist");
    await Deno.mkdir("dist/src");
}

async function buildSrcFile(file: string) {
    console.log(`Building ${file}`);
    const result = await esbuild.build({
        entryPoints: [`src/${file}`],
        outfile: `dist/src/${file}`,
        bundle: true,
        format: "esm",
        minify: true,
        sourcemap: true,
        target: "es6",
        keepNames: true
    });
    esbuild.stop();
    
    if (result.errors.length > 0) {
        console.error(result.errors);
        Deno.exit(1);
    }
}

await cleaerDistFolder();
await buildSrcFile("validate/validate-args.js");

  
