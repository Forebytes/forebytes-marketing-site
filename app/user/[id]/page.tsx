import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import ShareLanding from "@/components/ShareLanding";
import { isShareId } from "@/lib/share";
import { loadProfileCard } from "@/lib/sharePreview-server";
import { SITE } from "@/lib/site";

// A shared link, not a page to rank: keep it out of search results. The per-item card (username,
// display name, avatar) comes from `public_profile_card()`, a narrow service-role read of data the
// app otherwise keeps behind sign-in, see docs/universal-links.md and
// forebytes-app/docs/security.md. Shown for private accounts too: privacy gates following and
// content, not identity, same as the app's own public profile screen.
const getCard = cache((id: string) => loadProfileCard(id));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const card = isShareId(id) ? await getCard(id) : null;

  const name = card?.displayName || card?.username;
  const title = name ? `${name} on Forebytes` : "A profile on Forebytes";
  const description = card
    ? `@${card.username} on Forebytes. See what they're rating, in AR on your own table before you order.`
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
      ...(card?.avatarUrl ? { images: [{ url: card.avatarUrl }] } : {}),
    },
  };
}

export default async function ProfileShare({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isShareId(id)) notFound();
  const card = await getCard(id);
  return (
    <ShareLanding
      kind="profile"
      preview={
        card
          ? { name: card.displayName || card.username, photoUrl: card.avatarUrl, subtitle: `@${card.username}` }
          : undefined
      }
    />
  );
}
