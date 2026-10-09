'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import Link from 'next/link';
import { CalculatorInput, CalculationResult } from '@/types/calculator';
import styles from '@/styles/calculator.module.css';
import { AlertCircle, AlertTriangle, Copy, Check, RotateCcw, ShieldCheck, Plus, Trash2, Moon, Calendar, Share2, Sparkles, Info } from 'lucide-react';
import { loadCalculatorEngine } from '@/lib/calculators/dynamic-loader';
import { formatDateDe } from '@/lib/formatters';
import { getUpcomingEasterDateString, parseDateParts } from '@/lib/calculators/dateMath';
import {
  trackCalculatorView,
  trackCalculationCompleted,
  trackResultCopied,
  trackValidationError,
} from '@/lib/analytics/ga4';
import { renderInlineMarkdown } from '@/components/common/FormattedContent';

interface Props {
  slug: string;
  name: string;
  category?: string;
  inputs: CalculatorInput[];
  initialResult: CalculationResult;
  isTimeSensitive?: boolean;
  timeSensitiveMeta?: {
    year: number;
    source: string;
    sourceUrl?: string;
    lastVerified: string;
  };
  shortDescription?: string;
}

export default function CalculatorRunner({
  slug,
  name,
  category,
  inputs: inputDefs,
  initialResult,
  isTimeSensitive,
  timeSensitiveMeta,
  shortDescription,
}: Props) {
  const formId = useId();

  // Field validation errors state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
  const [linkCopied, setLinkCopied] = useState(false);

  // Reference to loaded engine function
  const engineRef = useRef<((inp: Record<string, any>) => CalculationResult) | null>(null);
  const trackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debounceTrackCompleted = () => {
    if (trackTimerRef.current) clearTimeout(trackTimerRef.current);
    trackTimerRef.current = setTimeout(() => {
      trackCalculationCompleted(slug, category || 'allgemein');
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (trackTimerRef.current) clearTimeout(trackTimerRef.current);
    };
  }, []);

  // Track privacy-safe calculator view event
  useEffect(() => {
    trackCalculatorView(slug, category || 'allgemein');
  }, [slug, category]);

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
                  const dp = parseDateParts(raw.trim());
                  if (dp) {
                    const pad = (n: number) => (n < 10 ? '0' + n : String(n));
                    updated[inp.id] = `${dp.year}-${pad(dp.month)}-${pad(dp.day)}`;
                    changed = true;
                  }
                } else {
                  updated[inp.id] = raw.slice(0, 100);
                  changed = true;
                }
              }
            }
          }

          if (slug === 'tage-zwischen-zwei-daten' && params.has('preset')) {
            const p = params.get('preset')?.toLowerCase();
            const berlinParts = new Intl.DateTimeFormat('en-CA', {
              timeZone: 'Europe/Berlin',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }).format(new Date()).split('-');
            const currentYear = parseInt(berlinParts[0], 10);
            if (p === 'silvester') {
              updated.mode = 'until';
              updated.endDate = `${currentYear}-12-31`;
              changed = true;
            } else if (p === 'heiligabend') {
              updated.mode = 'until';
              updated.endDate = `${currentYear}-12-24`;
              changed = true;
            } else if (p === 'weihnachten') {
              updated.mode = 'until';
              updated.endDate = `${currentYear}-12-25`;
              changed = true;
            } else if (p === 'neujahr') {
              updated.mode = 'until';
              updated.endDate = `${currentYear + 1}-01-01`;
              changed = true;
            } else if (p === 'ostern') {
              updated.mode = 'until';
              updated.endDate = getUpcomingEasterDateString();
              changed = true;
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

    // Track input validation errors and update inline field errors
    const newFieldErrors = { ...fieldErrors };
    const fieldDef = inputDefs.find((inp) => inp.id === id);
    if (fieldDef && fieldDef.type === 'number') {
      const valStr = String(value ?? '').trim().replace(',', '.');
      if (valStr === '') {
        newFieldErrors[id] = 'Bitte geben Sie einen Wert ein.';
      } else {
        const numVal = parseFloat(valStr);
        if (isNaN(numVal)) {
          newFieldErrors[id] = 'Bitte eine gültige Zahl eingeben.';
          trackValidationError(slug, 'invalid_number');
        } else if (fieldDef.min !== undefined && numVal < fieldDef.min) {
          newFieldErrors[id] = `Mindestwert: ${fieldDef.min}${fieldDef.unit ? ' ' + fieldDef.unit : ''}`;
          trackValidationError(slug, 'range_underflow');
        } else if (fieldDef.max !== undefined && numVal > fieldDef.max) {
          newFieldErrors[id] = `Maximalwert: ${fieldDef.max}${fieldDef.unit ? ' ' + fieldDef.unit : ''}`;
          trackValidationError(slug, 'range_overflow');
        } else {
          delete newFieldErrors[id];
        }
      }
    } else if (value === '' && fieldDef && fieldDef.type !== 'boolean') {
      newFieldErrors[id] = 'Eingabe erforderlich.';
    } else {
      delete newFieldErrors[id];
    }
    setFieldErrors(newFieldErrors);

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

        if (nextResult.error) {
          trackValidationError(slug, 'calculation_error');
        } else {
          debounceTrackCompleted();
        }
      } catch {
        trackValidationError(slug, 'calculation_exception');
        setResult({
          primary: { id: 'error', label: 'Fehler', value: 0, formattedValue: '-' },
          error: 'Bei der Berechnung ist ein unerwarteter Eingabefehler aufgetreten.',
        });
      }
    }
  };

  const handlePresetSelect = async (presetKey: string) => {
    const berlinParts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date()).split('-');
    const currentYear = parseInt(berlinParts[0], 10);
    const todayStr = berlinParts.join('-');

    let updatedInputs = { ...inputs };
    if (presetKey === 'heute') {
      if (inputs.mode === 'since') {
        updatedInputs.startDate = todayStr;
      } else {
        updatedInputs.endDate = todayStr;
      }
    } else if (presetKey === 'heiligabend') {
      updatedInputs.mode = 'until';
      updatedInputs.endDate = `${currentYear}-12-24`;
    } else if (presetKey === 'weihnachten') {
      updatedInputs.mode = 'until';
      updatedInputs.endDate = `${currentYear}-12-25`;
    } else if (presetKey === 'silvester') {
      updatedInputs.mode = 'until';
      updatedInputs.endDate = `${currentYear}-12-31`;
    } else if (presetKey === 'neujahr') {
      updatedInputs.mode = 'until';
      updatedInputs.endDate = `${currentYear + 1}-01-01`;
    } else if (presetKey === 'ostern') {
      updatedInputs.mode = 'until';
      updatedInputs.endDate = getUpcomingEasterDateString();
    }

    setInputs(updatedInputs);

    let fn = engineRef.current;
    if (!fn) {
      fn = await loadCalculatorEngine(slug);
      if (fn) engineRef.current = fn;
    }
    if (fn) {
      try {
        const res = fn(updatedInputs);
        setResult(res);
        if (res.error) {
          trackValidationError(slug, 'calculation_error');
        } else {
          trackCalculationCompleted(slug, category || 'allgemein');
        }
      } catch {
        trackValidationError(slug, 'calculation_exception');
      }
    }
  };

  const handleCopyShareLink = async () => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      for (const [key, val] of Object.entries(inputs)) {
        if (val !== undefined && val !== null && val !== '') {
          url.searchParams.set(key, String(val));
        }
      }
      await navigator.clipboard.writeText(url.toString());
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Fallback
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
        if (newRes.error) {
          trackValidationError(slug, 'calculation_error');
        } else {
          trackCalculationCompleted(slug, category || 'allgemein');
        }
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
        if (newRes.error) {
          trackValidationError(slug, 'calculation_error');
        } else {
          trackCalculationCompleted(slug, category || 'allgemein');
        }
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
        if (newRes.error) {
          trackValidationError(slug, 'calculation_error');
        } else {
          trackCalculationCompleted(slug, category || 'allgemein');
        }
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
    setFieldErrors({});
    setDynamicBreaks([30]);
    setInputs(defaultVals);
    if (engineRef.current) {
      try {
        const resetRes = engineRef.current(defaultVals);
        setResult(resetRes);
        if (resetRes.error) {
          trackValidationError(slug, 'calculation_error');
        } else {
          trackCalculationCompleted(slug, category || 'allgemein');
        }
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
      trackResultCopied(slug);
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

      {shortDescription && (
        <div className={styles.purposeBanner}>
          <strong>Zweck:</strong> {renderInlineMarkdown(shortDescription)}
        </div>
      )}

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

          {/* Dedicated Mode Selector and Presets for Tagerechner */}
          {slug === 'tage-zwischen-zwei-daten' && (
            <div className={styles.dateClusterSection}>
              <label className={styles.label}>Berechnungsmodus wählen</label>
              <div className={styles.modeSelector} role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={inputs.mode === 'between' || !inputs.mode}
                  className={`${styles.modeTab} ${inputs.mode === 'between' || !inputs.mode ? styles.modeTabActive : ''}`}
                  onClick={() => handleInputChange('mode', 'between')}
                >
                  Tage zwischen zwei Daten
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={inputs.mode === 'until'}
                  className={`${styles.modeTab} ${inputs.mode === 'until' ? styles.modeTabActive : ''}`}
                  onClick={() => handleInputChange('mode', 'until')}
                >
                  Tage bis zu einem Datum
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={inputs.mode === 'since'}
                  className={`${styles.modeTab} ${inputs.mode === 'since' ? styles.modeTabActive : ''}`}
                  onClick={() => handleInputChange('mode', 'since')}
                >
                  Tage seit einem Datum
                </button>
              </div>

              <div className={styles.presetsRow}>
                <span className={styles.presetsLabel}>Presets:</span>
                <button type="button" className={styles.presetBtn} onClick={() => handlePresetSelect('heute')}>Heute</button>
                <button type="button" className={styles.presetBtn} onClick={() => handlePresetSelect('heiligabend')}>Heiligabend</button>
                <button type="button" className={styles.presetBtn} onClick={() => handlePresetSelect('weihnachten')}>Weihnachten</button>
                <button type="button" className={styles.presetBtn} onClick={() => handlePresetSelect('silvester')}>Silvester</button>
                <button type="button" className={styles.presetBtn} onClick={() => handlePresetSelect('neujahr')}>Neujahr</button>
                <button type="button" className={styles.presetBtn} onClick={() => handlePresetSelect('ostern')}>Ostern</button>
              </div>
            </div>
          )}

          <div className={styles.inputGrid}>
            {inputDefs.map((field) => {
              // Special case: for arbeitszeitrechner, pauseMinutes is handled dynamically below
              if (slug === 'arbeitszeitrechner' && field.id === 'pauseMinutes') {
                return null;
              }

              // Mode selector for Tagerechner is already rendered above
              if (slug === 'tage-zwischen-zwei-daten' && field.id === 'mode') {
                return null;
              }

              const inputId = `${formId}-${field.id}`;

              // Automatic readonly date handling for until / since modes in Tagerechner
              if (slug === 'tage-zwischen-zwei-daten') {
                if (inputs.mode === 'until' && field.id === 'startDate') {
                  return (
                    <div key={field.id} className={styles.inputGroup}>
                      <label htmlFor={inputId} className={styles.label}>
                        Startdatum (Automatisch)
                      </label>
                      <input
                        id={inputId}
                        type="text"
                        readOnly
                        disabled
                        className={styles.input}
                        value={`Heute (${formatDateDe(new Date())})`}
                        style={{ backgroundColor: 'var(--color-background)', cursor: 'default' }}
                      />
                      <span className={styles.helpText}>Im Modus „Tage bis“ wird automatisch ab dem heutigen Tag gerechnet.</span>
                    </div>
                  );
                }
                if (inputs.mode === 'since' && field.id === 'endDate') {
                  return (
                    <div key={field.id} className={styles.inputGroup}>
                      <label htmlFor={inputId} className={styles.label}>
                        Enddatum (Automatisch)
                      </label>
                      <input
                        id={inputId}
                        type="text"
                        readOnly
                        disabled
                        className={styles.input}
                        value={`Heute (${formatDateDe(new Date())})`}
                        style={{ backgroundColor: 'var(--color-background)', cursor: 'default' }}
                      />
                      <span className={styles.helpText}>Im Modus „Tage seit“ wird automatisch bis zum heutigen Tag gerechnet.</span>
                    </div>
                  );
                }
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

              return (
                <div key={field.id} className={styles.inputGroup}>
                  <label htmlFor={inputId} className={styles.label}>
                    {field.label}
                    {field.unit && <span className={styles.unitBadge}>({field.unit})</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      id={inputId}
                      className={`${styles.select} ${fieldErrors[field.id] ? styles.inputInvalid : ''}`}
                      aria-invalid={Boolean(fieldErrors[field.id])}
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
                    <div className={styles.dateInputContainer}>
                      <input
                        id={inputId}
                        type="date"
                        lang="de"
                        className={`${styles.input} ${fieldErrors[field.id] ? styles.inputInvalid : ''}`}
                        aria-invalid={Boolean(fieldErrors[field.id])}
                        value={inputs[field.id] ?? ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                      {Boolean(inputs[field.id] && formatDateDe(inputs[field.id])) && (
                        <div className={styles.dateFormattedHint}>
                          <Calendar size={13} />
                          <span>Datum: {formatDateDe(inputs[field.id])}</span>
                        </div>
                      )}
                    </div>
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
                      className={`${styles.input} ${fieldErrors[field.id] ? styles.inputInvalid : ''}`}
                      aria-invalid={Boolean(fieldErrors[field.id])}
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
                      className={`${styles.input} ${fieldErrors[field.id] ? styles.inputInvalid : ''}`}
                      aria-invalid={Boolean(fieldErrors[field.id])}
                      value={inputs[field.id] ?? ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  )}

                  {fieldErrors[field.id] && (
                    <div className={styles.fieldError} role="alert">
                      <AlertCircle size={13} />
                      <span>{fieldErrors[field.id]}</span>
                    </div>
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
              {Object.keys(fieldErrors).length > 0 && (
                <div className={styles.staleNotice} role="alert">
                  <AlertTriangle size={15} />
                  <span>Eingaben unvollständig oder fehlerhaft. Das Ergebnis wird aktualisiert, sobald alle Felder gültig sind.</span>
                </div>
              )}

              {result.warning && (
                <div className={styles.warningAlert} role="status">
                  <AlertTriangle size={18} className={styles.warningIcon} />
                  <div>
                    <strong>Gesetzlicher Hinweis (§ 4 ArbZG)</strong>
                    <p>{result.warning}</p>
                  </div>
                </div>
              )}

              {/* Plain German direct answer at top of result */}
              {(result.directAnswer || result.summaryText) && (
                <div className={styles.directAnswerCard}>
                  <div className={styles.directAnswerHeader}>
                    <Check size={16} className={styles.directAnswerIcon} />
                    <span className={styles.directAnswerTitle}>Antwort auf einen Blick</span>
                  </div>
                  <p className={styles.directAnswerText}>
                    {result.directAnswer || result.summaryText}
                  </p>
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
                  {result.primary.helpText && (
                    <p style={{ margin: 'var(--space-2) 0 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                      {result.primary.helpText}
                    </p>
                  )}
                </div>

                {/* Material Qualifications & Inclusions */}
                {result.qualifications && result.qualifications.length > 0 && (
                  <div className={styles.qualificationsContainer}>
                    {result.qualifications.map((qual: string, qIdx: number) => (
                      <div key={qIdx} className={styles.qualificationBadge}>
                        <Info size={13} className={styles.qualificationIcon} />
                        <span>{qual}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Secondary Results Grid */}
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
                        {sec.helpText && (
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                            {sec.helpText}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Compact "Ihre Eingaben" Box */}
                <div className={styles.basisSummaryBox}>
                  <div className={styles.basisSummaryHeader}>
                    <span className={styles.basisSummaryTitle}>Ihre Eingaben</span>
                  </div>
                  <div className={styles.basisGrid}>
                    {(result.basisSummary && result.basisSummary.length > 0
                      ? result.basisSummary
                      : inputDefs
                          .filter((def) => !def.dependsOn || (inputs[def.dependsOn.field] === def.dependsOn.value))
                          .map((def) => ({
                            label: def.label,
                            value: inputs[def.id] !== undefined && inputs[def.id] !== ''
                              ? `${inputs[def.id]}${def.unit ? ' ' + def.unit : ''}`
                              : '–',
                          }))
                    ).map((bItem: { label: string; value: string }, bIdx: number) => (
                      <div key={bIdx} className={styles.basisItem}>
                        <span className={styles.basisLabel}>{bItem.label}</span>
                        <span className={styles.basisValue}>{bItem.value}</span>
                      </div>
                    ))}
                  </div>

                  {result.calculationSteps && result.calculationSteps.length > 0 && (
                    <div className={styles.stepsContainer}>
                      <div className={styles.stepsTitle}>Rechenschritte:</div>
                      {result.calculationSteps.map((step: string, sIdx: number) => (
                        <div key={sIdx} className={styles.stepItem}>{step}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Scope notice for date and legal calculations */}
                {(slug.includes('tage') || slug.includes('datum') || slug.includes('arbeitstage') || slug.includes('werktage') || slug.includes('alter')) && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)', lineHeight: 1.4 }}>
                    Berechnung basiert auf der Zeitzone Europe/Berlin (MEZ/MESZ) unter Berücksichtigung von Schaltjahren und Feiertagsgesetzen.
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

                {slug === 'tage-zwischen-zwei-daten' && (
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className={`${styles.actionBtn} ${linkCopied ? styles.actionBtnCopied : ''}`}
                    title="Link mit aktuellen Einstellungen kopieren"
                    aria-label="Link mit Parametern kopieren"
                  >
                    {linkCopied ? <Check size={14} /> : <Share2 size={14} />}
                    <span>{linkCopied ? 'Link kopiert!' : 'Link teilen'}</span>
                  </button>
                )}

                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Echtzeit-Berechnung
                </span>
              </div>
            </div>

            {/* Quick Navigation for Christmas countdown */}
            {slug === 'tage-bis-weihnachten' && (
              <div className={styles.quickNavBlock}>
                <h4 className={styles.quickNavTitle}>Weitere Zähler & Rechner</h4>
                <div className={styles.quickNavButtons}>
                  <Link href="/rechner/tage-zwischen-zwei-daten/?preset=silvester&mode=until" className={styles.quickNavBtn}>
                    <Sparkles size={14} />
                    <span>Countdown bis Silvester</span>
                  </Link>
                  <Link href="/rechner/tage-zwischen-zwei-daten/" className={styles.quickNavBtn}>
                    <Calendar size={14} />
                    <span>Allgemeiner Tagerechner</span>
                  </Link>
                </div>
              </div>
            )}
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
