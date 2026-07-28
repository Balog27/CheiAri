# SEO — cum funcționează și ce mai e de făcut

Notițe pentru site-ul Master Key & Blade. Trei obiective diferite, trei mecanisme
diferite.

| Obiectiv | Ce îl decide de fapt |
|---|---|
| Căutare Google obișnuită | HTML crawlabil, title/description, date structurate, viteză |
| Căutare AI (ChatGPT, Perplexity, AI Overviews) | HTML **static** — crawlerele AI nu execută JavaScript — plus fapte explicite și JSON-LD |
| Google Maps | Fișa Google Business, nu site-ul. Site-ul doar confirmă datele. **Fișa este momentan nerevendicată — vezi secțiunea 5** |

---

## 1. O singură sursă de adevăr: `src/business.ts`

Adresa, programul, prețurile, serviciile și întrebările frecvente sunt definite
**o singură dată**, în [src/business.ts](src/business.ts). De acolo le citesc:

- pagina ([src/App.tsx](src/App.tsx), [src/navBar.tsx](src/navBar.tsx));
- datele structurate JSON-LD ([src/entry-server.tsx](src/entry-server.tsx));
- `llms.txt` ([scripts/prerender.mjs](scripts/prerender.mjs)).

Google penalizează datele structurate care contrazic textul vizibil, deci acestea
nu trebuie editate niciodată separat. **Orice modificare de preț sau program se
face doar în `business.ts`.**

Câmpurile `PHONE`, `EMAIL`, `GEO` și `GBP_URL` sunt `null` intenționat: generatorul
de JSON-LD omite complet câmpurile necunoscute, în loc să inventeze. O adresă sau
un telefon greșit strică mai mult decât unul lipsă.

## 2. Prerendering — de ce există

Site-ul era 100% randat în browser: un crawler care nu rulează JavaScript vedea un
`<div id="root"></div>` gol. GPTBot, ClaudeBot și PerplexityBot **nu** rulează
JavaScript, deci pentru ele site-ul era, practic, o pagină goală.

`npm run build` face acum patru pași:

1. `tsc` — verificare de tipuri;
2. `vite build` — bundle-ul pentru browser;
3. `vite build --ssr src/entry-server.tsx --outDir dist-ssr` — același UI, randat pe server;
4. `node scripts/prerender.mjs` — injectează HTML-ul randat, JSON-LD, `canonical` și
   `og:url` în `dist/index.html`, apoi scrie `robots.txt`, `sitemap.xml` și `llms.txt`.

`dist/index.html` conține acum tot textul paginii. `src/main.tsx` face *hydrate*
când găsește markup și *mount* normal când nu (adică la `npm run dev`).

Verificare rapidă după build:

```powershell
Select-String -Path dist/index.html -Pattern 'Copiere chei'
```

Dacă asta nu returnează nimic, prerenderingul e stricat și căutarea AI nu mai
funcționează.

## 3. Înainte de lansare — obligatoriu

- [ ] **Setează domeniul real** în `SITE_URL` din [src/business.ts](src/business.ts)
      și apoi **pune `DOMAIN_LIVE = true`**. Din `SITE_URL` se generează `canonical`,
      `og:url`, `sitemap.xml`, `robots.txt` și `@id`-urile din JSON-LD.

      Cât timp `DOMAIN_LIVE` este `false`, build-ul marchează pagina `noindex` și
      nu emite deloc `canonical`. Asta e intenționat: site-ul e accesibil pe un URL
      temporar `*.vercel.app`, iar un `canonical` către un domeniu care încă nu
      există ar scoate pagina complet din indexul Google. Build-ul avertizează la
      fiecare rulare până e schimbat.
- [ ] Citește răspunsurile din `FAQ` și confirmă că toate sunt corecte. Ele apar
      și ca `FAQPage` în datele structurate, deci trebuie să fie adevărate.
- [ ] Decide dacă adaugi `PHONE`. Vezi secțiunea 6.

Deja completate din fișa Google Maps: `GEO` (46.7587875, 23.5627455), `GBP_URL`
(link stabil prin CID), `postalCode` (400000) și `GBP_NAME`.

## 4. După lansare

- [ ] Google Search Console: adaugă proprietatea, verifică domeniul, trimite
      `https://domeniu.ro/sitemap.xml`, cere indexare pentru pagina principală.
- [ ] Bing Webmaster Tools: același lucru. Bing alimentează și căutarea din ChatGPT.
- [ ] Testează datele structurate: <https://validator.schema.org> și
      <https://search.google.com/test/rich-results> — trebuie 0 erori.
- [ ] Verifică ce vede un crawler fără JavaScript: `curl https://domeniu.ro` sau
      instrumentul „Inspectare URL" din Search Console.

## 5. Google Maps — aici se câștigă vizibilitatea locală

Site-ul contribuie poate 10% la poziția în Maps. Restul e fișa Google Business.

**Starea reală a fișei** (verificată pe
<https://maps.google.com/?cid=12135351068986744835>):

| | |
|---|---|
| Nume | `Copiat chei` — **nu** `Master Key & Blade` |
| Categorie | `Servicii de duplicare chei` |
| Adresă | `Strada Câmpului 17, 400000 Cluj-Napoca`, „Aflat în: Kaufland" |
| Recenzii | 9, cu medie ~4,5 |
| Telefon | niciunul |
| Stare | **nerevendicată** — fișa afișează „Revendică această compania" |

### 5.1 Revendică fișa. Acum.

Este de departe cea mai importantă acțiune din tot documentul, e gratuită, și fără
ea restul listei nu se poate face deloc: pe o fișă nerevendicată nu poți schimba
numele, nu poți adăuga programul sau serviciile, nu poți răspunde la recenzii și
nu poți lega site-ul.

Există deja 9 recenzii și un rating bun — capital care momentan nu e controlat
de nimeni. Mergi pe fișă → „Revendică această companie" → verificare (de obicei
carte poștală sau telefon).

### 5.2 După revendicare, în ordinea impactului

1. **Recenzii.** Numărul, prospețimea și răspunsurile sunt cel mai puternic factor
   de ranking local. Răspunde la toate cele 9 existente, apoi cere constant altele.
2. **Numele.** Fișa e „Copiat chei", site-ul e „Master Key & Blade". Google leagă
   entitățile prin nume + adresă, deci diferența slăbește legătura. Ori redenumești
   fișa în `Master Key & Blade`, ori accepți diferența — în JSON-LD am declarat deja
   `alternateName: "Copiat chei"`, ceea ce ajută, dar nu înlocuiește o potrivire reală.
3. **Categorii.** Principală „Locksmith / Lăcătuș" sau păstrează „Servicii de
   duplicare chei"; adaugă secundară pentru ascuțire — altfel serviciul de ascuțire
   e practic invizibil în Maps.
4. **Program.** Adaugă-l pe fișă exact ca pe site: luni–joi 10:00–16:00,
   vineri 10:00–14:00, sâmbătă și duminică închis.
5. **Website.** Adaugă adresa site-ului în ziua în care domeniul e live.
6. **Produse și servicii** cu aceleași denumiri și prețuri ca pe site
   (vezi `KEY_PRICES` și `SHARPENING_PRICE`).
7. **Fotografii reale** din atelier, adăugate regulat.
8. **Postări** scurte la câteva săptămâni.
9. **Consistență în directoare** (pagini aurii etc.) — aceleași date.

### 5.3 De discutat: „Aflat în: Kaufland"

Fișa spune că atelierul e în incinta unui Kaufland. Site-ul nu menționează asta
nicăieri, deși e exact genul de detaliu după care caută oamenii („copiat chei
Kaufland Cluj") și care ajută pe cineva să găsească efectiv intrarea. Merită
adăugat în secțiunea Locație, dacă e corect.

## 6. Telefonul — ce contează și ce nu

Nu există număr de telefon nici pe site, nici pe fișa Maps. Ca să fim exacți despre
ce înseamnă asta:

- **Pentru poziția în căutarea Google: nu contează.** Un număr de telefon pe pagină
  nu a fost niciodată factor de ranking.
- **Pentru poziția în Maps: aproape deloc.** Acolo contează fișa, iar fișa se
  clasează pe recenzii, categorii și completitudine — nu pe existența unui telefon.
- **Pentru căutarea AI: contează puțin.** Când cineva întreabă ChatGPT „cum
  contactez un lăcătuș în Cluj", modelul poate cita adresa, programul și prețurile,
  dar nu are ce răspunde la întrebarea de contact.
- **Pentru conversii: contează cel mai mult** — și asta nu e SEO. Cine s-a
  încuiat pe dinafară vrea să sune, nu să citească programul.

Deci e o decizie de business, nu una de vizibilitate. Dacă se adaugă vreodată:
completarea lui `PHONE` în [src/business.ts](src/business.ts) îl duce automat în
JSON-LD; mai trebuie doar un link `tel:` vizibil în header și în secțiunea Locație.

## 7. Ce am evitat intenționat

- **Fără `BreadcrumbList`** pentru ancorele `#chei`, `#ascutire` etc. Google ignoră
  fragmentele în breadcrumb-uri pe o pagină unică și poate genera rezultate ciudate.
- **Fără meta `keywords`** — ignorat de toate motoarele de căutare din 2009.
- **Fără foarfece, foarfeci de croitorie sau lame ceramice** nicăieri în text sau
  în datele structurate. Au fost scoase în commit-ul `66039cb` pentru că atelierul
  nu oferă serviciile astea, iar datele structurate false atrag penalizări.
- **Fără `aggregateRating` inventat.** Rating-urile în JSON-LD trebuie să provină
  din recenzii reale afișate pe pagină; altfel e încălcare directă a ghidurilor Google.
