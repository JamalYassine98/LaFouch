import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b,pg,er=base.abre(p,W=390,H=844);pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.goto('http://localhost:8997/?medir=1');pg.wait_for_timeout(6000)
    for i in range(6):pg.mouse.wheel(0,700);pg.wait_for_timeout(200)
    pg.evaluate("document.querySelector('[data-open]').click()");pg.wait_for_timeout(1200);pg.keyboard.press('Escape');pg.wait_for_timeout(500)
    pg.click('#bagbtn');pg.wait_for_timeout(1000);pg.evaluate("()=>{const x=document.querySelector('#layer [data-close]');x&&x.click()}")
    pg.evaluate("()=>{let t=performance.now();while(performance.now()-t<180){}}");pg.wait_for_timeout(600)
    with pg.expect_download() as d:pg.click('#lfgrv [data-g=b]')
    j=json.load(open(d.value.path()));from collections import Counter
    print('diag',[e for e in j['eventos'] if e['k']=='diagnóstico'][:1],j['diagnostico']);print('eventos',len(j['eventos']),Counter(e['k'] for e in j['eventos']));print([e for e in j['eventos'] if e['k']=='quadro longo'][:1]);print(j['aparelho'])
    print([x for x in er if 'Failed' not in x][:3]);b.close()
