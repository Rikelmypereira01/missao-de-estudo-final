import Link from "next/link";
import { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-card/90 p-6 shadow-panel backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold tracking-[0.2em] text-softGold">{children}</span>;
}

export function Button({
  children,
  href,
  variant = "primary",
  type = "button"
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
}) {
  const classes = {
    primary: "bg-gold text-black hover:bg-softGold",
    secondary: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    ghost: "text-softGold hover:text-gold"
  }[variant];

  if (href) {
    return (
      <Link href={href} className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 font-bold transition ${classes}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 font-bold transition ${classes}`}>
      {children}
    </button>
  );
}
