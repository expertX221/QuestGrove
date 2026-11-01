import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { pathToFileURL } from "node:url";
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});
for (const k of [
  "window",
  "document",
  "navigator",
  "localStorage",
  "HTMLElement",
  "Node",
  "history",
  "location",
  "getComputedStyle",
  "MutationObserver",
])
  Object.defineProperty(globalThis, k, {
    value: dom.window[k],
    configurable: true,
  });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.IntersectionObserver = class {
  observe() {}
  disconnect() {}
};
globalThis.ResizeObserver = class {
  observe() {}
  disconnect() {}
};
const React = await import("react");
const { render, screen, within, fireEvent, cleanup, waitFor } =
  await import("@testing-library/react");
const { getLesson } = await import("../src/curriculum.js");
const { STORE_KEY } = await import("../src/store.js");
// This test is launched through scripts/test-ui.mjs, which stubs GPU rendering only.
const { App } = process.env.QUEST_APP_MODULE
  ? await import(pathToFileURL(process.env.QUEST_APP_MODULE))
  : { App: null };
afterEach(() => {
  cleanup();
  localStorage.clear();
  history.replaceState(null, "", "/");
});
const click = (name) =>
  fireEvent.click(screen.getAllByRole("button", { name, exact: true })[0]);
const chooseAnswer = (question, correct = true) => {
  const index = correct
    ? question.answer
    : (question.answer + 1) % question.options.length;
  fireEvent.click(
    screen.getByRole("button", {
      name:
        "Option " +
        String.fromCharCode(65 + index) +
        ": " +
        question.options[index],
      exact: true,
    }),
  );
  click("Check answer");
};
test(
  "learner diagnostic, adaptive struggle, checkpoint persistence and teacher guidance",
  { skip: !App },
  () => {
    render(React.createElement(App));
    click("Open Mathematics");
    assert.ok(screen.getByRole("dialog", { name: "Mathematics" }));
    const lesson = getLesson("mathematics", 7);
    for (let i = 0; i < 3; i++) {
      chooseAnswer(lesson.diagnostic[i]);
      if (i < 2) click("Continue");
    }
    assert.ok(screen.getByText("YOUR STARTING POINT IS READY"));
    click("Learn");
    fireEvent.click(screen.getByRole("tab", { name: "Solve", exact: true }));
    chooseAnswer(lesson.questions.stretch[0], false);
    click("Next challenge");
    chooseAnswer(lesson.questions.practice[1], false);
    assert.ok(screen.getByText("Next step: Revisit the basics"));
    fireEvent.click(screen.getByRole("tab", { name: "Learn", exact: true }));
    assert.ok(screen.getByText("A foundation to revisit"));
    fireEvent.click(screen.getByRole("tab", { name: "Test", exact: true }));
    const checkpoint = [...lesson.questions.foundation, lesson.test.at(-1)];
    for (let i = 0; i < 3; i++) {
      chooseAnswer(checkpoint[i]);
      if (i < 2) click("Continue");
    }
    assert.ok(screen.getByText("Checkpoint complete"));
    click("My path");
    assert.ok(within(screen.getByRole("dialog")).getByText("100%"));
    click("Close");
    click("Teacher studio");
    fireEvent.change(screen.getByLabelText("Teacher observation"), {
      target: { value: "Needs help explaining a negative change." },
    });
    fireEvent.change(screen.getByLabelText("Task for learner"), {
      target: { value: "Use the number line with your teacher." },
    });
    click("Save guidance");
    assert.ok(screen.getByRole("status"));
    click("Close");
    click("Open Mathematics");
    assert.ok(screen.getByText("Use the number line with your teacher."));
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    assert.equal(saved.students[0].records["mathematics:7"].mastery, 100);
    assert.equal(saved.students[0].records["mathematics:7"].tests.length, 1);
  },
);
test(
  "all subject islands open; class changes concept; Hindi and shared profiles work",
  { skip: !App },
  () => {
    render(React.createElement(App));
    for (const name of [
      "Science",
      "English",
      "Social Studies",
      "Logic & Problem Solving",
    ]) {
      click("Open " + name);
      assert.ok(screen.getByRole("dialog", { name }));
      click("Close");
    }
    fireEvent.change(screen.getByLabelText("Choose your class"), {
      target: { value: "10" },
    });
    click("Open Science");
    assert.ok(
      within(screen.getByRole("dialog")).getByText("Electric circuits"),
    );
    click("Close");
    click("हिंदी");
    click("Open Science");
    assert.ok(within(screen.getByRole("dialog")).getByText("विद्युत परिपथ"));
    assert.ok(screen.getByText("प्रतिरोध की SI इकाई?"));
    click("Close");
    fireEvent.change(screen.getByLabelText("Switch learner"), {
      target: { value: "learner-2" },
    });
    assert.equal(document.documentElement.lang, "hi");
    assert.equal(screen.getByLabelText("Choose your class").value, "8");
  },
);

test(
  "cloud connection protects local work until an explicit restore",
  { skip: !App },
  async () => {
    const originalFetch = globalThis.fetch;
    const { initialState } = await import("../src/store.js");
    const snapshot = initialState();
    snapshot.students[0].name = "Restored learner";
    const meta = {
      available: true,
      connected: true,
      id: "test-workspace",
      revision: 4,
      updatedAt: "2026-11-01T09:00:00Z",
    };
    let saved = false;
    globalThis.fetch = async (url, options = {}) => {
      const data = options.body ? JSON.parse(options.body) : {};
      if (options.method === "POST") return Response.json(meta);
      if (options.method === "PUT") {
        assert.equal(data.revision, 4);
        saved = true;
        return Response.json({ ...meta, revision: 5 });
      }
      if (String(url).includes("restore"))
        return Response.json({ ...meta, snapshot });
      return Response.json({ available: true, connected: false });
    };
    try {
      render(React.createElement(App));
      click("Cloud workspace");
      await waitFor(() =>
        assert.ok(
          screen.getByRole("button", { name: "Connect existing workspace" }),
        ),
      );
      fireEvent.change(screen.getByLabelText("Workspace recovery code"), {
        target: { value: "test-recovery-code" },
      });
      click("Connect existing workspace");
      await waitFor(() =>
        assert.ok(screen.getByText("Private workspace connected")),
      );
      assert.equal(
        screen.getByRole("button", { name: "Save current progress" }).disabled,
        true,
      );
      click("Restore saved workspace");
      await waitFor(() =>
        assert.equal(
          JSON.parse(localStorage.getItem(STORE_KEY)).students[0].name,
          "Restored learner",
        ),
      );
      assert.equal(
        JSON.parse(localStorage.getItem("quest-grove-before-cloud-restore"))
          .students[0].name,
        "Explorer 1",
      );
      assert.equal(
        screen.getByRole("button", { name: "Save current progress" }).disabled,
        false,
      );
      click("Save current progress");
      await waitFor(() => assert.equal(saved, true));
    } finally {
      globalThis.fetch = originalFetch;
    }
  },
);
