import sys,json,subprocess,time,collections
sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
srv=subprocess.Popen(['python3','-m','http.server','8911','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2)
try:
  with sync_playwright() as p:
    b,pg,er=base.abre(p,W=390,H=844,ls={'t_perm':'granted'});pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    cdp=pg.context.new_cdp_session(pg);cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
    pg.add_init_script("sessionStorage.setItem('lf_ni','1');(()=>{const o=SVGGeometryElement.prototype.getPointAtLength;window.__n=0;window.__t=0;window.__L=[];SVGGeometryElement.prototype.getPointAtLength=function(u){const a=performance.now();const r=o.call(this,u);window.__t+=performance.now()-a;if(!(window.__n++%200))window.__L.push((this.getAttribute('class')||this.tagName)+':'+(this.getAttribute('d')||'').length+':'+Math.round(performance.now()));return r}})()");pg.goto('http://localhost:8911/?camt=1');w=pg.wait_for_timeout;w(4000);cdp.send('Profiler.enable');cdp.send('Profiler.setSamplingInterval',{'interval':500});cdp.send('Profiler.start');pg.evaluate("()=>{window.__dist=30;window.__lfGzAbre()}");w(4000);pg.click('#gzcom');w(14000);pr=cdp.send('Profiler.stop')['profile'];print('chamadas',pg.evaluate('()=>[window.__n,Math.round(window.__t),window.__L]'));b.close()
    nodes={n['id']:n for n in pr['nodes']};par={}
    for n in pr['nodes']:
        for c in n.get('children',[]): par[c]=n['id']
    dt=pr['timeDeltas'];sm=pr['samples'];S=collections.Counter();F=collections.Counter();tot=sum(dt);ft=0
    def nm(i):
        cf=nodes[i]['callFrame'];return (cf['functionName'] or '(anon)')+' @'+str(cf['lineNumber']+1)+':'+str(cf['columnNumber'])
    for sid,d in zip(sm,dt):
        S[nm(sid)]+=d;i=sid;ch=[]
        while i in par:
            ch.append(i);i=par[i]
            if nodes[i]['callFrame']['functionName']=='frame':
                ft+=d;F[nm(sid)]+=d;F['  <filho direto> '+nm(ch[-1])]+=d;break
        if nodes[sid]['callFrame']['functionName']=='frame': ft+=d;F['frame (proprio)']+=d
    print('TOTAL',tot/1000,'ms  frame incl',ft/1000)
    print('-- geral');[print('%7.1f %4.1f%% %s'%(v/1000,100*v/tot,k[:80])) for k,v in S.most_common(14)]
    print('-- dentro de frame');[print('%7.1f %s'%(v/1000,k[:80])) for k,v in F.most_common(22)]
finally: srv.terminate()
