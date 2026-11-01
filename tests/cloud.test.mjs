import test from "node:test";
import assert from "node:assert/strict";
import {
  createHandler,
  parseCode,
  hash,
  validateSnapshot,
  COOKIE,
} from "../server/cloud.js";
import { initialState } from "../src/store.js";
const origin = "https://quest-grove-eduactional-platform.vercel.app";
const req = (method = "GET", data, extra = {}) =>
  new Request(
    origin + "/api/workspace" + (extra.restore ? "?action=restore" : ""),
    {
      method,
      headers: {
        Origin: extra.origin || origin,
        "Content-Type": "application/json",
        ...(extra.cookie ? { Cookie: extra.cookie } : {}),
      },
      ...(data ? { body: JSON.stringify(data) } : {}),
    },
  );
test("cloud rejects cross-origin writes and unauthenticated restores before querying", async () => {
  let queries = 0;
  const h = createHandler(() => async () => {
    queries++;
    return [];
  });
  assert.equal(
    (
      await h(
        req(
          "POST",
          { action: "create", snapshot: initialState() },
          { origin: "https://attacker.example" },
        ),
      )
    ).status,
    403,
  );
  assert.equal((await h(req("GET", null, { restore: true }))).status, 401);
  assert.equal(queries, 0);
});
test("cloud creation hashes access keys and uses private secure cookies", async () => {
  let bound;
  const h = createHandler(() => async (strings, ...values) => {
    bound = values;
    return [{ revision: 1, updated_at: "2026-11-01T00:00:00Z" }];
  });
  const r = await h(
    req("POST", { action: "create", snapshot: initialState() }),
  );
  assert.equal(r.status, 201);
  const data = await r.json(),
    secret = data.recoveryCode.split(".")[1];
  assert.ok(bound.includes(hash(secret)));
  assert.ok(!bound.includes(secret));
  assert.ok(
    r.headers.get("set-cookie").includes("HttpOnly; Secure; SameSite=Strict"),
  );
  assert.equal(parseCode(data.recoveryCode).id, data.id);
});
test("cloud rejects invalid snapshots and malformed recovery codes", async () => {
  assert.throws(() =>
    validateSnapshot({ ...initialState(), activeId: "missing" }),
  );
  assert.throws(() => parseCode("guessable"));
  const h = createHandler(() => async () => []);
  assert.equal(
    (await h(req("POST", { action: "connect", code: "guessable" }))).status,
    401,
  );
  assert.equal(
    (await h(req("POST", { action: "create", snapshot: { students: [] } })))
      .status,
    400,
  );
});
test("cloud detects stale revisions without overwriting another device", async () => {
  let calls = 0;
  const h = createHandler(
    () => async () => (++calls === 1 ? [] : [{ revision: 4 }]),
  );
  const code = "f12e1a82-6408-4cf9-8373-671e95159a2f." + "a".repeat(43);
  const r = await h(
    req(
      "PUT",
      { snapshot: initialState(), revision: 1 },
      { cookie: COOKIE + "=" + code },
    ),
  );
  assert.equal(r.status, 409);
  assert.match((await r.json()).error, /Another device/);
  assert.equal(calls, 2);
});
