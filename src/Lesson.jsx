import { modelFor, mathExperiment } from "./experiments";
import { useState, useMemo, useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Sparkle,
  Pause,
  Play,
  ArrowsOut,
  SpeakerHigh,
} from "@phosphor-icons/react";
import { ModelView } from "./ModelView";
import { asset } from "./assets";
import { getLesson, recommend } from "./curriculum";
import { getRecord } from "./store";
import { copy } from "./ui";
export function Lesson({
  subject,
  student,
  settings,
  saveRecord,
  onPath,
  togglePause,
}) {
  useEffect(
    () => () => {
      window.speechSynthesis?.cancel();
    },
    [],
  );
  const lang = student.language,
    t = copy[lang],
    hi = lang === "hi",
    lesson = getLesson(subject.id, student.grade, lang),
    record = getRecord(student, subject.id);
  const [mode, setMode] = useState(
      record.diagnostic.length ? "Learn" : "Diagnose",
    ),
    [index, setIndex] = useState(0),
    [tier, setTier] = useState(record.level),
    [choice, setChoice] = useState(null),
    [checked, setChecked] = useState(false),
    [results, setResults] = useState([]),
    [finished, setFinished] = useState(false),
    [explode, setExplode] = useState(false),
    [wireframe, setWireframe] = useState(false),
    [inspected, setInspected] = useState(""),
    [speech, setSpeech] = useState(""),
    [base, setBase] = useState(4),
    [height, setHeight] = useState(6);
  const pool =
    mode === "Diagnose"
      ? lesson.diagnostic
      : mode === "Test"
        ? tier === "stretch"
          ? lesson.test
          : [...lesson.questions[tier], lesson.test.at(-1)]
        : lesson.questions[tier];
  const question = useMemo(
    () => pool[index % pool.length],
    [subject.id, student.grade, lang, mode, index, tier],
  );
  function changeMode(m) {
    setMode(m);
    setIndex(0);
    setChoice(null);
    setChecked(false);
    setResults([]);
    setFinished(false);
    setTier(record.level);
  }
  function check() {
    if (choice === null || checked) return;
    const correct = choice === question.answer;
    const a = {
      questionId: question.id,
      correct,
      mode,
      level: tier,
      at: new Date().toISOString(),
    };
    const history = [...record.history, a];
    let next = recommend(history.filter((h) => h.mode === "Solve"));
    let patch = { history, level: next.level };
    const r = [...results, a];
    setResults(r);
    setChecked(true);
    if (mode !== "Solve" && index === pool.length - 1) {
      setFinished(true);
      const score = r.filter((a) => a.correct).length;
      if (mode === "Diagnose") {
        patch.diagnostic = r;
        patch.level =
          score === r.length
            ? "stretch"
            : score >= r.length / 2
              ? "practice"
              : "foundation";
      } else {
        patch.tests = [...record.tests, { score, total: r.length, at: a.at }];
        patch.mastery = Math.round((score / r.length) * 100);
        patch.checkpointLevel = tier;
        patch.level =
          score / r.length >= 2 / 3
            ? tier === "foundation"
              ? "practice"
              : "stretch"
            : "foundation";
      }
    }
    saveRecord(patch);
  }
  function next() {
    setIndex((i) => i + 1);
    setChoice(null);
    setChecked(false);
    if (mode === "Solve") setTier(record.level);
  }
  function readAloud() {
    if (!("speechSynthesis" in window)) {
      setSpeech(
        hi
          ? "इस ब्राउज़र में आवाज़ उपलब्ध नहीं है।"
          : "Read aloud is unavailable in this browser.",
      );
      return;
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(
      lesson.intro + " " + lesson.explanation,
    );
    u.lang = hi ? "hi-IN" : "en-IN";
    u.rate = 0.88;
    u.onend = () => setSpeech("");
    u.onerror = () => setSpeech("");
    speechSynthesis.speak(u);
    setSpeech(hi ? "पढ़ा जा रहा है…" : "Reading aloud…");
  }
  const experiment = mathExperiment(student.grade, base, height, hi),
    model = modelFor(subject.id, student.grade);
  const success = choice === question.answer;
  return (
    <>
      <div className="lesson-heading">
        <div>
          <p className="eyebrow">
            {subject.place} / {t.class} {student.grade}
          </p>
          <h2>{hi ? subject.hi : subject.name}</h2>
          <p className="lesson-topic">{lesson.title}</p>
        </div>
        <span className="lesson-badge">{t[record.level]}</span>
      </div>
      {record.assignment && (
        <aside className="assignment">
          <GraduationMarker />
          <div>
            <strong>{t.assignment}</strong>
            <p>{record.assignment}</p>
          </div>
        </aside>
      )}
      <div className="lesson-layout">
        <div className="lesson-model">
          <div className="lesson-visual">
            {settings.lowData ? (
              <img
                src={asset("/previews/" + model + ".png")}
                alt={lesson.title}
              />
            ) : (
              <ModelView
                model={model}
                paused={settings.paused}
                explode={explode}
                wireframe={wireframe}
                large
                onInspect={setInspected}
              />
            )}
          </div>
          <p className="inspection" aria-live="polite">
            {inspected
              ? `${hi ? "आपने खोजा" : "You found"}: ${inspected}`
              : hi
                ? "घुमाकर देखें · किसी हिस्से पर क्लिक करें"
                : "Drag to rotate · Click a part to discover it"}
          </p>
          <div className="experiment-controls">
            <button onClick={togglePause}>
              {settings.paused ? <Play size={15} /> : <Pause size={15} />}{" "}
              {hi ? "गति" : "Motion"}
            </button>
            <button aria-pressed={explode} onClick={() => setExplode(!explode)}>
              <ArrowsOut size={15} />
              {hi ? "हिस्से अलग करें" : "Explore parts"}
            </button>
            <button
              aria-pressed={wireframe}
              onClick={() => setWireframe(!wireframe)}
            >
              {hi ? "ढाँचा" : "Wireframe"}
            </button>
          </div>
          <div className="mini-lab">
            <p className="eyebrow">
              {subject.id === "mathematics"
                ? experiment.title
                : hi
                  ? "अपना प्रयोग करें"
                  : "YOUR LITTLE EXPERIMENT"}
            </p>
            {subject.id === "mathematics" ? (
              <>
                <label>
                  {experiment.a}: {base}
                  <input
                    aria-label="Experiment first value"
                    type="range"
                    min={experiment.minA}
                    max={experiment.maxA}
                    value={base}
                    onChange={(e) => setBase(+e.target.value)}
                  />
                </label>
                <label>
                  {experiment.b}: {height}
                  <input
                    aria-label="Experiment second value"
                    type="range"
                    min={experiment.minB}
                    max={experiment.maxB}
                    value={height}
                    onChange={(e) => setHeight(+e.target.value)}
                  />
                </label>
                <output>
                  <strong>{experiment.text}</strong>
                </output>
                <small>{experiment.note}</small>
              </>
            ) : (
              <p>
                {hi
                  ? "हिस्से अलग करें और देखें कि वे कैसे जुड़ते हैं। मॉडल एक अवधारणा को दिखाता है, वास्तविक पैमाने पर नहीं है।"
                  : "Separate the parts to see how they fit together. The model illustrates a concept and is not drawn to physical scale."}
              </p>
            )}
          </div>
        </div>
        <div className="lesson-content">
          <div className="tabs" role="tablist" aria-label="Learning modes">
            {["Diagnose", "Learn", "Solve", "Test"].map((m) => (
              <button
                key={m}
                id={"tab-" + m}
                role="tab"
                aria-controls="learning-panel"
                aria-selected={m === mode}
                onClick={() => changeMode(m)}
              >
                {m === "Diagnose"
                  ? hi
                    ? "शुरुआत"
                    : "Start"
                  : t[m.toLowerCase()]}
              </button>
            ))}
          </div>
          <div
            id="learning-panel"
            role="tabpanel"
            aria-labelledby={"tab-" + mode}
          >
            {mode === "Learn" ? (
              <>
                <p className="eyebrow">{t[record.level]}</p>
                <h3>{lesson.title}</h3>
                <p>{lesson.intro}</p>
                {record.level === "foundation" && (
                  <div className="concept-note">
                    <BookOpen size={22} />
                    <div>
                      <strong>
                        {hi ? "पहले यह दोहराएँ" : "A foundation to revisit"}
                      </strong>
                      <ul>
                        {lesson.prerequisites.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <div className="concept-note">
                  <BookOpen size={23} />
                  <p>{lesson.explanation}</p>
                </div>
                <div className="worked-example">
                  <p className="eyebrow">
                    {hi ? "आपके स्तर का उदाहरण" : "AN EXAMPLE AT YOUR LEVEL"}
                  </p>
                  <strong>{lesson.questions[record.level][0].prompt}</strong>
                  <p>
                    {hi ? "उत्तर" : "Answer"}:{" "}
                    {
                      lesson.questions[record.level][0].options[
                        lesson.questions[record.level][0].answer
                      ]
                    }
                  </p>
                  <p>{lesson.questions[record.level][0].explanation}</p>
                </div>
                <button className="text-link" onClick={readAloud}>
                  <SpeakerHigh size={18} />
                  {hi ? "सुनकर सीखें" : "Read this aloud"}
                </button>
                {speech && <p role="status">{speech}</p>}
                <button className="primary" onClick={() => changeMode("Solve")}>
                  {t.solve}
                  <ArrowRight size={19} />
                </button>
                <p className="lesson-footnote">
                  {hi
                    ? "जब चाहें रुकें। कोई समय सीमा नहीं है।"
                    : "Pause whenever you need. There is no timer."}
                </p>
              </>
            ) : finished ? (
              <div className="checkpoint-result" role="status">
                <Sparkle size={40} weight="duotone" />
                <p className="eyebrow">
                  {mode === "Diagnose"
                    ? hi
                      ? "आपकी शुरुआत तैयार है"
                      : "YOUR STARTING POINT IS READY"
                    : t.completed}
                </p>
                <h3>
                  {results.filter((a) => a.correct).length} / {results.length}
                </h3>
                <p>
                  {mode === "Diagnose"
                    ? hi
                      ? "आपकी सीखने की गति आपके उत्तरों के अनुसार तय हुई है।"
                      : "Your starting level now reflects these answers."
                    : hi
                      ? "आपकी जाँच शिक्षक स्टूडियो और आपकी यात्रा में दिखेगी।"
                      : "Your checkpoint now appears in your path and teacher studio."}
                </p>
                <div className="pace-tag">{t[record.level]}</div>
                <button className="primary" onClick={() => changeMode("Learn")}>
                  {t.learn}
                  <ArrowRight size={19} />
                </button>
                <button className="text-link" onClick={onPath}>
                  {t.path}
                  <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <>
                <div className="question-heading">
                  <p className="eyebrow">
                    {mode === "Diagnose"
                      ? t.diagnostic
                      : mode === "Solve"
                        ? t[tier]
                        : t.test}
                  </p>
                  <span>
                    {mode === "Solve"
                      ? `${hi ? "प्रयास" : "Try"} ${index + 1}`
                      : `${index + 1} / ${pool.length}`}
                  </span>
                </div>
                <h3>{question.prompt}</h3>
                <div className="answers">
                  {question.options.map((option, i) => (
                    <button
                      key={i}
                      aria-label={
                        "Option " + String.fromCharCode(65 + i) + ": " + option
                      }
                      className={choice === i ? "chosen" : ""}
                      aria-pressed={choice === i}
                      disabled={checked}
                      onClick={() => setChoice(i)}
                    >
                      <span>{String.fromCharCode(65 + i)}</span>
                      {option}
                      {checked && i === question.answer && <Check size={20} />}
                    </button>
                  ))}
                </div>
                {!checked ? (
                  <>
                    <button
                      className="primary"
                      disabled={choice === null}
                      onClick={check}
                    >
                      {t.check}
                      <ArrowRight size={18} />
                    </button>
                    {mode !== "Test" && (
                      <details>
                        <summary>{t.hint}</summary>
                        <p>{lesson.hint}</p>
                      </details>
                    )}
                  </>
                ) : (
                  <>
                    <div
                      className={
                        "feedback " + (success ? "correct" : "needs-work")
                      }
                      role="status"
                    >
                      <strong>{success ? t.correct : t.wrong}</strong>
                      <p>{question.explanation}</p>
                      <p>
                        {hi ? "अगला कदम" : "Next step"}: {t[record.level]}
                      </p>
                    </div>
                    <button className="primary" onClick={next}>
                      {mode === "Solve"
                        ? hi
                          ? "अगली चुनौती"
                          : "Next challenge"
                        : t.next}
                      <ArrowRight size={18} />
                    </button>
                    {mode === "Solve" && (
                      <button
                        className="text-link"
                        onClick={() => changeMode(success ? "Test" : "Learn")}
                      >
                        {success ? t.test : t.learn}
                        <ArrowRight size={18} />
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="lesson-footer">
        <span>{t.saved}</span>
        <span>{t.notSyllabus}</span>
      </div>
    </>
  );
}
function GraduationMarker() {
  return <BookOpen size={22} />;
}
