'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { CalculatorInput, CalculationResult } from '@/types/calculator';
import styles from '@/styles/calculator.module.css';
import { AlertCircle, Copy, Check, RotateCcw, ShieldCheck } from 'lucide-react';
import { loadCalculatorEngine } from '@/lib/calculators/dynamic-loader';

interface Props {
  slug: string;
  name: string;
  inputs: CalculatorInput[];
  initialResult: CalculationResult;
  isTimeSensitive?: boolean;
  timeSensitiveMeta?: {
    year: number;
    source: string;
    sourceUrl?: string;
    lastVerified: string;
  };
}

export default function CalculatorRunner({
  slug,
  name,
  inputs: inputDefs,
  initialResult,
  isTimeSensitive,
  timeSensitiveMeta,
}: Props) {
  const formId = useId();

  // Initialize inputs with default values
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    for (const inp of inputDefs) {
      init[inp.id] = inp.defaultValue;
    }
    return init;
  });

  // Result state initialized with prerendered server result (Zero Layout Shift)
  const [result, setResult] = useState<CalculationResult>(initialResult);
  const [copied, setCopied] = useState(false);

  // Reference to loaded engine function
  const engineRef = useRef<((inp: Record<string, any>) => CalculationResult) | null>(null);

  // Preload calculator engine in background after mount
  useEffect(() => {
    let isMounted = true;
    loadCalculatorEngine(slug).then((fn) => {
      if (isMounted && fn) {
        engineRef.current = fn;

        // Parse query params safely on client
        try {
          const params = new URLSearchParams(window.location.search);
          const updated: Record<string, any> = {};
          let changed = false;

          for (const inp of inputDefs) {
            if (params.has(inp.id)) {
              const raw = params.get(inp.id);
              if (raw !== null && typeof raw === 'string') {
                if (inp.type === 'number') {
                  const sanitized = raw.slice(0, 32).trim().replace(',', '.');
                  const parsed = parseFloat(sanitized);
                  if (Number.isFinite(parsed)) {
                    let val = parsed;
                    if (inp.min !== undefined && val < inp.min) val = inp.min;
                    if (inp.max !== undefined && val > inp.max) val = inp.max;
                    updated[inp.id] = val;
                    changed = true;
                  }
                } else if (inp.type === 'boolean') {
                  updated[inp.id] = raw.toLowerCase() === 'true' || raw === '1';
                  changed = true;
                } else if (inp.type === 'select') {
                  const isValidOption = inp.options?.some((opt) => opt.value === raw);
                  if (isValidOption) {
                    updated[inp.id] = raw;
                    changed = true;
                  }
                } else if (inp.type === 'date') {
                  if (/^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) {
                    updated[inp.id] = raw.trim();
                    changed = true;
                  }
                } else {
                  updated[inp.id] = raw.slice(0, 100);
                  changed = true;
                }
              }
            }
          }

          if (changed) {
            setInputs((prev) => {
              const merged = { ...prev, ...updated };
              try {
                const newRes = fn(merged);
                setResult(newRes);
              } catch {}
              return merged;
            });
          }
        } catch {
          // Ignore parsing errors
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug, inputDefs]);

  const handleInputChange = async (id: string, value: any) => {
    const updatedInputs = { ...inputs, [id]: value };
    setInputs(updatedInputs);

    let fn = engineRef.current;
    if (!fn) {
      fn = await loadCalculatorEngine(slug);
      if (fn) {
        engineRef.current = fn;
      }
    }

    if (fn) {
      try {
        const nextResult = fn(updatedInputs);
        setResult(nextResult);
      } catch {
        setResult({
          primary: { id: 'error', label: 'Fehler', value: 0, formattedValue: '-' },
          error: 'Bei der Berechnung ist ein unerwarteter Eingabefehler aufgetreten.',
        });
      }
    }
  };

  const handleReset = () => {
    const defaultVals: Record<string, any> = {};
    for (const inp of inputDefs) {
      defaultVals[inp.id] = inp.defaultValue;
    }
    setInputs(defaultVals);
    if (engineRef.current) {
      try {
        const resetRes = engineRef.current(defaultVals);
        setResult(resetRes);
      } catch {}
    } else {
      setResult(initialResult);
    }
  };

  const handleCopyResult = async () => {
    if (result.error) return;
    const primaryStr = `${result.primary.label}: ${result.primary.formattedValue ?? result.primary.value}${result.primary.unit ? ' ' + result.primary.unit : ''}`;
    let textToCopy = `${name}\n${primaryStr}`;

    const secondaries = result.secondary && result.secondary.length > 0 ? result.secondary : result.details;
    if (secondaries && secondaries.length > 0) {
      const secLines = secondaries.map(
        (s) => `${s.label}: ${s.formattedValue ?? s.value}${s.unit ? ' ' + s.unit : ''}`
      );
      textToCopy += `\n\nDetails:\n${secLines.join('\n')}`;
    }
    textToCopy += `\n\nBerechnet auf RechenHafen.de`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className={styles.calculatorCard} id="rechner-app">
      <div className={styles.calculatorHeader}>
        <h2 className={styles.calculatorTitle}>{name}</h2>
        <span className={styles.clientTag}>Lokale Echtzeit-Berechnung</span>
      </div>

      <div className={styles.calculatorLayout}>
        {/* Eingabebereich */}
        <div className={styles.inputSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 className={styles.sectionHeading} style={{ margin: 0 }}>Eingabewerte</h3>
            <button
              type="button"
              onClick={handleReset}
              className={styles.actionBtn}
              title="Auf Standardwerte zurücksetzen"
              aria-label="Eingaben auf Standardwerte zurücksetzen"
            >
              <RotateCcw size={13} />
              <span>Zurücksetzen</span>
            </button>
          </div>

          <div className={styles.inputGrid}>
            {inputDefs.map((field) => {
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
                  {result.primary.formattedValue ??
                    (result.primary.value !== undefined && result.primary.value !== null
                      ? `${result.primary.value}${result.primary.unit ? ' ' + result.primary.unit : ''}`
                      : '-')}
                </span>
              </div>

              {((result.secondary && result.secondary.length > 0) ||
                (result.details && result.details.length > 0)) && (
                <div className={styles.secondaryGrid}>
                  {(result.secondary && result.secondary.length > 0
                    ? result.secondary
                    : result.details!
                  ).map((sec, idx) => (
                    <div key={sec.id || sec.label || idx} className={styles.secondaryItem}>
                      <span className={styles.secondaryLabel}>{sec.label}</span>
                      <span className={styles.secondaryValue}>
                        {sec.formattedValue ??
                          (sec.value !== undefined && sec.value !== null
                            ? `${sec.value}${sec.unit ? ' ' + sec.unit : ''}`
                            : '-')}
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

              {/* Actions Bar */}
              <div className={styles.resultActionsBar}>
                <button
                  type="button"
                  onClick={handleCopyResult}
                  className={`${styles.actionBtn} ${copied ? styles.actionBtnCopied : ''}`}
                  title="Ergebnis in die Zwischenablage kopieren"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Ergebnis kopiert!' : 'Ergebnis kopieren'}</span>
                </button>

                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Echtzeit-Berechnung
                </span>
              </div>
            </div>
          )}

          {/* Privacy Signal */}
          <div className={styles.privacyNotice}>
            <ShieldCheck size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <span>Die Berechnung erfolgt lokal in Ihrem Browser. Keine Datenübertragung.</span>
          </div>

          {/* Regulated Year Notice */}
          {isTimeSensitive && timeSensitiveMeta && (
            <div className={styles.regulatedNotice}>
              <span className={styles.regulatedBadge}>
                Stand: {timeSensitiveMeta.year}
              </span>
              <span>
                Quelle: {timeSensitiveMeta.source} (geprüft am {timeSensitiveMeta.lastVerified})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Table */}
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
                    <td>
                      <strong>{row.period}</strong>
                    </td>
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
