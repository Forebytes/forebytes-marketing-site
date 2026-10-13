import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShareLanding from "@/components/ShareLanding";
import { isShareId } from "@/lib/share";

// A shared link, not a page to rank: keep it out of search results. Per-item cards (name, photo)
// need a deliberate server-side read of data the app keeps behind sign-in, see docs/universal-links.md.
export const metadata: Metadata = {
  title: { absolute: "A dish on Forebytes" },
  description: "See it before you bite it. Forebytes shows dishes in AR on your own table before you order.",
  robots: { index: false, follow: true },
  openGraph: { title: "A dish on Forebytes", description: "See it before you bite it.", siteName: "Forebytes", type: "website" },
};

export default async function DishShare({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isShareId(id)) notFound();
  return <ShareLanding kind="dish" />;
}
