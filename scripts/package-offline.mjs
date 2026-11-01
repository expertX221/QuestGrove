import { readFile, writeFile, readdir, stat, mkdir } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  client = path.join(root, "dist/client"),
  dir = path.join(client, "assets");
const entries = await readdir(dir),
  jsName = entries.find((n) => n.endsWith(".js")),
  cssName = entries.find((n) => n.endsWith(".css"));
if (!jsName || !cssName) throw new Error("Build files missing");
const mime = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".glb": "model/gltf-binary",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};
const dataUri = async (file) =>
  "data:" +
  mime[path.extname(file)] +
  ";base64," +
  (await readFile(file)).toString("base64");
let assets = {};
for (const folder of ["models", "previews"]) {
  for (const name of await readdir(path.join(root, "public", folder))) {
    if (![".png", ".glb"].includes(path.extname(name))) continue;
    assets["/" + folder + "/" + name] = await dataUri(
      path.join(root, "public", folder, name),
    );
  }
}
assets["/world.png"] = await dataUri(path.join(root, "public/world.png"));
let css = await readFile(path.join(dir, cssName), "utf8");
for (const n of entries.filter((n) => /\.woff2?$/.test(n))) {
  const uri = await dataUri(path.join(dir, n));
  css = css.replaceAll("/assets/" + n, uri);
}
const js = (await readFile(path.join(dir, jsName), "utf8")).replaceAll(
  "</script",
  "<\\/script",
);
const html =
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#153f2a"><title>Quest Grove — Offline</title><style>' +
  css +
  '</style></head><body><div id="root"></div><script>window.GROVE_ASSETS=' +
  JSON.stringify(assets) +
  ';</script><script type="module">' +
  js +
  "</script></body></html>";
await writeFile(path.join(root, "Quest-Grove.html"), html);
await writeFile(path.join(client, "Quest-Grove.html"), html);
const precache = [
  "/",
  "/index.html",
  ...entries.map((n) => "/assets/" + n),
  "/previews/world.png",
];
await writeFile(
  path.join(client, "offline-manifest.json"),
  JSON.stringify(precache),
);
console.log(
  "Offline app packaged: " +
    (Buffer.byteLength(html) / 1024 / 1024).toFixed(1) +
    " MB; all models, lessons, fonts and images embedded.",
);
