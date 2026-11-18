# mede quanto do CSS e do JS do site é usado num passeio completo (Início, catálogo, peça, carrinho, conta, menu, busca, Mochi, páginas)
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
CONTA=json.dumps({'nome':'Maria González','email':'m@e.com','tel':'+595 983 000 000','nac':'py','doc':'1234567','ends':[]})
AUTH=json.dumps({'uid':'kit','idToken':'kit','refresh':'kit','exp':9e15,'ev':True,'email':'m@e.com'})
usados=set();todas=None;TOT=set();RAN=set();todasR=set()
with sync_playwright() as p:
  for W,H,lang,ev in [(390,844,'pt-BR',''),(1440,900,'es-PY','natal'),(820,1180,'pt-BR','bf')]:
    ls={'lf_conta':CONTA,'lf_auth':AUTH};
    if ev: ls['lf_cfg']=json.dumps({'evento':{'tema':ev,'ini':0,'fim':0}})
    b,pg,er=base.abre(p,lang=lang,W=W,H=H,ls=ls)
    pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    cdp=pg.context.new_cdp_session(pg);cdp.send('DOM.enable');cdp.send('CSS.enable');cdp.send('CSS.startRuleUsageTracking');cdp.send('Profiler.enable');cdp.send('Profiler.startPreciseCoverage',{'callCount':False,'detailed':False})
    for rota,acao in [('/',None),('/',"document.querySelector('#bagbtn').click()"),('/',"document.querySelector('#contabtn').click()"),('/',"document.querySelector('#mnb').click()"),('/',"document.querySelector('#sbtn')&&document.querySelector('#sbtn').click()"),('/?r=armacoes',None),('/',"document.querySelector('[data-open]').click()"),('/#atacado',None),('/#duvidas',None),('/#como',None),('/',"window.__lfGzAbre&&window.__lfGzAbre()")]:
        pg.goto('http://localhost:8990'+rota);pg.wait_for_timeout(2200)
        if acao:
            try:pg.evaluate(acao)
            except Exception:pass
            pg.wait_for_timeout(1500)
        pg.evaluate("()=>{const L=[document.scrollingElement,...document.querySelectorAll('#layer .scrim,#vscr')];for(let i=0;i<4;i++)L.forEach(e=>e&&(e.scrollTop+=innerHeight))}");pg.wait_for_timeout(500)
        jj=cdp.send('Profiler.takePreciseCoverage')
        for sc in jj['result']:
            if 'lf-site.js' in sc['url']:
                for f in sc['functions']:
                    k=(f['ranges'][0]['startOffset'],f['ranges'][0]['endOffset']);TOT.add(k)
                    if f['ranges'][0]['count']>0:RAN.add(k)
        r=cdp.send('CSS.takeCoverageDelta')
        for x in r['coverage']:
            todasR.add((x['styleSheetId'],x['startOffset']))
            if x['used']:usados.add((x['styleSheetId'],x['startOffset']))
    b.close()
print('funções do lf-site.js:',len(TOT),'rodaram:',len(RAN),'nunca rodaram:',len(TOT-RAN));print('regras CSS vistas:',len(todasR),'usadas:',len(usados))
