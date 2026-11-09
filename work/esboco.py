from playwright.sync_api import sync_playwright
FIX1 = ".bar #contabtn svg{width:15px!important;height:18px!important;flex:none}"
FIX2 = """()=>{const W=new Set(['DESTAQUE DA SEMANA','Delivery','Delivery todo o Paraguai','NOVO','Para lojistas','Protegido pelo reCAPTCHA','Termos','Privacidade','Chegou esta semana','Esgotado','UV400']);
 let n=0; document.querySelectorAll('body *').forEach(e=>{const t=(e.childNodes.length&&[...e.childNodes].filter(c=>c.nodeType==3).map(c=>c.textContent).join('').trim())||'';
  if(!t)return; const cs=getComputedStyle(e); const fs=parseFloat(cs.fontSize); const z=parseFloat(getComputedStyle(document.body).zoom)||1; const eff=fs*z;
  if(eff<11.5 && eff>6 && [...W].some(w=>t.startsWith(w))){e.style.fontSize=(11.5/z)+'px';n++}}); return n}"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for (w,h,tag) in [(1366,768,'pc'),(390,844,'cel'),(1920,1080,'pc2')]:
        pg=b.new_page(viewport={'width':w,'height':h},device_scale_factor=2 if w<500 else 1); pg.goto('http://localhost:8765/index.html'); pg.wait_for_timeout(3000)
        pg.screenshot(path=f'esb_{tag}_antes.png')
        pg.add_style_tag(content=FIX1); n=pg.evaluate(FIX2); pg.wait_for_timeout(400)
        pg.screenshot(path=f'esb_{tag}_depois.png'); print(tag,n)
