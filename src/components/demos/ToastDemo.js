"use client";

import { useEffect, useState } from "react";
import Playground from "@/components/Playground";
import { Button } from "@/components/ui";
import { useConsole } from "@/lib/useConsole";
import { markLines } from "@/lib/markLines";

const code = `const [toast, setToast] = useState(null);

useEffect(() => {
  if (!toast) return;

  const timer = setTimeout(() => {
    setToast(null);
    console.log("Toast closed");
  }, 3000);

  return () => clearTimeout(timer);
}, [toast]);

function save() {
  setToast({ id: Date.now() });
}`;

const marks = markLines(code, [["return () => clearTimeout", "good"]]);

export default function ToastDemo() {
  const { logs, log, clear } = useConsole();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;

    log("Toast shown. It will close in 3 seconds.");

    const timer = setTimeout(() => {
      log("3 seconds passed. The timer closed the toast.", "success");
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast, log]);

  function save() {
    // A new object every click, so the effect runs again and the timer restarts.
    setToast({ id: Date.now() });
  }

  return (
    <Playground
      code={code}
      filename="SaveButton.js"
      marks={marks}
      logs={logs}
      onClear={clear}
      watch={[
        "Click Save. The toast closes by itself after 3 seconds.",
        "Click Save twice within 3 seconds. The old timer is cleared and a new one starts, so the toast stays for 3 full seconds after the last click.",
      ]}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-900">Profile settings</p>
            <p className="text-sm text-slate-500">Update your details and save.</p>
          </div>
          <Button onClick={save}>Save changes</Button>
        </div>

        <div className="h-14">
          {toast && (
            <div
              role="status"
              className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              Changes saved successfully
            </div>
          )}
        </div>
      </div>
    </Playground>
  );
}
