import { useEffect, useState } from "react";
import {
  Cloud,
  Check,
  Copy,
  ArrowClockwise,
  SignOut,
  DownloadSimple,
} from "@phosphor-icons/react";
const META = "quest-grove-cloud-link";
function remember(info) {
  try {
    localStorage.setItem(
      META,
      JSON.stringify({ id: info.id, revision: info.revision }),
    );
  } catch {}
}
function requiresRestore(info) {
  try {
    const last = JSON.parse(localStorage.getItem(META));
    return last?.id !== info.id || last?.revision !== info.revision;
  } catch {
    return true;
  }
}
export function CloudWorkspace({ state, setState }) {
  const [info, setInfo] = useState(null),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [code, setCode] = useState(""),
    [recovery, setRecovery] = useState(""),
    [ready, setReady] = useState(false);
  const hi =
    state.students.find((s) => s.id === state.activeId)?.language === "hi";
  async function request(method = "GET", data, url = "/api/workspace") {
    const r = await fetch(url, {
      method,
      credentials: "same-origin",
      headers: method === "GET" ? {} : { "Content-Type": "application/json" },
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
    let result;
    try {
      result = await r.json();
    } catch {
      throw new Error(
        hi
          ? "यहाँ क्लाउड उपलब्ध नहीं है। ऑनलाइन वेबसाइट खोलें।"
          : "Cloud storage is unavailable here. Open the hosted website to connect.",
      );
    }
    if (!r.ok) throw new Error(result.error || "Cloud request failed.");
    return result;
  }
  useEffect(() => {
    let active = true;
    if (window.GROVE_ASSETS || location.protocol === "file:") {
      setMessage(
        hi
          ? "ऑफ़लाइन फ़ाइल में क्लाउड बंद है। ऑनलाइन वेबसाइट पर इसे खोलें।"
          : "The standalone file stays offline. Use the hosted website for cloud save/restore.",
      );
      setReady(true);
      return;
    }
    request()
      .then((r) => {
        if (active)
          setInfo({ ...r, needsRestore: r.connected && requiresRestore(r) });
      })
      .catch((e) => active && setMessage(e.message))
      .finally(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, []);
  async function action(fn) {
    setBusy(true);
    setMessage("");
    try {
      await fn();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  const create = () =>
    action(async () => {
      let r = await request("POST", { action: "create", snapshot: state });
      remember(r);
      setInfo({ ...r, needsRestore: false });
      setRecovery(r.recoveryCode);
      setMessage(
        hi
          ? "आपकी वर्तमान प्रगति क्लाउड में सहेजी गई है।"
          : "Your current progress and teacher guidance are saved in the database.",
      );
    });
  const connect = () =>
    action(async () => {
      const r = await request("POST", { action: "connect", code });
      try {
        localStorage.removeItem(META);
      } catch {}
      setInfo({ ...r, needsRestore: true });
      setCode("");
      setMessage(
        hi
          ? "जुड़ गया। सहेजी हुई प्रगति देखने के लिए नीचे पुनर्स्थापित करें।"
          : "Connected. Use Restore saved workspace below to load its progress. Local changes are not replaced automatically.",
      );
    });
  const save = () =>
    action(async () => {
      let r = await request("PUT", {
        snapshot: state,
        revision: info.revision,
      });
      remember(r);
      setInfo({ ...r, needsRestore: false });
      setMessage(hi ? "क्लाउड में सहेजा गया।" : "Saved to the cloud database.");
    });
  const restore = () =>
    action(async () => {
      let r = await request("GET", undefined, "/api/workspace?action=restore");
      try {
        localStorage.setItem(
          "quest-grove-before-cloud-restore",
          JSON.stringify(state),
        );
      } catch {
        throw new Error(
          "Could not keep a local backup. Export your progress before restoring.",
        );
      }
      setState(r.snapshot);
      remember(r);
      setInfo({ ...r, needsRestore: false });
      setMessage(
        hi
          ? "प्रगति पुनर्स्थापित हुई। पिछली स्थानीय प्रति का बैकअप रखा गया है।"
          : "Cloud progress restored. The previous local copy is backed up on this device.",
      );
    });
  const disconnect = () =>
    action(async () => {
      await request("POST", { action: "disconnect" });
      try {
        localStorage.removeItem(META);
      } catch {}
      setInfo({ available: true, connected: false });
      setRecovery("");
      setMessage(
        hi
          ? "क्लाउड से अलग हुआ। स्थानीय प्रगति सुरक्षित है।"
          : "Disconnected on this browser. Local progress remains available.",
      );
    });
  return (
    <>
      <p className="eyebrow">
        {hi ? "निजी क्लाउड कार्यक्षेत्र" : "YOUR PRIVATE CLOUD WORKSPACE"}
      </p>
      <h2>
        {hi ? (
          <>
            आपकी यात्रा,
            <br />
            <em>हर उपकरण पर।</em>
          </>
        ) : (
          <>
            Your discoveries.
            <br />
            <em>Ready to go with you.</em>
          </>
        )}
      </h2>
      <p>
        {hi
          ? "प्रगति, प्रोफ़ाइल और शिक्षक के मार्गदर्शन को निजी कार्यक्षेत्र में सहेजें। प्रत्येक नई प्रगति के बाद क्लाउड में सहेजें दबाएँ।"
          : "Save learner profiles, progress and teacher guidance in a private workspace. Use Save current progress after learning, then restore it on another device."}
      </p>
      <div className="cloud-explainer">
        <Cloud size={28} />
        <p>
          {hi
            ? "रिकवरी कोड से पूरे कार्यक्षेत्र तक पहुँच मिलती है। इसे केवल अधिकृत व्यक्ति से साझा करें। यह अलग-अलग विद्यार्थियों के सुरक्षित स्कूल खाते नहीं बनाता।"
            : "The recovery code gives full access to this workspace. Keep it private and share it only with an authorised teacher or caregiver. This is a private workspace backup, not separate authenticated school accounts."}
        </p>
      </div>
      {!ready ? (
        <p role="status">
          {hi ? "कनेक्शन जाँचा जा रहा है…" : "Checking cloud connection…"}
        </p>
      ) : info?.connected ? (
        <>
          <div className="cloud-connected">
            <Check size={20} />
            <div>
              <strong>
                {hi
                  ? "निजी कार्यक्षेत्र जुड़ा है"
                  : "Private workspace connected"}
              </strong>
              <p>
                {hi ? "सहेजा गया" : "Last saved"}:{" "}
                {new Date(info.updatedAt).toLocaleString(
                  hi ? "hi-IN" : "en-IN",
                )}{" "}
                · {hi ? "संस्करण" : "Revision"} {info.revision}
              </p>
            </div>
          </div>
          {info.needsRestore && (
            <p className="cloud-message">
              {hi
                ? "पहले क्लाउड प्रति पुनर्स्थापित करें। आपकी स्थानीय प्रति का बैकअप रखा जाएगा।"
                : "Restore the current cloud copy before saving on this browser. Your previous local copy will be backed up."}
            </p>
          )}
          <div className="cloud-actions">
            <button className="primary" disabled={busy || info.needsRestore} onClick={save}>
              <Cloud size={19} />
              {hi ? "वर्तमान प्रगति सहेजें" : "Save current progress"}
            </button>
            <button className="secondary" disabled={busy} onClick={restore}>
              <ArrowClockwise size={18} />
              {hi
                ? "सहेजा कार्यक्षेत्र पुनर्स्थापित करें"
                : "Restore saved workspace"}
            </button>
            <button className="text-link" disabled={busy} onClick={disconnect}>
              <SignOut size={18} />
              {hi ? "इस ब्राउज़र को अलग करें" : "Disconnect this browser"}
            </button>
          </div>
        </>
      ) : (
        info?.available && (
          <>
            <button className="primary" disabled={busy} onClick={create}>
              <Cloud size={19} />
              {hi
                ? "निजी कार्यक्षेत्र बनाएँ"
                : "Create private cloud workspace"}
            </button>
            <div className="cloud-join">
              <h3>
                {hi ? "पहले से कार्यक्षेत्र है?" : "Already have a workspace?"}
              </h3>
              <label>
                {hi ? "निजी रिकवरी कोड" : "Private recovery code"}
                <input
                  aria-label="Workspace recovery code"
                  type="password"
                  autoComplete="off"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your private recovery code"
                />
              </label>
              <button
                className="secondary"
                disabled={busy || !code.trim()}
                onClick={connect}
              >
                {hi ? "कार्यस्थान से जुड़ें" : "Connect existing workspace"}
              </button>
            </div>
          </>
        )
      )}
      {recovery && (
        <div className="recovery-card">
          <strong>
            {hi
              ? "अपना रिकवरी कोड अभी सुरक्षित रखें"
              : "Keep your recovery code now"}
          </strong>
          <p>
            {hi
              ? "इस सत्र के बाद कोड दोबारा नहीं दिखेगा।"
              : "It will not be shown again after this panel closes."}
          </p>
          <code>{recovery}</code>
          <button
            className="secondary"
            onClick={() =>
              action(async () => {
                await navigator.clipboard.writeText(recovery);
                setMessage(
                  hi
                    ? "रिकवरी कोड कॉपी हुआ।"
                    : "Recovery code copied. Keep it private.",
                );
              })
            }
          >
            <Copy size={17} />
            {hi ? "निजी कोड कॉपी करें" : "Copy private code"}
          </button>
        </div>
      )}
      {busy && (
        <p role="status">
          {hi
            ? "क्लाउड से काम चल रहा है…"
            : "Working with your cloud workspace…"}
        </p>
      )}
      {message && (
        <p className="cloud-message" role="status">
          {message}
        </p>
      )}
      <p className="subtle">
        {hi
          ? "सीखना पहले इस उपकरण पर सहेजा जाता है। इंटरनेट बंद होने पर भी पाठ चलते हैं। क्लाउड प्रति केवल ऊपर के नियंत्रणों से बदलती है।"
          : "Learning always saves on this device first. Lessons keep working offline. The cloud copy changes only when you create or save a workspace. Restoring keeps a backup of the previous local copy."}
      </p>
    </>
  );
}

