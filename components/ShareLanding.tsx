import Link from "next/link";
import Nav from "@/components/Nav";
import { FooterCompact } from "@/components/Footer";

const COPY = {
  dish: { title: "Someone shared a dish with you.", accent: "dish" },
  restaurant: { title: "Someone shared a restaurant with you.", accent: "restaurant" },
} as const;

/**
 * Where a shared Forebytes link lands for people who do not have the app. With the app installed,
 * iOS opens the link in the app instead (universal links), so this page is the fallback.
 */
export default function ShareLanding({ kind }: { kind: keyof typeof COPY }) {
  const [before, after] = COPY[kind].title.split(COPY[kind].accent);
  return (
    <>
      <Nav />
      <main id="main" className="px-page relative flex min-h-dvh flex-col justify-center overflow-hidden" style={{ paddingTop: 140, paddingBottom: 100 }}>
        <div className="bg-accent-200 anim-blob absolute" style={{ right: "-10vw", top: "-6vw", width: "44vw", height: "44vw" }} />
        <div className="relative">
          <h1 className="display max-w-[11em]" style={{ fontSize: "clamp(44px,8vw,128px)" }}>
            {before}
            <span className="text-accent">{COPY[kind].accent}</span>
            {after}
          </h1>
          <p className="lede mt-7 max-w-[30em]">
            Forebytes shows you the dish, its price and nutrition, and in AR on your own table, before you order. It&apos;s on iOS, launching in Dublin. If you have the app, this link opens it.
          </p>
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
