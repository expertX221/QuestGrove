import { modelFor } from "./experiments";
import { useEffect, useState, useCallback } from "react";
import {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Compass,
  Leaf,
  Pause,
  Play,
  List,
  Gear,
  WifiHigh,
  WifiSlash,
  GraduationCap,
  BookOpen,
  Check,
  Sparkle,
  DownloadSimple,
} from "@phosphor-icons/react";
import { asset, offlineHref } from "./assets";
import { ModelView } from "./ModelView";
import { Modal } from "./Modal";
import { Lesson } from "./Lesson";
import { Journey, Setup, TeacherStudio } from "./Workspace";
import { subjects, getLesson } from "./curriculum";
import {
  loadState,
  persist,
  getRecord,
  updateRecord,
  summarize,
} from "./store";
import { copy } from "./ui";
const positions = {
  mathematics: [48, 33],
  science: [80, 28],
  english: [64, 57],
  social: [91, 49],
  logic: [82, 78],
};
export function App() {
  const [state, setState] = useState(loadState),
    [panel, setPanel] = useState(null),
    [selected, setSelected] = useState(null),
    [menu, setMenu] = useState(false),
    [online, setOnline] = useState(navigator.onLine),
    [storageError, setStorageError] = useState(false),
    [inspect, setInspect] = useState("");
  const student =
      state.students.find((s) => s.id === state.activeId) || state.students[0],
    t = copy[student.language],
    hi = student.language === "hi",
    stats = summarize(student);
  useEffect(() => {
    setStorageError(!persist(state));
  }, [state]);
  useEffect(() => {
    document.documentElement.lang = student.language;
  }, [student.language]);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  const close = useCallback(() => {
    setSelected(null);
    setPanel(null);
    try {
      history.replaceState(null, "", location.pathname + location.search);
    } catch {}
  }, []);
  const open = useCallback((id) => {
    if (!subjects.some((s) => s.id === id)) return;
    setSelected(id);
    setPanel(null);
    setMenu(false);
    try {
      history.replaceState(null, "", "#subject-" + id);
    } catch {}
  }, []);
  function show(p) {
    setPanel(p);
    setSelected(null);
    setMenu(false);
  }
  useEffect(() => {
    const id = location.hash.replace("#subject-", "");
    if (subjects.some((s) => s.id === id)) open(id);
  }, [open]);
  useEffect(() => {
    const ob = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((n) => ob.observe(n));
    return () => ob.disconnect();
  }, []);
  const togglePause = () =>
    setState((s) => ({
      ...s,
      settings: { ...s.settings, paused: !s.settings.paused },
    }));
  const changeLanguage = (lang) =>
    setState((s) => ({
      ...s,
      students: s.students.map((p) =>
        p.id === s.activeId ? { ...p, language: lang } : p,
      ),
    }));
  const changeGrade = (grade) =>
    setState((s) => ({
      ...s,
      students: s.students.map((p) =>
        p.id === s.activeId ? { ...p, grade: Number(grade) } : p,
      ),
    }));
  const saveRecord = (patch) =>
    setState((s) =>
      updateRecord(s, s.activeId, selected, student.grade, patch),
    );
  return (
    <div className={state.settings.paused ? "app motion-paused" : "app"}>
      <a className="skip-link" href="#explore">
        {hi ? "विषयों पर जाएँ" : "Skip to subjects"}
      </a>
      <header inert={!!selected || !!panel} aria-hidden={!!selected || !!panel}>
        <a className="brand" href="#" onClick={close}>
          Quest Grove
          <Leaf size={22} weight="duotone" />
        </a>
        <nav className={menu ? "nav-open" : ""} aria-label="Main navigation">
          <a href="#explore" onClick={() => setMenu(false)}>
            {t.explore}
          </a>
          <button onClick={() => show("journey")}>{t.path}</button>
          <button onClick={() => show("teachers")}>{t.teachers}</button>
          <button className="mobile-setup" onClick={() => show("settings")}>
            {t.setup}
          </button>
        </nav>
        <div className="header-end">
          <button
            className={hi ? "language" : "language active"}
            onClick={() => changeLanguage("en")}
          >
            English
          </button>
          <span>/</span>
          <button
            className={hi ? "language active" : "language"}
            onClick={() => changeLanguage("hi")}
          >
            हिंदी
          </button>
          <button
            className="motion"
            aria-label={
              state.settings.paused ? "Resume animations" : "Pause animations"
            }
            onClick={togglePause}
          >
            {state.settings.paused ? <Play size={17} /> : <Pause size={17} />}
          </button>
          <button
            className="motion settings-toggle"
            aria-label="Learning setup"
            onClick={() => show("settings")}
          >
            <Gear size={18} />
          </button>
          <button
            className="motion mobile-menu"
            aria-label="Open navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <List size={19} />
          </button>
        </div>
      </header>
      <main inert={!!selected || !!panel} aria-hidden={!!selected || !!panel}>
        <section className="hero" aria-labelledby="home-heading">
          {state.settings.lowData ? (
            <img
              className="world-image"
              src={asset("/world.png")}
              alt="Learning islands connected by bridges"
              fetchPriority="high"
            />
          ) : (
            <div className="hero-3d">
              <ModelView
                model="world"
                world
                large
                paused={state.settings.paused}
                onSubject={open}
              />
            </div>
          )}
          <div className="hero-copy">
            <p className="eyebrow">
              {hi ? "आपके लिए बनी दुनिया" : "A WORLD BUILT AROUND YOU"}
            </p>
            <h1 id="home-heading">
              {hi ? (
                <>
                  थोड़ी जिज्ञासा।
                  <br />
                  संभावनाओं
                  <br />
                  की दुनिया।
                </>
              ) : (
                <>
                  A little
                  <br />
                  curiosity.
                  <br />A world of
                  <br />
                  <em>possibility.</em>
                </>
              )}
            </h1>
            <p className="hero-description">{t.homeDescription}</p>
            <button className="primary" onClick={() => open("mathematics")}>
              {t.begin}
              <ArrowRight size={21} />
            </button>
            <p className="hero-note">
              {hi
                ? "कक्षा 6–10 के जिज्ञासु विद्यार्थियों के लिए"
                : "For curious minds in Classes 6–10"}
            </p>
          </div>
          <div className="island-hotspots" aria-label="Choose a subject island">
            {subjects.map((s) => (
              <button
                key={s.id}
                className={"island island-" + s.id}
                style={{
                  left: positions[s.id][0] + "%",
                  top: positions[s.id][1] + "%",
                }}
                onClick={() => open(s.id)}
                aria-label={"Open " + s.name}
              >
                <span className="island-label">
                  {hi ? s.hi : s.name}
                  <ArrowUpRight size={14} />
                </span>
                <span className="island-dot" />
              </button>
            ))}
          </div>
          <div className="hero-bottom">
            <a href="#discover" className="scroll-hint">
              <ArrowDown size={18} />
              {hi ? "नीचे खोजें" : "SCROLL TO DISCOVER"}
            </a>
            <p>
              <Compass size={23} />
              {hi ? "किसी द्वीप को चुनें" : "Choose an island to discover more"}
            </p>
            <span className="chapter">01 — 04</span>
          </div>
        </section>
        <section className="learner-strip" aria-label="Current learner">
          <div>
            <Leaf size={19} />
            <span>
              {hi ? "वापस स्वागत है" : "Welcome to your grove"},{" "}
              <strong>{student.name}</strong>
            </span>
          </div>
          <label className="profile-picker">
            <span>{t.profile}</span>
            <select
              aria-label="Switch learner"
              value={student.id}
              onChange={(e) => {
                setState((s) => ({ ...s, activeId: e.target.value }));
                close();
              }}
            >
              {state.students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <button className="strip-points" onClick={() => show("journey")}>
            <Sparkle size={17} />
            {stats.xp} {hi ? "अंक" : "curiosity points"}
          </button>
          <span className="connection">
            {online ? <WifiHigh size={16} /> : <WifiSlash size={16} />}{" "}
            {online ? t.online : t.offline}
          </span>
        </section>
        <section className="discover section reveal" id="discover">
          <div className="section-copy">
            <p className="eyebrow">
              01 / {hi ? "खोजकर सीखें" : "DISCOVER BY DOING"}
            </p>
            <h2>
              {hi ? (
                <>
                  अनदेखी बातें,
                  <br />
                  <em>अब समझ में आएँ।</em>
                </>
              ) : (
                <>
                  Make the invisible,
                  <br />
                  <em>understandable.</em>
                </>
              )}
            </h2>
            <p>
              {hi
                ? "परमाणुओं से पृथ्वी तक, अवधारणाओं को करीब से देखें। छुएँ, घुमाएँ और नए संबंध बनाएँ।"
                : "From atoms to our planet, get closer to the ideas behind the textbook. Turn them around. Take them apart. Make a new connection."}
            </p>
            <button className="text-link" onClick={() => open("science")}>
              {hi
                ? "विज्ञान प्रयोगशाला में जाएँ"
                : "Step inside the science lab"}
              <ArrowUpRight size={20} />
            </button>
            <span className="micro">
              {hi
                ? "वास्तविक 3D · घुमाएँ · क्लिक करें"
                : "REAL 3D · DRAG TO ROTATE · CLICK TO EXPLORE"}
            </span>
          </div>
          <div className="science-stage">
            {state.settings.lowData ? (
              <img
                className="fallback-model"
                src={asset("/previews/science.png")}
                alt="Water molecule"
              />
            ) : (
              <ModelView
                model="science"
                paused={state.settings.paused}
                large
                onInspect={setInspect}
              />
            )}
            <div className="model-caption">
              {inspect ||
                "H₂O · " +
                  (hi
                    ? "एक छोटा अणु, एक अद्भुत दुनिया"
                    : "A small molecule, a remarkable world")}
            </div>
          </div>
        </section>
        <section className="explore section reveal" id="explore">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                02 /{" "}
                {hi ? "अपनी जिज्ञासा के साथ चलें" : "FOLLOW YOUR CURIOSITY"}
              </p>
              <h2>
                {hi ? (
                  <>
                    आज आप क्या
                    <br />
                    <em>खोजना चाहेंगे?</em>
                  </>
                ) : (
                  <>
                    Where will you
                    <br />
                    <em>wander today?</em>
                  </>
                )}
              </h2>
            </div>
            <p>
              {hi
                ? "पाँच दुनिया। नए संबंध।"
                : "Five worlds. Endless connections."}
              <br />
              {hi ? "अपना विषय चुनें।" : "Choose a subject and make it yours."}
            </p>
            <label className="class-control">
              {t.class.toUpperCase()}
              <select
                aria-label="Choose your class"
                value={student.grade}
                onChange={(e) => changeGrade(e.target.value)}
              >
                {[6, 7, 8, 9, 10].map((g) => (
                  <option key={g} value={g}>
                    {t.class} {g}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="subject-grid">
            {subjects.map((s, i) => {
              const r = getRecord(student, s.id),
                l = getLesson(s.id, student.grade, student.language);
              return (
                <button
                  className="subject-card"
                  key={s.id}
                  onClick={() => open(s.id)}
                >
                  <span className="subject-number">
                    0{i + 1} / {s.place}
                  </span>
                  <img
                    src={asset(
                      "/previews/" + modelFor(s.id, student.grade) + ".png",
                    )}
                    alt=""
                    loading="lazy"
                  />
                  <div>
                    <h3>{hi ? s.hi : s.name}</h3>
                    <ArrowUpRight size={24} />
                  </div>
                  <p className="subject-topic">{l.title}</p>
                  <div className="card-progress">
                    <progress
                      value={r.mastery}
                      max="100"
                      aria-label={s.name + " understanding"}
                    />
                    <span>{r.mastery}%</span>
                  </div>
                  <p>{r.history.length ? t[r.level] : t.start}</p>
                </button>
              );
            })}
          </div>
          <p className="curriculum-scope">{t.notSyllabus}</p>
        </section>
        <section className="path-section section reveal">
          <div>
            <p className="eyebrow">
              03 / {hi ? "आपके साथ बढ़ता रास्ता" : "A PATH THAT GROWS WITH YOU"}
            </p>
            <h2>
              {hi ? (
                <>
                  अलग सोच।
                  <br />
                  <em>अलग यात्राएँ।</em>
                </>
              ) : (
                <>
                  Different minds.
                  <br />
                  <em>Different journeys.</em>
                </>
              )}
            </h2>
            <p>
              {hi
                ? "पहले जानें कि आप कहाँ हैं। सही उत्तरों पर आगे बढ़ें, कठिनाई हो तो बुनियाद दोहराएँ। कोई दौड़ नहीं, कोई समय सीमा नहीं।"
                : "Start with what you know. Move further when a concept clicks, and revisit a foundation when you need it. No racing. No falling behind."}
            </p>
            <button className="primary" onClick={() => show("journey")}>
              {t.path}
              <ArrowRight size={20} />
            </button>
          </div>
          <div className="path-steps">
            {(hi
              ? [
                  [
                    "01",
                    "सीखें",
                    "मॉडल से विचार समझें। जरूरत हो तो पुरानी अवधारणा दोहराएँ।",
                  ],
                  [
                    "02",
                    "अभ्यास",
                    "उत्तर के आधार पर आसान या चुनौतीपूर्ण प्रश्न पाएँ।",
                  ],
                  [
                    "03",
                    "जाँचें",
                    "समझ जाँचें और शिक्षक के साथ अगला कदम तय करें।",
                  ],
                ]
              : [
                  [
                    "01",
                    "Learn",
                    "Meet the idea through a model, with a foundation to revisit when needed.",
                  ],
                  [
                    "02",
                    "Solve",
                    "Get a useful hint and a question that responds to your recent answers.",
                  ],
                  [
                    "03",
                    "Test",
                    "Check your understanding and share the next step with your teacher.",
                  ],
                ]
            ).map(([n, title, desc]) => (
              <article key={n}>
                <span>{n}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
                <Check size={20} />
              </article>
            ))}
            <p className="path-footnote">
              <Sparkle size={18} />
              {hi ? "आपकी गति ही सही गति है।" : "Your pace is the right pace."}
            </p>
          </div>
        </section>
        <section className="teachers section reveal">
          <div className="teacher-art">
            {state.settings.lowData ? (
              <img
                className="fallback-model"
                src={asset("/previews/mathematics.png")}
                alt="Geometry model"
              />
            ) : (
              <ModelView
                model="observatory"
                paused={state.settings.paused}
                large
              />
            )}
            <span className="teacher-tag">
              {hi
                ? "हर विद्यार्थी की समझ की झलक।"
                : "A clearer view of every learner."}
            </span>
          </div>
          <div>
            <p className="eyebrow">
              04 / {hi ? "शिक्षक सबसे महत्वपूर्ण" : "TEACHERS AT THE HEART"}
            </p>
            <h2>
              {hi ? (
                <>
                  थोड़ी समझ।
                  <br />
                  <em>बड़ा असर।</em>
                </>
              ) : (
                <>
                  A little insight.
                  <br />
                  <em>A lasting impact.</em>
                </>
              )}
            </h2>
            <p>
              {hi
                ? "समझें कि किसे मदद चाहिए। अपनी टिप्पणी और अगला काम जोड़ें। तकनीक साथ देती है, शिक्षक रास्ता दिखाते हैं।"
                : "See where understanding takes root, where a student needs a hand, and what to teach next. Leave guidance, set a task, and make the next lesson more personal."}
            </p>
            <button className="text-link" onClick={() => show("teachers")}>
              {t.teachers}
              <ArrowUpRight size={21} />
            </button>
          </div>
        </section>
        <section className="access-section section reveal">
          <div>
            <WifiSlash size={30} />
            <h3>
              {hi ? "कम डेटा। ज्यादा खोज।" : "Less data. More discovery."}
            </h3>
            <p>
              {hi
                ? "साझा उपकरण की प्रोफ़ाइल, हिंदी पाठ और डाउनलोड करने योग्य ऑफ़लाइन संस्करण।"
                : "Shared-device profiles, Hindi lesson content, and an offline version you can take with you."}
            </p>
          </div>
          <div className="access-actions">
            <button className="secondary" onClick={() => show("settings")}>
              <Gear size={18} />
              {t.setup}
            </button>
            <a
              className="secondary"
              href={offlineHref()}
              download="Quest-Grove-Offline.html"
            >
              <DownloadSimple size={18} />
              {t.download}
            </a>
          </div>
        </section>
      </main>
      <footer inert={!!selected || !!panel} aria-hidden={!!selected || !!panel}>
        <a className="brand" href="#">
          Quest Grove
          <Leaf size={20} />
        </a>
        <p>
          {hi
            ? "जिज्ञासा से जुड़े। साथ बढ़ें।"
            : "Rooted in curiosity. Growing together."}
        </p>
        <button onClick={() => show("about")}>
          {hi ? "हमारा विचार" : "About the project"}
        </button>
        <span>{t.local}</span>
      </footer>
      {storageError && (
        <div className="storage-notice" role="status">
          {hi
            ? "ब्राउज़र डेटा सहेज नहीं पा रहा है। इस सत्र की प्रगति खुली रहने तक रहेगी।"
            : "Your browser could not save progress. Current activity remains available until this session closes."}
        </div>
      )}
      {(selected || panel) && (
        <Modal
          title={
            selected
              ? subjects.find((s) => s.id === selected).name
              : panel === "teachers"
                ? "Teacher studio"
                : panel === "settings"
                  ? t.settings
                  : t.path
          }
          onClose={close}
          back={t.back}
          wide={!!selected || panel === "teachers"}
        >
          {selected ? (
            <Lesson
              key={student.id + selected + student.grade + student.language}
              subject={subjects.find((s) => s.id === selected)}
              student={student}
              settings={state.settings}
              saveRecord={saveRecord}
              onPath={() => show("journey")}
              togglePause={togglePause}
            />
          ) : panel === "journey" ? (
            <Journey student={student} onOpen={open} />
          ) : panel === "settings" ? (
            <Setup
              state={state}
              student={student}
              setState={setState}
              onDone={close}
            />
          ) : panel === "teachers" ? (
            <TeacherStudio state={state} setState={setState} onOpen={open} />
          ) : (
            <>
              <p className="eyebrow">CODE KERNEL ’26 / ADAPTIVE LEARNING</p>
              <h2>
                One classroom.
                <br />
                <em>Many ways to grow.</em>
              </h2>
              <p>
                Quest Grove is a working prototype for the challenge of adaptive
                learning in Indian Classes 6–10. It finds a starting point,
                adapts concept support and practice, checks understanding, and
                keeps teachers at the centre.
              </p>
              <div className="about-grid">
                <article>
                  <BookOpen size={24} />
                  <h3>Learn, Solve, Test</h3>
                  <p>
                    25 curated concept pathways with diagnostics, foundation
                    support, practice, stretch questions and checkpoints.
                  </p>
                </article>
                <article>
                  <GraduationCap size={24} />
                  <h3>Teachers guide the journey</h3>
                  <p>
                    Actual local attempts, concept gaps, observations, learner
                    tasks and classroom CSV exports.
                  </p>
                </article>
                <article>
                  <WifiSlash size={24} />
                  <h3>Built for real access</h3>
                  <p>
                    English/Hindi lesson content, shared-device profiles,
                    reduced motion, low-data previews and an offline package.
                  </p>
                </article>
              </div>
              <p className="subtle">
                {t.notSyllabus} This is a local prototype, not a production
                school system. No real student cloud accounts or server sync are
                enabled.
              </p>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
