"use client";

import { useEffect, useRef, useState } from "react";

// Minimal ambient shape for the Web Speech API - not in default TS lib types.
interface SpeechRecognitionResultLike {
  0: { transcript: string };
  isFinal: boolean;
}
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: Event) => void) | null;
  onend: (() => void) | null;
}

export function useSpeechRecognition(onFinalChunk: (text: string) => void) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  // Mirrors "should we still be listening" for the onend handler below, which
  // closes over this ref (not the listening state, which would be stale -
  // the recognition object and its handlers are only created once on mount).
  const wantListeningRef = useRef(false);
  const onFinalChunkRef = useRef(onFinalChunk);
  onFinalChunkRef.current = onFinalChunk;

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Impl = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Impl) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const recognition = new Impl();
    // continuous: false, deliberately. Android Chrome's continuous mode has a
    // known bug where it re-emits overlapping "final" results as speech goes
    // on ("my my child my child is my child is 20 20 years old"), instead of
    // clean incremental ones. A single-utterance session is reliable; we get
    // the "don't cut the user off on a pause" behavior instead by restarting
    // the session immediately in onend, unless the user explicitly stopped.
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (ev) => {
      let finalText = "";
      let interimText = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const result = ev.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }
      if (finalText.trim()) onFinalChunkRef.current(finalText.trim());
      setInterim(interimText);
    };

    recognition.onerror = () => {
      wantListeningRef.current = false;
      setListening(false);
      setInterim("");
    };

    recognition.onend = () => {
      setInterim("");
      if (wantListeningRef.current) {
        try {
          recognition.start();
        } catch {
          wantListeningRef.current = false;
          setListening(false);
        }
      } else {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      wantListeningRef.current = false;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
    };
  }, []);

  function start() {
    if (!recognitionRef.current || listening) return;
    wantListeningRef.current = true;
    setListening(true);
    recognitionRef.current.start();
  }

  function stop() {
    wantListeningRef.current = false;
    recognitionRef.current?.stop();
  }

  return { supported, listening, interim, start, stop };
}
