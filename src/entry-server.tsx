/**
 * Server entry, used only by the prerender step (`vite build --ssr`).
 *
 * It exists for one reason: AI crawlers — GPTBot, ClaudeBot, PerplexityBot and
 * friends — do not execute JavaScript. Without prerendering they fetch this
 * site and see an empty <div id="root">. Everything the page says has to be in
 * the HTML before any script runs.
 */
import { renderToString } from 'react-dom/server';
import App from './App';
import {
  ADDRESS,
  BUSINESS_NAME,
  CURRENCY,
  DOMAIN_LIVE,
  EMAIL,
  GBP_NAME,
  FAQ,
  GBP_URL,
  GEO,
  HOURS,
  KEY_PRICES,
  KEY_SERVICES,
  META_DESCRIPTION,
  PHONE,
  SHARPENING_PRICE,
  SHARPENING_SERVICES,
  SITE_URL,
  SITE_NAME,
} from './business';

/** Drops keys whose value is null/undefined so unknown facts are never guessed. */
function compact<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined),
  ) as T;
}

const BUSINESS_ID = `${SITE_URL}/#business`;

function buildJsonLd() {
  const business = compact({
    '@type': ['Locksmith', 'LocalBusiness'],
    '@id': BUSINESS_ID,
    name: BUSINESS_NAME,
    // The Maps listing is under a different name; declaring it here is what
    // lets Google resolve the two to a single entity.
    alternateName: GBP_NAME !== BUSINESS_NAME ? GBP_NAME : null,
    description: META_DESCRIPTION,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/og-image.png`,
    logo: `${SITE_URL}/apple-touch-icon.png`,
    telephone: PHONE,
    email: EMAIL,
    priceRange: '7–35 RON',
    currenciesAccepted: CURRENCY,
    paymentAccepted: 'Cash',
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.city,
      postalCode: ADDRESS.postalCode,
      addressRegion: ADDRESS.regionShort,
      addressCountry: ADDRESS.country,
    },
    geo: GEO ? { '@type': 'GeoCoordinates', ...GEO } : null,
    hasMap: GBP_URL,
    sameAs: GBP_URL ? [GBP_URL] : null,
    areaServed: {
      '@type': 'City',
      name: ADDRESS.city,
    },
    // Closed days are omitted: in schema.org, absence means closed.
    openingHoursSpecification: HOURS.filter((h) => h.opens && h.closes).map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.schemaDays,
      opens: h.opens,
      closes: h.closes,
    })),
    knowsLanguage: 'ro',
  });

  /** Priced offers are what answer engines quote back at users verbatim. */
  const keyService = {
    '@type': 'Service',
    '@id': `${SITE_URL}/#serviciu-chei`,
    name: 'Copiere chei și cartele de acces',
    serviceType: 'Copiere chei',
    provider: { '@id': BUSINESS_ID },
    areaServed: { '@type': 'City', name: ADDRESS.city },
    description: KEY_SERVICES.join('; '),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Prețuri copiere chei',
      itemListElement: KEY_PRICES.map((row) => ({
        '@type': 'Offer',
        name: row.label,
        description: row.note,
        price: row.priceValue,
        priceCurrency: CURRENCY,
        availability: 'https://schema.org/InStock',
        itemOffered: { '@type': 'Service', name: row.label },
      })),
    },
  };

  const sharpeningService = {
    '@type': 'Service',
    '@id': `${SITE_URL}/#serviciu-ascutire`,
    name: 'Ascuțire cuțite',
    serviceType: 'Ascuțire cuțite',
    provider: { '@id': BUSINESS_ID },
    areaServed: { '@type': 'City', name: ADDRESS.city },
    description: SHARPENING_SERVICES.join('; '),
    offers: {
      '@type': 'Offer',
      name: SHARPENING_PRICE.label,
      priceCurrency: CURRENCY,
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: SHARPENING_PRICE.priceMin,
        maxPrice: SHARPENING_PRICE.priceMax,
        priceCurrency: CURRENCY,
      },
      availability: 'https://schema.org/InStock',
    },
  };

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#intrebari`,
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    alternateName: ['CheiCluj', 'cheicluj.ro'],
    inLanguage: 'ro-RO',
    publisher: { '@id': BUSINESS_ID },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [business, keyService, sharpeningService, faqPage, website],
  };
}

export function render() {
  return {
    html: renderToString(<App />),
    jsonLd: JSON.stringify(buildJsonLd()),
  };
}

export {
  SITE_URL,
  DOMAIN_LIVE,
  BUSINESS_NAME,
  META_DESCRIPTION,
  ADDRESS,
  HOURS,
  KEY_PRICES,
  SHARPENING_PRICE,
  FAQ,
};
