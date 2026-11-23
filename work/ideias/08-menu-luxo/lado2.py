"""IDEIAS 08k2: o 08k (/tmp/a8k) + pinta13 (Minha conta e Entrar pelo mesmo caminho da camada) → /tmp/a8m (:8764).
Também /tmp/a9h (:8762) = o 08k como foi enviado, para comparar. Nas duas, a loja aberta no esboço (o config real veio com ativo:false)."""
import shutil
A = "CFG=Object.assign({ativo:true},fbd(d),{_f:1})"
D = '/tmp/a8m'; shutil.rmtree(D, ignore_errors=True); shutil.copytree('/tmp/a8k', D)
p = D + '/js/lf-site.js'; s = open(p).read(); s = s.replace(A, "CFG=Object.assign({ativo:true},fbd(d),{_f:1,ativo:true})")
# causa 2 (raiz): o botão da conta não estava na lista dos botões que abrem camada (era escondido no celular antes do 08g):
# sem ele, a camada não sabia de que lado vinha, o ✕ não ia para o botão e tocar nele não fechava. Entra na MESMA lista.
for v, n in (("closest('#mnb,#sbtn,#bagbtn')", "closest('#mnb,#sbtn,#bagbtn,#contabtn')"), ("if(b.id==='bagbtn')history.back()", "if(b.id==='bagbtn'||b.id==='contabtn')history.back()")):
    assert s.count(v) == 1, v; s = s.replace(v, n)
s += '\n' + open('/home/claude/lafouch/work/ideias/08-menu-luxo/pinta13.js').read(); open(p, 'w').write(s); print('ok')
