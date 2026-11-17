import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { DOOR_DETAILS, DOOR_IDS } from './catalog';
import type { DoorScene } from './scene';
import type { DoorGalleryHandle, DoorGalleryProps, DoorId } from './types';
import { useSystemReducedMotion } from './useSystemReducedMotion';
import './doors.css';

type Status = 'loading' | 'ready' | 'entering' | 'arrived' | 'error';
// A different scene configuration needs fresh UI state and WebGL resources.
export const DoorGallery = forwardRef<DoorGalleryHandle, DoorGalleryProps>(function DoorGallery(props, ref) {
  const idsKey = [...new Set(props.doors ?? DOOR_IDS)].filter(id => DOOR_IDS.includes(id)).join(',') || DOOR_IDS.join(',');
  const maxPixelRatio = props.maxPixelRatio ?? 1.8;
  return <DoorGalleryScene key={JSON.stringify([idsKey, maxPixelRatio])} {...props} idsKey={idsKey} maxPixelRatio={maxPixelRatio} ref={ref} />;
});

const DoorGalleryScene = forwardRef<DoorGalleryHandle, DoorGalleryProps & { idsKey: string }>(function DoorGalleryScene({ idsKey, mood = 'night', interaction, onEnter, onEnterStart, onError, reducedMotion, sound = false, onDoorSound, maxPixelRatio = 1.8, resetKey, className = '', style }, ref) {
  const ids = useMemo(() => idsKey.split(',') as DoorId[], [idsKey]);
  const systemReduced = useSystemReducedMotion();
  const reduced = reducedMotion ?? systemReduced;
  const mode = interaction ?? (onEnter ? 'enter' : 'preview');
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null), veil = useRef<HTMLDivElement>(null);
  const labels = useRef(new Map<DoorId, HTMLButtonElement>());
  const engine = useRef<DoorScene | null>(null);
  const generation = useRef(0), mounted = useRef(false), busyRef = useRef(false);
  const [status, setStatus] = useState<Status>('loading');
  const [selected, setSelected] = useState<DoorId | null>(null);
  const [hovered, setHovered] = useState<DoorId | null>(null);
  const [sceneError, setSceneError] = useState('');
  const [navigationError, setNavigationError] = useState('');
  const descriptionId = useId();
  const busy = status === 'entering' || status === 'arrived' || status === 'error';
  const latest = useRef({ mood, reduced, onError });
  useEffect(() => { latest.current = { mood, reduced, onError }; engine.current?.setMood(mood); engine.current?.setReducedMotion(reduced); }, [mood, reduced, onError]);

  const reset = useCallback(() => {
    generation.current++; busyRef.current = false;
    engine.current?.reset();
    if (veil.current) veil.current.style.opacity = '0';
    setStatus(engine.current || sceneError ? 'ready' : 'loading');
    setSelected(null); setNavigationError(''); setHovered(null);
  }, [sceneError]);
  useImperativeHandle(ref, () => ({ reset }), [reset]);

  function playSound(id: DoorId) {
    if (sound) { try { onDoorSound?.(id); } catch { /* Optional host audio cannot block navigation. */ } }
  }

  async function choose(id: DoorId) {
    if (busyRef.current || status === 'loading') return;
    playSound(id);
    if (mode === 'preview') { const next = selected === id ? null : id; setSelected(next); engine.current?.preview(next); return; }
    busyRef.current = true;
    root.current?.focus({ preventScroll: true });
    const token = ++generation.current;
    setSelected(id); setHovered(null); setStatus('entering');
    try {
      onEnterStart?.(id);
      if (engine.current && !sceneError) await engine.current.enter(id);
      else if (veil.current) veil.current.style.opacity = '1';
      if (!mounted.current || token !== generation.current) return;
      await onEnter?.(id);
      if (mounted.current && token === generation.current) setStatus('arrived');
    } catch (reason) {
      if (!mounted.current || token !== generation.current || (reason instanceof DOMException && reason.name === 'AbortError')) return;
      const error = reason instanceof Error ? reason : new Error(String(reason));
      if (veil.current) veil.current.style.opacity = '1';
      setNavigationError('This room could not be opened. Return to the doors and try again.');
      setStatus('error'); onError?.(error);
    }
  }
  const selectRef = useRef(choose);
  useEffect(() => { selectRef.current = choose; });

  useEffect(() => {
    mounted.current = true;
    let cancelled = false, local: DoorScene | null = null;
    if (veil.current) veil.current.style.opacity = '0';
    labels.current.forEach(label => { label.style.opacity = '1'; });
    const timer = { id: 0 };
    const fonts = document.fonts ? Promise.allSettled([document.fonts.load('600 52px HDSCaveat'), document.fonts.load('600 30px HDSLora'), document.fonts.load('600 20px HDSBody')]) : Promise.resolve();
    const timeout = new Promise<void>(resolve => { timer.id = window.setTimeout(resolve, 2000); });
    void Promise.all([import('./scene'), Promise.race([fonts, timeout])]).then(([module]) => {
      clearTimeout(timer.id);
      if (cancelled || !canvas.current || !stage.current || !veil.current) return;
      local = module.createDoorScene({ canvas: canvas.current, container: stage.current, veil: veil.current, labels: labels.current, ids, mood: latest.current.mood, reducedMotion: latest.current.reduced, maxPixelRatio,
        onSelect: id => { void selectRef.current(id); },
        onHover: id => { if (mounted.current) setHovered(id); },
        onError: error => { if (mounted.current) { setSceneError(error.message); latest.current.onError?.(error); } },
      });
      engine.current = local; setStatus('ready');
    }).catch(reason => {
      if (cancelled) return;
      const error = reason instanceof Error ? reason : new Error(String(reason));
      setSceneError('The 3D scene is unavailable. The door buttons still work.'); setStatus('ready'); latest.current.onError?.(error);
    });
    return () => { cancelled = true; mounted.current = false; busyRef.current = false; clearTimeout(timer.id); local?.dispose(); if (engine.current === local) engine.current = null; };
  }, [ids, maxPixelRatio]);

  const previousReset = useRef(resetKey);
  useEffect(() => { if (previousReset.current !== resetKey) { previousReset.current = resetKey; reset(); } }, [resetKey, reset]);
  function hover(id: DoorId | null) { if (!busy) { setHovered(id); engine.current?.hover(id); } }
  function close() { const id = selected; reset(); if (id) requestAnimationFrame(() => { if (mounted.current) labels.current.get(id)?.focus({ preventScroll: true }); }); }

  return <section ref={root} tabIndex={-1} className={`hds-doors hds-gallery ${className}`} data-mood={mood} data-reduced={reduced} data-count={ids.length} data-selected={selected ?? undefined} data-status={status} data-fallback={!!sceneError} style={style} aria-label="Doors into Hassan's digital space" onKeyDown={event => { if (event.key === 'Escape' && selected) { event.preventDefault(); close(); } }}>
    <div className="hds-stage" ref={stage}>
      <canvas ref={canvas} className="hds-canvas" aria-hidden="true" />
      <div className="hds-labels">
        {ids.map(id => <button key={id} ref={element => { if (element) labels.current.set(id, element); else labels.current.delete(id); }} className={`hds-label ${hovered === id ? 'is-hovered' : ''}`} data-door={id} disabled={status === 'loading' || busy} aria-expanded={mode === 'preview' ? selected === id : undefined} aria-describedby={descriptionId} onClick={() => void choose(id)} onPointerEnter={event => { if (event.pointerType !== 'touch') hover(id); }} onPointerLeave={() => hover(null)} onFocus={event => { if (event.currentTarget.matches(':focus-visible')) hover(id); }} onBlur={() => hover(null)}>
          <span className="hds-number">0{DOOR_IDS.indexOf(id) + 1}</span><span className="hds-name">{DOOR_DETAILS[id].name}</span><span className="hds-description">{DOOR_DETAILS[id].description}</span><span className="hds-invitation">{mode === 'preview' && selected === id ? 'Close the door ×' : `${DOOR_DETAILS[id].invitation} ↗`}</span>
        </button>)}
      </div>
      {status === 'loading' && <div className="hds-loading" role="status"><span className="hds-loading-door" /><p>Entering the home…</p></div>}
      {!!sceneError && <p className="hds-fallback-message" role="status">{sceneError}</p>}
    </div>
    <div className="hds-caption"><span aria-hidden="true">✳</span><p id={descriptionId} role="status" aria-live="polite">{status === 'entering' && selected ? `Entering ${DOOR_DETAILS[selected].name.toLowerCase()}…` : selected && mode === 'preview' ? DOOR_DETAILS[selected].glimpse : ids.length === 4 ? 'Four doors. Different parts of me. All connected.' : 'Make yourself at home.'}</p>{selected && mode === 'preview' && <button onClick={close}>Close the door ×</button>}</div>
    <div ref={veil} className="hds-entry-veil" aria-hidden="true" />
    {busy && <div className="hds-entry-status" role="status" aria-live="polite"><p>{status === 'error' ? navigationError : status === 'arrived' && selected ? `${DOOR_DETAILS[selected].name} is ready.` : selected ? `Entering ${DOOR_DETAILS[selected].name.toLowerCase()}…` : ''}</p><button onClick={close}>{status === 'entering' ? 'Cancel' : 'Back to the doors'}</button></div>}
  </section>;
});
