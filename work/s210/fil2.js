()=>{const t=document.querySelector('.top');if(t&&!document.querySelector('.lxnav')){const n=document.createElement('nav');n.className='lxnav';n.innerHTML=['Solar','De lectura','Armazones','Ofertas'].map(x=>'<a href="#">'+x+'</a>').join('');t.appendChild(n)}
const h=document.querySelector('#vitrine.in .vnav b');
document.querySelectorAll('.lxnav a').forEach(a=>a.classList.toggle('on',!!h&&h.textContent.trim().toLowerCase().startsWith(a.textContent.trim().toLowerCase().slice(0,5))));
const g=document.getElementById('lfgen');
if(g&&!g.dataset.lx){g.dataset.lx=1;const f=g.querySelector('.lfgf');
 const fs=[...g.querySelectorAll('button')];fs.forEach(b=>b.classList.toggle('on',b.dataset.gen==='f'));
 if(innerWidth>=900){const r=document.createElement('span');r.className='lxr';r.innerHTML='<a href="#" class="lxt">Formato <i>▾</i></a>';f.innerHTML='Filtrar <i>›</i>';r.appendChild(f);r.insertAdjacentHTML('beforeend','<a href="#" class="lxt">Ordenar: <b>Novedades</b> <i>▾</i></a>');g.appendChild(r)}
 else f.innerHTML='Filtrar <i>›</i>';
 g.insertAdjacentHTML('afterend','<div class="lxap"><b>Femenino <i>✕</i></b><b>Redondo <i>✕</i></b><a href="#">Limpiar todo</a></div>')}
const S={Redondo:'<circle cx="12" cy="10" r="7"/><circle cx="34" cy="10" r="7"/><path d="M19 9q4-3 8 0"/>',Cuadrado:'<rect x="4" y="3" width="15" height="13" rx="2"/><rect x="27" y="3" width="15" height="13" rx="2"/><path d="M19 8h8"/>',Rectangular:'<rect x="3" y="5" width="17" height="10" rx="2"/><rect x="26" y="5" width="17" height="10" rx="2"/><path d="M20 9h6"/>',Gatito:'<path d="M3 4q8-1 17 3q-1 9-8 9q-7 0-9-12z"/><path d="M43 4q-8-1-17 3q1 9 8 9q7 0 9-12z"/><path d="M20 8h6"/>',Aviador:'<path d="M4 4h15q0 12-7 12T4 4z"/><path d="M27 4h15q0 12-8 12T27 4z"/><path d="M19 5h8M19 3h8"/>',Hexagonal:'<path d="M7 3h9l4 7-4 7H7l-4-7z"/><path d="M30 3h9l4 7-4 7h-9l-4-7z"/><path d="M20 9h6"/>'};
const fg=document.getElementById('fstG');
if(fg&&!document.querySelector('.lxfm')){fg.insertAdjacentHTML('afterend','<small>Formato</small><div class="lxfm">'+Object.keys(S).map(k=>'<button type="button" class="'+(k==='Redondo'?'on':'')+'"><svg viewBox="0 0 46 20">'+S[k]+'</svg>'+k+'</button>').join('')+'</div>');
 document.querySelectorAll('#fstG button').forEach(b=>{const o=b.dataset.fgn==='f';b.classList.toggle('on',o);b.setAttribute('aria-pressed',o)})}}
