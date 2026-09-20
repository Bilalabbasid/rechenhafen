import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/calculators/extra/businessStatistik.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. mittelwert-median-modus-rechner
content = content.replace(
`            return {
              primary: { label: 'Arithmetisches Mittel', value: mean.toFixed(2), unit: '' },
              details: [
                { label: 'Median (Zentralwert)', value: median.toFixed(2) },
                { label: 'Modus (Modalwert)', value: maxCount > 1 ? mode.toFixed(2) : 'Kein eindeutiger Modus' },
                { label: 'Spannweite (Max - Min)', value: range.toFixed(2) },
                { label: 'Summe aller Werte', value: sum.toFixed(2) },
                { label: 'Sortierte Reihe', value: arr.join(', ') },
              ],
            };`,
`            return {
              primary: { label: 'Arithmetisches Mittel', value: mean, formattedValue: formatNumber(mean, 2), unit: '' },
              details: [
                { label: 'Median (Zentralwert)', value: median, formattedValue: formatNumber(median, 2) },
                { label: 'Modus (Modalwert)', value: maxCount > 1 ? mode : 0, formattedValue: maxCount > 1 ? formatNumber(mode, 2) : 'Kein eindeutiger Modus' },
                { label: 'Spannweite (Max - Min)', value: range, formattedValue: formatNumber(range, 2) },
                { label: 'Summe aller Werte', value: sum, formattedValue: formatNumber(sum, 2) },
                { label: 'Sortierte Reihe', value: arr.join(', '), formattedValue: arr.map(n => formatNumber(n, 1)).join(', ') },
              ],
            };`
);

// 2. varianz-standardabweichung-stichprobe-rechner
content = content.replace(
`            return {
              primary: { label: 'Stichproben-Standardabweichung (s)', value: sdSample.toFixed(3), unit: '' },
              details: [
                { label: 'Stichprobenvarianz (s²)', value: varSample.toFixed(3) },
                { label: 'Populations-Standardabweichung (σ)', value: sdPop.toFixed(3) },
                { label: 'Populationsvarianz (σ²)', value: varPop.toFixed(3) },
                { label: 'Mittelwert (x̄)', value: mean.toFixed(2) },
                { label: 'Quadratsumme (SS)', value: ss.toFixed(2) },
              ],
            };`,
`            return {
              primary: { label: 'Stichproben-Standardabweichung (s)', value: sdSample, formattedValue: formatNumber(sdSample, 3), unit: '' },
              details: [
                { label: 'Stichprobenvarianz (s²)', value: varSample, formattedValue: formatNumber(varSample, 3) },
                { label: 'Populations-Standardabweichung (σ)', value: sdPop, formattedValue: formatNumber(sdPop, 3) },
                { label: 'Populationsvarianz (σ²)', value: varPop, formattedValue: formatNumber(varPop, 3) },
                { label: 'Mittelwert (x̄)', value: mean, formattedValue: formatNumber(mean, 2) },
                { label: 'Quadratsumme (SS)', value: ss, formattedValue: formatNumber(ss, 2) },
              ],
            };`
);

// 3. korrelationskoeffizient-rechner
content = content.replace(
`            return {
              primary: { label: 'Korrelationskoeffizient (r)', value: r.toFixed(4), unit: '' },
              details: [
                { label: 'Bestimmtheitsmaß (R²)', value: (r2 * 100).toFixed(2) + ' %' },
                { label: 'Interpretation', value: interpretation },
                { label: 'Richtung', value: r > 0 ? 'Positiver Zusammenhang' : (r < 0 ? 'Negativer Zusammenhang' : 'Kein Zusammenhang') },
                { label: 'Mittelwert X', value: meanX.toFixed(2) },
                { label: 'Mittelwert Y', value: meanY.toFixed(2) },
              ],
            };`,
`            return {
              primary: { label: 'Korrelationskoeffizient (r)', value: r, formattedValue: formatNumber(r, 4), unit: '' },
              details: [
                { label: 'Bestimmtheitsmaß (R²)', value: r2 * 100, formattedValue: formatPercent(r2 * 100, 2) },
                { label: 'Interpretation', value: interpretation, formattedValue: interpretation },
                { label: 'Richtung', value: r > 0 ? 'Positiver Zusammenhang' : (r < 0 ? 'Negativer Zusammenhang' : 'Kein Zusammenhang'), formattedValue: r > 0 ? 'Positiver Zusammenhang' : (r < 0 ? 'Negativer Zusammenhang' : 'Kein Zusammenhang') },
                { label: 'Mittelwert X', value: meanX, formattedValue: formatNumber(meanX, 2) },
                { label: 'Mittelwert Y', value: meanY, formattedValue: formatNumber(meanY, 2) },
              ],
            };`
);

// 4. z-score-normalverteilung-rechner
content = content.replace(
`            return {
              primary: { label: 'Z-Wert (Standardwert)', value: z.toFixed(3), unit: '' },
              details: [
                { label: 'Kumulierte Wahrscheinlichkeit P(X ≤ x)', value: (pPercent).toFixed(2) + ' %' },
                { label: 'Gegenwahrscheinlichkeit P(X > x)', value: (100 - pPercent).toFixed(2) + ' %' },
                { label: 'Perzentil-Rang', value: pPercent.toFixed(1) + '. Perzentil' },
                { label: 'Abstand zum Mittelwert', value: (x - mean).toFixed(2) },
              ],
            };`,
`            return {
              primary: { label: 'Z-Wert (Standardwert)', value: z, formattedValue: formatNumber(z, 3), unit: '' },
              details: [
                { label: 'Kumulierte Wahrscheinlichkeit P(X ≤ x)', value: pPercent, formattedValue: formatPercent(pPercent, 2) },
                { label: 'Gegenwahrscheinlichkeit P(X > x)', value: 100 - pPercent, formattedValue: formatPercent(100 - pPercent, 2) },
                { label: 'Perzentil-Rang', value: pPercent, formattedValue: formatNumber(pPercent, 1) + '. Perzentil' },
                { label: 'Abstand zum Mittelwert', value: x - mean, formattedValue: formatNumber(x - mean, 2) },
              ],
            };`
);

// 5. p-wert-hypothesentest-rechner
content = content.replace(
`            return {
              primary: { label: 'p-Wert (zweiseitig)', value: pTwoSided.toFixed(4), unit: '' },
              details: [
                { label: 'p-Wert (einseitig)', value: pOneSided.toFixed(4) },
                { label: 'Signifikanz bei α = ' + (alpha * 100) + ' %', value: isSigTwo ? 'Statistisch signifikant (H0 ablehnen)' : 'Nicht signifikant (H0 beibehalten)' },
                { label: 'Kritischer Z-Wert (zweiseitig)', value: '± 1,960' },
                { label: 'Kritischer Z-Wert (einseitig)', value: '1,645' },
              ],
            };`,
`            return {
              primary: { label: 'p-Wert (zweiseitig)', value: pTwoSided, formattedValue: formatNumber(pTwoSided, 4), unit: '' },
              details: [
                { label: 'p-Wert (einseitig)', value: pOneSided, formattedValue: formatNumber(pOneSided, 4) },
                { label: 'Signifikanz bei α = ' + formatPercent(alpha * 100, 1), value: isSigTwo ? 'Statistisch signifikant' : 'Nicht signifikant', formattedValue: isSigTwo ? 'Statistisch signifikant (H0 ablehnen)' : 'Nicht signifikant (H0 beibehalten)' },
                { label: 'Kritischer Z-Wert (zweiseitig)', value: 1.96, formattedValue: '± 1,960' },
                { label: 'Kritischer Z-Wert (einseitig)', value: 1.645, formattedValue: '1,645' },
              ],
            };`
);

// 6. t-test-rechner
content = content.replace(
`            return {
              primary: { label: 't-Prüfgröße', value: t.toFixed(3), unit: '' },
              details: [
                { label: 'Standardfehler (SE)', value: se.toFixed(3) },
                { label: 'Freiheitsgrade (df)', value: df.toString() },
                { label: 'Differenz (x̄ - μ0)', value: (xbar - mu0).toFixed(2) },
                { label: 'Faustregel-Signifikanz (|t| > 2)', value: Math.abs(t) >= 2 ? 'Wahrscheinlich signifikant (p < 0,05)' : 'Nicht signifikant' },
              ],
            };`,
`            return {
              primary: { label: 't-Prüfgröße', value: t, formattedValue: formatNumber(t, 3), unit: '' },
              details: [
                { label: 'Standardfehler (SE)', value: se, formattedValue: formatNumber(se, 3) },
                { label: 'Freiheitsgrade (df)', value: df, formattedValue: String(df) },
                { label: 'Differenz (x̄ - μ0)', value: xbar - mu0, formattedValue: formatNumber(xbar - mu0, 2) },
                { label: 'Faustregel-Signifikanz (|t| > 2)', value: Math.abs(t) >= 2 ? 'Wahrscheinlich signifikant' : 'Nicht signifikant', formattedValue: Math.abs(t) >= 2 ? 'Wahrscheinlich signifikant (p < 0,05)' : 'Nicht signifikant' },
              ],
            };`
);

// 7. konfidenzintervall-rechner
content = content.replace(
`            return {
              primary: { label: cl + ' % Konfidenzintervall', value: '[' + lower.toFixed(2) + ' ; ' + upper.toFixed(2) + ']', unit: '' },
              details: [
                { label: 'Fehlerspanne (± Margin of Error)', value: '± ' + margin.toFixed(2) },
                { label: 'Untere Grenze', value: lower.toFixed(2) },
                { label: 'Obere Grenze', value: upper.toFixed(2) },
                { label: 'Standardfehler (SE)', value: se.toFixed(3) },
                { label: 'Z-Multiplikator', value: z.toFixed(3) },
              ],
            };`,
`            return {
              primary: { label: cl + ' % Konfidenzintervall', value: '[' + lower.toFixed(2) + ' ; ' + upper.toFixed(2) + ']', formattedValue: '[' + formatNumber(lower, 2) + ' ; ' + formatNumber(upper, 2) + ']', unit: '' },
              details: [
                { label: 'Fehlerspanne (± Margin of Error)', value: margin, formattedValue: '± ' + formatNumber(margin, 2) },
                { label: 'Untere Grenze', value: lower, formattedValue: formatNumber(lower, 2) },
                { label: 'Obere Grenze', value: upper, formattedValue: formatNumber(upper, 2) },
                { label: 'Standardfehler (SE)', value: se, formattedValue: formatNumber(se, 3) },
                { label: 'Z-Multiplikator', value: z, formattedValue: formatNumber(z, 3) },
              ],
            };`
);

// 8. stichprobengroesse-rechner
content = content.replace(
`            return {
              primary: { label: 'Empfohlene Stichprobengröße (n)', value: requiredN.toLocaleString('de-DE'), unit: 'Teilnehmer' },
              details: [
                { label: 'Fehlerspanne (Margin of Error)', value: '± ' + (e * 100).toFixed(1) + ' %' },
                { label: 'Konfidenzniveau', value: cl + ' %' },
                { label: 'Grundgesamtheit (N)', value: N > 0 ? N.toLocaleString('de-DE') : 'Sehr groß / Unendlich' },
                { label: 'Unendliche Grundgesamtheit (n0)', value: Math.ceil(n0).toLocaleString('de-DE') },
              ],
            };`,
`            return {
              primary: { label: 'Empfohlene Stichprobengröße (n)', value: requiredN, formattedValue: formatNumber(requiredN, 0) + ' Teilnehmer', unit: 'Teilnehmer' },
              details: [
                { label: 'Fehlerspanne (Margin of Error)', value: e * 100, formattedValue: '± ' + formatPercent(e * 100, 1) },
                { label: 'Konfidenzniveau', value: cl, formattedValue: cl + ' %' },
                { label: 'Grundgesamtheit (N)', value: N, formattedValue: N > 0 ? formatNumber(N, 0) : 'Sehr groß / Unendlich' },
                { label: 'Unendliche Grundgesamtheit (n0)', value: Math.ceil(n0), formattedValue: formatNumber(Math.ceil(n0), 0) },
              ],
            };`
);

// 9. quartile-box-plot-rechner
content = content.replace(
`            return {
              primary: { label: 'Interquartilsabstand (IQR)', value: iqr.toFixed(2), unit: '' },
              details: [
                { label: 'Unteres Quartil (Q1, 25 %)', value: q1.toFixed(2) },
                { label: 'Median (Q2, 50 %)', value: q2.toFixed(2) },
                { label: 'Oberes Quartil (Q3, 75 %)', value: q3.toFixed(2) },
                { label: 'Minimum', value: min.toFixed(2) },
                { label: 'Maximum', value: max.toFixed(2) },
                { label: 'Unterer Antennen-Grenzwert', value: lowerWhisker.toFixed(2) },
                { label: 'Oberer Antennen-Grenzwert', value: upperWhisker.toFixed(2) },
              ],
            };`,
`            return {
              primary: { label: 'Interquartilsabstand (IQR)', value: iqr, formattedValue: formatNumber(iqr, 2), unit: '' },
              details: [
                { label: 'Unteres Quartil (Q1, 25 %)', value: q1, formattedValue: formatNumber(q1, 2) },
                { label: 'Median (Q2, 50 %)', value: q2, formattedValue: formatNumber(q2, 2) },
                { label: 'Oberes Quartil (Q3, 75 %)', value: q3, formattedValue: formatNumber(q3, 2) },
                { label: 'Minimum', value: min, formattedValue: formatNumber(min, 2) },
                { label: 'Maximum', value: max, formattedValue: formatNumber(max, 2) },
                { label: 'Unterer Antennen-Grenzwert', value: lowerWhisker, formattedValue: formatNumber(lowerWhisker, 2) },
                { label: 'Oberer Antennen-Grenzwert', value: upperWhisker, formattedValue: formatNumber(upperWhisker, 2) },
              ],
            };`
);

// 10. binomialverteilung-rechner
content = content.replace(
`            return {
              primary: { label: 'Genau ' + k + ' Treffer P(X = ' + k + ')', value: (pExact * 100).toFixed(2) + ' %', unit: '' },
              details: [
                { label: 'Höchstens ' + k + ' Treffer P(X ≤ ' + k + ')', value: (pCdf * 100).toFixed(2) + ' %' },
                { label: 'Mindestens ' + k + ' Treffer P(X ≥ ' + k + ')', value: ((1 - pCdf + pExact) * 100).toFixed(2) + ' %' },
                { label: 'Erwartungswert E(X) = n · p', value: expVal.toFixed(2) },
                { label: 'Standardabweichung σ', value: Math.sqrt(variance).toFixed(2) },
                { label: 'Varianz Var(X)', value: variance.toFixed(2) },
              ],
            };`,
`            return {
              primary: { label: 'Genau ' + k + ' Treffer P(X = ' + k + ')', value: pExact * 100, formattedValue: formatPercent(pExact * 100, 2), unit: '' },
              details: [
                { label: 'Höchstens ' + k + ' Treffer P(X ≤ ' + k + ')', value: pCdf * 100, formattedValue: formatPercent(pCdf * 100, 2) },
                { label: 'Mindestens ' + k + ' Treffer P(X ≥ ' + k + ')', value: (1 - pCdf + pExact) * 100, formattedValue: formatPercent((1 - pCdf + pExact) * 100, 2) },
                { label: 'Erwartungswert E(X) = n · p', value: expVal, formattedValue: formatNumber(expVal, 2) },
                { label: 'Standardabweichung σ', value: Math.sqrt(variance), formattedValue: formatNumber(Math.sqrt(variance), 2) },
                { label: 'Varianz Var(X)', value: variance, formattedValue: formatNumber(variance, 2) },
              ],
            };`
);

// 11. poisson-verteilung-rechner
content = content.replace(
`            return {
              primary: { label: 'Genau ' + k + ' Ereignisse P(X = ' + k + ')', value: (pExact * 100).toFixed(2) + ' %', unit: '' },
              details: [
                { label: 'Höchstens ' + k + ' Ereignisse P(X ≤ ' + k + ')', value: (pCdf * 100).toFixed(2) + ' %' },
                { label: 'Mindestens ' + k + ' Ereignisse P(X ≥ ' + k + ')', value: ((1 - pCdf + pExact) * 100).toFixed(2) + ' %' },
                { label: 'Erwartungswert E(X) = λ', value: lambda.toFixed(2) },
                { label: 'Standardabweichung σ = √λ', value: Math.sqrt(lambda).toFixed(2) },
              ],
            };`,
`            return {
              primary: { label: 'Genau ' + k + ' Ereignisse P(X = ' + k + ')', value: pExact * 100, formattedValue: formatPercent(pExact * 100, 2), unit: '' },
              details: [
                { label: 'Höchstens ' + k + ' Ereignisse P(X ≤ ' + k + ')', value: pCdf * 100, formattedValue: formatPercent(pCdf * 100, 2) },
                { label: 'Mindestens ' + k + ' Ereignisse P(X ≥ ' + k + ')', value: (1 - pCdf + pExact) * 100, formattedValue: formatPercent((1 - pCdf + pExact) * 100, 2) },
                { label: 'Erwartungswert E(X) = λ', value: lambda, formattedValue: formatNumber(lambda, 2) },
                { label: 'Standardabweichung σ = √λ', value: Math.sqrt(lambda), formattedValue: formatNumber(Math.sqrt(lambda), 2) },
              ],
            };`
);

// 12. kombinatorik-n-ueber-k-rechner
content = content.replace(
`            return {
              primary: { label: 'Kombinationen ohne Reihenfolge (n über k)', value: combinations.toLocaleString('de-DE'), unit: 'Möglichkeiten' },
              details: [
                { label: 'Variationen mit Reihenfolge', value: variations.toLocaleString('de-DE') },
                { label: 'Lotto-Wahrscheinlichkeit (1 zu ...)', value: '1 zu ' + combinations.toLocaleString('de-DE') },
                { label: 'Kombinationen mit Zurücklegen', value: nCr(n + k - 1, k).toLocaleString('de-DE') },
                { label: 'Formel', value: n + '! / (' + k + '! · ' + (n - k) + '!)' },
              ],
            };`,
`            return {
              primary: { label: 'Kombinationen ohne Reihenfolge (n über k)', value: combinations, formattedValue: formatNumber(combinations, 0) + ' Möglichkeiten', unit: 'Möglichkeiten' },
              details: [
                { label: 'Variationen mit Reihenfolge', value: variations, formattedValue: formatNumber(variations, 0) },
                { label: 'Lotto-Wahrscheinlichkeit (1 zu ...)', value: combinations, formattedValue: '1 zu ' + formatNumber(combinations, 0) },
                { label: 'Kombinationen mit Zurücklegen', value: nCr(n + k - 1, k), formattedValue: formatNumber(nCr(n + k - 1, k), 0) },
                { label: 'Formel', value: n + '! / (' + k + '! · ' + (n - k) + '!)', formattedValue: n + '! / (' + k + '! · ' + (n - k) + '!)' },
              ],
            };`
);

// 13. lineare-regression-rechner
content = content.replace(
`            return {
              primary: { label: 'Regressionsgleichung', value: 'y = ' + slope.toFixed(3) + ' · x + ' + intercept.toFixed(3), unit: '' },
              details: [
                { label: 'Steigung (a)', value: slope.toFixed(3) },
                { label: 'Y-Achsenabschnitt (b)', value: intercept.toFixed(3) },
                { label: 'Bestimmtheitsmaß (R²)', value: (r2 * 100).toFixed(2) + ' %' },
                { label: 'Reststreuung (SS Residuals)', value: ssRes.toFixed(3) },
                { label: 'Mittelwert X / Y', value: meanX.toFixed(2) + ' / ' + meanY.toFixed(2) },
              ],
            };`,
`            return {
              primary: { label: 'Regressionsgleichung', value: 'y = ' + slope.toFixed(3) + ' · x + ' + intercept.toFixed(3), formattedValue: 'y = ' + formatNumber(slope, 3) + ' · x + ' + formatNumber(intercept, 3), unit: '' },
              details: [
                { label: 'Steigung (a)', value: slope, formattedValue: formatNumber(slope, 3) },
                { label: 'Y-Achsenabschnitt (b)', value: intercept, formattedValue: formatNumber(intercept, 3) },
                { label: 'Bestimmtheitsmaß (R²)', value: r2 * 100, formattedValue: formatPercent(r2 * 100, 2) },
                { label: 'Reststreuung (SS Residuals)', value: ssRes, formattedValue: formatNumber(ssRes, 3) },
                { label: 'Mittelwert X / Y', value: meanX, formattedValue: formatNumber(meanX, 2) + ' / ' + formatNumber(meanY, 2) },
              ],
            };`
);

// 14. kovarianz-rechner
content = content.replace(
`            return {
              primary: { label: 'Stichproben-Kovarianz s_xy', value: covSample.toFixed(2), unit: '' },
              details: [
                { label: 'Populations-Kovarianz σ_xy', value: covPop.toFixed(2) },
                { label: 'Vorzeichen-Bedeutung', value: covSample > 0 ? 'Gleichgerichteter Zusammenhang (positiv)' : (covSample < 0 ? 'Gegenläufiger Zusammenhang (negativ)' : 'Unkorreliert') },
                { label: 'Mittelwert X', value: meanX.toFixed(2) },
                { label: 'Mittelwert Y', value: meanY.toFixed(2) },
                { label: 'Summe der Kreuzprodukte', value: sumProd.toFixed(2) },
              ],
            };`,
`            return {
              primary: { label: 'Stichproben-Kovarianz s_xy', value: covSample, formattedValue: formatNumber(covSample, 2), unit: '' },
              details: [
                { label: 'Populations-Kovarianz σ_xy', value: covPop, formattedValue: formatNumber(covPop, 2) },
                { label: 'Vorzeichen-Bedeutung', value: covSample > 0 ? 'Positiv' : (covSample < 0 ? 'Negativ' : 'Unkorreliert'), formattedValue: covSample > 0 ? 'Gleichgerichteter Zusammenhang (positiv)' : (covSample < 0 ? 'Gegenläufiger Zusammenhang (negativ)' : 'Unkorreliert') },
                { label: 'Mittelwert X', value: meanX, formattedValue: formatNumber(meanX, 2) },
                { label: 'Mittelwert Y', value: meanY, formattedValue: formatNumber(meanY, 2) },
                { label: 'Summe der Kreuzprodukte', value: sumProd, formattedValue: formatNumber(sumProd, 2) },
              ],
            };`
);

// 15. variationskoeffizient-rechner
content = content.replace(
`            return {
              primary: { label: 'Variationskoeffizient (CV)', value: cv.toFixed(2) + ' %', unit: '' },
              details: [
                { label: 'Dezimalwert (s / x̄)', value: (cv / 100).toFixed(4) },
                { label: 'Eingegebener Mittelwert', value: mean.toFixed(2) },
                { label: 'Eingegebene Standardabweichung', value: sd.toFixed(2) },
                { label: 'Beurteilung', value: cv < 10 ? 'Sehr geringe Streuung (< 10 %)' : (cv < 25 ? 'Moderate Streuung' : 'Hohe relative Streuung (> 25 %)') },
              ],
            };`,
`            return {
              primary: { label: 'Variationskoeffizient (CV)', value: cv, formattedValue: formatPercent(cv, 2), unit: '' },
              details: [
                { label: 'Dezimalwert (s / x̄)', value: cv / 100, formattedValue: formatNumber(cv / 100, 4) },
                { label: 'Eingegebener Mittelwert', value: mean, formattedValue: formatNumber(mean, 2) },
                { label: 'Eingegebene Standardabweichung', value: sd, formattedValue: formatNumber(sd, 2) },
                { label: 'Beurteilung', value: cv < 10 ? 'Sehr geringe Streuung' : (cv < 25 ? 'Moderate Streuung' : 'Hohe relative Streuung'), formattedValue: cv < 10 ? 'Sehr geringe Streuung (< 10 %)' : (cv < 25 ? 'Moderate Streuung' : 'Hohe relative Streuung (> 25 %)') },
              ],
            };`
);

// 16. geometrisches-mittel-rechner
content = content.replace(
`            return {
              primary: { label: 'Geometrisches Mittel (Faktor)', value: geomMean.toFixed(4), unit: '' },
              details: [
                { label: 'Durchschnittliche Wachstumsrate', value: (avgRate >= 0 ? '+' : '') + avgRate.toFixed(2) + ' % p.a.' },
                { label: 'Gesamtes Wachstum über 4 Perioden', value: (totalGrowth >= 0 ? '+' : '') + totalGrowth.toFixed(2) + ' %' },
                { label: 'Gesamtprodukt aller Faktoren', value: prod.toFixed(4) },
                { label: 'Arithmetischer Vergleichswert', value: (((f1 + f2 + f3 + f4) / 4 - 1) * 100).toFixed(2) + ' %' },
              ],
            };`,
`            return {
              primary: { label: 'Geometrisches Mittel (Faktor)', value: geomMean, formattedValue: formatNumber(geomMean, 4), unit: '' },
              details: [
                { label: 'Durchschnittliche Wachstumsrate', value: avgRate, formattedValue: (avgRate >= 0 ? '+' : '') + formatPercent(avgRate, 2) + ' p.a.' },
                { label: 'Gesamtes Wachstum über 4 Perioden', value: totalGrowth, formattedValue: (totalGrowth >= 0 ? '+' : '') + formatPercent(totalGrowth, 2) },
                { label: 'Gesamtprodukt aller Faktoren', value: prod, formattedValue: formatNumber(prod, 4) },
                { label: 'Arithmetischer Vergleichswert', value: ((f1 + f2 + f3 + f4) / 4 - 1) * 100, formattedValue: formatPercent(((f1 + f2 + f3 + f4) / 4 - 1) * 100, 2) },
              ],
            };`
);

// 17. harmonisches-mittel-rechner
content = content.replace(
`            return {
              primary: { label: 'Harmonisches Mittel', value: harmMean.toFixed(2), unit: 'km/h' },
              details: [
                { label: 'Physikalisch korrekte Durchschnittsgeschwindigkeit', value: harmMean.toFixed(2) + ' km/h' },
                { label: 'Falscher arithmetischer Durchschnitt', value: arithMean.toFixed(2) + ' km/h' },
                { label: 'Unterschied (Verzerrung)', value: (arithMean - harmMean).toFixed(2) + ' km/h' },
                { label: 'Formel', value: '2 / (1/' + v1 + ' + 1/' + v2 + ')' },
              ],
            };`,
`            return {
              primary: { label: 'Harmonisches Mittel', value: harmMean, formattedValue: formatNumber(harmMean, 2) + ' km/h', unit: 'km/h' },
              details: [
                { label: 'Physikalisch korrekte Durchschnittsgeschwindigkeit', value: harmMean, formattedValue: formatNumber(harmMean, 2) + ' km/h' },
                { label: 'Falscher arithmetischer Durchschnitt', value: arithMean, formattedValue: formatNumber(arithMean, 2) + ' km/h' },
                { label: 'Unterschied (Verzerrung)', value: arithMean - harmMean, formattedValue: formatNumber(arithMean - harmMean, 2) + ' km/h' },
                { label: 'Formel', value: '2 / (1/' + v1 + ' + 1/' + v2 + ')', formattedValue: '2 / (1/' + v1 + ' + 1/' + v2 + ')' },
              ],
            };`
);

// 18. bayes-theorem-rechner
content = content.replace(
`            return {
              primary: { label: 'Tatsächlich krank bei positivem Test P(A|B)', value: (posterior * 100).toFixed(2) + ' %', unit: '' },
              details: [
                { label: 'Positiver Vorhersagewert (PPV)', value: (posterior * 100).toFixed(2) + ' %' },
                { label: 'Falsch-Positiv-Wahrscheinlichkeit', value: ((1 - posterior) * 100).toFixed(2) + ' %' },
                { label: 'Gesamtwahrscheinlichkeit positiver Test P(B)', value: (pB * 100).toFixed(2) + ' %' },
                { label: 'Falsch-Positiv-Rate des Tests (1 - Spezifität)', value: ((1 - spec) * 100).toFixed(2) + ' %' },
              ],
            };`,
`            return {
              primary: { label: 'Tatsächlich krank bei positivem Test P(A|B)', value: posterior * 100, formattedValue: formatPercent(posterior * 100, 2), unit: '' },
              details: [
                { label: 'Positiver Vorhersagewert (PPV)', value: posterior * 100, formattedValue: formatPercent(posterior * 100, 2) },
                { label: 'Falsch-Positiv-Wahrscheinlichkeit', value: (1 - posterior) * 100, formattedValue: formatPercent((1 - posterior) * 100, 2) },
                { label: 'Gesamtwahrscheinlichkeit positiver Test P(B)', value: pB * 100, formattedValue: formatPercent(pB * 100, 2) },
                { label: 'Falsch-Positiv-Rate des Tests (1 - Spezifität)', value: (1 - spec) * 100, formattedValue: formatPercent((1 - spec) * 100, 2) },
              ],
            };`
);

// 19. wahrscheinlichkeit-wuerfel-muenze-rechner
content = content.replace(
`            return {
              primary: { label: 'Chance auf mindestens eine 6 bei ' + n + ' Würfeln', value: pAtLeastOne.toFixed(2) + ' %', unit: '' },
              details: [
                { label: 'Chance, dass alle Würfel eine 6 zeigen', value: pAllExact.toFixed(4) + ' %' },
                { label: 'Gegenwahrscheinlichkeit (keine einzige 6)', value: (pAllFail * 100).toFixed(2) + ' %' },
                { label: 'Gesamtzahl möglicher Wurfergebnisse', value: totalOutcomes.toLocaleString('de-DE') },
                { label: 'Münzwurf-Vergleich: n-mal Kopf in Folge', value: (Math.pow(0.5, n) * 100).toFixed(2) + ' %' },
              ],
            };`,
`            return {
              primary: { label: 'Chance auf mindestens eine 6 bei ' + n + ' Würfeln', value: pAtLeastOne, formattedValue: formatPercent(pAtLeastOne, 2), unit: '' },
              details: [
                { label: 'Chance, dass alle Würfel eine 6 zeigen', value: pAllExact, formattedValue: formatPercent(pAllExact, 4) },
                { label: 'Gegenwahrscheinlichkeit (keine einzige 6)', value: pAllFail * 100, formattedValue: formatPercent(pAllFail * 100, 2) },
                { label: 'Gesamtzahl möglicher Wurfergebnisse', value: totalOutcomes, formattedValue: formatNumber(totalOutcomes, 0) },
                { label: 'Münzwurf-Vergleich: n-mal Kopf in Folge', value: Math.pow(0.5, n) * 100, formattedValue: formatPercent(Math.pow(0.5, n) * 100, 2) },
              ],
            };`
);

// 20. perzentil-rechner
content = content.replace(
`            return {
              primary: { label: p + '. Perzentil (P' + p + ')', value: val.toFixed(2), unit: '' },
              details: [
                { label: 'Sortierte Reihe', value: arr.join(' ; ') },
                { label: 'Bedeutung', value: p + ' % aller Messwerte sind kleiner oder gleich ' + val.toFixed(2) },
                { label: 'Perzentil-Rang Index', value: (index + 1).toFixed(2) + ' von ' + n },
                { label: 'Median (50. Perzentil)', value: ((arr[2] + arr[3]) / 2).toFixed(2) },
              ],
            };`,
`            return {
              primary: { label: p + '. Perzentil (P' + p + ')', value: val, formattedValue: formatNumber(val, 2), unit: '' },
              details: [
                { label: 'Sortierte Reihe', value: arr.join(' ; '), formattedValue: arr.map(x => formatNumber(x, 1)).join(' ; ') },
                { label: 'Bedeutung', value: p, formattedValue: p + ' % aller Messwerte sind kleiner oder gleich ' + formatNumber(val, 2) },
                { label: 'Perzentil-Rang Index', value: index + 1, formattedValue: formatNumber(index + 1, 2) + ' von ' + n },
                { label: 'Median (50. Perzentil)', value: (arr[2] + arr[3]) / 2, formattedValue: formatNumber((arr[2] + arr[3]) / 2, 2) },
              ],
            };`
);

// 21. effektstaerke-cohens-d-rechner
content = content.replace(
`            return {
              primary: { label: "Effektstärke (Cohen's d)", value: d.toFixed(3), unit: '' },
              details: [
                { label: 'Interpretation nach Cohen', value: interp },
                { label: 'Gepoolte Standardabweichung (s_pooled)', value: sPooled.toFixed(2) },
                { label: 'Absoluter Mittelwertunterschied', value: (m1 - m2).toFixed(2) },
              ],
            };`,
`            return {
              primary: { label: "Effektstärke (Cohen's d)", value: d, formattedValue: formatNumber(d, 3), unit: '' },
              details: [
                { label: 'Interpretation nach Cohen', value: interp, formattedValue: interp },
                { label: 'Gepoolte Standardabweichung (s_pooled)', value: sPooled, formattedValue: formatNumber(sPooled, 2) },
                { label: 'Absoluter Mittelwertunterschied', value: m1 - m2, formattedValue: formatNumber(m1 - m2, 2) },
              ],
            };`
);

// 22. chi-quadrat-unabhaengigkeitstest-rechner
content = content.replace(
`            return {
              primary: { label: 'Chi-Quadrat Prüfgröße (χ²)', value: chi2.toFixed(3), unit: '' },
              details: [
                { label: 'Freiheitsgrade (df)', value: '1' },
                { label: 'Kritischer Wert (α = 5 %)', value: '3,841' },
                { label: 'Signifikanz (bei α = 5 %)', value: chi2 > 3.841 ? 'Statistisch signifikante Abhängigkeit' : 'Keine signifikante Abhängigkeit' },
                { label: 'Phi-Koeffizient (Effektmaß)', value: phi.toFixed(3) },
                { label: 'Gesamte Stichprobengröße (n)', value: n.toString() },
              ],
            };`,
`            return {
              primary: { label: 'Chi-Quadrat Prüfgröße (χ²)', value: chi2, formattedValue: formatNumber(chi2, 3), unit: '' },
              details: [
                { label: 'Freiheitsgrade (df)', value: 1, formattedValue: '1' },
                { label: 'Kritischer Wert (α = 5 %)', value: 3.841, formattedValue: '3,841' },
                { label: 'Signifikanz (bei α = 5 %)', value: chi2 > 3.841 ? 'Statistisch signifikant' : 'Keine signifikante Abhängigkeit', formattedValue: chi2 > 3.841 ? 'Statistisch signifikante Abhängigkeit' : 'Keine signifikante Abhängigkeit' },
                { label: 'Phi-Koeffizient (Effektmaß)', value: phi, formattedValue: formatNumber(phi, 3) },
                { label: 'Gesamte Stichprobengröße (n)', value: n, formattedValue: formatNumber(n, 0) },
              ],
            };`
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated all 22 statistical calculators in businessStatistik.ts');
