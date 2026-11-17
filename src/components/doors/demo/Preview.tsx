import { useEffect, useRef, useState } from 'react';
import { DoorEntrance, DOOR_DETAILS, DOOR_IDS } from '../index';
import type { DoorId, DoorInteraction, DoorMood } from '../index';

function currentRoom(): DoorId | null {
  const value = window.location.hash.slice(1) as DoorId;
  return DOOR_IDS.includes(value) ? value : null;
}

export function Preview() {
  const [room, setRoom] = useState<DoorId | null>(currentRoom);
  const [mode, setMode] = useState<DoorInteraction>('enter');
  const [mood, setMood] = useState<DoorMood>('night');
  const heading = useRef<HTMLHeadingElement>(null);
  const single = new URLSearchParams(window.location.search).get('door') as DoorId | null;
  useEffect(() => { const update = () => setRoom(currentRoom()); window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update); }, []);
  useEffect(() => { if (room) heading.current?.focus(); }, [room]);
  return <>
    {!room && <nav className="door-demo-toolbar" aria-label="Component preview options"><span>COMPONENT PREVIEW</span><button aria-pressed={mode === 'enter'} onClick={() => setMode('enter')}>Enter a page</button><button aria-pressed={mode === 'preview'} onClick={() => setMode('preview')}>Peek inside</button></nav>}
    {room ? <main className="door-demo-room" data-mood={mood} data-room={room}><p className="door-demo-eyebrow">YOU’VE ENTERED THE {DOOR_DETAILS[room].name.toUpperCase()}</p><h1 ref={heading} tabIndex={-1}>{DOOR_DETAILS[room].name}</h1><p>{DOOR_DETAILS[room].glimpse}</p><div className="door-demo-note">This is the navigation handoff, not a finished room.<br/>Replace it with your real {DOOR_DETAILS[room].name.toLowerCase()} page.</div><a href="#">← Back to the doors</a></main> : <DoorEntrance key={mode} mood={mood} onMoodChange={setMood} doors={single && DOOR_IDS.includes(single) ? [single] : undefined} interaction={mode} onEnter={id => { window.location.hash = id; }} />}
  </>;
}
