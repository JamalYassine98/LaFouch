import sys, json, time
from playwright.sync_api import sync_playwright
URL=sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
    pg=c.new_page(); cdp=c.new_cdp_session(pg); cdp.send('Network.enable')
    cdp.send('Network.emulateNetworkConditions',{'offline':False,'latency':400,'downloadThroughput':400*1024/8,'uploadThroughput':200*1024/8})
    R={}; t0=[0]
    def req(e): R[e['requestId']]={'u':e['request']['url'],'ini':time.time()-t0[0]}
    def fim(e):
        r=R.get(e['requestId'])
        if r: r['fim']=time.time()-t0[0]; r['kb']=e.get('encodedDataLength',0)/1024
    cdp.on('Network.requestWillBeSent',req); cdp.on('Network.loadingFinished',fim)
    t0[0]=time.time(); pg.goto(URL,wait_until='commit'); M={}
    for nome,js in (('topo','!!document.querySelector(".top .logo")&&document.querySelector(".top .logo").getBoundingClientRect().height>0'),
                    ('primeiro_cartao','[...document.querySelectorAll("[data-open]")].some(e=>e.offsetParent)'),
                    ('primeira_foto','[...document.querySelectorAll("[data-open] img")].some(i=>i.naturalWidth>0&&i.offsetParent)')):
        try: pg.wait_for_function(js,timeout=40000); M[nome]=round(time.time()-t0[0],1)
        except Exception: M[nome]=None
    try: M['fcp']=round(pg.evaluate("(performance.getEntriesByName('first-contentful-paint')[0]||{}).startTime||0")/1000,1)
    except Exception: pass
    lim=M.get('primeira_foto') or 40
    L=sorted([r for r in R.values() if 'fim' in r and r['ini']<lim],key=lambda r:r['ini'])
    print(json.dumps(M))
    for r in L: print(f"{r['ini']:5.1f} → {r['fim']:5.1f} s  {r['kb']:6.1f} KB  {r['u'].split('?')[0][-70:]}")
    print('total KB até a 1ª foto:',round(sum(r['kb'] for r in L if r['fim']<=lim)))
    b.close()
