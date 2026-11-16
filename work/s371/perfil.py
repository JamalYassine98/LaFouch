import sys,json,subprocess,time,collections
sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
srv=subprocess.Popen(['python3','-m','http.server','8911','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2)
try:
  with sync_playwright() as p:
    b,pg,er=base.abre(p,W=390,H=844,ls={'t_perm':'granted'});pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    cdp=pg.context.new_cdp_session(pg);cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
    pg.add_init_script("sessionStorage.setItem('lf_ni','1')");pg.goto('http://localhost:8911/');w=pg.wait_for_timeout;w(4000);cdp.send('Profiler.enable');cdp.send('Profiler.setSamplingInterval',{'interval':500});cdp.send('Profiler.start');pg.evaluate("()=>{window.__dist=30;window.__lfGzAbre()}");w(4000);pg.click('#gzcom');w(14000);pr=cdp.send('Profiler.stop')['profile'];b.close()
    nodes={n['id']:n for n in pr['nodes']};dt=pr['timeDeltas'];sm=pr['samples'];self_t=collections.Counter()
    for sid,d in zip(sm,dt): 
        cf=nodes[sid]['callFrame'];self_t[(cf['functionName'] or '(anon)')+' @'+str(cf['lineNumber']+1)+(':'+cf['url'].split('/')[-1].split('?')[0][:14] if cf['url'] else '')]+=d
    tot=sum(dt)
    for k,v in self_t.most_common(16): print('%6.1f ms  %4.1f%%  %s'%(v/1000,100*v/tot,k[:90]))
finally: srv.terminate()
