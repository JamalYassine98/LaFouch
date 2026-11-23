"""IDEIAS 10: Proposta com a COR OFICIAL da marca (CMYK C47 M91 Y29 K8 ≈ #943d6f na tela) + família 09 com acetinado → /tmp/a9o (:8763).
Base: /tmp/a8k com a loja aberta (igual ao copia4)."""
import shutil
A = "CFG=Object.assign({ativo:true},fbd(d),{_f:1})"
D = '/tmp/a9o'; shutil.rmtree(D, ignore_errors=True); shutil.copytree('/tmp/a8k', D)
p = D + '/js/lf-site.js'; s = open(p).read(); s = s.replace(A, "CFG=Object.assign({ativo:true},fbd(d),{_f:1,ativo:true})")
s += "\nwindow.__lfcor='#943d6f';\n" + open('/home/claude/lafouch/work/ideias/09-botoes/pinta12.js').read()
open(p, 'w').write(s); print('ok')
