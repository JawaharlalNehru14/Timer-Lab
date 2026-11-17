const variants = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600 disabled:bg-indigo-300 disabled:hover:bg-indigo-300",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-indigo-600 disabled:text-slate-400 disabled:hover:bg-white",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600 disabled:bg-rose-300 disabled:hover:bg-rose-300",
};

/** Class string for buttons. Also used on <Link> elements. */
export function buttonStyles(variant = "primary", className = "") {
  return `inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${variants[variant]} ${className}`;
}

export function Button({ variant = "primary", className = "", ...props }) {
  return <button type="button" className={buttonStyles(variant, className)} {...props} />;
}

const tones = {
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function Badge({ tone = "slate", className = "", children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Page width and side padding. Every section uses this, so edges always line up. */
export function Container({ className = "", children }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

/** A page section with a consistent heading and vertical spacing. */
export function Section({ id, eyebrow, title, description, className = "", children }) {
  return (
    <section id={id} className={`scroll-mt-24 py-10 sm:py-14 ${className}`}>
      <Container>
        {title && (
          <div className="mb-8 max-w-3xl">
            {eyebrow && (
              <p className="mb-2 text-sm font-semibold text-indigo-600">{eyebrow}</p>
            )}
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h2>
            {description && (
              <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

export function P({ className = "", children }) {
  return <p className={`text-base leading-7 text-slate-600 ${className}`}>{children}</p>;
}

/** Inline code. */
export function Code({ children }) {
  return (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">
      {children}
    </code>
  );
}

/** A white card. */
export function Card({ className = "", children }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

/** A small number or label block used inside demo outputs. */
export function Stat({ label, value, tone = "slate" }) {
  const toneClass = {
    slate: "border-slate-200 bg-slate-50 text-slate-900",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-800",
  }[tone];

  return (
    <div className={`rounded-lg border px-4 py-3 ${toneClass}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
