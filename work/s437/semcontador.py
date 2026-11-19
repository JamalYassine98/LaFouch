# Preços sem o cabeçalho "Contador"; "revisado …" vai para a linha Preço automático (dono 19/11 17:00)
exec(open('/home/claude/lafouch/work/s437/cartao.py').read().split('def SEM')[0])
PREC="()=>__LF.inicioGo('prec')"
MK="()=>{const a=document.querySelector('#v-dash h1');a&&a.setAttribute('data-anc','1')}"
TIRA=r"""()=>{const h=document.querySelector('.cntHd');if(!h)return;const rv=(h.querySelector('small')||{}).textContent||'';h.style.setProperty('display','none','important');
 const r=[...document.querySelectorAll('#ferr .nvL')].find(x=>/Preço automático/.test(x.textContent));if(r){const s=r.querySelector('small');const on=/ligado/.test(s.textContent)&&!/desligado/.test(s.textContent);if(!/revisado/.test(s.textContent))s.textContent=(on?'ligado':'desligado')+' · '+rv+' · em Ajustes'}}"""
MK2="()=>{const a=document.getElementById('ferr');a&&a.setAttribute('data-anc2','1')}"
caso('semcontador_topo','Preços (topo)',[LM,PREC,MK],'[data-anc]',TIRA,'Preços › Ferramentas (aprovado 149fe)',[LM,PREC,MK2],'[data-anc2]','cabeçalho "Contador · revisado agora"','sem o cabeçalho: os números sobem','onde o "revisado" passa a aparecer')
caso('semcontador_ferr','Preços (ferramentas)',[LM,PREC,MK2],'[data-anc2]',TIRA,'Preços (topo, proposta)',[LM,PREC,MK,TIRA],'[data-anc]','"desligado · fica em Ajustes"','"desligado · revisado agora · em Ajustes"','o topo sem o cabeçalho')
