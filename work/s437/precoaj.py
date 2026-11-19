# "Preço automático" sai de Preços e vai para Ajustes (como Site) — dono 19/11 16:23 (print)
exec(open('/home/claude/lafouch/work/s437/cartao.py').read().split('def SEM')[0])
PEGA=r"""()=>{const h=[...document.querySelectorAll('#dtabBody .lbl')].find(x=>/REGRAS DO CONTADOR/i.test(x.textContent));if(!h)return;const sib=[];let e=h.nextElementSibling;while(e){sib.push(e);e=e.nextElementSibling}
 const pa=sib.find(x=>x.classList.contains('paCard'));const ct=sib.find(x=>/Contas, taxas e meta/.test(x.textContent));window.__paH=(pa?pa.outerHTML:'')+(ct?ct.outerHTML:'');window.__paEsc=[h,pa,ct]}"""
TIRA=r"""()=>{(window.__paEsc||[]).forEach(e=>e&&e.style.setProperty('display','none','important'))}"""
AJ=r"""()=>{if(document.getElementById('ajPreco'))return;const seg=document.querySelector('.ajS[data-k=seg]')||[...document.querySelectorAll('.ajS')][2];const site=document.querySelector('.ajS[data-k=site]');if(!seg||!site)return;
 const n=seg.cloneNode(true);n.id='ajPreco';n.dataset.k='preco';const b=n.querySelector('b');b.textContent='Preços';
 const ic=n.querySelector('.ajIc');ic.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>';
 const v=[...n.querySelectorAll('.ajR span')].find(x=>!x.classList.contains('ajIc')&&x.textContent.trim());if(v)v.textContent=/ligado/.test(window.__paH||'')&&!/desligado/.test(window.__paH||'')?'automático ligado':'automático desligado';
 [...n.children].forEach(c=>{if(!c.classList.contains('ajR'))c.remove()});const r=n.querySelector('.ajR');r.setAttribute('aria-expanded','true');
 const body=document.createElement('div');body.className='ajPB';body.style.cssText='padding:8px 0 16px';body.innerHTML=window.__paH||'';n.appendChild(body);
 body.querySelectorAll('*').forEach(x=>{});site.parentNode.insertBefore(n,site.nextSibling);

 const ch=[...r.querySelectorAll('*')].find(x=>/⌄|›/.test(x.textContent)&&!x.children.length);if(ch&&ch.style)ch.style.setProperty('transform','rotate(180deg)')}"""
def J(*xs): return "()=>new Promise(async r=>{"+"".join("await (async()=>{("+x+")();await new Promise(q=>setTimeout(q,700))})();" for x in xs)+"r()})"
PREC="()=>__LF.inicioGo('prec')";AJV="()=>__LF.setView('ajustes')"
MKL="()=>{const a=[...document.querySelectorAll('button,a,[data-act]')].find(x=>/E se/.test(x.textContent));a&&a.setAttribute('data-anc','1')}"
RT='Ajustes › Site (já é assim)';RP=[AJV];RA='.ajS[data-k=site]'
so=os.environ.get('SO')
if not so or 'precos' in so:
  caso('precoaj_precos','Preços',[LM,PREC,MKL],'[data-anc]',J(PEGA,TIRA),RT,RP,RA,'"Preço automático" e "Contas, taxas e meta" aqui','Preços fica só com o que decidir e as ferramentas','configuração mora em Ajustes')
if not so or 'ajustes' in so:
  caso('precoaj_ajustes','Ajustes',[LM,AJV],'.ajS[data-k=site]',J("()=>__LF.inicioGo('prec')",PEGA,AJV,AJ),RT,RP,RA,'sem Preço automático','"Preços" logo depois de Site, abre no lugar (⌄)','configuração mora em Ajustes')
