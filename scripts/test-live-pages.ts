async function testPages() {
  const urls = [
    'http://localhost:3005/rechner/gaskostenrechner/',
    'http://localhost:3005/rechner/dienstfahrrad-jobrad-rechner/',
    'http://localhost:3005/rechner/schalungssteine-rechner/',
    'http://localhost:3005/rechner/kapitalertragsteuer-rechner/',
    'http://localhost:3005/rechner/dividendenrendite-rechner/',
  ];

  console.log('Testing rendered pages from Next.js server at http://localhost:3005 ...\n');

  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`URL: ${url} -> Status: ${res.status} ${res.statusText}`);
      if (res.status !== 200) {
        throw new Error(`Failed to load ${url}: status ${res.status}`);
      }
      const html = await fetch(url).then((r) => r.text());

      // Check for raw markdown syntax in HTML
      const hasRawBold = /\*\*[^*]+\*\*/.test(html);
      const hasRawBackticks = /`[^`]+`/.test(html);
      const hasRawMarkdownLinks = /\[[^\]]+\]\(\/[^)]+\)/.test(html);

      if (hasRawBold) {
        console.error(`  [WARN] Found literal '**' in HTML for ${url}`);
      } else {
        console.log(`  [OK] No literal '**' detected in rendered HTML`);
      }

      if (hasRawBackticks) {
        console.error(`  [WARN] Found literal backticks in HTML for ${url}`);
      } else {
        console.log(`  [OK] No literal backticks detected in rendered HTML`);
      }

      if (hasRawMarkdownLinks) {
        console.error(`  [WARN] Found literal markdown link [text](url) in HTML for ${url}`);
      } else {
        console.log(`  [OK] No raw markdown links detected in rendered HTML`);
      }

      // Page-specific assertions
      if (url.includes('gaskostenrechner')) {
        const hasAvg = html.includes('rechnerischen Monatsdurchschnitt') || html.includes('Rechnerischer Monatsdurchschnitt');
        const hasNotice = html.includes('Der Wert ist Jahreskosten ÷ 12. Ihr tatsächlicher Versorgerabschlag kann abweichen');
        console.log(`  [Check] Gas contains Monatsdurchschnitt: ${hasAvg}`);
        console.log(`  [Check] Gas contains Versorgerabschlag notice: ${hasNotice}`);
      }

      if (url.includes('dienstfahrrad-jobrad-rechner')) {
        const hasTaxable = html.includes('8,00') || html.includes('8.00') || html.includes('8 €') || html.includes('8,00 €');
        const hasIndependence = html.includes('RechenHafen steht in keiner Verbindung zu JobRad');
        const hasBmf = html.includes('LStH 2025 Anhang 24 IV Nr. 4') || html.includes('amtliche-handbuecher.bundesfinanzministerium.de');
        console.log(`  [Check] JobRad contains 8,00 € benefit: ${hasTaxable}`);
        console.log(`  [Check] JobRad contains independence note: ${hasIndependence}`);
        console.log(`  [Check] JobRad contains official BMF source: ${hasBmf}`);
      }

      if (url.includes('schalungssteine-rechner')) {
        const hasWallType = html.includes('Mauer-Bauform');
        const hasSafety = html.includes('Der Rechner ermittelt Materialmengen. Er ersetzt keine Statik, Bewehrungsplanung oder Herstellervorgaben.');
        const hasBreakdown = html.includes('Normalsteine') && html.includes('Eck- / Endsteine');
        console.log(`  [Check] Schalungssteine contains Mauer-Bauform: ${hasWallType}`);
        console.log(`  [Check] Schalungssteine contains prominent safety disclaimer: ${hasSafety}`);
        console.log(`  [Check] Schalungssteine contains block breakdown: ${hasBreakdown}`);
      }

      if (url.includes('kapitalertragsteuer-rechner')) {
        const hasValidLink = html.includes('/rechner/dividendenrendite-rechner/');
        const hasOldBrokenLink = html.includes('/rechner/dividenden-rechner/');
        console.log(`  [Check] Kapitalertragsteuer links to dividendenrendite-rechner: ${hasValidLink}`);
        console.log(`  [Check] Kapitalertragsteuer has NO broken dividenden-rechner link: ${!hasOldBrokenLink}`);
      }

      console.log('');
    } catch (err) {
      console.error(`Error testing ${url}:`, err);
    }
  }
}

testPages();
