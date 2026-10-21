import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import Nav from "@/components/Nav";
import { FooterFull } from "@/components/Footer";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Manifesto from "@/components/home/Manifesto";
import Story from "@/components/home/Story";
import ArReveal from "@/components/home/ArReveal";
import Features from "@/components/home/Features";
import Dublin from "@/components/home/Dublin";
import Cta from "@/components/home/Cta";

export default function Home() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "MobileApplication", name: SITE.name, description: SITE.description, operatingSystem: "iOS", applicationCategory: "LifestyleApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" }, url: SITE.url }} />
      <Nav />
      <main id="main">
        <Hero />
        <div className="overflow-x-clip">
          <Marquee />
        </div>
        <Manifesto />
        <Story />
        <ArReveal />
        <Features />
        <Dublin />
        <Cta />
      </main>
      <FooterFull />
    </>
  );
}
