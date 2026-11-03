# PageSpeed improvements

Report: https://pagespeed.web.dev/analysis/https-cheicluj-ro/25spyudpt3?form_factor=desktop

The desktop report from November 3, 2026 scored 99 performance, 94 accessibility,
100 best practices, and 100 SEO. LCP was 0.5 seconds, TBT 10 ms, and CLS 0.
These are the original report's results, not scores for the changes below.

| Finding | Change and verification |
| --- | --- |
| Low-contrast info labels | Darkened ink-300 from #756C65 to #6F665F. Contrast on paper-200 rises from 4.40:1 to 4.81:1, above the 4.5:1 requirement for small text. |
| Oversized photos | Re-encoded existing WebP photos at quality 75. Full hero: 184,374 → 154,364 bytes; 640px hero: 69,756 → 58,364 bytes. Added 480px (16,948 bytes) and 1024px (59,138 bytes) card-photo variants; corrected sizes to match the content grid. The browser still selects larger variants on high-density screens. |
| Google Maps JavaScript and cache warnings | Mount the embedded map only after the visitor clicks the load-map button. Before clicking, no map iframe is present; after clicking, the same map URL and reserved dimensions are used. The existing direct Google Maps link remains available. Google's cache headers are outside this site's control. |
| llms.txt lacks links | Added Markdown links to the homepage and existing service, location, and FAQ sections. |

Validation: production build and TypeScript check; generated HTML and llms.txt;
browser checks of label colors, responsive image selection, and map activation.
Re-run PageSpeed on both desktop and mobile after deployment to measure updated
scores and timing. Compare repeated runs under the same conditions; no new
Lighthouse score or LCP improvement is claimed from byte savings alone.
