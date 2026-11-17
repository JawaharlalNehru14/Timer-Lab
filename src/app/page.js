import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import Callout from "@/components/Callout";
import { Code, Container, Section, buttonStyles } from "@/components/ui";
import { markLines } from "@/lib/markLines";

const heroCode = `useEffect(() => {
  const timer = setTimeout(() => {
    setShowToast(false);
  }, 3000);

  return () => clearTimeout(timer);
}, []);`;

const topics = [
  {
    href: "/settimeout",
    title: "setTimeout",
    text: "Run code once after a delay. Toasts, debounce and auto logout.",
  },
  {
    href: "/setinterval",
    title: "setInterval",
    text: "Run code again and again. Live dashboards, resend OTP and clocks.",
  },
  {
    href: "/cleanup",
    title: "Cleanup",
    text: "See what happens with and without a cleanup function.",
  },
  {
    href: "/interview",
    title: "Interview notes",
    text: "Short answers you can say out loud, with code.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <div className="border-b border-slate-200 bg-white">
        <Container className="py-12 sm:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="mb-3 text-sm font-semibold text-indigo-600">JavaScript timers in React</p>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                setTimeout and setInterval, explained with working examples
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                Learn when to use each timer, how to clean it up in React, and what goes wrong when you do
                not. Every topic has live code and a console you can watch.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/settimeout" className={buttonStyles("primary", "px-5 py-2.5")}>
                  Start with setTimeout
                </Link>
                <Link href="/cleanup" className={buttonStyles("secondary", "px-5 py-2.5")}>
                  See the cleanup demo
                </Link>
              </div>
            </div>

            <div className="min-w-0">
              <CodeBlock
                code={heroCode}
                filename="Toast.js"
                marks={markLines(heroCode, [["return () => clearTimeout", "good"]])}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Topics */}
      <Section
        eyebrow="Learning path"
        title="Four short topics"
        description="Go in order. Each page has a short definition, a real example and a live demo."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic, index) => (
            <Link
              key={topic.href}
              href={topic.href}
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-300"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-700">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-indigo-700">
                {topic.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{topic.text}</p>
              <span className="mt-4 text-sm font-medium text-indigo-600">Open page →</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Definitions */}
      <Section
        eyebrow="Quick definitions"
        title="The two timers in one minute"
        description="Both are built into the browser. Both give you an id that you can use to stop them."
        className="pt-0 sm:pt-0"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-indigo-600">Runs once</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">setTimeout</h3>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Runs a function one time, after a delay.
            </p>
            <p className="mt-4">
              <Code>setTimeout(callback, delayInMs)</Code>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Cancel it with <Code>clearTimeout(id)</Code>.
            </p>
            <p className="mt-5 text-sm font-semibold text-slate-900">Use it for</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
              <li>Closing a toast message after a few seconds</li>
              <li>Debouncing a search input</li>
              <li>Logging out a user after inactivity</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-indigo-600">Runs repeatedly</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">setInterval</h3>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Runs a function again and again, at a fixed interval, until you stop it.
            </p>
            <p className="mt-4">
              <Code>setInterval(callback, delayInMs)</Code>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Stop it with <Code>clearInterval(id)</Code>.
            </p>
            <p className="mt-5 text-sm font-semibold text-slate-900">Use it for</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
              <li>Refreshing a live dashboard</li>
              <li>A resend OTP countdown</li>
              <li>Clocks, stopwatches and progress counters</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* The rule */}
      <Section className="pt-0 pb-14 sm:pt-0 sm:pb-20">
        <Callout type="warning" title="The one rule to remember">
          <p>
            A timer started inside <Code>useEffect</Code> needs a cleanup function. When a component is
            removed, its timers do not stop on their own. They keep running, keep the component data in
            memory, and keep doing work that nobody sees.
          </p>
          <p className="mt-3">
            <Link href="/cleanup" className="font-semibold underline underline-offset-4">
              Watch it happen in the cleanup demo
            </Link>
          </p>
        </Callout>
      </Section>
    </>
  );
}
