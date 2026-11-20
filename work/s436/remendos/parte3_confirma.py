# S436 (20/11/2026) — remendos PARTE 3: cada confirmação no arquivo da sua família (pergunta + fazer num lugar só).
# Sai do 98z-s418: as 15 ações, a guarda A0 e o truque do window.confirm. Sai dos arquivos de família: a pergunta antiga
# ("toque de novo" / caixa do navegador). Uso: python3 parte3_confirma.py <raiz com src/>
import re, sys, os
R = sys.argv[1]; S = os.path.join(R, 'src')
le = lambda f: open(os.path.join(S, f), encoding='utf-8').read()
def grava(f, t): open(os.path.join(S, f), 'w', encoding='utf-8').write(t)
C = le('98z-s418-confirma.js')
def nova(k):  # a ação nova (pergunta) como está no 98z-s418, com 2 espaços a menos
    m = re.search(r"\n    ACT\.%s = function \([^)]*\) \{\n" % k, C); j = C.index("\n    };\n", m.end()) + len("\n    };\n")
    return C[m.start() + 1:j], '\n'.join(l[2:] if l.startswith('  ') else l for l in C[m.start() + 1:j].split('\n'))
def velha(f, k):  # a ação antiga no arquivo da família: (texto inteiro, corpo)
    t = le(f); m = re.search(r"\n  ACT\.%s = function \([^)]*\) \{\n" % k, t)
    if m: j = t.index("\n  };\n", m.end()); return t[m.start() + 1:j + len("\n  };\n")], t[m.end():j + 1], 'acao'
    m = re.search(r"\n    %s: function \([^)]*\) \{\n" % k, t); j = t.index("\n    },\n", m.end()); return t[m.start() + 1:j + len("\n    },\n")], t[m.end():j + 1], 'lista'
def recua(txt, de, para):  # muda o recuo de um bloco
    return ''.join((' ' * para + l[de:] if l.strip() else l) for l in txt.splitlines(True))
def corta(corpo, ini=None, fim=None, tira=()):
    if ini: assert ini in corpo, ini; corpo = corpo[corpo.index(ini) + len(ini):]
    if fim: assert fim in corpo, fim; corpo = corpo[:corpo.index(fim)]
    for x in tira: assert x in corpo, x; corpo = corpo.replace(x, '', 1)
    return corpo
# k: (arquivo, chamada antiga dentro da nova, como tirar o "fazer" da antiga)
P = {
 'pedcanc': ('95-pedidos.js', "A0.pedcanc(id);", dict(tira=["    var p = pedAch(id);\n", "    if (!p) return;\n"])),
 'pedrecus': ('95-pedidos.js', "A0.pedrecus(id);", dict(tira=["    var p = pedAch(id);\n"], troca=("    if (!p || !p.sid) return;\n", "    if (!p.sid) return;\n"))),
 'estorno': ('94-acoes.js', "S.confEst = id;\n          A0.estorno(id);", dict(ini="        return;\n      }\n", tira=["      var s = S.sales.filter(function (x) {\n        return x.id === id;\n      })[0];\n", "      S.confEst = '';\n"])),
 'syncdesl': ('97-sync.js', "S._syncDel = 1;\n          A0.syncdesl();", dict(ini="\n    S._syncDel = 0;\n")),
 'pinoff': ('98-financeiro.js', "S.pinOffConf = true;\n          A0.pinoff();", dict(ini="      return;\n    }\n", tira=["      S.pinOffConf = false;\n"])),
 'nvSair': ('97-nuvem.js', "A0.nvSair();", dict()),
 'bkimp': ('96-ajustes.js', None, None),
 'ataCanc': ('97s-atacado-conta.js', "semConfirm(function () {\n            A0.ataCanc(id);\n          });", 'linha'),
 'ataLoteCanc': ('97s2-atacado-lotes.js', "semConfirm(function () {\n            A0.ataLoteCanc(id);\n          });", dict(ini="voltam para o estoque.')) return;\n")),
 'syncdesc': ('97-sync.js', "S._syncDesc = ap;\n          A0.syncdesc(ap);", dict(ini="\n    S._syncDesc = '';\n")),
 'peddel': ('95-pedidos.js', "S._pedDel = String(id);\n      A0.peddel(id);", dict(ini="\n    S._pedDel = null;\n")),
 'cartclear': ('98-carrinho.js', "A0.cartclear();", dict()),
 'notifLimpa': ('94-acoes.js', "A0.notifLimpa();", dict()),
 'inicioReset': ('94-acoes.js', "A0.inicioReset();", dict()),
 'impdel': ('94-acoes.js', "S._impDel = id;\n      A0.impdel(id);", dict(ini="\n      S._impDel = null;\n")),
}
for k, (f, chama, como) in P.items():
    bruto, n = nova(k)
    if como == 'linha':  # ataCanc: a antiga é uma linha só, com a pergunta do navegador na frente
        t = le(f); m = re.search(r"\n  ACT\.ataCanc = function \(id\) \{ if \(!window\.confirm\([^\n]*?\)\) return; (ataMuda\([^\n]*?\);) \};\n", t); assert m
        vt, vc, forma, como = m.group(0)[1:], '    ' + m.group(1) + '\n', 'acao', {}
    else: vt, vc, forma = velha(f, k)
    if k == 'bkimp': n = n.replace("        S.bkImpConf = false;\n", "", 1); assert 'bkImpConf' not in n
    if chama is not None:
        como = dict(como); tr = como.pop('troca', None)
        faz = corta(vc, **como)
        if tr: assert tr[0] in faz, tr[0]; faz = faz.replace(tr[0], tr[1], 1)
        chama2 = '\n'.join(l[2:] if l.startswith('  ') else l for l in chama.split('\n'))
        assert n.count(chama2) == 1, (k, chama2)
        pos = n.index(chama2); recuoN = len(n[:pos]) - len(n[:pos].rstrip(' '))
        recuoV = min(len(l) - len(l.lstrip(' ')) for l in faz.split('\n') if l.strip())
        n = n.replace(chama2, recua(faz, recuoV, recuoN).strip('\n').lstrip(' '), 1)
    if forma == 'lista':  # a ação nascia na lista inicial (var ACT = { … }): continua lá, com o recuo da lista
        n = recua(n, 2, 4); n = re.sub(r"^    ACT\.%s = function" % k, "    %s: function" % k, n); n = n.rstrip('\n'); assert n.endswith('};'); n = n[:-2] + '},\n'
    t = le(f); assert t.count(vt) == 1, (k, f); grava(f, t.replace(vt, n))
    C = C.replace(bruto, '', 1)
# o que sobra do bloco no 98z-s418: só a função de cópia usada pelo "Desfazer" → vira função com nome, fora do bloco
ini = C.index("  (function () {\n    var A0 = {};"); fim = C.index("  })();\n", ini) + len("  })();\n")
resto = C[ini:fim]
assert 'ACT.' not in re.sub(r"\[.*?\]\.forEach\(function \(k\) \{\n      A0\[k\] = ACT\[k\];\n    \}\);", '', resto, flags=re.S), resto[-600:]
C = C[:ini] + "  function copia(v) {\n    return JSON.parse(JSON.stringify(v == null ? null : v));\n  }\n" + C[fim:]
grava('98z-s418-confirma.js', C)
print('ok: 15 ações juntadas; 98z-s418 ficou com', C.count('\n'), 'linhas')

# sobras da pergunta antiga nas telas (o texto "toque de novo" nunca mais aparece)
def tr(f, a, b, n=1):
    t = le(f); assert t.count(a) == n, (f, a, t.count(a)); grava(f, t.replace(a, b))
tr('97-sync.js', "(S._syncDel ? 'Desligar? Toque de novo' : 'Desligar neste aparelho')", "'Desligar neste aparelho'")
tr('59-seguranca.js', "(S.pinOffConf ? 'Confirmar: tirar o bloqueio do app' : 'Tirar o bloqueio do app')", "'Tirar o bloqueio do app'")
tr('98-botoes-anim.js', "            S._impDel = id;\n            ACT.impdel(id);", "            ACT.impdel(id);")
tr('40-formatos-venda.js', "  S.confEst = '';\n", "")
tr('97-sync.js', "(S._syncDesc === x.ap ? 'Confirmar' : 'Desconectar')", "'Desconectar'")
tr('97-nuvem-segura.js', "(S._syncDesc === x.ap ? 'Confirmar' : 'Desconectar')", "'Desconectar'")
resto = [(f, k) for f in os.listdir(S) if f.endswith('.js') for k in ('confEst', '_syncDel', 'pinOffConf', '_syncDesc', '_pedDel', '_impDel', 'bkImpConf', ' A0.', 'semConfirm') if k in le(f)]
print('sobras:', resto or 'nenhuma')
