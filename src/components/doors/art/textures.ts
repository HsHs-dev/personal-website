import * as THREE from 'three';
export interface Book {title:string;author:string;color:string;ink:string}
export interface LetteringOptions {color?:string;background?:string|null;font?:string;width?:number;height?:number;rotate?:number}
export function createTextureTools(seed=9274){


// Seeded brush marks keep every reload and resize visually consistent.

function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
function canvasTexture(w:number,h:number,draw:(c:CanvasRenderingContext2D,w:number,h:number)=>void){const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas 2D is unavailable');draw(ctx,w,h);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;}
function paintedWood(color:string,grain='#54432b',strength=.1){
  return canvasTexture(256,768,(c,w,h)=>{
    c.fillStyle=color;c.fillRect(0,0,w,h);
    for(let i=0;i<1200;i++){const x=random()*w,y=random()*h;c.strokeStyle=i%3===0?`rgba(255,249,226,${random()*strength})`:grain;c.globalAlpha=random()*strength;c.lineWidth=.3+random()*2.5;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+random()*8-4,y+35,x+random()*12-6,y+90,x+random()*8-4,y+60+random()*240);c.stroke();}
    c.globalAlpha=1;
    const g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,'#2014000d');g.addColorStop(.35,'#fff4cd0a');g.addColorStop(.8,'#fff9e40e');g.addColorStop(1,'#37241114');c.fillStyle=g;c.fillRect(0,0,w,h);
  });
}
function paper(color:string){return canvasTexture(256,256,(c,w,h)=>{c.fillStyle=color;c.fillRect(0,0,w,h);for(let i=0;i<4200;i++){c.globalAlpha=random()*.045;c.fillStyle=i%2?'#795b36':'#fffdf3';c.fillRect(random()*w,random()*h,1+random()*3,1+random()*3);}c.globalAlpha=1;});}
function lettering(text:string,{color='#554433',background=null,font='500 52px Georgia',width=512,height=128,rotate=0}:LetteringOptions={}){
  return canvasTexture(width,height,(c,w,h)=>{if(background){c.fillStyle=background;c.fillRect(0,0,w,h);}c.translate(w/2,h/2);c.rotate(rotate);c.font=font;c.fillStyle=color;c.textAlign='center';c.textBaseline='middle';c.fillText(text,0,0,w*.9);});
}
function star(c:CanvasRenderingContext2D,x:number,y:number,r:number,points=5){c.beginPath();for(let i=0;i<points*2;i++){const angle=-Math.PI/2+i*Math.PI/points,rad=i%2?r*.43:r;c.lineTo(x+Math.cos(angle)*rad,y+Math.sin(angle)*rad);}c.closePath();c.fill();}
function ellipse(c:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,color:string|CanvasGradient){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
function stroke(c:CanvasRenderingContext2D,points:number[][],color:string,width:number){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}

function sticker(kind:string){return canvasTexture(320,360,(c,w,h)=>{
  // Slightly irregular cream paper with an ink border, like an old notebook sticker.
  c.fillStyle='#fff7dd';c.strokeStyle='#b6a789';c.lineWidth=3;c.beginPath();c.moveTo(24,15);c.lineTo(294,22);c.lineTo(301,327);c.lineTo(20,338);c.closePath();c.fill();c.stroke();
  c.save();c.beginPath();c.rect(30,30,260,280);c.clip();
  if(kind==='dragon'){
    c.fillStyle='#e8d496';c.fillRect(30,30,260,280);const g=c.createRadialGradient(125,95,5,160,150,115);g.addColorStop(0,'#ffe59a');g.addColorStop(.65,'#f5a23c');g.addColorStop(1,'#c76d27');ellipse(c,160,156,110,110,g);ellipse(c,123,92,26,12,'#fff4c277');c.fillStyle='#bd4229';for(const [x,y]of [[135,132],[185,132],[135,179],[185,179]])star(c,x,y,18);
    c.fillStyle='#93552a';c.font='bold 25px sans-serif';c.textAlign='center';c.fillText('DRAGON BALL',160,301);
  }else if(kind==='pirate'){
    c.fillStyle='#e5c9a0';c.fillRect(30,30,260,280);
    stroke(c,[[78,113],[245,251]],'#fff9e6',21);stroke(c,[[240,111],[78,249]],'#fff9e6',21);
    for(const [x,y]of [[76,110],[245,253],[242,109],[75,252]]){ellipse(c,x-6,y,12,12,'#fff9e6');ellipse(c,x+6,y+3,12,12,'#fff9e6');}
    ellipse(c,160,162,69,67,'#fff9e6');c.fillStyle='#fff9e6';c.fillRect(128,180,64,48);ellipse(c,137,161,18,22,'#373a37');ellipse(c,183,161,18,22,'#373a37');ellipse(c,160,191,8,7,'#373a37');
    for(let i=0;i<4;i++)stroke(c,[[138+i*15,210],[138+i*15,226]],'#746854',2);
    ellipse(c,160,112,95,18,'#d79e4b');c.fillStyle='#e9b868';c.beginPath();c.arc(160,106,59,Math.PI,Math.PI*2);c.fill();c.fillStyle='#bc4937';c.fillRect(103,98,114,17);ellipse(c,160,115,100,10,'#e1ac56');
    c.fillStyle='#3e565e';c.font='bold 28px Georgia';c.textAlign='center';c.fillText('ONE PIECE',160,298);
  }else if(kind==='conan'){
    c.fillStyle='#c4d3d4';c.fillRect(30,30,260,280);
    ellipse(c,164,142,69,76,'#edc69c');c.fillStyle='#293a43';c.beginPath();c.moveTo(93,137);c.lineTo(77,74);c.lineTo(123,82);c.lineTo(117,52);c.lineTo(176,68);c.lineTo(217,45);c.lineTo(238,105);c.lineTo(214,143);c.lineTo(188,105);c.lineTo(163,125);c.lineTo(151,97);c.lineTo(114,132);c.closePath();c.fill();
    c.strokeStyle='#273c4c';c.lineWidth=7;for(const x of [133,192]){c.beginPath();c.roundRect(x-25,137,49,37,13);c.stroke();}stroke(c,[[158,148],[167,148]],'#273c4c',5);ellipse(c,138,151,5,10,'#263a43');ellipse(c,187,151,5,10,'#263a43');stroke(c,[[153,190],[177,188]],'#9c654c',3);
    c.fillStyle='#456985';c.beginPath();c.moveTo(100,215);c.lineTo(158,198);c.lineTo(217,217);c.lineTo(240,278);c.lineTo(83,278);c.fill();c.fillStyle='#f1e5c8';c.beginPath();c.moveTo(137,208);c.lineTo(161,260);c.lineTo(183,208);c.fill();
    c.fillStyle='#b14b42';c.beginPath();c.moveTo(122,214);c.lineTo(163,227);c.lineTo(201,214);c.lineTo(201,249);c.lineTo(162,232);c.lineTo(124,248);c.fill();
    c.fillStyle='#354b60';c.font='bold 22px sans-serif';c.textAlign='center';c.fillText('DETECTIVE CONAN',160,303);
  }else if(kind==='spider'){
    c.fillStyle='#d1c095';c.fillRect(30,30,260,280);ellipse(c,160,157,89,112,'#b94b3c');for(let i=0;i<7;i++){const angle=i*Math.PI/3.5;stroke(c,[[160,148],[160+Math.cos(angle)*100,148+Math.sin(angle)*115]],'#683e36',2);}for(const r of [30,58,85]){c.strokeStyle='#683e36';c.lineWidth=2;c.beginPath();c.ellipse(160,148,r,r*1.15,0,0,Math.PI*2);c.stroke();}c.fillStyle='#fff1ce';c.beginPath();c.moveTo(93,118);c.lineTo(145,147);c.quadraticCurveTo(126,197,99,164);c.fill();c.beginPath();c.moveTo(227,118);c.lineTo(175,147);c.quadraticCurveTo(194,197,221,164);c.fill();
  }else{
    c.fillStyle='#d5b364';c.fillRect(30,30,260,280);ellipse(c,160,160,112,66,'#dbba66');c.fillStyle='#344146';c.beginPath();for(const [x,y] of [[51,135],[99,145],[121,126],[146,148],[150,112],[161,128],[172,112],[176,148],[201,126],[224,145],[270,135],[242,177],[211,171],[187,194],[161,214],[138,194],[109,171],[77,177]])c.lineTo(x,y);c.closePath();c.fill();
  }
  // Transparent scuffs soften the flat ink into printed, slightly worn artwork.
  for(let i=0;i<500;i++){c.globalAlpha=random()*.13;c.fillStyle='#fff6dd';c.fillRect(random()*w,random()*h,random()*6+.5,random()*2+.3);}c.restore();c.globalAlpha=1;
});}

function growthMarks(){return canvasTexture(120,900,(c)=>{c.strokeStyle='#807663';c.fillStyle='#807663';c.lineWidth=2;c.font='17px HDSCaveat, cursive';for(let i=0;i<12;i++){const y=70+i*63;const x=20+random()*6;c.beginPath();c.moveTo(x,y);c.lineTo(x+(i%3===0?66:35),y+random()*3);c.stroke();}c.save();c.translate(88,440);c.rotate(-Math.PI/2);c.font='25px HDSCaveat,cursive';c.fillText('still growing',0,0);c.restore();});}
function scribbles(){return canvasTexture(400,500,(c)=>{c.globalAlpha=.65;stroke(c,[[55,140],[95,103],[139,143],[139,205],[57,205],[55,140]],'#b88357',4);stroke(c,[[79,203],[79,166],[106,165],[106,202]],'#b88357',4);c.strokeStyle='#c2a349';c.lineWidth=4;c.beginPath();c.arc(257,80,28,0,Math.PI*2);c.stroke();for(let i=0;i<9;i++){const a=i/9*Math.PI*2;stroke(c,[[257+Math.cos(a)*37,80+Math.sin(a)*37],[257+Math.cos(a)*47,80+Math.sin(a)*47]],'#c2a349',3);}stroke(c,[[201,260],[217,240],[231,260],[247,238]],'#8a9e9d',3);c.font='34px HDSCaveat,cursive';c.fillStyle='#809779';c.fillText('hello, world!',120,374);});}

const books: Book[]=[
  {title:'CRIME AND PUNISHMENT',author:'DOSTOEVSKY',color:'#925b4d',ink:'#eddbb7'},
  {title:'THE 7 HABITS OF HIGHLY EFFECTIVE TEENS',author:'SEAN COVEY',color:'#bfab68',ink:'#514f3c'},
  {title:'ATOMIC HABITS',author:'JAMES CLEAR',color:'#e2d8bb',ink:'#7d6246'},
  {title:"SO GOOD THEY CAN’T IGNORE YOU",author:'CAL NEWPORT',color:'#66837d',ink:'#ece3c9'},
  {title:'DEEP WORK',author:'CAL NEWPORT',color:'#bc744a',ink:'#f4e4bf'},
  {title:'STEAL LIKE AN ARTIST',author:'AUSTIN KLEON',color:'#414b4a',ink:'#eadfbd'},
];
function bookSpine(book:Book){return canvasTexture(160,1024,(c,w,h)=>{c.fillStyle=book.color;c.fillRect(0,0,w,h);c.globalAlpha=.3;c.fillStyle='#f4e2b9';c.fillRect(7,0,2,h);c.fillRect(0,40,w,3);c.fillRect(0,65,w,2);c.fillRect(0,h-62,w,2);c.fillRect(0,h-40,w,3);c.globalAlpha=1;c.save();c.translate(w*.53,h*.42);c.rotate(Math.PI/2);c.fillStyle=book.ink;c.font='600 38px Georgia';c.textAlign='center';c.textBaseline='middle';c.fillText(book.title,0,0,h*.67);c.restore();c.save();c.translate(w/2,h*.86);c.rotate(Math.PI/2);c.fillStyle=book.ink;c.font='18px sans-serif';c.textAlign='center';c.fillText(book.author,0,0,170);c.restore();for(let i=0;i<600;i++){c.globalAlpha=random()*.08;c.fillStyle='#fcf2d5';c.fillRect(random()*w,random()*h,random()*5,1);}c.globalAlpha=1;});}

return {random,paintedWood,paper,lettering,sticker,growthMarks,scribbles,books,bookSpine};
}
