import PageHeader from "@/components/PageHeader";
import PageNav from "@/components/PageNav";
import CodeBlock from "@/components/CodeBlock";
import Callout from "@/components/Callout";
import CleanupDemo from "@/components/demos/CleanupDemo";
import { Card, Code, P, Section } from "@/components/ui";
import { markLines } from "@/lib/markLines";

export const metadata = {
  title: "Cleanup",
  description: "See what happens to timers with and without a useEffect cleanup function.",
};

const syntaxCode = `useEffect(() => {
  // 1. Start something
  const timer = setInterval(doWork, 1000);

  // 2. Return a function that stops it
  return () => clearInterval(timer);
}, []);`;

const effects = [
  {
    title: "The timer keeps running",
    text: "The component is gone from the screen, but the browser still calls your function on every tick.",
  },
  {
    title: "Memory is not released",
    text: "The running callback holds references to the component variables. Garbage collection cannot free them.",
  },
  {
    title: "Timers pile up",
    text: "Each time the component mounts again, a new timer starts. After three mounts you have three timers.",
  },
  {
    title: "Wasted work and requests",
    text: "A polling interval keeps sending network requests for a page that nobody is looking at.",
  },
];

const checklist = [
  { resource: "setTimeout", start: "setTimeout(fn, ms)", stop: "clearTimeout(id)" },
  { resource: "setInterval", start: "setInterval(fn, ms)", stop: "clearInterval(id)" },
  { resource: "Event listener", start: "window.addEventListener(...)", stop: "window.removeEventListener(...)" },
  { resource: "WebSocket", start: "new WebSocket(url)", stop: "socket.close()" },
  { resource: "Fetch request", start: "fetch(url, { signal })", stop: "controller.abort()" },
];

export default function CleanupPage() {
  return (
    <>
      <PageHeader
        eyebrow="Topic 3"
        title="useEffect cleanup"
        description="A cleanup function stops what an effect started. Without it, timers keep running after the component is gone."
        links={[
          { href: "#basics", label: "What is cleanup" },
          { href: "#demo", label: "Live demo" },
          { href: "#effects", label: "Effects of a leak" },
          { href: "#inspect", label: "Check it yourself" },
          { href: "#checklist", label: "Checklist" },
          { href: "#interview", label: "Interview answer" },
        ]}
      />

      <Section id="basics" eyebrow="1. Basics" title="What is a cleanup function">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <P>
              A function returned from <Code>useEffect</Code> is the cleanup function. React runs it in two
              situations:
            </P>
            <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-slate-600">
              <li>When the component is removed from the screen (unmount).</li>
              <li>Before the effect runs again, if its dependencies changed.</li>
            </ul>
            <P>
              Use it to undo what the effect started: clear timers, remove listeners, close connections.
            </P>
          </div>
          <div className="min-w-0">
            <CodeBlock
              code={syntaxCode}
              filename="pattern.js"
              marks={markLines(syntaxCode, [["return () => clearInterval", "good"]])}
            />
          </div>
        </div>
      </Section>

      <Section
        id="demo"
        eyebrow="2. Live demo"
        title="With cleanup and without cleanup"
        description="Switch between the two modes. In each one, mount the component, then unmount it, and watch the timer count and the console."
        className="border-t border-slate-200 bg-white"
      >
        <CleanupDemo />
      </Section>

      <Section
        id="effects"
        eyebrow="3. What goes wrong"
        title="Effects of a missing cleanup"
        description="These are the problems you saw in the demo, explained one by one."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {effects.map((item, index) => (
            <Card key={item.title}>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-sm font-semibold text-rose-700">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        id="inspect"
        eyebrow="4. Check it yourself"
        title="How to spot a leaking timer in DevTools"
        className="border-t border-slate-200 bg-white"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="text-base font-semibold text-slate-900">Console test</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
              <li>Press F12 and open the Console tab.</li>
              <li>Open the page that starts the timer. Watch the log messages.</li>
              <li>Navigate to another page, or unmount the component.</li>
              <li>If the messages keep appearing, the timer was not cleaned up.</li>
            </ol>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-slate-900">Memory and CPU test</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
              <li>Open the Performance tab and start recording.</li>
              <li>Mount and unmount the component several times.</li>
              <li>Stop recording. Look at the timer events in the activity chart.</li>
              <li>A growing number of timer events means timers are piling up.</li>
            </ol>
          </Card>
        </div>
        <div className="mt-6">
          <Callout type="info" title="About React Strict Mode">
            In development, Strict Mode runs every effect twice: setup, cleanup, setup. This is on purpose. A
            missing cleanup shows up immediately as two timers instead of one. This project turns Strict Mode
            off in next.config.mjs so the demo counts are easy to read. Keep it on in your real projects.
          </Callout>
        </div>
      </Section>

      <Section
        id="checklist"
        eyebrow="5. Reference"
        title="What needs a cleanup"
        description="Anything started in an effect that keeps running should be stopped in the cleanup."
      >
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Resource</th>
                <th className="px-5 py-3">Start</th>
                <th className="px-5 py-3">Stop in cleanup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {checklist.map((row) => (
                <tr key={row.resource}>
                  <td className="px-5 py-3 font-medium text-slate-900">{row.resource}</td>
                  <td className="px-5 py-3 font-mono text-[13px] text-slate-600">{row.start}</td>
                  <td className="px-5 py-3 font-mono text-[13px] text-slate-600">{row.stop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="interview" className="pt-0 sm:pt-0">
        <Callout type="success" title="Say it in an interview">
          <p className="text-base leading-7">
            {
              "“Both timers need a cleanup function in useEffect. Without it, the timer keeps running after the component unmounts. That causes memory leaks and unnecessary work, and each remount adds one more timer.”"
            }
          </p>
        </Callout>
      </Section>

      <PageNav
        prev={{ href: "/setinterval", label: "setInterval" }}
        next={{ href: "/interview", label: "Interview notes" }}
      />
    </>
  );
}
