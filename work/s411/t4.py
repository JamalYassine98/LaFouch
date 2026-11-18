# tempos reais de abrir/fechar (eventos de transição/animação disparados pelo toque)
exec(open('base.py').read())
s=serve('/home/claude/catalogo',8901);time.sleep(1)
ARM="""()=>{window.__ev=[];window.__t0=performance.now();window.__wa={};(function p(){for(const a of document.getAnimations()){const t=a.effect&&a.effect.target;const k=t?((t.id?"#"+t.id:t.tagName.toLowerCase())+"."+[...(t.classList||[])].slice(0,2).join(".")):"?";const d=a.effect.getComputedTiming();window.__wa[k]=Math.max(window.__wa[k]||0,Math.round((d.delay||0)+(d.activeDuration||0)))}if(performance.now()-__t0<1100)requestAnimationFrame(p)})();for(const k of ['transitionrun','transitionend','animationstart','animationend']){if(!window['__h'+k]){window['__h'+k]=1;document.addEventListener(k,e=>{if(!window.__t0)return;const t=e.target;window.__ev.push([k,Math.round(performance.now()-__t0),(t.id?'#'+t.id:t.tagName.toLowerCase())+'.'+[...(t.classList||[])].slice(0,2).join('.'),e.propertyName||e.animationName||''])},true)}}}"""
def mede(pg,acao,ms=1200):
    pg.evaluate(ARM);acao();pg.wait_for_timeout(ms);ev=pg.evaluate("()=>window.__ev")
    fim=max([e[1] for e in ev if e[0] in('transitionend','animationend')]+[0]);ini=[e for e in ev if e[0] in('transitionrun','animationstart')]
    alvos=sorted(set(e[2] for e in ini))[:6]
    wa=pg.evaluate('()=>window.__wa');wa={k:v for k,v in wa.items() if 'ib' not in k}
    return {'transicoes_ate_ms':fim,'onde':alvos,'animacoes_js':wa}
try:
  with sync_playwright() as pw:
    R={}
    b,pg,er=abre(pw,'http://localhost:8901/')
    R['sacola_abre']=mede(pg,lambda:pg.tap('#bagbtn'))
    R['sacola_fecha']=mede(pg,lambda:pg.keyboard.press('Escape'))
    pg.wait_for_timeout(500)
    R['conta_abre']=mede(pg,lambda:pg.tap('#contabtn'))
    R['conta_fecha']=mede(pg,lambda:pg.keyboard.press('Escape'))
    pg.wait_for_timeout(500)
    R['busca_abre']=mede(pg,lambda:pg.tap('#sbtn'))
    n0=pg.evaluate("()=>document.getAnimations().length")
    R['busca_fecha']=mede(pg,lambda:pg.touchscreen.tap(195,700))
    R['busca_fecha']['animacoes_no_catalogo_depois']=pg.evaluate("()=>document.getAnimations().length")
    pg.wait_for_timeout(500)
    R['menu_abre']=mede(pg,lambda:pg.tap('#mnb'))
    R['menu_fecha']=mede(pg,lambda:pg.locator('#drw .ib:has-text("Fechar"), #drw [aria-label=Fechar]').first.tap())
    # 22: no catálogo, fechar a busca não pode refazer as animações dos cartões
    pg.wait_for_timeout(600);pg.evaluate('()=>scrollTo(0,0)');pg.wait_for_timeout(400);pg.tap('#mnb');pg.wait_for_timeout(900);pg.locator('#drw >> text=Armações').first.tap();pg.wait_for_timeout(1800)
    pg.tap('#sbtn');pg.wait_for_timeout(900);R['catalogo_fecha_busca']=mede(pg,lambda:pg.touchscreen.tap(195,780))
    R['catalogo_fecha_busca']['cartoes_animados']=sum(1 for x in pg.evaluate("()=>window.__ev") if x[0]=='animationstart' and 'card' in x[2])
    for k,v in R.items():print(k,v)
    print('erros',er[:3]);b.close()
finally: s.terminate()
