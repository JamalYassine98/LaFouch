()=>{const FS={11:11.5,13:13.5,14:13.5,14.5:15,16.5:16,21:20},SP={3:4,5:6,7:8,9:8,13:12,14:12,15:16,18:16,22:24};
const snap=v=>{const n=parseFloat(v);return SP[n]!==undefined&&/px$/.test(v)?SP[n]+'px':null};
document.querySelectorAll('body *').forEach(e=>{if(e.closest('svg,.wa,#layer .buy,.hbt'))return;const c=getComputedStyle(e);if(!e.dataset.lx4){e.dataset.lx4=1;
 const f=parseFloat(c.fontSize);if(FS[f]&&e.childNodes.length&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))e.style.setProperty('font-size',FS[f]+'px','important');
 ['paddingTop','paddingBottom','paddingLeft','paddingRight','marginTop','marginBottom','rowGap','columnGap'].forEach(p=>{const s=snap(c[p]);if(s)e.style[p]=s});
 const w=+c.fontWeight,price=e.closest('.pr,.hp,.hpr,.bb,.p1,button.bb');if(w>=800)e.style.setProperty('font-weight','700','important');else if(w>=700&&!price&&f<16&&!/^H\d$/.test(e.tagName))e.style.setProperty('font-weight','500','important')}});
if(innerWidth<700)document.querySelectorAll('.hdots button,.hsh a,.lfgf,.nlk,a.mp').forEach(e=>{const r=e.getBoundingClientRect();if(!r.height)return;e.classList.add('lxhit');e.style.outlineOffset=Math.max(2,Math.round((44-r.height)/2))+'px'})}
