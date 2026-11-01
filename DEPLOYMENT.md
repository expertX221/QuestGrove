# Quest Grove deployment

Production: https://quest-grove-eduactional-platform.vercel.app/

Source: https://github.com/expertX221/QuestGrove

Release 1.1 verified 2026-11-01. Vercel serves the frontend and server-only workspace API. Neon Postgres is in Singapore; API region sin1. /api/health returned HTTP 200 with database connected.

Use the cloud icon to create a private workspace and keep its recovery code. Save/restore are explicit actions. This prototype uses owner recovery codes rather than school accounts or role-based authentication. Local learning continues without cloud setup; standalone HTML uses local storage only.

Production secret QUESTGROVE_DATABASE_URL is configured in Vercel. Credentials are excluded from this package. For another deployment provision database/schema.sql and configure your own server-only connection per README.md. Preview environments require their own configuration.

Verified: 17 automated tests, production compilation, offline packaging, real database save/restore and revision protection, desktop/mobile visual review. See design-qa.md for scope.
