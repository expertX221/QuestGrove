# Quest Grove

An interactive adaptive-learning prototype for Indian students in Classes 6–10. Explore five Blender-built learning islands, discover concepts in 3D, and follow a path that responds to your answers. Teachers see the evidence and decide how to guide the learner.

## Open in VS Code

Open `quest-grove.code-workspace`. Use **Terminal → Run Task → Install dependencies**, then **Start Quest Grove**. Or run:

```sh
npm ci
npm run dev
```

Requires Node.js 22 or newer. The usual preview address is printed by Vite. No API keys, database account, or cloud setup is needed to run the complete local prototype.

## Offline version

Open `Quest-Grove.html` from the delivered ZIP directly in a modern browser. It includes the app, all lesson content, fonts, images and GLB models. A network connection is not required. Browser file-storage behavior varies; keep using the same file and browser to preserve local progress. Read-aloud depends on the voices installed in the browser/device.

To rebuild that file:

```sh
npm run build
```

The result is written to the project root and `dist/client/Quest-Grove.html`. Download links inside the hosted app use that file. Source checkouts intentionally omit the generated HTML; build once before using the offline download link in development.

## Working features

- A live Blender-exported world with five clickable subject islands. Labels and subject cards provide keyboard/touch alternatives.
- 25 curated concept pathways: one topic per subject per class, across Mathematics, Science, English, Social Studies and Logic.
- 175 distinct questions with prerequisite, practice and extension levels. English and Hindi lesson/question support; English grammar examples retain English sentences.
- A three-question starting diagnostic; learning examples, practice difficulty and checkpoint questions respond to the learner’s current level.
- Two consecutive incorrect practice answers revisit foundations; two consecutive correct answers unlock extension work. Mixed answers return to practice.
- Three-question checkpoints include novel material. Checkpoint percentages describe the difficulty level attempted; only a strong extension checkpoint counts as a strong concept in the overview.
- 15 editable Blender source models and GLB exports: the world, observatory, molecule, geometry, books, globe, puzzle, fractions, number line, balance, triangle, filtration, heat, pressure and circuit.
- Model rotation, reset, part separation, wireframe, hover/click feedback, motion pause and grade-specific interactive maths experiments.
- Shared-device learner aliases, class and language preferences, local progress, curiosity points and teacher assignments.
- Teacher studio with real local attempts, gap suggestions, notes, assignments, class filtering and CSV report export. No fabricated performance metrics.
- Low-data still-image mode, reduced-motion support, model loading/error fallback, semantic controls and modal focus management.

## Problem statement coverage

See [REQUIREMENTS.md](REQUIREMENTS.md) for a requirement-to-feature map from the supplied PDF.

This is a complete local prototype of the core journeys, **not a full textbook syllabus, official board alignment, or production school information system**. Board selection records a preference; it does not claim complete board-specific content. Teacher tools support judgement; the small question sample is not a validated student assessment.

## Data and privacy

All learner records and teacher notes are kept in this browser’s localStorage. Seeded Explorer profiles begin with no attempts. Profiles are for demonstrating a shared device; they are not secure accounts. No real student cloud authentication, server database or cross-device sync is active. Clearing browser storage removes local progress. Exported CSV files contain the chosen local aliases and notes; share them intentionally.

## Build and checks

```sh
npm test
npm run test:ui
npm run build
# or all checks together:
npm run verify
```

Unit checks cover all 25 lesson selections, bilingual question structure, distinct difficulty tiers, adaptive branching, checkpoint scoring and GLB integrity. Flow tests use React in jsdom, with GPU rendering replaced by a test double; they verify diagnostic → adaptation → checkpoint → teacher assignment, subject opening, class switching, Hindi and profile switching. These tests do not measure WebGL appearance or real device performance.

Browser-based visual QA status is recorded separately in [design-qa.md](design-qa.md). A build or jsdom result is not represented as a browser screenshot.

## Blender files

- `public/models/*.blend`: editable sources.
- `public/models/*.glb`: web assets loaded by Three.js.
- `public/previews/*.png`: Blender renders used in low-data mode.
- `blender/`: reproducible scene/model/optimization scripts.

Run the scripts with Blender 5.x in background mode. The full world source retains 2,088 editable meshes; the web export joins them into 107 subject/material meshes and preserves subject prefixes for click detection. The world is a detailed architectural diorama inspired by the selected visual, not a photorealistic recreation.

## GitHub and Vercel

Repository: https://github.com/expertX221/QuestGrove

`vercel.json` is included. Import this repository in Vercel, use the Vite framework, `npm run build` and output directory `dist/client`. No environment variables are needed for this local-data prototype. A connected Vercel deployment has not been created in this session.

The original Sites packaging worker and tests are preserved. GitHub Actions builds and tests the project and uploads the browser/offline build as an artifact.
