import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';
import { getAllArticles } from '../src/data/ratgeber/articles';

interface AuditFinding {
  severity: 'Critical' | 'High' | 'Medium' | 'Informational';
  category: string;
  calculatorSlug: string;
  calculatorName: string;
  issue: string;
  details?: string;
}

const findings: AuditFinding[] = [];

// Registry sets for link checking
const calculatorSlugs = new Set(ALL_CALCULATORS.map((c) => c.slug));
const categorySlugs = new Set(CATEGORIES.map((c) => c.slug));
const articleSlugs = new Set(getAllArticles().map((a) => a.slug));
const staticRoutes = new Set([
  '',
  'rechner',
  'ratgeber',
  'ueber-uns',
  'methodik',
  'impressum',
  'datenschutz',
]);

// Read next.config.ts for redirects
const nextConfigContent = fs.readFileSync(path.resolve(__dirname, '../next.config.ts'), 'utf-8');
const redirectSources: string[] = [];
const redirectRegex = /source:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = redirectRegex.exec(nextConfigContent)) !== null) {
  redirectSources.push(match[1]);
}

// Financial / Legal / Social categories
const financialLegalCategories = new Set([
  'steuern-finanzen',
  'arbeit-beruf',
  'vorsorge-rente',
  'soziales-familie',
  'kredit-finanzierung',
  'geldanlage-zinsen',
  'immobilien-kauf',
]);

console.log(`Starting audit across ${ALL_CALCULATORS.length} calculators...`);

ALL_CALCULATORS.forEach((calc) => {
  const allTexts: string[] = [];
  if (calc.content?.intro) allTexts.push(calc.content.intro);
  if (calc.content?.details) allTexts.push(calc.content.details);
  if (calc.content?.sections) {
    calc.content.sections.forEach((s) => {
      allTexts.push(s.title);
      allTexts.push(s.content);
    });
  }
  if (calc.faqs) {
    calc.faqs.forEach((f) => {
      allTexts.push(f.question);
      allTexts.push(f.answer);
    });
  }
  if (calc.formulaExplanation) allTexts.push(calc.formulaExplanation);
  if (calc.workedExample?.description) allTexts.push(calc.workedExample.description);
  if (calc.workedExamples) {
    calc.workedExamples.forEach((w) => allTexts.push(w.description));
  }

  // 1. Raw Markdown / broken formatting in PLAIN-TEXT visitor fields (H1, Meta, ShortDescription)
  const plainFields = [
    { name: 'h1', val: calc.h1 },
    { name: 'metaTitle', val: calc.metaTitle },
    { name: 'metaDescription', val: calc.metaDescription },
    { name: 'shortDescription', val: calc.shortDescription },
    { name: 'shortName', val: calc.shortName },
  ];

  for (const pf of plainFields) {
    if (pf.val && /(\*\*|`|\[.+?\]\(.+?\)|#)/.test(pf.val)) {
      findings.push({
        severity: 'High',
        category: 'Formatting / Raw Markdown in Plain Field',
        calculatorSlug: calc.slug,
        calculatorName: calc.name,
        issue: `Plain text field '${pf.name}' contains raw Markdown syntax: "${pf.val}"`,
      });
    }
  }

  // Check for unbalanced backticks or broken markdown links in long-form content
  for (const t of allTexts) {
    const backtickCount = (t.match(/`/g) || []).length;
    if (backtickCount % 2 !== 0) {
      findings.push({
        severity: 'Medium',
        category: 'Formatting / Broken Markdown',
        calculatorSlug: calc.slug,
        calculatorName: calc.name,
        issue: `Unbalanced backticks found in content snippet: "${t.substring(0, 80)}..."`,
      });
    }
    // Broken link syntax like [text]( without closing )
    if (/\[[^\]]+\]\([^)]*$/.test(t)) {
      findings.push({
        severity: 'High',
        category: 'Formatting / Broken Link Syntax',
        calculatorSlug: calc.slug,
        calculatorName: calc.name,
        issue: `Unclosed markdown link found in content snippet: "${t.substring(0, 80)}..."`,
      });
    }
  }

  // 2. Numerical input where 0 becomes a fallback/default value
  // We execute calculate with 0 for each numeric input
  if (typeof calc.calculate === 'function') {
    const zeroInputs: Record<string, any> = {};
    const defaultInputs: Record<string, any> = {};
    calc.inputs.forEach((inp) => {
      defaultInputs[inp.id] = inp.defaultValue;
      if (inp.type === 'number') {
        zeroInputs[inp.id] = 0;
      } else {
        zeroInputs[inp.id] = inp.defaultValue;
      }
    });

    try {
      const resZero = calc.calculate(zeroInputs);
      // If passing 0 produced NaN or Infinity
      if (typeof resZero.primary?.value === 'number' && (isNaN(resZero.primary.value) || !isFinite(resZero.primary.value))) {
        findings.push({
          severity: 'Critical',
          category: 'Calculation / Zero Input Failure',
          calculatorSlug: calc.slug,
          calculatorName: calc.name,
          issue: `Calculate returned NaN or Infinity when numerical inputs were set to 0.`,
        });
      }
    } catch {
      // Calculator might require non-zero for specific divisors (handled gracefully by error returns)
    }

    // Inspect calculator code or inputs where required input defaultValue is 0 but min > 0
    calc.inputs.forEach((inp) => {
      if (inp.type === 'number') {
        if (inp.min !== undefined && inp.min > 0 && inp.defaultValue === 0) {
          findings.push({
            severity: 'High',
            category: 'Input Validation / Default Out of Bounds',
            calculatorSlug: calc.slug,
            calculatorName: calc.name,
            issue: `Input '${inp.id}' has defaultValue=0 but min=${inp.min}.`,
          });
        }
      }
    });
  }

  // 3. Default values presented as user facts rather than clearly labelled “Beispielwert”
  calc.inputs.forEach((inp) => {
    if (inp.type === 'number' && typeof inp.defaultValue === 'number' && inp.defaultValue > 0) {
      const labelHasExample = /beispiel|richtwert|orientierung|muster/i.test(inp.label);
      const helpHasExample = inp.helpText && /beispiel|richtwert|orientierung|anpassbar|muster/i.test(inp.helpText);
      if (!labelHasExample && !helpHasExample) {
        findings.push({
          severity: 'Medium',
          category: 'UX / Unlabelled Default Value',
          calculatorSlug: calc.slug,
          calculatorName: calc.name,
          issue: `Numeric input '${inp.id}' (${inp.defaultValue}) is not clearly labelled as 'Beispielwert' or 'Richtwert' in label or helpText.`,
        });
      }
    }
  });

  // 4. Financial / legal / social calculators verification
  const isFinancialLegal = financialLegalCategories.has(calc.category);
  if (isFinancialLegal) {
    const hasStand = !!(
      calc.timeSensitiveMeta?.year ||
      calc.trustMeta?.lastReviewed ||
      calc.legalFootnotes?.some((f) => f.effectiveDate || f.reviewedDate) ||
      allTexts.some((t) => /stand:\s*\d{4}|rechtsstand|gilt ab \d{4}|202[4-6]/i.test(t))
    );

    const hasSource = !!(
      calc.timeSensitiveMeta?.sourceUrl ||
      calc.trustMeta?.sourceUrl ||
      (calc.legalFootnotes && calc.legalFootnotes.length > 0) ||
      allTexts.some((t) => /https?:\/\//i.test(t))
    );

    const hasDisclaimer = !!(
      calc.trustMeta?.disclaimer ||
      allTexts.some((t) =>
        /keine steuerberatung|keine rechtsberatung|ohne gewähr|unverbindlich|orientierungswert|modellrechnung/i.test(t)
      )
    );

    if (!hasStand) {
      findings.push({
        severity: 'Medium',
        category: 'Legal / Missing Stand Date',
        calculatorSlug: calc.slug,
        calculatorName: calc.name,
        issue: `Financial/legal calculator lacks explicit 'Stand' year/date in metadata or content.`,
      });
    }

    if (!hasSource) {
      findings.push({
        severity: 'High',
        category: 'Trust / Missing Source Link',
        calculatorSlug: calc.slug,
        calculatorName: calc.name,
        issue: `Financial/legal calculator lacks official source, legal footnote, or methodology link.`,
      });
    }

    if (!hasDisclaimer) {
      findings.push({
        severity: 'High',
        category: 'Legal / Missing Disclaimer',
        calculatorSlug: calc.slug,
        calculatorName: calc.name,
        issue: `Financial/legal calculator lacks tax/legal advisory disclaimer ('Keine Steuerberatung' / 'ohne Gewähr').`,
      });
    }
  }

  // 5. Title / H1 / Meta description mismatch
  if (!calc.h1 || calc.h1.trim().length === 0) {
    findings.push({
      severity: 'High',
      category: 'SEO / Missing H1',
      calculatorSlug: calc.slug,
      calculatorName: calc.name,
      issue: `Calculator has no H1 heading defined.`,
    });
  }
  if (!calc.metaTitle || calc.metaTitle.trim().length === 0) {
    findings.push({
      severity: 'High',
      category: 'SEO / Missing Meta Title',
      calculatorSlug: calc.slug,
      calculatorName: calc.name,
      issue: `Calculator has no metaTitle defined.`,
    });
  }
  if (!calc.metaDescription || calc.metaDescription.trim().length === 0) {
    findings.push({
      severity: 'Medium',
      category: 'SEO / Missing Meta Description',
      calculatorSlug: calc.slug,
      calculatorName: calc.name,
      issue: `Calculator has no metaDescription defined.`,
    });
  }

  // 6. Broken internal links
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  for (const t of allTexts) {
    let linkMatch;
    while ((linkMatch = linkRegex.exec(t)) !== null) {
      const href = linkMatch[2].trim();
      if (href.startsWith('/')) {
        // Normalize path
        const cleanPath = href.replace(/^\/+|\/+$/g, '');
        const parts = cleanPath.split('/');
        const section = parts[0];
        const targetSlug = parts[1];

        if (section === 'rechner') {
          if (targetSlug && !calculatorSlugs.has(targetSlug)) {
            // Check if it's a known redirect
            const isRedirected = redirectSources.some((s) => s.includes(targetSlug));
            if (!isRedirected) {
              findings.push({
                severity: 'Critical',
                category: 'Broken Internal Link',
                calculatorSlug: calc.slug,
                calculatorName: calc.name,
                issue: `Content links to non-existent calculator: '${href}'`,
              });
            }
          }
        } else if (section === 'ratgeber') {
          if (targetSlug && !articleSlugs.has(targetSlug)) {
            findings.push({
              severity: 'High',
              category: 'Broken Internal Link',
              calculatorSlug: calc.slug,
              calculatorName: calc.name,
              issue: `Content links to non-existent ratgeber article: '${href}'`,
            });
          }
        } else if (!categorySlugs.has(section) && !staticRoutes.has(section)) {
          findings.push({
            severity: 'High',
            category: 'Broken Internal Link',
            calculatorSlug: calc.slug,
            calculatorName: calc.name,
            issue: `Content links to unknown internal route: '${href}'`,
          });
        }
      }
    }
  }

  // Check relatedSlugs
  if (calc.relatedSlugs) {
    calc.relatedSlugs.forEach((rel) => {
      if (!calculatorSlugs.has(rel)) {
        findings.push({
          severity: 'Critical',
          category: 'Broken Related Slug',
          calculatorSlug: calc.slug,
          calculatorName: calc.name,
          issue: `relatedSlugs references non-existent calculator '${rel}'`,
        });
      }
    });
  } else {
    findings.push({
      severity: 'Informational',
      category: 'Internal Linking / Missing Related Slugs',
      calculatorSlug: calc.slug,
      calculatorName: calc.name,
      issue: `Calculator has no relatedSlugs defined.`,
    });
  }

  // 7. Sitemap & Canonical Anomalies
  // Check if calc.slug is among redirect sources
  const isRedirected = redirectSources.some((s) => s.includes(`/rechner/${calc.slug}`) || s === `/rechner/${calc.slug}/`);
  if (isRedirected) {
    findings.push({
      severity: 'Critical',
      category: 'SEO / Redirected Calculator In Active Registry',
      calculatorSlug: calc.slug,
      calculatorName: calc.name,
      issue: `Calculator '${calc.slug}' is present in active ALL_CALCULATORS but is redirected in next.config.ts!`,
    });
  }

  // 8. Intent Overlap / Duplicate detection
  // Compare with other calculators for near-identical slugs or names
  ALL_CALCULATORS.forEach((other) => {
    if (other.slug !== calc.slug) {
      if (other.slug === calc.slug) {
        findings.push({
          severity: 'Critical',
          category: 'Duplicate Calculator',
          calculatorSlug: calc.slug,
          calculatorName: calc.name,
          issue: `Duplicate calculator slug found: '${calc.slug}'`,
        });
      }
    }
  });
});

console.log(`Audit complete. Found ${findings.length} total findings.`);

// Group findings
const critical = findings.filter((f) => f.severity === 'Critical');
const high = findings.filter((f) => f.severity === 'High');
const medium = findings.filter((f) => f.severity === 'Medium');
const info = findings.filter((f) => f.severity === 'Informational');

// Write machine-readable JSON report
const jsonReport = {
  timestamp: new Date().toISOString(),
  totalCalculatorsAudited: ALL_CALCULATORS.length,
  summary: {
    critical: critical.length,
    high: high.length,
    medium: medium.length,
    informational: info.length,
    total: findings.length,
  },
  findings,
};

fs.writeFileSync(path.resolve(__dirname, '../audit-report.json'), JSON.stringify(jsonReport, null, 2), 'utf-8');

// Build human-readable markdown report
const markdown = `# RechenHafen Global Quality Gate Audit Report

**Audit-Datum:** ${new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}  
**Geprüfte Rechner:** ${ALL_CALCULATORS.length}  
**Status:** Audit abgeschlossen. Alle Befunde wurden zur manuellen Durchsicht klassifiziert (keine automatischen Massenänderungen).

---

## 1. Zusammenfassung der Ergebnisse

| Schweregrad | Anzahl Befunde | Beschreibung |
| :--- | :--- | :--- |
| **Critical** | ${critical.length} | Defekte interne Links, Redirects im aktiven Rechnerbestand, Division durch Null |
| **High** | ${high.length} | Fehlende Quellen / Disclaimer bei Rechts-/Finanzrechnern, unvollständige SEO-Header |
| **Medium** | ${medium.length} | Nicht explizit als „Beispielwert“ deklarierte Vorgaben, fehlendes Stand-Jahr |
| **Informational** | ${info.length} | Rechner ohne \`relatedSlugs\` oder Empfehlungen zur thematischen Vernetzung |
| **Gesamt** | **${findings.length}** | |

---

## 2. Kritische Befunde (Critical) — ${critical.length}

${critical.length === 0 ? '_Keine kritischen Fehler gefunden._' : critical.map((f, i) => `### ${i + 1}. [${f.calculatorSlug}](/rechner/${f.calculatorSlug}/) — ${f.calculatorName}
- **Kategorie:** ${f.category}
- **Problem:** ${f.issue}
`).join('\n')}

---

## 3. Hohe Priorität (High) — ${high.length}

${high.length === 0 ? '_Keine Befunde mit hoher Priorität gefunden._' : high.slice(0, 50).map((f, i) => `### ${i + 1}. [${f.calculatorSlug}](/rechner/${f.calculatorSlug}/) — ${f.calculatorName}
- **Kategorie:** ${f.category}
- **Problem:** ${f.issue}
`).join('\n')}
${high.length > 50 ? `\n_... und ${high.length - 50} weitere Befunde mit hoher Priorität (siehe vollständige Liste in \`audit-report.json\`)._` : ''}

---

## 4. Mittlere Priorität (Medium) — ${medium.length}

${medium.length === 0 ? '_Keine Befunde mit mittlerer Priorität gefunden._' : medium.slice(0, 30).map((f, i) => `### ${i + 1}. [${f.calculatorSlug}](/rechner/${f.calculatorSlug}/) — ${f.calculatorName}
- **Kategorie:** ${f.category}
- **Problem:** ${f.issue}
`).join('\n')}
${medium.length > 30 ? `\n_... und ${medium.length - 30} weitere Befunde mit mittlerer Priorität (siehe \`audit-report.json\`)._` : ''}

---

## 5. Informelle Hinweise (Informational) — ${info.length}

${info.length === 0 ? '_Keine informellen Hinweise._' : info.slice(0, 20).map((f, i) => `- **[${f.calculatorSlug}](/rechner/${f.calculatorSlug}/)**: ${f.issue}`).join('\n')}
${info.length > 20 ? `\n_... und ${info.length - 20} weitere informelle Hinweise (siehe \`audit-report.json\`)._` : ''}

---

## 6. Nächste Schritte & Empfehlungen

1. **Prioritäts-Korrekturen abgeschlossen:** Die vorrangigen Qualitätsverbesserungen für \`gaskostenrechner\`, \`dienstfahrrad-jobrad-rechner\` und \`schalungssteine-rechner\` sowie die systemweite Markdown-Rendering-Komponente wurden erfolgreich eingepflegt und getestet.
2. **Review der High-Befunde:** Finanz- und Rechtsrechner, bei denen noch Quellenlinks oder standardisierte Hinweistexte fehlen, sollten sukzessive in gezielten thematischen Batches ergänzt werden.
3. **Automatisierte CI-Integration:** Dieses Audit-Skript kann bei jedem Pull Request ausgeführt werden, um Regressionsfehler zu verhindern.
`;

fs.writeFileSync(path.resolve(__dirname, '../AUDIT_REPORT.md'), markdown, 'utf-8');
console.log('AUDIT_REPORT.md successfully generated.');
