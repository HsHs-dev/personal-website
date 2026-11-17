"""Original, deterministic vector composition studies. No raster or external assets.

Run from any directory with Python. Outputs are layered SVGs for design review
and import into Figma; these are not production website components.
"""
from pathlib import Path
from html import escape
import math

OUT = Path(__file__).parent / 'assets'
OUT.mkdir(exist_ok=True)

def tag(name, content='', **attrs):
    at = ' '.join(f'{k.replace("_", "-")}="{escape(str(v), quote=True)}"' for k, v in attrs.items() if v is not None)
    return f'<{name} {at}>{content}</{name}>'

def group(name, content, transform=None):
    return tag('g', content, id=name, transform=transform)

def rect(x,y,w,h,fill,r=0,**kw):
    return tag('rect', x=x,y=y,width=w,height=h,fill=fill,rx=r,**kw)

def path(d,fill='none',stroke=None,sw=1,**kw):
    return tag('path',d=d,fill=fill,stroke=stroke,stroke_width=sw,stroke_linecap='round',stroke_linejoin='round',**kw)

def line(x1,y1,x2,y2,c,w=1,**kw):
    return tag('line',x1=x1,y1=y1,x2=x2,y2=y2,stroke=c,stroke_width=w,**kw)

def ellipse(x,y,rx,ry,fill,**kw):
    return tag('ellipse',cx=x,cy=y,rx=rx,ry=ry,fill=fill,**kw)

def circle(x,y,r,fill,**kw):
    return tag('circle',cx=x,cy=y,r=r,fill=fill,**kw)

def text(x,y,value,size=18,color='#44372b',font='Georgia',**kw):
    return tag('text',escape(value),x=x,y=y,fill=color,font_family=font,font_size=size,**kw)

def leaf(x,y,s,angle,color):
    return path(f'M 0 0 Q {-s*.7} {-s*.8} 0 {-s*1.6} Q {s*.65} {-s*.6} 0 0',color,transform=f'translate({x} {y}) rotate({angle})')

def plant(x,y,scale=1):
    c = ellipse(0,28,44,9,'#3f3427',opacity='.12')
    c += path('M -27 -12 L -20 28 Q 0 35 20 28 L 27 -12 Z','#a96a4e')
    c += ellipse(0,-12,28,8,'#c68a61')+ellipse(0,-13,22,5,'#65523a')
    for i,(dx,dy,a) in enumerate([(-36,-50,-50),(-17,-72,-25),(4,-89,6),(24,-63,48),(38,-32,70),(-3,-41,-15)]):
        c += path(f'M 0 -10 Q {dx*.1} {dy+20} {dx} {dy}',stroke='#5e6a3d',sw=3)
        c += leaf(dx,dy,20,a,['#626f3c','#7a8650','#4d643a'][i%3])
        c += path(f'M {dx} {dy} l {math.sin(math.radians(a))*25:.1f} {-math.cos(math.radians(a))*25:.1f}',stroke='#acb378',sw=1,opacity='.45')
    return group('potted-plant',c,f'translate({x} {y}) scale({scale})')

def glow(x,y,rx,ry):
    return ''.join(ellipse(x,y,rx*k,ry*k,'#ffd68c',opacity=o) for k,o in [(1,'.045'),(.82,'.06'),(.62,'.07')])

def lamp(x,y,scale=1):
    c=glow(0,-78,120,120)+ellipse(0,10,38,8,'#40332b',opacity='.18')
    c+=ellipse(0,0,25,5,'#5f513c')+rect(-3,-85,6,83,'#806d4f')
    c+=path('M -31 -115 L 31 -115 L 47 -63 L -47 -63 Z','#d0ad6a')
    c+=path('M -22 -112 L 23 -112 L 31 -66 L -31 -66 Z','#f0d79e')
    c+=ellipse(0,-64,47,7,'#b69353')+ellipse(0,-64,39,4,'#ffe2a2')
    return group('warm-lamp',c,f'translate({x} {y}) scale({scale})')

def mug(x,y,s=1):
    c=ellipse(0,12,19,4,'#3e332b',opacity='.18')
    c+=path('M 12 -8 Q 29 -13 28 -1 Q 26 9 13 6',stroke='#d6bd8c',sw=5)
    c+=path('M -15 -12 L -12 9 Q 0 17 13 9 L 16 -12 Z','#e3cda4')
    c+=ellipse(0,-12,15,5,'#f5e5c5')+ellipse(0,-12,12,3,'#54402c')
    c+=path('M -4 -22 Q -11 -31 -3 -39 M 6 -24 Q 12 -34 6 -43',stroke='#e8d6b1',sw=2,opacity='.55')
    return group('ceramic-mug',c,f'translate({x} {y}) scale({s})')

def floor(y=470,c='#96704e'):
    s=rect(0,y,1200,720-y,c)+rect(0,y,1200,12,'#6e503a')
    for yy in [510,557,617,689]:
        s+=line(0,yy,1200,yy,'#77583e',2)+line(0,yy+3,1200,yy+3,'#b18a60',1,opacity='.6')
    for k in range(-5,8):
        s+=line(600+k*93,y,600+k*190,720,'#70533c',1.2,opacity='.65')
    for j in range(29):
        x=(j*97)%1200; yy=y+30+(j*53)%(710-y-30)
        s+=path(f'M {x} {yy} q 35 -5 78 -1 m -57 5 q 18 -2 37 0',stroke='#c09a6a',sw='.8',opacity='.42')
    return group('timber-floor',s)

def rug(x=600,y=610,rx=275,ry=63):
    s=ellipse(x,y+5,rx+10,ry+5,'#3e352b',opacity='.16')+ellipse(x,y,rx,ry,'#c4ac7b')
    for i in range(9):
        s+=ellipse(x,y,rx-7-i*7,ry-2-i*2,'none',stroke=['#9e8053','#dac493','#b09363'][i%3],stroke_width=2)
    s+=path(f'M {x-rx*.55} {y} L {x} {y-ry*.52} L {x+rx*.55} {y} L {x} {y+ry*.52} Z','none','#9b7651',3)
    return group('woven-rug',s)

def books(x,y,n=9,scale=1,seed=0):
    s=''; xx=0
    colors=['#667760','#b47555','#c3a56b','#695c52','#b3b7a0','#8d6e50','#a29a75','#738184']
    for i in range(n):
        w=10+(i*7+seed)%14; h=48+(i*13+seed)%26; col=colors[(i+seed)%len(colors)]
        s+=rect(xx,-h,w,h,col,1)+rect(xx+1,-h+3,2,h-6,'#ead9ad',opacity='.2')
        s+=line(xx+3,-h+8,xx+w-3,-h+8,'#eed9aa',1,opacity='.7')+line(xx+3,-10,xx+w-3,-10,'#eed9aa',1,opacity='.6')
        xx+=w+2
    return group('book-spines',s,f'translate({x} {y}) scale({scale})')

def door(kind):
    # All local door groups occupy roughly 190 x 335. Separate named layer groups.
    s=ellipse(95,337,102,15,'#4c3828',opacity='.17')
    if kind=='about':
        s+=path('M 0 330 V 46 Q 0 0 95 0 Q 190 0 190 46 V 330 Z','#795b40')
        s+=path('M 10 327 V 48 Q 10 11 95 10 Q 180 11 180 48 V 327 Z','#b49a70')
        s+=path('M 18 326 V 49 Q 18 19 95 18 Q 172 19 172 49 V 326 Z','#414f43')
        s+=path('M 24 326 V 50 Q 24 26 95 25 Q 165 26 165 50 V 326 Z','#88917a')
        for xx in [52,80,108,136]: s+=line(xx,35,xx,324,'#5e705e',1.4)
        s+=path('M 28 79 L 158 79 M 28 245 L 158 245',stroke='#a6ad8d',sw=7)
        s+=rect(30,90,125,145,'none',stroke='#60715b',stroke_width=3)
        s+=text(48,125,'about',30,'#f4ddac','Segoe Print',transform='rotate(-5 48 125)')
        s+=path('M 54 142 q 31 8 62 -4 M 70 174 l 7 -15 4 18 16 -7 -8 13 10 9 -18 -2 -4 13 -4 -15 -16 1 13 -8 z',stroke='#d2ad6d',sw=2.5)
        s+=path('M 37 284 l 12 -2 m 89 15 l 16 -3 m -120 -232 l 9 -1 m 56 248 l 18 -2',stroke='#c1b998',sw=3)
        for j in range(9): s+=line(1,280-j*21,11+(j%3)*3,280-j*21,'#5c4938',1.8)
        s+=circle(148,194,9,'#4a4f3a')+circle(147,192,6,'#ba9a57')+circle(145,190,2,'#e2c782')
    elif kind=='work':
        s+=rect(0,0,190,333,'#7e6850',2)+rect(8,8,174,324,'#c5b899',1)+rect(16,16,158,315,'#454a43')
        s+=rect(22,21,146,308,'#d3cbb4',1)+rect(32,32,126,185,'#c3bba5')
        s+=rect(37,37,116,175,'#d7d0bc')+rect(32,235,126,76,'#b8af96')+rect(37,240,116,66,'#d1c8b1')
        s+=rect(51,89,89,33,'#333c38',2)+text(95,111,'WORK',16,'#ece9da','Arial',text_anchor='middle',letter_spacing='3')
        s+=rect(145,169,7,34,'#7d7d6a',2)+rect(123,177,30,6,'#676e61',2)+rect(124,177,26,2,'#b0b1a0',1)
        s+=line(27,24,27,324,'#f1e9d2',1,opacity='.7')
    elif kind=='library':
        s+=rect(0,0,190,333,'#62462f')+rect(9,9,173,321,'#8a6544')+rect(20,18,150,300,'#493d2e')
        for j in range(4):
            yy=87+j*76
            s+=books(24,yy,8,.82,j+3)+rect(18,yy+1,154,10,'#b68a57')+rect(19,yy+11,152,4,'#6b4d31')
        s+=rect(-6,-7,201,14,'#967049',1)+rect(1,7,11,319,'#aa8255')+rect(177,7,9,319,'#6b5038')
        s+=rect(40,-33,111,25,'#d4b886',2)+text(95,-15,'LIBRARY',12,'#594832','Georgia',text_anchor='middle',letter_spacing='1.5')
        s+=rect(180,145,7,37,'#b29960',2)+rect(174,149,5,30,'#3e392a',2)
        s+=path('M 187 14 L 194 19 V 331 L 187 333 Z','#dec58b',opacity='.55')
    else:
        s+=path('M 0 330 V 82 Q 0 -4 95 -4 Q 190 -4 190 82 V 330 Z','#7a7857')
        s+=path('M 10 330 V 83 Q 10 6 95 6 Q 180 6 180 83 V 330 Z','#d0c9a3')
        s+=path('M 19 326 V 84 Q 19 16 95 16 Q 171 16 171 84 V 326 Z','#405c53')
        s+=path('M 25 321 V 85 Q 25 25 95 25 Q 165 25 165 85 V 321 Z','#6f8871')
        s+=path('M 25 176 Q 64 130 93 181 T 165 166 V 321 H 25 Z','#496c51')
        s+=path('M 25 271 Q 77 237 165 266 V 321 H 25 Z','#76968b')
        s+=path('M 39 282 q 32 -5 61 0 m -17 13 q 24 -4 54 0',stroke='#aec3a0',sw=2,opacity='.55')
        s+=path('M 32 109 L 67 37 L 86 30 L 36 152 Z','#f3edc9',opacity='.12')
        s+=rect(90,26,10,295,'#c6bc91')+rect(23,106,144,9,'#c6bc91')+rect(23,213,144,9,'#c6bc91')
        s+=rect(25,292,140,29,'#bdb78a')+text(94,311,'GARDEN',12,'#3c5848','Georgia',text_anchor='middle',letter_spacing='2')
        s+=circle(153,194,5,'#c8b876')
        s+=path('M -14 322 Q -17 201 6 136 Q -3 32 71 -8',stroke='#536b3d',sw=4)
        for j in range(11):
            yy=286-j*26; xx=-10+(max(0,90-yy))*.65
            s+=leaf(xx,yy,16,(-55 if j%2 else 50),'#6a7c46' if j%2 else '#84905b')
        for x,y in [(58,169),(139,151),(70,238)]: s+=circle(x,y,5,'#e0d98c',opacity='.15')+circle(x,y,1.5,'#efe6a1')
    return group(f'{kind}-door',s)

def home():
    s=rect(0,0,1200,720,'#d8c4a0')
    s+=path('M 0 0 H 1200 V 108 Q 906 69 600 68 Q 294 69 0 108 Z','#bfa57e')
    s+=path('M 0 109 Q 306 69 600 68 Q 914 69 1200 109 V 475 H 0 Z','#dfccaa')
    s+=path('M 0 118 Q 357 80 600 79 Q 926 81 1200 118 V 140 Q 900 99 600 100 Q 300 99 0 140 Z','#ceba95')
    s+=path('M 0 109 L 0 475 54 475 54 100 Z','#c9af87')+path('M 1147 101 L 1200 109 1200 475 1147 475 Z','#bda17b')
    s+=rect(49,84,17,397,'#876545')+rect(1135,84,16,397,'#876545')
    s+=path('M 0 79 Q 304 37 600 35 Q 899 37 1200 79 L 1200 109 Q 900 69 600 67 Q 300 69 0 109 Z','#826045')
    s+=path('M 0 81 Q 304 43 600 41 Q 900 43 1200 81',stroke='#ac8255',sw=3)
    s+=path('M 587 0 H 612 V 70 H 587 Z','#74543b')
    s+=path('M 122 0 H 157 L 314 67 L 270 72 Z','#866448')+path('M 1043 0 H 1078 L 930 72 L 886 67 Z','#866448')
    s+=rect(0,459,1200,18,'#a18057')+floor(477)
    s+=glow(603,276,350,252)
    for name,x,y in [('about',100,145),('work',356,145),('library',613,145),('garden',869,145)]:
        s+=group(name+'-entry',door(name),f'translate({x} {y})')
    # Plaster irregularities and small honest repairs.
    s+=path('M 308 195 l 4 18 -3 14 5 9 m 502 -54 l -2 25 6 9',stroke='#bba17a',sw=1.2,opacity='.6')
    s+=group('hall-light',line(597,66,597,109,'#68533c',3)+ellipse(597,110,12,5,'#74583d')+path('M 577 113 H 617 L 628 144 H 566 Z','#ad8550')+ellipse(597,145,30,6,'#ffe0a3')+glow(597,157,111,82))
    s+=rug(615,601,259,62)
    s+=plant(1093,536,.9)
    # Low bench, a folded blanket, and a pair of slippers anchor the hall as a home.
    b=ellipse(0,54,85,15,'#493527',opacity='.16')+path('M -70 -3 L -64 53 H -55 L -48 -3 M 48 -3 L 54 53 H 63 L 68 -3','#664a34')
    b+=path('M -81 -23 L 64 -23 84 -6 -76 -6 Z','#b88d59')+path('M -76 -6 H 84 V 4 H -76 Z','#84603f')
    b+=path('M -38 -26 H 12 L 35 -8 V 35 L -9 35 V -8 Z','#a25945')+path('M -28 -24 H -21 L 3 -8 V 35 H -3 V -8 Z','#c88c66')
    for i in range(5): b+=line(-9+i*9,35,-8+i*9,41,'#d1ac79',1)
    s+=group('entry-bench',b,'translate(162 545)')
    s+=group('slippers',ellipse(242,604,22,10,'#654f3d')+ellipse(276,616,22,10,'#654f3d')+path('M 224 600 Q 237 580 255 599 Q 245 611 224 608 Z','#ae8b67')+path('M 258 612 Q 271 592 289 611 Q 279 623 258 620 Z','#ae8b67'))
    s+=path('M 1017 487 L 1164 720 H 1126 L 995 487 Z','#ead5a2',opacity='.1')
    return s

def room_base(wall='#d7c39b',floor_color='#96704e'):
    s=rect(0,0,1200,720,wall)
    s+=path('M 0 0 H 1200 V 80 L 1058 21 H 144 L 0 80 Z','#95714d')
    s+=path('M 0 80 L 145 21 V 479 L 0 566 Z','#b69a72',opacity='.45')
    s+=path('M 1058 21 L 1200 80 V 566 L 1058 479 Z','#957858',opacity='.2')
    s+=path('M 138 0 H 159 V 485 H 138 Z M 1048 0 H 1068 V 485 H 1048 Z','#78563b')
    s+=rect(145,465,910,15,'#9f7851')+floor(480,floor_color)
    return s

def window(x,y,w=190,h=215,night=False):
    s=rect(x-12,y-12,w+24,h+24,'#97724f',3)+rect(x-4,y-4,w+8,h+8,'#dcbd85')
    s+=rect(x,y,w,h,'#384f58' if night else '#a6b1a0')
    s+=path(f'M {x} {y+h*.64} q {w*.3} {-h*.3} {w*.6} 0 t {w*.4} 0 v {h*.36} h {-w} Z','#253f43' if night else '#7b8f73')
    s+=circle(x+w*.73,y+h*.23,15,'#dfd6ac' if night else '#eee2b5')
    s+=rect(x+w/2-4,y,8,h,'#d7ba87')+rect(x,y+h*.48,w,7,'#d7ba87')
    s+=rect(x-20,y+h+8,w+40,12,'#af8557')
    return group('country-window',s)

def about():
    s=room_base('#dcc7a5')+glow(620,315,490,350)
    s+=window(190,113,205,221)
    s+=path('M 178 98 Q 156 202 174 331 L 216 339 Q 195 230 212 101 Z','#ac765b')+path('M 384 101 Q 406 232 384 339 L 430 331 Q 443 226 421 98 Z','#ac765b')
    s+=rect(477,96,259,172,'#8c6847',2)+rect(486,105,241,154,'#b6a078')
    for x,y,rot,w,h in [(500,120,-8,67,67),(582,116,7,66,80),(659,139,-3,51,57),(537,204,4,71,42),(625,213,-6,69,35)]:
        q=rect(x,y,w,h,'#edddbc',1)+circle(x+w/2,y+6,2,'#965f47')
        q+=path(f'M {x+12} {y+h-15} l 10 -17 11 11 11 -17 10 23',stroke='#8a8a68',sw=2)
        s+=group('unwritten-keepsake',q,f'rotate({rot} {x+w/2} {y+h/2})')
    s+=rect(803,124,199,13,'#977047')+rect(820,137,10,23,'#785339')+rect(970,137,10,23,'#785339')
    s+=books(819,123,5,.87,2)+ellipse(958,118,27,9,'#a9644e')+ellipse(958,103,18,16,'#b97958')
    # Bed / blanket area, with worn storage trunk.
    s+=path('M 785 409 L 1054 400 1135 526 823 542 Z','#664e37')
    s+=path('M 795 380 L 1031 380 1100 493 823 506 Z','#d8bb85')
    s+=path('M 849 433 L 1063 424 1106 493 831 508 Z','#8b987d')
    s+=path('M 849 443 L 1069 437 M 839 470 L 1087 462',stroke='#b6b799',sw=8)
    s+=path('M 822 395 Q 865 371 902 395 L 922 425 839 433 Z','#eee0be')
    s+=rect(811,335,15,206,'#775238',5)+rect(1033,335,15,104,'#775238',5)+path('M 820 350 Q 924 313 1041 350 V 380 H 820 Z','#ab7f50')
    s+=rug(568,609,245,60)
    d=ellipse(600,581,247,42,'#4e392b',opacity='.19')
    d+=path('M 412 399 L 398 562 H 414 L 438 399 M 775 399 L 797 562 H 814 L 796 399','#725039')
    d+=path('M 405 355 L 773 355 821 399 370 399 Z','#b88a57')+rect(370,399,451,17,'#805b3b')
    d+=rect(429,419,123,53,'#a1764c',2)+rect(567,419,123,53,'#a1764c',2)+circle(489,444,5,'#5f5136')+circle(629,444,5,'#5f5136')
    # Open journal is intentionally unfilled: actual biography has not been supplied.
    d+=group('journal-hotspot',path('M 485 363 Q 539 350 582 366 Q 620 350 673 361 L 690 393 Q 628 387 583 397 Q 532 386 467 394 Z','#f0e2be')+path('M 582 366 L 583 397',stroke='#baa17a',sw=2)+path('M 502 370 l 57 3 m -64 7 l 49 2 m 66 -10 l 39 -4 m -42 12 l 47 -3',stroke='#9b8f73',sw=1.3))
    d+=path('M 686 375 l 31 -17',stroke='#9e5c40',sw=4)+lamp(747,366,.52)+mug(444,373,.65)
    s+=group('writing-desk',d)
    s+=plant(220,487,.85)
    s+=rect(876,552,170,79,'#8f6b45',6)+rect(876,546,170,18,'#a88251',4)+rect(900,549,8,82,'#bba374')+rect(1013,549,8,82,'#bba374')+rect(953,574,20,15,'#5b543b',2)
    return s

def work():
    s=room_base('#d9d4bd','#aa9270')+window(188,111,200,230)
    s+=path('M 186 350 L 391 350 678 720 H 309 Z','#f7ebc7',opacity='.12')
    s+=rect(478,99,454,17,'#a88e64')+books(502,98,6,.75,4)
    # Quiet equipment shapes and useful folders, not a copied Rams product.
    s+=rect(725,52,139,45,'#e8e2ce',3)+rect(736,59,76,29,'#bdbaa5',2)
    for x in range(741,807,5):s+=line(x,62,x,86,'#929582',1)
    s+=circle(841,74,8,'#727a6b')+circle(841,74,3,'#b1b6a4')
    s+=rect(912,58,8,39,'#73816e')+rect(922,66,8,31,'#b6a779')
    s+=rect(809,191,162,197,'#bfb59b',1)+rect(819,201,142,177,'#ede6d3',1)
    for y in [221,269,317]:s+=rect(834,y,11,11,'#63725e',2)+line(859,y+4,941,y+4,'#a49f87',3)+line(859,y+16,924,y+16,'#c1b99f',2)
    s+=rug(608,602,261,61)
    s+=ellipse(610,574,338,48,'#4a4234',opacity='.16')
    s+=path('M 325 405 L 307 610 H 327 L 353 405 M 873 405 L 899 610 H 920 L 901 405','#777d6c')
    s+=path('M 349 368 H 859 L 931 414 H 285 Z','#c8b38c')+rect(285,414,646,16,'#a18b64')
    s+=path('M 530 366 L 538 333 H 631 L 641 366 Z','#777c6c')+rect(477,204,220,147,'#666e61',6)+rect(488,215,198,120,'#ece9db',2)
    s+=rect(502,229,168,10,'#acb39f',1)+rect(502,250,88,61,'#d7d9ca',2)+rect(600,250,70,5,'#7d8675',1)+rect(600,263,58,4,'#bdc1af',1)+rect(600,276,65,4,'#bdc1af',1)
    s+=path('M 475 380 H 683 L 705 401 H 456 Z','#e4dcc5')
    for j in range(3):
        for k in range(16):s+=rect(481+k*12-j*3,383+j*5,9,3,'#bebba5',.8)
    s+=rect(729,373,102,30,'#7e8c75',2)+rect(735,367,96,30,'#ded7bc',2)+rect(742,361,90,30,'#c3b591',2)
    s+=line(750,370,810,370,'#9b9277',2)+line(750,378,793,378,'#9b9277',2)
    s+=mug(386,392,.75)+plant(1015,488,.75)
    s+=path('M 527 495 Q 601 472 675 495 L 660 558 H 539 Z','#65725e')+path('M 543 542 L 527 655 M 656 543 L 675 655',stroke='#6c725f',sw=8)+path('M 534 483 V 427 Q 600 405 668 427 V 483 Z','#7d8a73')
    return s

def library():
    s=rect(0,0,1200,720,'#8f7455')
    s+=path('M 0 0 H 1200 V 430 H 0 Z','#9c805e')
    s+=path('M 0 0 H 230 L 600 245 972 0 H 1200 L 600 390 Z','#5c5546')
    s+=path('M 265 0 H 933 L 600 220 Z','#344b53')
    s+=path('M 368 8 H 830 L 600 169 Z','#5d7379')
    s+=path('M 399 8 H 800 L 600 145 Z','#344f5b')
    s+=path('M 600 0 V 217 M 357 60 H 849 M 456 132 H 741',stroke='#b69b74',sw=8)
    s+=circle(644,39,11,'#d4d8ba')
    s+=path('M 0 0 L 600 350 1200 0',stroke='#634b34',sw=27)+path('M 0 0 L 600 343 1200 0',stroke='#b08a58',sw=5)
    s+=floor(478,'#795d43')
    # Low shelves hug the eaves; the roof window is the refuge's focal point.
    for x in [82,791]:
        sh=rect(x,235,329,260,'#5b452f',3)+rect(x+10,244,309,238,'#493c2b')
        for j in range(3):
            yy=318+j*78
            sh+=books(x+20,yy,15,.91,j+2)+rect(x+9,yy,310,11,'#ac8050')+rect(x+9,yy+11,310,5,'#6f5032')
        sh+=rect(x-7,222,343,18,'#bd955e')+rect(x,240,12,256,'#967047')+rect(x+317,240,12,256,'#82613e')
        s+=group('eaves-bookshelf',sh)
    s+=plant(111,224,.56)+mug(866,216,.6)
    s+=rug(611,619,283,64)
    s+=glow(750,406,336,277)
    # Deep upholstered chair and ottoman.
    s+=ellipse(584,614,140,30,'#302d24',opacity='.22')
    s+=path('M 478 551 L 464 621 H 481 L 497 558 M 663 551 L 679 621 H 696 L 681 550','#4e4230')
    s+=path('M 478 491 V 371 Q 479 334 523 329 H 640 Q 682 336 684 373 V 491 Z','#a96e48')
    s+=path('M 493 485 V 376 Q 496 352 526 351 H 632 Q 661 352 664 376 V 485 Z','#c1905d')
    s+=rect(473,475,214,95,'#a9744d',23)+path('M 490 482 Q 580 466 670 482 V 540 H 490 Z','#d0a26a')
    s+=rect(452,443,39,126,'#8d613f',18)+rect(671,443,39,126,'#8d613f',18)
    s+=path('M 497 439 L 548 421 581 471 530 490 Z','#d2bd8e')+path('M 605 477 L 650 467 688 510 V 586 H 636 L 630 518 Z','#76816a')
    for j in range(4):s+=line(637+j*13,585,638+j*13,594,'#b6bb96',2)
    s+=ellipse(558,654,98,15,'#3f3327',opacity='.17')+rect(470,605,173,42,'#b18154',19)+path('M 480 645 L 474 670 M 631 645 L 637 670',stroke='#59452f',sw=8)
    s+=lamp(766,507,1.13)
    s+=ellipse(802,565,74,18,'#59432d')+path('M 771 562 L 765 627 M 833 562 L 840 627',stroke='#785333',sw=9)
    s+=ellipse(802,557,76,17,'#b38a55')+mug(813,548,.8)
    s+=path('M 744 548 L 789 536 816 551 771 562 Z','#e8d8b4')+path('M 773 540 L 784 557',stroke='#b6a17c',sw=2)
    return s

def garden():
    s=rect(0,0,1200,720,'#1e3637')
    s+=path('M 0 0 H 1200 V 300 Q 843 264 592 300 Q 274 266 0 328 Z','#304c48')
    s+=circle(798,106,31,'#d3d4ac')+circle(809,99,27,'#304c48')
    # Uneven distant trees, avoiding repeated triangular trees.
    for i in range(13):
        x=i*104-20; top=70+(i*37)%114
        s+=path(f'M {x-58} 390 Q {x-45} {top+79} {x-30} {top+43} Q {x-12} {top-22} {x+19} {top+15} Q {x+62} {top-6} {x+80} {top+80} Q {x+100} {top+122} {x+90} 390 Z',['#273f3c','#243c36','#29483e'][i%3])
        s+=path(f'M {x+10} 390 Q {x} {top+135} {x+13} {top+70}',stroke='#405344',sw=3,opacity='.6')
    s+=path('M 0 372 Q 241 306 438 369 Q 678 297 1200 363 V 720 H 0 Z','#36503c')
    s+=path('M 0 447 Q 311 352 515 442 Q 718 371 1200 419 V 720 H 0 Z','#3f5941')
    # A pool flows out of the frame, reflections supplied as layered vector ribbons.
    water='M 542 383 Q 655 365 747 398 Q 808 419 773 439 Q 698 474 829 492 Q 1085 518 1200 604 V 720 H 372 Q 305 655 438 595 Q 639 531 570 499 Q 447 459 555 435 Q 639 415 542 383 Z'
    s+=path(water,'#446965')
    s+=path('M 561 398 Q 634 386 706 404 Q 750 420 697 441 Q 610 471 745 504 Q 839 528 981 552 Q 775 538 662 530 Q 521 505 567 471 Q 593 449 654 432 Q 709 416 561 398 Z','#6d8a77',opacity='.35')
    s+=path('M 447 591 Q 378 631 422 664 Q 514 703 777 720 H 1172 Q 827 664 709 657 Q 478 645 447 591 Z','#567f73',opacity='.6')
    for x,y,w in [(642,409,37),(672,421,58),(644,432,35),(711,518,88),(789,539,117),(579,608,61),(868,636,95),(985,670,53),(459,657,32),(658,687,68)]:
        s+=path(f'M {x-w/2} {y} q {w/2} -3 {w} 0',stroke='#aab695',sw=1.5,opacity='.5')
    s+=path('M 0 573 Q 208 516 444 555 Q 555 565 533 603 Q 306 593 213 720 H 0 Z','#526444')
    s+=path('M 0 604 Q 219 553 456 583 Q 234 597 153 720 H 0 Z','#8c8460')
    s+=path('M 0 618 Q 173 579 302 585',stroke='#b0a77a',sw=3,opacity='.4')
    # Short timber landing beside the water.
    s+=path('M 194 486 L 487 490 574 548 246 549 Z','#735c3e')
    for j in range(7): s+=path(f'M {209+j*42} 489 l 52 58',stroke='#a08b5b',sw=3)
    s+=path('M 246 549 L 246 599 M 544 546 L 544 581',stroke='#514e32',sw=14)
    # A small bench; content lives in readable HTML, not on tiny signposts.
    s+=path('M 243 457 L 239 511 M 421 455 L 432 509',stroke='#534a32',sw=11)
    s+=path('M 230 434 L 415 432 442 457 248 460 Z','#ab8b55')
    s+=path('M 239 429 V 373 M 413 429 V 371',stroke='#655337',sw=8)+path('M 239 382 L 413 378 V 405 L 239 409 Z','#9d8051')
    # Reeds and flowers at banks.
    for i in range(38):
        x=(i*137+27)%1200;y=452+(i*51)%266
        if 480<x<1000 and y>550:continue
        s+=path(f'M {x} {y} q -6 -29 -12 -43 M {x} {y} q 5 -32 17 -49',stroke=['#76825a','#8b9162','#617847'][i%3],sw=2)
        s+=leaf(x-10,y-27,11,-45,'#61784a')+leaf(x+10,y-24,10,45,'#6e8253')
    # Foreground framing trunks and leaves.
    s+=path('M -15 0 H 45 Q 26 171 91 339 L 64 467 Q 1 316 -15 274 Z','#1f342c')
    s+=path('M 1142 0 H 1200 V 506 Q 1120 352 1112 217 Z','#1b3029')
    for i in range(19):
        x=(i*139)%1200;y=18+(i*19)%89
        s+=leaf(x,y,42,-60+(i%5)*28,['#233c2d','#294331','#314d36'][i%3])
    # Sparse fireflies. No automatically looping motion.
    for x,y,r in [(155,329,2),(292,286,2),(456,366,2.3),(714,287,2),(930,336,2.5),(1056,423,1.8),(652,484,1.7),(181,524,2),(884,561,2),(566,278,1.6),(1004,223,1.5),(369,427,2.2)]:
        s+=circle(x,y,r*6,'#d5d888',opacity='.035')+circle(x,y,r*3,'#e8df8d',opacity='.09')+circle(x,y,r,'#e5dc92')
    return s

SCENES={'home':home(),'about':about(),'work':work(),'library':library(),'garden':garden()}
LABELS={'home':"hassan's digital space",'about':'A room full of stories.','work':'Useful things, thoughtfully made.','library':'Stay for another chapter.','garden':'A little room to wander.'}
SUBS={'home':'choose a door to enter','about':'About · Objects, memories, and the pages between.','work':'Work · Selected projects and the thinking behind them.','library':'Library · Read, reading, and still to come.','garden':'Garden · Thoughts, recipes, films, and games.'}

def svg(content,w=1200,h=720,title='Cottage composition study',viewbox=None):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{viewbox or f"0 0 {w} {h}"}" role="img" aria-label="{escape(title)}">\n<title>{escape(title)}</title>\n{content}\n</svg>'

for name,body in SCENES.items():
    (OUT/f'{name}-scene.svg').write_text(svg(body,title=f'{name.title()} — original cottage vector study'),encoding='utf-8')
    paper,ink,muted,font={'home':('#f2e6cc','#413b2c','#74664e','Georgia'),'about':('#efe0c6','#4e3c2e','#79563f','Segoe Print'),'work':('#eeecdf','#363e34','#5f6658','Arial'),'library':('#e9d8b3','#4c392c','#6c5138','Georgia'),'garden':('#243c34','#efe5bc','#c1c6a6','Georgia')}[name]
    header=rect(0,0,1280,930,paper)
    header+=text(43,42,'HM',17,ink,'Georgia')
    for i,key in enumerate(SCENES):
        header+=text(746+i*98,41,key.title(),14,ink,'Arial',text_anchor='middle')
    header+=text(640,106,LABELS[name],40,ink,font,text_anchor='middle',font_style='italic' if name=='library' else 'normal')
    header+=text(640,139,SUBS[name],15,muted,'Arial',text_anchor='middle')
    header+=group('scene',body,'translate(40 165)')
    header+=text(40,909,'Come in. Make yourself at home.' if name=='home' else name.title(),13,muted,'Georgia')
    (OUT/f'{name}-desktop.svg').write_text(svg(header,1280,930,f'{name.title()} desktop composition'),encoding='utf-8')

for kind in ['about','work','library','garden']:
    body=rect(-25,-45,240,425,'#dfccaa')+rect(-25,333,240,47,'#aa8258')+door(kind)
    (OUT/f'{kind}-door.svg').write_text(svg(body,240,425,f'{kind.title()} doorway',viewbox='-25 -45 240 425'),encoding='utf-8')

mobile=rect(0,0,390,1000,'#f2e6cc')+text(24,37,'HM',16,'#4f5a3d')+text(366,37,'Work',14,'#4f5a3d','Arial',text_anchor='end')
mobile+=text(195,98,"hassan's",33,'#413b2c',text_anchor='middle')+text(195,136,'digital space',33,'#413b2c',text_anchor='middle')+text(195,173,'choose a door to enter',14,'#74664e','Arial',text_anchor='middle')
mobile+=rect(14,210,362,716,'#dfccaa')+path('M 14 224 Q 195 186 376 224',stroke='#8e6a46',sw=15)
for kind,x,y in [('about',36,256),('work',216,256),('library',36,617),('garden',216,617)]:
    mobile+=group(kind+'-mobile-door',door(kind),f'translate({x} {y}) scale(.72)')
    mobile+=text(x+68,y+268,kind.title(),17,'#514934','Georgia',text_anchor='middle')
mobile+=text(195,970,'Make yourself at home.',14,'#75654d',text_anchor='middle')
(OUT/'home-mobile.svg').write_text(svg(mobile,390,1000,'Home mobile composition'),encoding='utf-8')
print(f'Wrote {len(list(OUT.glob("*.svg")))} original SVG composition studies to {OUT}')
