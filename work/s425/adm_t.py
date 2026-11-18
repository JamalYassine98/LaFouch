import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
DOC=json.dumps({'fields':{'ativo':{'booleanValue':False}}})
def rota(r):
    u=r.request.url
    if 'config/site' in u:return r.fulfill(status=200,content_type='application/json',body=DOC)
    return r.continue_() if u.startswith('http://localhost') else r.abort()
EST="""()=>{const a=document.getElementById('admb');if(!a)return null;const r=a.getBoundingClientRect(),c=getComputedStyle(a),s=a.querySelector('.lfdg'),w=document.querySelector('a.wa'),wr=w&&w.getBoundingClientRect();
const L=x=>{const v=x.match(/[\\d.]+/g).slice(0,3).map(y=>{y/=255;return y<=.03928?y/12.92:Math.pow((y+.055)/1.055,2.4)});return .2126*v[0]+.7152*v[1]+.0722*v[2]};const ct=s?(L('rgb(255,255,255)')+.05)/(L(getComputedStyle(s).color)+.05):0;
return {txt:a.innerText.slice(0,70),fech:a.classList.contains('fech'),bg:c.backgroundColor,r:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)],cobreWA:!!(wr&&!(r.right<=wr.left||wr.right<=r.left||r.bottom<=wr.top||wr.bottom<=r.top)),contraste:+ct.toFixed(2),fonte:s?getComputedStyle(s).fontSize:'',painel:a.innerText.includes('Abrir painel'),manut:!!document.getElementById('manut')}}"""
with sync_playwright() as p:
  for W,H,lang,zi in ((390,844,'pt-BR','0'),(390,844,'es-PY','2'),(1440,900,'pt-BR','0'),(320,640,'pt-BR','2')):
    b,pg,er=base.abre(p,lang=lang,W=W,H=H,ls={'lf_zoom':zi,'lf_lang':'es' if lang.startswith('es') else 'pt'});pg.context.route('**/*',rota)
    pg.goto('http://localhost:8998/');pg.wait_for_timeout(3500);e1=pg.evaluate(EST)
    pg.click('#admb .admx');pg.wait_for_timeout(400);e2=pg.evaluate(EST)
    pg.reload();pg.wait_for_timeout(3500);e3=pg.evaluate(EST)
    for i in range(5):pg.click('#admb .admx');pg.wait_for_timeout(80)
    pg.wait_for_timeout(300);e4=pg.evaluate(EST)
    print(W,lang[:2],zi,'\n aberto',e1,'\n recolhido',e2,'\n depois de recarregar',e3['fech'],'\n 5 toques',e4['fech'],[x for x in er if 'Failed' not in x][:2])
    if W==390 and zi=='0':
        pg.click('#admb .admx');pg.wait_for_timeout(300);pg.screenshot(path='/tmp/adm_aberto.png');pg.click('#admb .admx');pg.wait_for_timeout(300);pg.screenshot(path='/tmp/adm_fech.png')
    b.close()
