"""IDEIAS 12c · a vitrine da data: /tmp/a12b (12b: campanha forte, fundo branco, faixas, VER A COLEÇÃO) + pinta12c.js → /tmp/a12c (:8767)."""
import shutil
S, D = '/tmp/a12b', '/tmp/a12c'
shutil.rmtree(D, ignore_errors=True); shutil.copytree(S, D)
p = D + '/js/lf-site.js'; s = open(p).read()
s += '\n' + open('/tmp/rp/lafouch/work/ideias/12-tematica-base/pinta12c.js').read()
open(p, 'w').write(s); print('ok')
