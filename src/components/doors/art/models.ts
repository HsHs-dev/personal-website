import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createTextureTools } from './textures';
import type { Book, LetteringOptions } from './textures';
interface Leaf {mesh:THREE.Mesh; base:number; phase:number}
export interface DoorModel {root:THREE.Group;pivot:THREE.Group;interior:THREE.Group;leaves:Leaf[];angle:number;target:number;hover:number;index:number;update(dt:number,time:number,reduced:boolean):void}
export function createDoorModel(index:number):DoorModel {
const {paintedWood,paper,lettering,sticker,growthMarks,scribbles,books,bookSpine,random}=createTextureTools(9274+index*101);

const shared=new Map<string,THREE.MeshStandardMaterial>();
function mat(color:string,roughness=.8,metalness=0){const k=color+roughness+metalness;if(!shared.has(k))shared.set(k,new THREE.MeshStandardMaterial({color,roughness,metalness}));return shared.get(k)!;}
function wood(color:string,strength=.13){return new THREE.MeshStandardMaterial({map:paintedWood(color,'#5b432b',strength),roughness:.84});}
function mesh(geo:THREE.BufferGeometry,material:THREE.Material,parent:THREE.Object3D,x=0,y=0,z=0){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(parent:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,material:THREE.Material,r=.015){return mesh(r?new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)):new THREE.BoxGeometry(w,h,d),material,parent,x,y,z);}
function orb(parent:THREE.Object3D,x:number,y:number,z:number,sx:number,sy:number,sz:number,material:THREE.Material){const m=mesh(new THREE.SphereGeometry(1,20,12),material,parent,x,y,z);m.scale.set(sx,sy,sz);return m;}
function cyl(parent:THREE.Object3D,rt:number,rb:number,h:number,x:number,y:number,z:number,material:THREE.Material){return mesh(new THREE.CylinderGeometry(rt,rb,h,24),material,parent,x,y,z);}
function decal(parent:THREE.Object3D,map:THREE.Texture,w:number,h:number,x:number,y:number,z:number,angle=0){const m=mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map,transparent:true,roughness:.95,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}),parent,x,y,z);m.rotation.z=angle;m.castShadow=false;return m;}
function label(parent:THREE.Object3D,text:string,w:number,h:number,x:number,y:number,z:number,options:LetteringOptions={}){return decal(parent,lettering(text,options),w,h,x,y,z,options.rotate||0);}
function line(parent:THREE.Object3D,points:number[][],r:number,material:THREE.Material){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(p[0],p[1],p[2])));return mesh(new THREE.TubeGeometry(curve,Math.max(8,points.length*8),r,5,false),material,parent);}
const brass=mat('#b0985c',.4,.55),darkBrass=mat('#756341',.5,.45),ivory=wood('#e2d5b9'),walnut=wood('#775336',.24),sage=wood('#81936f'),officeWood=wood('#a17f58',.18);
const cream=mat('#eee5d2');

function frame(root:THREE.Object3D,material:THREE.Material,type:number){
  for(const x of [-1.065,1.065]){
    box(root,.19,3.94,.32,x,1.97,0,material,.035);
    box(root,.25,.21,.39,x,.105,.015,material,.025);
    box(root,.24,.18,.37,x,3.77,.015,material,.025);
    box(root,.035,3.48,.04,x+(x>0?.04:-.04),1.95,.185,material,.008);
  }
  box(root,2.38,.22,.41,0,3.96,.01,material,.035);
  box(root,2.48,.075,.47,0,4.08,.015,material,.02);
  box(root,2.18,.09,.55,0,.045,.02,type===2?walnut:material,.02);
  if(type===0){decal(root,growthMarks(),.19,2.95,-1.067,1.8,.18);for(let i=0;i<15;i++){const y=random()*3.7;box(root,.018+random()*.05,.04+random()*.14,.004,(i%2?1:-1)*1.13,y,.172,mat('#b8a586'),.003);}}
}
function hinge(surface:THREE.Object3D){for(const y of [.55,3.25]){const h=cyl(surface,.035,.035,.2,-.96,y,.04,darkBrass);h.rotation.y=Math.PI/2;}}
function knob(surface:THREE.Object3D,x=.72,y=1.65){box(surface,.105,.29,.035,x,y,.115,darkBrass,.025);const stem=cyl(surface,.032,.032,.11,x,y,.185,brass);stem.rotation.x=Math.PI/2;orb(surface,x,y,.265,.083,.083,.065,brass);}
function panel(parent:THREE.Object3D,w:number,h:number,x:number,y:number,material:THREE.Material){box(parent,w+.07,h+.07,.038,x,y,.082,material,.025);box(parent,w,h,.02,x,y,.11,material,.02);}
function book(parent:THREE.Object3D,desc:Book,w:number,h:number,x:number,y:number,z:number,lean=0){const g=new THREE.Group();parent.add(g);g.position.set(x,y,z);g.rotation.z=lean;box(g,w,h,.33,0,h/2,0,mat(desc.color),.009);box(g,w-.025,h-.045,.29,0,h/2,-.018,mat('#d9cdb0'),.003);box(g,w,.022,.35,0,.011,0,mat(desc.color),.003);box(g,w,.022,.35,0,h-.011,0,mat(desc.color),.003);decal(g,bookSpine(desc),w-.014,h-.014,0,h/2,.171);return g;}
function pot(parent:THREE.Object3D,x:number,y:number,z:number,scale=.5){const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(scale);parent.add(g);cyl(g,.23,.16,.42,0,.21,0,mat('#bd825f'));cyl(g,.25,.25,.065,0,.4,0,mat('#c89170'));cyl(g,.21,.21,.015,0,.438,0,mat('#665742'));for(let i=0;i<8;i++){const a=i*Math.PI*.76;const lx=Math.cos(a)*(.14+random()*.14),lz=Math.sin(a)*.2;line(g,[[0,.43,0],[lx*.5,.67,lz*.5],[lx,.83+random()*.3,lz]],.009,mat('#718151'));const leaf=orb(g,lx,.85+random()*.25,lz,.07,.19,.025,mat(i%2?'#778c56':'#9aa369'));leaf.rotation.z=-lx*2;leaf.rotation.y=a;}return g;}

function aboutDoor(surface:THREE.Object3D,root:THREE.Object3D){
  box(surface,1.93,3.73,.14,0,1.915,0,ivory,.03);
  panel(surface,1.53,1.46,0,2.8,ivory);panel(surface,1.53,1.45,0,1.03,ivory);
  for(let i=0;i<25;i++){let x=i%2?-.92:.92;box(surface,.018+random()*.04,.035+random()*.12,.007,x,.1+random()*3.6,.075,mat('#b39d7a'),.003);}
  label(surface,'About',1.15,.48,-.05,3.31,.143,{color:'#ae6956',font:'600 83px HDSCaveat,cursive',width:512,height:180,rotate:-.05});
  decal(surface,sticker('dragon'),.51,.59,-.43,2.7,.147,.14);
  decal(surface,sticker('pirate'),.59,.68,.30,2.53,.15,-.1);
  decal(surface,sticker('conan'),.49,.56,-.32,1.94,.153,-.10);
  decal(surface,sticker('spider'),.25,.29,.48,1.01,.143,.16);
  decal(surface,sticker('bat'),.27,.25,-.50,.67,.14,-.08);
  decal(surface,scribbles(),1.25,1.43,-.03,1.05,.145);
  // A little tape over the pirate sticker; the edges show through its tint.
  const tape=new THREE.MeshStandardMaterial({color:'#d6bb7d',transparent:true,opacity:.42,roughness:1,depthWrite:false});const t=box(surface,.28,.075,.005,.31,2.86,.158,tape,.001);t.rotation.z=.12;
  knob(surface);hinge(surface);
  // Miniature PS2-shaped keepsake and a loosely coiled controller lead.
  const consoleGroup=new THREE.Group();consoleGroup.position.set(-1.42,.06,.23);consoleGroup.rotation.y=.18;root.add(consoleGroup);
  box(consoleGroup,.23,.51,.43,0,.255,0,mat('#35434a'),.012);for(let i=0;i<6;i++)box(consoleGroup,.008,.015,.37,-.12,.09+i*.065,0,mat('#6b7677'),.001);
  label(consoleGroup,'PS2',.15,.075,0,.34,.221,{color:'#7b9da9',font:'28px sans-serif'});
  const controller=new THREE.Group();root.add(controller);controller.position.set(-1.50,.12,.68);controller.rotation.x=-.7;controller.rotation.z=-.18;
  box(controller,.34,.11,.19,0,0,0,mat('#42494a'),.045);orb(controller,-.13,-.06,0,.07,.13,.07,mat('#42494a'));orb(controller,.13,-.06,0,.07,.13,.07,mat('#42494a'));box(controller,.075,.025,.018,-.1,.02,.105,mat('#959187'),.002);box(controller,.025,.075,.018,-.1,.02,.105,mat('#959187'),.002);for(let i=0;i<4;i++){const a=i*Math.PI/2;orb(controller,.1+Math.sin(a)*.035,.02+Math.cos(a)*.035,.105,.012,.012,.01,mat(['#bc7971','#8a9b86','#9b8cb0','#bda57d'][i]));}
  line(root,[[-1.42,.05,.4],[-1.78,.05,.43],[-1.8,.05,.76],[-1.52,.07,.75]],.012,mat('#5e625d'));
}

function officeDoor(surface:THREE.Object3D,root:THREE.Object3D){
  box(surface,1.93,3.73,.14,0,1.915,0,officeWood,.025);
  box(surface,1.58,2.18,.035,0,2.47,.085,mat('#6f6a51'),.015);
  const glass=new THREE.MeshPhysicalMaterial({color:'#b6c1b2',roughness:.75,metalness:.03,clearcoat:.25});box(surface,1.43,2.02,.04,0,2.47,.11,glass,.02);
  // Fine fluting and a muted inset evoke a frosted study door.
  for(let i=0;i<25;i++)box(surface,.008,1.96,.004,-.68+i*.056,2.47,.134,mat(i%2?'#c0c7b6':'#aab8ab'),.001);
  label(surface,'WORK',1.03,.24,0,2.65,.151,{font:'500 51px Georgia',color:'#48594e'});
  label(surface,'HASSAN',.72,.13,0,2.37,.151,{font:'25px sans-serif',color:'#667466'});
  box(surface,.54,.013,.006,0,2.5,.15,mat('#8b9b87'),.001);
  panel(surface,1.46,.67,0,.64,officeWood);
  box(surface,.12,.36,.04,.73,1.36,.13,darkBrass,.016);box(surface,.25,.044,.07,.66,1.39,.23,brass,.018);
  hinge(surface);
  const plaque=box(root,1.07,.26,.04,0,3.98,.24,mat('#c0a471'),.025);label(plaque,'THE STUDY',.84,.13,0,0,.026,{font:'28px sans-serif',color:'#5b513d'});
  const matMesh=box(root,1.38,.026,.62,0,.032,.62,mat('#a89e7e'),.025);label(matMesh,'good things take work',1.13,.25,0,.018,.015,{font:'28px HDSCaveat,cursive',color:'#6e6956'}).rotation.x=-Math.PI/2;
}

function libraryDoor(surface:THREE.Object3D,root:THREE.Object3D){
  box(surface,1.92,3.73,.14,0,1.915,-.17,walnut,.02);
  for(const x of [-.89,.89])box(surface,.15,3.73,.52,x,1.915,.03,walnut,.018);
  for(const y of [.13,.94,1.82,2.7,3.76]){box(surface,1.92,.105,.55,0,y,.04,walnut,.018);box(surface,1.94,.045,.06,0,y+.005,.33,wood('#9b724b'),.01);}
  let n=0;
  for(let row=0;row<4;row++){
    let x=-.72;const y=[.20,1.005,1.885,2.765][row];
    const entries=row===0?5:row===1?5:row===2?5:4;
    for(let i=0;i<entries;i++){
      const chosen=books[n%6];const desc=n++<6?chosen:{...chosen,title:'',author:''},w=.16+random()*.10,h=.48+random()*.20;
      book(surface,desc,w,h,x+w/2,y,.16,i===entries-1?-.08:0);x+=w+.035;
    }
    if(row===3){const small=pot(surface,.56,y,.10,.43);small.rotation.y=.2;}
  }
  // Small library plaque, tucked into the cornice rather than covering the books.
  box(root,1.16,.28,.07,0,3.99,.25,wood('#a78352'),.025);label(root,'LIBRARY',.97,.16,0,3.99,.292,{font:'39px Georgia',color:'#f3dfb3'});
  const hook=mesh(new THREE.TorusGeometry(.065,.013,7,20),darkBrass,surface,.76,1.42,.35);hook.rotation.y=.15;
  const stack=new THREE.Group();stack.position.set(1.40,.12,.38);stack.rotation.y=-.15;root.add(stack);
  for(let i=0;i<3;i++){const b=box(stack,.47,.095,.36,0,i*.10,0,mat(books[(i+2)%6].color),.01);b.rotation.y=i%2?.1:-.05;box(stack,.43,.052,.33,0,i*.1,0,mat('#dbc9a4'),.002);}
  cyl(root,.083,.066,.12,1.4,.43,.38,mat('#e2d4b6'));cyl(root,.067,.067,.006,1.4,.494,.38,mat('#6c4f30'));const handle=mesh(new THREE.TorusGeometry(.044,.012,7,18),mat('#e2d4b6'),root,1.49,.445,.38);handle.rotation.y=Math.PI/2;
}

function gardenDoor(surface:THREE.Object3D,root:THREE.Object3D,leaves:Leaf[]){
  const glass=new THREE.MeshPhysicalMaterial({color:'#c6d4af',roughness:.18,metalness:.02,transparent:true,opacity:.26,clearcoat:1,depthWrite:false});
  for(const x of [-.89,.89])box(surface,.15,3.73,.16,x,1.915,0,sage,.022);
  for(const y of [.13,1.04,3.73])box(surface,1.92,y===1.04?.12:.18,.16,0,y,0,sage,.02);
  box(surface,1.69,.76,.13,0,.58,0,sage,.022);panel(surface,1.4,.51,0,.58,sage);
  box(surface,1.69,2.55,.025,0,2.39,-.02,glass,.004);
  box(surface,.045,2.59,.09,0,2.39,.015,sage,.007);
  box(surface,1.73,.048,.09,0,2.39,.015,sage,.007);
  // Sparse reflected brush strokes on the panes.
  const reflection=new THREE.MeshBasicMaterial({color:'#fff8df',transparent:true,opacity:.19,depthWrite:false});for(const x of [-.56,.04,.6]){const glint=box(surface,.019,.56,.002,x,3.2,.07,reflection,.001);glint.rotation.z=-.34;}
  knob(surface,.75,1.22);hinge(surface);
  const sign=box(surface,.82,.24,.04,-.05,.59,.13,wood('#bbbd93'),.025);label(sign,'garden',.71,.18,0,0,.024,{font:'52px HDSCaveat,cursive',color:'#4f6548'});
  // Climbing stems belong to the fixed frame, so the leaf can open freely.
  for(let side of [-1]){
    const pts=[];for(let i=0;i<7;i++)pts.push([side*(1.12+Math.sin(i*.9)*.08),.6+i*.48,.12+Math.cos(i)*.04]);
    line(root,pts,.018,mat('#6f8051'));
    for(let i=0;i<9;i++){
      const y=.65+i*.34,x=side*(1.13+Math.sin(y*2)*.08);const leaf=orb(root,x+Math.sin(i*3)*.11,y,.18,.065,.14,.022,mat(['#748954','#8c9a61','#abb17a'][i%3]));leaf.rotation.z=side*(i%2?.6:-.9);leaf.rotation.y=Math.sin(i)*.5;leaves.push({mesh:leaf,base:leaf.rotation.z,phase:i});
    }
  }
  pot(root,1.42,.04,.36,.72);
}

function room(root:THREE.Object3D,index:number){
  const g=new THREE.Group();root.add(g);
  const walls=[mat('#d1ad87'),mat('#c0c5ae'),mat('#9a7249'),mat('#9cac7d')][index];
  box(g,1.96,3.75,.12,0,1.92,-1.12,walls,.005);
  box(g,.08,3.75,1.1,-.94,1.92,-.57,walls,.005);box(g,.08,3.75,1.1,.94,1.92,-.57,walls,.005);
  box(g,1.96,.08,1.18,0,.06,-.55,wood(index===3?'#8d986b':'#a38155'),.005);
  box(g,1.96,.08,1.18,0,3.77,-.55,walls,.005);
  const glow=new THREE.PointLight(['#ffbd7c','#fff1cb','#ffbd69','#dcf3ac'][index],index===2?3:index===3?.8:1.4,4,2);glow.position.set(0,2.9,-.3);g.add(glow);
  if(index===0){
    box(g,1.16,.66,.04,-.11,2.7,-1.03,mat('#9b7861'),.02);
    const notes:[string,number,number][]=[['#e4c56b',-.41,2.86],['#c0cfb3',-.04,2.8],['#dca797',.3,2.59],['#ece0bb',-.36,2.55]];
    for(const [color,x,y] of notes){const note=box(g,.27,.26,.008,x,y,-.99,mat(color),.001);note.rotation.z=(random()-.5)*.3;}
    box(g,1.4,.08,.43,0,1.15,-.65,wood('#b3835b'));for(const x of [-.58,.58])box(g,.07,1.05,.07,x,.58,-.63,mat('#9d7659'));
    orb(g,.35,.27,-.33,.19,.19,.19,mat('#dca545'));for(let i=0;i<3;i++)orb(g,.30+i*.05,.30,-.153,.013,.013,.008,mat('#ad5534'));
    box(g,.32,.35,.03,-.36,1.37,-.71,mat('#d6bb83'));label(g,'ideas!',.28,.19,-.36,1.38,-.69,{font:'45px HDSCaveat',color:'#8b654b'});
    const bunting=[[-.82,3.35,-.92],[-.35,3.19,-.92],[.2,3.17,-.92],[.78,3.3,-.92]];line(g,bunting,.008,mat('#948067'));for(let i=0;i<7;i++){const flag=mesh(new THREE.ConeGeometry(.09,.18,3),mat(['#c68b73','#9aa683','#d3b46b'][i%3]),g,-.73+i*.23,3.17+Math.pow((i-3)*.06,2),-.90);flag.rotation.z=Math.PI;flag.scale.z=.08;}
  }else if(index===1){
    box(g,1.46,.09,.66,0,1.2,-.55,officeWood);for(const x of [-.60,.60])box(g,.06,1.13,.07,x,.61,-.53,mat('#6b6f5d'));
    box(g,.62,.39,.045,-.08,1.57,-.71,mat('#46524e'),.025);box(g,.54,.31,.006,-.08,1.58,-.681,mat('#b8c6b3'),.006);box(g,.045,.12,.045,-.08,1.32,-.71,mat('#58625a'));box(g,.27,.025,.14,-.08,1.26,-.68,mat('#58625a'));
    for(let i=0;i<3;i++)box(g,.25,.008,.006,-.13,1.65-i*.07,-.674,mat('#8a9a85'),.001);
    pot(g,.54,1.25,-.62,.35);box(g,.3,.02,.19,-.43,1.26,-.40,mat('#dfd5b9'),.005);
    box(g,.62,.78,.03,.1,2.82,-1.03,officeWood);label(g,'MAKE\n',.4,.16,.1,2.91,-1.007,{font:'34px sans-serif',color:'#efe8ce'});label(g,'IT MATTER',.5,.15,.1,2.7,-1.007,{font:'25px sans-serif',color:'#efe8ce'});
  }else if(index===2){
    // Comfy armchair, warm lamp and a small rainy window.
    box(g,.82,.19,.67,.22,.35,-.54,mat('#b37d45'),.065);box(g,.80,.77,.16,.22,.75,-.85,mat('#b8884b'),.07);for(const x of [-.22,.66])box(g,.15,.39,.68,x,.55,-.54,mat('#b37d45'),.065);box(g,.59,.09,.47,.22,.48,-.5,mat('#c3995c'),.04);box(g,.26,.35,.09,.12,.85,-.73,mat('#d6b781'),.035);
    cyl(g,.10,.13,.045,-.55,.10,-.50,brass);cyl(g,.017,.017,1.88,-.55,1.04,-.50,darkBrass);cyl(g,.17,.31,.35,-.55,2.04,-.50,mat('#e1bf7e'));orb(g,-.55,1.92,-.50,.09,.07,.09,new THREE.MeshStandardMaterial({color:'#ffe3aa',emissive:'#ffc26e',emissiveIntensity:.7}));
    box(g,.83,.89,.045,.24,2.73,-1.03,walnut);box(g,.72,.78,.012,.24,2.73,-.999,mat('#899b9b'));box(g,.035,.78,.02,.24,2.73,-.98,walnut);box(g,.72,.035,.02,.24,2.73,-.98,walnut);
    for(let i=0;i<14;i++){const rain=box(g,.008,.065,.004,-.08+random()*.65,2.4+random()*.65,-.983,mat('#b8c3b9'),.001);rain.rotation.z=-.15;}
    cyl(g,.18,.18,.035,-.42,.67,-.13,walnut);cyl(g,.025,.025,.56,-.42,.36,-.13,darkBrass);cyl(g,.055,.045,.08,-.42,.73,-.13,cream);
  }else{
    const sky=box(g,1.79,3.5,.01,0,1.95,-1.047,mat('#bbc5a2'));(sky.material as THREE.MeshStandardMaterial).map=paper('#bbc5a2');
    for(let i=0;i<4;i++){const x=-.66+i*.44,y=2.55+Math.sin(i*1.7)*.3;box(g,.035,2.25,.035,x,1.4,-.92,mat('#7a8060'));for(let j=0;j<2;j++)orb(g,x+Math.sin(j*2)*.10,y+j*.19,-.91,.24,.44,.06,mat(['#8c9e73','#a3b181','#7b956b'][(i+j)%3]));}
    for(let i=0;i<13;i++){const leaf=orb(g,(random()-.5)*1.55,.23+random()*.35,-.25-random()*.6,.10,.22,.04,mat(i%2?'#718953':'#9aa76e'));leaf.rotation.z=random()-.5;}
    for(let i=0;i<5;i++){const stone=orb(g,-.15+Math.sin(i*.8)*.23,.12,-.15-i*.16,.14,.025,.11,mat('#c4bf9d'));stone.rotation.y=i;}
    const pond=cyl(g,.27,.27,.013,.52,.11,-.44,new THREE.MeshPhysicalMaterial({color:'#9daea0',metalness:.25,roughness:.2,clearcoat:1}));pond.scale.z=.7;
  }
  return g;
}


  const root=new THREE.Group();root.name=['About','Work','Library','Garden'][index];
  const leaves:Leaf[]=[];const interior=room(root,index);frame(root,[ivory,officeWood,walnut,sage][index],index);
  const pivot=new THREE.Group();pivot.position.set(-.96,0,.16);root.add(pivot);const surface=new THREE.Group();surface.position.x=.96;pivot.add(surface);
  [aboutDoor,officeDoor,libraryDoor,gardenDoor][index](surface,root,leaves);
  root.traverse(obj=>{obj.userData.door=index;});
  return {
    root,pivot,interior,leaves,angle:0,target:0,hover:0,index,
    update(dt:number,time:number,reduced:boolean){
      // A small inviting crack at the hinge; fully opened doors keep their angle.
      const target=this.target>0?this.target:(!reduced && this.hover ? .045 : 0);
      const rate=reduced?1:1-Math.exp(-dt*6);
      this.angle=THREE.MathUtils.lerp(this.angle,target,rate);
      if(Math.abs(this.angle-target)<.0002)this.angle=target;
      pivot.rotation.y=-this.angle;
      for(const leaf of leaves)leaf.mesh.rotation.z=leaf.base+(reduced?0:Math.sin(time*.8+leaf.phase)*.035);
    },
  };
}
