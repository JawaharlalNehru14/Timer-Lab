import { useCallback, useState } from "react";

let nextId = 1;

/**
 * Small console for the demos.
 * - Keeps messages in state so they can be shown inside the page.
 * - Also prints every message to the real browser console (DevTools),
 *   so learners can compare both.
 */
export function useConsole(limit = 80) {
  const [logs, setLogs] = useState([]);

  const log = useCallback(
    (message, type = "log") => {
      const method = type === "warn" || type === "error" ? "warn" : "log";
      console[method]("[Timer Lab] " + message);

      const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
      setLogs((prev) =>
        [...prev, { id: nextId++, time, message, type }].slice(-limit)
      );
    },
    [limit]
  );

  const clear = useCallback(() => setLogs([]), []);

  return { logs, log, clear };
}
