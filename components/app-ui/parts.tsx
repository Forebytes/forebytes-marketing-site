import type { CSSProperties, ReactNode } from "react";
import { IoBatteryFull, IoCellular, IoCompassOutline, IoGridOutline, IoPersonOutline, IoStar, IoWifi } from "react-icons/io5";
import { SANS, c, radius, t } from "./theme";

/** Dynamic text. While data loads it renders as a quiet block (see `[data-skeleton]` in globals.css). */
export function Txt({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <span data-t="" style={style}>{children}</span>;
}

/** The app's read-only StarRating: the ★ glyph, filled from half a star up. */
export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2, fontSize: size, lineHeight: 1 }} aria-hidden>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: value >= s - 0.5 ? c.star : c.border }}>★</span>
      ))}
    </span>
  );
}

/** The icon-star row used on cards (Ionicons star, rounded value). */
export function StarIcons({ value, size = 11, gap = 1 }: { value: number; size?: number; gap?: number }) {
  return (
    <span style={{ display: "inline-flex", gap }} aria-hidden>
      {[1, 2, 3, 4, 5].map((s) => (
        <IoStar key={s} size={size} color={s <= Math.round(value) ? c.star : c.border} />
      ))}
    </span>
  );
}

export function PrimaryButton({ label }: { label: string }) {
  return (
    <div style={{ minHeight: 46, borderRadius: radius.md, background: c.primary, color: c.textInverse, display: "grid", placeItems: "center", padding: "0 16px", ...t.button, fontSize: 15 }}>
      {label}
    </div>
  );
}

export function SecondaryButton({ label }: { label: string }) {
  return (
    <div style={{ minHeight: 46, borderRadius: radius.md, background: c.surfaceRaised, border: `1px solid ${c.border}`, color: c.text, display: "grid", placeItems: "center", padding: "0 16px", ...t.button, fontSize: 15 }}>
      {label}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div>
      <div style={{ ...t.heading, color: c.text }}>{children}</div>
      <div style={{ width: 34, height: 2, marginTop: 4, borderRadius: radius.pill, background: c.primary }} />
    </div>
  );
}

/** The iPhone status bar and Dynamic Island. `dark` text on light screens. */
export function StatusBar({ color = c.text }: { color?: string }) {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 54, zIndex: 5, color, fontFamily: SANS }}>
      <div style={{ position: "absolute", top: 11, left: "50%", marginLeft: -60, width: 120, height: 34, borderRadius: 20, background: "#000" }} />
      <div style={{ position: "absolute", top: 17, left: 36, fontSize: 16, fontWeight: 600 }}>9:41</div>
      <div style={{ position: "absolute", top: 18, right: 28, display: "flex", gap: 6, alignItems: "center" }}>
        <IoCellular size={17} />
        <IoWifi size={17} />
        <IoBatteryFull size={22} />
      </div>
    </div>
  );
}

export function HomeIndicator({ color = c.text }: { color?: string }) {
  return <div style={{ position: "absolute", bottom: 8, left: "50%", marginLeft: -67, width: 134, height: 5, borderRadius: 3, background: color, opacity: 0.9, zIndex: 5 }} />;
}

/** The app's three tabs. `active` is lit in the primary colour; the rest are muted. */
export function TabBar({ active }: { active: "Discover" | "Feed" | "Profile" }) {
  const tabs = [
    { name: "Discover", Icon: IoCompassOutline },
    { name: "Feed", Icon: IoGridOutline },
    { name: "Profile", Icon: IoPersonOutline },
  ] as const;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 83, background: c.background, borderTop: `1px solid ${c.border}`, display: "flex", paddingTop: 7, zIndex: 4 }}>
      {tabs.map(({ name, Icon }) => (
        <div key={name} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: name === active ? c.primary : c.textMuted }}>
          <Icon size={26} />
          <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500 }}>{name}</span>
        </div>
      ))}
    </div>
  );
}

export function CircleButton({ children, onDark = true }: { children: ReactNode; onDark?: boolean }) {
  return (
    <div style={{ width: 38, height: 38, borderRadius: radius.pill, display: "grid", placeItems: "center", background: onDark ? c.overlay : c.surfaceRaised, border: onDark ? undefined : `1px solid ${c.border}`, color: onDark ? "#fff" : c.text }}>
      {children}
    </div>
  );
}
