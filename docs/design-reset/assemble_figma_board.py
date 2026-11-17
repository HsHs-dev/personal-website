from pathlib import Path
import xml.etree.ElementTree as ET
import re

OUT=Path(__file__).parent/'assets'
parts=['<rect width="4160" height="2280" fill="#292f2b"/>','<text x="60" y="72" fill="#f1e4c6" font-family="Arial" font-size="30">Hassan’s cottage · original vector composition studies</text>','<text x="60" y="108" fill="#b8bea6" font-family="Arial" font-size="18">Home + four rooms + mobile entrance · 15 November 2026 · Draft for direction review</text>']
for i,name in enumerate(['home','about','work','library','garden']):
    raw=(OUT/f'{name}-desktop.svg').read_text(encoding='utf-8')
    content=raw[raw.index('>')+1:raw.rindex('</svg>')]
    content=re.sub(r'id="([^"]+)"',lambda m:f'id="{name}-{m[1]}"',content)
    x=60+(i%3)*1360;y=170+(i//3)*1040
    parts.append(f'<g id="{name}-desktop-composition" transform="translate({x} {y})">{content}</g>')
mobile=(OUT/'home-mobile.svg').read_text(encoding='utf-8')
mobile=mobile[mobile.index('>')+1:mobile.rindex('</svg>')]
parts.append(f'<g id="home-mobile-composition" transform="translate(2780 1210)">{mobile}</g>')
parts.append('<text x="3240" y="1265" fill="#f1e4c6" font-family="Arial" font-size="26">A small home, four ways in.</text>')
for i,t in enumerate(['Original layered vector drawing.','Warm materials and believable depth.','Whole doors are clickable targets.','Mobile keeps all four doors visible.','The next pass develops realistic light,','material detail, and personal objects.']):
    parts.append(f'<text x="3240" y="1320" dy="{i*36}" fill="#b8bea6" font-family="Arial" font-size="19">{t}</text>')
parts.append('<text x="3240" y="1610" fill="#f1e4c6" font-family="Arial" font-size="22">References become principles:</text>')
for i,t in enumerate(['About — diary voice, objects tell a life.','Work — clarity, purpose, restraint.','Library — a private loft refuge.','Garden — fireflies, water, summer calm.']):
    parts.append(f'<text x="3240" y="1655" dy="{i*36}" fill="#b8bea6" font-family="Arial" font-size="19">{t}</text>')
board='<svg xmlns="http://www.w3.org/2000/svg" width="4160" height="2280" viewBox="0 0 4160 2280">'+''.join(parts)+'</svg>'
ET.fromstring(board)
(OUT/'cottage-composition-board.svg').write_text(board,encoding='utf-8')
print(f'Figma board: {len(board.encode()):,} bytes')
