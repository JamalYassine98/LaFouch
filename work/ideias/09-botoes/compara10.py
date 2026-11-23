"""Comparador (regra 11) para IDEIAS 09: pacote aprovado (:8762) × família P1 suave (:8761). Telas: CMP_TELAS. Uso: python3 compara8b.py http://localhost:8746 d"""
import os, sys
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, '/home/claude/lafouch/work/s430/comparador')
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
import compara as C
C.APAR = [a for a in C.APAR if a[0] in (os.environ.get('CMP_APAR') or 'celular,PC').split(',')]
U = sys.argv[:]
sys.argv = ['compara.py', 'http://localhost:8762', U[1] if len(U)>1 and U[1].startswith('http') else 'http://localhost:8743', os.path.join(AQUI, 'comp-' + (U[2] if len(U)>2 else 'a'))]
C.main()
