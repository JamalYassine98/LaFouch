"""Roda o comparador único Hoje × Proposta (work/s430/comparador/compara.py, regra 11) com as telas de sempre
(Início, Catálogo, Peça) MAIS as telas do "Descubra seu formato": página, janela de abrir, resultado e resultado
com "também tem traços de" + Feminino. O resultado é aberto pela porta de teste das cópias (copias.py).
Uso: python3 compara_formato.py → pasta comp/
"""
import os, sys, json
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, '/home/claude/lafouch/work/s430/comparador')
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
import compara as C
from playwright.sync_api._generated import Page

CANON = open(os.path.join(AQUI, 'canon.json')).read()
src = open(os.path.join(AQUI, 'captura.py')).read()
MONTA = src.split('MONTA = r"""')[1].split('"""')[0]
RES = 'JS:(' + MONTA + ')(' + CANON + ')'
TRACOS = 'JS:(' + MONTA.replace("res.gen='';", "res.gen='';res.close=true;") + ')(' + CANON + ');setTimeout(()=>document.querySelector(\'[data-fagen="f"]\').click(),300)'

_ev = Page.evaluate
def ev(self, expr, arg=None):
    if isinstance(arg, str) and arg.startswith('JS:'):
        return _ev(self, '()=>{' + arg[3:] + '}')
    return _ev(self, expr, arg) if arg is not None else _ev(self, expr)
Page.evaluate = ev

C.TELAS = C.TELAS + [('Formato', '/?cliente=1&r=formato', None),
                     ('Formato-abrir', '/?cliente=1&r=formato', '#rosto [data-fa]'),
                     ('Formato-resultado', '/?cliente=1&r=formato', RES),
                     ('Formato-tracos-feminino', '/?cliente=1&r=formato', TRACOS),
                     ('Formato-1-toque-diamante', '/?cliente=1&r=formato', 'JS:document.querySelector(\'#rosto .rzr[data-face="diamante"]\').click()')]
SO = sys.argv[1:]  # ex.: python3 compara_formato.py PC  → só esse aparelho, saída em comp-PC/
if SO: C.APAR = [a for a in C.APAR if a[0] in SO]
sys.argv = ['compara.py', 'http://localhost:8701', 'http://localhost:8702', os.path.join(AQUI, 'comp' + ('-' + '-'.join(SO) if SO else ''))]
C.main()
