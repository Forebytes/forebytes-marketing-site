import { IRELAND } from "@/lib/ireland-path";

/** The island of Ireland with Dublin marked. Decorative: the section's text carries the meaning. */
export default function IrelandMap({ className = "" }: { className?: string }) {
  const [cx, cy] = IRELAND.dublin;
  const [, , w, h] = IRELAND.viewBox.split(" ").map(Number);
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: `${w} / ${h}` }}>
      <svg viewBox={IRELAND.viewBox} className="block h-full w-full overflow-visible" role="img" aria-label="Map of Ireland with Dublin marked on the east coast">
        <path d={IRELAND.path} fill="var(--color-accent-2)" stroke="var(--color-accent-2)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      {/* Pin sits in HTML so the ping animation and label scale with the map. */}
      <div className="absolute" style={{ left: `${(cx / w) * 100}%`, top: `${(cy / h) * 100}%` }}>
        <span className="anim-ping bg-accent absolute -top-3.5 -left-3.5 h-7 w-7 rounded-full" />
        <span className="bg-accent border-bg absolute -top-3.5 -left-3.5 h-7 w-7 rounded-full border-[4px] shadow-md" />
        <span className="font-heading bg-bg text-text absolute -top-5 right-8 rounded-full px-4 py-1.5 text-xl whitespace-nowrap shadow-md">Dublin</span>
      </div>
    </div>
  );
}
