import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCalculatorBySlug } from '@/data/calculators';
import { EMBEDDABLE_CALCULATORS, isEmbeddable } from '@/data/embed';
import { CalculationResult } from '@/types/calculator';
import CalculatorRunner from '@/components/calculator/CalculatorRunner';
import EmbedHeightReporter from '@/components/embed/EmbedHeightReporter';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return EMBEDDABLE_CALCULATORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);
  if (!calc || !isEmbeddable(slug)) return { title: 'Rechner nicht gefunden' };
  return {
    title: `${calc.shortName || calc.name} (Einbettung)`,
    // The embed is a duplicate of the real calculator page: keep it out of the index.
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
    alternates: { canonical: `https://rechenhafen.de/rechner/${slug}/` },
  };
}

export default async function EmbedPage({ params }: PageProps) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);
  if (!calc || !isEmbeddable(slug)) notFound();

  const defaults: Record<string, unknown> = {};
  for (const input of calc.inputs) defaults[input.id] = input.defaultValue;
  let initialResult: CalculationResult;
  try {
    initialResult = calc.calculate(defaults);
  } catch {
    initialResult = {
      primary: { id: 'error', label: 'Fehler', value: 0, formattedValue: '-' },
      error: 'Berechnung konnte nicht initialisiert werden.',
    };
  }

  const pageUrl = `https://rechenhafen.de/rechner/${slug}/`;
  return (
    <div style={{ padding: '12px', maxWidth: '760px', margin: '0 auto' }}>
      <EmbedHeightReporter slug={slug} />
      <p style={{ margin: '0 0 8px', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
        {calc.h1}
      </p>
      <CalculatorRunner
        slug={calc.slug}
        name={calc.name}
        category={calc.category}
        inputs={calc.inputs}
        initialResult={initialResult}
        isTimeSensitive={calc.isTimeSensitive}
        timeSensitiveMeta={calc.timeSensitiveMeta}
        shortDescription={calc.shortDescription}
      />
      <p style={{ margin: '10px 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
        Kostenloser Rechner von{' '}
        <a href={pageUrl} target="_blank" rel="noopener" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          RechenHafen.de
        </a>{' '}
        – mit Rechenweg, Beispielen und Tabellen
      </p>
    </div>
  );
}
