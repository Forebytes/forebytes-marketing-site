"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const pill = "text-text font-semibold text-[15px]";

export default function Nav() {
  const path = usePathname();
  const home = path === "/";
  const h = (hash: string) => (home ? hash : `/${hash}`);

  return (
    <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        aria-label="Primary"
        className="fade-up pointer-events-auto flex items-center gap-4 sm:gap-6 rounded-full py-2 pr-2 pl-5 shadow-md backdrop-blur-[14px]"
        style={{ background: "color-mix(in srgb, var(--color-bg) 82%, transparent)", animationDelay: ".2s" }}
      >
        <Link href="/" className="font-heading flex items-center gap-2.5 text-[22px] !text-text">
          <Image src="/logo.png" alt="" width={30} height={30} className="rounded-[9px]" priority />
          Forebytes
        </Link>
        {home && (
          <>
            <a href="#how" className={`${pill} hidden md:inline`}>How it works</a>
            <a href="#ar" className={`${pill} hidden md:inline`}>AR</a>
          </>
        )}
        <Link href="/about" className={`${pill} hidden sm:inline`} aria-current={path === "/about" ? "page" : undefined}>
          About
        </Link>
        <a href={h("#join")} className="btn btn-primary !text-bg whitespace-nowrap">
          Get early access
        </a>
      </nav>
    </header>
    </>
  );
}
