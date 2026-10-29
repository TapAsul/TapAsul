# TapAsul Website

## Files
- `index.html` — page structure and SEO/social metadata
- `styles.css` — custom styles and accessibility polish
- `script.js` — product selection, price calculator, and 3D previews
- `favicon.svg` — browser tab icon

## Before publishing
1. Replace the commented canonical URL in `index.html` with your real HTTPS domain.
2. Add a real social preview image at `assets/tapasul-social-preview.png` (1200×630 is a good target), or update/remove the `og:image` metadata.
3. Connect the pre-order form to a real backend or form service. It currently validates locally and shows a clear notice; it does not send customer information anywhere.
4. Verify the ₱999 card price, ₱149/month hosting, and ₱899 acrylic price match your actual offer.
5. Test the page on mobile, keyboard navigation, and browsers/devices without WebGL.
6. Consider moving Tailwind from its CDN to a build step before production; the CDN is convenient for prototypes but is not the recommended production setup.

## SEO notes
A favicon and metadata help browsers and social previews, but they do not guarantee search ranking. Search engines also need a publicly accessible site, useful page content, and time to crawl it.
