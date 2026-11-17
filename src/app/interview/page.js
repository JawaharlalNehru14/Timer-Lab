import PageHeader from "@/components/PageHeader";
import PageNav from "@/components/PageNav";
import CodeBlock from "@/components/CodeBlock";
import { P, Section } from "@/components/ui";
import { markLines } from "@/lib/markLines";

export const metadata = {
  title: "Interview notes",
  description: "Short, clear answers about setTimeout, setInterval and useEffect cleanup.",
};

const comparison = [
  { label: "Runs", timeout: "Once, after a delay", interval: "Again and again, every N ms" },
  { label: "Stopped with", timeout: "clearTimeout(id)", interval: "clearInterval(id)" },
  {
    label: "Typical use",
    timeout: "Toast, debounce, auto logout",
    interval: "Polling, OTP countdown, clock",
  },
  { label: "Cleanup in useEffect", timeout: "Required", interval: "Required" },
];

const toastCode = `useEffect(() => {
  const timer = setTimeout(() => setShowToast(false), 3000);
  return () => clearTimeout(timer);
}, []);`;

const debounceCode = `useEffect(() => {
  const timer = setTimeout(() => searchApi(query), 500);
  return () => clearTimeout(timer);
}, [query]);`;

const pollingCode = `useEffect(() => {
  let timerId;
  let cancelled = false;

  async function poll() {
    await fetchLatestData();
    if (!cancelled) timerId = setTimeout(poll, 5000);
  }

  poll();

  return () => {
    cancelled = true;
    clearTimeout(timerId);
  };
}, []);`;

const staleCode = `// Stale: count stays at 0 inside the interval
setInterval(() => setCount(count + 1), 1000);

// Correct: always receives the latest value
setInterval(() => setCount((c) => c + 1), 1000);`;

const questions = [
  {
    q: "What is setTimeout and when do you use it?",
    say: "setTimeout runs code once after a delay. I use it for debouncing a search input, or auto-dismissing a toast notification after a few seconds.",
    more: [
      "The delay is in milliseconds. setTimeout returns an id, and clearTimeout(id) cancels it before it runs.",
      "Other uses: logging a user out after inactivity, or delaying a tooltip.",
    ],
    code: toastCode,
    marks: markLines(toastCode, [["return () => clearTimeout", "good"]]),
  },
  {
    q: "What is setInterval and when do you use it?",
    say: "setInterval runs code repeatedly at a fixed interval. I use it for polling a live dashboard, a resend OTP countdown, or a clock.",
    more: [
      "It keeps running until you call clearInterval(id). It never stops by itself.",
    ],
  },
  {
    q: "Why do you need a cleanup function in useEffect?",
    say: "Both timers always need a cleanup function in useEffect. Otherwise the timer keeps running even after the component unmounts, causing memory leaks and unnecessary work.",
    more: [
      "When a component unmounts, React removes it from the screen, but the browser does not know about your timer. It keeps calling your function.",
      "That function also holds the component variables in memory, so they cannot be garbage collected. This is the memory leak.",
    ],
  },
  {
    q: "What happens if you forget clearInterval?",
    say: "The interval keeps running after the component is gone. It wastes CPU, can keep sending network requests, and every remount adds another interval, so the work multiplies.",
    more: [
      "The cleanup page has a live demo that shows the timer count growing with each mount.",
    ],
  },
  {
    q: "What is debouncing and how do you build it with setTimeout?",
    say: "Debouncing waits until the user stops doing something before running the code. Each key press clears the old timer and starts a new one, so only the last key press triggers the search.",
    more: [
      "The cleanup function of the effect is what clears the previous timer when the query changes.",
    ],
    code: debounceCode,
    marks: markLines(debounceCode, [["return () => clearTimeout", "good"]]),
  },
  {
    q: "Is the delay in setTimeout exact?",
    say: "No. The delay is the minimum wait. The callback goes into a queue and runs only when the call stack is empty.",
    more: [
      "If the page is busy with heavy work, the callback runs later than the delay you asked for.",
    ],
  },
  {
    q: "What does setTimeout(fn, 0) do?",
    say: "It does not run fn immediately. It schedules fn to run after the current code finishes and the call stack is empty.",
    more: [
      "This is a common way to explain the event loop: synchronous code runs first, then queued callbacks.",
    ],
  },
  {
    q: "setInterval or recursive setTimeout for polling?",
    say: "setInterval is fine for light, quick work. For API polling I prefer a recursive setTimeout, because it waits for the previous request to finish before it schedules the next one.",
    more: [
      "With setInterval, a slow request can overlap with the next one. A recursive setTimeout cannot overlap.",
    ],
    code: pollingCode,
    marks: markLines(pollingCode, [["clearTimeout(timerId)", "good"]]),
  },
  {
    q: "Why use setCount((c) => c + 1) inside setInterval?",
    say: "The interval callback is created once, so it remembers the state from the first render. A functional update always receives the latest state.",
    more: [],
    code: staleCode,
    marks: markLines(staleCode, [["setCount(count + 1)", "bad"], ["setCount((c) => c + 1)", "good"]]),
  },
  {
    q: "What else needs a cleanup in useEffect?",
    say: "Anything that I start in an effect and that keeps running: timers, event listeners, subscriptions, WebSocket connections and in-flight fetch requests.",
    more: [
      "Event listeners use removeEventListener, WebSockets use close, and fetch requests use AbortController.",
    ],
  },
];

export default function InterviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="Topic 4"
        title="Interview notes"
        description="Short answers you can say out loud. Read the highlighted sentence first. The text below it is for your own understanding."
        links={[
          { href: "#compare", label: "Quick comparison" },
          { href: "#questions", label: "Questions and answers" },
        ]}
      />

      <Section id="compare" eyebrow="Quick comparison" title="setTimeout and setInterval side by side">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3" />
                <th className="px-5 py-3">setTimeout</th>
                <th className="px-5 py-3">setInterval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparison.map((row) => (
                <tr key={row.label}>
                  <td className="px-5 py-3.5 font-medium text-slate-900">{row.label}</td>
                  <td className="px-5 py-3.5 text-slate-600">{row.timeout}</td>
                  <td className="px-5 py-3.5 text-slate-600">{row.interval}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="questions"
        eyebrow="Questions and answers"
        title="Ten questions to practice"
        description="Click a question to open the answer."
        className="pt-0 sm:pt-0"
      >
        <div className="space-y-3">
          {questions.map((item, index) => (
            <details
              key={item.q}
              open={index === 0}
              className="group rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 text-sm font-semibold tabular-nums text-indigo-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base font-semibold text-slate-900">{item.q}</span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>

              <div className="space-y-4 border-t border-slate-200 p-4 sm:p-5">
                <div className="rounded-lg border-l-4 border-indigo-500 bg-indigo-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Say this</p>
                  <p className="mt-1 text-base leading-7 text-slate-900">{item.say}</p>
                </div>
                {item.more.map((paragraph) => (
                  <P key={paragraph}>{paragraph}</P>
                ))}
                {item.code && <CodeBlock code={item.code} marks={item.marks} />}
              </div>
            </details>
          ))}
        </div>
      </Section>

      <PageNav prev={{ href: "/cleanup", label: "Cleanup" }} />
    </>
  );
}
