from pathlib import Path
import re

HERE=Path(__file__).parent
VIS=Path(r'C:\Users\hasn2\.codex\visualizations\2026\11\15\01a1de1c-9ba9-7370-96aa-c6a1c7b6e4b9')
source=(VIS/'cottage-rooms-source.html').read_text(encoding='utf-8')

def inline(file,key):
    markup=(HERE/'assets'/file).read_text(encoding='utf-8')
    # SVG group names remain unique across simultaneous scenes and door thumbnails.
    if key.endswith('_DOOR'):
        markup=re.sub(r'id="([^"]+)"',lambda m:f'id="thumb-{m[1]}"',markup)
        markup=markup.replace('role="img"','aria-hidden="true"')
    return markup

for name in ['home','about','work','library','garden']:
    source=source.replace(f'<!-- {name.upper()}_SCENE -->',inline(f'{name}-scene.svg',name.upper()+'_SCENE'))
for name in ['about','work','library','garden']:
    source=source.replace(f'<!-- {name.upper()}_DOOR -->',inline(f'{name}-door.svg',name.upper()+'_DOOR'))
out=VIS/'cottage-rooms.html'
out.write_text(source,encoding='utf-8')
print(f'{out}: {out.stat().st_size:,} bytes')
