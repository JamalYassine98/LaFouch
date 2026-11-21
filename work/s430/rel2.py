import sys,os,glob,html
sys.path.insert(0,'/home/claude/lafouch/work/kit');import base_app
from PIL import Image
OUT='/home/claude/lafouch/work/s430/rel/';os.makedirs(OUT+'img',exist_ok=True)
G=[('Peças · Inventário',['inventario','inventario-ficha','inventario-ficha-historico','inventario-ficha-preco','inventario-fornecedores','inventario-novo','inventario-editar']),
 ('Vender · Catálogo',['catalogo-peca','catalogo-carrinho','catalogo-pagamento']),
 ('Clientes',['clientes','clientes-novo']),
 ('Atacado',['atacado','atacado-lojistas','atacado-lotes','atacado-tabela']),
 ('Dinheiro · Caixa',['caixa','caixa-acoes','caixa-retirar','caixa-novo-objetivo','caixa-conferir','caixa-reservado','caixa-movimentos']),
 ('Dinheiro · Câmbio',['cambio','cambio-dolar','cambio-repo','cambio-troca','cambio-trocas','cambio-site']),
 ('Dinheiro · Despesas',['despesas','despesas-nova','despesas-conta','despesas-imprevistos']),
 ('Dashboard, Reservas, Giro, Preços',['dash-contas-dia','reservas-para-onde','reservas-30dias','giro-lista-compras','giro-vitrine','giro-retorno','giro-abc','giro-no-estoque','giro-parado','precos','precos-corrigir','precos-contas']),
 ('Pendências e Guardião',['pendencias','guardiao']),('Marketing',['marketing-post'])]
NOM={'inventario':'Inventário','inventario-ficha':'Ficha da peça','inventario-ficha-historico':'Ficha › Histórico','inventario-ficha-preco':'Ficha › Preço','inventario-fornecedores':'Fornecedores','inventario-novo':'Adicionar','inventario-editar':'Editar produto','catalogo-peca':'Peça','catalogo-carrinho':'Carrinho','catalogo-pagamento':'Pagamento','clientes':'Clientes','clientes-novo':'Novo cliente','atacado':'Mensagens','atacado-lojistas':'Lojistas','atacado-lotes':'Lotes','atacado-tabela':'Tabela','caixa':'Caixa','caixa-acoes':'Ações do caixa','caixa-retirar':'Retirada do dono','caixa-novo-objetivo':'Novo objetivo','caixa-conferir':'Conferir o caixa','caixa-reservado':'Livre e reservado','caixa-movimentos':'Movimentos','cambio':'Câmbio','cambio-dolar':'Dólar','cambio-repo':'Reposição','cambio-troca':'Registrar troca','cambio-trocas':'Últimas trocas','cambio-site':'Preços no site','despesas':'Despesas','despesas-nova':'Nova despesa','despesas-conta':'Conta aberta','despesas-imprevistos':'Imprevistos','dash-contas-dia':'Contas do dia','reservas-para-onde':'Reservas › Para onde vai','reservas-30dias':'Reservas › 30 dias','giro-lista-compras':'Giro › Lista de compras','giro-vitrine':'Giro › Vitrine','giro-retorno':'Giro › Retorno','giro-abc':'Giro › Curva ABC','giro-no-estoque':'Giro › No estoque','giro-parado':'Giro › Parado','precos':'Preços','precos-corrigir':'Preços › Corrigir','precos-contas':'Preços › Contas','pendencias':'Pendências','guardiao':'Guardião','marketing-post':'Marketing › Post'}
sec=[];n=0
for g,ts in G:
  cards=[]
  for t in ts:
    f='/home/claude/lafouch/work/s430/r/%s-escuro.jpg'%t
    if not os.path.exists(f): continue
    im=Image.open(f);w,h=im.size;c=im.crop((0,int(h*0.12),w,h));c=c.resize((1100,int(c.height*1100/w)));nm='img/%s.jpg'%t;c.save(OUT+nm,quality=78);n+=1
    cards.append('<figure><figcaption>%s</figcaption><img loading="lazy" src="%s" alt="%s: hoje e depois"></figure>'%(html.escape(NOM.get(t,t)),nm,html.escape(NOM.get(t,t))))
  if cards: sec.append('<section><h2>%s</h2>%s</section>'%(html.escape(g),''.join(cards)))
itens=''.join('<li><b>%s</b> %s</li>'%(html.escape(i['id']),html.escape(i['nome'])) for i in base_app.ITENS)
import glob
pend=sorted(glob.glob('/home/claude/lafouch/work/s431/142[a-dfgj-r]-*-escuro.jpg'))+sorted(glob.glob('/home/claude/lafouch/work/s425/137[abghi]-*-escuro.jpg'))+sorted(glob.glob('/home/claude/lafouch/work/s425/138[cdefl]-*-escuro.jpg'))
pc=[]
for f in pend:
  im=Image.open(f);w=im.width;im=im.resize((1100,int(im.height*1100/w)));nm='img/p-'+os.path.basename(f);im.save(OUT+nm,quality=78)
  pc.append('<figure><img loading="lazy" src="%s" alt="%s"></figure>'%(nm,html.escape(os.path.basename(f))))
P=''.join(pc)
page="""<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>App LaFouch · aprovados que entram com “implementar tudo”</title>
<style>body{margin:0;font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0f1216;color:#e7edf5}main{max-width:1120px;margin:0 auto;padding:16px 16px 64px}h1{font-family:Georgia,serif;font-weight:400;font-size:28px;margin:8px 0}h2{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#8b9bb0;margin:36px 0 12px;border-top:1px solid #2a3441;padding-top:24px}p{color:#b7c2d0}figure{margin:0 0 20px}figcaption{font-weight:600;margin:0 0 8px}img{width:100%%;height:auto;border-radius:10px;display:block}
.tabs{position:sticky;top:0;z-index:2;background:#0f1216;display:flex;gap:24px;border-bottom:1px solid #2a3441;padding-top:8px}.tabs a{color:#8b9bb0;text-decoration:none;padding:12px 0;font-weight:600;border-bottom:2px solid transparent}.tabs a.on{color:#e7edf5;border-color:#f3c0dc}.aba{display:none}.aba.on{display:block}</style></head><body><main>
<nav class="tabs"><a href="#implementar" id="t1">Implementar tudo</a><a href="#pendentes" id="t2">Esperando decisão</a></nav>
<div class="aba" id="implementar"><h1>O app depois de “implementar tudo”</h1><p>Cada imagem: à esquerda o app de hoje (5.44.0), à direita a mesma tela com os %d aprovados aplicados <b>todos juntos</b> (%d telas que mudam, tema escuro). Simulador com as letras do Android; não testado no celular real.</p>%s
<h2>Os %d aprovados</h2><ul>%s</ul></div>
<div class="aba" id="pendentes"><h1>Esperando sua decisão</h1><p>Estes não entram no “implementar tudo”. Cada esboço foi feito por cima dos aprovados, no dia em que foi enviado (pode haver detalhe já superado por aprovações depois).</p>%s</div>
<script>function go(){var h=location.hash=='#pendentes'?'pendentes':'implementar';document.getElementById('implementar').className='aba'+(h=='implementar'?' on':'');document.getElementById('pendentes').className='aba'+(h=='pendentes'?' on':'');document.getElementById('t1').className=h=='implementar'?'on':'';document.getElementById('t2').className=h=='pendentes'?'on':'';window.scrollTo(0,0)}addEventListener('hashchange',go);go()</script>
</main></body></html>"""%(len(base_app.ITENS),n,''.join(sec),len(base_app.ITENS),itens,P)
open(OUT+'index.html','w').write(page);print(n,len(page))
