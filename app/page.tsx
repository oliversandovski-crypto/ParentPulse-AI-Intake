"use client";

import { useEffect, useRef, useState } from "react";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";

type Role = "user" | "assistant";
type Message = { role: Role; content: string };

type Summary = {
  child_age: string;
  presenting_concern: string;
  tried_so_far: string;
  urgency: string;
  desired_outcome: string;
  closing_message: string;
};

type Coach = {
  id: string;
  name: string;
  focus: string;
  background: string;
  goodFor: string[];
};

type Stage = "intro" | "chat" | "matching" | "result";

export default function Page() {
  const [stage, setStage] = useState<Stage>("intro");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [match, setMatch] = useState<{ coach: Coach; reasoning: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const speech = useSpeechRecognition((finalChunk) => {
    setInput((prev) => (prev ? `${prev} ${finalChunk}` : finalChunk));
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function beginIntake() {
    setStage("chat");
    setLoading(true);
    const opening: Message[] = [
      { role: "user", content: "Hi, I'm looking for some guidance for my family." },
    ];
    const res = await fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "chat", messages: opening }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.done) {
      finishIntake(data.summary, opening);
    } else {
      setMessages([{ role: "assistant", content: data.question }]);
    }
  }

  async function sendAnswer() {
    if (!input.trim() || loading) return;
    const next: Message[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "chat", messages: next }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.done) {
      finishIntake(data.summary, next);
    } else {
      setMessages([...next, { role: "assistant", content: data.question }]);
    }
  }

  async function finishIntake(finalSummary: Summary, history: Message[]) {
    setSummary(finalSummary);
    setMessages([...history, { role: "assistant", content: finalSummary.closing_message }]);
    setStage("matching");

    const res = await fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "match", summary: finalSummary }),
    });
    const data = await res.json();
    setMatch(data);
    setStage("result");
  }

  function restart() {
    setStage("intro");
    setMessages([]);
    setSummary(null);
    setMatch(null);
    setInput("");
  }

  return (
    <div className="wrap">
      {stage === "intro" && <IntroScreen onBegin={beginIntake} />}

      {(stage === "chat" || stage === "matching") && (
        <ChatScreen
          messages={messages}
          loading={loading}
          input={input}
          setInput={setInput}
          onSend={sendAnswer}
          matching={stage === "matching"}
          scrollRef={scrollRef}
          speech={speech}
        />
      )}

      {stage === "result" && summary && match && (
        <ResultScreen summary={summary} match={match} onRestart={restart} />
      )}
    </div>
  );
}

function IntroScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="card" style={{ marginTop: "2rem" }}>
      <p className="eyebrow">Before we start</p>
      <h1 className="display" style={{ fontSize: "1.5rem", margin: "0 0 0.9rem" }}>
        A few questions, so we can match you with the right coach
      </h1>
      <p>
        This isn&rsquo;t a form &mdash; it&rsquo;s a short conversation, about five minutes. I&rsquo;ll
        ask one question at a time, and you can answer in your own words.
      </p>
      <p>
        What you share here goes to the coach you&rsquo;re matched with, so they walk into your
        first session already understanding your family &mdash; not a stranger asking you to
        repeat yourself. Nothing is shared beyond that.
      </p>
      <p className="subtle">
        There&rsquo;s no wrong answer, and you can be as brief or as detailed as you&rsquo;d like.
      </p>
      <button className="primary" onClick={onBegin} style={{ marginTop: "0.5rem" }}>
        Begin
      </button>
    </div>
  );
}

function ChatScreen({
  messages,
  loading,
  input,
  setInput,
  onSend,
  matching,
  scrollRef,
  speech,
}: {
  messages: Message[];
  loading: boolean;
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  matching: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  speech: {
    supported: boolean;
    listening: boolean;
    interim: string;
    start: () => void;
    stop: () => void;
  };
}) {
  return (
    <>
      <p className="eyebrow" style={{ marginTop: "1rem" }}>
        {matching ? "Finding your match" : "A few questions"}
      </p>
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: "auto", paddingBottom: "1rem", marginBottom: "0.5rem" }}
      >
        {messages.map((m, i) => (
          <div key={i} className={`msg-row ${m.role}`}>
            <div className="bubble">{m.content}</div>
          </div>
        ))}
        {(loading || matching) && (
          <div className="msg-row assistant">
            <div className="bubble">
              <div className="spinner" />
            </div>
          </div>
        )}
      </div>
      {!matching && (
        <>
          {speech.listening && (
            <p className="subtle" style={{ margin: "0 0 0.4rem", fontStyle: "italic" }}>
              {speech.interim || "Listening..."}
            </p>
          )}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={input}
              placeholder={speech.listening ? "Listening..." : "Type or tap the mic to speak..."}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) onSend();
              }}
              disabled={loading}
            />
            {speech.supported && (
              <button
                type="button"
                aria-label={speech.listening ? "Stop recording" : "Speak your answer"}
                onClick={() => (speech.listening ? speech.stop() : speech.start())}
                disabled={loading}
                style={{
                  width: "3rem",
                  flex: "0 0 auto",
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  background: speech.listening ? "var(--accent-strong)" : "var(--paper-raised)",
                  color: speech.listening ? "var(--paper)" : "var(--ink)",
                  fontSize: "1.15rem",
                  cursor: loading ? "default" : "pointer",
                }}
              >
                {speech.listening ? "■" : "🎤"}
              </button>
            )}
            <button
              className="primary"
              style={{ width: "auto", padding: "0.75rem 1.1rem" }}
              onClick={onSend}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
        </>
      )}
    </>
  );
}

function ResultScreen({
  summary,
  match,
  onRestart,
}: {
  summary: Summary;
  match: { coach: Coach; reasoning: string };
  onRestart: () => void;
}) {
  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <p className="eyebrow">Your match</p>
        <h1 className="display" style={{ fontSize: "1.4rem", margin: "0 0 0.3rem" }}>
          {match.coach.name}
        </h1>
        <p className="subtle" style={{ margin: "0 0 0.8rem" }}>{match.coach.focus}</p>
        <p>{match.reasoning}</p>
      </div>

      <div className="card">
        <p className="eyebrow">What your coach will see before session one</p>
        <div className="summary-grid">
          <SummaryRow label="Child's age" value={summary.child_age} />
          <SummaryRow label="Concern" value={summary.presenting_concern} />
          <SummaryRow label="Tried so far" value={summary.tried_so_far} />
          <SummaryRow label="Urgency" value={summary.urgency} />
          <SummaryRow label="Hoped outcome" value={summary.desired_outcome} />
        </div>
        <p className="subtle" style={{ marginTop: "0.4rem" }}>
          No blank-page first session &mdash; your coach starts already knowing this.
        </p>
      </div>

      <button
        className="primary"
        style={{ marginTop: "1.5rem", background: "transparent", color: "var(--accent-strong)", border: "1px solid var(--line)" }}
        onClick={onRestart}
      >
        Try another scenario
      </button>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="summary-row">
      <span className="label">{label}</span>
      <span>{value}</span>
    </div>
  );
}
