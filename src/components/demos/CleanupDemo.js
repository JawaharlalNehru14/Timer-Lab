"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Playground from "@/components/Playground";
import Callout from "@/components/Callout";
import { Button, Stat } from "@/components/ui";
import { useConsole } from "@/lib/useConsole";
import { useTimerTracker } from "@/lib/useTimerTracker";
import { markLines } from "@/lib/markLines";

const withoutCode = `useEffect(() => {
  const timer = setInterval(() => {
    setSeconds((s) => s + 1);
    console.log("tick");
  }, 1000);

  // No cleanup: the timer survives unmount
}, []);`;

const withCode = `useEffect(() => {
  const timer = setInterval(() => {
    setSeconds((s) => s + 1);
    console.log("tick");
  }, 1000);

  return () => clearInterval(timer);
}, []);`;

const withoutMarks = markLines(withoutCode, [["// No cleanup", "bad"]]);
const withMarks = markLines(withCode, [["return () => clearInterval", "good"]]);

/**
 * The child component that owns the timer.
 * `withCleanup` decides if it returns a cleanup function.
 * startInterval / stopInterval are thin wrappers around setInterval / clearInterval
 * that also count how many timers are alive, so the page can show it.
 */
function Ticker({ withCleanup, startInterval, stopInterval, onTick }) {
  const [seconds, setSeconds] = useState(0);
  const aliveRef = useRef(true);

  // Remembers if this component is still on screen, so each tick can report it.
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  useEffect(() => {
    const timer = startInterval(() => {
      setSeconds((s) => s + 1);
      onTick(aliveRef.current);
    }, 1000);

    return withCleanup ? () => stopInterval(timer) : undefined;
  }, [withCleanup, startInterval, stopInterval, onTick]);

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">Ticker component</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-indigo-900">{seconds}s on screen</p>
    </div>
  );
}

export default function CleanupDemo() {
  const { logs, log, clear } = useConsole();
  const { active, startInterval, stopInterval, clearAll } = useTimerTracker();
  const [withCleanup, setWithCleanup] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const handleTick = useCallback(
    (alive) => {
      if (alive) log("tick: the component is on screen");
      else log("tick: the component is GONE but this timer is still running", "error");
    },
    [log]
  );

  function chooseMode(next) {
    if (next === withCleanup) return;
    clearAll();
    clear();
    setMounted(false);
    setHasMounted(false);
    setWithCleanup(next);
  }

  function mount() {
    setMounted(true);
    setHasMounted(true);
    log("Component mounted. Timer started.", "info");
  }

  function unmount() {
    setMounted(false);
    log(
      withCleanup
        ? "Component unmounted. Cleanup ran, so the timer was stopped."
        : "Component unmounted. There was no cleanup, so nothing stopped the timer.",
      withCleanup ? "success" : "warn"
    );
  }

  function stopAll() {
    clearAll();
    log("All timers stopped manually (demo reset).", "info");
  }

  const leaking = !mounted && active > 0;

  return (
    <div>
      <div
        role="group"
        aria-label="Choose demo mode"
        className="mb-6 inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm"
      >
        {[
          { value: false, label: "Without cleanup" },
          { value: true, label: "With cleanup" },
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            aria-pressed={withCleanup === option.value}
            onClick={() => chooseMode(option.value)}
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              withCleanup === option.value
                ? option.value
                  ? "bg-emerald-600 text-white"
                  : "bg-rose-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <Playground
        code={withCleanup ? withCode : withoutCode}
        filename="Ticker.js"
        marks={withCleanup ? withMarks : withoutMarks}
        logs={logs}
        onClear={clear}
        watch={
          withCleanup
            ? [
                "Mount the component, then unmount it. Timers running goes back to 0 and the ticks stop.",
                "Mount and unmount several times. The count never grows.",
              ]
            : [
                "Mount the component, then unmount it. The Ticker disappears but the console keeps logging.",
                "Mount and unmount again. Timers running grows to 2, then 3. The ticks come faster and faster.",
                "Click Stop all timers to reset the demo.",
              ]
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Stat
              label="Component on screen"
              value={mounted ? "Yes" : "No"}
              tone={mounted ? "indigo" : "slate"}
            />
            <Stat
              label="Timers running"
              value={active}
              tone={leaking ? "rose" : active > 0 ? "indigo" : "emerald"}
            />
          </div>

          <div className="min-h-[5.25rem]">
            {mounted ? (
              <Ticker
                key={withCleanup ? "with" : "without"}
                withCleanup={withCleanup}
                startInterval={startInterval}
                stopInterval={stopInterval}
                onTick={handleTick}
              />
            ) : leaking ? (
              <Callout type="danger" title="Memory leak in progress">
                The component is gone, but {active} timer{active > 1 ? "s are" : " is"} still running in the
                background.
              </Callout>
            ) : hasMounted ? (
              <Callout type="success" title="Clean exit">
                The component is gone and no timers are left.
              </Callout>
            ) : (
              <p className="text-sm text-slate-500">Click Mount to start.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={mount} disabled={mounted}>
              Mount component
            </Button>
            <Button variant="secondary" onClick={unmount} disabled={!mounted}>
              Unmount component
            </Button>
            {!withCleanup && (
              <Button variant="danger" onClick={stopAll} disabled={active === 0}>
                Stop all timers
              </Button>
            )}
          </div>
        </div>
      </Playground>
    </div>
  );
}
