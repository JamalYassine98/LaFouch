# Reservas vai para Dinheiro (caminho A, dono 19/11 16:03) + link "Reservas ›" nos Preços
exec(open('/home/claude/lafouch/work/s437/cartao.py').read().split('def SEM')[0])
MOVE=r"""()=>{const S=__LF.S;(S.grupos||[]).forEach(g=>{if(g.id=='g:gp'){g.itens=g.itens.filter(x=>x!='din');g.frase='Giro e preços'}if(g.id=='g:din'&&!g.itens.includes('din')){const i=g.itens.indexOf('caixa');g.itens.splice(i+1,0,'din');g.frase='Caixa, reservas, despesas e câmbio'}})}"""
DIN="()=>{const b=document.querySelector(\"#mainnav .mn[data-id='g:din']\");b&&b.click()}"
GP="()=>{const b=document.querySelector(\"#v-inicio [data-id='g:gp']\");b&&b.click()}"
CR="()=>{const c=[...document.querySelectorAll('button,a,[data-act]')].find(x=>x.getBoundingClientRect().height&&/^‹?\\s*GIRO E PREÇOS/i.test(x.textContent.trim()));c&&c.click()}"
MKP="()=>{const a=[...document.querySelectorAll('button,a,[data-act]')].find(x=>/E se/.test(x.textContent));a&&a.setAttribute('data-anc','1')}"
INI="()=>__LF.setView('inicio')"
PREC="()=>__LF.inicioGo('prec')"
LINK=r"""()=>{if(document.getElementById('lkRes'))return;const a=[...document.querySelectorAll('button,a,[data-act]')].find(x=>/E se/.test(x.textContent));if(!a)return;const b=a.cloneNode(true);b.id='lkRes';b.removeAttribute('data-act');b.textContent='Reservas';a.parentNode.insertBefore(b,a.nextSibling)}"""
def J(*xs): return "()=>{"+";".join("("+x+")()" for x in xs)+"}"
W=lambda x:"()=>new Promise(r=>{("+x+")();setTimeout(r,700)})"
RT='Caixa › "Reservas ›" (v562)';RP=C['caixa-movimentos'][:1];RA='[data-act=cxReservas]'
CS=[('res_dinheiro','Dinheiro',[DIN],'#v-grp','Dinheiro: Caixa, Despesas, Câmbio','Reservas logo depois do Caixa',[MOVE,INI,DIN]),
    ('res_giro','Giro e preços',[GP,CR],'#v-grp','Giro, Preços e Reservas','só Giro e Preços',[MOVE,INI,GP,CR]),
    ('res_inicio','Início (lista)',[],'#v-inicio .tgrid','"Giro · Preços · Reservas"','"Giro · Preços"',[MOVE,INI]),
    ('res_precos','Preços',[PREC,MKP],'[data-anc]','sem caminho para Reservas','"Reservas ›" junto dos outros links',[LINK])]
so=os.environ.get('SO')
for nome,tela,ps,anc,h,p,js in CS:
  if so and so not in nome: continue
  prop="()=>new Promise(async r=>{"+"".join("await (async()=>{("+x+")();await new Promise(q=>setTimeout(q,800))})();" for x in js)+"r()})"
  caso(nome,tela,[LM]+ps,anc,prop,RT,RP,RA,h,p,'o link que já existe no Caixa')
