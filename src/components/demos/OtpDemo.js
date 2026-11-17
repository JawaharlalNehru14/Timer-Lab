"use client";

import { useEffect, useState } from "react";
import Playground from "@/components/Playground";
import { Button } from "@/components/ui";
import { useConsole } from "@/lib/useConsole";
import { markLines } from "@/lib/markLines";

const WAIT = 10; // seconds. Real apps often use 30 or 60.

const code = `const [timeLeft, setTimeLeft] = useState(0);
const isCounting = timeLeft > 0;

useEffect(() => {
  if (!isCounting) return;

  const interval = setInterval(() => {
    setTimeLeft((t) => t - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [isCounting]);

function resendOtp() {
  sendOtpRequest();
  setTimeLeft(10);
}`;

const marks = markLines(code, [["return () => clearInterval", "good"]]);

export default function OtpDemo() {
  const { logs, log, clear } = useConsole();
  const [timeLeft, setTimeLeft] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const isCounting = timeLeft > 0;

  useEffect(() => {
    if (!isCounting) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      log("Interval cleared. The countdown is over.", "success");
    };
  }, [isCounting, log]);

  // Log each tick. This effect only writes to the console.
  useEffect(() => {
    if (timeLeft > 0) log(timeLeft + "s left before the next resend");
  }, [timeLeft, log]);

  function sendOtp() {
    setSentCount((n) => n + 1);
    log("OTP request sent to the server.", "info");
    setTimeLeft(WAIT);
  }

  const label = "00:" + String(timeLeft).padStart(2, "0");

  return (
    <Playground
      code={code}
      filename="ResendOtp.js"
      marks={marks}
      logs={logs}
      onClear={clear}
      watch={[
        "Click Send OTP. The button is locked and the interval counts down once per second.",
        "At 0 the countdown ends, the cleanup runs, and the button unlocks.",
        "The button is disabled while counting, so the user cannot start two intervals at once.",
      ]}
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-900">Verify your phone number</p>
          <p className="mt-1 text-sm text-slate-500">
            We send a 6 digit code. You can ask for a new one after the timer ends.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={sendOtp} disabled={isCounting}>
            {sentCount === 0 ? "Send OTP" : "Resend OTP"}
          </Button>
          <p className="text-sm text-slate-600" aria-live="polite">
            {isCounting ? (
              <>
                Resend available in <span className="font-semibold tabular-nums text-slate-900">{label}</span>
              </>
            ) : sentCount > 0 ? (
              "You can resend the code now."
            ) : (
              "No code sent yet."
            )}
          </p>
        </div>
      </div>
    </Playground>
  );
}
