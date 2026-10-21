import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import ShareLanding from "@/components/ShareLanding";
import { isShareId } from "@/lib/share";
import { loadRestaurantCard } from "@/lib/sharePreview-server";
import { SITE } from "@/lib/site";

// A shared link, not a page to rank: keep it out of search results. The per-item card (name,
// photo) comes from `public_restaurant_card()`, a narrow service-role read of data the app
// otherwise keeps behind sign-in, see docs/universal-links.md and forebytes-app/docs/security.md.
const getCard = cache((id: string) => loadRestaurantCard(id));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const card = isShareId(id) ? await getCard(id) : null;

  const title = card ? `${card.name} on Forebytes` : "A restaurant on Forebytes";
  const description = card
    ? `${card.name}${card.city ? `, ${card.city}` : ""} on Forebytes. See the menu in AR on your own table before you order.`
    : "See it before you bite it. Forebytes shows dishes in AR on your own table before you order.";

  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      siteName: SITE.name,
      type: "website",
      ...(card?.photoUrl ? { images: [{ url: card.photoUrl }] } : {}),
    },
  };
}

export default async function RestaurantShare({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isShareId(id)) notFound();
  const card = await getCard(id);
  return (
    <ShareLanding
      kind="restaurant"
      preview={card ? { name: card.name, photoUrl: card.photoUrl, subtitle: card.city ?? undefined } : undefined}
    />
  );
}
