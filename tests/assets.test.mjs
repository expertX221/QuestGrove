import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { subjects } from "../src/curriculum.js";
import { modelFor } from "../src/experiments.js";
const models = new Set([
  "world",
  "observatory",
  ...subjects.flatMap((s) => [6, 7, 8, 9, 10].map((g) => modelFor(s.id, g))),
]);
test("every curriculum model is a valid self-contained GLB with editable Blender source", async () => {
  for (const model of models) {
    const b = await readFile(`public/models/${model}.glb`);
    assert.equal(b.toString("utf8", 0, 4), "glTF", model);
    assert.equal(b.readUInt32LE(4), 2);
    assert.equal(b.readUInt32LE(8), b.length);
    const json = JSON.parse(
      b.toString("utf8", 20, 20 + b.readUInt32LE(12)).trim(),
    );
    assert.ok(json.meshes.length > 0);
    assert.ok(
      !json.buffers?.some((b) => b.uri),
      "GLB must not require remote buffers",
    );
    assert.ok((await stat(`public/models/${model}.blend`)).size > 0);
    assert.ok((await stat(`public/previews/${model}.png`)).size > 0);
  }
});
test("world web export preserves subject click identities and has a bounded draw-call count", async () => {
  const b = await readFile("public/models/world.glb");
  const json = JSON.parse(
    b.toString("utf8", 20, 20 + b.readUInt32LE(12)).trim(),
  );
  for (const s of subjects)
    assert.ok(
      json.nodes.some((n) => n.name?.startsWith(s.id + "_")),
      s.id,
    );
  assert.ok(
    json.meshes.length < 150,
    "World should use the optimized web export",
  );
});
