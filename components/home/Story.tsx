"use client";

import AppScreen from "@/components/app-ui/AppScreen";
import Reveal from "@/components/Reveal";
import { useScreenData } from "@/components/app-ui/ShowcaseProvider";
import { DiscoverScreen, DishScreen, FeedScreen, ListsScreen, RateScreen, RestaurantScreen } from "@/components/app-ui/screens";
import { SCREEN_H, SCREEN_W } from "@/components/app-ui/theme";

const STEPS = [
  { n: "01", title: "Find what's nearby.", body: "A live map of Dublin's restaurants with search and filters for distance, cuisine and rating.", Screen: DiscoverScreen, pos: "bottom-left" as const },
  { n: "02", title: "Read the whole menu.", body: "Dishes with prices and nutrition up front. No scrolling past a PDF to find out what it costs.", Screen: RestaurantScreen, pos: "top-left" as const },
  { n: "03", title: "Put it on your table.", body: "Open any dish in AR. Check the portion, the plating, the size. Then decide.", Screen: DishScreen, pos: "bottom-right" as const },
  { n: "04", title: "Rate what you ate.", body: "Rate restaurants and individual dishes, and add your own photos.", Screen: RateScreen, pos: "top-right" as const },
  { n: "05", title: "See what friends eat.", body: "Follow people you trust and let their plates decide yours.", Screen: FeedScreen, pos: "bottom-left" as const },
  { n: "06", title: "Keep what you love.", body: "Saved for Later, Want to Try, Places Visited, plus lists of your own.", Screen: ListsScreen, pos: "top-right" as const },
];

const POS_CLASS: Record<(typeof STEPS)[number]["pos"], string> = {
  "bottom-left": "inset-x-0 bottom-0 items-end text-left",
  "top-left": "inset-x-0 top-0 items-start text-left",
  "bottom-right": "inset-x-0 bottom-0 items-end text-right",
  "top-right": "inset-x-0 top-0 items-start text-right",
};
const SCRIM = "color-mix(in srgb, var(--color-accent-900) 85%, black)";

/**
 * Was a single pinned scene with a small phone mockup, scroll-scrubbed and 3D-tilted through all
 * six steps. Replaced for two reasons: the cross-fade read as janky, and a shrunk phone-in-a-phone
 * felt redundant on an actual phone. Now each step is the real app screen at (near) true size —
 * edge to edge on a phone, a tall centred panel on a wide screen, through one aspect-ratio rule
 * rather than a separate mobile build — with the caption overlaid in a different corner per step.
 */
export default function Story() {
  const { s, skeleton } = useScreenData();

  return (
    <section className="bg-accent-2-100 relative scroll-mt-20" id="how">
      <div className="px-page text-center" style={{ paddingTop: "clamp(70px,12vh,120px)", paddingBottom: "clamp(40px,6vh,70px)" }}>
        <Reveal as="p" variant="fade" className="font-heading m-0 text-sm tracking-[.14em] uppercase opacity-60">How it works</Reveal>
      </div>
      <div className="flex flex-col gap-[clamp(60px,10vh,120px)] pb-[clamp(80px,14vh,160px)]">
        {STEPS.map((step, i) => {
          const Screen = step.Screen;
          const top = step.pos.startsWith("top");
          return (
            <Reveal key={step.n} variant={i % 2 ? "soft" : "up"} className="px-page flex justify-center">
              <div
                className="relative overflow-hidden shadow-2xl"
                style={{
                  width: `min(100%, calc(100dvh * ${SCREEN_W} / ${SCREEN_H}))`,
                  maxWidth: 480,
                  aspectRatio: `${SCREEN_W} / ${SCREEN_H}`,
                  borderRadius: "clamp(14px,3vw,40px)",
                }}
              >
                <AppScreen skeleton={skeleton}>
                  <Screen s={s} />
                </AppScreen>
                <div
                  className={`text-bg pointer-events-none absolute flex flex-col gap-2 p-6 ${POS_CLASS[step.pos]}`}
                  style={{
                    [top ? "paddingTop" : "paddingBottom"]: "clamp(54px,9vh,80px)",
                    background: top ? `linear-gradient(to bottom, ${SCRIM}, transparent)` : `linear-gradient(to top, ${SCRIM}, transparent)`,
                  }}
                >
                  <div className="font-heading text-xs tracking-[.12em] opacity-70">{step.n}</div>
                  <h2 className="font-heading m-0" style={{ fontSize: "clamp(24px,4vw,36px)", lineHeight: 1.05 }}>{step.title}</h2>
                  <p className="m-0 max-w-[22em]" style={{ fontSize: "clamp(14px,1.4vw,16px)" }}>{step.body}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
