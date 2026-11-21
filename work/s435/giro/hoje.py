import os,sys;os.chdir('/home/claude/lafouch/work/estudio-camera')
exec(open('cam.py').read().split("if __name__")[0])
FAKE2=FAKE.replace("x.drawImage(img,960-w/2+(window.__fkDx||0),560-h/2,w,h)","x.save();x.translate(960,560);x.rotate((window.__fkRot||0)*Math.PI/180);x.translate(-960,-560);x.drawImage(img,960-w/2+(window.__fkDx||0),560-h/2,w,h);x.restore()")
def abre2(pw,W,H,esc=True):
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
  c=b.new_context(bypass_csp=True,viewport={'width':W,'height':H},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark' if esc else 'light',service_workers='block')
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') or r.request.url.startswith('http://127.') else r.abort())
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.add_init_script(FAKE2);c.add_init_script(base_app.script())
  pg=c.new_page();pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(1000)
  return b,pg
if __name__=='__main__':
 with sync_playwright() as pw:
  b,pg=abre2(pw,844,390);pg.evaluate("()=>window.__fkRot=0")
  pg.evaluate("()=>__LF.setView('estoque')");pg.wait_for_timeout(800)
  pg.evaluate("()=>{const i=[...document.querySelectorAll('.pcard img')].find(x=>/^data:image\\/svg/.test(x.src));window.__fkImg=i&&i.src}")
  pg.evaluate("()=>__LF.inicioGo('est')");pg.wait_for_timeout(1500)
  print(pg.evaluate("()=>[...document.querySelectorAll('[data-e],[data-i]')].slice(0,8).map(b=>(b.dataset.e||'i'+b.dataset.i)+':'+b.textContent.trim().slice(0,30))"))
  pg.evaluate("()=>{const b=document.querySelector('[data-i=\"0\"]')||document.querySelector('[data-e=sessao]');b&&b.click()}");pg.wait_for_timeout(3000)
  print(pg.evaluate("()=>{const o=document.getElementById('estCam');return [o&&o.dataset.modo,[...o.querySelectorAll('button')].map(b=>b.className+':'+b.textContent.trim().slice(0,20))]}"))
  pg.wait_for_timeout(3000)
  print(pg.evaluate("()=>document.getElementById('estCam').dataset.modo"))
  print(pg.evaluate("()=>{const e=[...document.querySelectorAll('#estCam *')].find(x=>x.children.length==0&&/Celular deitado/.test(x.textContent)&&x.textContent.length<40);let p=e;const o=[];for(let i=0;i<4&&p;i++){o.push(p.tagName+'.'+p.className);p=p.parentElement}return [o,e.parentElement.outerHTML.slice(0,300),(document.querySelector('#estCam .ecFrase')||{outerHTML:''}).outerHTML.slice(0,300)]}"))
  pg.screenshot(path='/tmp/g_hoje.png');b.close()
