/** Bundle id of the iOS app (forebytes-app, app.config.ts). */
export const IOS_BUNDLE_ID = "com.forebytes.app";

/**
 * Paths the app opens directly, matching the links it shares (forebytes-app `src/lib/share.ts`):
 * `/dish/<id>`, `/restaurant/<id>` and `/user/<id>`. Keep this in step with the app's routes.
 */
export const UNIVERSAL_LINK_PATHS = ["/dish/*", "/restaurant/*", "/user/*"] as const;

/**
 * The apple-app-site-association document, or null if the Apple Team ID is not set or malformed.
 * Returning null (a 404) is deliberate: a wrong file would be cached by Apple and silently break
 * universal links for a long time, whereas a missing one is obvious.
 */
export function buildAasa(teamId: string | undefined) {
  if (!teamId || !/^[A-Z0-9]{10}$/.test(teamId)) return null;
  return {
    applinks: {
      apps: [],
      details: [{ appIDs: [`${teamId}.${IOS_BUNDLE_ID}`], components: UNIVERSAL_LINK_PATHS.map((p) => ({ "/": p })) }],
    },
  };
}
