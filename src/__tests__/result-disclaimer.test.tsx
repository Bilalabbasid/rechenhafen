import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ResultDisclaimer from '@/components/calculator/ResultDisclaimer';

describe('ResultDisclaimer Component Quality', () => {
  it('renders legal base sentence and specific tax disclaimer when disclaimerType is steuer', () => {
    const html = renderToStaticMarkup(
      <ResultDisclaimer
        disclaimerType="steuer"
        rechtsstand="2026"
        legalBasis={[{ label: '§ 32a EStG', url: 'https://www.gesetze-im-internet.de/estg/__32a.html' }]}
        assumptions={['Grundtarif für Alleinstehende', 'Pauschale Werbungskosten']}
      />
    );

    expect(html).toContain('role="note"');
    expect(html).toContain('Dieses Ergebnis ist eine unverbindliche Orientierung');
    expect(html).toContain('Rechtsstand 2026');
    expect(html).toContain('ersetzt keine steuerliche Beratung durch einen Steuerberater oder Lohnsteuerhilfeverein');
    expect(html).toContain('Annahmen dieser Berechnung:');
    expect(html).toContain('Grundtarif für Alleinstehende');
    expect(html).toContain('§ 32a EStG');
    expect(html).toContain('Wie wir rechnen &amp; Transparenz');
  });

  it('renders non-legal base sentence for pure non-legal calculation', () => {
    const html = renderToStaticMarkup(
      <ResultDisclaimer
        disclaimerType="allgemein"
        assumptions={['Mathematisch exakte Standardformeln']}
      />
    );

    expect(html).toContain('Dieses Ergebnis ist eine rechnerische Orientierung auf Basis Ihrer Eingaben');
    expect(html).toContain('Für die Richtigkeit der Berechnung und die Eignung für einen bestimmten Zweck wird keine Gewähr übernommen');
  });

  it('renders health disclaimer for gesundheit type', () => {
    const html = renderToStaticMarkup(
      <ResultDisclaimer
        disclaimerType="gesundheit"
        assumptions={['Standard-BMI für Erwachsene']}
      />
    );

    expect(html).toContain('ersetzt keine ärztliche Untersuchung, Diagnose oder Beratung');
  });
});
