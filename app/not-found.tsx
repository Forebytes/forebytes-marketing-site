import Link from "next/link";
import Nav from "@/components/Nav";
import { FooterCompact } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="px-page flex min-h-dvh flex-col justify-center" style={{ paddingTop: 120, paddingBottom: 80 }}>
        <p className="font-heading text-accent m-0" style={{ fontSize: "clamp(96px,18vw,280px)", lineHeight: 0.85 }}>404</p>
        <h1 className="font-heading mt-6 mb-0" style={{ fontSize: "clamp(32px,4.5vw,64px)" }}>That page isn&apos;t on the menu.</h1>
        <p className="lede mt-4 mb-8 max-w-[28em]">The link may be old or mistyped. The home page has everything we&apos;ve got so far.</p>
        <div><Link href="/" className="btn btn-primary !px-[30px] !py-4 !text-lg !text-bg">Back to home</Link></div>
      </main>
      <FooterCompact />
    </>
  );
}
