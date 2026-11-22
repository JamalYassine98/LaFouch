"""Comparador único Hoje × Proposta (regra 11) com as telas de sempre MAIS menu, busca e carrinho abertos (celular).
Proposta = cópia com topo B (:8724), que tem tudo da A e mais a troca de lugar dos botões.
Uso: python3 compara_anim.py [porta_proposta] → pasta comp/"""
import os, sys
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, '/home/claude/lafouch/work/s430/comparador')
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
import compara as C
C.TELAS = C.TELAS + [('Menu aberto', '/?cliente=1', '#mnb'), ('Busca aberta', '/?cliente=1', '#sbtn'), ('Carrinho aberto', '/?cliente=1', '#bagbtn')]
C.APAR = [a for a in C.APAR if a[0].startswith('celular')]
porta = sys.argv[1] if len(sys.argv) > 1 else '8724'
sys.argv = ['compara.py', 'http://localhost:8721', 'http://localhost:' + porta, os.path.join(AQUI, 'comp-' + porta)]
C.main()
