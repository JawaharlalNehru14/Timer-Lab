import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Counts how many intervals are currently running.
 * Used only by the cleanup demo, so learners can SEE a leak.
 * It wraps setInterval / clearInterval and does nothing else.
 */
export function useTimerTracker() {
  const idsRef = useRef(new Set());
  const [active, setActive] = useState(0);

  const startInterval = useCallback((callback, ms) => {
    const id = setInterval(callback, ms);
    idsRef.current.add(id);
    setActive(idsRef.current.size);
    return id;
  }, []);

  const stopInterval = useCallback((id) => {
    clearInterval(id);
    idsRef.current.delete(id);
    setActive(idsRef.current.size);
  }, []);

  const clearAll = useCallback(() => {
    idsRef.current.forEach((id) => clearInterval(id));
    idsRef.current.clear();
    setActive(0);
  }, []);

  // Safety net: when the demo itself leaves the page, stop everything.
  useEffect(() => {
    const ids = idsRef.current;
    return () => {
      ids.forEach((id) => clearInterval(id));
      ids.clear();
    };
  }, []);

  return { active, startInterval, stopInterval, clearAll };
}
