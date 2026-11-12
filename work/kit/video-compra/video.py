import sys,os,glob,shutil,subprocess;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
from playwright.sync_api import sync_playwright
kit.prep_site();kit.serve(kit.SITE,kit.PS)
TAP="""(sel)=>{const e=typeof sel==='string'?document.querySelector(sel):sel;if(!e)return;const r=e.getBoundingClientRect();let d=document.getElementById('tapd');if(!d){d=document.createElement('div');d.id='tapd';d.style.cssText='position:fixed;z-index:999999;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(141,58,105,.35);border:2px solid rgba(141,58,105,.8);pointer-events:none;transition:transform .35s ease,opacity .35s ease';document.body.appendChild(d)}d.style.left=(r.left+r.width/2)+'px';d.style.top=(r.top+r.height/2)+'px';d.style.opacity='1';d.style.transform='scale(.6)';requestAnimationFrame(()=>{d.style.transform='scale(1.2)'});setTimeout(()=>{d.style.opacity='0'},420)}"""
J=lambda f:open('/tmp/k/'+f).read()
vd='/tmp/k/vid';shutil.rmtree(vd,ignore_errors=True);os.makedirs(vd)
with sync_playwright() as pw:
    b,c0=kit.ctx(pw);b.close()
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    c=b.new_context(bypass_csp=True,viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',record_video_dir=vd,record_video_size={'width':780,'height':1688})
    c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    c.add_init_script("localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_conta',%r);localStorage.setItem('lf_auth',%r);try{sessionStorage.setItem('lf_ni','1')}catch(e){}"%(kit.CONTA,kit.AUTH))
    pg=c.new_page();w=pg.wait_for_timeout
    def tap(sel,click=None):
        pg.evaluate(TAP,sel) if isinstance(sel,str) else None; w(450)
    pg.goto('http://localhost:8811/?v=1');w(1600)
    pg.evaluate("document.querySelector('[data-open=\"SL2210\"]').click()");w(900)
    [e for e in pg.query_selector_all('button') if e.is_visible() and 'Comprar' in (e.inner_text() or '')][0].click();w(700)
    pg.click('text=Finalizar compra');w(900)
    pg.evaluate(J('cart.js'));w(2600)
    pg.evaluate(TAP,'.capl');w(1400)
    btn=[e for e in pg.query_selector_all('button,a') if e.is_visible() and 'Prosseguir' in (e.inner_text() or '')][0]
    pg.evaluate("e=>e.setAttribute('id','prs')",btn);pg.evaluate(TAP,'#prs');w(500);btn.click();w(1200)
    pg.evaluate(TAP,'button.cfo[data-ent=delivery]');w(400);pg.click('button.cfo[data-ent="delivery"]');w(900)
    pg.evaluate(J('vid_ent.js'));w(1500)
    kit.rolar(pg,330);w(1300)
    pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer button[data-g=t]')][1];t.id='tb1'}");pg.evaluate(TAP,'#tb1');w(300);pg.evaluate("window.__sel(1)");w(2200)
    fb=[e for e in pg.query_selector_all('button,a') if e.is_visible() and 'Forma de pagamento' in (e.inner_text() or '')][0]
    pg.evaluate("e=>e.setAttribute('id','fpg')",fb);pg.evaluate(TAP,'#fpg');w(500);fb.click();w(1300)
    pg.evaluate(J('vid_pay.js'));w(1800)
    pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer button.cfo')][1];t.id='pt1'}");pg.evaluate(TAP,'#pt1');w(300);pg.evaluate("window.__pay(1)");w(2000)
    cb=[e for e in pg.query_selector_all('button,a,label') if e.is_visible() and 'Confirmar e pagar' in (e.inner_text() or '')]
    if cb: pg.evaluate("e=>{e.id='cfp';e.style.opacity='1';e.style.background='#1f8f4e'}",cb[0]);pg.evaluate(TAP,'#cfp');w(700)
    def tela(f):
        pg.evaluate("h=>{const L=document.querySelector('#layer');L.innerHTML='<div style=\"position:fixed;inset:0;overflow:auto;background:var(--bg);padding-top:76px;z-index:50\">'+h+'</div>';window.scrollTo(0,0)}",J(f))
    tela('v_novo1.html');w(3200)
    pg.evaluate("()=>{const b=[...document.querySelectorAll('#pz .cp')];b.forEach(x=>x.id='');b[0].id='cp0';b[1].id='cp1'}")
    for i in (0,1):
        pg.evaluate(TAP,'#cp%d'%i);pg.evaluate("i=>{const b=document.getElementById('cp'+i);b.textContent='Copiado ✓';b.style.background='#14803f'}",i);w(1300)
    pg.evaluate("()=>{document.querySelector('#pz .bt').id='env'}");pg.evaluate(TAP,'#env');w(900)
    tela('v_novo2.html');w(3500)
    v=pg.video.path();c.close();b.close()
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',v,'-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-vf','crop=iw/2:ih/2:0:0,scale=780:1688:flags=lanczos','-movflags','+faststart','/home/claude/lafouch/work/s190/fluxo_compra.mp4'])
print(os.path.getsize('/home/claude/lafouch/work/s190/fluxo_compra.mp4'))
