# SEO — cum funcționează și ce mai e de făcut

Notițe pentru site-ul Master Key & Blade. Trei obiective diferite, trei mecanisme
diferite.

| Obiectiv | Ce îl decide de fapt |
|---|---|
| Căutare Google obișnuită | HTML crawlabil, title/description, date structurate, viteză |
| Căutare AI (ChatGPT, Perplexity, AI Overviews) | HTML **static** — crawlerele AI nu execută JavaScript — plus fapte explicite și JSON-LD |
| Google Maps | Profilul Google Business, nu site-ul. Site-ul doar confirmă datele |

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

- [ ] **Setează domeniul real** în `SITE_URL` din [src/business.ts](src/business.ts).
      Din el se generează `canonical`, `og:url`, `sitemap.xml`, `robots.txt` și
      `@id`-urile din JSON-LD. Până atunci toate arată către `masterkeyblade.ro`,
      care poate să nu fie domeniul final.
- [ ] Completează `GEO` cu coordonatele exacte din profilul Google Business
      (Google Maps → click dreapta pe pin → coordonatele).
- [ ] Completează `GBP_URL` cu link-ul de share al profilului (`g.page/…` sau
      `maps.app.goo.gl/…`). Apare automat ca „Vezi-ne pe Google Maps" în secțiunea
      Locație și ca `sameAs` + `hasMap` în JSON-LD — asta leagă site-ul de fișa Maps.
- [ ] Adaugă `PHONE`. Vezi secțiunea 6.
- [ ] Citește răspunsurile din `FAQ` și confirmă că toate sunt corecte. Ele apar
      și ca `FAQPage` în datele structurate, deci trebuie să fie adevărate.

## 4. După lansare

- [ ] Google Search Console: adaugă proprietatea, verifică domeniul, trimite
      `https://domeniu.ro/sitemap.xml`, cere indexare pentru pagina principală.
- [ ] Bing Webmaster Tools: același lucru. Bing alimentează și căutarea din ChatGPT.
- [ ] Testează datele structurate: <https://validator.schema.org> și
      <https://search.google.com/test/rich-results> — trebuie 0 erori.
- [ ] Verifică ce vede un crawler fără JavaScript: `curl https://domeniu.ro` sau
      instrumentul „Inspectare URL" din Search Console.

## 5. Google Maps — aici se câștigă vizibilitatea locală

Site-ul contribuie poate 10% la poziția în Maps. Restul e profilul Google Business,
care este deja revendicat. În ordinea impactului:

1. **Recenzii.** Numărul, prospețimea și răspunsurile la ele sunt cel mai puternic
   factor de ranking local. Cere-i fiecărui client mulțumit o recenzie și răspunde
   la toate, inclusiv la cele negative.
2. **Categorii.** Categorie principală „Locksmith / Cheie", secundară „Sharpening
   service / Serviciu de ascuțire".
3. **NAP identic.** Numele, adresa și programul de pe fișă trebuie să fie
   caracter cu caracter la fel ca pe site: `Master Key & Blade`,
   `Strada Câmpului 17, Cluj-Napoca`, luni–joi 10:00–16:00, vineri 10:00–14:00,
   sâmbătă și duminică închis.
4. **Website.** Adaugă adresa site-ului în profil în ziua în care domeniul e live.
5. **Produse și servicii.** Completează-le cu exact aceleași denumiri și prețuri
   ca pe site (vezi `KEY_PRICES` și `SHARPENING_PRICE`).
6. **Fotografii reale** din atelier, cu mașinile de copiat și polizorul, adăugate
   regulat. Fișele cu poze noi apar mai des în rezultate.
7. **Postări** scurte la fiecare câteva săptămâni (program de sărbători, servicii noi).
8. **Consistență în directoare** (pagini aurii etc.) — aceleași nume, adresă, telefon.

## 6. Ce lipsește încă

**Nu există număr de telefon pe site.** Este cel mai mare gol rămas: un lăcătuș
fără telefon pierde conversii directe, iar Google are un semnal în minus prin care
să lege site-ul de fișa Maps revendicată.

Totul e deja cablat pentru asta — completarea lui `PHONE` în
[src/business.ts](src/business.ts) îl duce automat în JSON-LD. Mai trebuie doar
adăugat un link `tel:` vizibil în header și în secțiunea Locație.

## 7. Ce am evitat intenționat

- **Fără `BreadcrumbList`** pentru ancorele `#chei`, `#ascutire` etc. Google ignoră
  fragmentele în breadcrumb-uri pe o pagină unică și poate genera rezultate ciudate.
- **Fără meta `keywords`** — ignorat de toate motoarele de căutare din 2009.
- **Fără foarfece, foarfeci de croitorie sau lame ceramice** nicăieri în text sau
  în datele structurate. Au fost scoase în commit-ul `66039cb` pentru că atelierul
  nu oferă serviciile astea, iar datele structurate false atrag penalizări.
- **Fără `aggregateRating` inventat.** Rating-urile în JSON-LD trebuie să provină
  din recenzii reale afișate pe pagină; altfel e încălcare directă a ghidurilor Google.
