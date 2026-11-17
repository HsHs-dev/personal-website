import { useEffect, useRef, useState } from 'react';
import { DoorEntrance, DOOR_IDS } from '../components/doors';
import type { DoorId, DoorInteraction, DoorMood } from '../components/doors';
import { useSystemReducedMotion } from '../components/doors/useSystemReducedMotion';
import { Icon } from './Scenes';
import { pageIndex, rooms, routeHref } from './content';
import { AboutPage, AccessibilityPage, BookPage, Colophon, ContactPage, ErrorPage, GardenPage, LibraryPage, LoadingPage, NotePage, NotFound, ProjectPage, SearchPage, SystemPage, WorkPage } from './Pages';
import breeze from './assets/breeze.mp3';
import rain from './assets/rain.mp3';
import stream from './assets/stream.mp3';
import './fonts.css';
import './styles.css';

type Preferences = { motion: 'system'|'reduced'; paused: boolean; paper: boolean; volume:number };
function read<T,>(key:string,fallback:T):T{try{return JSON.parse(localStorage.getItem(key)??'null')??fallback;}catch{return fallback;}}
function locationRoute(){try{return decodeURI(window.location.hash.slice(1)).replace(/^\//,'')||'';}catch{return 'missing';}}
const positions = new Map<string,number>();

export function DesignPreview() {
  const [route,setRoute]=useState(locationRoute);
  const [mood,setMood]=useState<DoorMood>(()=>read('hds-design-mood',window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'day'));
  const [mode,setMode]=useState<DoorInteraction>('enter');
  const [prefs,setPrefs]=useState<Preferences>(()=>read('hds-design-preferences',{motion:'system',paused:false,paper:false,volume:.5}));
  const [sound,setSound]=useState(false),[soundError,setSoundError]=useState('');
  const [inspect,setInspect]=useState(false);
  const systemReduced=useSystemReducedMotion();
  const reduced=prefs.motion==='reduced'||systemReduced;
  const preferenceDialog=useRef<HTMLDialogElement>(null),indexDialog=useRef<HTMLDialogElement>(null),main=useRef<HTMLElement>(null);
  const audio=useRef<HTMLAudioElement|null>(null);
  const path=route.split('?')[0],parts=path.split('/'),room=parts[0];
  const theme=['about','work','library','garden'].includes(room)?room:!path?mood:'utility';
  const single=new URLSearchParams(window.location.search).get('door') as DoorId|null;

  useEffect(()=>{const update=()=>{positions.set(route,window.scrollY);setRoute(locationRoute());};window.addEventListener('hashchange',update);return()=>window.removeEventListener('hashchange',update);},[route]);
  useEffect(()=>{
    document.querySelectorAll<HTMLDetailsElement>('.dp-room-menu').forEach(el=>el.open=false);
    const frame=requestAnimationFrame(()=>{main.current?.querySelector<HTMLHeadingElement>('h1')?.focus({preventScroll:true});window.scrollTo(0,positions.get(route)??0);document.title=`${main.current?.querySelector('h1')?.textContent??'Home'} — Hassan’s Digital Space · Design preview`;});
    return()=>cancelAnimationFrame(frame);
  },[route]);
  useEffect(()=>{try{localStorage.setItem('hds-design-mood',JSON.stringify(mood));localStorage.setItem('hds-design-preferences',JSON.stringify(prefs));}catch{/* Preferences still work when storage is blocked. */}},[mood,prefs]);
  const source=!path||room==='about'?breeze:room==='library'?rain:room==='garden'?stream:null;
  useEffect(()=>{
    if(!sound||!source)return;
    const player=new Audio(source);audio.current=player;player.loop=true;player.volume=0;
    const begin=()=>{if(!document.hidden)void player.play().catch(()=>setSoundError('Sound could not start. Turn sound off and enable it again.'));};
    const visibility=()=>{if(document.hidden)player.pause();else begin();};
    begin();document.addEventListener('visibilitychange',visibility);
    return()=>{player.pause();player.removeAttribute('src');player.load();if(audio.current===player)audio.current=null;document.removeEventListener('visibilitychange',visibility);};
  },[sound,source]);
  useEffect(()=>{
    const player=audio.current;if(!player)return;
    const target=prefs.volume*(room==='about'?.07:room==='garden'&&parts.length>1?.06:!path&&mood==='night'?.1:.14);
    const start=player.volume,started=performance.now();let frame=0;
    const fade=()=>{const t=Math.min(1,(performance.now()-started)/600);player.volume=start+(target-start)*t;if(t<1)frame=requestAnimationFrame(fade);};fade();return()=>cancelAnimationFrame(frame);
  },[prefs.volume,source,sound,room,mood,path,parts.length]);

  function showPreferences(){preferenceDialog.current?.showModal();}
  function toggleSound(){setSoundError('');setSound(!sound);}
  function page(){
    if(!path)return <><DoorEntrance mood={mood} onMoodChange={setMood} showControls={false} reducedMotion={reduced||prefs.paused} key={mode} interaction={mode} doors={single&&DOOR_IDS.includes(single)?[single]:undefined} onEnter={id=>{window.location.hash=id;}}/><div className="dp-home-shortcut"><p>Here for my work?</p><a className="dp-text-link" href="#work">Go straight to selected projects <Icon name="arrow" size={18}/></a></div></>;
    if(path==='about')return <AboutPage/>;
    if(path==='work')return <WorkPage/>;
    if(room==='work'&&parts.length===2)return <ProjectPage slug={parts[1]}/>;
    if(path==='library')return <LibraryPage/>;
    if(room==='library'&&parts.length===2)return <BookPage slug={parts[1]}/>;
    if(path==='garden')return <GardenPage/>;
    if(room==='garden'&&parts[1]==='topics'&&parts.length===3)return <GardenPage key={path} topic={parts[2]}/>;
    if(room==='garden'&&parts.length===2)return <NotePage key={path} slug={parts[1]}/>;
    if(path==='contact')return <ContactPage/>;
    if(path==='search')return <SearchPage key={route} query={new URLSearchParams(route.split('?')[1]).get('q')??''}/>;
    if(path==='colophon')return <Colophon/>;
    if(path==='accessibility')return <AccessibilityPage openPreferences={showPreferences}/>;
    if(path==='system')return <SystemPage/>;
    if(path==='loading')return <LoadingPage/>;
    if(path==='error')return <ErrorPage/>;
    return <NotFound/>;
  }
  return <div className={`dp-app theme-${theme} ${inspect?'dp-inspect':''}`} data-reduced={reduced} data-paused={prefs.paused} data-paper={prefs.paper}>
    <a className="dp-skip" href="#" onClick={e=>{e.preventDefault();main.current?.focus();}}>Skip to content</a>
    <div className="dp-preview-bar"><span><i/> HASSAN’S DIGITAL SPACE <b>/ DESIGN EDITION 01</b></span><div><button onClick={()=>indexDialog.current?.showModal()}>All pages <span>↗</span></button><a href="#system">Design system</a><button aria-pressed={inspect} onClick={()=>setInspect(!inspect)}>Inspect {inspect?'on':'off'}</button>{!path&&<><button aria-pressed={mode==='enter'} onClick={()=>setMode('enter')}>Enter a page</button><button aria-pressed={mode==='preview'} onClick={()=>setMode('preview')}>Peek inside</button></>}</div></div>
    <header className="dp-header"><a href="#" className="dp-wordmark" aria-label="Back to the house"><Icon name="home"/><span>Hassan’s<span className="wordmark-second"> digital space</span></span></a><nav aria-label="Main navigation"><details className="dp-room-menu" onKeyDown={e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();}}}><summary>Rooms <span aria-hidden="true">⌄</span></summary><div>{rooms.map(r=><a key={r.id} href={routeHref('/'+r.id)} aria-current={room===r.id?'page':undefined}><Icon name={r.id}/><span>{r.name}<small>{r.caption}</small></span><span>{r.number}</span></a>)}<a href="#contact"><Icon name="contact"/>Contact</a></div></details><a className="dp-header-direct" href="#work" aria-current={room==='work'?'page':undefined}>Work</a><a className="dp-header-direct" href="#contact">Contact</a><a href="#search" aria-label="Search the house"><Icon name="search"/></a>{!path&&<button aria-label="Night mood" aria-pressed={mood==='night'} onClick={()=>setMood(mood==='night'?'day':'night')}><Icon name={mood==='night'?'moon':'sun'}/><span>{mood==='night'?'Night':'Day'}</span></button>}<button aria-label="Environmental sound" aria-pressed={sound} onClick={toggleSound}><Icon name="sound"/><span className="dp-header-sound">{sound?'On':'Off'}</span></button><button aria-label="Preferences" onClick={showPreferences}><Icon name="settings"/></button></nav></header>
    <main ref={main} tabIndex={-1} key={route} className={`dp-main ${path?'door-demo-room':'dp-home'}`} data-room={room} data-mood={mood}>{path&&<div className="dp-breadcrumb"><a href="#">Home</a><span>/</span><span>{room==='system'?'Design system':room.charAt(0).toUpperCase()+room.slice(1)}</span>{parts.length>1&&<><span>/</span><span>{parts[parts.length-1].replaceAll('-',' ')}</span></>}</div>}{page()}</main>
    <footer className="dp-footer"><div><a className="dp-wordmark" href="#"><Icon name="home"/><span>A little home on the internet.</span></a><p>Still growing. Always curious.</p></div><nav aria-label="Footer"><a href="#">Back to the doors</a><a href="#colophon">Colophon</a><a href="#accessibility">Accessibility</a><a href="#contact">Contact</a></nav><span className="dp-meta">Interactive design preview · sample writing is labelled</span></footer>
    <dialog ref={indexDialog} className="dp-dialog dp-index-dialog" aria-labelledby="dp-index-title"><form method="dialog" className="dp-dialog-top"><span className="dp-eyebrow">THE WHOLE HOUSE</span><button aria-label="Close page index"><Icon name="close"/></button></form><h2 id="dp-index-title">Choose a page to explore.</h2><p>Every page and state in the design specification, in one place.</p><div className="dp-page-index">{pageIndex.map(([url,name,desc],i)=><a key={url} href={routeHref(url)} onClick={()=>indexDialog.current?.close()}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{name}</strong><small>{desc}</small></div><Icon name="arrow" size={18}/></a>)}</div></dialog>
    <dialog ref={preferenceDialog} className="dp-dialog" aria-labelledby="dp-preferences-title"><form method="dialog" className="dp-dialog-top"><span className="dp-eyebrow">MAKE YOURSELF COMFORTABLE</span><button aria-label="Close preferences"><Icon name="close"/></button></form><h2 id="dp-preferences-title">A little more your way.</h2><label className="dp-setting"><span>Environmental sound<small>Off by default. Work and utility pages stay quiet.</small></span><input type="checkbox" checked={sound} onChange={toggleSound}/></label><label className="dp-setting"><span>Volume<small>Quiet field recordings, never music.</small></span><input aria-label="Volume" type="range" min="0" max="1" step=".05" value={prefs.volume} onChange={e=>setPrefs({...prefs,volume:Number(e.target.value)})}/></label>{soundError&&<p role="status">{soundError}</p>}<label className="dp-setting"><span>Motion<small>System reduction is always respected.</small></span><select value={prefs.motion} onChange={e=>setPrefs({...prefs,motion:e.target.value as Preferences['motion']})}><option value="system">Follow system</option><option value="reduced">Reduced</option></select></label><label className="dp-setting"><span>Pause animated scenery<small>Keep the fireflies, water, and doors still.</small></span><input type="checkbox" checked={prefs.paused} onChange={e=>setPrefs({...prefs,paused:e.target.checked})}/></label><label className="dp-setting"><span>Paper reading in Garden<small>A warm paper surface for long entries.</small></span><input type="checkbox" checked={prefs.paper} onChange={e=>setPrefs({...prefs,paper:e.target.checked})}/></label><p className="dp-meta">Audio recordings are preview-quality audition assets. Source and license credits are in the <a href="#colophon" onClick={()=>preferenceDialog.current?.close()}>Colophon</a>.</p></dialog>
  </div>;
}
