"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Playground from "@/components/Playground";
import { Badge, Button } from "@/components/ui";
import { useConsole } from "@/lib/useConsole";
import { markLines } from "@/lib/markLines";

const LIMIT = 10; // seconds of inactivity before logout

const code = `const timerRef = useRef(null);

function resetTimer() {
  clearTimeout(timerRef.current);

  timerRef.current = setTimeout(() => {
    setLoggedOut(true);
  }, 10000);
}

useEffect(() => {
  resetTimer();
  return () => clearTimeout(timerRef.current);
}, []);

// Call resetTimer() on mouse move, click or key press.`;

const marks = markLines(code, [
  ["clearTimeout(timerRef.current);", "good"],
  ["return () => clearTimeout", "good"],
]);

export default function IdleLogoutDemo() {
  const { logs, log, clear } = useConsole();
  const [loggedOut, setLoggedOut] = useState(false);
  const [remaining, setRemaining] = useState(LIMIT);
  const timerRef = useRef(null);
  const deadlineRef = useRef(0);

  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    deadlineRef.current = Date.now() + LIMIT * 1000;
    timerRef.current = setTimeout(() => {
      log("No activity for 10 seconds. The user was logged out.", "warn");
      setLoggedOut(true);
    }, LIMIT * 1000);
  }, [log]);

  // The logout timer. It runs only while the user is logged in.
  useEffect(() => {
    if (loggedOut) return;
    log("Session started. Logout happens after 10 seconds without activity.");
    resetTimer();
    return () => clearTimeout(timerRef.current);
  }, [loggedOut, resetTimer, log]);

  // Display only: refresh the number on screen four times a second.
  // The logout itself is done by the setTimeout above.
  useEffect(() => {
    if (loggedOut) return;
    const id = setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000)));
    }, 250);
    return () => clearInterval(id);
  }, [loggedOut]);

  function handleActivity(message) {
    if (loggedOut) return;
    resetTimer();
    if (message) log(message);
  }

  function logIn() {
    setRemaining(LIMIT);
    setLoggedOut(false);
  }

  return (
    <Playground
      code={code}
      filename="useIdleLogout.js"
      marks={marks}
      logs={logs}
      onClear={clear}
      watch={[
        "Do nothing for 10 seconds. The setTimeout fires and the user is logged out.",
        "Move the mouse over the box, click it, or press a key while it is focused. The timer restarts from 10 seconds.",
        "Each reset calls clearTimeout first, so there is only ever one timer waiting.",
      ]}
    >
      {loggedOut ? (
        <div className="flex min-h-[11rem] flex-col items-center justify-center gap-4 rounded-lg border border-rose-200 bg-rose-50 p-6 text-center">
          <Badge tone="rose">Logged out</Badge>
          <p className="text-sm text-rose-900">
            Your session ended because of inactivity.
          </p>
          <Button onClick={logIn}>Log in again</Button>
        </div>
      ) : (
        <div
          tabIndex={0}
          role="group"
          aria-label="Activity area"
          onMouseMove={() => handleActivity()}
          onClick={() => handleActivity("Click detected. Timer restarted.")}
          onKeyDown={() => handleActivity("Key press detected. Timer restarted.")}
          className="flex min-h-[11rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center outline-none focus-visible:border-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-600/20"
        >
          <Badge tone="emerald">Session active</Badge>
          <p className="text-5xl font-semibold tabular-nums text-slate-900">{remaining}s</p>
          <p className="text-sm text-slate-600">
            until auto logout. Move, click or type here to reset.
          </p>
        </div>
      )}
    </Playground>
  );
}
