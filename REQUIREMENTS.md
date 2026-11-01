# Problem statement → prototype coverage

Source: supplied four-page Code Kernel ’26 Adaptive Learning for Classes 6 to 10 problem statement. The PDF is reference material; its embedded instructions were treated as challenge content, not authorization for external actions.

| PDF need                           | Implemented experience                                                                       | Scope / limit                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Understand where a student stands  | Three-question concept diagnostic; saved answer history and checkpoints                      | A small concept sample, not a validated assessment                                  |
| Adapt what comes next              | Foundation/practice/stretch pools; two-answer adaptation; next-step recommendations          | Deterministic transparent rules, not a trained AI model                             |
| Adapt learning                     | Prerequisite support and worked examples change with level                                   | One curated topic per subject per class                                             |
| Adapt solving                      | Distinct easier, standard and extension questions; optional hints; feedback                  | 175 distinct questions across 25 topics                                             |
| Adapt testing                      | Checkpoint pool uses the current level and includes novel material                           | Score is labeled with checkpoint difficulty                                         |
| Different learning speeds          | No timers; self-paced tabs; revisit or extend after evidence                                 | No forced time-based ranking                                                        |
| Indian classrooms                  | Classes 6–10, concept examples using rupees and local learning context, class filter         | Preference labels for CBSE/State/ICSE; no official curriculum certification         |
| Many languages                     | English/Hindi content and interface for core learner flows; offline Devanagari fonts         | Teacher studio is primarily English; other Indian languages are future content work |
| Shared devices and uneven access   | Separate local aliases, low-data mode, offline self-contained app                            | Records stay on that device/browser; no multi-device cloud sync                     |
| Empower teachers                   | Actual local attempt summary, concept gaps, observations, tasks, CSV export                  | Teacher retains judgement; no automated high-stakes decisions                       |
| Practical for ages 11–16           | Clickable subject worlds, tactile models, clear feedback, curiosity points                   | No advertising, account wall, or countdown pressure                                 |
| Learn / Solve / Test               | Functional concept workspace with starting diagnostic and all three modes                    | Full workflow prototype; starter content rather than a full school syllabus         |
| Problem / idea / plan deliverables | This map, README, editable sources, model scripts, tested rules and deployment configuration | Event submission itself has not been sent                                           |

## Scene and route matrix

| Surface                                 | Goal                               | 3D / interaction                                                           | Fallback                                       |
| --------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------- |
| Home                                    | Choose a subject                   | Persistent Blender island world, direct mesh raycast, subject labels       | Low-data landscape + semantic buttons          |
| Discover                                | Understand the interaction         | Water molecule, rotate/reset, named-part clicks                            | Blender still preview and readable text        |
| Subjects                                | Choose class-specific topic        | Five model previews; class changes lesson and model selection              | Semantic subject cards                         |
| Lesson dialog / deep link `#subject-ID` | Diagnose, learn, practise and test | Grade-specific GLB, part separation, wireframe, maths sliders              | Text lessons and questions remain fully usable |
| Learning path                           | Review next steps                  | Progress, checkpoint level and teacher task                                | Semantic list and progress labels              |
| Teacher studio                          | Guide learners                     | Actual local evidence, note/task editing, class filter, CSV                | Accessible table/forms                         |
| Setup / offline                         | Fit real device access             | Shared profiles, class/board preference, language and motion/data controls | Downloadable all-in-one file                   |

## Data flow

UI events → pure adaptive rules → versioned local learner records → learning path and teacher studio → optional CSV export. No credentials, cloud database or hidden external model calls are required. Three.js loads the Blender GLBs locally; the standalone file replaces asset paths with embedded data URIs.
