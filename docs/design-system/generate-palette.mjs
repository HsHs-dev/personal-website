// Documentation-only: derive every notation and contrast ratio from sRGB bytes.
// Run: node docs/design-system/generate-palette.mjs
import { writeFileSync } from 'node:fs';
const swatches = {
  plaster: '#EEE6D7', paper: '#F4ECDD', oat: '#DFD3BF', ink: '#343B39', muted: '#62655D',
  dusk: '#202E38', duskPanel: '#2D3D46', moon: '#D9E2DC', mist: '#B4C2C0',
  plum: '#774C65', clay: '#9A5845', chalkBlue: '#486C7B', ochre: '#C6A15B',
  desk: '#E4E5DA', petrol: '#355E5B', walnut: '#49392F', tea: '#EAD5AC',
  amber: '#CBA363', pond: '#172F30', reed: '#254344', leaf: '#B4C8AA',
  firefly: '#DED08A', moss: '#4D654B', rose: '#F0C4BB', berry: '#884958',
};
const linear = x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4;
const n = (x,d=3) => Number(x.toFixed(d));
const colors = Object.fromEntries(Object.entries(swatches).map(([name,hex]) => {
  const rgb = hex.slice(1).match(/../g).map(x => parseInt(x,16));
  const [r,g,b] = rgb.map(x => x/255), max = Math.max(r,g,b), min = Math.min(r,g,b), delta = max-min;
  const light = (max+min)/2;
  let hue = delta === 0 ? 0 : max === r ? ((g-b)/delta)%6 : max === g ? (b-r)/delta+2 : (r-g)/delta+4;
  hue = (hue*60+360)%360;
  const sat = delta === 0 ? 0 : delta / (1-Math.abs(2*light-1));
  const [R,G,B] = [r,g,b].map(linear);
  const l = Math.cbrt(.4122214708*R+.5363325363*G+.0514459929*B);
  const m = Math.cbrt(.2119034982*R+.6806995451*G+.1073969566*B);
  const s = Math.cbrt(.0883024619*R+.2817188376*G+.6299787005*B);
  const L = .2104542553*l+.793617785*m-.0040720468*s;
  const a = 1.9779984951*l-2.428592205*m+.4505937099*s;
  const bb = .0259040371*l+.7827717662*m-.808675766*s;
  const C = Math.hypot(a,bb), H = (Math.atan2(bb,a)*180/Math.PI+360)%360;
  return [name,{hex,rgb:`rgb(${rgb.join(' ')})`,hsl:`hsl(${n(hue,2)} ${n(sat*100,2)}% ${n(light*100,2)}%)`,oklch:`oklch(${n(L*100,4)}% ${n(C,6)} ${n(H,3)})`, luminance:.2126*R+.7152*G+.0722*B}];
}));
const pairs = [
  ['ink','plaster'],['muted','plaster'],['ink','paper'],['muted','paper'],
  ['moon','dusk'],['mist','dusk'],['moon','duskPanel'],['mist','duskPanel'],
  ['plum','paper'],['paper','plum'],['clay','paper'],['chalkBlue','paper'],
  ['ink','desk'],['muted','desk'],['petrol','desk'],['paper','petrol'],
  ['tea','walnut'],['amber','walnut'],['walnut','tea'],
  ['moon','pond'],['leaf','pond'],['firefly','pond'],['moon','reed'],['leaf','reed'],['pond','firefly'],
  ['moss','paper'],['berry','paper'],['rose','pond'],['rose','dusk'],['ink','oat'],['ink','ochre'],
  ['petrol','plaster'],['plum','plaster'],['firefly','dusk'],['firefly','duskPanel'],
  ['firefly','reed'],['rose','reed'],['petrol','paper'],
];
const contrast = pairs.map(([foreground,background]) => {
  const a=colors[foreground].luminance,b=colors[background].luminance;
  const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  if(ratio<4.5) throw Error(`${foreground}/${background}: ${ratio}`);
  return {foreground,background,ratio:n(ratio,2),normalTextAA:true};
});
const table = ['# Color reference','',
  'Generated from sRGB hex by `generate-palette.mjs`. RGB is 0–255, HSL hue is degrees, OKLCH lightness is percent. Rounded notations describe the same colors; hex is the canonical source. All colors are inside sRGB. Do not infer contrast from OKLCH lightness alone.','',
  '| Token | Hex | RGB | HSL | OKLCH |','|---|---|---|---|---|',
  ...Object.entries(colors).map(([k,c])=>`| ${k} | ${c.hex} | ${c.rgb} | ${c.hsl} | ${c.oklch} |`),
  '', '## Verified opaque text pairs','',
  'WCAG relative luminance contrast; all listed pairs pass 4.5:1 for normal text. This verifies solid colors only, not rendered 3D materials, textures, transparency, or complete page accessibility. Reversed foreground/background gives the same ratio.','',
  '| Foreground | Background | Ratio |','|---|---|---|',
  ...contrast.map(c=>`| ${c.foreground} | ${c.background} | ${c.ratio}:1 |`),'',
  'Conversion reference: [CSS Color 4](https://www.w3.org/TR/css-color-4/). Contrast reference: [WCAG contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).','',
].join('\n');
writeFileSync(new URL('./PALETTE.md',import.meta.url),table);
writeFileSync(new URL('./palette.json',import.meta.url),JSON.stringify({colors,contrast},null,2)+'\n');
console.log(`Wrote ${Object.keys(colors).length} swatches; ${contrast.length} text pairs pass AA.`);
