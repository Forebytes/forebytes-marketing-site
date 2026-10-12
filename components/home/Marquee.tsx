"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap, clamp, prefersReducedMotion } from "@/lib/gsap";

const ITEMS = ["Find", "Browse", "Place in AR", "Rate", "Share"];

function Strip() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="font-heading text-bg flex gap-11 pr-11 whitespace-nowrap" style={{ fontSize: "clamp(28px,4vw,52px)" }} aria-hidden>
      {row.map((t, i) => (
        <span key={i} className="contents"><span>{t}</span><span>●</span></span>
      ))}
    </div>
  );
}

export default function Marquee() {
  const skew = useRef<HTMLDivElement>(null);

  // The strip leans into the scroll: skew follows scroll velocity and eases back to rest.
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const st = ScrollTrigger.create({ start: 0, end: "max" });
    const to = gsap.quickTo(skew.current!, "skewX", { duration: 0.5, ease: "power3.out" });
    const tick = () => {
      to(-clamp(st.getVelocity() / 170, -22, 22));
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); st.kill(); };
  });

  return (
    <div role="presentation" className="bg-accent relative z-[2] overflow-hidden py-[22px] shadow-md" style={{ transform: "rotate(-2deg)", margin: "0 -4vw" }}>
      <div ref={skew} className="flex w-max" style={{ animation: "marquee 28s linear infinite" }}>
        <Strip />
        <Strip />
      </div>
    </div>
  );
}
