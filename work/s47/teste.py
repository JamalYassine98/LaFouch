from playwright.sync_api import sync_playwright
import sys,json
# rosto falso: a distância segue um roteiro (tempo em s -> cm); None = sem rosto
FAKE="""(()=>{window.__lfD=40;window.__lfEar=1;window.__lfVoz=[];
function pts(d){var f=240/Math.tan(31*Math.PI/180),ipd=f*6.3/d,P=[];for(var i=0;i<68;i++)P.push({x:200,y:200});
 function olho(o,cx){var w=ipd*0.45,h=w*0.32*window.__lfEar;P[o]={x:cx-w/2,y:200};P[o+3]={x:cx+w/2,y:200};P[o+1]={x:cx-w/6,y:200-h};P[o+2]={x:cx+w/6,y:200-h};P[o+5]={x:cx-w/6,y:200+h};P[o+4]={x:cx+w/6,y:200+h}}
 olho(36,200);olho(42,200+ipd);P[19]={x:200,y:200-ipd*0.35};P[24]={x:200+ipd,y:200-ipd*0.35};return P}
window.__lfFakeFa={TinyFaceDetectorOptions:function(){},detectSingleFace:function(){return{withFaceLandmarks:function(){var d=window.__lfD;return Promise.resolve(d?{landmarks:{positions:pts(d)}}:null)}}}};
try{var _s=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=function(u){window.__lfVoz.push(Math.round(performance.now()/100)/10+'s '+u.text);}}catch(e){}
})()"""
def run(nome,rot,acoes={}):
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'])
        ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR',permissions=['camera'])
        ctx.add_init_script(FAKE);pg=ctx.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)))
        pg.goto('http://localhost:8768/');pg.wait_for_timeout(2300)
        pg.evaluate("document.querySelector('[data-dopen],#mbtn,.bar [aria-label*=enu]').click()");pg.wait_for_timeout(700)
        pg.evaluate("[...document.querySelectorAll('#drw [data-gzopen]')][0].click()");pg.wait_for_timeout(1200)
        pg.evaluate("document.querySelector('#gw [data-gz=comeca]').click()")
        t=0;last=''
        while t<rot[-1][0]:
            d=None
            for i in range(len(rot)-1):
                if rot[i][0]<=t<rot[i+1][0]:
                    a,b2=rot[i][1],rot[i+1][1]
                    d=None if a is None else (a if b2 is None else a+(b2-a)*(t-rot[i][0])/(rot[i+1][0]-rot[i][0]))
            pg.evaluate("window.__lfD=%s"%('null' if d is None else '%.1f'%d))
            if round(t,1) in acoes: pg.evaluate(acoes[round(t,1)])
            pg.wait_for_timeout(100);t=round(t+0.1,1)
            tela=pg.evaluate("(()=>{var g=document.getElementById('gw');if(!g)return 'FECHADO';var e=g.querySelector('.gzeb'),h=g.querySelector('h2,.gzres');return (e?e.textContent:'')+' | '+(h?h.textContent:'')})()")
            if tela!=last: print('  %5.1fs d=%s  %s'%(t,'—' if d is None else round(d),tela));last=tela
        print('  RESULTADO:',pg.evaluate("(()=>{var g=document.getElementById('gw');return g?g.querySelector('.gzc').innerText.replace(/\\n+/g,' / ').slice(0,260):''})()"))
        print('  VOZ:');[print('    ',v) for v in pg.evaluate('window.__lfVoz')]
        if er: print('  ERROS',er)
        pg.screenshot(path='s47/t_%s.png'%nome)
        b.close()
cen=sys.argv[1] if len(sys.argv)>1 else 'normal'
if cen=='normal':   # perto -> afasta devagar até 66 e para; repete
    run(cen,[(0,24),(7,24),(10,24),(16,60),(22,60),(24,24),(27,24),(32,57),(38,57),(40,57)])
if cen=='vaivem':   # vai e vem rápido antes de parar
    run(cen,[(0,24),(7,24),(8,24),(9,40),(9.6,30),(10.2,48),(10.8,36),(11.4,55),(12.4,60),(18,60),(20,24),(23,24),(26,58),(31,58),(33,58)])
if cen=='miopia':
    run(cen,[(0,15),(8,15),(9,18),(14,18),(16,18)],{9.5:"document.querySelector('#gw [data-gz=nitido]').click()"})
if cen=='braco':
    run(cen,[(0,24),(7,24),(11,70),(22,70),(23,70)])
if cen=='diferentes':
    run(cen,[(0,24),(5,24),(8,24),(11,34),(16,34),(18,24),(21,24),(25,60),(30,60),(32,24),(35,24),(38,48),(43,48),(45,48)])
