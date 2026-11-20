# S436 (20/11/2026) — remendos PARTE 2c: setView sem embrulho e tabelas de nomes sem chave repetida (fica o valor que vale hoje).
import re, sys, os
R = sys.argv[1]; S = os.path.join(R, 'src')
le = lambda f: open(os.path.join(S, f), encoding='utf-8').read()
def tr(f, a, b, n=1):
    t = le(f); assert t.count(a) == n, (f, a[:60], t.count(a)); open(os.path.join(S, f), 'w', encoding='utf-8').write(t.replace(a, b))
# setView: as duas linhas do embrulho entram no começo da função
tr('98z-s374.js', "  var _setView74 = setView;\n  setView = function () {\n    segH = 0;\n    document.body.style.minHeight = '';\n    return _setView74.apply(this, arguments);\n  };\n", "")
tr('90-navegacao-dashboard.js', "  function setView(v) {\n", "  function setView(v) {\n    // trocar de tela solta a altura que a tela anterior estava segurando (dobras que fecham: src/98z-s374.js, lfSegura)\n    segH = 0;\n    document.body.style.minHeight = '';\n")
# tabelas: o valor que vale vai para a primeira definição; as repetições saem
tr('98-dash-cabecalho.js', "hoje: 'Quanto vendeu e quanto separar'", "hoje: 'Vendido, lucro livre e meta'")
tr('98z-dashboard-s48.js', "  DT_FRASE.hoje = 'Vendido, lucro livre e meta';\n", "")
tr('89-inicio.js', "vendas: 'Catálogo', estoque: 'Inventário'", "vendas: 'Vender', estoque: 'Inventário'")
tr('98z-s374.js', "  BARRA_NOME.vendas = 'Vender';\n", "")
tr('98z-s374d-padrao.js', "  BARRA_NOME.mkt = BARRA_NOME.mkt || 'Marketing';\n", "")
for k, velho, novo in (('caixa', 'O dinheiro da loja', 'O dinheiro da loja, por moeda'), ('fx', 'Cotação do dia e trocas de moeda', 'Cotações e trocas'), ('desp', 'Contas do mês e quanto cada venda separa', 'Contas do mês e imprevistos'),
                       ('ped', 'Pedidos que chegaram pelo site', 'O que chegou pelo site'), ('lotes', 'Compras e fornecedores', 'Compras e lotes'), ('anl', 'Visitas do site', 'Visitas do site e o que trouxe cliente'), ('ata', 'Orçamentos', 'Lojistas, lotes e tabela')):
    tr('98z-grupo-flecha-s41.js', "%s: '%s'" % (k, velho), "%s: '%s'" % (k, novo))
for l in ("  GRP_FRASE.lotes = 'Compras e lotes';\n", "  GRP_FRASE.caixa = 'O dinheiro da loja, por moeda';\n", "  GRP_FRASE.desp = 'Contas do mês e imprevistos';\n", "  GRP_FRASE.fx = 'Cotações e trocas';\n", "  GRP_FRASE.ped = 'O que chegou pelo site';\n", "  GRP_FRASE.anl = 'Visitas e avisos do site';\n"):
    tr('98z-s374.js', l, "")
tr('98z-s374.js', "  GRP_FRASE.ata = 'Lojistas, lotes e tabela';\n", "", 2)
tr('98z-s374c-site.js', "  GRP_FRASE.anl = 'Visitas do site e o que trouxe cliente';\n", "")
tr('89-inicio.js', "caixa: 'Dinheiro'", "caixa: 'Caixa'")
tr('99c-navegacao-s435.js', "    // 147-6: um nome só por tela — o do título\n    BARRA_NOME.caixa = 'Caixa';\n", "")
print('ok')
