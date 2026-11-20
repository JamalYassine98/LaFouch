# S436 (20/11/2026) — remendos PARTE 2a: inicioGo e navOn numa função só (src/89-inicio.js), com todos os destinos.
# Saem os 11 embrulhos ("se for a minha tela faço eu; senão chama a velha") de 97y-familias-s265, 98z-s374, 98z-s374c e 98z-s374d.
import re, sys, os
R = sys.argv[1]; S = os.path.join(R, 'src')
le = lambda f: open(os.path.join(S, f), encoding='utf-8').read()
def grava(f, t): open(os.path.join(S, f), 'w', encoding='utf-8').write(t)
# 1) tira os embrulhos (e o comentário de uma linha logo acima, quando fala só dele)
EMB = re.compile(r"(?:  // [^\n]*\n)?  var (_\w+) = (inicioGo|navOn);\n  \2 = function \(id\) \{\n(?:.*\n)*?    return \1\.apply\(this, arguments\);\n  \};\n")
n = 0
for f in ('97y-familias-s265.js', '98z-s374.js', '98z-s374c-site.js', '98z-s374d-padrao.js'):
    t = le(f); t2, k = EMB.subn(lambda m: '' if not m.group(0).startswith('  // ') or re.search(r'atalho|Dashboard|painel|família', m.group(0).split('\n')[0]) else m.group(0).split('\n')[0] + '\n', t); n += k; grava(f, t2)
assert n == 11, n
t = le('98z-s374c-site.js'); a = "  var PNL95 = ['vit', 'prod', 'pre', 'cfg'];\n"; assert t.count(a) == 1 and t.count('PNL95') == 1; grava('98z-s374c-site.js', t.replace(a, ''))
# 2) as duas funções inteiras, no arquivo delas
t = le('89-inicio.js')
i = t.index("  function inicioGo(id) {\n"); j = t.index("\n  }\n", i) + 5
t = t[:i] + """  // Abre uma tela pelo nome (Início, barra de baixo, grupos, busca). TODOS os destinos ficam aqui — nenhum arquivo embrulha esta função.
  function inicioGo(id) {
    if (grpGet(id)) return grpAbre(grpGet(id));
    if (id === 'hoje') {
      // o atalho "Dashboard" abre o dia de hoje; os números do mês ficam a um toque
      S.day = dayKey(Date.now());
      setView('dia');
    } else if (id === 'din' || id === 'giro' || id === 'prec') {
      S.dTab = id;
      setView('dash');
    } else if (id === 'repo') {
      return lcIrGiro();
    } else if (id === 'msg' || id === 'anl' || id === 'tem' || id === 'vit' || id === 'prod' || id === 'pre' || id === 'cfg') {
      return onlPainel(id); // telas do painel do site
    } else if (id === 'mkt') {
      return mkAbre();
    } else if (id === 'cup') {
      return ACT.cupAbre();
    } else if (id === 'est') {
      estAbre();
    } else if (id === 'cli') {
      setView('clientes');
    } else if (id === 'novo') {
      setView('estoque');
      $('btnAdd').click();
    } else if (id === 'cont') {
      setView('estoque');
      $('kCont').click();
    } else if (id === 'lotes') {
      S.lotesView = true;
      setView('estoque');
    } else {
      if (id === 'estoque' && S.view !== 'estoque') S.repoView = false;
      setView(id);
    }
  }
""" + t[j:]
i = t.index("  function navOn(id) {\n"); j = t.index("\n  }\n", i) + 5
t = t[:i] + """  // O botão da barra/menu está aceso? TODAS as telas ficam aqui — nenhum arquivo embrulha esta função.
  function navOn(id) {
    var v = S.view,
      noPnl = v === 'onl',
      gg;
    // painel do site: Vitrine, Modelos, Prévia e Ajustes do site são abas dele; Analisador e Temática contam para o Marketing
    if (id === 'vit' || id === 'prod' || id === 'pre' || id === 'cfg') return noPnl && S.onlAba === id;
    if (noPnl && (S.onlAba === 'anl' || S.onlAba === 'tem')) {
      if (id === 'g:site') return false;
      if (id === 'g:mkt') return true;
    }
    if (noPnl && S.onlAba === 'cfg' && (id === 'g:site' || id === 'g:mkt')) return false;
    if (id === 'g:site' && noPnl && grpGet('g:site')) return true; // painel aberto = família Site
    if (id === 'vendas' && noPnl && grpGet('g:site')) return false;
    if (id === 'repo') return v === 'dash' && S.dTab === 'giro';
    if (id === 'hoje' && v === 'dia') return true;
    gg = grpGet(id);
    if (gg) return gg.itens.some(navOn);
    if (id === 'inicio') return v === 'inicio';
    if (id === 'hoje' || id === 'din' || id === 'giro' || id === 'prec') return v === 'dash' && S.dTab === id;
    if (id === 'cli') return v === 'clientes';
    if (id === 'lotes') return v === 'estoque' && !!S.lotesView;
    if (id === 'vendas') return v === 'vendas' || (noPnl && grpPlana().indexOf('onl') < 0);
    if (id === 'estoque') return v === 'estoque' && !(S.lotesView && grpPlana().indexOf('lotes') >= 0);
    if (id === 'msg' || id === 'anl' || id === 'tem') return noPnl && S.onlAba === id;
    if (id === 'cont' || id === 'novo') return false;
    return v === id;
  }
""" + t[j:]
grava('89-inicio.js', t)
t = le('99-render-persistencia.js'); a = "inicioGo: inicioGo,"; assert t.count(a) == 1; grava('99-render-persistencia.js', t.replace(a, "inicioGo: inicioGo, navOn: navOn,"))
sobra = [f for f in os.listdir(S) if f.endswith('.js') and re.search(r'^\s*(inicioGo|navOn) = function', le(f), re.M)]
print('ok: 11 embrulhos fora; sobra troca de inicioGo/navOn em:', sobra or 'nenhum arquivo')
