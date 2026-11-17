"use client";

import CodeBlock from "@/components/CodeBlock";
import ConsolePanel from "@/components/ConsolePanel";

/**
 * Code on the left, live output and console on the right.
 * On small screens everything stacks in one column.
 */
export default function Playground({
  code,
  filename = "Component.js",
  marks,
  logs,
  onClear,
  watch = [],
  children,
}) {
  return (
    <div>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <CodeBlock code={code} filename={filename} marks={marks} />
        </div>

        <div className="min-w-0 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Output
            </div>
            <div className="p-4 sm:p-5">{children}</div>
          </div>
          <ConsolePanel logs={logs} onClear={onClear} />
        </div>
      </div>

      {watch.length > 0 && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-semibold text-slate-900">What to watch</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-600">
            {watch.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
