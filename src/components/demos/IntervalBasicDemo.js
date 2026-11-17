"use client";

import { useEffect, useRef, useState } from "react";
import Playground from "@/components/Playground";
import { Badge, Button } from "@/components/ui";
import { useConsole } from "@/lib/useConsole";
import { markLines } from "@/lib/markLines";

const code = `const [seconds, setSeconds] = useState(0);
const [running, setRunning] = useState(false);

useEffect(() => {
  if (!running) return;

  const interval = setInterval(() => {
    setSeconds((s) => s + 1);
    console.log("tick");
  }, 1000);

  return () => clearInterval(interval);
}, [running]);`;

const marks = markLines(code, [["return () => clearInterval", "good"]]);

function format(total) {
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return m + ":" + s;
}

export default function IntervalBasicDemo() {
  const { logs, log, clear } = useConsole();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      tickRef.current += 1;
      setSeconds((s) => s + 1);
      log("tick " + tickRef.current + ": callback ran again");
    }, 1000);

    return () => clearInterval(interval);
  }, [running, log]);

  function start() {
    log("Interval started. The callback will run every 1 second.");
    setRunning(true);
  }

  function stop() {
    log("Stopped. The cleanup function called clearInterval.", "warn");
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setSeconds(0);
    tickRef.current = 0;
    log("Reset to 00:00");
  }

  return (
    <Playground
      code={code}
      filename="Stopwatch.js"
      marks={marks}
      logs={logs}
      onClear={clear}
      watch={[
        "Click Start. The callback runs again and again, once every second.",
        "Click Stop. The cleanup function runs and the ticks stop.",
        "setInterval never stops by itself. Only clearInterval stops it.",
      ]}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-slate-600">Status</span>
          <Badge tone={running ? "emerald" : "slate"}>{running ? "Running" : "Stopped"}</Badge>
        </div>

        <p className="text-center text-5xl font-semibold tabular-nums text-slate-900">
          {format(seconds)}
        </p>

        <div className="flex flex-wrap gap-3">
          <Button onClick={start} disabled={running}>
            Start
          </Button>
          <Button variant="secondary" onClick={stop} disabled={!running}>
            Stop
          </Button>
          <Button variant="secondary" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>
    </Playground>
  );
}
