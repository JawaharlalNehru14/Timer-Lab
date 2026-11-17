import Link from "next/link";
import { Container } from "@/components/ui";

/** Top band of each page. `links` adds jump links to sections on the same page. */
export default function PageHeader({ eyebrow, title, description, links = [] }) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <Container className="py-12 sm:py-16">
        {eyebrow && <p className="mb-3 text-sm font-semibold text-indigo-600">{eyebrow}</p>}
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{description}</p>
        )}
        {links.length > 0 && (
          <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </Container>
    </div>
  );
}
