"use client";

import { useEffect, useRef, useState } from "react";
import Playground from "@/components/Playground";
import { Badge, Button } from "@/components/ui";
import { useConsole } from "@/lib/useConsole";
import { markLines } from "@/lib/markLines";

const DELAY = 3000;

const code = `const timerRef = useRef(null);

function start() {
  console.log("Timer started");

  timerRef.current = setTimeout(() => {
    console.log("Callback ran. Only once.");
  }, 3000);
}

function cancel() {
  clearTimeout(timerRef.current);
  console.log("Timer cancelled");
}`;

const marks = markLines(code, [["clearTimeout(timerRef", "good"]]);

const statusMap = {
  idle: { label: "Idle", tone: "slate" },
  waiting: { label: "Waiting for 3 seconds", tone: "amber" },
  done: { label: "Callback ran", tone: "emerald" },
  cancelled: { label: "Cancelled", tone: "rose" },
};

export default function TimeoutBasicDemo() {
  const { logs, log, clear } = useConsole();
  const [status, setStatus] = useState("idle");
  const [runId, setRunId] = useState(0);
  const timerRef = useRef(null);

  // If the user leaves the page while the timer is waiting, stop it.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  function start() {
    log("Timer started. The callback will run once in 3 seconds.");
    setStatus("waiting");
    setRunId((n) => n + 1);
    timerRef.current = setTimeout(() => {
      log("Callback ran. setTimeout runs it only once.", "success");
      setStatus("done");
    }, DELAY);
  }

  function cancel() {
    clearTimeout(timerRef.current);
    log("clearTimeout called. The callback will never run.", "warn");
    setStatus("cancelled");
  }

  const waiting = status === "waiting";
  const { label, tone } = statusMap[status];
  const showBar = status === "waiting" || status === "done";

  return (
    <Playground
      code={code}
      filename="TimeoutBasic.js"
      marks={marks}
      logs={logs}
      onClear={clear}
      watch={[
        "Click Start. Nothing happens for 3 seconds, then the callback runs one time.",
        "Click Start, then Cancel before 3 seconds. The callback never runs.",
        "Press F12 and compare the DevTools console with the panel above.",
      ]}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-slate-600">Status</span>
          <Badge tone={tone}>{label}</Badge>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
          {showBar && (
            <div
              key={runId}
              className="h-full rounded-full bg-indigo-600"
              style={{ animation: "timer-fill " + DELAY + "ms linear forwards" }}
            />
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={start} disabled={waiting}>
            Start 3 second timer
          </Button>
          <Button variant="secondary" onClick={cancel} disabled={!waiting}>
            Cancel with clearTimeout
          </Button>
        </div>
      </div>
    </Playground>
  );
}
