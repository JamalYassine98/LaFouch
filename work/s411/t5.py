exec(open('base.py').read())
s=serve('/home/claude/catalogo',8901);time.sleep(1)
try:
  with sync_playwright() as pw:
    b,pg,er=abre(pw,'http://localhost:8901/')
    pg.tap('#sbtn');pg.wait_for_timeout(1200)
    pg.evaluate("()=>{window.__o=[];const t0=performance.now();(function f(){const v=document.getElementById('sov'),p=v&&v.querySelector('.sopn');__o.push([Math.round(performance.now()-t0),v?getComputedStyle(v).opacity:'',p?getComputedStyle(p).opacity+' '+getComputedStyle(p).transform:'',v?v.className:''] );if(performance.now()-t0<800)requestAnimationFrame(f)})()}")
    pg.touchscreen.tap(195,760);pg.wait_for_timeout(1000)
    o=pg.evaluate("()=>window.__o");prev=None
    for x in o:
        k=tuple(x[1:])
        if k!=prev:print(x);prev=k
    b.close()
finally: s.terminate()
