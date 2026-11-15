import sys,subprocess,time,json
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
srv=subprocess.Popen(['python3','-m','http.server','8899'],cwd='/tmp/gt',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
JS="""async a=>{const v=document.createElement('video');v.muted=true;v.src=URL.createObjectURL(await (await fetch(a)).blob());v.preload='auto';await new Promise(r=>v.onloadeddata=r);const c=document.createElement('canvas');c.width=48;c.height=27;const x=c.getContext('2d',{willReadFrequently:true});const ass=[];let fechou=null;const out=[];
for(let t=0.05;t<v.duration-0.2;t+=0.5){await new Promise(r=>{v.onseeked=r;v.currentTime=t});await new Promise(r=>requestAnimationFrame(r));x.drawImage(v,0,0,48,27);const d=x.getImageData(0,0,48,27).data,g=new Float32Array(48*27);for(let k=0;k<g.length;k++)g[k]=(d[k*4]+d[k*4+1]+d[k*4+2])/3;ass.push(g);
 if(!fechou&&ass.length>=24){const f=__gtFechou(ass,0.5);if(f){fechou={em:t,per:f.per,casa:f.casa,meio:f.meio}}}
 if(ass.length%20==0){const q=__gtVolta(ass,0.5);out.push([t,+q.per.toFixed(1),+q.casa.toFixed(2),+q.meio.toFixed(2),q.borda])}}
return {dur:v.duration,fechou,out}}"""
try:
    with sync_playwright() as pw:
        b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox']);pg=b.new_page();pg.goto('http://localhost:8899/t.html');pg.set_default_timeout(600000)
        for a in sys.argv[1:]: print(a,json.dumps(pg.evaluate(JS,a)))
        b.close()
finally: srv.kill()
