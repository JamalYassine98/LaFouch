# S436 — prova da parte 2b: parte de vários estados guardados (antigos e novos), manda desenhar e compara o que as migrações
# dos grupos deixaram (grupos, atalhos do Início, barra, marcas) nas duas pastas www. Uso: python3 equiv_grupos.py <wwwAntes> <wwwDepois>
import sys, subprocess, time, json
from playwright.sync_api import sync_playwright
ZERA = "S.fam7=false;S.fam7b=false;S.fam6=false;S.fam63=false;S.fam80=false;S.fam95=false;S.rat66=false;S.rateio='igual';"
CEN = {
 'como abre hoje': "",
 'instalação antiga sem grupos': ZERA + "S.grupos=[];S.inicioT=null;S.barra=null;",
 'antiga com grupo e atalhos do dono': ZERA + "S.grupos=[{id:'g1',nome:'Meu',ico:'caixa',itens:['caixa','desp']}];S.inicioT=['hoje','giro','ped','cli','est','mkt','anl','g1','lotes','cont'];S.barra=['vendas','g1','hoje','ajustes'];",
 'antiga com barra cheia de telas soltas': ZERA + "S.grupos=[];S.inicioT=['fx','hist','prec','din','tem','msg','ata','novo'];S.barra=['estoque','ped','mkt','cli'];",
 'só as 7 famílias (antes das 6)': "S.fam6=false;S.fam7b=false;S.fam63=false;S.fam80=false;S.fam95=false;",
 '7 + 6 famílias, sem Cartões nem a troca do Site': "S.fam80=false;S.fam95=false;S.fam63=false;S.rat66=false;",
 'famílias sem o grupo Marketing': "S.grupos=(S.grupos||[]).filter(g=>g.id!=='g:mkt');S.fam80=false;S.fam95=false;",
 'barra antiga dos testes': "S.grupos=(S.grupos||[]).filter(g=>!g.fam);S.barra=null;S.inicioT=null;S.fam7=true;",
 'duas vezes seguidas (não repete)': ZERA + "S.grupos=[];S.inicioT=null;S.barra=null;L.render();",
}
JS = """(cod) => { const L = window.__LF, S = L.S; (new Function('S', 'L', cod))(S, L); L.render(); L.render();
  return JSON.stringify({ g: S.grupos, t: S.inicioT, b: S.barra, f: [S.fam7, S.fam7b, S.fam6, S.fam63, S.fam80, S.fam95, S.rat66, S.rateio, S.inicioFant, S.uniao1], v: S.view }); }"""
def roda(pasta, porta):
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(porta), '-d', pasta], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1); R = {}
    try:
        with sync_playwright() as pw:
            b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
            for nome, cod in CEN.items():
                c = b.new_context(viewport={'width': 390, 'height': 844}, locale='pt-BR', service_workers='block')
                c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
                c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
                pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:100]))
                pg.goto('http://localhost:%d/index.html#test' % porta); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(700)
                R[nome] = [pg.evaluate(JS, cod), er]; c.close()
            b.close()
    finally: srv.kill()
    return R
A = roda(sys.argv[1], 8851); B = roda(sys.argv[2], 8852); dif = 0
for k in A:
    ig = A[k] == B[k]; dif += 0 if ig else 1; g = json.loads(A[k][0])
    print('igual   ' if ig else 'DIFERENTE', k, '· grupos', len(g['g'] or []), '· atalhos', len(g['t'] or []), '· marcas', g['f'][:7], '' if ig else '\n  antes ' + A[k][0][:900] + '\n  depois' + B[k][0][:900], A[k][1] or '')
print('DIFERENÇAS:', dif)
