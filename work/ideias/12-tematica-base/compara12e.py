"""Comparador (regra 11) para IDEIAS 12e: Início de hoje (:8721) × proposta (:8769) com a data ligada (env CMP_EV), em todos os aparelhos."""
import os, sys, json
sys.path.insert(0, '/tmp/rp/lafouch/work/s430/comparador'); os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
os.environ.setdefault('CMP_TELAS', 'Início')
import compara as C
EV = os.environ.get('CMP_EV', 'natal'); _ctx = C.sim.contexto
def ctx(*a, **k):
    c = _ctx(*a, **k)
    c.route('**/documents/config/site**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body=json.dumps({'name': 'x/config/site', 'fields': {'ativo': {'booleanValue': True}, 'evento': {'mapValue': {'fields': {'tema': {'stringValue': EV}}}}}})))
    return c
C.sim.contexto = ctx
sys.argv = ['compara.py', 'http://localhost:8721', 'http://localhost:8769', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'comp-12e-' + EV)]
C.main()
