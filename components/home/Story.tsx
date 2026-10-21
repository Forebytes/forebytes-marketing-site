import StoryDesktop from "@/components/home/StoryDesktop";
import StoryMobile from "@/components/home/StoryMobile";

/** Two different builds, not one responsive layout: the pinned 3D-tilting phone mockup (kept
 * for lg+, see StoryDesktop) felt redundant on an actual phone, where the full-bleed real app
 * screen (see StoryMobile) gives a much stronger sense of the product. CSS picks one; the
 * unmounted one costs nothing (StoryDesktop's GSAP pin is itself gated to lg+). */
export default function Story() {
  return (
    <div id="how">
      <div className="lg:hidden">
        <StoryMobile />
      </div>
      <div className="hidden lg:block">
        <StoryDesktop />
      </div>
    </div>
  );
}
