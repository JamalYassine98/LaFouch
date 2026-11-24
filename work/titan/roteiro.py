# TITAN · roteiro provisório (a parte 3 troca por um explorador que toca em tudo)
def setor(k): return "()=>{__LF.inicioGo('prec');setTimeout(()=>{const b=document.querySelector('[data-act=tiAbre][data-id=%s]');b&&b.click()},500)}"%k
ADD="()=>{const b=document.querySelector('button[aria-label=\"Adicionar\"]');b&&b.click()}"
TELAS=[('Início','inicio',[]),('Preços','inicio',["()=>__LF.inicioGo('prec')"]),('Regras','inicio',[setor('regras')]),('Ofertas','inicio',[setor('ofertas')]),
 ('Pedidos','inicio',["()=>__LF.inicioGo('ped')"]),('Ajustes','ajustes',[]),('Inventário','estoque',[]),('Adicionar','estoque',[ADD]),
 ('Caixa','inicio',["()=>__LF.inicioGo('caixa')"]),('Despesas','inicio',["()=>__LF.inicioGo('desp')"]),('Catálogo','vendas',[]),('Clientes','inicio',["()=>__LF.inicioGo('cli')"]),
 ('Compras','inicio',["()=>__LF.inicioGo('comp')"]),('Marketing','inicio',["()=>__LF.inicioGo('mkt')"]),('Atacado','inicio',["()=>__LF.inicioGo('ata')"])]
