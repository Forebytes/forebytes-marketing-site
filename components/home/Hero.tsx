"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import AppScreen from "@/components/app-ui/AppScreen";
import { useScreenData } from "@/components/app-ui/ShowcaseProvider";
import { DishScreen } from "@/components/app-ui/screens";
import { registerGsap, prefersReducedMotion } from "@/lib/gsap";

const FLIP_WORDS = ["bite", "buy", "try", "rate", "byte", "share", "write"];

function HeroScreen() {
  const { s, skeleton } = useScreenData();
  return (
    <AppScreen skeleton={skeleton}>
      <DishScreen s={s} />
    </AppScreen>
  );
}

function Word({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="w">
      <span style={{ animationDelay: `${delay}s` }}>{children}</span>
    </span>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { s, live } = useScreenData();
  // The sticker shows the featured restaurant's real average rating, or nothing when it has none.
  const rating = live && s.featured.ratingCount > 0 && s.featured.ratingAvg !== null ? s.featured.ratingAvg.toFixed(1) : null;

  useGSAP(
    () => {
      const { gsap, ScrollTrigger } = registerGsap();
      const el = root.current!;

      // parallax drift (data-px = speed, sign = direction)
      gsap.utils.toArray<HTMLElement>("[data-px]").forEach((n) => {
        const k = parseFloat(n.dataset.px!);
        const span = () => (window.innerHeight + el.offsetHeight) / 2;
        gsap.fromTo(
          n,
          { y: () => -k * span() },
          { y: () => k * span(), ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } },
        );
      });

      // slow rotation tied to scroll
      gsap.utils.toArray<HTMLElement>("[data-spin]").forEach((n) => {
        const k = parseFloat(n.dataset.spin!);
        gsap.to(n, { rotation: () => ScrollTrigger.maxScroll(window) * k, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true, invalidateOnRefresh: true } });
      });

      // rotating verb: 3D flip, width eases to the incoming word
      const holder = el.querySelector<HTMLElement>("[data-flip]")!;
      const words = gsap.utils.toArray<HTMLElement>("[data-fw]", el);
      let cur = 0;
      const size = () => { holder.style.width = `${words[cur].offsetWidth}px`; };
      gsap.set(words, { rotationX: -90, opacity: 0 });
      gsap.set(words[0], { rotationX: 0, opacity: 1 });
      size();
      document.fonts?.ready.then(size);
      if (prefersReducedMotion()) return;
      const id = window.setInterval(() => {
        const prev = words[cur];
        cur = (cur + 1) % words.length;
        const next = words[cur];
        gsap.set(next, { rotationX: 90, opacity: 0 });
        gsap.to(prev, { rotationX: -90, opacity: 0, duration: 0.6, ease: "power3.inOut" });
        gsap.to(next, { rotationX: 0, opacity: 1, duration: 0.6, ease: "power3.inOut" });
        size();
      }, 2000);
      return () => window.clearInterval(id);
    },
    { scope: root },
  );

  const big = { fontSize: "clamp(18px,1.6vw,24px)" };
  return (
    <section
      ref={root}
      id="top"
      className="px-page relative grid min-h-dvh grid-cols-1 items-center gap-8 overflow-hidden pt-[clamp(120px,16vh,170px)] pb-20 md:grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)]"
    >
      <div data-px="0.25" className="anim-blob bg-accent-200 absolute z-0" style={{ right: "-8vw", top: "-10vh", width: "52vw", height: "52vw" }} />
      <div data-px="-0.18" className="bg-accent-2-200 absolute z-0 rounded-full" style={{ left: "-10vw", bottom: "-18vw", width: "34vw", height: "34vw" }} />

      <div className="relative z-[1]">
        <h1 className="display" style={{ fontSize: "clamp(56px,10.5vw,176px)", lineHeight: 0.92 }}>
          <span className="block whitespace-nowrap"><Word delay={0.3}>See</Word> <Word delay={0.4}>it</Word></span>
          <span className="block whitespace-nowrap"><Word delay={0.55}>before</Word> <Word delay={0.7}>you</Word></span>
          <span className="fade-up block whitespace-nowrap" style={{ animationDelay: ".85s", animationDuration: ".9s" }}>
            <span
              data-flip
              aria-label="bite, buy, try, rate, byte, share or write"
              className="text-accent relative inline-block align-top"
              style={{ height: "1.04em", perspective: 700, transition: "width .6s cubic-bezier(.65,0,.35,1)" }}
            >
              {FLIP_WORDS.map((w) => (
                <span key={w} data-fw aria-hidden className="absolute top-0 left-0 whitespace-nowrap" style={{ transformOrigin: "50% 50% -.5em", backfaceVisibility: "hidden" }}>{w}</span>
              ))}
            </span>{" "}
            <span className="text-accent">it.</span>
          </span>
        </h1>
        <p className="fade-up mt-8 max-w-[30em] leading-normal" style={{ ...big, animationDelay: "1.2s" }}>
          Find restaurants nearby, browse menus with prices and nutrition, then place the dish on your actual table in AR before you order.
        </p>
        <div className="fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: "1.35s" }}>
          <a href="#join" className="btn btn-primary !text-bg !px-[30px] !py-4 !text-lg">Join the waitlist</a>
          <a href="#how" className="btn btn-secondary !px-[30px] !py-4 !text-lg !text-text">See how it works</a>
        </div>
      </div>

      <div className="fade-up relative z-[1] flex justify-center" style={{ animationDuration: "1.2s", animationDelay: ".6s" }}>
        <div data-px="0.12" className="relative">
          <div className="anim-bob">
            <div
              className="w-[min(300px,64vw)] p-2.5 md:w-[min(300px,28vw)]"
              style={{ aspectRatio: "300/610", borderRadius: 46, background: "#201e1d", boxShadow: "var(--shadow-lg), 0 60px 80px -30px color-mix(in srgb, var(--color-accent) 55%, transparent)" }}
            >
              <div className="bg-accent-2-300 relative h-full w-full overflow-hidden" style={{ borderRadius: 36 }}>
                <HeroScreen />
              </div>
            </div>
          </div>
          <div data-spin="0.25" className="bg-accent text-bg font-heading absolute hidden h-[110px] w-[110px] place-items-center rounded-full text-center text-[22px] leading-none shadow-md lg:grid" style={{ left: -100, top: "14%" }}>
            AR<br />ready
          </div>
          {rating !== null && (
            <div data-px="-0.3" className="bg-accent-2 font-heading absolute hidden h-20 w-20 place-items-center rounded-full text-[28px] text-white shadow-md lg:grid" style={{ right: -44, bottom: "14%" }}>
              {rating}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
