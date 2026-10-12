import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({ title: "Terms & conditions", description: "The terms that govern your use of the Forebytes app.", path: "/terms" });

export default function Terms() {
  return (
    <LegalPage
      tone="terracotta"
      tag="Last updated 12 October 2026"
      title="Terms &"
      accentWord="conditions."
      intro="The terms that govern your use of the Forebytes app."
      preamble={<p>These terms govern your use of the Forebytes app. By creating an account, you agree to them.</p>}
      sections={[
        {
          id: "eligibility",
          title: "Eligibility",
          body: <p>You must be at least 16 years old to use Forebytes. Each person may hold one account; you may not create or use multiple accounts to evade a suspension, manipulate ratings, or circumvent a block.</p>,
        },
        {
          id: "service",
          title: "The service",
          body: (
            <>
              <p>Forebytes is a free restaurant discovery app. There are no payments, paid tiers, or in-app purchases today.</p>
              <p>Restaurant listings come from Mapbox&apos;s map data. Menus, dish photos, prices, descriptions, and allergen information are contributed by users, not verified by Forebytes or supplied by the restaurants themselves. AR visualisations of dishes are illustrative representations based on submitted photos, not exact, to-scale, or guaranteed representations of what you will actually be served.</p>
              <p className="callout"><b>Important:</b> do not rely on allergen or dietary information shown in the app as a substitute for asking the restaurant directly, especially where a genuine allergy or medical condition is involved. This information is user-submitted and may be incomplete, outdated, or wrong.</p>
            </>
          ),
        },
        {
          id: "content",
          title: "Your content",
          body: (
            <>
              <p>When you submit a review, rating, dish, photo, or anything else to Forebytes, you keep ownership of it. You grant Forebytes a worldwide, royalty-free licence to host, display, and distribute that content within the app and in connection with promoting the app, for as long as you keep it on the platform (see the <Link href="/privacy">Privacy Policy</Link> for what happens to it if you delete your account).</p>
              <p>You&apos;re responsible for what you submit. By submitting content, you confirm it&apos;s genuinely yours to share, is accurate to the best of your knowledge, and doesn&apos;t violate anyone else&apos;s rights.</p>
            </>
          ),
        },
        {
          id: "use",
          title: "Acceptable use",
          body: <p>The <Link href="/community-guidelines">Community Guidelines</Link> are part of these terms. In short: don&apos;t harass people, don&apos;t post content that&apos;s illegal, hateful, or deliberately false, and don&apos;t try to manipulate ratings or reviews.</p>,
        },
        {
          id: "suspension",
          title: "Suspension and termination",
          body: <p>We may suspend or terminate an account that violates these terms or the Community Guidelines, including repeated reports against the same account or content. You can delete your own account at any time in Settings.</p>,
        },
        {
          id: "disclaimers",
          title: "Disclaimers",
          body: <p>Forebytes is provided &quot;as is.&quot; We don&apos;t guarantee that restaurant information, opening hours, menus, or prices are accurate or current, this is community-contributed content, and we don&apos;t guarantee the app will always be available or error-free.</p>,
        },
        {
          id: "liability",
          title: "Limitation of liability",
          body: (
            <>
              <p>To the maximum extent permitted by applicable law, Forebytes and its operators will not be liable for any indirect, incidental, special, or consequential damages arising from your use of the app, including but not limited to reliance on restaurant information, menu details, allergen information, or AR visualisations submitted by users. Our total liability for any claim arising from your use of the app will not exceed the amount you paid us in the twelve months before the claim (which, as the app is currently free, is zero).</p>
              <p>Nothing in these terms excludes or limits liability that cannot lawfully be excluded or limited under the law of Ireland, including liability for death or personal injury caused by negligence, or liability for fraud.</p>
            </>
          ),
        },
        {
          id: "law",
          title: "Governing law",
          body: <p>These terms are governed by the laws of Ireland.</p>,
        },
        {
          id: "changes",
          title: "Changes to these terms",
          body: (
            <>
              <p>We&apos;ll update the date at the top of this page if these terms change, and notify you in-app for material changes.</p>
              <p>Questions: <a href={`mailto:${SITE.emails.support}`}>{SITE.emails.support}</a></p>
            </>
          ),
        },
      ]}
    />
  );
}
