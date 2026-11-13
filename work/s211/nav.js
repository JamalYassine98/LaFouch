()=>{const t=document.querySelector('.top');if(t&&!document.querySelector('.lxnav')){const n=document.createElement('nav');n.className='lxnav';n.innerHTML=['Solar','De lectura','Armazones','Ofertas'].map(x=>'<a href="#">'+x+'</a>').join('');t.appendChild(n)}
const h=document.querySelector('#vitrine.in .vnav b');
document.querySelectorAll('.lxnav a').forEach(a=>a.classList.toggle('on',!!h&&h.textContent.trim().toLowerCase().startsWith(a.textContent.trim().toLowerCase().slice(0,5))))}
