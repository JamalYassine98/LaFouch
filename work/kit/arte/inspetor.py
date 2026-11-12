import sys,os,json,io
from playwright.sync_api import sync_playwright
from PIL import Image,ImageChops,ImageFilter
code=open('/tmp/k/mochi_mod.js').read();css=open('/tmp/k/mochi_mod.css').read()
HARN="""window.__vt=0;performance.now=()=>window.__vt;const _q=[];window.requestAnimationFrame=f=>{_q.push(f);return _q.length};window.cancelAnimationFrame=()=>{};
window.__step=(ms)=>{window.__vt+=ms;const q=_q.splice(0);q.forEach(f=>{try{f(window.__vt)}catch(e){}})};"""
MARK="""()=>{const r=document.getElementById('stg');r.querySelectorAll('.aBe,.aBd,.aFe,.aFd').forEach(e=>e.setAttribute('data-k','arm'));
r.querySelectorAll('path').forEach(p=>{const d=p.getAttribute('d')||'';if(/^M32 81|^M88 81/.test(d))p.setAttribute('data-k','hc')});
r.querySelectorAll('circle,ellipse').forEach(c=>{const f=c.getAttribute('fill')||'';if(f==='#e7a6c7'||/lfmbl/.test(f))c.setAttribute('data-k','hc')})}"""
FACE={'ajusta','tapinha','limpa','pensando','bocejo','tiraOculos','palminha'}
def png(pg):return Image.open(io.BytesIO(pg.screenshot())).convert('RGB')
def mask(a,b):
    d=ImageChops.difference(a,b).convert('L').point(lambda v:255 if v>24 else 0);return d
def run(nome,fps=30):
    res=[]
    with sync_playwright() as pw:
        b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':360,'height':300},device_scale_factor=3)
        pg.set_content('<style>'+css+'.hideA [data-k=arm]{visibility:hidden}.hideH [data-k=hc]{visibility:hidden}</style><body style="margin:0;background:#8d3a69"><div id=stg style="position:relative;width:360px;height:300px"></div></body>')
        pg.add_script_tag(content=HARN);pg.add_script_tag(content=code)
        ok=pg.evaluate("n=>{window.M=MOCHI(document.getElementById('stg'),110,40);for(let i=0;i<40;i++)__step(33);return M.gesto(n)}",nome)
        if ok is not True: b.close();return None
        os.makedirs('/tmp/k/g/'+nome,exist_ok=True)
        for k in range(int(4*fps)):
            pg.evaluate("__step(%f)"%(1000/fps));pg.evaluate(MARK)
            full=png(pg)
            pg.evaluate("document.getElementById('stg').classList.add('hideA')");noA=png(pg)
            pg.evaluate("document.getElementById('stg').classList.add('hideH')");noAH=png(pg)
            pg.evaluate("document.getElementById('stg').classList.remove('hideA','hideH')")
            arm=mask(full,noA).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(5));hc=mask(noA,noAH).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
            ov=ImageChops.multiply(arm,hc);n=sum(1 for v in ov.tobytes() if v>0)
            res.append(n);full.save(f'/tmp/k/g/{nome}/{k:03d}.png')
            if k>10 and not pg.evaluate("M.emGesto()"): break
        b.close()
    return res
if __name__=='__main__':
    out={}
    for g in sys.argv[1:]:
        r=run(g);
        if r is None: print(g,'não roda');continue
        bad=[i for i,v in enumerate(r) if v>6];out[g]={'quadros':len(r),'ruins':bad,'max':max(r) if r else 0,'rosto':g in FACE}
        print(g,len(r),'quadros · com toque:',len(bad),'· máx px',out[g]['max'],'(gesto de rosto)' if g in FACE else '')
    json.dump(out,open('/tmp/k/inspecao.json','w'))
