/**
 * Sample "friends" for the Feed phone. These are not real people and not real reviews: the names are
 * invented and the text is generic, picked deterministically from the dish so it does not flicker.
 * Never replace this with real users' names or reviews on a public page.
 */
const PEOPLE = ["Aoife Byrne", "Conor Walsh", "Tunde Adeyemi", "Maya Patel", "Liam Gallagher", "Ngozi Okafor", "Sofia Rossi", "Kwame Mensah", "Niamh Doyle", "Ravi Menon"];

const COMMENTS = [
  (dish: string) => `The ${dish} was the best thing on the table.`,
  (dish: string) => `Went for the ${dish} on a recommendation. Not disappointed.`,
  () => "Portion was bigger than I expected, in a good way.",
  (dish: string) => `Ordered the ${dish} twice in one week.`,
  () => "Simple, properly cooked, and worth the trip.",
];

const WHEN = ["2h ago", "6h ago", "1d ago", "2d ago"];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export type FriendPost = { name: string; initials: string; rating: number; when: string; comment: string; likes: number };

export function friendPosts(seed: string, dishName: string, count = 2): FriendPost[] {
  const h = hash(seed);
  return Array.from({ length: count }, (_, i) => {
    const name = PEOPLE[(h + i * 3) % PEOPLE.length];
    return {
      name,
      initials: name.split(" ").map((p) => p[0]).join(""),
      rating: i === 0 ? 5 : 4,
      when: WHEN[(h + i) % WHEN.length],
      comment: COMMENTS[(h + i * 2) % COMMENTS.length](dishName),
      likes: [3, 8, 12, 2][(h + i) % 4],
    };
  });
}
