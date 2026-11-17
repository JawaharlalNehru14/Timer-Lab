import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import PageNav from "@/components/PageNav";
import CodeBlock from "@/components/CodeBlock";
import Callout from "@/components/Callout";
import IntervalBasicDemo from "@/components/demos/IntervalBasicDemo";
import OtpDemo from "@/components/demos/OtpDemo";
import PollingDemo from "@/components/demos/PollingDemo";
import { Card, Code, P, Section } from "@/components/ui";
import { markLines } from "@/lib/markLines";

export const metadata = {
  title: "setInterval",
  description: "Learn setInterval in React with live demos: stopwatch, resend OTP and live polling.",
};

const syntaxCode = `const intervalId = setInterval(callback, delay);

clearInterval(intervalId); // stop it`;

const staleWrong = `useEffect(() => {
  const interval = setInterval(() => {
    setCount(count + 1); // count is always 0 here
  }, 1000);

  return () => clearInterval(interval);
}, []);`;

const staleRight = `useEffect(() => {
  const interval = setInterval(() => {
    setCount((c) => c + 1); // always the latest value
  }, 1000);

  return () => clearInterval(interval);
}, []);`;

const recursiveCode = `useEffect(() => {
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

export default function SetIntervalPage() {
  return (
    <>
      <PageHeader
        eyebrow="Topic 2"
        title="setInterval"
        description="Runs a function again and again at a fixed interval, until you stop it."
        links={[
          { href: "#basics", label: "Basics" },
          { href: "#otp", label: "Resend OTP" },
          { href: "#polling", label: "Live dashboard" },
          { href: "#mistakes", label: "Common mistakes" },
          { href: "#interview", label: "Interview answer" },
        ]}
      />

      <Section id="basics" eyebrow="1. Basics" title="Definition and syntax">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <P>
              <Code>setInterval</Code> calls a function every N milliseconds. It does not stop by itself. You
              must call <Code>clearInterval</Code> when you no longer need it.
            </P>
            <Card>
              <p className="text-sm font-semibold text-slate-900">Key points</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                <li>The first argument is the function to run. The second is the time between runs.</li>
                <li>
                  It returns an id. Pass that id to <Code>clearInterval</Code> to stop it.
                </li>
                <li>It keeps running even if the component that started it is gone.</li>
                <li>
                  For one run only, use <Code>setTimeout</Code>.
                </li>
              </ul>
            </Card>
          </div>
          <div className="min-w-0">
            <CodeBlock code={syntaxCode} filename="syntax.js" />
          </div>
        </div>

        <div className="mt-10">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Try it</h3>
          <IntervalBasicDemo />
        </div>
      </Section>

      <Section
        id="otp"
        eyebrow="2. Real example"
        title="Resend OTP countdown"
        description="After sending a code, lock the resend button and count down. When the countdown reaches zero, stop the interval and unlock the button."
        className="border-t border-slate-200 bg-white"
      >
        <OtpDemo />
      </Section>

      <Section
        id="polling"
        eyebrow="3. Real example"
        title="Live dashboard polling"
        description="Polling means asking the server for fresh data at a fixed interval. It is the simplest way to keep numbers on a dashboard up to date."
      >
        <PollingDemo />
      </Section>

      <Section id="mistakes" eyebrow="4. Avoid these" title="Common mistakes" className="border-t border-slate-200 bg-white">
        <div className="space-y-10">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Using old state inside the interval</h3>
            <P className="mt-2 max-w-3xl">
              The interval callback is created once, when the effect runs. It remembers the state from that
              render. With <Code>count + 1</Code> the counter goes to 1 and stays there. A functional update
              always receives the latest value.
            </P>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <CodeBlock code={staleWrong} marks={markLines(staleWrong, [["setCount(count + 1)", "bad"]])} />
              <CodeBlock code={staleRight} marks={markLines(staleRight, [["setCount((c) => c + 1)", "good"]])} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">Forgetting clearInterval</h3>
            <P className="mt-2 max-w-3xl">
              This is the most costly mistake with intervals. The timer keeps running after the component is
              removed, and every new mount adds another one.
            </P>
            <p className="mt-3">
              <Link href="/cleanup" className="text-sm font-semibold text-indigo-600 underline underline-offset-4">
                See it in the cleanup demo
              </Link>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">Polling with slow requests</h3>
            <P className="mt-2 max-w-3xl">
              setInterval does not wait for the previous request to finish. If a request takes longer than the
              interval, requests pile up. For API polling, a recursive setTimeout is safer, because the next
              timer starts only after the previous request is done.
            </P>
            <div className="mt-4 max-w-3xl">
              <CodeBlock
                code={recursiveCode}
                filename="usePolling.js"
                marks={markLines(recursiveCode, [["clearTimeout(timerId)", "good"]])}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="interview">
        <Callout type="success" title="Say it in an interview">
          <p className="text-base leading-7">
            {
              "“setInterval runs code repeatedly at a fixed interval until it is cleared. I use it for polling a live dashboard, a resend OTP countdown, or a clock. In React, I return clearInterval from useEffect. Without it, the timer keeps running after the component unmounts, which wastes work and leaks memory.”"
            }
          </p>
        </Callout>
      </Section>

      <PageNav
        prev={{ href: "/settimeout", label: "setTimeout" }}
        next={{ href: "/cleanup", label: "Cleanup" }}
      />
    </>
  );
}
