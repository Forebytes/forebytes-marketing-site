"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import AppScreen from "@/components/app-ui/AppScreen";
import Reveal from "@/components/Reveal";
import { ChromeProvider } from "@/components/app-ui/parts";
import { useScreenData } from "@/components/app-ui/ShowcaseProvider";
import { DiscoverScreen, DishScreen, FeedScreen, ListsScreen, RateScreen, RestaurantScreen } from "@/components/app-ui/screens";
import { registerGsap, clamp } from "@/lib/gsap";

const STEPS = [
  { n: "01", title: "Find what's nearby.", body: "A live map of Dublin's restaurants with search and filters for distance, cuisine and rating.", Screen: DiscoverScreen, align: "left" as const },
  { n: "02", title: "Read the whole menu.", body: "Dishes with prices and nutrition up front. No scrolling past a PDF to find out what it costs.", Screen: RestaurantScreen, align: "right" as const },
  { n: "03", title: "Put it on your table.", body: "Open any dish in AR. Check the portion, the plating, the size. Then decide.", Screen: DishScreen, align: "left" as const },
  { n: "04", title: "Rate what you ate.", body: "Rate restaurants and individual dishes, and add your own photos.", Screen: RateScreen, align: "right" as const },
  { n: "05", title: "See what friends eat.", body: "Follow people you trust and let their plates decide yours.", Screen: FeedScreen, align: "left" as const },
  { n: "06", title: "Keep what you love.", body: "Saved for Later, Want to Try, Places Visited, plus lists of your own.", Screen: ListsScreen, align: "right" as const },
];

const SCRIM = "color-mix(in srgb, var(--color-accent-900) 85%, black)";
const APP_BG = "#FAF7F2"; // components/app-ui/theme.ts c.background

/** Phones and small tablets (below md). Three things changed from the version before this:
 *
 * 1. No fake status bar / home indicator (ChromeProvider value=false): a real phone already
 *    shows its own battery, wifi and clock right above this. Drawing a second, fake set inside
 *    the screen was pure redundancy, and read as exactly that.
 * 2. A real crossfade between steps, not a hard cut: this is now a short pinned scene (like
 *    StoryDesktop, but far simpler) where each step is a full layer that fades over the last as
 *    you scroll, opacity only — no rotation, no scale, no x/y shift. Transform-based motion is
 *    what caused the real horizontal jitter on a device last round, so this sticks to the one
 *    property that can never create overflow.
 * 3. Interactive stars on the rating step (see RateScreen) — tap one, the rating updates.
 *
 * See StoryDesktop for the md+ pinned phone-mockup version, and Story.tsx for the split.
 */
export default function StoryMobile() {
  const root = useRef<HTMLElement>(null);
  const { s, skeleton } = useScreenData();

  useGSAP(
    () => {
      const { gsap, ScrollTrigger } = registerGsap();
      const el = root.current!;
      ScrollTrigger.matchMedia({
        "(max-width: 767px)": () => {
          const layers = gsap.utils.toArray<HTMLElement>("[data-layer]", el);
          const n = layers.length;
          const apply = (p: number) => {
            const idx = p * n;
            layers.forEach((layer, i) => {
              const d = idx - i - 0.5, a = Math.abs(d);
              const o = clamp(1.5 - a * 3);
              gsap.set(layer, { opacity: o, zIndex: o > 0.5 ? 2 : 1, pointerEvents: o > 0.5 ? "auto" : "none" });
            });
          };
          apply(0);
          const trigger = ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom bottom", onUpdate: (st) => apply(st.progress), onRefresh: (st) => apply(st.progress) });
          return () => trigger.kill();
        },
      });
    },
    { scope: root },
  );

  return (
    <>
      <div className="px-page text-center" style={{ paddingTop: "clamp(70px,12vh,120px)", paddingBottom: "clamp(30px,5vh,50px)" }}>
        <Reveal as="p" variant="fade" className="font-heading m-0 text-sm tracking-[.14em] uppercase opacity-60">How it works</Reveal>
      </div>
      <section ref={root} className="relative" style={{ height: `${STEPS.length * 150}vh`, background: APP_BG }}>
      <div className="sticky top-0 h-dvh w-full overflow-hidden" style={{ background: APP_BG }}>
        {STEPS.map((step) => {
          const Screen = step.Screen;
          return (
            <div key={step.n} data-layer className="absolute inset-0" style={{ opacity: 0 }}>
              <ChromeProvider value={false}>
                <AppScreen skeleton={skeleton}>
                  <Screen s={s} />
                </AppScreen>
              </ChromeProvider>
              <div
                className={`text-bg pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 px-6 pb-[clamp(54px,9vh,80px)] ${step.align === "right" ? "items-end text-right" : "items-start text-left"}`}
                style={{ background: `linear-gradient(to top, ${SCRIM}, transparent)` }}
              >
                <div className="font-heading text-xs tracking-[.12em] opacity-70">{step.n}</div>
                <h2 className="font-heading m-0" style={{ fontSize: "clamp(26px,7vw,40px)", lineHeight: 1.05 }}>{step.title}</h2>
                <p className="m-0 max-w-[26em]" style={{ fontSize: "clamp(14px,3.6vw,17px)" }}>{step.body}</p>
              </div>
            </div>
          );
        })}
      </div>
      </section>
    </>
  );
}
