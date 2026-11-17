"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Playground from "@/components/Playground";
import { Badge, Button, Stat } from "@/components/ui";
import { useConsole } from "@/lib/useConsole";
import { markLines } from "@/lib/markLines";

const code = `const [live, setLive] = useState(false);
const [stats, setStats] = useState(initialStats);

useEffect(() => {
  if (!live) return;

  const interval = setInterval(() => {
    console.log("Fetching latest data");
    fetchLatestData().then(setStats);
  }, 3000);

  return () => clearInterval(interval);
}, [live]);`;

const marks = markLines(code, [["return () => clearInterval", "good"]]);

const initialStats = { users: 128, orders: 42, updatedAt: null };

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTime(date) {
  return date ? date.toLocaleTimeString("en-GB", { hour12: false }) : "Not updated yet";
}

export default function PollingDemo() {
  const { logs, log, clear } = useConsole();
  const [live, setLive] = useState(false);
  const [stats, setStats] = useState(initialStats);
  const requestRef = useRef(0);

  // Stands in for a real API request. It changes the numbers a little each time.
  const load = useCallback(() => {
    requestRef.current += 1;
    const userChange = randomBetween(-5, 8);
    const newOrders = randomBetween(0, 3);

    setStats((prev) => ({
      users: Math.max(0, prev.users + userChange),
      orders: prev.orders + newOrders,
      updatedAt: new Date(),
    }));
    log("Request #" + requestRef.current + ": fetched latest data");
  }, [log]);

  useEffect(() => {
    if (!live) return;

    const interval = setInterval(load, 3000);

    return () => clearInterval(interval);
  }, [live, load]);

  function start() {
    log("Live updates on. Polling every 3 seconds.", "info");
    load(); // first request right away, then the interval takes over
    setLive(true);
  }

  function stop() {
    log("Live updates off. clearInterval stopped the polling.", "warn");
    setLive(false);
  }

  return (
    <Playground
      code={code}
      filename="LiveDashboard.js"
      marks={marks}
      logs={logs}
      onClear={clear}
      watch={[
        "Click Start. The numbers refresh every 3 seconds without any click.",
        "Click Pause. The requests stop. In a real app this saves server and network work.",
        "If the user leaves the page without cleanup, the polling would continue in the background.",
      ]}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-900">Store dashboard</p>
          {live ? (
            <Badge tone="emerald">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live
            </Badge>
          ) : (
            <Badge>Paused</Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Active users" value={stats.users} tone="indigo" />
          <Stat label="Orders today" value={stats.orders} />
        </div>

        <p className="text-sm text-slate-500">
          Last updated: <span className="tabular-nums text-slate-700">{formatTime(stats.updatedAt)}</span>
        </p>

        <div>
          {live ? (
            <Button variant="secondary" onClick={stop}>
              Pause live updates
            </Button>
          ) : (
            <Button onClick={start}>Start live updates</Button>
          )}
        </div>
      </div>
    </Playground>
  );
}
