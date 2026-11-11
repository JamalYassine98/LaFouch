(function(){
const mir=d=>d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g,(m,x,y)=>(120-x).toFixed(2).replace(/\.?0+$/,'')+' '+y);
// óculos gatinho
const LL='M58.5 77.5 C58.5 74.6 56.8 73.6 53.4 73.5 L40 73.1 C36.4 73 33.6 72.4 31 70.6 C30.9 73.6 31.6 77.4 33 81.2 C35 88.8 39.4 93.6 46 93.6 C53.2 93.6 58.5 88.4 58.5 81.6 Z';
const TL='M57.4 74.6 C56.4 73.7 55 73.5 53.4 73.5 L40 73.1 C36.4 73 33.6 72.4 31 70.6';
const D='<defs><linearGradient id="lftcat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d27c9d"/><stop offset=".55" stop-color="#a8467a"/><stop offset="1" stop-color="#c86b91"/></linearGradient><radialGradient id="lftrose" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#ffd3df"/><stop offset=".6" stop-color="#f29ab5"/><stop offset="1" stop-color="#d9668e"/></radialGradient><linearGradient id="lfthat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e7c1cd"/><stop offset=".38" stop-color="#f6dfe6"/><stop offset=".75" stop-color="#ebc8d3"/><stop offset="1" stop-color="#d9aab9"/></linearGradient></defs>';
const ocl=D+`<path class="lfcL" d="${LL}" fill="url(#lfmlz)" stroke="url(#lftcat)" stroke-width="2.1" stroke-linejoin="round"/><path d="${mir(LL)}" fill="url(#lfmlz)" stroke="url(#lftcat)" stroke-width="2.1" stroke-linejoin="round"/>`+
 `<path d="${TL}" stroke="url(#lftcat)" stroke-width="2.9" fill="none" stroke-linecap="round"/><path d="${mir(TL)}" stroke="url(#lftcat)" stroke-width="2.9" fill="none" stroke-linecap="round"/>`+
 `<path d="M58.5 77 Q60 75.2 61.5 77" stroke="#8d3a69" stroke-width="2.2" fill="none" stroke-linecap="round"/>`+
 `<path d="M32 76 C26 77.5 21 78.4 16.5 79" fill="none" stroke="#8d3a69" stroke-width="2.4" stroke-linecap="round"/><path d="M88 76 C94 77.5 99 78.4 103.5 79" fill="none" stroke="#8d3a69" stroke-width="2.4" stroke-linecap="round"/>`+
 `<circle cx="32.4" cy="72.6" r="1.1" fill="#f3d27a"/><circle cx="87.6" cy="72.6" r="1.1" fill="#f3d27a"/>`+
 '<path d="M38 77 l3.2 -2 M68 77 l3.2 -2" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>';
// rosa
function rosa(x,y,r){let p='';
 for(let i=0;i<6;i++){const a=i*60+15,rad=a*Math.PI/180;const cx=x+Math.cos(rad)*r*.55,cy=y+Math.sin(rad)*r*.55;p+=`<ellipse cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" rx="${(r*.55).toFixed(2)}" ry="${(r*.42).toFixed(2)}" transform="rotate(${a+90} ${cx.toFixed(2)} ${cy.toFixed(2)})" fill="url(#lftrose)" stroke="#d9668e" stroke-width=".5"/>`}
 p+=`<circle cx="${x}" cy="${y}" r="${(r*.5).toFixed(2)}" fill="#e8799e"/>`;
 p+=`<path d="M${x-r*.3} ${y+r*.05} q${r*.3} ${-r*.45} ${r*.55} ${-r*.05} q${-r*.05} ${r*.38} ${-r*.42} ${r*.32} M${x-r*.1} ${y-r*.05} q${r*.15} ${-r*.18} ${r*.25} 0" stroke="#b9426d" stroke-width=".7" fill="none" stroke-linecap="round"/>`;
 return p}
const fr=D+'<path d="M-2 52 A62 10.5 0 0 0 122 52 Z" fill="url(#lfthat)"/><path d="M-1 52.6 Q60 70 121 52.6" stroke="#c995a7" stroke-width=".9" fill="none" opacity=".8"/>'+
 '<path d="M27 54 C26 38 37 25 60 25 C83 25 94 38 93 54 Q60 60 27 54Z" fill="url(#lfthat)"/><path d="M36 32 C41 28 47 26.5 53 26.2" stroke="#fff" stroke-width="2" opacity=".55" fill="none" stroke-linecap="round"/>'+
 '<path d="M27.3 45.8 Q60 52 92.7 45.8 L93 54 Q60 60 27 54Z" fill="#8d3a69"/><path d="M27.5 47 Q60 53.2 92.5 47" stroke="#b25887" stroke-width=".7" fill="none"/>'+
 '<ellipse cx="25" cy="53.5" rx="5" ry="2.1" transform="rotate(-25 25 53.5)" fill="#6aa877"/><ellipse cx="42" cy="55" rx="4.6" ry="1.9" transform="rotate(20 42 55)" fill="#5f9e6e"/>'+
 rosa(34,50,9.2)+'<g fill="#fff"><circle cx="43.5" cy="48" r="1.2"/><circle cx="24.5" cy="47" r="1.1"/></g>';
const flor=(x,y,r,c)=>{let p='';for(let i=0;i<5;i++){const a=i*72*Math.PI/180;p+=`<circle cx="${(x+Math.cos(a)*r*.6).toFixed(2)}" cy="${(y+Math.sin(a)*r*.6).toFixed(2)}" r="${(r*.5).toFixed(2)}"/>`}return `<g fill="${c}">${p}</g><circle cx="${x}" cy="${y}" r="${r*.3}" fill="#f3c34f"/>`};
TEMA_M.maes={corte:"M-40 53.5 L160 53.5 L160 200 L-40 200 Z",tr:'<ellipse cx="60" cy="52" rx="62" ry="10.5" fill="#d7a9b8"/><ellipse cx="60" cy="51.6" rx="52" ry="7.4" fill="#c18fa1"/>',fr:fr,ocl:ocl,
 fundo:flor(-3,70,4.2,'#f2a7bf')+flor(116,38,3.2,'#f6c3d3')+flor(113,104,3,'#f2a7bf')};
})();
