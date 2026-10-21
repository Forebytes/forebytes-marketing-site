"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap";

const TEXT = "Menus are flat photos and guesses. Your dinner is not. Forebytes lets you see the real dish, at real size, on your real table.";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const words = TEXT.split(" ");

  useGSAP(
    () => {
      const { gsap } = registerGsap();
      const spans = gsap.utils.toArray<HTMLElement>("[data-w]", root.current!);
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim();
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.4 },
      });
      // Words light up one after another; the closing clause turns accent.
      spans.forEach((s, i) => {
        const at = (i / spans.length) * 0.87;
        tl.fromTo(s, { opacity: 0.14, y: 18 }, { opacity: 1, y: 0, duration: 0.09 }, at);
        if (i > spans.length * 0.55) tl.to(s, { color: accent, duration: 0.09 }, at);
      });
      tl.set({}, {}, 1);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative" style={{ height: "260vh" }}>
      <div className="px-page sticky top-0 flex h-dvh items-center pt-16">
        <div>
          <p
            className="font-heading max-w-[15em]"
            style={{ fontSize: "clamp(28px,min(6.2vw,9.5dvh),104px)", lineHeight: 1.04, letterSpacing: "-.02em" }}
          >
            {words.map((w, i) => (
              <span key={i} data-w className="inline-block whitespace-pre" style={{ opacity: 0.14 }}>
                {w}{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
