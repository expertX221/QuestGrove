import { neon } from "@neondatabase/serverless";
import { createHash, randomBytes, randomUUID } from "node:crypto";
export const COOKIE = "__Host-qg_workspace";
export class CloudError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
export const hash = (secret) =>
  createHash("sha256").update(secret).digest("hex");
export function parseCode(code) {
  if (
    typeof code !== "string" ||
    !/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.([A-Za-z0-9_-]{43})$/.test(
      code,
    )
  )
    throw new CloudError("The workspace recovery code is not valid.", 401);
  let [id, secret] = code.split(".");
  return { id, accessHash: hash(secret) };
}
export function cookieCode(request) {
  const match = (request.headers.get("cookie") || "")
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(COOKIE + "="));
  if (!match) throw new CloudError("Connect a cloud workspace first.", 401);
  return decodeURIComponent(match.slice(COOKIE.length + 1));
}
export function cookie(code, maxAge = 2592000) {
  return `${COOKIE}=${encodeURIComponent(code)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}
export function validateSnapshot(s) {
  if (
    !s ||
    s.version !== 2 ||
    !Array.isArray(s.students) ||
    s.students.length < 1 ||
    s.students.length > 40
  )
    throw new CloudError(
      "A workspace needs between 1 and 40 learner profiles.",
    );
  const ids = new Set();
  for (const p of s.students) {
    if (
      typeof p.id !== "string" ||
      p.id.length > 80 ||
      ids.has(p.id) ||
      typeof p.name !== "string" ||
      !p.name.trim() ||
      p.name.length > 32 ||
      ![6, 7, 8, 9, 10].includes(p.grade) ||
      !["en", "hi"].includes(p.language) ||
      typeof p.board !== "string" ||
      p.board.length > 80 ||
      !p.records ||
      typeof p.records !== "object" ||
      Array.isArray(p.records)
    )
      throw new CloudError("A learner profile is not valid.");
    ids.add(p.id);
    for (const [key, r] of Object.entries(p.records)) {
      if (
        !/^(mathematics|science|english|social|logic):(6|7|8|9|10)$/.test(
          key,
        ) ||
        !r ||
        !["foundation", "practice", "stretch"].includes(r.level) ||
        !Number.isFinite(r.mastery) ||
        r.mastery < 0 ||
        r.mastery > 100 ||
        typeof r.note !== "string" ||
        r.note.length > 600 ||
        typeof r.assignment !== "string" ||
        r.assignment.length > 350
      )
        throw new CloudError("A learning record is not valid.");
      for (const a of ["history", "diagnostic", "tests"])
        if (
          !Array.isArray(r[a]) ||
          r[a].length > (a === "history" ? 1000 : 100)
        )
          throw new CloudError(
            "This learning history is too large for one cloud workspace. Export a report before starting a new workspace.",
          );
    }
  }
  if (
    !ids.has(s.activeId) ||
    !s.settings ||
    typeof s.settings.lowData !== "boolean" ||
    typeof s.settings.paused !== "boolean"
  )
    throw new CloudError("Workspace preferences are not valid.");
  const encoded = JSON.stringify(s);
  if (Buffer.byteLength(encoded) > 900000)
    throw new CloudError(
      "This workspace is too large to sync. Your local progress is safe.",
      413,
    );
  return s;
}
export async function body(request) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new CloudError("Send JSON content.", 415);
  const text = await request.text();
  if (Buffer.byteLength(text) > 1000000)
    throw new CloudError("Request is too large.", 413);
  try {
    return JSON.parse(text);
  } catch {
    throw new CloudError("The request is not valid JSON.");
  }
}
export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    throw new CloudError(
      "This request must come from the Quest Grove website.",
      403,
    );
}
export const response = (data, status = 200, extra = {}) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extra,
    },
  });
export function database() {
  if (!(process.env.QUESTGROVE_DATABASE_URL || process.env.DATABASE_URL))
    throw new CloudError(
      "Cloud storage is not configured. Offline learning remains available.",
      503,
    );
  return neon(process.env.QUESTGROVE_DATABASE_URL || process.env.DATABASE_URL);
}
export function createHandler(sqlFactory = database) {
  return async function handle(request) {
    try {
      const sql = sqlFactory();
      const method = request.method;
      if (!["GET", "POST", "PUT"].includes(method))
        return response({ error: "Method not allowed." }, 405, {
          Allow: "GET, POST, PUT",
        });
      if (method !== "GET") sameOrigin(request);
      if (method === "POST") {
        const data = await body(request);
        if (data.action === "disconnect")
          return response({ connected: false }, 200, {
            "Set-Cookie": cookie("", 0),
          });
        if (data.action === "create") {
          const snapshot = validateSnapshot(data.snapshot),
            id = randomUUID(),
            secret = randomBytes(32).toString("base64url"),
            code = id + "." + secret;
          const rows =
            await sql`INSERT INTO questgrove_workspaces(id,access_hash,snapshot) SELECT ${id}::uuid,${hash(secret)},${JSON.stringify(snapshot)}::jsonb WHERE (SELECT count(*) FROM questgrove_workspaces)<200 RETURNING revision,updated_at`;
          if (!rows.length)
            throw new CloudError(
              "The prototype cloud workspace limit has been reached. Offline learning remains available.",
              429,
            );
          return response(
            {
              connected: true,
              id,
              revision: rows[0].revision,
              updatedAt: rows[0].updated_at,
              recoveryCode: code,
            },
            201,
            { "Set-Cookie": cookie(code) },
          );
        }
        if (data.action === "connect") {
          const { id, accessHash } = parseCode(data.code?.trim());
          const rows =
            await sql`SELECT id,revision,updated_at FROM questgrove_workspaces WHERE id=${id}::uuid AND access_hash=${accessHash}`;
          if (!rows.length)
            throw new CloudError(
              "That recovery code did not match a workspace.",
              401,
            );
          return response(
            {
              connected: true,
              id,
              revision: rows[0].revision,
              updatedAt: rows[0].updated_at,
            },
            200,
            { "Set-Cookie": cookie(data.code.trim()) },
          );
        }
        throw new CloudError("Unknown cloud action.");
      }
      let credentials;
      try {
        credentials = parseCode(cookieCode(request));
      } catch (e) {
        if (
          method === "GET" &&
          new URL(request.url).searchParams.get("action") !== "restore"
        )
          return response({ available: true, connected: false });
        throw e;
      }
      const { id, accessHash } = credentials;
      if (method === "GET") {
        const rows =
          await sql`SELECT id,revision,updated_at,snapshot FROM questgrove_workspaces WHERE id=${id}::uuid AND access_hash=${accessHash}`;
        if (!rows.length)
          throw new CloudError(
            "Your cloud session is no longer valid. Reconnect with the recovery code.",
            401,
          );
        const row = rows[0],
          restore =
            new URL(request.url).searchParams.get("action") === "restore";
        return response({
          available: true,
          connected: true,
          id,
          revision: row.revision,
          updatedAt: row.updated_at,
          ...(restore ? { snapshot: row.snapshot } : {}),
        });
      }
      const data = await body(request);
      validateSnapshot(data.snapshot);
      if (!Number.isSafeInteger(data.revision) || data.revision < 1)
        throw new CloudError("A valid cloud revision is required.");
      const rows =
        await sql`UPDATE questgrove_workspaces SET snapshot=${JSON.stringify(data.snapshot)}::jsonb,revision=revision+1,updated_at=now() WHERE id=${id}::uuid AND access_hash=${accessHash} AND revision=${data.revision} RETURNING revision,updated_at`;
      if (!rows.length) {
        const auth =
          await sql`SELECT revision FROM questgrove_workspaces WHERE id=${id}::uuid AND access_hash=${accessHash}`;
        if (!auth.length)
          throw new CloudError("Your cloud session is no longer valid.", 401);
        throw new CloudError(
          "Another device saved a newer version. Restore the cloud copy before saving again. Your local copy has not been overwritten.",
          409,
        );
      }
      return response({
        connected: true,
        id,
        revision: rows[0].revision,
        updatedAt: rows[0].updated_at,
      });
    } catch (e) {
      if (e instanceof CloudError)
        return response({ error: e.message }, e.status);
      console.error("Quest Grove cloud operation failed", {
        name: e.name,
        code: e.code,
      });
      return response(
        {
          error:
            "Cloud storage is temporarily unavailable. Your local progress is safe.",
        },
        503,
      );
    }
  };
}
