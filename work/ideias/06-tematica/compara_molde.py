"""Comparador único Hoje × Proposta (regra 11) para IDEIAS 06 (celular; tema que estiver ativo no simulador = Black Friday)."""
import os, sys
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, '/home/claude/lafouch/work/s430/comparador')
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
import compara as C
C.APAR = [a for a in C.APAR if a[0] == 'celular']
sys.argv = ['compara.py', 'http://localhost:8721', 'http://localhost:8728', os.path.join(AQUI, 'comp-molde')]
C.main()
