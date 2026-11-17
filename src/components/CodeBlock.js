"use client";

import { useEffect, useRef, useState } from "react";

/* ---------- Tiny syntax highlighter (no dependencies) ---------- */

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "import",
  "from", "export", "default", "async", "await", "new", "typeof",
]);
const LITERALS = new Set(["true", "false", "null", "undefined"]);
const TIMERS = new Set(["setTimeout", "setInterval", "clearTimeout", "clearInterval"]);

const TOKEN_RE =
  /(\/\/.*|\/\*.*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|(.)/g;

function tokenize(line) {
  const nodes = [];
  let key = 0;

  for (const m of line.matchAll(TOKEN_RE)) {
    const [text, comment, string, number, word] = m;
    let cls = "text-slate-200";

    if (comment) cls = "italic text-slate-500";
    else if (string) cls = "text-emerald-300";
    else if (number) cls = "text-orange-300";
    else if (word) {
      const next = line[m.index + text.length];
      if (TIMERS.has(word)) cls = "font-semibold text-amber-300";
      else if (KEYWORDS.has(word)) cls = "text-violet-300";
      else if (LITERALS.has(word)) cls = "text-orange-300";
      else if (/^use[A-Z]/.test(word)) cls = "text-sky-300";
      else if (next === "(") cls = "text-sky-200";
    }

    nodes.push(
      <span key={key++} className={cls}>
        {text}
      </span>
    );
  }
  return nodes;
}

/* ---------- Component ---------- */

const markStyles = {
  good: "border-emerald-400 bg-emerald-400/10",
  bad: "border-rose-400 bg-rose-400/10",
};

/**
 * Props
 * - code: string
 * - filename: shows a header with a Copy button (optional)
 * - marks: { [lineNumber]: "good" | "bad" } highlights a line
 * - showLineNumbers: default true
 */
export default function CodeBlock({ code, filename, marks = {}, showLineNumbers = true }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  // Practise what this site teaches: clear the timer when the component unmounts.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be blocked; ignore */
    }
  }

  const lines = code.split("\n");

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
      {filename && (
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-800/60 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
            </span>
            <span className="font-mono text-xs text-slate-400">{filename}</span>
          </div>
          <button
            type="button"
            onClick={copy}
            className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}

      <pre className="overflow-x-auto py-4 font-mono text-[13px] leading-6">
        <code className="block min-w-max">
          {lines.map((line, i) => {
            const n = i + 1;
            const mark = marks[n];
            return (
              <div
                key={i}
                className={`flex border-l-2 px-4 ${mark ? markStyles[mark] : "border-transparent"}`}
              >
                {showLineNumbers && (
                  <span className="mr-4 w-5 shrink-0 select-none text-right text-slate-600">
                    {n}
                  </span>
                )}
                <span className="whitespace-pre">{line === "" ? " " : tokenize(line)}</span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
