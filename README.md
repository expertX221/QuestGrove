# Quest Grove

Live website: https://quest-grove-eduactional-platform.vercel.app/

Interactive adaptive learning for Indian Classes 6–10, with Blender-built subject islands, bilingual concept pathways, and teacher guidance.

## Version 1.1

- A richer forest-green, moss and brass palette, stronger model lighting and clearer subject highlights.
- Neon PostgreSQL storage behind Vercel Functions.
- Private cloud workspace creation, recovery-code connection, explicit save and restore, and browser disconnect.
- Optimistic revision checks prevent one device from silently overwriting another device’s newer save.
- Offline-first local learning remains available without an account or connection.

## Open in VS Code

Open `quest-grove.code-workspace` and run the included tasks, or:

```sh
npm ci
npm run dev
```

Node.js 22 or newer is required. Standard Vite serves the frontend. Cloud API routes run on Vercel; `vercel dev` can serve them locally when the server-only environment variable is configured.

## Private cloud backup

Choose the cloud icon or **Private cloud workspace**. Create a workspace to save the current learner profiles, attempts and teacher guidance. Keep the recovery code somewhere private: it grants access to the entire workspace and is shown only when the workspace is created.

After learning, select **Save current progress**. On another browser, connect using the code and select **Restore saved workspace**. Restore keeps the previous local state under `quest-grove-before-cloud-restore` in that browser. Cloud saves are explicit; changing a local answer does not automatically upload it. If another device saved first, a conflict message stops the overwrite.

The server stores only a SHA-256 hash of the workspace secret. Browser sessions use Secure, HttpOnly, SameSite=Strict cookies. The recovery code is not stored in the frontend bundle or source repository. It is an owner-level workspace credential, not a separate student or teacher account. Share it only with authorised people. This remains a prototype rather than a production school identity system.

## Database and deployment

The production frontend and `/api/workspace` / `/api/health` run on Vercel. The database is Neon PostgreSQL in Singapore. The runtime role has only schema usage and SELECT/INSERT/UPDATE on the workspace table. It cannot create tables or delete records.

The Vercel production Secret `QUESTGROVE_DATABASE_URL` points to this database. An existing `DATABASE_URL` setting is preserved. The code supports `DATABASE_URL` as a fallback for other installations. Never prefix a database credential with `VITE_`, and never commit a real `.env` file.

For another deployment:

1. Create a PostgreSQL database and apply `database/schema.sql` using its owner role.
2. Create a limited runtime login and grant schema usage plus SELECT/INSERT/UPDATE on `questgrove_workspaces`.
3. Set `QUESTGROVE_DATABASE_URL` as a server-only Vercel Secret using the pooled URL.
4. Import the GitHub repository, use `npm run build` and output directory `dist/client`.
5. Visit `/api/health`, then create/save/restore a test workspace in the app.

The prototype limits each snapshot to under 900 KB and caps new workspaces at 200. Local learning continues if the cloud is unavailable. No real credentials are included in the ZIP.

## Learning features

- Five real Blender subject islands, with mesh clicks and accessible subject buttons.
- 25 grade-specific sample concepts and 175 distinct questions.
- English/Hindi lessons, questions and core learner controls; locally bundled Devanagari fonts.
- Three-question diagnostic; foundation, practice and extension levels; level-adaptive checkpoints with novel material.
- Two incorrect practice answers trigger foundations; two correct answers unlock an extension. Learning examples adapt with the level.
- 15 editable Blender models, with rotation, reset, part exploration, wireframe, hover feedback and maths experiments.
- Shared-device aliases, progress, curiosity points, class/language preferences, low-data mode and reduced motion.
- Teacher studio using actual saved attempts, observations, tasks, class filtering and CSV export.

These are curated starter concepts, not a complete textbook syllabus or officially certified board alignment. Board preference is recorded but does not claim a full board-specific curriculum. Scores describe the sampled checkpoint level and support teacher judgement.

## Offline file

The ZIP includes `Quest-Grove.html`. Open it directly in a modern browser to use all lessons, fonts, still previews and GLB models without a connection. The standalone file disables cloud operations; use the hosted website for private cloud save/restore. Browser file-storage behavior varies; use the same file and browser to retain local progress.

```sh
npm run build
```

This rebuilds the offline file at the project root and `dist/client/Quest-Grove.html`. Source checkouts omit this generated HTML; build once before using its development download link.

## Verification and source

```sh
npm test
npm run test:ui
npm run build
```

Tests cover curriculum/adaptation, GLB integrity, cloud authentication/CSRF/conflicts, packaging and React learning flows. A real PostgreSQL smoke test also verifies private create/save/restore and conflict behavior. Browser evidence is recorded in `design-qa.md`.

Blender sources are in `public/models/*.blend`, web assets in `*.glb`, still renders in `public/previews/`, and reproducible scripts in `blender/`. The detailed architectural diorama has 2,088 editable components; its optimised web export uses 107 subject/material meshes. It is not a photorealistic recreation of the original generated visual.

`REQUIREMENTS.md` maps features to the supplied problem statement. GitHub: https://github.com/expertX221/QuestGrove
