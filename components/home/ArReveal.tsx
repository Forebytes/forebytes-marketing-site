"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SceneAnchor from "@/components/SceneAnchor";
import { registerGsap, clamp } from "@/lib/gsap";

export default function ArReveal() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const { gsap, ScrollTrigger } = registerGsap();
      const q = (s: string) => root.current!.querySelector<HTMLElement>(s)!;
      const layer = q("[data-ar-layer]"), ring = q("[data-ar-ring]"), ring2 = q("[data-ar-ring2]"), plate = q("[data-ar-plate]"), text = q("[data-ar-text]");

      const apply = (a: number) => {
        const ea = clamp(a / 0.55), ease = 1 - Math.pow(1 - ea, 3);
        layer.style.clipPath = `circle(${ease * Math.hypot(innerWidth, innerHeight) * 0.75}px at 50% 50%)`;
        gsap.set(ring, { rotation: a * 360 });
        gsap.set(ring2, { rotation: -a * 540 });
        gsap.set(plate, { scale: 0.4 + clamp((a - 0.15) / 0.5) * 0.75, rotation: a * 200, y: `${-clamp((a - 0.6) / 0.4) * (innerHeight > innerWidth ? 17 : 12)}vh` });
        const tp = clamp((a - 0.6) / 0.25);
        gsap.set(text, { opacity: tp, y: (1 - tp) * 120 });
      };
      apply(0);
      ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom", onUpdate: (s) => apply(s.progress), onRefresh: (s) => apply(s.progress) });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative" style={{ height: "420vh" }}>
      <SceneAnchor id="ar" at={0.88} />
      <div className="sticky top-0 grid h-dvh place-items-center overflow-hidden">
        <div data-ar-layer className="bg-accent-2-800 absolute inset-0 grid place-items-center overflow-hidden" style={{ clipPath: "circle(0px at 50% 50%)" }}>
          <div data-ar-ring className="border-accent-2-500 absolute rounded-full border-[3px] border-dashed opacity-70" style={{ width: "90vmin", height: "90vmin" }} />
          <div data-ar-ring2 className="border-accent-2-600 absolute rounded-full border-[3px] border-dashed" style={{ width: "62vmin", height: "62vmin" }} />
          <div data-ar-plate className="bg-bg relative grid aspect-square place-items-center rounded-full" style={{ width: "min(44vmin,36dvh,420px)", boxShadow: "0 40px 90px rgba(0,0,0,.45)" }}>
            <div className="bg-accent-300 text-accent-900 grid aspect-square place-items-center rounded-full text-center text-[13px] font-bold tracking-[.1em]" style={{ width: "68%" }}>
              DISH MODEL<br />GOES HERE
            </div>
          </div>
          <div data-ar-text className="text-bg absolute" style={{ left: "var(--gutter)", bottom: "clamp(30px,8vh,90px)", maxWidth: "min(640px,86vw)" }}>
            <h2 className="font-heading m-0" style={{ fontSize: "clamp(28px,min(6.4vw,9dvh),104px)", lineHeight: 0.96 }}>Is that portion really that big?</h2>
            <p className="lede text-accent-2-100 mt-3 mb-0 text-[clamp(14px,1.5vw,22px)]">
              Apple&apos;s AR Quick Look handles placement, scale, occlusion and lighting. You just point your phone at the table.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
