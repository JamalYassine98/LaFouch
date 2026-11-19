# Pré-graduados seguem a regra de todos (dono 19/11 17:06): sai a linha "Pré-graduados · preço por linha"
exec(open('/home/claude/lafouch/work/s437/cartao.py').read().split('def SEM')[0])
PREC="()=>__LF.inicioGo('prec')"
MK="()=>{const a=[...document.querySelectorAll('#dtabBody .cntL')].find(x=>/Tabela Vendedor/.test(x.textContent));(a||document.getElementById('ferr')).setAttribute('data-anc','1')}"
TIRA=r"""()=>{const a=[...document.querySelectorAll('#dtabBody .cntL')].find(x=>/Pré-graduados · preço por linha/.test(x.textContent));if(a)a.style.setProperty('display','none','important');const h=document.querySelector('.cntHd');if(h)h.style.setProperty('display','none','important')}"""
caso('sempre_precos','Preços',[LM,PREC,MK],'[data-anc]',TIRA,'Preços › Ferramentas (aprovado 149fe)',[LM,PREC,"()=>document.getElementById('ferr').setAttribute('data-anc2','1')"],'[data-anc2]','linha "Pré-graduados · preço por linha"','sem a linha: pré-graduados seguem a regra de todos','a lista que fica logo abaixo')
