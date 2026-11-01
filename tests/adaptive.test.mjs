import test from "node:test";
import assert from "node:assert/strict";
import {
  subjects,
  getLesson,
  recommend,
  checkpointMastery,
} from "../src/curriculum.js";
test("all 25 lesson selections have valid question answers", () => {
  for (const s of subjects)
    for (let g = 6; g <= 10; g++) {
      const l = getLesson(s.id, g);
      assert.ok(l.title);
      for (const q of [
        ...l.diagnostic,
        ...l.test,
        ...Object.values(l.questions).flat(),
      ]) {
        assert.ok(q.answer >= 0 && q.answer < q.options.length);
        assert.equal(new Set(q.options).size, q.options.length);
      }
      assert.ok(getLesson(s.id, g, "hi").title);
    }
});
test("struggle returns foundation and two secure answers extend", () => {
  assert.equal(
    recommend([{ correct: false }, { correct: false }]).level,
    "foundation",
  );
  assert.equal(
    recommend([{ correct: true }, { correct: true }]).pace,
    "faster",
  );
  assert.equal(
    recommend([{ correct: true }, { correct: false }]).level,
    "practice",
  );
});
test("mastery reflects checkpoint evidence only", () => {
  assert.equal(checkpointMastery([]), 0);
  assert.equal(checkpointMastery([{ correct: true }, { correct: false }]), 50);
});
test("adaptive tiers are distinct, bilingual and checkpoints include novel work", () => {
  for (const s of subjects)
    for (let g = 6; g <= 10; g++) {
      const l = getLesson(s.id, g),
        h = getLesson(s.id, g, "hi");
      const pool = Object.values(l.questions).flat();
      assert.equal(new Set(pool.map((q) => q.prompt)).size, 6);
      assert.equal(new Set(pool.map((q) => q.id)).size, 6);
      assert.equal(l.diagnostic.length, 3);
      assert.equal(l.test.length, 3);
      assert.ok(l.test.some((q) => !pool.some((p) => p.prompt === q.prompt)));
      for (const q of [
        ...Object.values(h.questions).flat(),
        ...h.diagnostic,
        ...h.test,
      ])
        assert.match(q.prompt, /[\u0900-\u097F]/);
    }
});
