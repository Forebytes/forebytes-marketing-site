import StoryDesktop from "@/components/home/StoryDesktop";
import StoryMobile from "@/components/home/StoryMobile";

/** Two different builds, not one responsive layout: the pinned 3D-tilting phone mockup (kept
 * for md+ — tablets and up, since there's room for it — see StoryDesktop) felt redundant on an
 * actual phone, where the full-bleed real app screen (see StoryMobile) gives a much stronger
 * sense of the product. CSS picks one; the unmounted one costs nothing (StoryDesktop's GSAP pin
 * is itself gated to md+). */
export default function Story() {
  return (
    <div id="how">
      <div className="md:hidden">
        <StoryMobile />
      </div>
      <div className="hidden md:block">
        <StoryDesktop />
      </div>
    </div>
  );
}
