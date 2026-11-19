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
P=open('/home/claude/lafouch/work/s430/pend.html').read()
page='''<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>App LaFouch · o que muda com "implementar tudo"</title>
<style>:root{color-scheme:light dark}body{margin:0;font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0f1216;color:#e7edf5}main{max-width:1120px;margin:0 auto;padding:24px 16px 64px}
h1{font-family:Georgia,serif;font-weight:400;font-size:30px;margin:0 0 8px}h2{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#8b9bb0;margin:40px 0 12px;border-top:1px solid #2a3441;padding-top:24px}
p{color:#b7c2d0;margin:0 0 12px}.nota{border-left:2px solid #f3c0dc;padding:4px 0 4px 12px}figure{margin:0 0 28px}figcaption{font-weight:600;margin:0 0 8px}img{width:100%%;height:auto;border-radius:10px;display:block;background:#1b2028}
details{border-top:1px solid #2a3441;padding:12px 0}summary{cursor:pointer;font-weight:600}ul{padding-left:18px;color:#b7c2d0}li{margin:4px 0}</style></head><body><main>
<h1>O que você veria com “implementar tudo”</h1>
<p>Cada imagem: à esquerda o app de hoje (versão 5.44.0), à direita o app com <b>todos os %d itens aprovados</b> e ainda não implementados. Só aparecem as telas que mudam (%d telas, tema escuro). Gerado em 18/11/2026 no simulador com as letras do Android; não testado no celular real.</p>
<p class="nota">Não entra aqui o que ainda espera sua decisão (lista no fim). Se aprovar mais algum, este relatório é refeito.</p>
%s
<h2>Os %d aprovados que estão nas imagens</h2><ul>%s</ul>
<h2>Esperando sua decisão (não estão nas imagens)</h2>%s
</main></body></html>'''%(len(base_app.ITENS),n,''.join(sec),len(base_app.ITENS),itens,P)
open(OUT+'index.html','w').write(page);print(n,len(page))
