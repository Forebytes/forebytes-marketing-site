import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = pageMeta({ title: "Community guidelines", description: "What honest, respectful use of Forebytes looks like, and what happens when it doesn't.", path: "/community-guidelines" });

export default function CommunityGuidelines() {
  return (
    <LegalPage
      tone="sage"
      tag="Part of our terms"
      title="Community"
      accentWord="guidelines."
      intro="Forebytes works because people are honest about what they ate and where."
      preamble={<p>Forebytes works because people are honest about what they ate and where. These guidelines explain what that means in practice, and what happens when someone doesn&apos;t follow them.</p>}
      sections={[
        { id: "respect", title: "Be respectful", body: <p>No harassment, hate speech, threats, or targeted abuse of any kind, whether directed at another user, a restaurant, or its staff.</p> },
        { id: "honest", title: "Be honest", body: <p>Reviews and ratings should reflect a genuine experience. Contributed dishes, menus, and photos should be real and accurate to the best of your knowledge. Don&apos;t submit fake reviews, for your own venue or anyone else&apos;s.</p> },
        { id: "language", title: "Language", body: <p>Offensive and abusive language is automatically blocked from dish names, reviews, display names, and usernames, both as you type and when the app checks your submission.</p> },
        {
          id: "wrong",
          title: "If something's wrong",
          body: <p>Every dish, restaurant, review, and profile has a way to report it. Content that receives multiple reports is automatically hidden while it&apos;s looked into. If you&apos;d rather not see or be seen by a specific person, you can block them from your profile or theirs. Blocking is mutual: once blocked, neither of you can follow, message, or see each other&apos;s activity, though a blocked person&apos;s existing reviews stay visible on the restaurant or dish they wrote about, since removing them would also mean changing that restaurant&apos;s average rating for everyone else.</p>,
        },
        {
          id: "enforcement",
          title: "Enforcement",
          body: <p>Repeated or serious violations can result in content being removed or an account being suspended. Reported content is automatically hidden once it receives enough reports, and we review flagged content as we&apos;re able to. We don&apos;t yet have a dedicated moderation team with a published response-time commitment, so this is a genuine effort, not a guaranteed turnaround time.</p>,
        },
      ]}
    />
  );
}
