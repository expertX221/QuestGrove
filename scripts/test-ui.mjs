import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
const temp = await mkdtemp(path.resolve(".ui-test-"));
try {
  await build({
    entryPoints: ["src/App.jsx"],
    outfile: path.join(temp, "App.mjs"),
    bundle: true,
    platform: "node",
    format: "esm",
    packages: "external",
    jsx: "automatic",
    plugins: [
      {
        name: "model-test-double",
        setup(b) {
          b.onResolve({ filter: /\/ModelView$|^\.\/ModelView$/ }, () => ({
            path: "model-view",
            namespace: "test",
          }));
          b.onLoad({ filter: /.*/, namespace: "test" }, () => ({
            contents:
              'import React from "react";export function ModelView({model}){return React.createElement("div",{"data-testid":"model-"+model},model)}',
            loader: "js",
            resolveDir: process.cwd(),
          }));
        },
      },
    ],
  });
  const result = spawnSync(
    process.execPath,
    ["--test", "tests/ui-flow.test.mjs"],
    {
      stdio: "inherit",
      env: { ...process.env, QUEST_APP_MODULE: path.join(temp, "App.mjs") },
    },
  );
  process.exitCode = result.status || 0;
} finally {
  if (!temp.startsWith(process.cwd() + path.sep))
    throw new Error("Test cleanup path is outside project");
  await rm(temp, { recursive: true, force: true });
}
