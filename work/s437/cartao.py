# Família SUPERFÍCIE/CARTÃO (S435, 19/11 15:04): tirar os cartões/caixas que sobraram dentro das telas
exec(open('/home/claude/lafouch/work/s437/esb.py').read())
src=open('/home/claude/lafouch/work/verif/estilos.py').read();exec(src[src.index('LM='):src.index('J=r"""')]);C.update(dict(EXTRA))
def SEM(sel,linha=False,frase=None):
  return r"""()=>{document.querySelectorAll(%s).forEach(e=>{if(!e.getBoundingClientRect().height)return;[['background','none'],['border','0'],['box-shadow','none'],['border-radius','0'],['padding-left','0'],['padding-right','0']].forEach(q=>e.style.setProperty(q[0],q[1],'important'));%s%s})}"""%(json.dumps(sel),"e.style.setProperty('border-bottom','1px solid var(--line2)','important');" if linha else '',("e.style.setProperty('color','%s','important');e.querySelectorAll('*').forEach(x=>x.style.setProperty('color','%s','important'));"%(frase,frase)) if frase else '')
import json
RT='Dashboard (o padrão certo)';RP=C['dash-mes'];RA='#v-dash h1,#v-dash .dHd'
CS=[
 ('cartao_inicio','Início','inicio',[],'div.hero',[SEM('#v-inicio .hero, .hero',linha=True),SEM('.guardC',linha=True)],'"Vendido hoje" e Guardião em cartão','em linha fina, sem cartão'),
 ('cartao_precos','Preços','precos',[],'section.card.col',[SEM('#v-prec section.card.col,section.card.col')],'"Preço automático" num cartão','"Preço automático" sem cartão, na linha'),
 ('cartao_pendencias','Pendências','pendencias',[],'section.card',[SEM('#v-notif section.card',linha=True)],'cada pendência num cartão','cada pendência numa linha fina'),
 ('cartao_despesas','Despesas › Imprevistos','despesas-imprevistos',[],'div.g99',["()=>{if(document.getElementById('cG99'))return;const s=document.createElement('style');s.id='cG99';s.textContent='.g99{background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important}.g99 section.card.fxF{background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important;border-bottom:1px solid var(--line2)!important}.g99 .bar{background:var(--line)!important}.g99 .fxH{padding:12px 0!important}';document.head.appendChild(s)}"],'"Imprevistos" numa caixa','dobra sem caixa, igual ao Giro (135d)'),
 ('cartao_reservas','Reservas › 30 dias','reservas-30dias',[],'div.note.n-warn',[SEM('.note.n-warn',frase='var(--warn, #e0b44c)')],'aviso amarelo numa caixa','aviso em frase amarela, sem caixa'),
 ('cartao_marketing','Marketing','marketing',[],'div.mkDtG',[SEM('.mkDtG'),"()=>{document.querySelectorAll('.mkDtG > *').forEach(e=>{e.querySelectorAll(':scope > summary, :scope > button, :scope > .fxH').forEach(h=>{h.style.setProperty('padding-left','0','important');h.style.setProperty('padding-right','0','important')});if(e.getBoundingClientRect().left>document.querySelector('.mkDtG').getBoundingClientRect().left+1){}})}"],'dobras numa caixa','dobras sem caixa, igual ao Giro'),
 ('cartao_post','Marketing › Post','marketing-post',[],'div.mkWhy',[SEM('.mkWhy')],'"Por que estas peças" numa caixa','como texto, sem caixa (142p)'),
 ('cartao_peca','Catálogo › Peça','catalogo-peca',[],'#vDetail',[SEM('#vDetail'),SEM('#vDetail .pl.pick',linha=True),SEM('#vDetail .vbar.vsale')],'a peça dentro de um cartão','sem cartão (−/+ e grau ficam com a S436)'),
 ('cartao_compras','Giro › Lista de compras','giro-lista-compras',[],'div.lcTot',[SEM('.lcTot',linha=True)],'total numa caixa','total em linha fina'),
 ('cartao_adicionar','Inventário › Adicionar','inventario-novo',[],'div.adLista',[SEM('.adLista'),SEM('.adLista .adRow',linha=True)],'as opções numa caixa','linhas finas com ›, sem caixa (142q)'),
]
def MK(sel,rx):
  return "()=>{const e=[...document.querySelectorAll(%s)].filter(x=>x.getBoundingClientRect().height&&new RegExp(%s).test(x.innerText)).pop();e&&e.setAttribute('data-anc','1')}"%(json.dumps(sel),json.dumps(rx))
AN={'cartao_precos':MK('section.card.col','automático'),'cartao_pendencias':MK('section.card','Margem da loja subiu'),'cartao_despesas':MK('div.g99','Imprevistos')}
so=os.environ.get('SO')
for nome,tela,k,extra,anc,js,h,p in CS:
  if so and so not in nome: continue
  if nome in AN: extra=extra+[AN[nome]];anc='[data-anc]'
  J="()=>{"+";".join("("+x+")()" for x in js)+"}"
  caso(nome,tela,[LM]+C[k]+extra,anc,J,RT,RP,RA,h,p,'sem cartão: linhas finas direto na tela')
