import * as esbuild from "https://deno.land/x/esbuild@v0.17.12/mod.js";

export async function buildSrcFile(file: string) {
    console.log(`Building ${file}`);
    const result = await esbuild.build({
        entryPoints: [`src/${file}`],
        outfile: `dist/src/${file}`,
        bundle: false,
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