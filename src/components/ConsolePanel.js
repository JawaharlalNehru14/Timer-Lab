"use client";

import { useEffect, useRef } from "react";

const typeStyles = {
  log: "text-slate-200",
  info: "text-sky-300",
  success: "text-emerald-300",
  warn: "text-amber-300",
  error: "text-rose-400",
};

export default function ConsolePanel({ logs, onClear }) {
  const bodyRef = useRef(null);

  // Keep the newest message in view.
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-sm">
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Console
          </span>
          <button
            type="button"
            onClick={onClear}
            className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            Clear
          </button>
        </div>

        <div
          ref={bodyRef}
          role="log"
          aria-live="off"
          className="h-56 overflow-y-auto p-3 font-mono text-[13px] leading-6"
        >
          {logs.length === 0 ? (
            <p className="text-slate-500">Nothing logged yet. Run the demo above.</p>
          ) : (
            logs.map((entry) => (
              <div key={entry.id} className="flex gap-3">
                <span className="shrink-0 select-none text-slate-600">{entry.time}</span>
                <span className={`min-w-0 break-words ${typeStyles[entry.type] || typeStyles.log}`}>
                  {entry.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        The same messages are printed in your browser DevTools. Press F12 and open the Console tab to compare.
      </p>
    </div>
  );
}
