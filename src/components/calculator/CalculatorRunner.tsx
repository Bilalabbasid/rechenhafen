'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { CalculatorInput, CalculationResult } from '@/types/calculator';
import styles from '@/styles/calculator.module.css';
import { AlertCircle, AlertTriangle, Copy, Check, RotateCcw, ShieldCheck, Plus, Trash2, Moon } from 'lucide-react';
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

  // Dynamic breaks state for arbeitszeitrechner (1 to 4 breaks)
  const [dynamicBreaks, setDynamicBreaks] = useState<number[]>([30]);

  const handleBreakChange = (index: number, val: number) => {
    const next = [...dynamicBreaks];
    next[index] = Math.max(0, val || 0);
    setDynamicBreaks(next);
    const total = next.reduce((a, b) => a + b, 0);
    const updated = { ...inputs, pauses: next, pauseMinutes: total };
    setInputs(updated);
    if (engineRef.current) {
      try {
        const newRes = engineRef.current(updated);
        setResult(newRes);
      } catch {}
    }
  };

  const handleAddBreak = () => {
    if (dynamicBreaks.length >= 4) return;
    const next = [...dynamicBreaks, 15];
    setDynamicBreaks(next);
    const total = next.reduce((a, b) => a + b, 0);
    const updated = { ...inputs, pauses: next, pauseMinutes: total };
    setInputs(updated);
    if (engineRef.current) {
      try {
        const newRes = engineRef.current(updated);
        setResult(newRes);
      } catch {}
    }
  };

  const handleRemoveBreak = (index: number) => {
    if (dynamicBreaks.length <= 1) return;
    const next = dynamicBreaks.filter((_, i) => i !== index);
    setDynamicBreaks(next);
    const total = next.reduce((a, b) => a + b, 0);
    const updated = { ...inputs, pauses: next, pauseMinutes: total };
    setInputs(updated);
    if (engineRef.current) {
      try {
        const newRes = engineRef.current(updated);
        setResult(newRes);
      } catch {}
    }
  };

  const isOvernight = (() => {
    if (slug !== 'arbeitszeitrechner') return false;
    const s = inputs.startTime || '08:00';
    const e = inputs.endTime || '16:30';
    const [h1, m1] = String(s).split(':').map((v: string) => parseInt(v, 10) || 0);
    const [h2, m2] = String(e).split(':').map((v: string) => parseInt(v, 10) || 0);
    return (h2 * 60 + m2) <= (h1 * 60 + m1);
  })();

  const handleReset = () => {
    const defaultVals: Record<string, any> = {};
    for (const inp of inputDefs) {
      defaultVals[inp.id] = inp.defaultValue;
    }
    setDynamicBreaks([30]);
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

  useEffect(() => {
    if (typeof window !== 'undefined' && result && !result.error && result.primary?.value !== undefined) {
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: 'calculator_completion',
        calculator_slug: slug,
        calculator_name: name,
        result_primary_label: result.primary.label,
        result_primary_value: result.primary.value,
        result_primary_formatted: result.primary.formattedValue,
      });
    }
  }, [result, slug, name]);

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
      if (typeof window !== 'undefined') {
        const w = window as any;
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({
          event: 'calculator_result_copy',
          calculator_slug: slug,
          calculator_name: name,
        });
      }
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
              // Special case: for arbeitszeitrechner, pauseMinutes is handled dynamically below
              if (slug === 'arbeitszeitrechner' && field.id === 'pauseMinutes') {
                return null;
              }

              // Check conditional visibility via dependsOn
              if (field.dependsOn) {
                const currentVal = inputs[field.dependsOn.field];
                const targetVal = field.dependsOn.value;
                if (Array.isArray(targetVal)) {
                  if (!targetVal.includes(currentVal)) return null;
                } else if (currentVal !== targetVal) {
                  return null;
                }
              }

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

                  {slug === 'arbeitszeitrechner' && field.id === 'endTime' && isOvernight && (
                    <div className={styles.overnightBadge}>
                      <Moon size={13} />
                      <span>Nachtschicht: Schichtende am Folgetag (+1 Tag)</span>
                    </div>
                  )}

                  {field.helpText && field.type !== 'boolean' && (
                    <span className={styles.helpText}>{field.helpText}</span>
                  )}
                </div>
              );
            })}

            {/* Dynamic breaks section for arbeitszeitrechner */}
            {slug === 'arbeitszeitrechner' && (
              <div className={styles.breakManager}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <label className={styles.label} style={{ margin: 0, fontWeight: 700 }}>
                    Pausenzeiten (§ 4 ArbZG)
                  </label>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                    Gesamt: {dynamicBreaks.reduce((a, b) => a + b, 0)} Min.
                  </span>
                </div>

                {dynamicBreaks.map((bVal, bIdx) => (
                  <div key={bIdx} className={styles.breakRow}>
                    <div style={{ flex: 1 }}>
                      <label htmlFor={`${formId}-pause-${bIdx}`} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
                        Pause {bIdx + 1}
                      </label>
                      <input
                        id={`${formId}-pause-${bIdx}`}
                        type="number"
                        min="0"
                        max="360"
                        step="5"
                        className={styles.input}
                        value={bVal}
                        onChange={(e) => handleBreakChange(bIdx, parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    {dynamicBreaks.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeBreakBtn}
                        onClick={() => handleRemoveBreak(bIdx)}
                        title={`Pause ${bIdx + 1} entfernen`}
                        aria-label={`Pause ${bIdx + 1} entfernen`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
                  {dynamicBreaks.length < 4 ? (
                    <button
                      type="button"
                      className={styles.addBreakBtn}
                      onClick={handleAddBreak}
                    >
                      <Plus size={14} />
                      <span>Pause hinzufügen ({dynamicBreaks.length}/4)</span>
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Maximal 4 Pausenblöcke erreicht
                    </span>
                  )}
                </div>
                <span className={styles.helpText} style={{ display: 'block', marginTop: '6px' }}>
                  Ruhepausen können in Abschnitte von mindestens 15 Minuten aufgeteilt werden (§ 4 ArbZG).
                </span>
              </div>
            )}
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
            <>
              {result.warning && (
                <div className={styles.warningAlert} role="status">
                  <AlertTriangle size={18} className={styles.warningIcon} />
                  <div>
                    <strong>Gesetzlicher Hinweis (§ 4 ArbZG)</strong>
                    <p>{result.warning}</p>
                  </div>
                </div>
              )}
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
            </>
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
