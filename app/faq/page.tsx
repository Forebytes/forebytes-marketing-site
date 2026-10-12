import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import Nav from "@/components/Nav";
import { FooterCompact } from "@/components/Footer";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({ title: "FAQs", description: "Answers to common questions about Forebytes, AR dishes, privacy and your account.", path: "/faq" });

const mail = <a href={`mailto:${SITE.emails.support}`}>{SITE.emails.support}</a>;

const FAQS: { q: string; a: React.ReactNode; text?: string }[] = [
  { q: "What is Forebytes?", a: "A restaurant discovery app that shows you real dishes, contributed by real diners, with the goal of letting you see a dish in AR before you order it." },
  { q: "Is Forebytes free?", a: "Yes, there are no paid tiers or in-app purchases." },
  { q: "Where is Forebytes available?", a: "Forebytes launched in Dublin. It's currently iOS only; Android is planned but not yet available." },
  { q: "How do menus and photos get onto the app? Are they official?", a: "They're contributed by users who've actually been to the restaurant, not supplied by the restaurants themselves. If something looks wrong or outdated, you can report it, or add a correction yourself." },
  { q: "How does the AR feature work?", a: "You submit a photo of a dish, and Forebytes turns it into a 3D model you can place on your own table with your phone's camera, so you can see roughly what you're ordering before it arrives. This is actively rolling out rather than available for every dish today; coverage grows as more photos get processed." },
  { q: "Can I trust the allergen information?", a: "Treat it as a helpful pointer, not a guarantee. It's submitted by other diners, not verified against the restaurant's actual ingredients. Always confirm with the restaurant directly if you have a genuine allergy." },
  { q: "How do I make my account private?", a: "In Profile > Settings, you can set your account to private. People will need to send a follow request and have it accepted before they can see your activity." },
  { q: "Does a private account hide my reviews from everyone?", a: "No. Privacy controls who can follow you and see your activity in the feed; it doesn't hide your individual restaurant or dish ratings from other signed-in users browsing that restaurant or dish." },
  { q: "How do I report a problem with content, or a user?", a: "Every restaurant, dish, review, and profile has a report option. Reported content is automatically hidden once it receives enough reports while it's looked into." },
  { q: "How do I block someone?", a: "From their profile, there's a block option. Blocking is mutual: you won't see each other's activity, and neither of you can follow the other." },
  { q: "How do I delete my account?", a: "Settings > Delete Account. This is a genuine, immediate deletion of your personal data, not a deactivation." },
  { q: "Is my data safe? Where is it stored?", text: "Your data is hosted in the EU. Account deletion is real, not just hidden. See our Privacy Policy for the full detail of what we collect and why.", a: <>Your data is hosted in the EU. Account deletion is real, not just hidden. See our <Link href="/privacy">Privacy Policy</Link> for the full detail of what we collect and why.</> },
  { q: "How do I contact support?", text: `Email ${SITE.emails.support}.`, a: mail },
];

const plain = (a: React.ReactNode, text?: string) => text ?? (typeof a === "string" ? a : "");

export default function Faq() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: plain(f.a, f.text) },
          })),
        }}
      />
      <Nav />
      <main id="main">
        <section className="bg-accent-100 px-page relative overflow-hidden" style={{ padding: "clamp(140px,20vh,200px) var(--gutter) clamp(50px,8vh,90px)" }}>
          <div className="bg-accent-200 absolute rounded-full" style={{ right: "-8vw", top: "-12vw", width: "36vw", height: "36vw" }} />
          <div className="relative">
            <h1 className="display" style={{ fontSize: "clamp(48px,8.8vw,144px)" }}>
              <span className="w"><span style={{ animationDelay: ".2s" }}>Questions,</span></span>{" "}
              <span className="w"><span className="text-accent" style={{ animationDelay: ".35s" }}>answered.</span></span>
            </h1>
            <p className="fade-up mt-7 max-w-[30em] leading-normal" style={{ fontSize: "clamp(18px,1.6vw,23px)", animationDelay: ".8s" }}>
              Can&apos;t find what you need? Email {mail}.
            </p>
          </div>
        </section>

        <section className="px-page" style={{ paddingBlock: "clamp(50px,8vh,100px) clamp(80px,12vh,140px)" }}>
          <div className="faq max-w-[52em]">
            {FAQS.map((f) => (
              <Reveal key={f.q} variant="soft" delay={0}>
                <details className="faq-item">
                  <summary>{f.q}</summary>
                  <div className="legal-prose"><p>{f.a}</p></div>
                </details>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <FooterCompact />
    </>
  );
}
