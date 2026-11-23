"""IDEIAS 09e: três propostas de identidade sobre o pacote aprovado (/tmp/a8k) + pinta11 com window.__b9v.
a (:8752) vinho liso · b (:8753) degradê só no dinheiro · c (:8754) degradê em todo principal."""
import shutil
for v in 'abc':
    D = '/tmp/a9' + v; shutil.rmtree(D, ignore_errors=True); shutil.copytree('/tmp/a8k', D)
    p = D + '/js/lf-site.js'; s = open(p).read()
    s += "\nwindow.__b9v='%s';\n" % v + open('/home/claude/lafouch/work/ideias/09-botoes/pinta11.js').read()
    open(p, 'w').write(s)
print('ok')
