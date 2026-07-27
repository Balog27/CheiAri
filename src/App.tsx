import React from 'react';
import NavBar, { scrollToSection, type SectionId } from './navBar';

// ---------------------------------------------------------------------------
// Shared building blocks

interface SectionProps {
  id: SectionId;
  index: string;
  title: string;
  /** Dark sections break up the page rhythm where there is no photograph. */
  tone?: 'light' | 'dark';
  children: React.ReactNode;
}

/**
 * Two-column editorial section: the heading parks on the left while the
 * content scrolls past it on wide screens, stacks on narrow ones.
 */
const Section: React.FC<SectionProps> = ({ id, index, title, tone = 'light', children }) => {
  const dark = tone === 'dark';

  return (
    <section
      id={id}
      className={`scroll-mt-20 border-t py-20 sm:py-24 lg:py-32 ${
        dark ? 'border-ink bg-ink text-paper' : 'border-ink/10'
      }`}
    >
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-16">
        <header className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-32">
            <p className={`eyebrow ${dark ? 'text-paper/60' : 'text-ink-300'}`}>{index}</p>
            <h2 className="mt-3 text-h2 font-semibold">{title}</h2>
          </div>
        </header>
        <div className="lg:col-span-8 xl:col-span-9 xl:col-start-4">{children}</div>
      </div>
    </section>
  );
};

interface PriceRow {
  label: string;
  note?: string;
  price: string;
}

const PriceList: React.FC<{ rows: PriceRow[] }> = ({ rows }) => (
  <dl className="border-t border-ink/20">
    {rows.map((row) => (
      <div
        key={row.label}
        className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-4"
      >
        <dt>
          {row.label}
          {row.note && <span className="mt-1 block text-sm text-ink-500">{row.note}</span>}
        </dt>
        <dd className="shrink-0 tabular-nums text-ink-700">{row.price}</dd>
      </div>
    ))}
  </dl>
);

const KEY_PRICES: PriceRow[] = [
  { label: 'Cheie standard', note: 'Yale, cilindru simplu', price: '15 lei' },
  { label: 'Cheie cu profil de siguranță', note: 'Cu canal de siguranță', price: '30 lei' },
  { label: 'Cheie de înaltă securitate', note: 'Profil punctat, cap oval', price: '35 lei' },
  { label: 'Cartelă sau tag de proximitate', note: 'Copiere pentru interfon și acces', price: '25 lei' },
];

// ---------------------------------------------------------------------------
// Sections

const Hero: React.FC = () => (
  <section id="hero" className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink">
    <img
      src="/keys%20ai.png"
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover object-center"
    />
    <div
      className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/60"
      aria-hidden="true"
    />

    <div className="shell relative w-full pb-16 pt-32 lg:pb-24">
      <p className="eyebrow text-paper/60">Cluj-Napoca · atelier propriu</p>

      <h1 className="mt-6 max-w-[18ch] text-display font-semibold text-paper">
        Chei tăiate corect, lame ascuțite ca la carte.
      </h1>

      <p className="mt-7 max-w-measure text-lead text-paper/70">
        Copiem chei standard și de înaltă securitate, cartele de acces, și ascuțim cuțite
        pe echipament profesional. Cele mai multe lucrări se fac cât aștepți.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <a
          href="#chei"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('chei');
          }}
          className="bg-paper px-7 py-3.5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-brass-400"
        >
          Vezi serviciile și prețurile
        </a>
        <a
          href="#locatie"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('locatie');
          }}
          className="link text-sm text-paper/80 hover:text-paper"
        >
          Program și adresă
        </a>
      </div>
    </div>
  </section>
);

/** Practical detail strip: the three things a visitor actually looks for. */
const InfoBar: React.FC = () => (
  <div className="border-b border-ink/10 bg-paper-200">
    <dl className="shell grid divide-y divide-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <div className="py-6 sm:pr-8">
        <dt className="eyebrow text-ink-300">Adresă</dt>
        <dd className="mt-2 text-sm text-ink-700">Strada Câmpului 17, Cluj-Napoca</dd>
      </div>
      <div className="py-6 sm:px-8">
        <dt className="eyebrow text-ink-300">Program</dt>
        <dd className="mt-2 text-sm text-ink-700">
          Luni – Joi 10:00–16:00 · Vineri 10:00–14:00
        </dd>
      </div>
      <div className="py-6 sm:pl-8">
        <dt className="eyebrow text-ink-300">Servicii</dt>
        <dd className="mt-2 text-sm text-ink-700">Chei · Cartele de acces · Ascuțire</dd>
      </div>
    </dl>
  </div>
);

const Keys: React.FC = () => (
  <Section id="chei" index="01 / Chei" title="Copiere chei și cartele de acces">
    <p className="max-w-measure text-lead text-ink-700">
      Tăiem după cheia originală pe mașini cu palpator, apoi verificăm fiecare copie în
      cilindru înainte să o predăm. Dacă o cheie nu intră cum trebuie, o refacem pe loc.
    </p>

    <ul className="mt-8 max-w-measure space-y-2.5 text-ink-700">
      {[
        'Chei de apartament, casă, garaj și lacăt',
        'Chei cu profil de siguranță și înaltă securitate',
        'Cartele și tag-uri de proximitate pentru interfon',
      ].map((item) => (
        <li key={item} className="flex gap-3.5">
          <span className="mt-[0.6em] h-px w-4 shrink-0 bg-brass" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>

    <figure className="mt-14">
      <img
        src="/organizatorChei.png"
        alt="Cartele și tag-uri de proximitate în mai multe culori"
        loading="lazy"
        decoding="async"
        className="aspect-[16/9] w-full object-cover"
      />
      <figcaption className="mt-3 text-sm text-ink-500">
        Tag-uri și cartele de proximitate, copiate în câteva minute.
      </figcaption>
    </figure>

    <h3 className="mt-16 text-h3 font-semibold">Prețuri</h3>
    <div className="mt-6 max-w-2xl">
      <PriceList rows={KEY_PRICES} />
      <p className="mt-4 text-sm text-ink-500">
        Prețul final depinde de profilul cheii. Îl confirmăm înainte de a începe lucrarea.
      </p>
    </div>
  </Section>
);

const Sharpening: React.FC = () => (
  <Section id="ascutire" index="02 / Ascuțire" title="Ascuțire cuțite" tone="dark">
    <p className="max-w-measure text-lead text-paper/75">
      Un cuțit tocit alunecă și taie mâna, nu alimentul. Refacem unghiul original al
      tăișului pe polizor cu apă, ca să nu ardem oțelul, și finisăm manual pe piatră.
    </p>

    <h3 className="eyebrow mt-14 text-paper/60">Ce ascuțim</h3>
    {/* Dividers only, so the list has no closing rule to collide with the
        price block's top rule below. */}
    <ul className="mt-5 divide-y divide-paper/15 border-t border-paper/25">
      {['Cuțite de bucătărie, din oțel', 'Satâre și cuțite de măcelărie'].map((item) => (
        <li key={item} className="py-4 text-paper/85">
          {item}
        </li>
      ))}
    </ul>

    {/* The price carries the visual weight the photograph used to. */}
    <div className="mt-14 border-t border-paper/25 pt-8">
      <p className="eyebrow text-paper/60">Preț</p>
      <p className="mt-4 text-display font-semibold tabular-nums">7 – 12 lei</p>
      <p className="mt-4 max-w-measure text-sm text-paper/60">
        Per lamă, în funcție de tip și dimensiune. Lamele foarte deteriorate se evaluează
        separat, după ce le vedem.
      </p>
    </div>
  </Section>
);

const Location: React.FC = () => (
  <Section id="locatie" index="03 / Locație" title="Unde ne găsești">
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <dl className="space-y-8">
        <div>
          <dt className="eyebrow text-ink-300">Adresă</dt>
          <dd className="mt-2.5 text-lead">
            Strada Câmpului 17
            <br />
            Cluj-Napoca, județul Cluj
          </dd>
        </div>

        <div>
          <dt className="eyebrow text-ink-300">Program</dt>
          <dd className="mt-3 border-t border-ink/20">
            {[
              ['Luni – Joi', '10:00 – 16:00'],
              ['Vineri', '10:00 – 14:00'],
              ['Sâmbătă – Duminică', 'Închis'],
            ].map(([days, hours]) => (
              <div
                key={days}
                className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-3"
              >
                <span className="text-ink-700">{days}</span>
                <span className="tabular-nums text-ink-500">{hours}</span>
              </div>
            ))}
          </dd>
        </div>
      </dl>

      <div className="border border-ink/15">
        <iframe
          src="https://www.google.com/maps?q=Strada+C%C3%A2mpului+17,+Cluj-Napoca&output=embed"
          title="Harta către Strada Câmpului 17, Cluj-Napoca"
          loading="lazy"
          className="block h-[320px] w-full lg:h-full lg:min-h-[420px]"
          style={{ border: 0 }}
        />
      </div>
    </div>
  </Section>
);

const Footer: React.FC = () => (
  <footer className="border-t border-ink/10 bg-ink text-paper">
    <div className="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[0.8125rem] font-semibold tracking-[0.22em]">
        MASTER KEY <span className="font-normal text-brass-400">&amp; BLADE</span>
      </p>
      <div className="text-sm text-paper/60 sm:text-right">
        <p>© {new Date().getFullYear()} Master Key &amp; Blade · Strada Câmpului 17, Cluj-Napoca</p>
        <p className="mt-1.5">Creat de David Balog</p>
      </div>
    </div>
  </footer>
);

// ---------------------------------------------------------------------------

const App: React.FC = () => (
  <>
    <NavBar />
    <main>
      <Hero />
      <InfoBar />
      <Keys />
      <Sharpening />
      <Location />
    </main>
    <Footer />
  </>
);

export default App;
