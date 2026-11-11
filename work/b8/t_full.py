import sys,os,re,json
LG=sys.argv[1];LOC='es-PY' if LG=='es' else 'pt-BR'
sys.path.insert(0,'/home/claude/lafouch/work/testes')
from base import INIT
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
    c=b.new_context(locale=LOC,viewport={'width':390,'height':844},has_touch=True,is_mobile=True,permissions=['camera'])
    c.add_init_script("(()=>{if(!/^http/.test(location.protocol))return;localStorage.setItem('lf_lang','"+LG+"')})()")
    c.add_init_script('if(/^http/.test(location.protocol)){'+INIT+'}')
    c.add_init_script("""window.__bal=[];window.__voz=[];document.addEventListener('DOMContentLoaded',()=>{new MutationObserver(()=>{const e=document.getElementById('gzbal');if(e){const t=e.innerText.trim();if(t&&window.__bal[window.__bal.length-1]!==t)window.__bal.push(t)}}).observe(document.body,{subtree:true,childList:true,characterData:true})});
      const SP=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=function(u){window.__voz.push('celular:'+u.lang+':'+u.text.slice(0,30));return SP(u)};
      const P=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.__voz.push('mp3:'+this.src.slice(-30));return P.call(this)}""")
    pg=c.new_page();E=[];pg.on('pageerror',lambda e:E.append(str(e)[:150]))
    pg.goto('http://localhost:8160/');pg.wait_for_timeout(2500)
    pg.evaluate("window.__lfGzAbre()")
    pg.wait_for_function("!!document.querySelector('#gw [data-gz=comeca]')",timeout=15000);pg.screenshot(path='es_1.png');pg.click('#gw [data-gz=comeca]')
    pg.wait_for_function("['cam','prep','teste','semcam'].includes(__LFGZ.Z.fase)||!!document.querySelector('#gw [data-gz=camsim]')",timeout=40000)
    if pg.locator('#gw [data-gz=camsim]').count():
        pg.wait_for_function("!!document.querySelector('#gw [data-gz=camsim]')&&!__LFGZ.Z.falando",timeout=40000);pg.screenshot(path='es_2.png');pg.click('#gw [data-gz=camsim]')
    pg.wait_for_function("__LFGZ.Z.fase==='teste'",timeout=60000);pg.wait_for_timeout(1500);pg.screenshot(path='es_3.png')
    for i in range(40):
        try: pg.wait_for_function("(__LFGZ.Z.fase!=='teste')||(!!document.querySelector('#gw [data-gz=sim]')&&!__LFGZ.Z.falando&&!__LFGZ.Z.troca&&!__LFGZ.Z.ocupado)",timeout=40000)
        except Exception: break
        if pg.evaluate("__LFGZ.Z.fase")!='teste': break
        pg.wait_for_timeout(200);pg.click('#gw [data-gz=nao]' if i in (2,3) else '#gw [data-gz=sim]')
    pg.wait_for_timeout(5000);pg.screenshot(path='es_4.png',full_page=False)
    vis=pg.evaluate("""(()=>{const T=[],w=document.createTreeWalker(document.getElementById('gw')||document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const e=n.parentElement,r=e.getBoundingClientRect();const t=n.textContent.trim();if(t.length>1&&r.width>0)T.push(t)}return T})()""")
    print('fase final',pg.evaluate("__LFGZ.Z.fase"))
    allt=pg.evaluate("window.__bal")+vis
    pt=[t for t in allt if re.search(r'[ãõç]|\b(você|não|seu|sua|óculos|lente de leitura|consigo|tela|olho)\b',t,re.I)]
    print('balões:',len(pg.evaluate("window.__bal")));print('PORTUGUÊS:',pt[:10])
    vz=pg.evaluate("window.__voz");print('voz:',vz[:3],'... total',len(vz),'celular',sum(1 for x in vz if x.startswith('celular')),'mp3',sum(1 for x in vz if x.startswith('mp3')))
    print('erros',E)
    B=pg.evaluate("window.__bal");json.dump(B,open(LG+'_bal.json','w'),ensure_ascii=False,indent=0)
    sv=pg.evaluate("(()=>{const m=window.__LFGZ&&1;return 0})()")
    b.close()
