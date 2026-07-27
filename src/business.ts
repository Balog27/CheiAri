/**
 * Single source of truth for everything the business says about itself.
 *
 * The page, the JSON-LD, the sitemap and llms.txt all read from here. Google
 * penalises structured data that disagrees with visible content, so the two
 * must never be edited separately.
 *
 * Fields that are `null` are unknown, not empty: the JSON-LD builder omits them
 * entirely rather than emitting a guess. A wrong phone number or coordinate is
 * worse for local ranking than a missing one.
 */

/** No trailing slash. Every absolute URL on the site is built from this. */
// TODO: confirm the real domain at launch — canonical, og:url, sitemap and the
// JSON-LD @id all derive from it, and they are wrong until this is right.
export const SITE_URL = 'https://masterkeyblade.ro';

export const BUSINESS_NAME = 'Master Key & Blade';

export const ADDRESS = {
  street: 'Strada Câmpului 17',
  city: 'Cluj-Napoca',
  /** As printed on the page. */
  region: 'județul Cluj',
  /** Bare county name — what schema.org's addressRegion expects. */
  regionShort: 'Cluj',
  /** ISO 3166-1 alpha-2, for schema.org. */
  country: 'RO',
} as const;

/** Human-readable one-liner, used in the InfoBar and the footer. */
export const ADDRESS_LINE = `${ADDRESS.street}, ${ADDRESS.city}`;

/** TODO: paste the exact coordinates from the claimed Google Business Profile. */
export const GEO: { latitude: number; longitude: number } | null = null;

/** TODO: the profile's share link (g.page/… or maps.app.goo.gl/…). Ties site ↔ listing. */
export const GBP_URL: string | null = null;

/** TODO: add when the owner is ready — see the note at the bottom of SEO.md. */
export const PHONE: string | null = null;

export const EMAIL: string | null = null;

export interface OpeningHours {
  /** As printed on the page. */
  days: string;
  /** As printed on the page — "Închis" when shut. */
  hours: string;
  /** schema.org dayOfWeek values; empty when closed. */
  schemaDays: string[];
  opens?: string;
  closes?: string;
}

export const HOURS: OpeningHours[] = [
  {
    days: 'Luni – Joi',
    hours: '10:00 – 16:00',
    schemaDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    opens: '10:00',
    closes: '16:00',
  },
  {
    days: 'Vineri',
    hours: '10:00 – 14:00',
    schemaDays: ['Friday'],
    opens: '10:00',
    closes: '14:00',
  },
  {
    days: 'Sâmbătă – Duminică',
    hours: 'Închis',
    schemaDays: ['Saturday', 'Sunday'],
  },
];

/** Condensed form for the InfoBar and the mobile nav panel. */
export const HOURS_SUMMARY = 'Luni – Joi 10:00–16:00 · Vineri 10:00–14:00';

export interface PriceRow {
  label: string;
  note?: string;
  /** As printed on the page. */
  price: string;
  /** Numeric value for schema.org Offer; a range uses `priceMin`/`priceMax`. */
  priceValue?: number;
  priceMin?: number;
  priceMax?: number;
}

export const CURRENCY = 'RON';

export const KEY_PRICES: PriceRow[] = [
  { label: 'Cheie standard', note: 'Yale, cilindru simplu', price: '15 lei', priceValue: 15 },
  {
    label: 'Cheie cu profil de siguranță',
    note: 'Cu canal de siguranță',
    price: '30 lei',
    priceValue: 30,
  },
  {
    label: 'Cheie de înaltă securitate',
    note: 'Profil punctat, cap oval',
    price: '35 lei',
    priceValue: 35,
  },
  {
    label: 'Cartelă sau tag de proximitate',
    note: 'Copiere pentru interfon și acces',
    price: '25 lei',
    priceValue: 25,
  },
];

export const SHARPENING_PRICE = {
  label: 'Ascuțire lamă',
  price: '7 – 12 lei',
  priceMin: 7,
  priceMax: 12,
};

/**
 * What the workshop actually does. Commit 66039cb removed scissors, tailoring
 * shears and ceramic knives as false claims — do not reintroduce them here or
 * anywhere else on the site.
 */
export const KEY_SERVICES = [
  'Chei de apartament, casă, garaj și lacăt',
  'Chei cu profil de siguranță și înaltă securitate',
  'Cartele și tag-uri de proximitate pentru interfon',
];

export const SHARPENING_SERVICES = ['Cuțite de bucătărie, din oțel', 'Satâre și cuțite de măcelărie'];

/**
 * Answer-engine fodder. Every answer restates a fact already visible elsewhere
 * on the page — schema.org FAQPage must not introduce claims the page doesn't
 * make. Mirrored into JSON-LD by entry-server.tsx.
 */
export const FAQ: { question: string; answer: string }[] = [
  {
    question: 'Cât durează copierea unei chei?',
    answer:
      'Cele mai multe chei se taie cât aștepți, în câteva minute. Tăiem după cheia originală pe mașini cu palpator și verificăm fiecare copie în cilindru înainte să o predăm.',
  },
  {
    question: 'Copiați chei de înaltă securitate și cartele de interfon?',
    answer:
      'Da. Copiem chei standard, chei cu profil de siguranță, chei de înaltă securitate cu profil punctat, precum și cartele și tag-uri de proximitate pentru interfon și control acces.',
  },
  {
    question: 'Cât costă o cheie la Cluj-Napoca?',
    answer:
      'O cheie standard costă 15 lei, o cheie cu profil de siguranță 30 lei, o cheie de înaltă securitate 35 lei, iar o cartelă sau un tag de proximitate 25 lei. Prețul final depinde de profilul cheii și îl confirmăm înainte de a începe lucrarea.',
  },
  {
    question: 'Ce cuțite ascuțiți și cât costă?',
    answer:
      'Ascuțim cuțite de bucătărie din oțel, satâre și cuțite de măcelărie. Prețul este între 7 și 12 lei per lamă, în funcție de tip și dimensiune. Lamele foarte deteriorate se evaluează separat, după ce le vedem.',
  },
  {
    question: 'Cum ascuțiți lamele?',
    answer:
      'Refacem unghiul original al tăișului pe polizor cu apă, ca să nu ardem oțelul, și finisăm manual pe piatră.',
  },
  {
    question: 'Unde se află atelierul și care este programul?',
    answer:
      'Atelierul este pe Strada Câmpului 17, în Cluj-Napoca, județul Cluj. Programul este luni – joi între 10:00 și 16:00 și vineri între 10:00 și 14:00. Sâmbăta și duminica este închis.',
  },
  {
    question: 'Este nevoie de programare?',
    answer:
      'Nu. Ne puteți vizita direct în program, iar cele mai multe lucrări se fac cât așteptați.',
  },
];

/** Used in meta description, og:description and llms.txt so they never drift. */
export const META_DESCRIPTION =
  'Atelier în Cluj-Napoca: copiere chei standard și de înaltă securitate, cartele și tag-uri de proximitate, ascuțire profesională de cuțite. Strada Câmpului 17.';

export const PAGE_TITLE = `${BUSINESS_NAME} | Copiere chei și ascuțire cuțite în Cluj-Napoca`;
