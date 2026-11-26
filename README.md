# TicoLab

Landmark-based addresses for Costa Rica (*dirección a la tica*): click a point on the map and get the address as a
chofer, a courier or the post office would want it, plus a printable label.

**Live:** https://ticolab.systematicalabs.com

This repository holds only the published page (`site/`). GitHub Pages deploys it with
`.github/workflows/pages.yml`, which writes `site/config.js` from the repository variable `TICO_API_URL`, the address
of the API the page calls. The API (a Hugging Face Space) and its data are maintained separately.

Map data © OpenStreetMap contributors (ODbL). Landmarks also from INEC Costa Rica.
