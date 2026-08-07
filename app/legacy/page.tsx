"use client";

import { useState } from "react";
import Link from "next/link";
import "./legacy.css";
import { legacyTree, JANE_BASE } from "@/lib/legacy-quiz-tree";

type Stage = "start" | "quiz" | "form" | "done";

export default function LegacyPage() {
  const [stage, setStage] = useState<Stage>("start");
  const [currentId, setCurrentId] = useState("question1");
  const [history, setHistory] = useState<string[]>([]);
  const [finalSlug, setFinalSlug] = useState<string | null>(null);
  const [answersLog, setAnswersLog] = useState<string[]>([]);

  const node = legacyTree[currentId as keyof typeof legacyTree];

  function pickOption(label: string, opt: { next?: string; final?: string }) {
    setAnswersLog((prev) => [...prev, label]);
    if (opt.final) {
      setFinalSlug(opt.final);
      setStage("form");
      return;
    }
    if (opt.next) {
      setHistory((prev) => [...prev, currentId]);
      setCurrentId(opt.next);
    }
  }

  function goBack() {
    if (history.length === 0) return;
    const prev = [...history];
    const last = prev.pop()!;
    setHistory(prev);
    setCurrentId(last);
  }

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    // Mock only. The real plugin posts to Mailchimp here, then redirects.
    setStage("done");
  }

  function restart() {
    setStage("start");
    setCurrentId("question1");
    setHistory([]);
    setFinalSlug(null);
    setAnswersLog([]);
  }

  return (
    <div className="legacyPage">
      <div className="banner">
        This is a faithful recreation of Julie&apos;s existing questionnaire, rebuilt outside
        WordPress so it can actually run. Same questions, same branching, same destinations.{" "}
        <Link href="/">See the AI version instead &rarr;</Link>
      </div>

      {stage === "start" && (
        <div className="startWrap">
          <h1>Find the Right Coach for You!!</h1>
          <button id="start-quiz-btn" onClick={() => setStage("quiz")}>
            Find the Right Coach for You!!
          </button>
        </div>
      )}

      {stage === "quiz" && node && (
        <div className="question-container">
          <h2>{node.question}</h2>
          <div className="button-group">
            {node.options.map((opt) => (
              <button key={opt.label} onClick={() => pickOption(opt.label, opt)}>
                {opt.label}
              </button>
            ))}
            {history.length > 0 && (
              <button id="back-button" onClick={goBack}>
                Back
              </button>
            )}
          </div>
        </div>
      )}

      {stage === "form" && (
        <div id="subscription-form-container">
          <h3>Please subscribe, we&apos;ll match you with the best coach!</h3>
          <form id="subscription-form" onSubmit={submitForm}>
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
            <input type="email" placeholder="Email" required />
            <button type="submit">Continue</button>
          </form>
        </div>
      )}

      {stage === "done" && finalSlug && (
        <div id="redirect-message">
          This is where the real plugin sends the parent, silently, with no explanation and
          nothing given to the coach ahead of time.
          <code>{JANE_BASE}{finalSlug}</code>
          <p style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
            Answers given along the way: {answersLog.join(" -> ")}
          </p>
          <button
            onClick={restart}
            style={{
              marginTop: "1rem",
              background: "#2c7a7b",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Try another path
          </button>
        </div>
      )}
    </div>
  );
}
