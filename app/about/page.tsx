import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Nav from "@/components/Nav";
import { FooterCompact } from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({ title: "About", description: "Forebytes is a restaurant discovery app built around one idea: you should be able to see what a dish actually looks like before you order it.", path: "/about" });

const TODAY = [
  { t: "A live map", b: "Restaurants near you, with search and dietary filters.", bg: "bg-accent-2-300", dot: "bg-accent-2-700 text-bg", fg: "" },
  { t: "Real menus and photos", b: "Contributed by the people who've actually eaten there.", bg: "bg-accent", dot: "bg-accent-900", fg: "text-bg" },
  { t: "Ratings and reviews", b: "For restaurants and for individual dishes.", bg: "bg-accent-200", dot: "bg-accent text-bg", fg: "" },
  { t: "Lists", b: "Save places you want to try, have visited, or have rated.", bg: "bg-accent-200", dot: "bg-accent text-bg", fg: "" },
  { t: "A feed", b: "What the people you follow are eating and rating.", bg: "bg-accent-2-300", dot: "bg-accent-2-700 text-bg", fg: "" },
  { t: "Dish-level AR", b: "Rolling out as the underlying technology ships.", bg: "bg-accent", dot: "bg-accent-900", fg: "text-bg" },
];

const Word = ({ d, accent, children }: { d: number; accent?: boolean; children: string }) => (
  <span className="w"><span className={accent ? "text-accent" : ""} style={{ animationDelay: `${d}s` }}>{children}</span></span>
);

export default function About() {
  return (
    <>
      <Nav />
      <main id="main">
        <section className="px-page relative overflow-hidden" style={{ paddingTop: "clamp(140px,20vh,200px)", paddingBottom: "clamp(70px,12vh,140px)" }}>
          <div className="anim-blob bg-accent-2-200 absolute" style={{ right: "-10vw", top: "-8vw", width: "46vw", height: "46vw" }} />
          <div className="relative">
            <h1 className="display max-w-[12em]" style={{ fontSize: "clamp(52px,9.5vw,160px)" }}>
              <Word d={0.2}>Dinner</Word> <Word d={0.3}>should</Word> <Word d={0.4}>never</Word><br />
              <Word d={0.5} accent>be</Word> <Word d={0.6} accent>a</Word> <Word d={0.7} accent>guess.</Word>
            </h1>
            <p className="fade-up mt-8 max-w-[28em] leading-normal" style={{ fontSize: "clamp(19px,1.8vw,26px)", animationDelay: "1s" }}>
              Forebytes is a restaurant discovery app built around one idea: you should be able to see what a dish actually looks like before you order it.
            </p>
          </div>
        </section>

        <section className="px-page" style={{ paddingBottom: "clamp(60px,10vh,120px)" }}>
          <div className="grid max-w-[64em] gap-x-16 gap-y-6 md:grid-cols-2">
            <Reveal as="p" className="lede m-0">Most restaurant apps show you a name, an address, and a star rating.</Reveal>
            <Reveal as="p" delay={120} className="lede m-0">Forebytes is building toward showing you the dish itself, in AR, on your own table, before you decide. That&apos;s the destination. Today, Forebytes already gives you:</Reveal>
          </div>
        </section>

        <section className="px-page" style={{ paddingBottom: "clamp(80px,14vh,160px)" }}>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(340px,100%),1fr))" }}>
            {TODAY.map((v, i) => (
              <Reveal key={v.t} delay={(i % 3) * 150} className={`${v.bg} ${v.fg} flex min-h-[280px] flex-col justify-between p-9`} style={{ borderRadius: 44 }}>
                <div className={`${v.dot} font-heading grid h-[68px] w-[68px] place-items-center rounded-full text-[28px]`}>{i + 1}</div>
                <div>
                  <h2 className="font-heading m-0 text-[34px] leading-none">{v.t}</h2>
                  <p className="mt-3 mb-0 leading-normal">{v.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-accent-2-100 px-page grid grid-cols-1 items-center gap-12 overflow-hidden md:grid-cols-2" style={{ paddingBlock: "clamp(80px,14vh,160px)" }}>
          <div>
            <Reveal as="h2" variant="left" className="font-heading m-0" style={{ fontSize: "clamp(48px,8vw,128px)", lineHeight: 0.92 }}>Launched in Dublin.</Reveal>
            <Reveal as="p" delay={150} className="lede mt-6 max-w-[28em] !leading-[1.55]">
              Forebytes launched first in Dublin.
            </Reveal>
          </div>
          <div className="relative" style={{ height: "clamp(260px,40vw,480px)" }} aria-hidden>
            <Reveal variant="pop" className="bg-accent-2 absolute top-0 right-0 aspect-square rounded-full" style={{ width: "min(70%,380px)" }} />
            <Reveal variant="pop" delay={200} className="bg-accent absolute bottom-0 aspect-square rounded-full" style={{ left: "6%", width: "min(46%,250px)" }} />
            <Reveal variant="pop" delay={350} className="bg-accent-200 absolute aspect-square rounded-full" style={{ right: "30%", bottom: "8%", width: "min(22%,120px)" }} />
          </div>
        </section>

        <section className="px-page" style={{ paddingBlock: "clamp(80px,14vh,160px) clamp(40px,8vh,90px)" }}>
          <Reveal as="h2" variant="left" className="font-heading m-0 max-w-[14em]" style={{ fontSize: "clamp(36px,5.5vw,88px)", lineHeight: 1 }}>Built by the people who&apos;ve eaten there.</Reveal>
          <Reveal as="p" delay={150} className="lede mt-6 max-w-[34em]">
            Menus and photos on Forebytes are contributed by diners, not supplied by restaurants directly. If you spot something wrong (a closed restaurant, a mislabelled allergen, an outdated menu), you can report it in the app, and you can add or correct it yourself.
          </Reveal>
        </section>

        <section id="contact" className="px-page" style={{ paddingBlock: "clamp(40px,8vh,90px) clamp(80px,14vh,160px)" }}>
          <Reveal as="h2" variant="left" className="font-heading m-0 max-w-[12em]" style={{ fontSize: "clamp(40px,6.5vw,104px)", lineHeight: 0.98 }}>Have a question, a correction, or feedback?</Reveal>
          <Reveal as="a" delay={250} className="btn btn-primary mt-8 !inline-flex !px-[30px] !py-4 !text-lg !text-bg" href={`mailto:${SITE.emails.support}`}>{SITE.emails.support}</Reveal>
        </section>
      </main>
      <FooterCompact />
    </>
  );
}
