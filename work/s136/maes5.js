(function(){
const mir=d=>d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g,(m,x,y)=>(120-x).toFixed(2).replace(/\.?0+$/,'')+' '+y);
// óculos gatinho
const D='<defs><linearGradient id="lftcat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c9608d"/><stop offset=".5" stop-color="#8d3a69"/><stop offset="1" stop-color="#b24c78"/></linearGradient><radialGradient id="lftrose" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#ffd3df"/><stop offset=".6" stop-color="#f29ab5"/><stop offset="1" stop-color="#d9668e"/></radialGradient><linearGradient id="lfthat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e7c1cd"/><stop offset=".38" stop-color="#f6dfe6"/><stop offset=".75" stop-color="#ebc8d3"/><stop offset="1" stop-color="#d9aab9"/></linearGradient></defs>';
const BR='<path d="M57.6 78 Q60 75.8 62.4 78" stroke="#8d3a69" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
const SHN='<path d="M38.5 78.6 l3.2 -2 M68.5 78.6 l3.2 -2" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>';
const CO='<defs><linearGradient id="lftnu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dca7b1"/><stop offset=".55" stop-color="#c78b96"/><stop offset="1" stop-color="#b07784"/></linearGradient></defs>';
const OF='M60.4 79 C60.4 74.6 58.8 72.2 55.4 71.8 L38.5 71.4 C33.6 71.2 29.8 70 26 66.6 C26.2 73  28.6 79.6 31.4 85.4 C34.2 91.8 39.2 96.2 45.8 96.2 C53.8 96.2 60.4 90.6 60.4 82.6 Z';
const HO='M57.6 79.4 C57.6 76.4 56.4 74.8 54.2 74.6 L39 74.3 C35.6 74.2 33 73.6 30.8 72.4 C31.2 77.4 32.6 82.4 34.6 86.4 C37 91.2 40.8 93.6 45.8 93.6 C52.4 93.6 57.6 89.4 57.6 83 Z';
const TOP='M29.4 69.4 C32.8 71.2 35.8 72 39 72.1 L54.6 72.5';
const oclA=D+CO+`<path class="lfcL" d="${HO}" fill="url(#lfmlz)"/><path d="${mir(HO)}" fill="url(#lfmlz)"/>`+
 `<path d="M29.6 70.2 C25 74.4 21 77 16.5 79" fill="none" stroke="#b07784" stroke-width="2.4" stroke-linecap="round"/><path d="M90.4 70.2 C95 74.4 99 77 103.5 79" fill="none" stroke="#b07784" stroke-width="2.4" stroke-linecap="round"/>`+
 `<path d="${OF} ${HO}" fill="url(#lftnu)" fill-rule="evenodd" stroke="#9c6472" stroke-width=".45"/><path d="${mir(OF)} ${mir(HO)}" fill="url(#lftnu)" fill-rule="evenodd" stroke="#9c6472" stroke-width=".45"/>`+
 `<path d="M57.6 73.4 Q60 72.4 62.4 73.4 L62.2 77.6 Q60 76.2 57.8 77.6 Z" fill="url(#lftnu)" stroke="#9c6472" stroke-width=".45"/>`+
 `<path d="${TOP}" stroke="#f7e4e6" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".9"/><path d="${mir(TOP)}" stroke="#f7e4e6" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".9"/>`+
 `<path d="M29.4 70.8 l2.4 .4 M90.6 70.8 l-2.4 .4" stroke="#e9e3e6" stroke-width="1" stroke-linecap="round"/>`+SHN;
const ocl=oclA;
// rosa
function rosa(x,y,r){let p='';
 for(let i=0;i<6;i++){const a=i*60+15,rad=a*Math.PI/180;const cx=x+Math.cos(rad)*r*.55,cy=y+Math.sin(rad)*r*.55;p+=`<ellipse cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" rx="${(r*.55).toFixed(2)}" ry="${(r*.42).toFixed(2)}" transform="rotate(${a+90} ${cx.toFixed(2)} ${cy.toFixed(2)})" fill="url(#lftrose)" stroke="#d9668e" stroke-width=".5"/>`}
 p+=`<circle cx="${x}" cy="${y}" r="${(r*.5).toFixed(2)}" fill="#e8799e"/>`;
 p+=`<path d="M${x-r*.3} ${y+r*.05} q${r*.3} ${-r*.45} ${r*.55} ${-r*.05} q${-r*.05} ${r*.38} ${-r*.42} ${r*.32} M${x-r*.1} ${y-r*.05} q${r*.15} ${-r*.18} ${r*.25} 0" stroke="#b9426d" stroke-width=".7" fill="none" stroke-linecap="round"/>`;
 return p}
const fr=D+'<path d="M-6 53 A66 11 0 0 0 126 53 Z" fill="url(#lfthat)"/><path d="M-5 53.6 Q60 71.5 125 53.6" stroke="#c995a7" stroke-width=".9" fill="none" opacity=".8"/>'+
 '<clipPath id="lftmc"><path d="M17.43 54.00 C16.14 35.76 30.33 20.94 60.00 20.94 C89.67 20.94 103.86 35.76 102.57 54.00 Q60.00 60.84 17.43 54.00Z"/></clipPath><path d="M17.43 54.00 C16.14 35.76 30.33 20.94 60.00 20.94 C89.67 20.94 103.86 35.76 102.57 54.00 Q60.00 60.84 17.43 54.00Z" fill="url(#lfthat)"/><path d="M28 36 C33 28 40.5 23.6 50 22.4" stroke="#fff" stroke-width="2.2" opacity=".55" fill="none" stroke-linecap="round"/><g clip-path="url(#lftmc)"><path d="M0 44.2 Q60 52.6 120 44.2 L120 70 L0 70Z" fill="#8d3a69"/><path d="M0 45.6 Q60 54 120 45.6" stroke="#b25887" stroke-width=".7" fill="none"/></g>'+
 '<ellipse cx="19.5" cy="53" rx="5" ry="2.1" transform="rotate(-25 25 53.5)" fill="#6aa877"/><ellipse cx="38" cy="54.6" rx="4.6" ry="1.9" transform="rotate(20 42 55)" fill="#5f9e6e"/>'+
 rosa(29,49.5,9.2)+'<g fill="#fff"><circle cx="39" cy="47.5" r="1.2"/><circle cx="19.5" cy="46.5" r="1.1"/></g>';
const flor=(x,y,r,c)=>{let p='';for(let i=0;i<5;i++){const a=i*72*Math.PI/180;p+=`<circle cx="${(x+Math.cos(a)*r*.6).toFixed(2)}" cy="${(y+Math.sin(a)*r*.6).toFixed(2)}" r="${(r*.5).toFixed(2)}"/>`}return `<g fill="${c}">${p}</g><circle cx="${x}" cy="${y}" r="${r*.3}" fill="#f3c34f"/>`};
TEMA_M.maes={corte:"M-40 54 L160 54 L160 200 L-40 200 Z",tr:'<ellipse cx="60" cy="53" rx="66" ry="11" fill="#d7a9b8"/><ellipse cx="60" cy="52.6" rx="57" ry="8" fill="#c18fa1"/>',fr:fr,ocl:ocl,
 fundo:flor(-3,70,4.2,'#f2a7bf')+flor(116,38,3.2,'#f6c3d3')+flor(113,104,3,'#f2a7bf')};
})();
