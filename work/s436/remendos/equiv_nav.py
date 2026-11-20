# S436 — prova da parte 2a: para CADA destino, abre o app do zero, chama inicioGo(id) e anota onde foi parar e quais botões ficam acesos (navOn de todos).
# Roda em duas pastas www (antes × depois) e compara. Uso: python3 equiv_nav.py <wwwAntes> <wwwDepois>
import sys, subprocess, time, json
from playwright.sync_api import sync_playwright
IDS = ['inicio','vendas','estoque','caixa','fx','desp','hist','hoje','din','giro','prec','cat','ajustes','ped','onl','cli','cont','lotes','novo','notif','mkt','est','msg','anl','tem','ata','site','vit','prod','pre','cfg','cup','repo','dia','dash','clientes','grp','naoexiste']
JS = """async (id) => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
  const gs = (S.grupos || []).map(g => g.id); const todos = %s.concat(gs);
  let erro = '';
  try { L.inicioGo(id === '@grupo0' ? gs[0] : id === '@grupo1' ? gs[1] : id === '@gsite' ? 'g:site' : id === '@gmkt' ? 'g:mkt' : id); } catch (e) { erro = String(e).slice(0, 80); }
  await w(450);
  const on = todos.map(x => { try { return L.navOn(x) ? 1 : 0; } catch (e) { return 'E'; } }).join('');
  return { view: S.view, dTab: S.dTab, onlAba: S.onlAba, lotes: !!S.lotesView, repo: !!S.repoView, nvG: S.nvG || '', gAt: S._gAt || '', hash: location.hash, on, erro,
    janela: [...document.querySelectorAll('.modal:not([hidden]),[role=dialog]:not([hidden]),.catov:not([hidden])')].map(e => e.id || e.className.split(' ')[0]).join(','), n: todos.length }; }""" % json.dumps(IDS)
def roda(pasta, porta, tema, fam):
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(porta), '-d', pasta], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1); R = {}
    try:
        with sync_playwright() as pw:
            b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
            for id in IDS + ['@grupo0', '@grupo1', '@gsite', '@gmkt']:
                c = b.new_context(viewport={'width': 390, 'height': 844}, locale='pt-BR', color_scheme=tema, service_workers='block')
                c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
                c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
                pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:80]))
                pg.goto('http://localhost:%d/index.html#test' % porta); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(700)
                if not fam: pg.evaluate("() => { const L = window.__LF, S = L.S; S.grupos = (S.grupos || []).filter(g => !g.fam); S.barra = null; S.inicioT = null; S.fam7 = true; L.render(); }")
                r = pg.evaluate(JS, id); r['erros'] = er; R[id] = r; c.close()
            b.close()
    finally: srv.kill()
    return R
dif = 0
for fam in (True, False):
    A = roda(sys.argv[1], 8841, 'dark', fam); B = roda(sys.argv[2], 8842, 'dark', fam)
    for k in A:
        if A[k] != B[k]: dif += 1; print('DIFERENTE', 'famílias' if fam else 'barra antiga', k, '\n  antes ', A[k], '\n  depois', B[k])
    print('famílias' if fam else 'barra antiga', '· destinos', len(A), '· botões conferidos por destino', A['inicio']['n'], '· com janela aberta', sum(1 for v in A.values() if v['janela']), '· views', len(set(str(v['view']) for v in A.values())))
print('DIFERENÇAS:', dif)
