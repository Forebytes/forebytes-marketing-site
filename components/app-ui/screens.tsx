import {
  IoBookmarkOutline, IoChevronBack, IoChevronDown, IoChevronForward, IoCube, IoCubeOutline, IoFunnelOutline, IoHeartOutline,
  IoLeafOutline, IoLocate, IoLocationOutline, IoPeopleOutline, IoPersonAddOutline, IoRestaurantOutline, IoSearch, IoShareOutline,
  IoStar, IoStarOutline, IoStorefrontOutline,
} from "react-icons/io5";
import type { RawDish, RawRestaurant, Showcase } from "@/lib/showcase";
import MapArt from "./MapArt";
import { CircleButton, HomeIndicator, PrimaryButton, SecondaryButton, SectionTitle, StarIcons, Stars, StatusBar, TabBar, Txt } from "./parts";
import { friendPosts } from "./sample";
import { SERIF, c, clamp, formatCuisine, formatDistance, formatPrice, radius, t } from "./theme";

type Props = { s: Showcase };

const hair = `1px solid ${c.border}`;
const muted = { color: c.textMuted } as const;

/* ───────────────────────── Discover ───────────────────────── */

function Pill({ label, Icon }: { label: string; Icon: typeof IoSearch }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 12px", borderRadius: radius.pill, border: hair, background: c.surfaceRaised, ...t.captionMedium, fontSize: 14, color: c.text, whiteSpace: "nowrap", flex: "none" }}>
      <Icon size={14} color={c.textMuted} />
      {label}
      <IoChevronDown size={13} color={c.textMuted} />
    </div>
  );
}

function RestaurantCard({ r, distanceM, selected }: { r: RawRestaurant; distanceM: number; selected: boolean }) {
  const cuisine = r.cuisines[0] ? formatCuisine(r.cuisines[0]) : "Restaurant";
  return (
    <div style={{ position: "relative", width: 176, flex: "none", borderRadius: radius.lg, border: hair, background: c.surfaceRaised, overflow: "hidden" }}>
      <div style={{ height: 118, background: c.surface, display: "grid", placeItems: "center" }}>
        <IoRestaurantOutline size={26} color={c.textMuted} />
      </div>
      {selected && <div style={{ position: "absolute", inset: 0, borderRadius: radius.lg, border: `2px solid ${c.primary}`, pointerEvents: "none" }} />}
      {r.isDemo && (
        <div style={{ position: "absolute", top: 8, left: 8, padding: "2px 8px", borderRadius: radius.pill, background: c.overlay, color: "#fff", ...t.overline, fontSize: 9 }}>Demo</div>
      )}
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 16, lineHeight: "21px", height: 42, color: c.text, ...clamp(2) }}><Txt>{r.name}</Txt></div>
        <div style={{ ...t.caption, ...muted, height: 18 }}><Txt>{cuisine}</Txt></div>
        <div style={{ height: 18 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4, height: 22 }}>
          {r.ratingCount > 0 ? <StarIcons value={r.ratingAvg ?? 0} /> : <span style={{ ...t.caption, fontSize: 11, ...muted }}>Not rated</span>}
          <span style={{ ...t.captionMedium, color: c.primary }}><Txt>{formatDistance(distanceM)}</Txt></span>
        </div>
      </div>
    </div>
  );
}

export function DiscoverScreen({ s }: Props) {
  return (
    <>
      <MapArt s={s} showPuck={!s.isFallback} />
      <StatusBar />
      <div style={{ position: "absolute", top: 54, left: 0, right: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ margin: "8px 16px 0", height: 44, borderRadius: radius.md, border: hair, background: c.surfaceRaised, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", ...t.body, ...muted }}>
          <IoSearch size={18} color={c.textMuted} />
          Search restaurants
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "8px 16px", alignItems: "center" }}>
          <Pill label="Cuisine" Icon={IoRestaurantOutline} />
          <Pill label="Dietary" Icon={IoLeafOutline} />
          <Pill label="All places" Icon={IoFunnelOutline} />
        </div>
      </div>
      {/* Not in the app: the site names the visitor's city here, styled like the app's location notice. */}
      <div style={{ position: "absolute", left: 16, bottom: 83 + 16 + 252 + 8, display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: radius.md, background: c.surfaceRaised, boxShadow: "0 1px 4px rgba(0,0,0,.12)", ...t.captionMedium, color: c.text }}>
        <IoLocationOutline size={16} color={c.primary} />
        Near <Txt>{s.place.city}</Txt>
      </div>
      <div style={{ position: "absolute", right: 16, bottom: 83 + 16 + 252 + 8, width: 44, height: 44, borderRadius: radius.pill, background: c.surfaceRaised, border: hair, display: "grid", placeItems: "center" }}>
        <IoLocate size={20} color={c.primary} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 83 + 16, display: "flex", gap: 12, padding: "0 16px", overflow: "hidden" }}>
        {s.restaurants.map(({ restaurant, distanceM }) => (
          <RestaurantCard key={restaurant.id} r={restaurant} distanceM={distanceM} selected={restaurant.id === s.featured.id} />
        ))}
      </div>
      <TabBar active="Discover" />
      <HomeIndicator />
    </>
  );
}

/* ───────────────────────── Restaurant ───────────────────────── */

function DishRow({ d }: { d: RawDish }) {
  const price = formatPrice(d.priceCents, d.currency);
  return (
    <div style={{ display: "flex", gap: 12, padding: "16px 0", borderBottom: hair }}>
      <div style={{ width: 76, height: 76, flex: "none", borderRadius: radius.md, background: c.surface, display: "grid", placeItems: "center" }}>
        <IoRestaurantOutline size={20} color={c.textMuted} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <div style={{ ...t.dishName, color: c.text, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><Txt>{d.name}</Txt></div>
          <div style={{ ...t.subheading, color: c.primary }}><Txt>{price ?? ""}</Txt></div>
        </div>
        {d.description && <div style={{ ...t.caption, ...muted, ...clamp(2) }}><Txt>{d.description}</Txt></div>}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {d.ratingCount > 0 && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Stars value={d.ratingAvg ?? 0} size={12} />
              <span style={{ ...t.caption, ...muted }}>({d.ratingCount})</span>
            </span>
          )}
          {d.calories != null && <span style={{ ...t.caption, ...muted }}>{d.calories} kcal</span>}
          {(d.isVegan || d.isVegetarian) && <span style={{ ...t.overline, fontSize: 10, color: c.success }}>{d.isVegan ? "Vegan" : "Veggie"}</span>}
        </div>
        {d.hasAr && (
          <div style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 4, padding: "8px 12px", marginTop: 4, borderRadius: radius.pill, border: `1px solid ${c.primary}`, color: c.primary, ...t.captionMedium }}>
            <IoCubeOutline size={13} />
            View in AR
          </div>
        )}
      </div>
    </div>
  );
}

export function RestaurantScreen({ s }: Props) {
  const r = s.featured;
  const meta = [...r.cuisines.slice(0, 2).map(formatCuisine), r.city].filter(Boolean).join(" · ");
  const groups = [...r.dishes.reduce((m, d) => m.set(d.category ?? "Menu", [...(m.get(d.category ?? "Menu") ?? []), d]), new Map<string, RawDish[]>())];
  const [category, dishes] = groups[0] ?? ["Menu", []];
  return (
    <>
      <div style={{ position: "relative", height: 300, background: c.accent, display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", inset: 0, background: c.overlay }} />
        <div style={{ position: "absolute", top: 54 + 8, left: 16, right: 16, display: "flex", justifyContent: "space-between" }}>
          <CircleButton><IoChevronBack size={20} /></CircleButton>
          <div style={{ display: "flex", gap: 8 }}>
            <CircleButton><IoShareOutline size={19} /></CircleButton>
            <CircleButton><IoBookmarkOutline size={19} /></CircleButton>
          </div>
        </div>
        <div style={{ position: "relative", padding: 16, display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
          <div style={{ ...t.overline, color: "#D9BC94" }}><Txt>{meta}</Txt></div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
            <div style={{ ...t.title, color: "#fff", flex: 1, ...clamp(2) }}><Txt>{r.name}</Txt></div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
              <Stars value={r.ratingAvg ?? 0} size={13} />
              <span style={{ ...t.caption, color: "#fff" }}>{r.ratingCount > 0 ? `${(r.ratingAvg ?? 0).toFixed(1)} · ${r.ratingCount} reviews` : "No ratings yet"}</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", borderBottom: hair, background: c.background }}>
        {["Menu", "Reviews", "Info"].map((tab) => (
          <div key={tab} style={{ flex: 1, textAlign: "center", paddingTop: 12, ...t.subheading, color: tab === "Menu" ? c.primary : c.textMuted }}>
            {tab}
            <div style={{ height: 2, marginTop: 8, background: tab === "Menu" ? c.primary : "transparent", borderRadius: radius.pill }} />
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ paddingTop: 16 }}>
          <SectionTitle><Txt>{category}</Txt></SectionTitle>
          {dishes.slice(0, 3).map((d) => <DishRow key={d.id} d={d} />)}
        </div>
      </div>
      <HomeIndicator />
    </>
  );
}

/* ───────────────────────── Dish ───────────────────────── */

function NavBar({ title }: { title: string }) {
  return (
    <div style={{ position: "relative", height: 98, background: c.background }}>
      <div style={{ position: "absolute", left: 12, bottom: 11, color: c.text }}><IoChevronBack size={24} /></div>
      <div style={{ position: "absolute", left: 56, right: 56, bottom: 10, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 19, lineHeight: "24px", color: c.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        <Txt>{title}</Txt>
      </div>
      <div style={{ position: "absolute", right: 16, bottom: 11, color: c.primary }}><IoShareOutline size={22} /></div>
    </div>
  );
}

function Collapsible({ title, summary, open, children }: { title: string; summary?: string; open?: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ borderTop: hair }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 0" }}>
        <IoChevronForward size={15} color={c.primary} style={{ transform: open ? "rotate(90deg)" : undefined }} />
        <span style={{ ...t.subheading, color: c.text }}>{title}</span>
        {!open && summary && <span style={{ ...t.caption, ...muted, flex: 1, textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><Txt>{summary}</Txt></span>}
      </div>
      {open && <div style={{ paddingBottom: 16, display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>}
    </div>
  );
}

function Nutrition({ d }: { d: RawDish }) {
  const cells = [
    { label: "Calories", value: d.calories, unit: "kcal" },
    { label: "Protein", value: d.proteinG, unit: "g" },
    { label: "Carbs", value: d.carbsG, unit: "g" },
    { label: "Fat", value: d.fatG, unit: "g" },
  ].filter((x) => x.value != null);
  if (!cells.length) return <div style={{ ...t.caption, ...muted }}>Nobody has added nutrition for this dish yet.</div>;
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {cells.map((x) => (
        <div key={x.label} style={{ flex: 1, padding: "12px 0", borderRadius: radius.md, border: hair, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ ...t.subheading, color: c.text }}><Txt>{Number(x.value)}{x.unit === "kcal" ? "" : x.unit}</Txt></div>
          <div style={{ ...t.caption, fontSize: 11, ...muted }}>{x.label}</div>
        </div>
      ))}
    </div>
  );
}

function DishHeader({ r, d }: { r: RawRestaurant; d: RawDish }) {
  const price = formatPrice(d.priceCents, d.currency);
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "16px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ ...t.heading, color: c.text, flex: 1 }}><Txt>{d.name}</Txt></div>
          <div style={{ ...t.subheading, color: c.primary }}><Txt>{price ?? ""}</Txt></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Stars value={d.ratingAvg ?? 0} size={14} />
          <span style={{ ...t.caption, ...muted }}>{d.ratingCount > 0 ? `${(d.ratingAvg ?? 0).toFixed(1)} · ${d.ratingCount} ratings` : "No ratings yet"}</span>
        </div>
        {d.description && <div style={{ ...t.body, ...muted }}><Txt>{d.description}</Txt></div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: radius.lg, border: hair, background: c.surfaceRaised, marginBottom: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: radius.md, background: c.surface, display: "grid", placeItems: "center" }}>
          <IoStorefrontOutline size={18} color={c.textMuted} />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ ...t.overline, fontSize: 9, ...muted }}>Served at</div>
          <div style={{ ...t.dishName, color: c.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><Txt>{r.name}</Txt></div>
          {r.city && <div style={{ ...t.caption, ...muted }}><Txt>{r.city}</Txt></div>}
        </div>
        <IoChevronForward size={17} color={c.primary} />
      </div>
    </>
  );
}

export function DishScreen({ s }: Props) {
  const { restaurant: r, dish: d } = s.dish;
  return (
    <>
      <StatusBar />
      <NavBar title={d.name} />
      <div style={{ padding: "0 16px" }}>
        <DishHeader r={r} d={d} />
        <div style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", marginBottom: 12, borderRadius: radius.pill, ...t.captionMedium, border: `1px solid ${d.hasAr ? c.primary : c.border}`, background: d.hasAr ? c.primarySoft : c.surface, color: d.hasAr ? c.primary : c.textMuted }}>
          {d.hasAr ? <IoCube size={15} /> : <IoCubeOutline size={15} />}
          {d.hasAr ? "AR model ready" : "No AR model yet"}
        </div>
        {d.hasAr && <div style={{ marginBottom: 4 }}><PrimaryButton label="View in AR" /></div>}
        <Collapsible title="Nutrition" open><Nutrition d={d} /></Collapsible>
        <Collapsible title="Allergens & diet" summary={d.allergens.length ? `${d.allergens.length} listed` : d.isVegan ? "Vegan" : d.isVegetarian ? "Vegetarian" : "Not listed"} />
        <Collapsible title="Reviews" summary={d.ratingCount ? String(d.ratingCount) : "None yet"} />
      </div>
      <HomeIndicator />
    </>
  );
}

/* ───────────────────────── Rate ───────────────────────── */

const VERDICTS = ["", "Not for me", "It was fine", "Good", "Really good", "Exceptional"];

export function RateScreen({ s }: Props) {
  const { dish: d } = s.dish;
  const comment = "Properly good. Would order again.";
  const rating = 4;
  return (
    <>
      <StatusBar />
      <NavBar title={d.name} />
      <div style={{ padding: "0 16px" }}>
        <Collapsible title="Reviews" summary={d.ratingCount ? String(d.ratingCount) : "None yet"} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 8 }}>
          <div style={{ borderRadius: radius.xl, border: hair, background: c.surfaceRaised, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <SectionTitle>Rate this dish</SectionTitle>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= rating;
                return (
                  <div key={star} style={{ width: 48, height: 48, borderRadius: radius.pill, border: `1px solid ${filled ? c.star : c.border}`, background: filled ? c.primarySoft : "transparent", display: "grid", placeItems: "center" }}>
                    {filled ? <IoStar size={22} color={c.star} /> : <IoStarOutline size={22} color={c.border} />}
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 15, color: c.primary }}>{VERDICTS[rating]}</div>
            <div style={{ borderRadius: radius.lg, border: hair, background: c.background, padding: "12px 12px 8px" }}>
              <div style={{ ...t.body, color: c.text, minHeight: 66 }}>{comment}</div>
              <div style={{ ...t.caption, fontSize: 11, ...muted, textAlign: "right" }}>{comment.length}/1000</div>
            </div>
            <PrimaryButton label="Post rating" />
          </div>
          <SecondaryButton label={d.hasAr ? "Add a photo to improve the model" : "Submit a photo"} />
        </div>
      </div>
      <HomeIndicator />
    </>
  );
}

/* ───────────────────────── Feed ───────────────────────── */

function FeedCard({ name, initials, rating, when, comment, likes, dish, restaurant }: ReturnType<typeof friendPosts>[number] & { dish: string; restaurant: string }) {
  return (
    <div style={{ borderRadius: radius.lg, border: hair, background: c.surfaceRaised, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: radius.pill, border: hair, background: c.surface, color: c.primary, display: "grid", placeItems: "center", ...t.captionMedium }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
          <div style={{ ...t.subheading, color: c.text }}>{name}</div>
          <div style={{ ...t.caption, ...muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>at <Txt>{restaurant}</Txt></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          <Stars value={rating} size={13} />
          <span style={{ ...t.caption, ...muted }}>{when}</span>
        </div>
      </div>
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 4, padding: "8px 12px", borderRadius: radius.pill, border: hair, ...t.captionMedium, color: c.text }}>
          <IoRestaurantOutline size={12} color={c.primary} />
          <Txt>{dish}</Txt>
        </div>
        <div style={{ ...t.body, color: c.text }}>{comment}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, paddingTop: 12, marginTop: 4, borderTop: hair, ...t.captionMedium, ...muted }}>
          <IoHeartOutline size={19} color={c.textMuted} />
          {likes}
        </div>
      </div>
    </div>
  );
}

function TrendingCard({ d, r }: { d: RawDish; r: RawRestaurant }) {
  return (
    <div style={{ width: 190, flex: "none", borderRadius: radius.lg, border: hair, background: c.surfaceRaised, overflow: "hidden" }}>
      <div style={{ height: 118, background: c.surface, display: "grid", placeItems: "center" }}>
        <IoRestaurantOutline size={24} color={c.textMuted} />
      </div>
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ ...t.dishName, fontSize: 15, color: c.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><Txt>{d.name}</Txt></div>
        <div style={{ ...t.caption, ...muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><Txt>{r.name}</Txt></div>
      </div>
    </div>
  );
}

export function FeedScreen({ s }: Props) {
  const { restaurant: r, dish: d } = s.dish;
  const others = s.featured.dishes.filter((x) => x.id !== d.id).slice(0, 2);
  const trending = [{ d, r }, ...others.map((x) => ({ d: x, r: s.featured }))].slice(0, 3);
  const posts = friendPosts(d.id, d.name, 2);
  return (
    <>
      <StatusBar />
      <div style={{ position: "absolute", top: 54, left: 0, right: 0, bottom: 83, padding: "12px 16px 0", display: "flex", flexDirection: "column", gap: 16, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ ...t.title, color: c.text }}>Feed</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[IoPeopleOutline, IoPersonAddOutline].map((Icon, i) => (
              <div key={i} style={{ width: 38, height: 38, borderRadius: radius.pill, border: hair, display: "grid", placeItems: "center" }}><Icon size={17} color={c.text} /></div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ ...t.subheading, color: c.text }}>Trending Today</div>
          <div style={{ display: "flex", gap: 12, overflow: "hidden", marginRight: -16 }}>
            {trending.map((x) => <TrendingCard key={x.d.id} d={x.d} r={x.r} />)}
          </div>
        </div>
        {posts.map((p, i) => <FeedCard key={p.name} {...p} dish={i === 0 ? d.name : (others[0]?.name ?? d.name)} restaurant={i === 0 ? r.name : s.featured.name} />)}
      </div>
      <TabBar active="Feed" />
      <HomeIndicator />
    </>
  );
}

