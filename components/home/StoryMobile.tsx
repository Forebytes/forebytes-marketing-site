"use client";

import AppScreen from "@/components/app-ui/AppScreen";
import Reveal from "@/components/Reveal";
import { useScreenData } from "@/components/app-ui/ShowcaseProvider";
import { DiscoverScreen, DishScreen, FeedScreen, ListsScreen, RateScreen, RestaurantScreen } from "@/components/app-ui/screens";

const STEPS = [
  { n: "01", title: "Find what's nearby.", body: "A live map of Dublin's restaurants with search and filters for distance, cuisine and rating.", Screen: DiscoverScreen, align: "left" as const },
  { n: "02", title: "Read the whole menu.", body: "Dishes with prices and nutrition up front. No scrolling past a PDF to find out what it costs.", Screen: RestaurantScreen, align: "right" as const },
  { n: "03", title: "Put it on your table.", body: "Open any dish in AR. Check the portion, the plating, the size. Then decide.", Screen: DishScreen, align: "left" as const },
  { n: "04", title: "Rate what you ate.", body: "Rate restaurants and individual dishes, and add your own photos.", Screen: RateScreen, align: "right" as const },
  { n: "05", title: "See what friends eat.", body: "Follow people you trust and let their plates decide yours.", Screen: FeedScreen, align: "left" as const },
  { n: "06", title: "Keep what you love.", body: "Saved for Later, Want to Try, Places Visited, plus lists of your own.", Screen: ListsScreen, align: "right" as const },
];

const SCRIM = "color-mix(in srgb, var(--color-accent-900) 85%, black)";
const APP_BG = "#FAF7F2"; // components/app-ui/theme.ts c.background — matches so a scale mismatch
// between the drawn 390x819 screen and the device's own aspect ratio never shows page colour through.

/** Phones and small tablets (below md): no phone bezel at all — each step IS the real app screen,
 * genuinely edge to edge at 100dvh, with the caption overlaid at the bottom (alternating left and
 * right for a bit of rhythm — never the top: an earlier version alternated top/bottom per step,
 * and two full-height panels sitting directly on top of each other meant a "bottom" caption and
 * the next step's "top" caption collided right at the seam mid-scroll). Width is sized directly
 * from the viewport (100%), never derived from a dvh-based calc, since that was the actual cause
 * of a real device's horizontal jitter (dvh shifts as Safari's chrome collapses while scrolling,
 * which could momentarily push a height-derived width past 100vw). See StoryDesktop for the md+
 * pinned phone-mockup version, and Story.tsx for the split. */
export default function StoryMobile() {
  const { s, skeleton } = useScreenData();

  return (
    <section className="relative" style={{ background: APP_BG }}>
      <div className="px-page text-center" style={{ paddingTop: "clamp(60px,10vh,100px)", paddingBottom: "clamp(30px,5vh,50px)" }}>
        <Reveal as="p" variant="fade" className="font-heading m-0 text-sm tracking-[.14em] uppercase opacity-60">How it works</Reveal>
      </div>
      {STEPS.map((step) => {
        const Screen = step.Screen;
        return (
          // "fade" is translateY-only (no rotation, unlike "up"/"soft"): a full-viewport-width
          // panel rotating even a degree or two during its entrance creates real horizontal
          // overflow for the length of the transition — exactly the kind of thing that reads as
          // the page shaking side to side on a real device.
          <Reveal key={step.n} variant="fade" className="relative block w-full overflow-hidden" style={{ height: "100dvh", background: APP_BG }}>
            <AppScreen skeleton={skeleton}>
              <Screen s={s} />
            </AppScreen>
            <div
              className={`text-bg pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 px-6 pb-[clamp(54px,9vh,80px)] ${step.align === "right" ? "items-end text-right" : "items-start text-left"}`}
              style={{ background: `linear-gradient(to top, ${SCRIM}, transparent)` }}
            >
              <div className="font-heading text-xs tracking-[.12em] opacity-70">{step.n}</div>
              <h2 className="font-heading m-0" style={{ fontSize: "clamp(26px,7vw,40px)", lineHeight: 1.05 }}>{step.title}</h2>
              <p className="m-0 max-w-[26em]" style={{ fontSize: "clamp(14px,3.6vw,17px)" }}>{step.body}</p>
            </div>
          </Reveal>
        );
      })}
    </section>
  );
}
