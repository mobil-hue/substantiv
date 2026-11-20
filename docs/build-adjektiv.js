// Bygger docs/adjektiv-jukselapp.pdf (A4 liggende). Kjør: node docs/build-adjektiv.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage();
  await pg.goto('file://' + path.join(__dirname, 'adjektiv-jukselapp.html')); await pg.waitForTimeout(400);
  await pg.pdf({ path: path.join(__dirname, 'adjektiv-jukselapp.pdf'), preferCSSPageSize: true, printBackground: true });
  await b.close();
})();
