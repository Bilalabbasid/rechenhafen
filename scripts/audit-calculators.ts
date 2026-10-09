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
  inputKey?: string;
  issue: string;
  details?: string;
}

const findings: AuditFinding[] = [];
const seenKeys = new Set<string>();

function addFinding(f: AuditFinding) {
  const dedupKey = `${f.calculatorSlug}:${f.inputKey || ''}:${f.category}:${f.severity}`;
  if (seenKeys.has(dedupKey)) return;
  seenKeys.add(dedupKey);
  findings.push(f);
}

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

console.log(`Starting refined evidence-based audit across ${ALL_CALCULATORS.length} calculators...`);

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
      addFinding({
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
      addFinding({
        severity: 'Medium',
        category: 'Formatting / Broken Markdown',
        calculatorSlug: calc.slug,
        calculatorName: calc.name,
        issue: `Unbalanced backticks found in content snippet: "${t.substring(0, 80)}..."`,
      });
    }
    // Broken link syntax like [text]( without closing )
    if (/\[[^\]]+\]\([^)]*$/.test(t)) {
      addFinding({
        severity: 'High',
        category: 'Formatting / Broken Link Syntax',
        calculatorSlug: calc.slug,
        calculatorName: calc.name,
        issue: `Unclosed markdown link found in content snippet: "${t.substring(0, 80)}..."`,
      });
    }
  }

  // 2. Numerical input testing with default and zero inputs
  const defaultInputs: Record<string, any> = {};
  const zeroInputs: Record<string, any> = {};
  calc.inputs.forEach((inp) => {
    defaultInputs[inp.id] = inp.defaultValue;
    if (inp.type === 'number') {
      zeroInputs[inp.id] = 0;
    } else {
      zeroInputs[inp.id] = inp.defaultValue;
    }
  });

  if (typeof calc.calculate === 'function') {
    try {
      const resZero = calc.calculate(zeroInputs);
      if (
        typeof resZero.primary?.value === 'number' &&
        (isNaN(resZero.primary.value) || !isFinite(resZero.primary.value))
      ) {
        addFinding({
          severity: 'Critical',
          category: 'Calculation / Zero Input Failure',
          calculatorSlug: calc.slug,
          calculatorName: calc.name,
          issue: `Calculate returned NaN or Infinity when numerical inputs were set to 0.`,
        });
      }
    } catch {
      // Calculator may require non-zero for specific divisors, handled below
    }

    // Inspect inputs where defaultValue is 0 but min > 0
    calc.inputs.forEach((inp) => {
      if (inp.type === 'number') {
        if (inp.min !== undefined && inp.min > 0 && inp.defaultValue === 0) {
          addFinding({
            severity: 'High',
            category: 'Input Validation / Default Out of Bounds',
            calculatorSlug: calc.slug,
            calculatorName: calc.name,
            inputKey: inp.id,
            issue: `Input '${inp.id}' has defaultValue=0 but min=${inp.min}.`,
          });
        }
      }
    });
  }

  // 3. Evidence-based Numeric Input Quality Check
  calc.inputs.forEach((inp) => {
    if (inp.type === 'number' && typeof inp.defaultValue === 'number') {
      const defaultVal = inp.defaultValue;

      // Complete local input context:
      const localContext = [
        inp.label || '',
        inp.helpText || '',
        inp.placeholder || '',
        calc.subcategory || '',
        calc.content?.intro || '',
        calc.shortDescription || '',
      ]
        .join(' ')
        .toLowerCase();

      // Clear indicator that value is editable, an assumption, guideline, or example:
      const contextExplainsEditableOrExample =
        /(beispiel|richtwert|orientierung|annahme|vorgabe|standard|default|muster|typisch|durchschnitt|z\.\s*b\.|beispielsweise|anpassbar|optional|kann|falls|sofern|eintragen|eingeben|wählen|anpassen|individuell|ihr|ihre|ihren|dein|deine|deinen|0\s*€|null|leer)/i.test(
          localContext
        );

      // Check whether zero is a valid scenario
      const minAllowsZero = inp.min === undefined || inp.min <= 0;
      let zeroExecutionValid = false;
      if (minAllowsZero && typeof calc.calculate === 'function') {
        try {
          const testInputs = { ...defaultInputs, [inp.id]: 0 };
          const res = calc.calculate(testInputs);
          zeroExecutionValid =
            !res.error &&
            typeof res.primary?.value === 'number' &&
            !isNaN(res.primary.value) &&
            isFinite(res.primary.value);
        } catch {
          zeroExecutionValid = false;
        }
      }

      // Concepts where having 0 is a realistic user situation (subsidies, deductions, bonuses, optional fees, allowances, second incomes, etc.)
      const isOptionalOrAddonConcept =
        /(zuschuss|zulage|sonder|abzug|rabatt|nebenkosten|heizkosten|warmwasser|eigenkapital|sparrate|pauschale|steuer|kirche|gebühr|zusatz|bonus|aufschlag|reserve|freibetrag|absetzbar|entlastung|versorger|vorsorge|vermögen|unterhalt|miete|puffer)/i.test(
          (inp.label || '') + ' ' + (inp.helpText || '')
        );

      const zeroIsValidScenario = minAllowsZero && zeroExecutionValid && isOptionalOrAddonConcept;

      if (defaultVal > 0) {
        if (zeroIsValidScenario && !contextExplainsEditableOrExample) {
          // HIGH: zero is a valid scenario, defaultValue > 0, but visible context fails to explain that it's an assumption/example or that zero is valid
          addFinding({
            severity: 'High',
            category: 'Input Clarity / Unexplained Positive Default Where Zero Is Valid',
            calculatorSlug: calc.slug,
            calculatorName: calc.name,
            inputKey: inp.id,
            issue: `Input '${inp.id}' (${inp.label}) defaults to ${defaultVal} where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.`,
          });
        } else if (
          !/(beispiel|richtwert|muster|orientierung)/i.test((inp.label || '') + ' ' + (inp.helpText || ''))
        ) {
          // INFORMATIONAL: General consistency suggestion where context already explains it's an input or zero is not a standard situation
          addFinding({
            severity: 'Informational',
            category: 'Wording Consistency / Example Value Indicator',
            calculatorSlug: calc.slug,
            calculatorName: calc.name,
            inputKey: inp.id,
            issue: `Input '${inp.id}' (${inp.label}, default: ${defaultVal}) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.`,
          });
        }
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
      addFinding({
        severity: 'Medium',
        category: 'Legal / Missing Stand Date',
        calculatorSlug: calc.slug,
        calculatorName: calc.name,
        issue: `Financial/legal calculator lacks explicit 'Stand' year/date in metadata or content.`,
      });
    }

    if (!hasSource) {
      addFinding({
        severity: 'High',
        category: 'Trust / Missing Source Link',
        calculatorSlug: calc.slug,
        calculatorName: calc.name,
        issue: `Financial/legal calculator lacks official source, legal footnote, or methodology link.`,
      });
    }

    if (!hasDisclaimer) {
      addFinding({
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
    addFinding({
      severity: 'High',
      category: 'SEO / Missing H1',
      calculatorSlug: calc.slug,
      calculatorName: calc.name,
      issue: `Calculator has no H1 heading defined.`,
    });
  }
  if (!calc.metaTitle || calc.metaTitle.trim().length === 0) {
    addFinding({
      severity: 'High',
      category: 'SEO / Missing Meta Title',
      calculatorSlug: calc.slug,
      calculatorName: calc.name,
      issue: `Calculator has no metaTitle defined.`,
    });
  }
  if (!calc.metaDescription || calc.metaDescription.trim().length === 0) {
    addFinding({
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
        const cleanPath = href.replace(/^\/+|\/+$/g, '');
        const parts = cleanPath.split('/');
        const section = parts[0];
        const targetSlug = parts[1];

        if (section === 'rechner') {
          if (targetSlug && !calculatorSlugs.has(targetSlug)) {
            const isRedirected = redirectSources.some((s) => s.includes(targetSlug));
            if (!isRedirected) {
              addFinding({
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
            addFinding({
              severity: 'High',
              category: 'Broken Internal Link',
              calculatorSlug: calc.slug,
              calculatorName: calc.name,
              issue: `Content links to non-existent ratgeber article: '${href}'`,
            });
          }
        } else if (!categorySlugs.has(section) && !staticRoutes.has(section)) {
          addFinding({
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
        addFinding({
          severity: 'Critical',
          category: 'Broken Related Slug',
          calculatorSlug: calc.slug,
          calculatorName: calc.name,
          issue: `relatedSlugs references non-existent calculator '${rel}'`,
        });
      }
    });
  } else {
    addFinding({
      severity: 'Informational',
      category: 'Internal Linking / Missing Related Slugs',
      calculatorSlug: calc.slug,
      calculatorName: calc.name,
      issue: `Calculator has no relatedSlugs defined.`,
    });
  }

  // 7. Sitemap & Canonical Anomalies
  const isRedirected = redirectSources.some((s) => s.includes(`/rechner/${calc.slug}`) || s === `/rechner/${calc.slug}/`);
  if (isRedirected) {
    addFinding({
      severity: 'Critical',
      category: 'SEO / Redirected Calculator In Active Registry',
      calculatorSlug: calc.slug,
      calculatorName: calc.name,
      issue: `Calculator '${calc.slug}' is present in active ALL_CALCULATORS but is redirected in next.config.ts!`,
    });
  }

  // 8. Duplicate detection
  ALL_CALCULATORS.forEach((other) => {
    if (other !== calc && other.slug === calc.slug) {
      addFinding({
        severity: 'Critical',
        category: 'Duplicate Calculator',
        calculatorSlug: calc.slug,
        calculatorName: calc.name,
        issue: `Duplicate calculator slug found: '${calc.slug}'`,
      });
    }
  });
});

console.log(`Refined audit complete. Found ${findings.length} total findings.`);

// Group findings
const critical = findings.filter((f) => f.severity === 'Critical');
const high = findings.filter((f) => f.severity === 'High');
const medium = findings.filter((f) => f.severity === 'Medium');
const info = findings.filter((f) => f.severity === 'Informational');

// Metrics requested
const uniqueCalculatorsAffected = new Set(findings.map((f) => f.calculatorSlug)).size;
const uniqueInputsAffected = new Set(
  findings.filter((f) => f.inputKey).map((f) => `${f.calculatorSlug}:${f.inputKey}`)
).size;

// Category frequency
const categoryCounts: Record<string, number> = {};
findings.forEach((f) => {
  const calc = ALL_CALCULATORS.find((c) => c.slug === f.calculatorSlug);
  const cat = calc?.category || 'Sonstige';
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
});
const topCategories = Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

// Write machine-readable JSON report
const jsonReport = {
  timestamp: new Date().toISOString(),
  totalCalculatorsAudited: ALL_CALCULATORS.length,
  metrics: {
    uniqueCalculatorsAffected,
    uniqueInputsAffected,
    highConfidenceIssues: high.length,
    informationalSuggestions: info.length,
    criticalIssues: critical.length,
    mediumIssues: medium.length,
    totalFindings: findings.length,
    topAffectedCategories: topCategories.map(([category, count]) => ({ category, count })),
  },
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
const markdown = `# RechenHafen Refined Quality Gate Audit Report

**Audit-Datum:** ${new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}  
**Geprüfte Rechner:** ${ALL_CALCULATORS.length}  
**Status:** Evidenzbasierte Prüfung abgeschlossen. Keine automatischen Massenänderungen vorgenommen.

---

## 1. Zusammenfassung der Metriken

- **Betroffene eindeutige Rechner:** ${uniqueCalculatorsAffected} von ${ALL_CALCULATORS.length}
- **Betroffene eindeutige Eingabefelder:** ${uniqueInputsAffected}
- **High-Confidence Mängel (Hohe Priorität):** ${high.length}
- **Informative Formulierungshinweise (Informational):** ${info.length}
- **Kritische Systemmängel (Critical):** ${critical.length}
- **Mittlere Auffälligkeiten (Medium):** ${medium.length}
- **Gesamtzahl Befunde:** ${findings.length}

### Top-Betroffene Rechner-Kategorien
${topCategories.map(([cat, count], i) => `${i + 1}. **${cat}**: ${count} Befunde`).join('\n')}

---

## 2. Schweregrad-Übersicht

| Schweregrad | Anzahl Befunde | Kriterien / Bedeutung |
| :--- | :--- | :--- |
| **Critical** | ${critical.length} | Defekte interne Links, Redirect-Kollisionen, Rechenabbrüche bei Null-Eingaben |
| **High** | ${high.length} | Ungeklärte Positiv-Defaults bei realem 0-Szenario, fehlende Quellen/Disclaimer in Rechts-/Finanzrechnern |
| **Medium** | ${medium.length} | Fehlendes Stand-Jahr, unvollständige Meta-Beschreibungen |
| **Informational** | ${info.length} | Reine Formulierungsempfehlungen (z. B. Kennzeichnung als „Beispielwert“ / „Richtwert“) |
| **Gesamt** | **${findings.length}** | |

---

## 3. Kritische Befunde (Critical) — ${critical.length}

${critical.length === 0 ? '_Keine kritischen Fehler vorhanden._' : critical.map((f, i) => `### ${i + 1}. [${f.calculatorSlug}](/rechner/${f.calculatorSlug}/) — ${f.calculatorName}
- **Kategorie:** ${f.category}
- **Problem:** ${f.issue}
`).join('\n')}

---

## 4. High-Confidence Befunde (High) — ${high.length}

${high.length === 0 ? '_Keine High-Confidence Mängel gefunden._' : high.map((f, i) => `### ${i + 1}. [${f.calculatorSlug}](/rechner/${f.calculatorSlug}/) — ${f.calculatorName}
- **Feld:** \`${f.inputKey || 'N/A'}\`
- **Kategorie:** ${f.category}
- **Problem:** ${f.issue}
`).join('\n')}

---

## 5. Mittlere Priorität (Medium) — ${medium.length}

${medium.length === 0 ? '_Keine Befunde mittlerer Priorität._' : medium.slice(0, 20).map((f, i) => `### ${i + 1}. [${f.calculatorSlug}](/rechner/${f.calculatorSlug}/) — ${f.calculatorName}
- **Kategorie:** ${f.category}
- **Problem:** ${f.issue}
`).join('\n')}
${medium.length > 20 ? `\n_... und ${medium.length - 20} weitere Befunde mit mittlerer Priorität (vollständig in \`audit-report.json\`)._` : ''}

---

## 6. Informelle Formulierungsempfehlungen (Informational) — ${info.length}

_Hinweis: Diese Einträge stellen keine Defekte dar, sondern konsistente redaktionelle Vereinheitlichungsempfehlungen für zukünftige Content-Reviews._

${info.slice(0, 30).map((f, i) => `- **[${f.calculatorSlug}](/rechner/${f.calculatorSlug}/)** (\`${f.inputKey || 'allg.'}\`): ${f.issue}`).join('\n')}
${info.length > 30 ? `\n_... und ${info.length - 30} weitere informative Hinweise (vollständig in \`audit-report.json\`)._` : ''}
`;

fs.writeFileSync(path.resolve(__dirname, '../AUDIT_REPORT.md'), markdown, 'utf-8');
console.log('AUDIT_REPORT.md successfully updated.');
