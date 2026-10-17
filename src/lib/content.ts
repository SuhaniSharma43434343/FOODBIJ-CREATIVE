import type { ImgKey } from './images';

/**
 * All site copy lives here.
 * Rule: nothing invented. Anything we do not have from the client is written as [NEEDS CLIENT: ...].
 * Client names on stories come from the photo-folder names and are not yet cleared for publication.
 */

export const site = {
  name: 'Foodbiz',
  legalName: 'Foodies Hospitality',
  strapline: 'Catering and hospitality, Mumbai',
  phone: '[NEEDS CLIENT: phone]',
  whatsapp: '[NEEDS CLIENT: WhatsApp]',
  email: '[NEEDS CLIENT: enquiry email]',
  address: '[NEEDS CLIENT: address]',
  instagram: '[NEEDS CLIENT: Instagram handle]',
  closer: "Made for hosts who'd rather be present.",
};

export type Photo = { key: ImgKey; alt: string };

export type ServiceSlug = 'weddings' | 'celebrations' | 'brand-launches' | 'corporate';

export type Service = {
  slug: ServiceSlug;
  numeral: string;
  index: string;
  name: string;
  shortName: string;
  menuLabel: string;
  line: string;
  summary: string;
  promise: string;
  hero: Photo;
  chapter: Photo[];
  notes: { label: string; text: string }[];
  formatsTitle: string;
  formats: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  gallery: Photo[];
  closing: string;
  formLabel: string;
};

export const services: Service[] = [
  {
    slug: 'weddings',
    numeral: 'I',
    index: '01',
    name: 'Weddings',
    shortName: 'Weddings',
    menuLabel: 'Weddings',
    line: 'The family dishes that have to be there, and a team that actually turns up for the morning haldi.',
    summary:
      'Multi-day weddings, planned ceremony by ceremony. We start with the dishes your family expects to see, then build the rest around them.',
    promise:
      'Weddings are the hardest catering there is. Not because of the food, but because of everyone the food has to mean something to.',
    hero: { key: 'bangalore-wedding-04', alt: 'A tiered gold buffet under rows of brass lamps at a wedding' },
    chapter: [
      { key: 'bangalore-wedding-03', alt: 'A cook in gloves lifts noodles onto a patterned plate at a live counter' },
      { key: 'randive-wedding-01', alt: 'Two servers beside a gold crescent canapé stand, lit at night' },
    ],
    notes: [
      { label: 'Starts with', text: 'Your family, not our menu' },
      { label: 'Planned', text: 'One ceremony at a time' },
      { label: 'Always', text: 'Jain, satvik, halal, labelled' },
    ],
    formatsTitle: 'Every ceremony gets its own menu',
    formats: [
      { title: 'Mehndi and haldi', text: 'Daytime food for a house full of family. Light, quick to serve, easy to eat standing up.' },
      { title: 'Sangeet', text: 'A late night with live counters, and a breakfast after it that is as considered as the dinner before.' },
      { title: 'The wedding', text: 'Thali service, plated courses or live counters, built around the dishes that are not negotiable.' },
      { title: 'Reception', text: 'Your wider circle, often a different crowd with a different appetite. We plan it separately.' },
    ],
    steps: [
      { title: 'We meet', text: 'You tell us the shape of it: the days, the ceremonies, the families, and the dishes that have to be there.' },
      { title: 'We taste', text: 'You eat the menu before your guests do, and we change what does not land.' },
      { title: 'We plan the days', text: 'Each ceremony gets its own menu, its own timing and its own team.' },
      { title: 'We arrive early', text: 'Our team is on site before the first guest, every day of it.' },
      { title: 'You are a guest', text: 'That is the whole point. Someone else is watching the counters.' },
    ],
    gallery: [
      { key: 'bangalore-wedding-01', alt: 'Domed yellow desserts set on a bed of dried beans' },
      { key: 'bayview-lawns-wedding-04', alt: 'A live wok counter at night, with cooks working behind it' },
      { key: 'aurangabad-wedding-04', alt: 'Brass thalis and printed menus laid on a red table' },
      { key: 'bayview-lawns-wedding-01', alt: 'An outdoor chai and ice-cream counter in pale wood and greenery' },
      { key: 'bangalore-wedding-02', alt: 'A dessert display with strings of pearls under warm chandeliers' },
      { key: 'bayview-lawns-wedding-02', alt: 'Earthen pots, copper and herbs along a wooden counter' },
    ],
    closing: "Tell us about your wedding. Even if it's a year out and nothing is fixed yet.",
    formLabel: 'Tell us about your wedding',
  },
  {
    slug: 'celebrations',
    numeral: 'II',
    index: '02',
    name: 'Celebrations & private dining',
    shortName: 'Celebrations',
    menuLabel: 'Celebrations & private dining',
    line: 'Birthdays, family functions and sit-down dinners, cooked for the people at the table.',
    summary:
      'Birthdays and kids’ parties, family and social functions, and dinners served at the table. Smaller rooms, closer guests, food people actually finish.',
    promise: 'The party still looks like a party. The food just isn’t an apology.',
    hero: { key: 'the-gummy-gourmet-01', alt: 'A dessert table in a glasshouse, with lilac flowers and wooden boards' },
    chapter: [
      { key: 'ninja-03', alt: 'Small pizzas with olive and pepper faces on a wooden board' },
      { key: 'the-gummy-gourmet-02', alt: 'A long dessert table on a black and white tiled floor in a glasshouse' },
    ],
    notes: [
      { label: 'For', text: 'Birthdays, family functions, dinners' },
      { label: 'Built around', text: 'Who is at the table' },
      { label: 'Always', text: 'Allergies labelled, kept apart' },
    ],
    formatsTitle: 'Three kinds of celebration',
    formats: [
      {
        title: 'Birthdays and kids’ parties',
        text: 'Real food for small people. Pizzas with faces, sliders sized for small hands, and low counters they can reach. Parents get fed too.',
      },
      {
        title: 'Family and social functions',
        text: 'Anniversaries, poojas, homecomings. The dishes your family cooks for these days, made for more people than your kitchen can manage.',
      },
      {
        title: 'Sit-down dinners',
        text: 'Plated courses served at the table, for a small group. [NEEDS CLIENT: how sit-down dinners work, and photos of one]',
      },
    ],
    steps: [
      { title: 'Tell us the occasion', text: 'Whose birthday, which function, how many at the table.' },
      { title: 'Tell us who is coming', text: 'Ages, allergies, the uncle who only eats one thing. We plan for all of it.' },
      { title: 'We plan the food', text: 'A menu built for the room, with a tasting where it matters.' },
      { title: 'We set up and clear', text: 'You get the party. We take the mess.' },
    ],
    gallery: [
      { key: 'playseum-set-ups-02', alt: 'A children’s buffet with animal cut-outs and greenery' },
      { key: 'carnival-01', alt: 'Striped food-counter stalls under bunting in a garden' },
      { key: 'ninja-04', alt: 'A fruit counter with oranges and a glass drinks dispenser, outdoors' },
      { key: 'the-gummy-gourmet-02', alt: 'A long dessert table in a glasshouse' },
    ],
    closing: 'Tell us whose celebration it is, and how many will be at the table.',
    formLabel: 'Tell us about the celebration',
  },
  {
    slug: 'brand-launches',
    numeral: 'III',
    index: '03',
    name: 'Brand launches & live events',
    shortName: 'Brand launches',
    menuLabel: 'Brand launches & live events',
    line: 'At a launch, the food is part of the brand. We read the brand and the run sheet before writing the first menu.',
    summary:
      'Product and store launches, brand days, concerts and large-format events. We read the brand and the run sheet before we write a menu.',
    promise: 'At a launch the food is part of the brand. It has to look right in the room and in the photographs.',
    hero: { key: 'cartier-09', alt: 'A gloved server holds a slate of canapés finished with flowers' },
    chapter: [
      { key: 'raymond-chairmans-lounge-05', alt: 'Long white trays of plated canapés seen from above' },
      { key: 'merc-eqg-launch-02', alt: 'Two cooks plating under blue and violet event light' },
    ],
    notes: [
      { label: 'For', text: 'Launches, brand days, concerts' },
      { label: 'Planned around', text: 'The brand and the run sheet' },
      { label: 'Served', text: 'Passed, plated, at live counters' },
    ],
    formatsTitle: 'Four kinds of brief',
    formats: [
      { title: 'Store and product launches', text: 'Canapés passed on slate, a bar built to order, and a floor team that keeps moving.' },
      { title: 'Brand days and boutique evenings', text: 'A small room and a short guest list. Trays that look right from every angle.' },
      { title: 'Concerts and festivals', text: 'Service that runs to the set times, not the other way round.' },
      { title: 'Large-format events', text: 'Long counters, a lot of guests and a fixed window. We plan the flow before the menu.' },
    ],
    steps: [
      { title: 'We read the brief', text: 'The brand, the guests, and the moment the evening is built around.' },
      { title: 'We read the run sheet', text: 'Reveals, speeches and sets come first. The food has to land inside them.' },
      { title: 'We walk the site', text: 'Access, power, load-in, and where a counter can actually go.' },
      { title: 'We design the food to the room', text: 'Colour, light and scale, so it reads in the room and on camera.' },
      { title: 'We clear down', text: 'The space goes back the way we found it.' },
    ],
    gallery: [
      { key: 'cartier-07', alt: 'Tartlets with edible flowers on a slate board' },
      { key: 'cartier-03', alt: 'Cocktails being built at a bar, with coupes and shakers' },
      { key: 'raymond-chairmans-lounge-03', alt: 'White trays of canapés in neat rows, seen from above' },
      { key: 'ferrari-02', alt: 'Red burgers on a round board in front of a red wall' },
      { key: 'casio-02', alt: 'An evening buffet under table lamps with a garden behind' },
      { key: 'kaytranada-03', alt: 'A long live food counter with a team working, lit low' },
    ],
    closing: 'Send us the brief and the run sheet. We will tell you what it takes.',
    formLabel: 'Brief us on your launch',
  },
  {
    slug: 'corporate',
    numeral: 'IV',
    index: '04',
    name: 'Corporate & office dining',
    shortName: 'Corporate',
    menuLabel: 'Corporate & office dining',
    line: 'The test is Tuesday, not the launch party. Same team, same standard, a menu that keeps changing.',
    summary:
      'Daily and recurring catering for offices and campuses, plus the functions your company hosts. Same team, same standard, a menu that keeps changing.',
    promise: 'The test is Tuesday, not the launch party.',
    hero: { key: 'sbi-02', alt: 'A long line of covered dishes under brass lamps, draped in gold' },
    chapter: [
      { key: 'motilal-oswal-01', alt: 'Canapés on tiered wooden boards at a window, the city behind' },
      { key: 'netflix-03', alt: 'Six servers in black holding trays, standing in a line' },
    ],
    notes: [
      { label: 'For', text: 'Offices, campuses, company events' },
      { label: 'Runs on', text: 'A menu cycle and a standing team' },
      { label: 'Tone', text: 'Minimal, clean, on time' },
    ],
    formatsTitle: 'What we run for offices',
    formats: [
      { title: 'Daily office dining', text: 'Counters planned around a short lunch window, so people eat and get back to work.' },
      { title: 'Working lunches', text: 'Meetings, board days and client visits. Food that does not interrupt the agenda.' },
      { title: 'Corporate functions', text: 'Town halls, bank days, annual dinners. The office, at its best.' },
      { title: 'Dietary needs, labelled', text: 'Vegetarian, Jain and allergies, labelled on every counter, every day.' },
    ],
    steps: [
      { title: 'We look at your floor', text: 'Headcount, timings, the room, and where a counter can actually go.' },
      { title: 'We propose a cycle', text: 'A menu rotation long enough that nothing repeats before people want it to.' },
      { title: 'We run a trial week', text: 'The real thing, on your floor, with your people eating it.' },
      { title: 'We settle in', text: 'A standing programme, a standing team, and a monthly look at what is working.' },
    ],
    gallery: [
      { key: 'sbi-03', alt: 'Round banquet tables and a draped buffet in a hall' },
      { key: 'uti-03', alt: 'A buffet line along a carved wooden wall' },
      { key: 'bloomberg-bsmr-02', alt: 'An outdoor food setup between office towers' },
      { key: 'motilal-oswal-01', alt: 'Canapés on tiered boards at a window' },
    ],
    closing: 'Tell us how many people you feed, and when they eat.',
    formLabel: 'Plan a corporate programme',
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

/** The operational run sheet printed under each selected-work photo. Formats restate `made`; no numbers are confirmed. */
export type RunSheet = { scale: string; format: string; brigade: string; runTime: string; dietary: string };

export type Story = {
  slug: string;
  service: ServiceSlug;
  title: string;
  client: string;
  caption: string;
  brief: string;
  made: string;
  cover: Photo;
  photos: Photo[];
  liveStation?: string;
  city?: string;
  sheet?: RunSheet;
};

const needsBrief = (event: string) => `[NEEDS CLIENT: the brief for ${event}]`;
const sheet = (format: string): RunSheet => ({
  scale: '[NEEDS CLIENT: guest count]',
  format,
  brigade: '[NEEDS CLIENT: team size]',
  runTime: '[NEEDS CLIENT: service window]',
  dietary: 'Labelled at every counter',
});

/** Captions describe what the photographs show, nothing more. Client names are not yet cleared. */
export const stories: Story[] = [
  {
    slug: 'jewellery-boutique-evening',
    service: 'brand-launches',
    title: 'An evening at a jewellery boutique',
    client: 'Cartier',
    caption: 'Canapés off slate, drinks built to order, and a floor team that kept moving all evening.',
    brief: needsBrief('the Cartier boutique evening'),
    made: 'Tartlets and choux finished with edible flowers, passed on slate by gloved servers. Cocktails built at the bar.',
    cover: { key: 'cartier-09', alt: 'A slate of canapés finished with flowers, held by a server' },
    photos: [
      { key: 'cartier-07', alt: 'Tartlets with edible flowers on slate' },
      { key: 'cartier-03', alt: 'Cocktails being built at the bar' },
      { key: 'cartier-08', alt: 'A slate of canapés carried through the room' },
      { key: 'cartier-01', alt: 'A server carrying canapés on slate' },
    ],
    sheet: sheet('Canapés passed on slate · cocktails built at the bar'),
  },
  {
    slug: 'wedding-bengaluru',
    service: 'weddings',
    title: 'A wedding in Bengaluru',
    client: 'A family in Bengaluru',
    caption: 'A gold buffet built up in tiers, a cook finishing plates by hand, and dessert that arrived looking like it was grown.',
    brief: needsBrief('the Bengaluru wedding'),
    made: 'A tiered buffet under brass lamps, a live counter plating to order, and a dessert course set on dried beans.',
    cover: { key: 'bangalore-wedding-04', alt: 'A tiered gold buffet under brass lamps' },
    photos: [
      { key: 'bangalore-wedding-03', alt: 'Noodles lifted onto a plate at a live counter' },
      { key: 'bangalore-wedding-01', alt: 'Domed yellow desserts on dried beans' },
      { key: 'bangalore-wedding-02', alt: 'A dessert display with strings of pearls' },
    ],
    liveStation: 'A live counter plated to order through the evening.',
    city: 'Bengaluru',
    sheet: sheet('A tiered buffet · a live counter plating to order'),
  },
  {
    slug: 'wedding-on-the-lawns',
    service: 'weddings',
    title: 'A wedding on the lawns',
    client: 'A wedding at Bayview Lawns',
    caption: 'Chai and ice cream outdoors, earthen pots along a wooden counter, and a live wok running late.',
    brief: needsBrief('the Bayview Lawns wedding'),
    made: 'Outdoor counters in pale wood and greenery: a chai and ice-cream counter, and a live wok counter.',
    cover: { key: 'bayview-lawns-wedding-01', alt: 'An outdoor chai and ice-cream counter' },
    photos: [
      { key: 'bayview-lawns-wedding-04', alt: 'A live wok counter at night' },
      { key: 'bayview-lawns-wedding-02', alt: 'Earthen pots and herbs on a wooden counter' },
    ],
    liveStation: 'A live wok counter, from the counter signage in the photographs.',
  },
  {
    slug: 'night-lit-reveal',
    service: 'brand-launches',
    title: 'A car reveal, lit in violet',
    client: 'Mercedes-Benz, EQG launch',
    caption: 'A reveal lit in blue and violet. The food had to read at night, under coloured light, in photographs.',
    brief: needsBrief('the Mercedes-Benz EQG launch'),
    made: 'A long buffet under coloured light and two cooks plating to order.',
    cover: { key: 'merc-eqg-launch-01', alt: 'A buffet under blue and violet light' },
    photos: [{ key: 'merc-eqg-launch-02', alt: 'Two cooks plating under violet light' }],
  },
  {
    slug: 'dessert-glasshouse',
    service: 'celebrations',
    title: 'A dessert table in a glasshouse',
    client: '[NEEDS CLIENT: which event this was]',
    caption: 'Lilac flowers, wooden boards and a long table of desserts, in daylight under glass.',
    brief: needsBrief('the glasshouse dessert table'),
    made: 'A dessert table dressed with lilac and pink flowers on wooden risers.',
    cover: { key: 'the-gummy-gourmet-01', alt: 'A dessert table in a glasshouse' },
    photos: [{ key: 'the-gummy-gourmet-02', alt: 'A long dessert table on a tiled floor' }],
  },
  {
    slug: 'chairmans-lounge',
    service: 'brand-launches',
    title: 'A chairman’s lounge',
    client: 'Raymond, Chairman’s Lounge',
    caption: 'A small room, a senior guest list, and trays that had to look right from every angle.',
    brief: needsBrief('the Raymond Chairman’s Lounge'),
    made: 'Canapés plated in rows on long white trays.',
    cover: { key: 'raymond-chairmans-lounge-05', alt: 'Long white trays of canapés from above' },
    photos: [{ key: 'raymond-chairmans-lounge-03', alt: 'Rows of canapés on white trays' }],
  },
  {
    slug: 'childrens-birthday',
    service: 'celebrations',
    title: 'A children’s birthday',
    client: 'A family birthday',
    caption: 'Pizzas with faces on them, sliders in ramekins, and counters small people want to walk up to.',
    brief: needsBrief('the children’s birthday'),
    made: 'Mini pizzas with olive-and-pepper faces, a fruit counter and themed counters.',
    cover: { key: 'ninja-03', alt: 'Small pizzas with faces on a wooden board' },
    photos: [{ key: 'ninja-04', alt: 'A fruit counter with oranges, outdoors' }],
    sheet: sheet('Mini pizzas · a fruit counter · themed counters'),
  },
  {
    slug: 'red-on-red',
    service: 'brand-launches',
    title: 'Red on red',
    client: 'Ferrari, launch event',
    caption: 'The car was the centrepiece. We plated to it.',
    brief: needsBrief('the Ferrari launch'),
    made: 'Red burgers on a round board, and a grazing spread in the showroom.',
    cover: { key: 'ferrari-02', alt: 'Red burgers on a board against a red wall' },
    photos: [{ key: 'ferrari-01', alt: 'A grazing spread in a showroom' }],
  },
  {
    slug: 'study-launch-city-view',
    service: 'corporate',
    title: 'A study launch with a city view',
    client: 'Motilal Oswal, Wealth Creation Study',
    caption: 'Canapés on tiered boards at a window table, with the city doing the rest.',
    brief: needsBrief('the Motilal Oswal study launch'),
    made: 'Canapés on tiered wooden boards along a window.',
    cover: { key: 'motilal-oswal-01', alt: 'Canapés on tiered boards at a window' },
    photos: [],
    sheet: sheet('Canapés on tiered boards along a window'),
  },
  {
    slug: 'bank-day-lunch',
    service: 'corporate',
    title: 'A bank day lunch',
    client: 'State Bank of India, Bank Day',
    caption: 'A long line of covered dishes, lamps down the length of it, and a fixed lunch window.',
    brief: needsBrief('the SBI Bank Day'),
    made: 'A draped buffet line under brass lamps, and round banquet tables.',
    cover: { key: 'sbi-02', alt: 'A long buffet line under brass lamps' },
    photos: [{ key: 'sbi-03', alt: 'Round banquet tables and a draped buffet' }],
  },
  {
    slug: 'six-trays-one-line',
    service: 'corporate',
    title: 'Six trays, one line',
    client: 'Netflix, press event',
    caption: 'Six trays, one line, and a room that had to be served between sessions.',
    brief: needsBrief('the Netflix press event'),
    made: 'Passed service between sessions by a team in black.',
    cover: { key: 'netflix-03', alt: 'Six servers holding trays in a line' },
    photos: [],
  },
  {
    slug: 'festival-set-times',
    service: 'brand-launches',
    title: 'A festival, served to set times',
    client: 'Rolling Loud',
    caption: 'Service that had to run to the set times, not the other way round.',
    brief: needsBrief('Rolling Loud'),
    made: 'A long line of counters across the venue.',
    cover: { key: 'rolling-loud-02', alt: 'A very long buffet of covered dishes across a venue' },
    photos: [],
  },
];

export const featuredStories = [
  'jewellery-boutique-evening',
  'wedding-bengaluru',
  'childrens-birthday',
  'study-launch-city-view',
  'night-lit-reveal',
  'wedding-on-the-lawns',
];

export const liveCounters: { title: string; text: string; seen: string; photo: Photo }[] = [
  {
    title: 'Chai and ice cream, outdoors',
    text: 'A pale-wood counter on the lawn, earthen pots along it, running well past dinner.',
    seen: 'Seen at a wedding on the lawns',
    photo: { key: 'bayview-lawns-wedding-01', alt: 'An outdoor chai and ice-cream counter in pale wood' },
  },
  {
    title: 'The live wok',
    text: 'Cooked to order, in front of the queue. Guests watch it happen, then come back for more.',
    seen: 'Seen at a wedding on the lawns',
    photo: { key: 'bayview-lawns-wedding-04', alt: 'A live wok counter at night with cooks working' },
  },
  {
    title: 'The slate pass',
    text: 'Canapés finished with flowers and carried through the room, so guests never have to queue.',
    seen: 'Seen at a jewellery boutique',
    photo: { key: 'cartier-08', alt: 'A server carrying a slate of canapés with flowers' },
  },
  {
    title: 'The brass thali',
    text: 'Brass thalis and printed menus at every setting. A traditional meal, served properly.',
    seen: 'Seen at a wedding in Aurangabad',
    photo: { key: 'aurangabad-wedding-04', alt: 'Brass thalis and printed menus on a red table' },
  },
  {
    title: 'Plated to order',
    text: 'A cook at the counter, finishing every plate by hand while the guest waits.',
    seen: 'Seen at a wedding in Bengaluru',
    photo: { key: 'bangalore-wedding-03', alt: 'A cook lifting noodles onto a plate' },
  },
];

export const dietary = ['Jain', 'Satvik', 'Halal', 'Vegan', 'No onion or garlic', 'Allergies, labelled'];

export const foodGallery: Photo[] = [
  { key: 'cartier-07', alt: 'Tartlets with edible flowers on slate' },
  { key: 'raymond-chairmans-lounge-03', alt: 'Rows of canapés on white trays' },
  { key: 'bangalore-wedding-01', alt: 'Domed yellow desserts on dried beans' },
  { key: 'ninja-03', alt: 'Small pizzas with faces' },
  { key: 'ferrari-02', alt: 'Red burgers on a round board' },
  { key: 'cartier-03', alt: 'Cocktails being built at a bar' },
  { key: 'hublot-01', alt: 'A display of small bites and burgers' },
];

export const founders = {
  quote: 'We’re not just in the business of food. We’re in the business of food and experience.',
  by: 'Amar Jog & Kushal Shetty, founders',
  photo: { key: 'himesh-reshamiya-01', alt: 'The service team in waistcoats, lined up along a red carpet' } as Photo,
};

export const guestRanges = ['Under 50', '50 to 150', '150 to 300', '300 to 600', '600 to 1,000', 'More than 1,000', 'Not sure yet'];
