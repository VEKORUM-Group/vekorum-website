# VEKORUM Website

A responsive, single-page corporate website built from the approved VEKORUM Brand Book.

## Preview

Open `index.html` directly, or serve the folder with any static web server.

## Production setup

The project is configured for Netlify. Deploy the repository with `netlify.toml`; Netlify will detect and store submissions from the `contact` form.

Before launch:

1. Point `vekorum.com` to the deployed site and enable HTTPS.
2. Add the Google Analytics measurement ID and optional error collection endpoint in `config.js`.
3. Replace the flagged company-registration placeholders in the legal pages.
4. Confirm `info@vekorum.com` receives Netlify form notifications.
5. Replace the raster logo with the designer-supplied official SVG when available.

Run `python scripts/audit.py` to check page titles, duplicate IDs, image alternatives, and internal links.
