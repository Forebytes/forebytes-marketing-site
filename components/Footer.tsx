"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap, clamp } from "@/lib/gsap";

const LETTERS = ["F", "o", "r", "e", "b", "y", "t", "e", "s", "."];

export function FooterCompact() {
  return (
    <footer className="bg-accent-900 text-accent-200 px-page flex flex-wrap items-center justify-between gap-5 py-10">
      <Link href="/" className="font-heading flex items-center gap-2.5 text-[26px] !text-bg">
        <Image src="/logo.png" alt="" width={32} height={32} className="rounded-[9px]" />
        Forebytes
      </Link>
      <div className="flex flex-wrap gap-7 text-[15px]">
        <Link href="/about" className="foot-link">About</Link>
        <Link href="/faq" className="foot-link">FAQs</Link>
        <Link href="/community-guidelines" className="foot-link">Community guidelines</Link>
        <Link href="/privacy" className="foot-link">Privacy policy</Link>
        <Link href="/terms" className="foot-link">Terms &amp; conditions</Link>
      </div>
      <span className="text-sm">© 2026 Forebytes · Dublin</span>
    </footer>
  );
}

export function FooterFull() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const { gsap, ScrollTrigger } = registerGsap();
      const el = root.current!;
      const letters = gsap.utils.toArray<HTMLElement>("[data-wl] > span", el);
      const apply = (fp: number) =>
        letters.forEach((l, i) => {
          const k = clamp(fp * (letters.length + 3) - i - 1.5);
          const e = 1 - Math.pow(1 - k, 3);
          gsap.set(l, { yPercent: (1 - e) * 115, rotation: (1 - e) * (i % 2 ? 14 : -14) });
        });
      apply(0);
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: () => `top+=${el.offsetHeight * 0.9} bottom`,
        invalidateOnRefresh: true,
        onUpdate: (s) => apply(s.progress),
        onRefresh: (s) => apply(s.progress),
      });
    },
    { scope: root },
  );

  const col = "flex flex-col gap-2.5";
  return (
    <footer ref={root} className="bg-accent-900 text-accent-200 px-page relative overflow-hidden pt-[clamp(60px,10vh,110px)]">
      <div className="flex flex-wrap justify-between gap-10">
        <div className="max-w-[22em] text-lg leading-normal">
          <span className="font-heading text-bg mb-2 block text-[30px]">See it before you bite it.</span>
          Restaurant discovery and AR menus, launching in Dublin.
        </div>
        <div className="flex flex-wrap gap-[clamp(32px,6vw,96px)] text-[17px]">
          <div className={col}>
            <b className="text-bg">Product</b>
            <a href="#how" className="foot-link">How it works</a>
            <a href="#ar" className="foot-link">AR</a>
            <a href="#join" className="foot-link">Waitlist</a>
          </div>
          <div className={col}>
            <b className="text-bg">Company</b>
            <Link href="/about" className="foot-link">About us</Link>
            <Link href="/faq" className="foot-link">FAQs</Link>
            <Link href="/about#contact" className="foot-link">Contact</Link>
          </div>
          <div className={col}>
            <b className="text-bg">Legal</b>
            <Link href="/privacy" className="foot-link">Privacy policy</Link>
            <Link href="/terms" className="foot-link">Terms &amp; conditions</Link>
            <Link href="/community-guidelines" className="foot-link">Community guidelines</Link>
          </div>
        </div>
      </div>

      <div
        aria-label="Forebytes"
        role="img"
        className="font-heading text-accent mt-[clamp(40px,8vh,90px)] flex justify-center whitespace-nowrap select-none"
        style={{ fontSize: "calc((100vw - 2 * var(--gutter)) * 0.2389)", lineHeight: 0.95, letterSpacing: "-.04em" }}
      >
        {LETTERS.map((c, i) => (
          <span key={i} data-wl aria-hidden className="inline-block overflow-hidden" style={{ padding: ".05em .02em .3em", margin: "-.05em 0 -.3em" }}>
            <span className="inline-block" style={{ color: i >= 4 && i <= 8 ? "var(--color-bg)" : undefined }}>{c}</span>
          </span>
        ))}
      </div>

      <div className="flex flex-wrap justify-between gap-3 border-t border-accent-200/25 pt-[18px] pb-6 text-sm">
        <span>© 2026 Forebytes · Dublin</span>
        <span>Made for the hungry.</span>
      </div>
    </footer>
  );
}
