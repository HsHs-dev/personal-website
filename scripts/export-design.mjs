import { chromium } from '@playwright/test';
import { mkdir, writeFile, readFile, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pageIndex, projects, books } from '../src/design-preview/content.ts';

const root = resolve('docs/design-frames');
const base = process.env.DESIGN_PREVIEW_URL || 'http://127.0.0.1:5175/door-preview.html';
const frames = pageIndex.map(([route, title, description]) => ({ route, title, description, id: route === '/' ? 'home-day' : route.slice(1).replaceAll('/', '-') }));
for (const [prefix, items] of [['work', projects], ['library', books]]) {
  for (const item of items) {
    const route = `/${prefix}/${item.slug}`;
    if (!frames.some(frame => frame.route === route)) frames.push({route, title:item.title, description:`${prefix} detail`, id:route.slice(1).replaceAll('/', '-')});
  }
}
frames.push(
  {id:'home-night',route:'/',title:'Home · night',mood:'night'},
  {id:'library-list',route:'/library',title:'Library · list',action:page=>page.getByRole('button',{name:'List',exact:true}).click()},
  {id:'library-fiction',route:'/library',title:'Library · filtered',action:page=>page.getByRole('button',{name:'Fiction',exact:true}).click()},
  {id:'garden-paper',route:'/garden/learning-by-making',title:'Essay · paper reading',paper:true},
  {id:'search-results',route:'/search?q=learning',title:'Search · results'},
  {id:'search-empty',route:'/search?q=zzzznotfound',title:'Search · no results'},
  {id:'preferences',route:'/about',title:'Preferences dialog',dialog:true,action:page=>page.getByRole('button',{name:'Preferences',exact:true}).click()},
  {id:'rooms-menu',route:'/about',title:'Rooms navigation',dialog:true,action:page=>page.locator('.dp-room-menu summary').click()},
  {id:'recipe-checked',route:'/garden/tea-after-rain',title:'Recipe · checked ingredients',action:page=>page.locator('.dp-ingredients input').first().check()},
);
for (const id of ['about','work','library','garden']) frames.push({id:`door-${id}-open`,route:'/',title:`${id} door · atmospheric peek`,action:async page=>{
  await page.getByRole('button',{name:'Peek inside',exact:true}).click();
  await page.locator('.hds-gallery[data-status=ready]').waitFor();
  await page.locator(`[data-door="${id}"]`).click();
}});

await mkdir(root,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const exported=[];
try {
  for (const [device,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    await mkdir(resolve(root,device),{recursive:true});
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
    for (const frame of frames) {
      const page=await context.newPage();
      const errors=[];page.on('pageerror',error=>errors.push(error.message));
      await page.addInitScript(({mood,paper})=>{
        localStorage.setItem('hds-design-mood',JSON.stringify(mood));
        localStorage.setItem('hds-design-preferences',JSON.stringify({motion:'reduced',paused:true,paper,volume:0}));
      },{mood:frame.mood||'day',paper:!!frame.paper});
      await page.goto(base+'#'+frame.route.replace(/^\//,''));
      await page.locator('main h1').waitFor();
      await page.evaluate(()=>document.fonts.ready);
      if(frame.route==='/')await page.locator('.hds-gallery[data-status=ready]').waitFor();
      if(frame.action)await frame.action(page);
      await page.addStyleTag({content:'.dp-preview-bar{display:none!important}.dp-main{animation:none!important}.dp-inspect .dp-main:after{display:none!important}'});
      await page.mouse.move(width-1,height-1);
      await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();window.scrollTo(0,0);});
      await page.waitForTimeout(180);
      if(errors.length)throw new Error(frame.id+': '+errors.join('; '));
      const metrics=await page.evaluate(()=>{
        const app=document.querySelector('.dp-app'),style=getComputedStyle(app);
        return {width:innerWidth,height:document.documentElement.scrollHeight,theme:app.className,colors:Object.fromEntries(['bg','surface','ink','muted','accent','on-accent'].map(key=>[key,style.getPropertyValue('--dp-'+key).trim()])),elements:[...document.querySelectorAll('main h1,main h2,main h3,main .dp-lead,main .dp-button,header,main,footer,dialog[open]')].map(el=>{
          const s=getComputedStyle(el),r=el.getBoundingClientRect();return {tag:el.tagName,text:el.textContent?.trim().slice(0,100),x:Math.round(r.x),y:Math.round(r.y+scrollY),width:Math.round(r.width),height:Math.round(r.height),font:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,color:s.color,background:s.backgroundColor};
        })};
      });
      const path=`${device}/${frame.id}.png`;
      await page.screenshot({path:resolve(root,path),fullPage:!frame.dialog,animations:'disabled'});
      await page.screenshot({path:resolve(root,device,frame.id+'.jpg'),type:'jpeg',quality:70,fullPage:false,animations:'disabled'});
      const entry={id:frame.id,title:frame.title,description:frame.description||'Interaction / appearance variant',route:frame.route,device,file:path,thumbnail:`${device}/${frame.id}.jpg`,width,height:frame.dialog?height:metrics.height,live:base+'#'+frame.route.replace(/^\//,''),metrics};
      exported.push(entry);
      await writeFile(resolve(root,device,frame.id+'.json'),JSON.stringify(entry,null,2));
      await page.close();
      console.log(`${device}: ${frame.id}`);
    }
    await context.close();
  }
} finally {await browser.close();}
const manifest={exportedAt:new Date().toISOString(),scale:1,notes:'Static review frames, not editable vector layers. Motion paused; audio off; preview toolbar hidden. PNG dimensions are CSS pixels at 1x.',frames:exported};
await writeFile(resolve(root,'manifest.json'),JSON.stringify(manifest,null,2));
const template=await readFile(resolve('scripts/design-board.html'),'utf8');
await writeFile(resolve(root,'index.html'),template.replace('/* FRAME_DATA */',JSON.stringify(manifest).replaceAll('<','\\u003c')));
await copyFile('docs/design-system/palette.json',resolve(root,'palette.json'));
console.log(`Exported ${exported.length} frames to ${root}`);
