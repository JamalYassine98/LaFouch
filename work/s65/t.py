"""Roda a consulta do Mochi no simulador: rosto falso a 40 cm, respostas roteirizadas, fotos de cada etapa."""
from playwright.sync_api import sync_playwright
import sys
FAKE="""(()=>{window.__lfD=40;
function pts(d){var f=160/Math.tan(31*Math.PI/180),ipd=f*6.3/d,P=[];for(var i=0;i<68;i++)P.push({x:150,y:150});
 function olho(o,cx){var w=ipd*0.45,h=w*0.32;P[o]={x:cx-w/2,y:150};P[o+3]={x:cx+w/2,y:150};P[o+1]={x:cx-w/6,y:150-h};P[o+2]={x:cx+w/6,y:150-h};P[o+5]={x:cx-w/6,y:150+h};P[o+4]={x:cx+w/6,y:150+h}}
 olho(36,150);olho(42,150+ipd);return P}
window.__lfFakeFa={TinyFaceDetectorOptions:function(){},detectSingleFace:function(){return{withFaceLandmarks:function(){var d=window.__lfD;return Promise.resolve(d?{landmarks:{positions:pts(d)}}:null)}}}};
window.__vozes=[];try{speechSynthesis.speak=function(u){window.__vozes.push(u.text)}}catch(e){}})()"""
def run(nome,resp,w=390,h=844,zoom=None,rm=False,fotos=True):
    out=[]
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'])
        ctx=b.new_context(viewport={'width':w,'height':h},is_mobile=True,has_touch=True,locale='pt-BR',permissions=['camera'],device_scale_factor=2,reduced_motion='reduce' if rm else 'no-preference')
        ctx.add_init_script(FAKE)
        if zoom is not None: ctx.add_init_script("try{localStorage.setItem('lf_zoom','%d')}catch(e){}"%zoom)
        pg=ctx.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)))
        pg.goto('http://localhost:8768/');pg.wait_for_timeout(2300)
        pg.evaluate("document.querySelector('[data-dopen],#mbtn,.bar [aria-label*=enu]').click()");pg.wait_for_timeout(700)
        pg.evaluate("[...document.querySelectorAll('#drw [data-gzopen]')][0].click()");pg.wait_for_timeout(2000)
        if fotos: pg.screenshot(path='s65/%s_0intro.png'%nome)
        pg.tap('#gw [data-gz=comeca]');pg.wait_for_timeout(5200)
        if fotos: pg.screenshot(path='s65/%s_1teste.png'%nome)
        for i,r in enumerate(resp):
            st=pg.evaluate("(()=>{const Z=window.__LFGZ.Z;return Z.fase+' linha:'+Z.at+' lente:'+Z.g})()")
            if not st.startswith('teste'): out.append('  (fim antes da resposta %d)'%i);break
            pg.tap('#gw [data-gz=%s]'%('sim' if r else 'nao'));out.append('  %-30s → %s'%(st,'Consigo' if r else 'Não consigo'))
            pg.wait_for_timeout(4200)
            if fotos and i in (2,len(resp)//2): pg.screenshot(path='s65/%s_2meio%d.png'%(nome,i))
        pg.wait_for_timeout(1500)
        res=pg.evaluate("(()=>{const g=document.getElementById('gw');return g?g.querySelector('#gzc').innerText.replace(/\\n+/g,' / ').slice(0,160):'FECHOU'})()")
        if fotos: pg.screenshot(path='s65/%s_3fim.png'%nome)
        out.append('  RESULTADO: '+res)
        if er: out.append('  ERROS: '+' | '.join(er[:3]))
        b.close()
    print('## '+nome);print('\n'.join(out))
if __name__=='__main__':
    c=sys.argv[1] if len(sys.argv)>1 else 'a'
    if c=='a': run('a',[1,1,1,1,0,0,1,1,1,1,0,1])   # lê até a 4ª, trava na 5ª
    if c=='b': run('b',[1,1,1,1,1,1,1,1,1])       # lê tudo sem lente
    if c=='c': run('c',[0]+[0]*20,fotos=False)    # não lê nada
    if c=='d': run('d',[1,1,1,1,0,1,1,1,1,1,0],fotos=False)   # lê tudo com a 1ª lente -> confere a mais fraca -> não
    if c=='p': run('p',[1,1,0,1,1,1,1,1,1,0],w=320,h=568,zoom=2)   # celular pequeno + texto muito grande
    if c=='r': run('r',[1,1,1,0,1,1,1,1,1,0],rm=True)   # movimento reduzido
