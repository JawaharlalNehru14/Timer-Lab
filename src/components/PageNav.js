import Link from "next/link";
import { Container } from "@/components/ui";

/** Previous / next links at the bottom of a page. */
export default function PageNav({ prev, next }) {
  return (
    <section className="pb-14 pt-4 sm:pb-20">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              href={prev.href}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-300"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Previous</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-indigo-700">
                {"← " + prev.label}
              </p>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <Link
              href={next.href}
              className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-colors hover:border-indigo-300 sm:text-right"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Next</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-indigo-700">
                {next.label + " →"}
              </p>
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}
