/**
 * RechenHafen Automatisierter Qualitätssicherungs- & SEO-Audit Script
 * Prüft alle Rechner auf Integrität, Eindeutigkeit, Berechnungsstabilität, Metadaten und interne Links.
 */

import { ALL_CALCULATORS, getCalculatorBySlug } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';

interface AuditResult {
  totalCalculators: number;
  totalCategories: number;
  errors: string[];
  warnings: string[];
}

function runAudit(): AuditResult {
  const result: AuditResult = {
    totalCalculators: ALL_CALCULATORS.length,
    totalCategories: CATEGORIES.length,
    errors: [],
    warnings: [],
  };

  const slugs = new Set<string>();
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const h1s = new Set<string>();
  const validCategoryIds = new Set(CATEGORIES.map((c) => c.id));

  console.log(`\n========================================`);
  console.log(`RechenHafen Calculator & SEO Audit`);
  console.log(`Geprüfte Rechner: ${ALL_CALCULATORS.length}`);
  console.log(`Geprüfte Kategorien: ${CATEGORIES.length}`);
  console.log(`========================================\n`);

  for (const calc of ALL_CALCULATORS) {
    // 1. Slugs
    if (!calc.slug || !/^[a-z0-9-]+$/.test(calc.slug)) {
      result.errors.push(`Ungültiger oder fehlender Slug bei Rechner ID '${calc.id}'`);
    }
    if (slugs.has(calc.slug)) {
      result.errors.push(`Duplizierter Slug '${calc.slug}' gefunden!`);
    }
    slugs.add(calc.slug);

    // 2. Kategorie
    if (!validCategoryIds.has(calc.category)) {
      result.errors.push(`Rechner '${calc.slug}' hat ungültige Kategorie '${calc.category}'`);
    }

    // 3. Titel
    if (!calc.metaTitle || calc.metaTitle.trim().length === 0) {
      result.errors.push(`Fehlender metaTitle bei '${calc.slug}'`);
    } else if (titles.has(calc.metaTitle)) {
      result.errors.push(`Duplizierter metaTitle bei '${calc.slug}': "${calc.metaTitle}"`);
    }
    titles.add(calc.metaTitle);

    // 4. Meta Description
    if (!calc.metaDescription || calc.metaDescription.trim().length < 30) {
      result.errors.push(`Zu kurze oder fehlende metaDescription bei '${calc.slug}'`);
    } else if (descriptions.has(calc.metaDescription)) {
      result.errors.push(`Duplizierte metaDescription bei '${calc.slug}'`);
    }
    descriptions.add(calc.metaDescription);

    // 5. H1
    if (!calc.h1 || calc.h1.trim().length === 0) {
      result.errors.push(`Fehlendes H1 bei '${calc.slug}'`);
    } else if (h1s.has(calc.h1)) {
      result.errors.push(`Dupliziertes H1 bei '${calc.slug}': "${calc.h1}"`);
    }
    h1s.add(calc.h1);

    // 6. Formel & Erklärung
    if (!calc.formula || calc.formula.trim().length === 0) {
      result.errors.push(`Fehlende Formel bei '${calc.slug}'`);
    }
    if (!calc.formulaExplanation || calc.formulaExplanation.trim().length === 0) {
      result.errors.push(`Fehlende Formelerklärung bei '${calc.slug}'`);
    }

    // 7. Verwandte Rechner & Interne Links
    if (!calc.relatedSlugs || calc.relatedSlugs.length === 0) {
      result.warnings.push(`Rechner '${calc.slug}' hat keine verwandten Rechner definiert`);
    } else {
      for (const relSlug of calc.relatedSlugs) {
        if (!getCalculatorBySlug(relSlug)) {
          result.errors.push(`Rechner '${calc.slug}' verlinkt auf nicht existierenden Rechner '${relSlug}'`);
        }
      }
    }

    // 8. Berechnungstest mit Standardwerten
    try {
      const defaultInputs: Record<string, any> = {};
      for (const inp of calc.inputs) {
        defaultInputs[inp.id] = inp.defaultValue;
      }
      const calcRes = calc.calculate(defaultInputs);

      if (calcRes.error) {
        result.errors.push(`Rechner '${calc.slug}' liefert Fehler bei Standard-Inputs: ${calcRes.error}`);
      }

      const primaryVal = calcRes.primary.value;
      if (typeof primaryVal === 'number') {
        if (Number.isNaN(primaryVal)) {
          result.errors.push(`Rechner '${calc.slug}' gibt NaN als Primärergebnis zurück!`);
        }
        if (!Number.isFinite(primaryVal)) {
          result.errors.push(`Rechner '${calc.slug}' gibt Infinity als Primärergebnis zurück!`);
        }
      }
    } catch (err: any) {
      result.errors.push(`Rechner '${calc.slug}' wirft Exception bei Berechnung: ${err.message}`);
    }
  }

  return result;
}

const audit = runAudit();

if (audit.errors.length > 0) {
  console.error(`❌ Audit fehlgeschlagen mit ${audit.errors.length} Fehlern:`);
  audit.errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`✅ Alle ${audit.totalCalculators} Rechner haben den Audit mit 0 Fehlern bestanden!`);
  if (audit.warnings.length > 0) {
    console.log(`⚠️  ${audit.warnings.length} Warnungen:`);
    audit.warnings.forEach((w) => console.log(`  - ${w}`));
  }
  process.exit(0);
}
