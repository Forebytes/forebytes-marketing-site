import Reveal from "@/components/Reveal";
import IrelandMap from "@/components/IrelandMap";

export default function Dublin() {
  return (
    <section className="px-page relative overflow-hidden" style={{ paddingBlock: "clamp(100px,18vh,200px)" }}>
      <Reveal variant="pop" className="bg-accent-2-200 absolute rounded-full" style={{ right: "-6vw", top: "50%", marginTop: "-20vw", width: "40vw", height: "40vw" }} aria-hidden />
      <Reveal variant="pop" delay={150} className="absolute hidden sm:block" style={{ right: "9vw", top: "50%", marginTop: "-13vw", width: "min(24vw,260px)" }} aria-hidden>
        <IrelandMap />
      </Reveal>
      <div className="relative">
        <Reveal as="h2" variant="left" className="display" style={{ fontSize: "clamp(64px,13vw,220px)", lineHeight: 0.88 }}>Dublin.</Reveal>
        <Reveal as="p" delay={200} className="mt-7 max-w-[24em] leading-normal" style={{ fontSize: "clamp(18px,1.8vw,26px)" }}>
          We&apos;re starting where we live. iOS first, with Android to follow.
        </Reveal>
      </div>
    </section>
  );
}
