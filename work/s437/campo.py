exec(open('/home/claude/lafouch/work/s437/esb.py').read())
import json
JB=r"""()=>{if(!document.getElementById('cB')){const s=document.createElement('style');s.id='cB';s.textContent='input::placeholder,textarea::placeholder{color:color-mix(in srgb,var(--fg) 55%,transparent)!important}';document.head.appendChild(s)}
 const cor='color-mix(in srgb,var(--fg) 45%,transparent)';
 document.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]),select,textarea').forEach(i=>{if(!i.getBoundingClientRect().height)return;let e=i;for(let k=0;k<4&&e;k++){const c=getComputedStyle(e);if(parseFloat(c.borderBottomWidth)>0&&c.borderBottomStyle!='none'){if(e.querySelectorAll('input,select,textarea').length<=1||e===i){e.style.setProperty('border-bottom-color',cor,'important');e.style.setProperty('border-bottom-width','1.5px','important')}break}e=e.parentElement}})}"""
J=JB
R='Giro › Vitrine (144 B)';RP=C['giro-vitrine'];RA='input'
def caso2(nome,t,anc,h):
  caso(nome,t.split('|')[0],C[t.split('|')[1]],anc,J,R,RP+[JB],RA,h,'linha 45% · exemplo 55%','escolhido pelo dono (opção B)')
caso2('campo_despesa','Nova despesa|despesas-nova','input','campos de hoje')
caso2('campo_cliente','Novo cliente|clientes-novo','input','campos de hoje')
caso2('campo_retirada','Retirada|caixa-retirar','input','campos de hoje')
caso2('campo_pagamento','Pagamento|catalogo-pagamento','input','campos de hoje')
