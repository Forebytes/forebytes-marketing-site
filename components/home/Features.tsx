"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap";

const CARDS = [
  { t: "Prices and nutrition", b: "Know what it costs and what's in it before you sit down.", bg: "bg-accent-2-300", dot: "bg-accent-2-700", fg: "" },
  { t: "Dish-level ratings", b: "Not just the restaurant. Find out which dish to order.", bg: "bg-accent", dot: "bg-accent-900", fg: "text-bg" },
  { t: "Your lists", b: "Saved for Later, Want to Try, Places Visited, plus lists of your own.", bg: "bg-bg", dot: "bg-accent-300", fg: "" },
  { t: "Friend feed", b: "Follow friends and see what they're eating right now.", bg: "bg-accent-2-700", dot: "bg-accent-2-300", fg: "text-bg" },
  { t: "Add your photos", b: "Submit a dish photo and help bring it to AR.", bg: "bg-accent-200", dot: "bg-accent", fg: "" },
];

export default function Features() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const { gsap, ScrollTrigger } = registerGsap();
      const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root.current!);

      const apply = (h: number) => {
        const max = track.scrollWidth - innerWidth;
        gsap.set(track, { x: -h * max });
        cards.forEach((c) => {
          const cx = c.getBoundingClientRect().left + c.offsetWidth / 2;
          const d = (cx - innerWidth / 2) / innerWidth;
          gsap.set(c, { rotation: d * 14, y: Math.abs(d) * 70, scale: 1 - Math.min(0.2, Math.abs(d) * 0.2) });
        });
      };
      apply(0);
      ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom", invalidateOnRefresh: true, onUpdate: (s) => apply(s.progress), onRefresh: (s) => apply(s.progress) });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-accent-100 relative" style={{ height: "520vh" }}>
      <div className="sticky top-0 flex h-dvh flex-col justify-center pt-[72px] gap-[clamp(14px,4dvh,40px)] overflow-hidden">
        <h2 className="font-heading px-page m-0" style={{ fontSize: "clamp(30px,min(6vw,9dvh),96px)", lineHeight: 1 }}>
          Everything between<br />hungry and happy.
        </h2>
        <div data-track className="px-page flex w-max gap-7 will-change-transform">
          {CARDS.map((c) => (
            <div key={c.t} data-card className={`${c.bg} ${c.fg} flex flex-col justify-between p-8`} style={{ width: "min(420px,78vw)", height: "clamp(210px,44dvh,400px)", borderRadius: 44 }}>
              <div className={`${c.dot} h-[72px] w-[72px] rounded-full`} />
              <div>
                <h3 className="font-heading m-0 text-4xl leading-none">{c.t}</h3>
                <p className="mt-3 mb-0 leading-[1.45]">{c.b}</p>
              </div>
            </div>
          ))}
          <div className="w-[20vw] flex-none" />
        </div>
      </div>
    </section>
  );
}
