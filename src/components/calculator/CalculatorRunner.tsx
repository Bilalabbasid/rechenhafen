'use client';

import React, { useState, useEffect, useId } from 'react';
import { CalculatorDefinition, CalculationResult } from '@/types/calculator';
import styles from '@/styles/calculator.module.css';
import { AlertCircle } from 'lucide-react';

import { getCalculatorBySlug } from '@/data/calculators';

interface Props {
  slug: string;
}

export default function CalculatorRunner({ slug }: Props) {
  const calculator = getCalculatorBySlug(slug);
  const formId = useId();

  // Initialisiere State mit den Defaultwerten der Inputs
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    if (!calculator) return {};
    const init: Record<string, any> = {};
    for (const inp of calculator.inputs) {
      init[inp.id] = inp.defaultValue;
    }
    return init;
  });

  // URL Query-Parameter beim Laden optional einlesen
  useEffect(() => {
    if (!calculator || typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const updated: Record<string, any> = {};
      let changed = false;

      for (const inp of calculator.inputs) {
        if (params.has(inp.id)) {
          const raw = params.get(inp.id);
          if (raw !== null) {
            if (inp.type === 'number') {
              const parsed = parseFloat(raw.replace(',', '.'));
              if (Number.isFinite(parsed)) {
                updated[inp.id] = parsed;
                changed = true;
              }
            } else if (inp.type === 'boolean') {
              updated[inp.id] = raw === 'true';
              changed = true;
            } else {
              updated[inp.id] = raw;
              changed = true;
            }
          }
        }
      }

      if (changed) {
        setInputs((prev) => ({ ...prev, ...updated }));
      }
    } catch {
      // Ignoriere Parsing-Fehler
    }
  }, [calculator]);

  const handleInputChange = (id: string, value: any) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  if (!calculator) return null;

  // Berechnung ausführen
  let result: CalculationResult;
  try {
    result = calculator.calculate(inputs);
  } catch (err) {
    result = {
      primary: { id: 'error', label: 'Fehler', value: 0, formattedValue: '-' },
      error: 'Bei der Berechnung ist ein unerwarteter Eingabefehler aufgetreten.',
    };
  }

  return (
    <div className={styles.calculatorCard} id="rechner-app">
      <div className={styles.calculatorHeader}>
        <h2 className={styles.calculatorTitle}>{calculator.name}</h2>
        <span className={styles.clientTag}>Lokale Echtzeit-Berechnung</span>
      </div>

      <div className={styles.calculatorLayout}>
        {/* Eingabebereich */}
        <div className={styles.inputSection}>
          <h3 className={styles.sectionHeading}>Eingabewerte</h3>
          <div className={styles.inputGrid}>
            {calculator.inputs.map((field) => {
              const inputId = `${formId}-${field.id}`;
              return (
                <div key={field.id} className={styles.inputGroup}>
                  <label htmlFor={inputId} className={styles.label}>
                    {field.label}
                    {field.unit && <span className={styles.unitBadge}>({field.unit})</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      id={inputId}
                      className={styles.select}
                      value={inputs[field.id] ?? ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'date' ? (
                    <input
                      id={inputId}
                      type="date"
                      className={styles.input}
                      value={inputs[field.id] ?? ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  ) : field.type === 'boolean' ? (
                    <div className={styles.checkboxWrapper}>
                      <input
                        id={inputId}
                        type="checkbox"
                        className={styles.checkbox}
                        checked={Boolean(inputs[field.id])}
                        onChange={(e) => handleInputChange(field.id, e.target.checked)}
                      />
                      <span className={styles.helpText}>{field.helpText}</span>
                    </div>
                  ) : field.type === 'text' ? (
                    <input
                      id={inputId}
                      type="text"
                      placeholder={field.placeholder}
                      className={styles.input}
                      value={inputs[field.id] ?? ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  ) : (
                    <input
                      id={inputId}
                      type="number"
                      inputMode="decimal"
                      step={field.step || 'any'}
                      min={field.min}
                      max={field.max}
                      placeholder={field.placeholder}
                      className={styles.input}
                      value={inputs[field.id] ?? ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  )}

                  {field.helpText && field.type !== 'boolean' && (
                    <span className={styles.helpText}>{field.helpText}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ergebnisbereich */}
        <div className={styles.resultSection} aria-live="polite">
          <h3 className={styles.sectionHeading}>Ergebnis</h3>

          {result.error ? (
            <div className={styles.errorAlert}>
              <AlertCircle size={20} className={styles.errorIcon} />
              <div>
                <strong>Hinweis zur Eingabe</strong>
                <p>{result.error}</p>
              </div>
            </div>
          ) : (
            <div className={styles.resultBox}>
              <div className={styles.primaryResult}>
                <span className={styles.primaryLabel}>{result.primary.label}</span>
                <span className={styles.primaryValue}>
                  {result.primary.formattedValue ?? (result.primary.value !== undefined && result.primary.value !== null ? `${result.primary.value}${result.primary.unit ? ' ' + result.primary.unit : ''}` : '-')}
                </span>
              </div>

              {((result.secondary && result.secondary.length > 0) || (result.details && result.details.length > 0)) && (
                <div className={styles.secondaryGrid}>
                  {((result.secondary && result.secondary.length > 0) ? result.secondary : result.details!).map((sec, idx) => (
                    <div key={sec.id || sec.label || idx} className={styles.secondaryItem}>
                      <span className={styles.secondaryLabel}>{sec.label}</span>
                      <span className={styles.secondaryValue}>
                        {sec.formattedValue ?? (sec.value !== undefined && sec.value !== null ? `${sec.value}${sec.unit ? ' ' + sec.unit : ''}` : '-')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {result.summaryText && (
                <div className={styles.summaryText}>
                  <p>{result.summaryText}</p>
                </div>
              )}
            </div>
          )}

          {/* Zeitabhängige / Regulierte Dateninfo Stand 2026 */}
          {calculator.isTimeSensitive && calculator.timeSensitiveMeta && (
            <div className={styles.regulatedNotice}>
              <span className={styles.regulatedBadge}>
                Stand: {calculator.timeSensitiveMeta.year}
              </span>
              <span>
                Quelle: {calculator.timeSensitiveMeta.source} (geprüft am {calculator.timeSensitiveMeta.lastVerified})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Aufschlüsselungs-Tabelle */}
      {!result.error && result.breakdown && result.breakdown.rows.length > 0 && (
        <div className={styles.breakdownContainer}>
          <h4 className={styles.breakdownTitle}>Detaillierter Verlauf</h4>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Zeitraum</th>
                  {result.breakdown.columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.breakdown.rows.map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.period}</strong></td>
                    {result.breakdown!.columns.map((col) => (
                      <td key={col.key}>{row.values[col.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
