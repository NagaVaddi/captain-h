# Captain H — Landing Page

A free, community fitness & nutrition consultation landing page for Captain H (Al Ain, UAE). Single page, static HTML/CSS/JS — no build step, no backend. Every "lead" is a WhatsApp message to **+971 50 335 8824**.

## Structure

```
website/
  index.html            The landing page (hero, challenge, about, FAQ, contact, footer — all one page, anchor-linked)
  privacy.html            Privacy policy
  terms.html               Terms of use
  assets/
    css/styles.css        Single shared stylesheet (design tokens, components, animations)
    js/main.js              Scroll-reveal, counters, accordion, WhatsApp lead-form logic
    images/logo.jpeg        Captain H logo
  sitemap.xml, robots.txt
```

## Why one page

Per the landing-page spec this site follows: one goal (get a free consultation), one repeated CTA (WhatsApp), no navigation menu that leaks visitors elsewhere. The header only shows the logo and the WhatsApp button; "About" and "Contact" are sections on the same page (`#about`, `#contact`), not separate pages.

## How leads work (no backend needed)

The Contact section's form does **not** submit anywhere or store data. `main.js` reads the field values, builds a pre-filled WhatsApp message, and opens `https://wa.me/971503358824?text=...` in a new tab. Every WhatsApp button on the page (hero, sticky mobile bar, challenge section, final CTA) links the same way.

## Before you launch

1. **Domain**: replace `https://captainh.ae` throughout (meta tags, canonical link, `sitemap.xml`, JSON-LD) with your real domain once you have one.
2. **Real photo**: the `#about` section currently shows the logo as a placeholder. Swap in a real photo of Captain H once available.
3. **Challenge poster/banner**: drop the official poster/banner images into `assets/images/` and reference them directly in the `#challenge` section if you'd rather show the real graphic — it carries the real registration QR codes, which this build can't recreate.
4. **Testimonials**: the page currently shows placeholder "send yours via WhatsApp" cards — replace with real testimonials as they come in. Do not fabricate reviews or stats (Meta ad policy + trust).
5. **Analytics / Meta Pixel**: none is installed yet. `main.js` already has a no-op hook (`fbq`/`gtag` on WhatsApp clicks) ready for when you add the Pixel/GA4 snippet in `<head>`.

## Hosting

Any static host works — Netlify, Vercel, GitHub Pages, or a plain web server. No build command; just upload/point the host at this `website/` folder, `index.html` as the entry point.

## Local preview

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000/`.
