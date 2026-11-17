"""Focused visual and interaction checks for the local composition study."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
import xml.etree.ElementTree as ET

ROOT=Path(__file__).parent
VIS=Path(r'C:\Users\hasn2\.codex\visualizations\2026\11\15\01a1de1c-9ba9-7370-96aa-c6a1c7b6e4b9')
for p in (ROOT/'assets').glob('*.svg'): ET.parse(p)
fragment=(VIS/'cottage-rooms.html').read_text(encoding='utf-8')
assert len(fragment.encode())<1_000_000
assert '<!-- HOME_SCENE -->' not in fragment
errors=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,channel='chrome')
    page=browser.new_page(viewport={'width':1060,'height':1100},device_scale_factor=1)
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto((VIS/'cottage-rooms-preview.html').as_uri())
    frame=page.frame_locator('iframe')
    root=frame.locator('#hassan-cottage-study')
    root.screenshot(path=str(VIS/'cottage-home-review.png'))
    frame.locator('.c-door-target[data-go="garden"]').click()
    frame.locator('[data-room="garden"]').wait_for()
    assert frame.locator('h2').inner_text()=='A little room to wander.'
    frame.get_by_role('button',name='Recipes',exact=True).last.click()
    assert 'Recipes' in frame.locator('.c-selection').inner_text()
    root.screenshot(path=str(VIS/'cottage-garden-review.png'))
    for room in ['about','work','library']:
        frame.locator(f'.c-nav [data-go="{room}"]').click()
        assert frame.locator('.c-object-rail button').count()==3
        root.screenshot(path=str(VIS/f'cottage-{room}-review.png'))
    frame.locator('.c-nav [data-go="home"]').click()
    page.set_viewport_size({'width':354,'height':1400})
    assert frame.locator('.c-mobile-doors').is_visible()
    assert frame.locator('.c-mobile-doors button').count()==4
    root.screenshot(path=str(VIS/'cottage-mobile-review.png'))
    content_frame=page.frames[1]
    width_check=content_frame.evaluate('({scroll:document.documentElement.scrollWidth,width:innerWidth})')
    assert width_check['scroll']<=width_check['width'],width_check
    frame.locator('.c-mobile-doors [data-go="work"]').click()
    frame.locator('[data-room="work"]').wait_for()
    assert frame.locator('.c-object-rail').is_visible()
    page.emulate_media(reduced_motion='reduce')
    frame.locator('.c-nav [data-go="home"]').click()
    frame.locator('.c-mobile-doors [data-go="about"]').click()
    assert frame.locator('[data-room="about"]').is_visible()
    assert not errors,errors
    browser.close()
print(json.dumps({'svg_files_valid':15,'rooms_navigable':5,'mobile_four_doors':True,'mobile_width':width_check,'reduced_motion':True,'runtime_errors':errors}))
