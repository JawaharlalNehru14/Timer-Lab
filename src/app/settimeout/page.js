import PageHeader from "@/components/PageHeader";
import PageNav from "@/components/PageNav";
import CodeBlock from "@/components/CodeBlock";
import Callout from "@/components/Callout";
import TimeoutBasicDemo from "@/components/demos/TimeoutBasicDemo";
import ToastDemo from "@/components/demos/ToastDemo";
import DebounceDemo from "@/components/demos/DebounceDemo";
import IdleLogoutDemo from "@/components/demos/IdleLogoutDemo";
import { Card, Code, P, Section } from "@/components/ui";
import { markLines } from "@/lib/markLines";

export const metadata = {
  title: "setTimeout",
  description: "Learn setTimeout in React with live demos: toast, debounce and auto logout.",
};

const syntaxCode = `const timerId = setTimeout(callback, delay);

clearTimeout(timerId); // cancel it before it runs`;

const wrongCall = `// Wrong: showMessage() runs right now
setTimeout(showMessage(), 2000);`;

const rightCall = `// Right: pass the function itself
setTimeout(showMessage, 2000);
setTimeout(() => showMessage(), 2000);`;

const noCleanup = `useEffect(() => {
  setTimeout(() => setShowToast(false), 3000);
  // No cleanup: this can run after unmount
}, []);`;

const withCleanup = `useEffect(() => {
  const timer = setTimeout(() => setShowToast(false), 3000);
  return () => clearTimeout(timer);
}, []);`;

export default function SetTimeoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Topic 1"
        title="setTimeout"
        description="Runs a function once, after a delay. Use it when something should happen later, one time."
        links={[
          { href: "#basics", label: "Basics" },
          { href: "#toast", label: "Auto-close toast" },
          { href: "#debounce", label: "Debounce search" },
          { href: "#logout", label: "Auto logout" },
          { href: "#mistakes", label: "Common mistakes" },
          { href: "#interview", label: "Interview answer" },
        ]}
      />

      <Section id="basics" eyebrow="1. Basics" title="Definition and syntax">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <P>
              <Code>setTimeout</Code> runs a function one time, after a delay. The delay is in milliseconds,
              so 1000 means one second.
            </P>
            <Card>
              <p className="text-sm font-semibold text-slate-900">Key points</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                <li>The first argument is the function to run. The second is the delay in milliseconds.</li>
                <li>
                  It returns an id. Pass that id to <Code>clearTimeout</Code> to cancel the timer.
                </li>
                <li>The delay is a minimum. If the browser is busy, the function runs later.</li>
                <li>
                  It runs once. For repeated work, use <Code>setInterval</Code>.
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
          <TimeoutBasicDemo />
        </div>
      </Section>

      <Section
        id="toast"
        eyebrow="2. Real example"
        title="Auto-close a toast message"
        description="After an action succeeds, show a message and remove it by itself. The user does not need to click close."
        className="border-t border-slate-200 bg-white"
      >
        <ToastDemo />
      </Section>

      <Section
        id="debounce"
        eyebrow="3. Real example"
        title="Debounce a search input"
        description="Debounce means waiting until the user stops typing before running the search. Each key press clears the old timer and starts a new one."
      >
        <DebounceDemo />
      </Section>

      <Section
        id="logout"
        eyebrow="4. Real example"
        title="Log out after inactivity"
        description="Start a timer when the user is active. Any activity clears it and starts a new one. If nothing happens, the timer finishes and the user is logged out."
        className="border-t border-slate-200 bg-white"
      >
        <IdleLogoutDemo />
      </Section>

      <Section id="mistakes" eyebrow="5. Avoid these" title="Common mistakes">
        <div className="space-y-10">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Calling the function instead of passing it</h3>
            <P className="mt-2 max-w-3xl">
              Adding brackets calls the function immediately. setTimeout then receives the result, not the
              function, so there is nothing to run later.
            </P>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <CodeBlock code={wrongCall} marks={markLines(wrongCall, [["setTimeout(showMessage()", "bad"]])} />
              <CodeBlock
                code={rightCall}
                marks={markLines(rightCall, [["setTimeout(showMessage,", "good"], ["setTimeout(() =>", "good"]])}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">Forgetting clearTimeout in useEffect</h3>
            <P className="mt-2 max-w-3xl">
              If the user leaves the page before the delay ends, the timer still fires. It tries to update a
              component that no longer exists, and it keeps the old component data in memory until it runs.
            </P>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <CodeBlock code={noCleanup} marks={markLines(noCleanup, [["// No cleanup", "bad"]])} />
              <CodeBlock code={withCleanup} marks={markLines(withCleanup, [["return () => clearTimeout", "good"]])} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">Expecting an exact delay</h3>
            <P className="mt-2 max-w-3xl">
              <Code>setTimeout(fn, 1000)</Code> means at least 1000 ms. The function waits in a queue and runs
              when the main thread is free. Heavy work on the page can delay it. Never use setTimeout to
              measure exact time.
            </P>
          </div>
        </div>
      </Section>

      <Section id="interview" className="pt-0 sm:pt-0">
        <Callout type="success" title="Say it in an interview">
          <p className="text-base leading-7">
            {
              "“setTimeout runs code once after a delay. I use it for debouncing a search input, auto-dismissing a toast, or logging a user out after inactivity. In React, I return clearTimeout from useEffect so the timer does not fire after the component unmounts.”"
            }
          </p>
        </Callout>
      </Section>

      <PageNav next={{ href: "/setinterval", label: "setInterval" }} />
    </>
  );
}
