import { database, response } from "../server/cloud.js";
export async function GET() {
  try {
    await database()`SELECT 1 AS ok`;
    return response({
      status: "ok",
      database: "connected",
      service: "Quest Grove",
    });
  } catch {
    return response({ status: "degraded", database: "unavailable" }, 503);
  }
}
