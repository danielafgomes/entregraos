# Entre Grãos

Static Portuguese and English website for Entre Grãos in Fundão. GitHub Pages serves the checked-in HTML, CSS, JavaScript and local images directly. No package installation, runtime build, remote fonts, analytics or browser storage is required.

## Editing and checking

Portuguese content lives in `index.html`; English translations live in `content/en.json`. Shared presentation and behaviour live in `style.css` and `script.js`. The optional authoring script generates the complete English HTML, including translated metadata, image descriptions and navigation labels. Do not edit `en/index.html` independently.

```sh
node tools/prepare-pages.mjs
node --check script.js
python3 tools/check-site.py
git diff --check
```

To prepare a separate publication checkout while preserving its current production root, pass its `preview/` directory explicitly:

```sh
node tools/prepare-pages.mjs ../entregraos-preview-publication/preview
python3 tools/check-site.py ../entregraos-preview-publication/preview
```

That command copies only the static site into the named `preview/` directory. Both preview languages have `noindex,nofollow,noarchive` and Googlebot `noindex,nofollow`; canonical URLs, search alternates and business structured data are omitted there. Do not publish the source root, robots.txt or sitemap.xml during preview review. Do not block `/preview/` in robots.txt: crawlers need access to read noindex. Noindex is a crawler directive, not authentication.

## Languages and technical foundations

- Portuguese: `/`; English: `/en/`. Each is complete initial HTML and has its own canonical URL. Reciprocal `hreflang` links include `pt-PT`, `en` and Portuguese as `x-default`.
- Language links navigate normally, work without JavaScript and do not redirect based on browser language or previous visits. JavaScript preserves the current section when switching.
- `sitemap.xml` includes only the two future public URLs. The future production `robots.txt` permits crawling and identifies that sitemap.
- `CafeOrCoffeeShop` data uses the confirmed address, telephone, email, social profiles and weekly opening hours. Sunday is explicitly closed. No prices, reviews, ratings or unconfirmed coordinates are asserted.
- Existing WebP images retain intrinsic dimensions; the hero has high fetch priority and lower images load lazily. Fonts are local system fonts.
- The mobile menu supports Escape and closes when focus leaves it. Navigation and language links remain available without JavaScript; the skip link targets a focusable main region.

## Before public launch

1. Review all photographs and replace the explicit temporary brunch placeholder with an approved photograph and accurate alt text.
2. Confirm both languages, business/contact information and any special opening hours. Complete the separate privacy-policy review requested for final launch.
3. Run the commands above; review both URLs on desktop and mobile, keyboard navigation, directions, telephone and social links. Validate the final public business schema with Google's Rich Results Test; passing local checks does not guarantee search enhancements or ranking.
4. Publish the approved source root together with `/en/`, assets, `robots.txt` and `sitemap.xml`, retaining the existing CNAME. Keep any retained `/preview/` pages noindex and out of the sitemap. This is a separate action from preview publication.
5. With the owner's Google Search Console access, verify the domain, submit the sitemap and inspect both live URLs. Do not submit preview URLs.
6. With the owner's Google Business Profile access, review the real business name, address, telephone, opening hours, website link and approved photographs. These account changes are separate from website code.
7. After launch, inspect actual indexing, performance and any crawl errors. Do not promise rankings or manufacture reviews; no paid tools or trackers are required by this project.
