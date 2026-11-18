import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
CONTA=json.dumps({'nome':'Maria','email':'m@e.com','tel':'+595 983 000 000','nac':'py','doc':'1234567','ends':[]})
AUTH=json.dumps({'uid':'kit','idToken':'kit','refresh':'kit','exp':9e15,'ev':True,'email':'m@e.com'})
BG="""()=>{const out={};const pts=[[innerWidth/2,innerHeight*.6],[20,innerHeight*.8],[innerWidth-20,innerHeight*.4]];out.fundo=pts.map(([x,y])=>{for(const e of document.elementsFromPoint(x,y)){const c=getComputedStyle(e);if(c.backgroundImage!=='none'||(c.backgroundColor!=='rgba(0, 0, 0, 0)'&&c.backgroundColor!=='transparent'))return (e.id||e.tagName.toLowerCase()+'.'+[...e.classList].slice(0,2).join('.'))+' '+(c.backgroundImage!=='none'?'IMG:'+c.backgroundImage.slice(0,40):c.backgroundColor)}return '?'});
out.fx=[...document.querySelectorAll('.evfx,.evse,.evlf')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.bottom>0&&r.top<innerHeight&&getComputedStyle(e).display!=='none'&&+getComputedStyle(e).opacity>0}).length;
out.escuro=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();if(r.width*r.height<innerWidth*120||r.bottom<0||r.top>innerHeight)return false;const m=getComputedStyle(e).backgroundColor.match(/[\\d.]+/g);if(!m||(m[3]!==undefined&&+m[3]<.5))return false;return (+m[0]*.3+ +m[1]*.59+ +m[2]*.11)<70}).map(e=>e.id||e.className.toString().slice(0,20)).slice(0,3);return out}"""
TELAS=[('carrinho',"document.querySelector('#bagbtn').click()"),('conta',"document.querySelector('#contabtn').click()"),('mochi',"window.__lfGzAbre&&window.__lfGzAbre()"),('#atacado','0'),('#duvidas','0'),('#como','0')]
for ev in sys.argv[1].split(','):
  with sync_playwright() as p:
    tema=ev.split('-')[0];cfg=json.dumps({'evento':{'tema':tema,'ini':0,'fim':0}})
    b,pg,er=base.abre(p,W=390,H=844,ls={'lf_cfg':cfg,'lf_conta':CONTA,'lf_auth':AUTH})
    pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    if ev=='anonovo-d':pg.clock.set_fixed_time(__import__('datetime').datetime(2026,12,31,12,0))
    if ev=='anonovo-n':pg.clock.set_fixed_time(__import__('datetime').datetime(2026,12,31,22,0))
    for nome,js in TELAS:
        pg.goto('http://localhost:8990/'+(nome if nome.startswith('#') else ''));pg.wait_for_timeout(2500);dev=pg.evaluate("document.documentElement.getAttribute('data-ev')")
        pg.evaluate(js);pg.wait_for_timeout(1800);r=pg.evaluate(BG);print(ev,dev,nome,json.dumps(r,ensure_ascii=False)[:330],flush=True)
        if nome in('#atacado','#duvidas') and ev in('anonovo-n','natal'):pg.screenshot(path='/tmp/t2_%s_%s.png'%(ev,nome))
    b.close()
