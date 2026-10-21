"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { SANS, SCREEN_H, SCREEN_W, c } from "./theme";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Draws an app screen at its true 390px width and scales it to fill whatever phone it sits in, so the
 * type, spacing and radii stay exactly the app's. Decorative, so hidden from assistive tech.
 */
export default function AppScreen({ children, skeleton = false }: { children: ReactNode; skeleton?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(300 / SCREEN_W);

  useIsoLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / SCREEN_W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} aria-hidden data-nosnippet className="absolute inset-0 overflow-hidden" data-skeleton={skeleton ? "" : undefined}>
      <div
        style={{
          position: "relative", width: SCREEN_W, height: SCREEN_H, overflow: "hidden", transform: `scale(${scale})`,
          transformOrigin: "top left", background: c.background, color: c.text, fontFamily: SANS,
        }}
      >
        {children}
      </div>
    </div>
  );
}
