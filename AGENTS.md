# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Accepted project decisions

- Preserve selected option 3: cream/forest/lavender floating learning islands, with live Blender-exported world and subject models.
- All five subject islands open the matching learning workspace.
- Cover PDF outcomes through grade-specific sample concepts for Classes 6–10, diagnostic, adaptive Learn/Solve/Test, teacher guidance, English/Hindi content, shared-device profiles and offline support.
- Deliver an updated VS Code source ZIP and publish to the existing expertX221/QuestGrove repository when access permits.
- Clearly distinguish complete prototype workflows from a full official curriculum or production school authentication.
- Version 1.1: user requested stronger, more suitable colours and initial model highlights. Use deeper forest panels, brass accents and richer 3D lighting while preserving the selected composition.
- Production target: create-projects1/quest-grove-eduactional-platform on Vercel, using expertX221/QuestGrove main.
- Neon-backed private workspace backup is explicit save/restore; recovery code grants whole-workspace access, with no claim of separate school identity accounts. Preserve offline mode and the pre-existing DATABASE_URL setting.
