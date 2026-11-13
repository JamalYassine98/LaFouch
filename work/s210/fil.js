()=>{const t=document.querySelector('.top');if(t&&!document.querySelector('.lxnav')){const n=document.createElement('nav');n.className='lxnav';n.innerHTML=['Solar','De lectura','Armazones','Ofertas'].map(x=>'<a href="#">'+x+'</a>').join('');t.appendChild(n)}
const h=document.querySelector('#vitrine.in .vnav b');
document.querySelectorAll('.lxnav a').forEach(a=>a.classList.toggle('on',!!h&&h.textContent.trim().toLowerCase().startsWith(a.textContent.trim().toLowerCase().slice(0,5))));
if(innerWidth>=900){const g=document.querySelector('.lfgf');if(g&&!g.dataset.lx){g.dataset.lx=1;g.innerHTML='Ordenar: <b>Novidades</b> <i>▾</i>'}}
document.querySelectorAll('#fsh small').forEach(s=>{if(/G[eêé]n/i.test(s.textContent)){s.style.display='none';const n=s.nextElementSibling;if(n)n.style.display='none'}});}
