import React, { useEffect, useState } from 'react';

export type SectionId = 'hero' | 'chei' | 'ascutire' | 'contact';

export const NAV_ITEMS: ReadonlyArray<{ id: SectionId; label: string }> = [
  { id: 'chei', label: 'Chei' },
  { id: 'ascutire', label: 'Ascuțire' },
  { id: 'contact', label: 'Contact' },
];

/** Height of the fixed header, so anchored sections don't land under it. */
const HEADER_OFFSET = 80;

export function scrollToSection(id: SectionId) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
}

/** Marks the section currently crossing the middle of the viewport. */
function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>('hero');

  useEffect(() => {
    const targets = (['hero', ...NAV_ITEMS.map((i) => i.id)] as SectionId[])
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).pop();
        if (hit) setActive(hit.target.id as SectionId);
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return active;
}

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Freeze the page behind the mobile panel.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: SectionId) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(id);
  };

  // Transparent over the hero photo, solid once the page moves.
  const onDark = !scrolled && !open;

  return (
    <>
      <a
        href="#chei"
        onClick={go('chei')}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Sari la conținut
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          onDark
            ? 'border-transparent bg-transparent'
            : 'border-ink/10 bg-paper/85 backdrop-blur-md'
        }`}
      >
        <div className="shell flex h-16 items-center justify-between lg:h-20">
          <a
            href="#hero"
            onClick={go('hero')}
            className={`text-[0.8125rem] font-semibold tracking-[0.22em] transition-colors duration-300 ${
              onDark ? 'text-paper' : 'text-ink'
            }`}
          >
            MASTER KEY{' '}
            <span className={`font-normal ${onDark ? 'text-brass-400' : 'text-brass'}`}>
              &amp; BLADE
            </span>
          </a>

          <nav className="hidden items-center gap-10 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={go(item.id)}
                aria-current={active === item.id ? 'true' : undefined}
                className={`relative py-1 text-sm transition-colors duration-200 ${
                  onDark
                    ? 'text-paper/80 hover:text-paper'
                    : active === item.id
                      ? 'text-ink'
                      : 'text-ink-500 hover:text-ink'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current transition-transform duration-300 ease-out ${
                    active === item.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={`-mr-2 flex h-10 w-10 items-center justify-center md:hidden ${
              open || !onDark ? 'text-ink' : 'text-paper'
            }`}
          >
            <span className="sr-only">{open ? 'Închide meniul' : 'Deschide meniul'}</span>
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ease-out ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ease-out ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile panel: full sheet, list of large targets. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 bg-paper pt-16 md:hidden"
      >
        <nav className="shell flex flex-col pt-8">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={go(item.id)}
              className="flex items-baseline gap-4 border-b border-ink/10 py-5 text-h3 text-ink"
            >
              <span className="eyebrow text-ink-300">0{i + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="shell mt-10 space-y-1 text-sm text-ink-500">
          <p className="text-ink">Strada Câmpului 17, Cluj-Napoca</p>
          <p>Luni – Joi 10:00–16:00 · Vineri 10:00–14:00</p>
        </div>
      </div>
    </>
  );
}
