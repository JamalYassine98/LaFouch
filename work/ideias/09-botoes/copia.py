"""IDEIAS 09 parte 2: copia o pacote aprovado (/tmp/a8k :8750 = 08g + busca 08l + conta/carrinho 08m + camadas 08k)
e acrescenta a família de botões v3 (pinta11.js) → /tmp/a9b (:8751)."""
import shutil
SRC, DST = '/tmp/a8k', '/tmp/a9b'
shutil.rmtree(DST, ignore_errors=True); shutil.copytree(SRC, DST)
p = DST + '/js/lf-site.js'; s = open(p).read()
s += '\n' + open('/home/claude/lafouch/work/ideias/09-botoes/pinta11.js').read()
open(p, 'w').write(s); print('ok')
