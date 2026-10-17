# Foodbiz v2: "Warm Linen & Burnished Copper" (light editorial version)

The chosen direction. The two earlier versions (the Atelier and the dark avant-garde build) have been removed;
this is the only codebase. Photos are generated from the handover pack (`../Foodbiz-website-rework-pack`).

## The idea in two sentences
A printed menu card brought to life: warm linen paper, deep navy ink, one copper accent, and real event
photographs mounted on white paper. Motion is weighted and physical (letterpress rises, paper tilting in sunlight),
never decorative.

## Palette and type
- Linen `#F5F1EB`, alabaster paper `#FAF7F2`, white card `#FFFFFF` with stone hairline `#E5DFD5`.
- Navy ink `#0B1C2D` for text; copper `#B87333` for marks and arrows; copper ink `#8A4F1F` for small copper text
  (4.5:1 on linen); slate `#46525E` for secondary text. The footer is navy.
- Instrument Serif (display, one italic copper word per heading), IBM Plex Mono (metadata), Manrope (body).

## The page (real content only)
1. **Header:** frosted linen glass, 64px phone / 80px desktop, navy wordmark with the copper slash.
2. **Hero:** full-bleed daylight photo (the Cartier tartlets). The navy headline sits on the pale wall of the frame
   and rises word by word out of hairline slits (45ms apart, `cubic-bezier(0.2, 0.7, 0.1, 1)`). Coordinates badge,
   solid navy CTA. On phones the photo sits below the type, so the type is always on clean linen.
3. **Services: the banqueting folios** (`sections/BespokeFolios.tsx`). The four services are clothbound volumes
   standing on an oak credenza with a brass hairline: crimson, aubergine, obsidian navy and forest charcoal cloth with
   a woven texture and embossed foil lettering.
   - Hover: the volume lifts (−24px, translateZ 40px) and turns toward the pointer on springs; a foil glint follows
     the cursor; its cast shadow spreads, softens and fades.
   - Click: the volume flies forward (shared layout) and a deckle-edged paper sheet unfolds beside it with the brief,
     a feathered photo, and the first three run-sheet steps. "Explore … in full" unfolds the rest of the run sheet,
     the formats and the promise in place. "Plan this event" pre-fills the brief form.
   - Esc, the backdrop or Close slides the volume back to its slot and returns focus to it. The page scroll is
     locked without layout shift while it is open. The sheet renders in a portal so it sits above everything.
   - Phones: a snap rail of covers; tapping opens a bottom sheet with a torn top edge, dragged away from its handle.
4. **Watermark marquee:** pinned (sticky) behind the folios in 7% navy ink. Scroll velocity surges and skews it;
   scrolling up reverses it.
5. **The Live Pass: plate lift & chef's docket.** The five real stations on a native, touch-first snap rail
   (copper arrow buttons and a progress hairline for mouse users; dietary badges below).
   - On hover or keyboard focus, a card lifts on a spring (y −18px, scale 1.025; stiffness 240, damping 20, mass 0.8).
   - Its shadow deepens to the soft ambient shadow, the photo eases to 1.04× over 800ms, and a 45° copper gleam
     sweeps the white frame over 750ms.
   - A frosted alabaster docket with a copper hairline slides up. It shows the station number · Live pass, the title
     in serif, the service note, where it was seen, and a "Dietary needs labelled" pill.
   - On touch screens a tap toggles the docket; tapping outside, Escape or scrolling the rail closes it.
   - The pill says "Dietary needs labelled", not a per-station "Jain · Vegan option". The site already states
     dietary needs are carried through every counter, but per-station dietary claims are not in the pack.
6. **Founders:** the floor-team photo on paper (slow parallax), the founders' line in navy italic.
7. **Selected work:** the four requested stories in an editorial spread (four sizes, four offsets). A click morphs
   the photo into a full-bleed dossier (FLIP, no reload); Esc returns it.
8. **Plan your event:** paper form (17px inputs), validation summary, live navy brief sheet, "Copy my brief".
9. **Footer:** navy, four columns, `[NEEDS CLIENT]` contacts, copyright.
- **The house arrow:** a copper hairline that lengthens from 1.1em to 1.6em on hover, used everywhere.

## Anti-AI ban list, applied
No particles, canvas, glow orbs, neon or custom cursor (the page has zero canvas elements). No repeating
three-card grids. Body text is left-aligned with set line lengths. None of the banned phrases. No mini-games.

## Flags for review
- **Marquee words** are as requested: "Foodbiz · Haute gastronomy · Bombay · Weddings · Cartier · The live pass".
  - "Cartier" is a client name: fine on a review build, but it needs Foodbiz's written OK before launch.
  - "Haute gastronomy" is close to the voice guide's banned "gourmet (as a boast)".
  - The client says "Mumbai" everywhere else.
  - All three are one-line changes in `src/lib/avant.ts`.
- **Station names:** the prompt's "Chai Pavilion" and "Cartier Slate Pass" stay "Chai and ice cream, outdoors" and
  "The slate pass": "pavilion" isn't in the photos, and the client name is kept off the counter names.
- **Folio copy changes from the prompt:**
  - "live artisan counters" → "live counters" ("artisanal" is banned in VOICE.md).
  - "heritage family recipes" → "the family recipes that have to be there" (heritage shows through the food, not the word).
  - "live spectacles" → "live events".
  - "executive galas" → "corporate functions".
  - "Explore … in full" opens the full content inside the volume, because this single-page version has no service pages.
- **Copy:** the founders' lines from the brief are used verbatim (hero subline, weddings, launches, corporate).
- Story client names come from the photo folders and are flagged on every dossier.

## Images
Real client frames only (`src/assets/img`, from `05-assets/images` via `scripts/process-images.mjs`). No AI images.

## [NEEDS CLIENT]
Phone, WhatsApp, enquiry email, address, Instagram handle; the brief for each story; permission to name clients;
which event the glasshouse dessert table was; founder bios; confirmation of the dietary list; legal review.

## Not done / to check
- Not tested on real phones (tested in headless Chrome at 360×740 @2x and 1440×900). PageSpeed not run; not deployed.

## Run
```
npm ci
npm run build && npm start   # port 3000 by default (this session ran it on 3300)
```
