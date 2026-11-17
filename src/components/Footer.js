import Link from "next/link";
import { Container } from "@/components/ui";

const links = [
  { href: "/settimeout", label: "setTimeout" },
  { href: "/setinterval", label: "setInterval" },
  { href: "/cleanup", label: "Cleanup" },
  { href: "/interview", label: "Interview notes" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Timer Lab</p>
          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
            A practical guide to setTimeout and setInterval in React, with live demos.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-600 transition-colors hover:text-indigo-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
