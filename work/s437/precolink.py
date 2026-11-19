# Preços: "Reservas ›" sai; entra "Preço automático ›" (leva a Ajustes › Preços aberto) — dono 19/11 16:32
exec(open('/home/claude/lafouch/work/s437/cartao.py').read().split('def SEM')[0])
PREC="()=>__LF.inicioGo('prec')"
MKL="()=>{const a=[...document.querySelectorAll('button,a,[data-act]')].find(x=>/E se/.test(x.textContent));a&&a.setAttribute('data-anc','1')}"
TROCA=r"""()=>{const r=document.getElementById('lkRes');if(r)r.style.setProperty('display','none','important');if(document.getElementById('paRow'))return;const m=[...document.querySelectorAll('#dtabBody .cntL')].find(x=>/Pré-graduados/.test(x.textContent));if(!m)return;const n=m.cloneNode(true);n.id='paRow';n.querySelector('b').textContent='Preço automático';n.querySelector('small').textContent=(/desligado/.test(window.__paH||'desligado')?'desligado':'ligado')+' · fica em Ajustes';const bt=n.querySelector('button');bt.textContent='Ajustes';bt.removeAttribute('data-act');const lk=(r||m).parentElement;const after=r?r.parentElement:m;after.parentNode.insertBefore(n,after.nextSibling)}"""
AJV="()=>__LF.setView('ajustes')"
caso('precolink','Preços',[LM,PREC,MKL],'[data-anc]',TROCA,'Ajustes › Preços (aprovado 149p)',[LM,AJV],'#ajPreco','"Reservas ›" junto dos links','linha "Preço automático · Ajustes ›" no lugar de Reservas','aonde o link leva')
