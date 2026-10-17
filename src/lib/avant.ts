/** Copy specific to the linen version. Facts and photos come from content.ts. */

/** Watermark marquee. Wording as requested for this version (see NOTES.md for flags). */
export const marqueeRows = [['Foodbiz', 'Haute gastronomy', 'Bombay', 'Weddings', 'Cartier', 'The live pass']];

export const heroSub = 'Catering and hospitality in Mumbai. We look after the menu, the counters and the floor, so the host can be in the room.';

export const featuredWork = ['jewellery-boutique-evening', 'wedding-bengaluru', 'childrens-birthday', 'study-launch-city-view'];

/**
 * The banqueting folios: the four services as clothbound volumes. Cloth and foil are design choices;
 * headlines and briefs restate content from content.ts (no new facts).
 */
export type Folio = {
  slug: 'weddings' | 'celebrations' | 'brand-launches' | 'corporate';
  volume: string;
  cloth: [string, string];
  foil: string;
  headline: string;
  brief: string;
  thickness: number; // spine depth in px, so the four volumes are not identical
  height: number; // relative height, 1 = tallest
};

export const folios: Folio[] = [
  {
    slug: 'weddings',
    volume: 'I',
    cloth: ['#3A1414', '#2B0C0C'],
    foil: 'linear-gradient(135deg, #F3D5A6, #C97A3E 55%, #8A4F1F)',
    headline: 'The family dishes & morning haldi',
    brief: 'Multi-day weddings, planned ceremony by ceremony. Live counters, and the family recipes that have to be there.',
    thickness: 34,
    height: 1,
  },
  {
    slug: 'celebrations',
    volume: 'II',
    cloth: ['#2E2232', '#1C1420'],
    foil: 'linear-gradient(135deg, #FFFFFF, #E6C594 45%, #B87333)',
    headline: 'Private dining & social functions',
    brief: 'Birthdays and children’s parties, family functions, and sit-down dinners cooked for the people at the table.',
    thickness: 26,
    height: 0.92,
  },
  {
    slug: 'brand-launches',
    volume: 'III',
    cloth: ['#101720', '#080C12'],
    foil: 'linear-gradient(135deg, #F3D5A6, #C97A3E 50%, #E09F67)',
    headline: 'Store openings & live events',
    brief: 'Product reveals, store openings, concerts and festivals. Food that suits the brand and lands on the run sheet.',
    thickness: 30,
    height: 0.97,
  },
  {
    slug: 'corporate',
    volume: 'IV',
    cloth: ['#1B241E', '#0F1612'],
    foil: 'linear-gradient(135deg, #E5DFD5, #C97A3E 55%, #8A4F1F)',
    headline: 'Daily office dining & corporate functions',
    brief: 'Daily lunches for offices and campuses, and the functions your company hosts. Same standard, five days a week.',
    thickness: 38,
    height: 0.9,
  },
];
