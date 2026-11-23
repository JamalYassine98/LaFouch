"""IDEIAS 09f: a proposta única "Pílula La Fouch" sobre o pacote aprovado (/tmp/a8k) → /tmp/a9f (:8755)."""
import shutil
D = '/tmp/a9f'; shutil.rmtree(D, ignore_errors=True); shutil.copytree('/tmp/a8k', D)
p = D + '/js/lf-site.js'; s = open(p).read()
s += "\nwindow.__b9v='f';\n" + open('/home/claude/lafouch/work/ideias/09-botoes/pinta11.js').read()
open(p, 'w').write(s); print('ok')
