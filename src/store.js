export const STORE_KEY = "quest-grove-v2";
export const makeRecord = () => ({
  history: [],
  diagnostic: [],
  tests: [],
  mastery: 0,
  level: "practice",
  note: "",
  assignment: "",
});
export const recordKey = (subject, grade) => `${subject}:${grade}`;
export function initialState() {
  return {
    version: 2,
    activeId: "learner-1",
    students: [
      {
        id: "learner-1",
        name: "Explorer 1",
        grade: 7,
        board: "CBSE / NCERT concepts",
        language: "en",
        records: {},
      },
      {
        id: "learner-2",
        name: "Explorer 2",
        grade: 8,
        board: "State board / concept practice",
        language: "hi",
        records: {},
      },
      {
        id: "learner-3",
        name: "Explorer 3",
        grade: 6,
        board: "CBSE / NCERT concepts",
        language: "en",
        records: {},
      },
    ],
    settings: { lowData: false, paused: false },
    updatedAt: null,
  };
}
export function loadState() {
  try {
    let s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (
      s?.version === 2 &&
      Array.isArray(s.students) &&
      s.students.length &&
      s.students.some((p) => p.id === s.activeId)
    )
      return s;
  } catch {}
  return initialState();
}
export function persist(s) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}
export function updateRecord(state, studentId, subject, grade, change) {
  return {
    ...state,
    updatedAt: new Date().toISOString(),
    students: state.students.map((s) =>
      s.id === studentId
        ? {
            ...s,
            records: {
              ...s.records,
              [recordKey(subject, grade)]: {
                ...makeRecord(),
                ...s.records[recordKey(subject, grade)],
                ...change,
              },
            },
          }
        : s,
    ),
  };
}
export function getRecord(student, subject, grade = student.grade) {
  return { ...makeRecord(), ...student.records[recordKey(subject, grade)] };
}
export function summarize(student) {
  let records = Object.values(student.records),
    attempts = records.flatMap((r) => r.history || []),
    tests = records.flatMap((r) => r.tests || []);
  return {
    attempts: attempts.length,
    accuracy: attempts.length
      ? Math.round(
          (100 * attempts.filter((a) => a.correct).length) / attempts.length,
        )
      : null,
    mastered: records.filter(
      (r) => r.mastery >= 80 && r.checkpointLevel === "stretch",
    ).length,
    checkpoints: tests.length,
    xp: attempts.reduce((p, a) => p + (a.correct ? 20 : 5), 0),
    needsHelp: records.some(
      (r) => r.level === "foundation" && r.history.length > 0,
    ),
  };
}
export function csvReport(students, subjectList) {
  const rows = [
    [
      "Learner alias",
      "Class",
      "Board preference",
      "Subject",
      "Mastery %",
      "Practice attempts",
      "Recommended pace",
      "Teacher note",
    ],
  ];
  for (const s of students)
    for (const subject of subjectList) {
      const r = getRecord(s, subject.id);
      rows.push([
        s.name,
        s.grade,
        s.board,
        subject.name,
        r.mastery,
        r.history.length,
        r.level,
        r.note,
      ]);
    }
  return rows
    .map((row) =>
      row
        .map(
          (v) =>
            '"' +
            String(v ?? "")
              .replaceAll('"', '""')
              .replace(/^[=+@-]/, "'") +
            '"',
        )
        .join(","),
    )
    .join("\r\n");
}
