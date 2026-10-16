"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SceneAnchor from "@/components/SceneAnchor";
import { registerGsap, clamp } from "@/lib/gsap";

const STEPS = [
  { n: "01", title: "Find what's nearby.", body: "A live map of Dublin's restaurants with search and filters for distance, cuisine and rating." },
  { n: "02", title: "Read the whole menu.", body: "Dishes with prices and nutrition up front. No scrolling past a PDF to find out what it costs." },
  { n: "03", title: "Put it on your table.", body: "Open any dish in AR. Check the portion, the plating, the size. Then decide." },
  { n: "04", title: "Rate what you ate.", body: "Rate restaurants and individual dishes, and add your own photos." },
  { n: "05", title: "See what friends eat.", body: "Follow people you trust and let their plates decide yours." },
];

const Star = ({ filled = true }: { filled?: boolean }) => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.75" strokeLinejoin="round" aria-hidden>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

function MenuRow({ tone }: { tone: "a" | "b" }) {
  const a = tone === "a";
  return (
    <div className="flex items-center gap-3 rounded-[22px] p-3" style={{ background: a ? "var(--color-accent-100)" : "var(--color-accent-2-100)" }}>
      <div className="h-[62px] w-[62px] flex-none rounded-full" style={{ background: a ? "var(--color-accent-300)" : "var(--color-accent-2-300)" }} />
      <div className="min-w-0 flex-1">
        <div className="font-heading text-[17px]">Dish name</div>
        <div className="text-neutral-600 text-xs">Nutrition · kcal</div>
      </div>
      <div className="font-bold">€ —</div>
    </div>
  );
}

function FeedCard({ tone, label }: { tone: "a" | "b"; label: string }) {
  const a = tone === "a";
  return (
    <div className="rounded-3xl p-3.5" style={{ background: a ? "var(--color-accent-2-100)" : "var(--color-accent-100)" }}>
      <div className="mb-2.5 flex items-center gap-2.5">
        <div className="h-[34px] w-[34px] rounded-full" style={{ background: a ? "var(--color-accent-2)" : "var(--color-accent)" }} />
        <div className="text-[13px] font-semibold">{label}</div>
      </div>
      <div className="h-24 rounded-[18px]" style={{ background: a ? "var(--color-accent-2-300)" : "var(--color-accent-300)" }} />
    </div>
  );
}

function PhoneScreens() {
  return (
    <>
      {/* 0 map */}
      <div data-screen className="bg-accent-100 absolute inset-0">
        <div className="bg-bg absolute h-[26px]" style={{ left: "-20%", top: "30%", width: "140%", transform: "rotate(-14deg)" }} />
        <div className="bg-bg absolute h-[18px]" style={{ left: "-20%", top: "62%", width: "140%", transform: "rotate(9deg)" }} />
        <div className="bg-bg absolute w-[22px]" style={{ left: "38%", top: "-10%", height: "120%", transform: "rotate(12deg)" }} />
        <div className="bg-accent absolute h-[38px] w-[38px] rounded-full" style={{ left: "18%", top: "24%" }} />
        <div className="bg-accent-2 absolute h-[38px] w-[38px] rounded-full" style={{ left: "62%", top: "40%" }} />
        <div className="bg-accent absolute h-[38px] w-[38px] rounded-full" style={{ left: "32%", top: "58%" }}><span className="bg-accent anim-ping absolute inset-0 rounded-full" /></div>
        <div className="bg-accent-2 absolute h-[38px] w-[38px] rounded-full" style={{ left: "72%", top: "68%" }} />
        <div className="bg-bg text-neutral-600 absolute inset-x-4 top-[52px] rounded-full px-5 py-3.5 text-sm shadow-md">Search restaurants, dishes…</div>
        <div className="bg-bg absolute inset-x-4 bottom-5 rounded-[28px] p-[18px] shadow-lg">
          <div className="font-heading text-xl">Near Dublin city centre</div>
          <div className="text-neutral-600 mt-1 text-[13px]">Sorted by distance</div>
        </div>
      </div>
      {/* 1 menu */}
      <div data-screen className="bg-bg absolute inset-0 px-[18px] pt-14">
        <div className="font-heading mb-4 text-[28px]">Menu</div>
        <div className="flex flex-col gap-3"><MenuRow tone="a" /><MenuRow tone="b" /><MenuRow tone="a" /><MenuRow tone="b" /></div>
      </div>
      {/* 2 AR */}
      <div data-screen className="bg-accent-2-300 absolute inset-0">
        <div className="bg-bg absolute rounded-full shadow-lg" style={{ left: "50%", top: "46%", width: "76%", aspectRatio: "1", transform: "translate(-50%,-50%)" }} />
        <div className="bg-accent-300 absolute rounded-full" style={{ left: "50%", top: "46%", width: "48%", aspectRatio: "1", transform: "translate(-50%,-50%)" }} />
        <div className="border-accent-2-700 absolute rounded-full border-[3px] border-dashed" style={{ left: "50%", top: "46%", width: "76%", aspectRatio: "1", transform: "translate(-50%,-50%)", animation: "spin 16s linear infinite" }} />
        <div className="absolute inset-x-0 bottom-[30px] flex justify-center"><span className="btn btn-primary">View in AR</span></div>
      </div>
      {/* 3 rate */}
      <div data-screen className="bg-bg absolute inset-0 px-[22px] pt-[70px] text-center">
        <div className="bg-accent-300 mx-auto mb-[26px] h-[150px] w-[150px] rounded-full" />
        <div className="font-heading text-[26px]">How was it?</div>
        <div className="text-accent my-5 flex justify-center gap-2"><Star /><Star /><Star /><Star /><Star filled={false} /></div>
        <span className="btn btn-primary btn-block">Submit rating</span>
      </div>
      {/* 4 feed */}
      <div data-screen className="bg-bg absolute inset-0 px-[18px] pt-14">
        <div className="font-heading mb-4 text-[28px]">Friends</div>
        <div className="flex flex-col gap-3.5"><FeedCard tone="a" label="A friend rated a dish" /><FeedCard tone="b" label="Another visited a place" /></div>
      </div>
    </>
  );
}

export default function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const { gsap, ScrollTrigger } = registerGsap();
      const el = root.current!;
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", el);
      const screens = gsap.utils.toArray<HTMLElement>("[data-screen]", el);
      const dots = gsap.utils.toArray<HTMLElement>("[data-dot]", el);
      const phone = el.querySelector<HTMLElement>("[data-phone]")!;
      const bg = el.querySelector<HTMLElement>("[data-story-bg]")!;
      const n = steps.length;
      const PI = Math.PI;

      // The phone is drawn at a fixed 320x650 so its screens always look like the app, then scaled to
      // fit the room: a share of the viewport height, and its column on wider screens.
      const box = el.querySelector<HTMLElement>("[data-phone-box]")!;
      const fit = () => {
        const wide = window.matchMedia("(min-width: 768px)").matches;
        const availH = (window.innerHeight - 72) * (wide ? 0.9 : 0.5);
        const availW = (wide ? box.parentElement!.clientWidth : window.innerWidth) * 0.78;
        el.style.setProperty("--s", String(Math.max(0.3, Math.min(1, availH / 650, availW / 320))));
      };
      fit();
      window.addEventListener("resize", fit);

      const apply = (p: number) => {
        const idx = p * n;
        screens.forEach((s, i) => {
          const d = idx - i - 0.5, a = Math.abs(d), o = clamp(1.6 - a * 2.6);
          gsap.set(s, { opacity: o, y: d * 120, scale: 1 - clamp(a) * 0.18, zIndex: o > 0.5 ? 2 : 1 });
        });
        steps.forEach((s, i) => {
          const d = idx - i - 0.5, a = Math.abs(d), o = clamp(1.5 - a * 3);
          gsap.set(s, { opacity: o, x: d * -240, rotation: d * -4, pointerEvents: o > 0.5 ? "auto" : "none" });
        });
        const active = Math.min(n - 1, Math.floor(idx));
        dots.forEach((d, i) => gsap.to(d, { scale: i === active ? 1.7 : 1, opacity: i === active ? 1 : 0.35, duration: 0.3, overwrite: true }));
        gsap.set(phone, {
          rotationY: Math.sin(p * PI * n) * 24,
          rotation: (p - 0.5) * -14,
          y: Math.sin(p * PI * n * 2) * 14,
          scale: 0.92 + Math.sin(p * PI) * 0.12,
        });
        gsap.set(bg, { scale: 0.6 + p * 0.9, xPercent: 0, x: `${-p * 10}vw` });
      };
      apply(0);
      ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom bottom", onUpdate: (s) => apply(s.progress), onRefresh: (s) => apply(s.progress) });
      return () => window.removeEventListener("resize", fit);
    },
    { scope: root },
  );

  const bigNum = { fontSize: "clamp(60px,min(22vw,26dvh),340px)", lineHeight: 0.8 };
  return (
    <section ref={root} className="bg-accent-2-100 relative" style={{ height: "700vh" }}>
      <SceneAnchor id="how" at={0.1} />
      <div className="px-page sticky top-0 grid h-dvh pt-[72px] grid-cols-1 grid-rows-[auto_auto] content-center items-center gap-4 overflow-hidden md:grid-cols-2 md:grid-rows-1 md:gap-6">
          <div data-spin className="border-accent-2-200 absolute rounded-full" style={{ left: "-14vw", top: "-14vw", width: "46vw", height: "46vw", borderWidth: "3vw", borderStyle: "solid" }} />
        <div data-story-bg className="bg-accent-200 absolute rounded-full opacity-80" style={{ right: "-12vw", bottom: "-22vw", width: "60vw", height: "60vw" }} />

        <div className="relative h-[36dvh] min-h-[190px] md:h-[60dvh] md:min-h-[260px]">
          {STEPS.map((s, i) => (
            <div key={s.n} data-step={i} className="absolute inset-0 flex flex-col justify-center" aria-hidden={undefined}>
              <div className="font-heading text-accent-2-300" style={bigNum} aria-hidden>{s.n}</div>
              <h2 className="font-heading relative mt-[-.3em] mb-4" style={{ fontSize: "clamp(28px,min(5.4vw,8.5dvh),88px)", lineHeight: 1 }}>{s.title}</h2>
              <p className="lede m-0 max-w-[26em]">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="relative flex justify-center" style={{ perspective: 1400 }}>
          <div data-phone-box className="relative" style={{ width: "calc(320px * var(--s, 1))", height: "calc(650px * var(--s, 1))" }}>
            <div className="absolute top-0 left-0 origin-top-left" style={{ width: 320, height: 650, transform: "scale(var(--s, 1))" }}>
              <div data-phone className="h-full w-full p-2.5 shadow-lg will-change-transform" style={{ borderRadius: 48, background: "#201e1d" }}>
                <div className="bg-bg relative h-full w-full overflow-hidden" style={{ borderRadius: 38 }}>
                  <PhoneScreens />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-1/2 flex -translate-y-1/2 flex-col gap-3" style={{ right: -6 }} aria-hidden>
            {STEPS.map((s) => <span key={s.n} data-dot className="bg-accent h-3 w-3 rounded-full" />)}
          </div>
        </div>
      </div>
    </section>
  );
}
