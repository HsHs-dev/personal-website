import { test, expect } from '@playwright/test';
import { pageIndex } from '../../src/design-preview/content';

test('every design page renders at desktop and phone widths without overflow or runtime errors', async ({ page }) => {
  test.setTimeout(120_000);
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [1440,390,320]) {
    await page.setViewportSize({width,height:900});
    for(const [path] of pageIndex) {
      await page.goto('/door-preview.html#'+path.replace(/^\//,''));
      await expect(page.locator('main h1')).toBeVisible();
      await page.evaluate(()=>document.fonts.ready);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${path} at ${width}px overflows`).toBeTruthy();
    }
  }
  expect(errors).toEqual([]);
});

test('page index navigates and preferences trap focus, persist, and apply paper reading',async({page})=>{
  await page.goto('/door-preview.html#garden/learning-by-making');
  await page.getByRole('button',{name:'Preferences',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'A little more your way.'});
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Paper reading in Garden',{exact:false}).check();
  await dialog.getByLabel('Pause animated scenery',{exact:false}).check();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:'Preferences',exact:true})).toBeFocused();
  await expect(page.locator('.dp-app')).toHaveAttribute('data-paper','true');
  await expect(page.locator('.dp-garden-paper')).toHaveCSS('background-color','rgb(244, 236, 221)');
  await page.reload();
  await expect(page.locator('.dp-app')).toHaveAttribute('data-paused','true');
  await page.getByRole('button',{name:'All pages',exact:false}).click();
  await page.getByRole('dialog').getByRole('link',{name:/Book record/}).click();
  await expect(page).toHaveURL(/#library\/deep-work$/);
  await expect(page.locator('main h1')).toHaveText('Deep Work');
});

test('library filters, list view, book records, and garden filters work',async({page})=>{
  await page.goto('/door-preview.html#library');
  await expect(page.locator('.dp-book')).toHaveCount(6);
  await page.getByRole('button',{name:'Fiction',exact:true}).click();
  await expect(page.locator('.dp-book')).toHaveCount(1);
  await page.getByRole('button',{name:'List',exact:true}).click();
  await expect(page.locator('.dp-book-list')).toBeVisible();
  await page.locator('.dp-book').click();
  await expect(page.locator('main h1')).toHaveText('Crime and Punishment');
  await page.goto('/door-preview.html#garden');
  await page.getByRole('button',{name:'Films & games',exact:true}).click();
  await expect(page.locator('.dp-note-list article')).toHaveCount(2);
  await page.locator('.dp-note-list a').first().click();
  await page.getByText('Show spoilers',{exact:true}).click();
  await expect(page.locator('.dp-spoiler')).toHaveAttribute('open','');
});

test('search supports shareable queries and empty recovery; recipe checkboxes reset',async({page})=>{
  await page.goto('/door-preview.html#search');
  await page.getByRole('searchbox').fill('habits');
  await page.getByRole('button',{name:'Search',exact:true}).click();
  await expect(page).toHaveURL(/#search\?q=habits$/);
  await expect(page.locator('.dp-result')).toHaveCount(2);
  await page.getByRole('searchbox').fill('nothing-matches-this');
  await page.getByRole('button',{name:'Search',exact:true}).click();
  await expect(page.getByText('Nothing here just yet.')).toBeVisible();
  await page.getByRole('button',{name:'Clear filters'}).click();
  await expect(page.locator('.dp-result')).toHaveCount(15);
  await page.goto('/door-preview.html#garden/tea-after-rain');
  await page.locator('.dp-ingredients input').first().check();
  await expect(page.locator('.dp-ingredients input').first()).toBeChecked();
  await page.getByRole('button',{name:'Reset ingredients'}).click();
  await expect(page.locator('.dp-ingredients input').first()).not.toBeChecked();
});

test('audio is not requested before opt-in and contact copying reports success',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  const audioRequests:string[]=[];page.on('request',request=>{if(request.resourceType()==='media' && request.url().includes('.mp3'))audioRequests.push(request.url());});
  await page.goto('/door-preview.html#garden');
  await expect(page.locator('main h1')).toBeVisible();
  expect(audioRequests).toEqual([]);
  await page.getByRole('button',{name:'Environmental sound',exact:true}).click();
  await expect.poll(()=>audioRequests.length).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Environmental sound',exact:true}).click();
  await page.goto('/door-preview.html#contact');
  await page.getByRole('button',{name:'Copy email',exact:true}).click();
  await expect(page.getByRole('button',{name:'Copied',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('officialhassansmail@gmail.com');
});

test('icons and arrival animate, while reduced motion stops both',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/door-preview.html#loading');
  await expect(page.locator('.arrival-leaf')).toHaveCSS('animation-name','dp-arrival-open');
  await page.getByRole('button',{name:'Preferences',exact:true}).hover();
  await expect(page.locator('.icon-slider-one')).not.toHaveCSS('transform','none');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('.arrival-leaf')).toHaveCSS('animation-name','none');
  await expect(page.locator('.icon-slider-one')).toHaveCSS('transform','none');
});

test('interaction audio stays silent until enabled and stops when muted',async({page})=>{
  await page.addInitScript(()=>{
    const original=AudioContext.prototype.createBufferSource;
    Object.assign(window,{cueCount:0});
    AudioContext.prototype.createBufferSource=function(){
      const state=window as unknown as {cueCount:number};state.cueCount++;
      return original.call(this);
    };
  });
  await page.goto('/door-preview.html#system');
  await page.getByRole('button',{name:'Primary action',exact:true}).click();
  const count=()=>page.evaluate(()=>(window as unknown as {cueCount:number}).cueCount);
  expect(await count()).toBe(0);
  await page.getByRole('button',{name:'Environmental sound',exact:true}).click();
  await page.getByRole('button',{name:'Secondary action',exact:true}).click();
  expect(await count()).toBeGreaterThan(1);
  await page.getByRole('button',{name:'Environmental sound',exact:true}).click();
  const mutedCount=await count();
  await page.getByRole('button',{name:'Secondary action',exact:true}).click();
  expect(await count()).toBe(mutedCount);
});
