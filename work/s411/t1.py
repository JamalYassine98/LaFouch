# site: cópias do painel (16/19/20/22 e conta/sacola)
exec(open('base.py').read())
s=serve('/home/claude/catalogo',8901);time.sleep(1)
AM="""(ms)=>new Promise(r=>{const o=[];const t0=performance.now();(function f(){const g=document.getElementById('lfGhost');const L=document.getElementById('layer');const p=L&&L.firstElementChild;
 o.push([Math.round(performance.now()-t0),g?g.childElementCount:0,L?getComputedStyle(L).opacity:'',p?getComputedStyle(p).transform+'|'+getComputedStyle(p).opacity:'']);if(performance.now()-t0<ms)requestAnimationFrame(f);else r(o)})()})"""
try:
  with sync_playwright() as pw:
    R={}
    # A) sacola aberta -> menu -> Minha conta : cópias
    b,pg,er=abre(pw,'http://localhost:8901/')
    pg.tap('#bagbtn');pg.wait_for_timeout(900);pg.tap('#mnb');pg.wait_for_timeout(700)
    it=pg.locator('#drw >> text=Minha conta').first
    pr=pg.evaluate("()=>{window.__g=[];const t0=performance.now();(function f(){const g=document.getElementById('lfGhost');__g.push(g?g.childElementCount:0);if(performance.now()-t0<1200)requestAnimationFrame(f)})()}")
    it.tap();pg.wait_for_timeout(1300);g=pg.evaluate("()=>window.__g");R['copias_sacola_menu_conta']=max(g) if g else None
    # conta aberta -> menu -> sacola
    pg.tap('#mnb');pg.wait_for_timeout(700);pg.evaluate("()=>{window.__g=[];const t0=performance.now();(function f(){const g=document.getElementById('lfGhost');__g.push(g?g.childElementCount:0);if(performance.now()-t0<1200)requestAnimationFrame(f)})()}")
    sac=pg.locator('#drw >> text=/Carrinho|Sacola/').first
    try: sac.tap(timeout=3000);pg.wait_for_timeout(1300);g=pg.evaluate("()=>window.__g");R['copias_conta_menu_sacola']=max(g)
    except Exception as e: R['copias_conta_menu_sacola']='sem item no menu'
    print('erros',er[:3]);b.close()
    # B) sacola abre com movimento? (16)
    b,pg,er=abre(pw,'http://localhost:8901/')
    pg.evaluate("()=>{window.__s=[];const t0=performance.now();(function f(){const L=document.getElementById('layer');const p=L&&L.querySelector('.panel,.sheet,.pg,.scrim>*')||L;__s.push(L?getComputedStyle(L).opacity+'|'+(p?getComputedStyle(p).transform:''):'-');if(performance.now()-t0<700)requestAnimationFrame(f)})()}")
    pg.tap('#bagbtn');pg.wait_for_timeout(800);st=pg.evaluate("()=>window.__s");R['sacola_abre_estados_diferentes']=len(set(st))
    pg.screenshot(path=T+'B_sacola.png')
    b.close()
    # mesma medida para Minha conta (referência)
    b,pg,er=abre(pw,'http://localhost:8901/')
    pg.evaluate("()=>{window.__s=[];const t0=performance.now();(function f(){const L=document.getElementById('layer');const p=L&&L.querySelector('.panel,.sheet,.pg,.scrim>*')||L;__s.push(L?getComputedStyle(L).opacity+'|'+(p?getComputedStyle(p).transform:''):'-');if(performance.now()-t0<700)requestAnimationFrame(f)})()}")
    pg.tap('#contabtn');pg.wait_for_timeout(800);st=pg.evaluate("()=>window.__s");R['conta_abre_estados_diferentes']=len(set(st));b.close()
    print(json.dumps(R,ensure_ascii=False))
finally: s.terminate()
