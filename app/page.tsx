import { ShowcaseProvider } from "@/components/app-ui/ShowcaseProvider";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import Nav from "@/components/Nav";
import { FooterFull } from "@/components/Footer";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Manifesto from "@/components/home/Manifesto";
import Story from "@/components/home/Story";
import ArReveal from "@/components/home/ArReveal";
import Dublin from "@/components/home/Dublin";
import Cta from "@/components/home/Cta";

export default function Home() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "MobileApplication",
        name: SITE.name,
        description: SITE.description,
        operatingSystem: "iOS",
        applicationCategory: "LifestyleApplication",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        url: SITE.url,
        featureList: [
          "Live restaurant map with distance, cuisine and dietary filters",
          "Menus with prices and nutrition per dish",
          "Dish-level ratings, kept separate from the restaurant's own rating",
          "AR models of real dishes, built from on-device LiDAR scans or AI-verified photos, reviewed before publishing",
          "Friend feed of restaurant and dish ratings from people you follow",
          "Lists: Saved for Later, Want to Try, Places Visited, and lists of your own",
        ],
      }} />
      <Nav />
      <ShowcaseProvider>
      <main id="main">
        <Hero />
        <div className="overflow-x-clip">
          <Marquee />
        </div>
        <Manifesto />
        <Story />
        <ArReveal />
        <Dublin />
        <Cta />
      </main>
      </ShowcaseProvider>
      <FooterFull />
    </>
  );
}
