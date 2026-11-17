import { useState } from 'react';
import { DoorGallery, useSystemReducedMotion } from './DoorGallery';
import type { DoorEntranceProps, DoorMood, DoorProps } from './types';

/** Ready-to-use entrance shell. Does not mutate body, routes, localStorage or document styles. */
export function DoorEntrance({ title = 'Hassan’s digital space', subtitle = 'Choose a door to enter.', initialMood = 'night', mood: controlledMood, onMoodChange, showControls = true, reducedMotion, sound: controlledSound, className = '', style, ...gallery }: DoorEntranceProps) {
  const [localMood, setLocalMood] = useState<DoorMood>(initialMood);
  const [localSound, setLocalSound] = useState(false);
  const [motionOverride, setMotionOverride] = useState<boolean | undefined>();
  const systemReduced = useSystemReducedMotion();
  const mood = controlledMood ?? localMood;
  const reduced = reducedMotion ?? motionOverride ?? systemReduced;
  const sound = controlledSound ?? localSound;
  function toggleMood() { const next = mood === 'night' ? 'day' : 'night'; if (controlledMood === undefined) setLocalMood(next); onMoodChange?.(next); }
  return <div className={`hds-doors hds-entrance ${className}`} data-mood={mood} data-reduced={reduced} style={style}>
    <header className="hds-topbar"><span className="hds-home-mark"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 11 12 3l9 8M6 9v12h12V9M10 21v-7h4v7" /></svg><span>A LITTLE HOME ON THE INTERNET</span></span>
      {showControls && <div className="hds-controls"><button aria-label="Night mood" aria-pressed={mood === 'night'} onClick={toggleMood} disabled={controlledMood !== undefined && !onMoodChange}><span aria-hidden="true">{mood === 'night' ? '☾' : '☀'}</span><span>{mood === 'night' ? 'Night' : 'Afternoon'}</span></button><button aria-label="Reduce motion" aria-pressed={reduced} onClick={() => setMotionOverride(!reduced)} disabled={reducedMotion !== undefined}><span aria-hidden="true">≈</span><span>{reduced ? 'Still' : 'Motion'}</span></button><button aria-label="Door sounds" aria-pressed={sound} onClick={() => setLocalSound(!sound)} disabled={controlledSound !== undefined}><span aria-hidden="true">{sound ? '♫' : '♩'}</span><span>{sound ? 'Sound on' : 'Sound off'}</span></button></div>}
    </header>
    <div className="hds-heading"><p>make yourself at home.</p><h1>{title}<span>.</span></h1><p>{subtitle}</p></div>
    <DoorGallery {...gallery} mood={mood} reducedMotion={reduced} sound={sound} />
    <footer className="hds-footer"><span>Still growing. Always curious.</span><span>Made with a little wonder ✧</span></footer>
  </div>;
}

/** Single-door component. Prefer DoorGallery for several doors to share one WebGL context. */
export function Door({ door, ...props }: DoorProps) { return <DoorGallery {...props} doors={[door]} />; }
