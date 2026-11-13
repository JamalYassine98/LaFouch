()=>{const C=['Solar','De lectura','Armazones','Ofertas'];const t=document.querySelector('.top');if(t&&!document.querySelector('.lxnav')){const n=document.createElement('nav');n.className='lxnav';n.innerHTML=C.map(x=>'<a href="#">'+x+'</a>').join('');t.appendChild(n)}
const h=document.querySelector('#vitrine.in #vtitT');const cur=h?h.textContent.trim().toLowerCase().slice(0,5):'';
document.querySelectorAll('.lxnav a').forEach(a=>a.classList.toggle('on',!!cur&&a.textContent.trim().toLowerCase().startsWith(cur)));
const g=document.getElementById('grid');if(g&&g.querySelector('.ulin')){g.querySelectorAll('.card .info').forEach(i=>{if(!i.querySelector('.ulin'))i.insertAdjacentHTML('afterbegin','<span class="ulin vz"><i></i>x</span>')})}}
