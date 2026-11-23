"""IDEIAS 09q: Hoje (/tmp/a9h :8762) e Proposta (/tmp/a9q :8761 = + pinta12.js) a partir do pacote aprovado /tmp/a8k.
Nas duas cópias, a loja fica aberta no esboço: o config real veio com ativo:false (manutenção) em 23/11 manhã."""
import shutil
A = "CFG=Object.assign({ativo:true},fbd(d),{_f:1})"
for D, pinta in (('/tmp/a9h', False), ('/tmp/a9q', True)):
    shutil.rmtree(D, ignore_errors=True); shutil.copytree('/tmp/a8k', D)
    p = D + '/js/lf-site.js'; s = open(p).read(); assert s.count(A) == 1
    s = s.replace(A, "CFG=Object.assign({ativo:true},fbd(d),{_f:1,ativo:true})")
    if pinta: s += '\n' + open('/home/claude/lafouch/work/ideias/09-botoes/pinta12.js').read()
    open(p, 'w').write(s)
print('ok')
