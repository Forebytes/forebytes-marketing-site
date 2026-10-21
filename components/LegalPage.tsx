import Nav from "@/components/Nav";
import { FooterCompact } from "@/components/Footer";
import Reveal from "@/components/Reveal";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

export default function LegalPage({
  tone, tag, title, accentWord, intro, preamble, sections,
}: {
  tone: "sage" | "terracotta";
  tag: string;
  title: string;
  accentWord: string;
  intro: string;
  preamble?: React.ReactNode;
  sections: LegalSection[];
}) {
  const sage = tone === "sage";
  return (
    <>
      <Nav />
      <main id="main">
        <section className={`${sage ? "bg-accent-2-100" : "bg-accent-100"} px-page relative overflow-hidden`} style={{ padding: "clamp(140px,20vh,200px) var(--gutter) clamp(50px,8vh,90px)" }}>
          <div className={`${sage ? "bg-accent-2-200" : "bg-accent-200"} absolute rounded-full`} style={{ right: "-8vw", top: "-12vw", width: "36vw", height: "36vw" }} />
          <div className="relative">
            <p className="fade-up m-0 text-sm font-semibold" style={{ animationDelay: ".1s", animationDuration: ".8s", color: "var(--color-accent-700)" }}>{tag}</p>
            <h1 className="display mt-5" style={{ fontSize: "clamp(48px,8.8vw,144px)" }}>
              <span className="w"><span style={{ animationDelay: ".2s" }}>{title}</span></span>{" "}
              <span className="w"><span className="text-accent" style={{ animationDelay: ".35s" }}>{accentWord}</span></span>
            </h1>
            <p className="fade-up mt-7 max-w-[30em] leading-normal" style={{ fontSize: "clamp(18px,1.6vw,23px)", animationDelay: ".8s" }}>{intro}</p>
          </div>
        </section>

        <section className="px-page grid grid-cols-1 items-start gap-[clamp(32px,6vw,96px)] lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]" style={{ paddingBlock: "clamp(50px,8vh,100px) clamp(80px,12vh,140px)" }}>
          <nav aria-label="On this page" className="hidden flex-col gap-1.5 text-[15px] lg:sticky lg:top-24 lg:flex">
            <b className="font-heading mb-1.5 text-xl font-normal">On this page</b>
            {sections.map((s) => <a key={s.id} href={`#${s.id}`} className="pill-link">{s.title}</a>)}
          </nav>
          <article className="max-w-[46em] text-lg leading-[1.65]">
            {preamble && <Reveal variant="fade" className="legal-prose mb-14">{preamble}</Reveal>}
            {sections.map((s, i) => (
              <div key={s.id}>
                <Reveal as="h2" variant="soft" id={s.id} className={`font-heading mb-4 scroll-mt-[100px] ${i ? "mt-16" : "mt-0"}`} style={{ fontSize: "clamp(32px,4vw,52px)", lineHeight: 1 }}>{s.title}</Reveal>
                <Reveal as="div" variant="fade" className="legal-prose">{s.body}</Reveal>
              </div>
            ))}
          </article>
        </section>
      </main>
      <FooterCompact />
    </>
  );
}
