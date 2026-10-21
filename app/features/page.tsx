import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import Nav from "@/components/Nav";
import { FooterCompact } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import FeaturesList from "@/components/home/FeaturesList";
import Reveal from "@/components/Reveal";
import { FEATURES } from "@/lib/features-data";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Features",
  description:
    "Every feature of Forebytes: a live restaurant map, dish-level ratings and nutrition, AR models built from real scans, lists, and a friend feed. What IMDb did for films and Letterboxd did for taste, built for restaurants and dishes.",
  path: "/features",
});

export default function Features() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Forebytes features",
          itemListElement: FEATURES.map((f, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: f.h,
            description: f.b,
          })),
        }}
      />
      <Nav />
      <main id="main">
        <section className="px-page relative overflow-hidden" style={{ paddingTop: "clamp(140px,20vh,200px)", paddingBottom: "clamp(60px,10vh,120px)" }}>
          <div className="anim-blob bg-accent-2-200 absolute" style={{ right: "-10vw", top: "-8vw", width: "46vw", height: "46vw" }} />
          <div className="relative">
            <h1 className="display max-w-[16em]" style={{ fontSize: "clamp(44px,8vw,128px)", lineHeight: 0.94 }}>
              What you can <span className="text-accent">actually do</span> on Forebytes.
            </h1>
            <p className="fade-up mt-8 max-w-[34em] leading-normal" style={{ fontSize: "clamp(18px,1.7vw,24px)", animationDelay: "0.3s" }}>
              IMDb told you what a film was before you watched it. Letterboxd told you what your friends thought
              of it. Forebytes does both for restaurants and dishes, and adds the one thing neither of those can:
              you can point your phone at the plate and see it, actual size, on your own table, before you order.
            </p>
          </div>
        </section>

        <section className="px-page" style={{ paddingBottom: "clamp(80px,14vh,160px)" }}>
          <FeaturesList items={FEATURES} />
        </section>

        <section className="bg-accent-2-100 px-page" style={{ paddingBlock: "clamp(80px,14vh,160px)" }}>
          <Reveal as="h2" variant="left" className="font-heading m-0 max-w-[16em]" style={{ fontSize: "clamp(32px,5vw,72px)", lineHeight: 1.02 }}>
            Why this isn&apos;t the same as another restaurant app.
          </Reveal>
          <div className="mt-8 grid max-w-[64em] gap-x-16 gap-y-6 md:grid-cols-2">
            <Reveal as="p" className="lede m-0">
              Most restaurant apps stop at a name, an address and a star rating for the whole place. Forebytes
              goes to the level of the actual dish: its own rating, its own nutrition, its own real-size 3D model.
            </Reveal>
            <Reveal as="p" delay={120} className="lede m-0">
              The AR models aren&apos;t stock assets or generic plate renders. They&apos;re built from a real scan of
              that dish, reviewed by a person in AR before it ever reaches you, and labelled honestly depending on
              how it was measured.
            </Reveal>
          </div>
        </section>

        <section className="px-page" style={{ paddingBlock: "clamp(60px,10vh,140px)" }}>
          <Reveal as="h2" variant="left" className="font-heading m-0 max-w-[14em]" style={{ fontSize: "clamp(32px,5vw,72px)", lineHeight: 1.02 }}>
            Ready to see it for yourself?
          </Reveal>
          <Reveal className="mt-8 flex flex-wrap gap-3" delay={120}>
            <Link href="/#join" className="btn btn-primary !px-[30px] !py-4 !text-lg !text-bg">Join the waitlist</Link>
            <Link href="/#how" className="btn btn-secondary !px-[30px] !py-4 !text-lg !text-text">See how it works</Link>
          </Reveal>
          <Reveal as="p" delay={200} className="mt-10 max-w-[34em] text-sm leading-normal opacity-70">
            Questions about a specific feature?{" "}
            <a href={`mailto:${SITE.emails.support}`} className="text-accent underline underline-offset-2">{SITE.emails.support}</a>
          </Reveal>
        </section>
      </main>
      <FooterCompact />
    </>
  );
}
