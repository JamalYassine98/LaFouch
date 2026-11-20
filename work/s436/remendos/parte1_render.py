# S436 (20/11/2026) — ENSAIO da parte 1 do plano dos remendos: o "render" sem embrulho.
# NÃO mexe no projeto: recebe a pasta de uma CÓPIA (src/ dentro dela) e troca lá.
#   python3 parte1_render.py /tmp/lfc
# O que faz (regra 12): (b) o render ganha a lista dos passos que rodam antes e depois dele, num lugar só (99-render-persistencia.js);
# (d) cada um dos 16 embrulhos "var _x = render; render = function () { … _x.apply … }" SAI e vira uma linha "aposRender(passo)".
import re, sys, os
R = sys.argv[1]; S = os.path.join(R, 'src'); feitos = []
def le(f): return open(os.path.join(S, f), encoding='utf-8').read()
def grava(f, t): open(os.path.join(S, f), 'w', encoding='utf-8').write(t)

# 1) o render com as duas listas (antes / depois), no arquivo dele
f = '99-render-persistencia.js'; t = le(f)
a = "  var RENDER_TICK = 0;\n  function render() {\n    RENDER_TICK++;\n"
assert a in t
t = t.replace(a, """  var RENDER_TICK = 0;
  // Passos que cada família pendura no render (num lugar só, na ordem em que os arquivos entram): antesRender(f) e aposRender(f).
  // Um passo com erro não impede os outros nem o desenho da tela.
  function antesRender(f) {
    (render.antes = render.antes || []).push(f);
  }
  function aposRender(f) {
    (render.depois = render.depois || []).push(f);
  }
  function renderPassos(l) {
    (l || []).forEach(function (f) {
      try {
        f();
      } catch (e) {}
    });
  }
  function render() {
    renderPassos(render.antes);
    renderBase();
    renderPassos(render.depois);
  }
  function renderBase() {
    RENDER_TICK++;
""", 1)
grava(f, t)

TUDO = '\n'.join(le(x) for x in os.listdir(S) if x.endswith('.js'))
# 2) os embrulhos simples: var G = render; render = function () { var r = G.apply(this, arguments); CORPO return r; };
PAD = re.compile(r"(?P<i>[ \t]*)var (?P<g>[\w$]+) = render;\n(?P=i)render = function \(\) \{\n(?P=i)  var (?P<r>\w+) = (?P=g)\.apply\(this, arguments\);\n(?P<corpo>(?:.*\n)*?)(?P=i)  return (?P=r);\n(?P=i)\};\n")
for f in sorted(x for x in os.listdir(S) if x.endswith('.js')):
    t = le(f); n = 0
    def troca(m):
        global n
        i, corpo = m.group('i'), m.group('corpo')
        um = re.fullmatch(r"\s*try \{ ([\w$]+)\(\); \} catch \(e\) \{\}\n", corpo) or re.fullmatch(r"\s*([\w$]+)\(\);\n", corpo)
        feitos.append((f, m.group('g')))
        # passo dado pelo nome só quando o nome nunca é trocado depois (senão ficaria com a versão velha): grpTitulo é trocado no 99c
        if um and not re.search(r'^\s*' + re.escape(um.group(1)) + r' = function', TUDO, re.M): return "%saposRender(%s);\n" % (i, um.group(1))
        if um: return "%saposRender(function () {\n%s  %s();\n%s});\n" % (i, i, um.group(1), i)
        return "%saposRender(function () {\n%s%s});\n" % (i, corpo, i)
    t2 = PAD.sub(troca, t)
    if t2 != t: grava(f, t2)

# 3) o voltar da janela (99b): tinha parte ANTES e parte DEPOIS do render — vira um passo de cada
f = '99b-voltar-janela.js'; t = le(f)
a = t[t.index("    var _r = render;\n"):t.index("      aberto0 = agora;\n      return r;\n    };\n") + len("      aberto0 = agora;\n      return r;\n    };\n")]
novo = a.replace("    var _r = render;\n    render = function () {\n", "    var antes;\n    antesRender(function () {\n") \
        .replace("      var antes = aberto0;\n", "      antes = aberto0;\n") \
        .replace("      var r = _r.apply(this, arguments);\n", "    });\n    aposRender(function () {\n") \
        .replace("      aberto0 = agora;\n      return r;\n    };\n", "      aberto0 = agora;\n    });\n")
assert novo != a and '_r' not in re.findall(r'\b_r\b', novo)
grava(f, t.replace(a, novo)); feitos.append((f, '_r'))
print(len(feitos), 'embrulhos do render trocados:', ', '.join('%s (%s)' % x for x in feitos))
resto = [f for f in os.listdir(S) if f.endswith('.js') and re.search(r'^\s*render = function', le(f), re.M)]
print('sobrou "render = function" em:', resto or 'nenhum arquivo')
