import { IoRestaurant } from "react-icons/io5";
import { haversineM, type Showcase } from "@/lib/showcase";
import { c, radius } from "./theme";

const W = 390;
const H = 736; // the Discover screen above the tab bar
const CX = W / 2;
const CY = 340;

/** A drawn stand-in for the Mapbox street map: the same pale land, white roads, park and water. */
function Streets() {
  const minor = [
    "M-10 150 L400 168", "M-10 235 L400 250", "M-10 318 L400 330", "M-10 410 L400 424", "M-10 600 L400 612", "M-10 668 L400 676",
    "M62 -10 L78 760", "M140 -10 L152 760", "M222 -10 L236 760", "M304 -10 L314 760", "M372 -10 L384 760",
  ];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }} aria-hidden>
      <rect width={W} height={H} fill="#F4F0E8" />
      <path d="M-20 118 C40 88 124 108 154 170 C174 232 92 254 20 232 Z" fill="#DCE8CE" />
      <path d="M248 428 C300 396 384 404 412 452 L412 548 C340 568 268 526 248 476 Z" fill="#DCE8CE" />
      <path d="M-20 512 C62 470 142 556 232 514 S362 462 420 494" fill="none" stroke="#BCD7E4" strokeWidth="34" strokeLinecap="round" />
      {minor.map((d) => (
        <g key={d} fill="none" strokeLinecap="round">
          <path d={d} stroke="#E4DDCF" strokeWidth="7" />
          <path d={d} stroke="#FFFFFF" strokeWidth="4.5" />
        </g>
      ))}
      <g fill="none" strokeLinecap="round">
        <path d="M-10 668 L400 262" stroke="#E7CF8F" strokeWidth="13" />
        <path d="M-10 668 L400 262" stroke="#FBE9B8" strokeWidth="9" />
      </g>
    </svg>
  );
}

/** Restaurant pins placed by their real offsets from the map centre, scaled so they all fit. */
export default function MapArt({ s, showPuck }: { s: Showcase; showPuck: boolean }) {
  const pins = s.restaurants.map(({ restaurant }) => {
    const east = haversineM(s.centre, { lat: s.centre.lat, lng: restaurant.lng }) * Math.sign(restaurant.lng - s.centre.lng);
    const north = haversineM(s.centre, { lat: restaurant.lat, lng: s.centre.lng }) * Math.sign(restaurant.lat - s.centre.lat);
    return { restaurant, east, north };
  });
  const reach = Math.max(1, ...pins.map((p) => Math.hypot(p.east, p.north)));
  // About 12.5 m per px at the app's default zoom, widened if the pins would fall off the screen.
  const metresPerPx = Math.max(12.5, reach / 135);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, overflow: "hidden" }}>
      <Streets />
      {showPuck && (
        <div style={{ position: "absolute", left: CX - 11, top: CY - 11, width: 22, height: 22, borderRadius: radius.pill, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.3)", display: "grid", placeItems: "center" }}>
          <div style={{ width: 14, height: 14, borderRadius: radius.pill, background: "#3A82F7" }} />
        </div>
      )}
      {pins.map(({ restaurant, east, north }) => {
        const selected = restaurant.id === s.featured.id;
        const size = selected ? 38 : 30;
        return (
          <div
            key={restaurant.id}
            style={{
              position: "absolute", left: CX + east / metresPerPx - size / 2, top: CY - north / metresPerPx - size / 2,
              width: size, height: size, borderRadius: radius.pill, display: "grid", placeItems: "center", zIndex: selected ? 2 : 1,
              background: selected ? c.primary : c.surfaceRaised, border: `${selected ? 3 : 2}px solid ${restaurant.isDemo ? c.accent : c.primary}`,
              color: selected ? c.textInverse : c.primary, boxShadow: "0 1px 3px rgba(0,0,0,.18)",
            }}
          >
            <IoRestaurant size={selected ? 17 : 14} />
          </div>
        );
      })}
    </div>
  );
}
