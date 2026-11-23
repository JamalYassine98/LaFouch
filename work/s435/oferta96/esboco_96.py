# Esboço 96 (S435, 23/11 08:45) — A OFERTA VALE NA LOJA E NO SITE; UM DESCONTO POR PEÇA (dono 08:36–08:39). Hoje a oferta mora em
# S.pprice (preço do site) e o Carrinho não lê: no balcão a peça sai pelo preço normal. Proposta: o Carrinho usa o preço da oferta
# (com o 'de' honesto do 94); peça em oferta NÃO mostra as opções de desconto (dono 08:39); venda misturada: as opções valem só nas
# peças sem oferta. Base: 78 aprovado (sem 'costumam fechar', dono 21/11 23:31) + 94 aprovado + aprovados.py.
# v3 (dono 09:01: 'cliente' repetia 3 vezes) → o cliente aparece UMA vez, na linha com o nome; o cupom 'Cliente fiel' aparece como 'Fiel'; o
# Pagamento não pede nem mostra o cliente (96d v2). v2 (dono 08:50: os cupons não têm mais código e só existem com conta) → sai 'Código do cliente'; entra 'Cliente · escolher ›' e, com o
# cliente escolhido, os cupons da conta dele ('Cupons da Ana · 2', cada um com Usar). ILUSTRAÇÃO: SL2201 em oferta G$ 54.000 (de G$ 60.000, praticado ≥ 30 dias com venda) até 30/11.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s435/caixa');sys.path.insert(0,'/home/claude/lafouch/work/s435/varredura')
_s=open('/home/claude/lafouch/work/s435/caixa/esboco_78.py').read();exec(_s.rsplit("\nwith sync_playwright() as pw:",1)[0])
import aprovados as A2
O='/home/claude/lafouch/work/s435/oferta96/'
OF=r"""(o)=>{const sw=(re,t)=>[...document.querySelectorAll('b,span,small,div')].filter(e=>e.children.length==0&&re.test(e.textContent.trim())).forEach(e=>e.textContent=t);
 if(o.todos){sw(/^G\$ 180\.000$/,'G$ 162.000');const sg=document.querySelector('.c54Sg');if(sg)sg.remove()}
 const linha=[...document.querySelectorAll('*')].filter(e=>e.children.length==0&&/^SL2201/.test(e.textContent.trim())).pop();
 if(linha&&!document.getElementById('o96')){const s=document.createElement('small');s.id='o96';s.style.cssText='display:block;margin-top:2px;font-size:13px;color:var(--mute);white-space:nowrap';s.textContent='em oferta · de G$ 60.000 · até 30/11';(linha.closest('.c54Nm')||linha).after(s)}
 const t=document.querySelector('.c54Tt');if(t&&o.total){t.querySelector('b').textContent=o.total;const d=document.createElement('div');d.style.cssText='text-align:center;font-size:13px;color:var(--mute);text-decoration:line-through';d.textContent=o.de;t.after(d)}}"""
MIX={'linhas':[['Cliente','sem cliente, sem cupom','escolher ›',0],['Cartão Próxima compra','10% na volta · só nas peças sem oferta','Cadastrar',0]],'costuma':'','sem_codigo':1}
MIXC={'linhas':[['Ana Benítez','2 cupons · só nas peças sem oferta','trocar ›',0],['Próxima compra · 10%','vale até 15/12','Usar',0],['Fiel · 10%','ganhou na 3ª compra','Usar',0]],'costuma':'','sem_codigo':1}
def tela96(pw,esc,caso):
  b,pg,w=ap.abre(pw,'vendas',esc,'celular',base=True);w(700)
  pg.evaluate("""c=>{const S=window.__LF.S;const it=S.items.filter(i=>i.tipo=='solar'&&i.qty>=3)[0];
   if(c=='mix'||c=='mixc'){const l=S.items.find(i=>i.ref=='SP57765')||S.items.find(i=>i.tipo!='solar');S.cart=[{it:it,qty:1,id:'c1'},{it:l,qty:1,id:'c2'}]}else S.cart=[{it:it,qty:3,id:'c1'}];
   S.cartOpen=true;S.cartStep='ped';window.__LF.render()}""",caso);w(1000)
  if caso=='hoje':pass
  elif caso=='todos':pg.evaluate(OF,{'todos':1,'total':'G$ 162.000','de':'de G$ 180.000'})
  else:
    pg.evaluate(BLOCO,MIXC if caso=='mixc' else MIX);w(300)
    pg.evaluate(r"""()=>{const sw=(re,t)=>[...document.querySelectorAll('b,span,small,div')].filter(e=>e.children.length==0&&re.test(e.textContent.trim())).forEach(e=>e.textContent=t);sw(/^G\$ 60\.000$/,'G$ 54.000')}""")
    tot=pg.evaluate("()=>{const t=document.querySelector('.c54Tt b');return t?t.textContent:''}")
    try:v=int(tot.replace('G$','').replace('.','').strip())-6000;nt='G$ '+format(v,',').replace(',','.')
    except Exception:nt=tot
    pg.evaluate(OF,{'total':nt,'de':'de '+tot})
  w(300);A2.aplica(pg);w(300)
  pg.evaluate("()=>[...document.querySelectorAll('div')].filter(e=>e.children.length==0&&!e.textContent.trim()&&e.style.cssText.includes('margin-top: 4px')).forEach(e=>e.remove())")
  pg.add_style_tag(content='#mainnav{display:none!important}')
  a,_=M.percorre(pg,None);REL.append((caso,[(k[0],v['d'][:60]) for k,v in a.items()]))
  pg.evaluate("()=>{document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0});scrollTo(0,0)}");w(300)
  pg.screenshot(path='/tmp/c96.png',full_page=True);b.close();im=Image.open('/tmp/c96.png').convert('RGB');return im.crop((0,0,im.width,min(im.height,1900)))
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    quadro(O+'esboco_96_oferta_na_loja_v3_%s.jpg'%n,[('HOJE · Carrinho',n+' · a oferta do site não vale aqui',tela96(pw,esc,'hoje')),('PROPOSTA · peça em oferta',n+' · preço da oferta · sem opções de desconto',tela96(pw,esc,'todos')),('PROPOSTA · misturada, sem cliente',n+' · cupom só vem pela conta do cliente',tela96(pw,esc,'mix')),('PROPOSTA · misturada, Ana escolhida',n+' · os cupons da conta dela, só na peça sem oferta',tela96(pw,esc,'mixc'))],esc)
for n,f in REL: print(n,f)
