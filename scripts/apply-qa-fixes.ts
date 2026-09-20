import fs from 'fs';
import path from 'path';

// 1. Fix bauenGeometrie.ts
const bgPath = path.join(__dirname, '../src/data/calculators/extra/bauenGeometrie.ts');
let bgContent = fs.readFileSync(bgPath, 'utf8');

// Fix daemmung-u-wert-rechner
bgContent = bgContent.replace(
  `const lambda = Number(inputs.wlg) / 1000;
      // R_se + R_si ca. 0.17 (Wand), R_daemm = d / lambda
      const rThermal = 0.17 + (tM / lambda);`,
  `const lambda = (Number(inputs.wlg) || 35) / 1000;
      // R_se + R_si ca. 0.17 (Wand), R_daemm = d / lambda
      const rThermal = 0.17 + (lambda > 0 ? (tM / lambda) : 0);`
);

// Fix brennholz-raummeter-rechner
bgContent = bgContent.replace(
  `summaryText: qty + ' ' + (unit.toUpperCase())`,
  `summaryText: qty + ' ' + (String(unit || 'SRM').toUpperCase())`
);

// Fix holz-balken-durchbiegung-rechner
bgContent = bgContent.replace(
  `const iMoment = (bMm * Math.pow(hMm, 3)) / 12;
      // E-Modul Konstruktionsvollholz C24 E_0,mean = 11.000 N/mm²:
      const eModul = 11000;
      
      // Durchbiegung f = (5 * q * L^4) / (384 * E * I)
      const fMm = (5 * qNmm * Math.pow(lMm, 4)) / (384 * eModul * iMoment);
      
      // Grenzwert nach DIN EN 1995-1-1 (Eurocode 5): meist w_inst <= L / 300 bis L / 400
      const limitMm = lMm / 300;`,
  `const iMoment = (bMm * Math.pow(hMm, 3)) / 12;
      const eModul = 11000;
      const fMm = (iMoment > 0) ? ((5 * qNmm * Math.pow(lMm, 4)) / (384 * eModul * iMoment)) : 0;
      const limitMm = lMm / 300;`
);

// Fix bogenmass-grad-rechner
bgContent = bgContent.replace(
  `summaryText: val + ' ' + unit.toUpperCase()`,
  `summaryText: val + ' ' + String(unit || 'DEG').toUpperCase()`
);

fs.writeFileSync(bgPath, bgContent, 'utf8');
console.log('Successfully updated bauenGeometrie.ts');

// 2. Fix einheitenKochen.ts
const ekPath = path.join(__dirname, '../src/data/calculators/extra/einheitenKochen.ts');
let ekContent = fs.readFileSync(ekPath, 'utf8');

// Replace all occurrences of "unit.toUpperCase()" with "String(unit || '').toUpperCase()"
ekContent = ekContent.replaceAll('unit.toUpperCase()', "String(unit || '').toUpperCase()");
ekContent = ekContent.replaceAll('fmt.toUpperCase()', "String(fmt || 'A4').toUpperCase()");
ekContent = ekContent.replaceAll("sType.startsWith('el')", "String(sType || '').startsWith('el')");
ekContent = ekContent.replaceAll("(sub.toUpperCase())", "(String(sub || '').toUpperCase())");
ekContent = ekContent.replaceAll("sub.toUpperCase()", "String(sub || '').toUpperCase()");
ekContent = ekContent.replaceAll("sugarType.replace('_', ':')", "String(sugarType || '2_1').replace('_', ':')");

fs.writeFileSync(ekPath, ekContent, 'utf8');
console.log('Successfully updated einheitenKochen.ts');
