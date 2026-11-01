import { offlineHref } from "./assets";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  BookOpen,
  DownloadSimple,
  GraduationCap,
  Leaf,
  Plus,
  WifiSlash,
} from "@phosphor-icons/react";
import { subjects, getLesson } from "./curriculum";
import { getRecord, summarize, csvReport, recordKey } from "./store";
import { copy, downloadFile } from "./ui";
export function Journey({ student, onOpen }) {
  const hi = student.language === "hi",
    t = copy[student.language],
    stats = summarize(student);
  return (
    <>
      <p className="eyebrow">
        {student.name} / {t.class} {student.grade}
      </p>
      <h2>
        {hi ? (
          <>
            हर खोज के साथ
            <br />
            <em>थोड़ा आगे।</em>
          </>
        ) : (
          <>
            One discovery
            <br />
            <em>at a time.</em>
          </>
        )}
      </h2>
      <div className="learning-stats">
        <div>
          <strong>{stats.xp}</strong>
          <span>{hi ? "जिज्ञासा अंक" : "Curiosity points"}</span>
        </div>
        <div>
          <strong>{stats.mastered}/5</strong>
          <span>{hi ? "मजबूत अवधारणाएँ" : "Concepts growing strong"}</span>
        </div>
        <div>
          <strong>
            {stats.accuracy === null ? "—" : stats.accuracy + "%"}
          </strong>
          <span>{hi ? "उत्तर सटीकता" : "Answer accuracy"}</span>
        </div>
      </div>
      <div className="journey-list">
        {subjects.map((s) => {
          const r = getRecord(student, s.id),
            l = getLesson(s.id, student.grade, student.language);
          return (
            <button key={s.id} onClick={() => onOpen(s.id)}>
              <span
                className={
                  "progress-marker " +
                  (r.mastery >= 80 && r.checkpointLevel === "stretch"
                    ? "done"
                    : "")
                }
              >
                {r.mastery >= 80 && r.checkpointLevel === "stretch" ? (
                  <Check />
                ) : (
                  <BookOpen />
                )}
              </span>
              <div className="journey-details">
                <h3>{hi ? s.hi : s.name}</h3>
                <p>{l.title}</p>
                <div className="mastery-line">
                  <progress
                    max="100"
                    value={r.mastery}
                    aria-label={(hi ? s.hi : s.name) + " " + t.mastery}
                  />
                  <span>{r.mastery}%</span>
                </div>
                <p>
                  {r.tests.length
                    ? (hi ? "जाँच स्तर: " : "Checkpoint level: ") +
                      t[r.checkpointLevel || "practice"]
                    : ""}
                </p>
                <p>
                  {r.assignment
                    ? `${t.assignment}: ${r.assignment}`
                    : r.history.length
                      ? t[r.level]
                      : t.diagnostic}
                </p>
              </div>
              <ArrowUpRight size={22} />
            </button>
          );
        })}
      </div>
      <p className="subtle">{t.local}</p>
    </>
  );
}
export function Setup({ state, student, setState, onDone }) {
  const [name, setName] = useState(student.name),
    [grade, setGrade] = useState(student.grade),
    [language, setLanguage] = useState(student.language),
    [board, setBoard] = useState(student.board),
    [notice, setNotice] = useState("");
  const t = copy[language],
    hi = language === "hi";
  function save(e) {
    e.preventDefault();
    setState((s) => ({
      ...s,
      students: s.students.map((p) =>
        p.id === student.id
          ? {
              ...p,
              name: name.trim() || p.name,
              grade: Number(grade),
              language,
              board,
            }
          : p,
      ),
    }));
    onDone();
  }
  function add() {
    if (state.students.length >= 40) {
      setNotice(
        hi
          ? "इस डेमो में अधिकतम 40 प्रोफ़ाइल हैं।"
          : "This demo supports up to 40 local profiles.",
      );
      return;
    }
    const id = "learner-" + crypto.randomUUID();
    setState((s) => ({
      ...s,
      activeId: id,
      students: [
        ...s.students,
        {
          id,
          name: "Explorer " + (s.students.length + 1),
          grade: 7,
          language: "en",
          board: "CBSE / NCERT concepts",
          records: {},
        },
      ],
    }));
    onDone();
  }
  return (
    <>
      <p className="eyebrow">
        {hi ? "आपका अपना रास्ता" : "MAKE YOURSELF AT HOME"}
      </p>
      <h2>{t.setup}</h2>
      <p>
        {hi
          ? "साझा फोन पर प्रत्येक विद्यार्थी अपनी प्रोफ़ाइल चुन सकता है। यह लॉगिन या निजी स्कूल खाता नहीं है।"
          : "Sharing a phone? Each learner can choose a local profile. These are demo profiles, not authenticated school accounts."}
      </p>
      <form onSubmit={save} className="setup-form">
        <label>
          {hi ? "उपनाम" : "Learner alias"}
          <input
            aria-label="Learner alias"
            maxLength="32"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <div className="form-row">
          <label>
            {t.class}
            <select
              aria-label="Profile class"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              {[6, 7, 8, 9, 10].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label>
            {hi ? "भाषा" : "Learning language"}
            <select
              aria-label="Learning language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </label>
        </div>
        <label>
          {hi ? "बोर्ड की पसंद" : "Board preference"}
          <select value={board} onChange={(e) => setBoard(e.target.value)}>
            <option>CBSE / NCERT concepts</option>
            <option>State board / concept practice</option>
            <option>ICSE / concept practice</option>
          </select>
        </label>
        <p className="subtle">{t.notSyllabus}</p>
        <button className="primary" type="submit">
          {t.save}
          <Check size={18} />
        </button>
      </form>
      <div className="device-settings">
        <label>
          <input
            type="checkbox"
            checked={state.settings.lowData}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                settings: { ...s.settings, lowData: e.target.checked },
              }))
            }
          />
          <div>
            <strong>{hi ? "कम डेटा मोड" : "Low-data mode"}</strong>
            <p>
              {hi
                ? "लाइव 3D की जगह छोटे चित्र दिखाता है। पाठ और अभ्यास उपलब्ध रहते हैं।"
                : "Uses still previews instead of loading live 3D. Lessons and practice remain available."}
            </p>
          </div>
        </label>
        <label>
          <input
            type="checkbox"
            checked={state.settings.paused}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                settings: { ...s.settings, paused: e.target.checked },
              }))
            }
          />
          <div>
            <strong>{hi ? "एनीमेशन रोकें" : "Pause animations"}</strong>
            <p>
              {hi
                ? "सभी अपने-आप चलने वाली 3D गति रोकें।"
                : "Stop automatic 3D movement throughout the experience."}
            </p>
          </div>
        </label>
      </div>
      <div className="setup-actions">
        <button className="text-link" onClick={add}>
          <Plus size={17} />
          {hi ? "नई स्थानीय प्रोफ़ाइल" : "Add local learner profile"}
        </button>
        <a
          className="text-link"
          href={offlineHref()}
          download="Quest-Grove-Offline.html"
        >
          <DownloadSimple size={18} />
          {t.download}
        </a>
      </div>
      {notice && <p role="status">{notice}</p>}
      <p className="subtle">
        {hi
          ? "ऑफ़लाइन फ़ाइल में सभी पाठ और 3D मॉडल हैं। इसे डाउनलोड करके दोबारा खोलें।"
          : "The downloadable offline file contains all lessons and 3D models. Save it, then reopen it without a connection."}
      </p>
    </>
  );
}
export function TeacherStudio({ state, setState, onOpen }) {
  const [filter, setFilter] = useState("all"),
    [subject, setSubject] = useState("mathematics"),
    [studentId, setStudentId] = useState(state.activeId),
    [notice, setNotice] = useState("");
  const student =
      state.students.find((s) => s.id === studentId) || state.students[0],
    record = getRecord(student, subject),
    [note, setNote] = useState(record.note),
    [assignment, setAssignment] = useState(record.assignment);
  const list = state.students.filter(
    (s) => filter === "all" || String(s.grade) === filter,
  );
  const help = list.filter((s) => summarize(s).needsHelp).length,
    attempts = list.reduce((sum, s) => sum + summarize(s).attempts, 0);
  function chooseStudent(id) {
    setStudentId(id);
    const s = state.students.find((s) => s.id === id),
      r = getRecord(s, subject);
    setNote(r.note);
    setAssignment(r.assignment);
    setNotice("");
  }
  function chooseSubject(id) {
    setSubject(id);
    const r = getRecord(student, id);
    setNote(r.note);
    setAssignment(r.assignment);
    setNotice("");
  }
  function save(e) {
    e.preventDefault();
    setState((s) => ({
      ...s,
      students: s.students.map((p) =>
        p.id === student.id
          ? {
              ...p,
              records: {
                ...p.records,
                [recordKey(subject, p.grade)]: {
                  ...getRecord(p, subject),
                  note: note.trim(),
                  assignment: assignment.trim(),
                },
              },
            }
          : p,
      ),
    }));
    setNotice(
      "Guidance saved. This learner will see the task in their lesson and learning path.",
    );
  }
  return (
    <>
      <p className="eyebrow">TEACHER STUDIO / SHARED-DEVICE CLASSROOM</p>
      <h2>
        Every learner.
        <br />
        <em>A clearer picture.</em>
      </h2>
      <p>
        Follow understanding, spot prerequisite gaps, and choose the next step.
        These insights use attempts saved on this device. You guide the
        learning.
      </p>
      <div className="studio-toolbar">
        <label>
          Class filter
          <select
            aria-label="Teacher class filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All classes</option>
            {[6, 7, 8, 9, 10].map((g) => (
              <option key={g} value={g}>
                Class {g}
              </option>
            ))}
          </select>
        </label>
        <button
          className="secondary"
          onClick={() =>
            downloadFile(
              "Quest-Grove-classroom.csv",
              csvReport(list, subjects),
              "text/csv;charset=utf-8",
            )
          }
        >
          <DownloadSimple size={18} />
          Export class report
        </button>
      </div>
      <div className="teacher-summary">
        <div>
          <strong>{list.length}</strong>
          <span>Local learner profiles</span>
        </div>
        <div>
          <strong>{help}</strong>
          <span>Could use a concept revisit</span>
        </div>
        <div>
          <strong>{attempts}</strong>
          <span>Learning attempts</span>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Learner / Class</th>
              <th>Attempts</th>
              <th>Accuracy</th>
              <th>Understanding</th>
              <th>Suggested action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => {
              const sum = summarize(s);
              return (
                <tr key={s.id}>
                  <td>
                    <button
                      className="table-link"
                      onClick={() => chooseStudent(s.id)}
                    >
                      {s.name}
                    </button>
                    <small>
                      Class {s.grade} ·{" "}
                      {s.language === "hi" ? "हिंदी" : "English"}
                    </small>
                  </td>
                  <td>{sum.attempts}</td>
                  <td>
                    {sum.accuracy === null ? "No attempts" : sum.accuracy + "%"}
                  </td>
                  <td>{sum.mastered} / 5 strong concepts</td>
                  <td>
                    {!sum.attempts
                      ? "Invite the learner to try a starting diagnostic."
                      : sum.needsHelp
                        ? "Revisit a prerequisite using the model together."
                        : "Offer a worked example or an extension."}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!list.length && (
          <p className="empty">
            No learners in this class yet. Add a local profile in Learning
            setup.
          </p>
        )}
      </div>
      <section className="guidance-section">
        <div>
          <p className="eyebrow">YOUR GUIDANCE, THEIR NEXT STEP</p>
          <h3>Leave a little direction.</h3>
          <p>
            A teacher’s observation adds context that a score cannot. Choose a
            learner, review the concept, and set a task.
          </p>
          <p className="studio-note">
            <GraduationCap size={25} />
            Scores summarise this small practice sample. Use your judgement
            alongside classwork and discussion.
          </p>
        </div>
        <form onSubmit={save}>
          <div className="form-row">
            <label>
              Learner
              <select
                aria-label="Guidance learner"
                value={student.id}
                onChange={(e) => chooseStudent(e.target.value)}
              >
                {state.students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · Class {s.grade}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Concept
              <select
                aria-label="Guidance subject"
                value={subject}
                onChange={(e) => chooseSubject(e.target.value)}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="concept-note">
            <div>
              <strong>{getLesson(subject, student.grade).title}</strong>
              <p>
                {record.history.length} attempts · {record.mastery}%{" "}
                {record.checkpointLevel || "practice"} checkpoint ·{" "}
                {copy.en[record.level]}
              </p>
            </div>
          </div>
          <label>
            Teacher observation
            <textarea
              aria-label="Teacher observation"
              maxLength="600"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you notice when you discussed the concept?"
            />
          </label>
          <label>
            Task for the learner
            <textarea
              aria-label="Task for learner"
              maxLength="350"
              value={assignment}
              onChange={(e) => setAssignment(e.target.value)}
              placeholder="Try the model together, then explain the idea in your own words."
            />
          </label>
          <button className="primary" type="submit">
            Save guidance
            <Check size={18} />
          </button>
          {notice && (
            <p className="save-notice" role="status">
              {notice}
            </p>
          )}
        </form>
      </section>
      <div className="studio-boundary">
        <WifiSlash size={19} />
        <p>
          Works on a shared device, including offline. No cloud sync or real
          school authentication is active in this prototype. Export reports to
          share progress intentionally.
        </p>
      </div>
    </>
  );
}
