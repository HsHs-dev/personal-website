import { useCallback, useEffect, useRef } from 'react';

type Cue = 'hover' | 'press' | 'release' | 'door';

/** Original short wood/paper-like transients; no music or borrowed UI recordings. */
export function useInteractionAudio(enabled: boolean, volume: number) {
  const context = useRef<AudioContext | null>(null);
  const last = useRef(0);
  useEffect(() => () => { void context.current?.close(); context.current = null; }, []);
  useEffect(() => {
    if (!enabled && context.current?.state === 'running') void context.current.suspend();
  }, [enabled]);
  const play = useCallback((cue: Cue, variant = 0, force = false) => {
    if ((!enabled && !force) || document.hidden || volume === 0) return;
    if (cue === 'hover' && performance.now() - last.current < 90) return;
    last.current = performance.now();
    try {
      const ctx = context.current ??= new AudioContext();
      if (ctx.state === 'suspended') void ctx.resume();
      const duration = cue === 'door' ? .46 : cue === 'hover' ? .026 : .065;
      const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        const envelope = Math.min(1, t / .003) * Math.exp(-t / (cue === 'door' ? .11 : .012));
        data[i] = (Math.random() * 2 - 1) * envelope;
      }
      const noise = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
      noise.buffer = buffer; filter.type = 'bandpass';
      filter.frequency.value = cue === 'door' ? 380 + variant * 110 : cue === 'hover' ? 1700 : cue === 'press' ? 850 : 1300;
      filter.Q.value = cue === 'door' ? 1.8 : .7;
      gain.gain.value = volume * (cue === 'door' ? .5 : cue === 'hover' ? .07 : .22);
      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.onended = () => { noise.disconnect(); filter.disconnect(); gain.disconnect(); };
      noise.start();
    } catch { /* Optional audio must never interrupt navigation. */ }
  }, [enabled, volume]);
  return play;
}
