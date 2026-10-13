const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Shared links carry a database uuid. Anything else is not a real link, so it should 404. */
export const isShareId = (id: string) => UUID.test(id);
