import Link from "next/link";
import Nav from "@/components/Nav";
import { FooterCompact } from "@/components/Footer";

const COPY = {
  dish: {
    title: "Someone shared a dish with you.",
    accent: "dish",
    body: "Forebytes shows you the dish, its price and nutrition, and in AR on your own table, before you order. It's on iOS, launching in Dublin. If you have the app, this link opens it.",
  },
  restaurant: {
    title: "Someone shared a restaurant with you.",
    accent: "restaurant",
    body: "Forebytes shows you the dish, its price and nutrition, and in AR on your own table, before you order. It's on iOS, launching in Dublin. If you have the app, this link opens it.",
  },
  profile: {
    title: "Someone shared a profile with you.",
    accent: "profile",
    body: "See what they're rating and the dishes they're saving, in AR on your own table before you order. It's on iOS, launching in Dublin. If you have the app, this link opens it.",
  },
} as const;

type RealPreview = { name: string; photoUrl: string | null; subtitle?: string };

/**
 * Where a shared Forebytes link lands for people who do not have the app. With the app installed,
 * iOS opens the link in the app instead (universal links), so this page is the fallback.
 *
 * `preview` is the real dish/restaurant, when `lib/sharePreview-server.ts` found one; omit it (or
 * pass nothing) and this renders the original generic copy exactly as before.
 */
export default function ShareLanding({ kind, preview }: { kind: keyof typeof COPY; preview?: RealPreview }) {
  const [before, after] = COPY[kind].title.split(COPY[kind].accent);
  return (
    <>
      <Nav />
      <main id="main" className="px-page relative flex min-h-dvh flex-col justify-center overflow-hidden" style={{ paddingTop: 140, paddingBottom: 100 }}>
        <div className="bg-accent-200 anim-blob absolute" style={{ right: "-10vw", top: "-6vw", width: "44vw", height: "44vw" }} />
        <div className="relative">
          {preview ? (
            <div className="mb-7 flex items-center gap-4">
              {preview.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- arbitrary contributed-photo hosts, not worth a remotePatterns allowlist for one small card.
                <img src={preview.photoUrl} alt="" className="h-20 w-20 flex-none rounded-[var(--radius-lg)] object-cover" />
              ) : null}
              <div>
                <p className="text-xl font-semibold text-text">{preview.name}</p>
                {preview.subtitle ? <p className="text-text/70">{preview.subtitle}</p> : null}
              </div>
            </div>
          ) : null}
          <h1 className="display max-w-[11em]" style={{ fontSize: "clamp(44px,8vw,128px)" }}>
            {before}
            <span className="text-accent">{COPY[kind].accent}</span>
            {after}
          </h1>
          <p className="lede mt-7 max-w-[30em]">{COPY[kind].body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/#join" className="btn btn-primary !px-[30px] !py-4 !text-lg !text-bg">Join the waitlist</Link>
            <Link href="/#how" className="btn btn-secondary !px-[30px] !py-4 !text-lg !text-text">See how it works</Link>
          </div>
        </div>
      </main>
      <FooterCompact />
    </>
  );
}
