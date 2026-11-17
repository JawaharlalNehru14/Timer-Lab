"use client";

import { useEffect, useState } from "react";
import Playground from "@/components/Playground";
import { Stat } from "@/components/ui";
import { useConsole } from "@/lib/useConsole";
import { markLines } from "@/lib/markLines";

const TOPICS = [
  "React hooks",
  "React router",
  "Redux toolkit",
  "Next.js routing",
  "Node.js streams",
  "Tailwind CSS grid",
  "JavaScript closures",
  "JavaScript promises",
  "JavaScript event loop",
];

const code = `const [query, setQuery] = useState("");

useEffect(() => {
  if (!query) return;

  const timer = setTimeout(() => {
    searchApi(query);
  }, 500);

  return () => clearTimeout(timer);
}, [query]);

<input
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>`;

const marks = markLines(code, [["return () => clearTimeout", "good"]]);

export default function DebounceDemo() {
  const { logs, log, clear } = useConsole();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [keyPresses, setKeyPresses] = useState(0);
  const [apiCalls, setApiCalls] = useState(0);

  useEffect(() => {
    const text = query.trim();
    if (!text) return;

    const timer = setTimeout(() => {
      setApiCalls((n) => n + 1);
      setResults(TOPICS.filter((t) => t.toLowerCase().includes(text.toLowerCase())));
      setWaiting(false);
      log('Search API called with "' + text + '"', "success");
    }, 500);

    return () => clearTimeout(timer);
  }, [query, log]);

  function handleChange(event) {
    const value = event.target.value;
    setQuery(value);
    setKeyPresses((n) => n + 1);

    if (value.trim()) {
      log('Typed "' + value + '". Waiting 500 ms for more typing.');
      setWaiting(true);
    } else {
      log("Input is empty. Pending timer cleared, no API call.", "warn");
      setWaiting(false);
      setResults([]);
    }
  }

  const hasQuery = query.trim() !== "";

  return (
    <Playground
      code={code}
      filename="SearchBox.js"
      marks={marks}
      logs={logs}
      onClear={clear}
      watch={[
        'Type "javascript" quickly. Key presses go up with every letter, but the API is called once.',
        "Type a few letters, stop for half a second, then type again. Each pause causes one call.",
        "Without a debounce, every key press would call the API.",
      ]}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="debounce-input" className="text-sm font-medium text-slate-900">
            Search topics
          </label>
          <input
            id="debounce-input"
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Try: react, java, node"
            autoComplete="off"
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
          />
        </div>

        <div className="min-h-[7.5rem]">
          {!hasQuery && <p className="text-sm text-slate-500">Start typing to search.</p>}
          {hasQuery && waiting && (
            <p className="text-sm text-amber-700">Waiting for you to stop typing...</p>
          )}
          {hasQuery && !waiting && results.length === 0 && (
            <p className="text-sm text-slate-500">No topics found.</p>
          )}
          {hasQuery && !waiting && results.length > 0 && (
            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {results.map((item) => (
                <li key={item} className="px-3.5 py-2 text-sm text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Key presses" value={keyPresses} />
          <Stat label="API calls" value={apiCalls} tone="emerald" />
        </div>
      </div>
    </Playground>
  );
}
