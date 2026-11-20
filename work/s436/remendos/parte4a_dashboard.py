# S436 (20/11/2026) — remendos PARTE 4a (família Resultados, por dentro): Dashboard, dia e Histórico com UMA função cada.
# Uso: python3 parte4a_dashboard.py <raiz com src/>
import re, sys, os
R = sys.argv[1]; S = os.path.join(R, 'src')
le = lambda f: open(os.path.join(S, f), encoding='utf-8').read()
def grava(f, t): open(os.path.join(S, f), 'w', encoding='utf-8').write(t)
def tr(f, a, b, n=1):
    t = le(f); assert t.count(a) == n, (f, a[:70], t.count(a)); grava(f, t.replace(a, b))
def tira(f, ini, fim):
    t = le(f); assert t.count(ini) == 1, (f, ini, t.count(ini)); i = t.index(ini); j = t.index(fim, i) + len(fim); grava(f, t[:i] + t[j:]); return t[i:j]
# ---- renderDash: o desenho vira dashDesenha; renderDash é a tela inteira (preparo + desenho + acabamentos), num lugar só
tira('98z-dashboard-s48.js', "  var _rd48 = renderDash;\n", "    return r;\n  };\n")
tira('98z-s374d-padrao.js', "  var _renderDash99 = renderDash;\n", "    return r;\n  };\n")
tr('90-navegacao-dashboard.js', "  function renderDash() {\n", """  // A tela do Dashboard inteira: preparo, desenho (dashDesenha) e acabamentos — nenhum arquivo embrulha esta função.
  function renderDash() {
    if (S.view === 'dash' && S.dTab === 'hoje' && S.per === 'hoje') S.per = 'mes'; // "Hoje" mora na tela do dia
    // a aba Hoje mostra o "Resultado do mês" (S._resMes), que é calculado no desenho da aba Reservas: ela é desenhada antes, com os dados de agora
    if (S.view === 'dash' && S.dTab === 'hoje') {
      try {
        S.dTab = 'din';
        dashDesenha();
      } catch (e) {}
      S.dTab = 'hoje';
    }
    dashDesenha();
    try {
      d48Mes();
    } catch (e) {}
    padTela();
  }
  function dashDesenha() {
""")
# ---- renderDay: idem (diaDesenha + os dois acabamentos)
tira('97y-familias-s265.js', "  var _rdFam = renderDay;\n", "    return r;\n  };\n")
tira('98z-dashboard-s48.js', "  var _rdy48 = renderDay;\n", "    return r;\n  };\n")
tr('93-historico.js', "  function renderDay() {\n", """  // A tela do dia inteira: desenho (diaDesenha) e acabamentos (blocos da família e cabeçalho de "Hoje") — nenhum arquivo embrulha esta função.
  function renderDay() {
    diaDesenha();
    try {
      famDashboard();
    } catch (e) {}
    try {
      d48Dia();
    } catch (e) {}
  }
  function diaDesenha() {
""")
# ---- Histórico: a lista se redesenha e passa o padrão; abrir os filtros anima a caixa
tira('98z-s374d-padrao.js', "  var _histLista99 = histLista;\n", "    return r;\n  };\n")
tr('97-hist-busca.js', "    if (b) b.innerHTML = hListaHtml();\n  }\n", "    if (b) b.innerHTML = hListaHtml();\n    padTela();\n  }\n")
tira('98z-pc-s244.js', "  var _hfo17 = ACT.hfopen;\n", "    return r;\n  };\n")
tr('97-hist-busca.js', "  ACT.hfopen = function () {\n    S.hFopen = !S.hFopen;\n    histRender();\n  };\n", """  ACT.hfopen = function () {
    S.hFopen = !S.hFopen;
    histRender();
    if (S.hFopen) {
      var b = document.querySelector('#v-hist [data-act="hlimpar"]'),
        s = b && b.closest('section');
      if (s) animEnter(s);
    }
  };
""")
# ---- dashCompose: a aba "Site" do Dashboard entra na própria função; a frase dela vai para a tabela
tira('97u-navegacao-s184.js', "  var _dcNav = dashCompose;\n", "    return _dcNav.apply(this, arguments);\n  };\n")
tr('89-dash-abas.js', "  function dashCompose(o) {\n", "  function dashCompose(o) {\n    if (S.dTab === 'onl') return onlResumoHtml(); // aba Site: o resumo vem da família Site\n")
tr('98-dash-cabecalho.js', "prec: 'Margem e preço por tipo' };", "prec: 'Margem e preço por tipo', onl: 'Como o site está indo' };")
# ---- atencaoItens: os avisos do tema e do Guardião entram pelo nome, no fim da função
b1 = tira('97r-temas-s183.js', "  var _atTema = atencaoItens;\n", "    return it;\n  };\n")
m = re.search(r"    try \{ (var t = temaAtual\(\);.*?) \} catch \(e\) \{\}\n", b1, re.S); assert m
tr('97r-temas-s183.js', "  // avisa no sino também\n", "  // avisa no sino também (chamado por atencaoItens)\n  function atencaoTema(it) {\n    " + m.group(1) + "\n  }\n")
b2 = tira('97w-guardiao.js', "  var _atGuard = atencaoItens;\n", "    return it;\n  };\n")
m = re.search(r"    try \{\n(.*?)    \} catch \(e\) \{\}\n", b2, re.S); assert m
t = le('97w-guardiao.js'); grava('97w-guardiao.js', t.rstrip('\n') + "\n  // chamado por atencaoItens (Pendências)\n  function atencaoGuardiao(it) {\n" + '\n'.join(l[2:] if l.startswith('  ') else l for l in m.group(1).split('\n')) + "  }\n")
t = le('89-dash-abas.js'); i = t.index("  function atencaoItens() {\n"); j = t.index("\n    return it;\n  }\n", i)
grava('89-dash-abas.js', t[:j] + "\n    // avisos das outras famílias: a temática que vem aí e tudo o que o Guardião achou\n    try {\n      atencaoTema(it);\n    } catch (e) {}\n    try {\n      atencaoGuardiao(it);\n    } catch (e) {}" + t[j:])
# ---- dVer e dVerEsc: uma ação cada, no arquivo do cabeçalho do Dashboard
tira('98z-s374.js', "  var _dVer59 = ACT.dVer;\n", "    return _dVer59.apply(this, arguments);\n  };\n")
tira('98z-s374.js', "  var _dVerEsc374 = ACT.dVerEsc;\n", "    return _dVerEsc374.apply(this, arguments);\n  };\n")
b41 = tira('98z-grupo-flecha-s41.js', "  var _dVer41 = ACT.dVer;\n", "\n  };\n")
m = re.search(r"    _dVer41\.apply\(this, arguments\);\n    var g = grpGet\(S\._gAt\),\n      o = \$\('dFolha'\),\n(.*)$", b41, re.S); assert m; resto41 = m.group(1).rstrip('\n').rstrip(';').rstrip('}').rstrip()
n48 = tira('98z-dashboard-s48.js', "  ACT.dVer = function () {\n", "\n  };\n"); e48 = tira('98z-dashboard-s48.js', "  ACT.dVerEsc = function (id) {\n", "\n  };\n")
corpo48 = n48[len("  ACT.dVer = function () {\n"):-len("  };\n")]
t = le('98-dash-cabecalho.js'); i = t.index("  ACT.dVer = function () {\n"); j = t.index("\n  };\n", i) + 6
t = t[:i] + """  // A folha "VER" do título do Dashboard (uma ação só): família → as telas dela; senão as abas do Dashboard + Histórico
  // e, num grupo comum, as outras telas do grupo e "Gerenciar grupo".
  ACT.dVer = function () {
    var g = grpGet(S._gAt);
    if (g && g.fam) return lfaAbre('dFolha', grpVerHtml(g));
""" + corpo48 + """    var o = $('dFolha'),
""" + resto41 + "\n  };\n" + t[j:]
i = t.index("  ACT.dVerEsc = function (id) {\n"); j = t.index("\n  };\n", i) + 6
t = t[:i] + e48.replace("    lfaFecha('dFolha');\n", "    if (window.__barraSegurou && window.__barraSegurou()) return; // soltar um arraste da barra em cima da folha não escolhe\n    lfaFecha('dFolha');\n", 1) + t[j:]
grava('98-dash-cabecalho.js', t)
for f, l in [('97w-guardiao.js', '  // o que o Guardião achou entra nas Pendências (e no sino)\n'), ('98z-dashboard-s48.js', '  // ---------- as duas folhas (Ver e Período) valem nas duas telas ----------\n'), ('98z-grupo-flecha-s41.js', '  // no Dashboard o título já tem a flecha: as outras telas do grupo entram na mesma folha\n'), ('98z-s374.js', '  // bug do dono (16/11 10:05): soltar um arraste na folha do Dashboard não pode abrir a tela\n'), ('98z-s374.js', '  // no Dashboard, a flecha de uma família (Resultados, Giro e preços) mostra as telas da família\n'), ('98z-s374d-padrao.js', '  // Histórico: a lista se redesenha sozinha (abrir/fechar semana, buscar) — reagrupa depois\n')]:
    tr(f, l, '')
sobra = [f for f in os.listdir(S) if f.endswith('.js') and re.search(r'^\s*(renderDash|renderDay|histLista|dashCompose|atencaoItens|ACT\.hfopen|ACT\.dVer|ACT\.dVerEsc) = function', le(f), re.M) and f not in ('98-dash-cabecalho.js', '97-hist-busca.js')]
print('ok; sobra troca em:', sobra or 'nenhum arquivo')
