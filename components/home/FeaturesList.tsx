"use client";

import { useEffect, useRef, useState } from "react";
import { IoBookmarkOutline, IoCubeOutline, IoLocationOutline, IoPeopleOutline, IoPricetagOutline, IoStarOutline } from "react-icons/io5";
import Reveal from "@/components/Reveal";
import type { Feature, FeatureIcon } from "@/lib/features-data";

const ICONS: Record<FeatureIcon, typeof IoLocationOutline> = {
  location: IoLocationOutline,
  pricetag: IoPricetagOutline,
  star: IoStarOutline,
  cube: IoCubeOutline,
  people: IoPeopleOutline,
  bookmark: IoBookmarkOutline,
};

/** A sticky left rail (same pattern as the legal pages' "On this page" nav) that tracks which
 * feature is in view and highlights it, rather than a flat stack with no sense of progress. */
export default function FeaturesList({ items }: { items: Feature[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = refs.current.indexOf(entry.target as HTMLDivElement);
          if (i !== -1) setActive(i);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-16">
      <nav aria-label="Features" className="hidden flex-col gap-1 lg:sticky lg:top-28 lg:flex lg:h-max">
        {items.map((it, i) => {
          const Icon = ICONS[it.icon];
          const isActive = i === active;
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              className="flex items-center gap-3 rounded-full px-4 py-2.5 text-[15px] transition-[opacity,background-color] duration-300"
              style={{
                fontWeight: isActive ? 600 : 400,
                opacity: isActive ? 1 : 0.45,
                background: isActive ? "var(--color-accent-100)" : "transparent",
              }}
            >
              <Icon size={18} />
              {it.t}
            </a>
          );
        })}
      </nav>

      <div className="grid gap-6">
        {items.map((it, i) => {
          const Icon = ICONS[it.icon];
          return (
            <div key={it.id} id={it.id} ref={(el) => { refs.current[i] = el; }} className="scroll-mt-28">
              <Reveal
                delay={(i % 2) * 100}
                className={`${it.bg} ${it.fg} grid gap-6 p-9 md:grid-cols-[auto_minmax(0,1fr)] md:items-start md:gap-10 md:p-12`}
                style={{ borderRadius: 44 }}
              >
                <div className={`${it.dot} grid h-[60px] w-[60px] flex-none place-items-center rounded-full`}>
                  <Icon size={26} />
                </div>
                <div>
                  <div className="font-heading mb-1 text-sm tracking-[.12em] uppercase opacity-70">{it.t}</div>
                  <h2 className="font-heading m-0" style={{ fontSize: "clamp(26px,3.2vw,40px)", lineHeight: 1.05 }}>{it.h}</h2>
                  <p className="mt-3 mb-0 max-w-[46em] leading-normal">{it.b}</p>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>
    </div>
  );
}
