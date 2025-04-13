// CustomPlugin.js
export class ManifestPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap("ManifestPlugin", async (compilation) => {
      const manifest = {};
      for (const filename of Object.keys(compilation.assets)) {
        if (filename.endsWith(".ts")) {
          const chunkName = filename.split(".")[0]; // crude chunk name guessing
          manifest[chunkName] = filename;
        }
      }

      const fs = await import("fs");
      const path = await import("path");

      fs.writeFileSync(
        path.join(compiler.options.output.path, "manifest.json"),
        JSON.stringify(manifest, null, 2)
      );
    });
  }
}
