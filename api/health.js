import { database, response } from "../server/cloud.js";
export async function GET() {
  try {
    await database()`SELECT 1 AS ok`;
    return response({
      status: "ok",
      database: "connected",
      service: "Quest Grove",
    });
  } catch (e) {
    console.error("Database health check failed", {
      name: e.name,
      code: e.code,
      scoped: Boolean(process.env.QUESTGROVE_DATABASE_URL),
      detail: String(e.message)
        .replaceAll(process.env.QUESTGROVE_DATABASE_URL || "___", "[redacted]")
        .replaceAll(process.env.DATABASE_URL || "___", "[redacted]")
        .replace(/postgres(?:ql)?:\/\/\S+/g, "[connection]")
        .replace(/\b[0-9a-f]{64}\b/gi, "[redacted]"),
    });
    return response({ status: "degraded", database: "unavailable" }, 503);
  }
}
