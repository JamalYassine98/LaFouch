import json,datetime
from playwright.sync_api import sync_playwright
sent=[]
def route(r):
    u=r.request.url
    if 'cloudfunctions' in u and '/analise' in u:
        sent.append(r.request.post_data);return r.fulfill(status=200,body='{"ok":true}',headers={'content-type':'application/json'})
    if 'localhost' in u:return r.continue_()
    return r.abort()
with sync_playwright() as p:
    b=p.chromium.launch()
    for (dt,q,exp) in [('2026-11-20T10:00:00','', 'bf'),('2026-11-24T10:00:00','',''),('2026-11-30T10:00:00','','bf'),('2026-12-05T10:00:00','','natal'),('2026-10-27T10:00:00','',''),('2027-05-03T10:00:00','','maes'),('2027-06-10T10:00:00','','pais'),('2026-11-11T10:00:00','?evp=maes','maes')]:
        c=b.new_context(viewport={'width':390,'height':860});pg=c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.clock.install(time=datetime.datetime.fromisoformat(dt+'-03:00'))
        pg.route('**/*',route);pg.goto('http://localhost:8160/index.html'+q);pg.wait_for_timeout(2500)
        ev=pg.evaluate("document.documentElement.getAttribute('data-ev')||''")
        bar=pg.evaluate("(document.getElementById('evbar')||{}).textContent||''")
        print(dt,q,'ev=',ev,'esperado=',exp,'OK' if ev.startswith(exp) and (exp or not ev) else 'FALHA','|',bar[:60],errs[:2])
        c.close()
    # analytics
    c=b.new_context(viewport={'width':390,'height':860});pg=c.new_page();pg.route('**/*',route)
    pg.goto('http://localhost:8160/index.html');pg.wait_for_timeout(2500)
    pg.evaluate("location.hash='#p/SL2210'");pg.wait_for_timeout(1500)
    pg.evaluate("(function(){var q=document.getElementById('q');q.value='gatinhozz';q.dispatchEvent(new Event('input',{bubbles:true}))})()");pg.wait_for_timeout(2200)
    pg.evaluate("document.dispatchEvent(new Event('visibilitychange'))")
    pg.evaluate("Object.defineProperty(document,'visibilityState',{value:'hidden',configurable:true});document.dispatchEvent(new Event('visibilitychange'))");pg.wait_for_timeout(800)
    print('enviado:',sent[-1] if sent else None)
    b.close()
