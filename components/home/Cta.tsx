"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap, clamp } from "@/lib/gsap";
import SceneAnchor from "@/components/SceneAnchor";
import WaitlistForm from "@/components/WaitlistForm";

export default function Cta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const { gsap, ScrollTrigger } = registerGsap();
      const circle = root.current!.querySelector<HTMLElement>("[data-cta-circle]")!;
      const body = root.current!.querySelector<HTMLElement>("[data-cta-body]")!;
      const apply = (c: number) => {
        const ce = clamp(c / 0.5);
        gsap.set(circle, { scale: 0.04 + (1 - Math.pow(1 - ce, 3)) * 0.96 });
        const bp = clamp((c - 0.35) / 0.3);
        gsap.set(body, { opacity: bp, y: (1 - bp) * 140, scale: 0.8 + bp * 0.2, pointerEvents: bp > 0.6 ? "auto" : "none" });
      };
      apply(0);
      ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom", onUpdate: (s) => apply(s.progress), onRefresh: (s) => apply(s.progress) });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative" style={{ height: "260vh" }}>
      <SceneAnchor id="join" at={0.8} />
      <div className="sticky top-0 grid h-dvh place-items-center overflow-hidden pt-[72px]">
        <div data-cta-circle className="bg-accent absolute rounded-full" style={{ left: "50%", top: "50%", width: "200vmax", height: "200vmax", margin: "-100vmax 0 0 -100vmax" }} />
        <div data-cta-body className="text-bg relative max-w-[900px] px-6 text-center">
          <Image src="/logo.png" alt="" width={88} height={88} className="mx-auto shadow-lg" style={{ width: "clamp(44px,9dvh,88px)", height: "clamp(44px,9dvh,88px)", borderRadius: "30%" }} />
          <h2 className="font-heading mt-5 mb-0" style={{ fontSize: "clamp(36px,min(9vw,13dvh),150px)", lineHeight: 0.92, letterSpacing: "-.02em" }}>
            See it before<br />you bite it.
          </h2>
          <p className="mt-[clamp(10px,2.4dvh,20px)] mb-[clamp(14px,3.4dvh,28px)]" style={{ fontSize: "clamp(15px,1.6vw,22px)" }}>Be first in line when Forebytes lands in Dublin.</p>
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
