const styles = {
  info: {
    box: "border-indigo-200 bg-indigo-50",
    title: "text-indigo-900",
    body: "text-indigo-900/80",
  },
  warning: {
    box: "border-amber-200 bg-amber-50",
    title: "text-amber-900",
    body: "text-amber-900/80",
  },
  success: {
    box: "border-emerald-200 bg-emerald-50",
    title: "text-emerald-900",
    body: "text-emerald-900/80",
  },
  danger: {
    box: "border-rose-200 bg-rose-50",
    title: "text-rose-900",
    body: "text-rose-900/80",
  },
};

export default function Callout({ type = "info", title, children }) {
  const s = styles[type];
  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${s.box}`}>
      {title && <p className={`text-sm font-semibold ${s.title}`}>{title}</p>}
      <div className={`${title ? "mt-1.5" : ""} text-sm leading-6 ${s.body}`}>{children}</div>
    </div>
  );
}
