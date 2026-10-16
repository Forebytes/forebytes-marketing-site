/**
 * An invisible jump target inside a tall pinned scene. A link to the scene's own top would land on
 * its first pixel, where most scenes are still blank (they build up as you scroll), so links land
 * here instead: `at` is how far through the scene (0 to 1) shows its content.
 */
export default function SceneAnchor({ id, at }: { id: string; at: number }) {
  return <span id={id} aria-hidden className="pointer-events-none absolute left-0 h-0 w-0" style={{ top: `calc((100% - 100dvh) * ${at})` }} />;
}
