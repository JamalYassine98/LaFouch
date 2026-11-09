from playwright.sync_api import sync_playwright
CSS='''
.gz{display:flex;gap:12px;align-items:center;width:100%;padding:12px 14px;margin:4px 0 14px;border:1px solid var(--ln);border-radius:18px;background:var(--pn);text-align:left;color:inherit}
.gz .gi{flex:none;width:58px;height:40px;background:#fff url(/arm.jpg) center/150% no-repeat;border-radius:10px;mix-blend-mode:multiply}
.gz small{display:block;font:700 10.5px Inter,system-ui,sans-serif;letter-spacing:.13em;color:var(--ac)}
.gz b{display:block;font:600 16px Fraunces,Georgia,serif;color:var(--tx);margin-top:2px}.gz i{margin-left:auto;font-style:normal;color:var(--ac);font-size:22px}
.gzl{display:inline-block;margin-top:10px;color:var(--ac);font-weight:600;font-size:14.5px}
#gw{position:fixed;inset:var(--hth,74px) 0 0 0;z-index:40;background:var(--bg);padding:14px 18px 24px;overflow:hidden;font-family:Inter,system-ui,sans-serif;color:var(--tx)}
#gw .bk{color:var(--ac);font-weight:600;font-size:15px;display:flex;align-items:center;gap:6px}
#gw .pr{display:flex;gap:6px;margin:12px 0 14px}#gw .pr i{flex:1;height:4px;border-radius:9px;background:var(--ln)}#gw .pr i.on{background:var(--ac)}
#gw .eb{font:700 11px Inter;letter-spacing:.14em;color:var(--ac)}#gw h2{font:600 25px/1.15 Fraunces,Georgia,serif;margin:6px 0 8px;color:var(--tx)}
#gw p{color:var(--mu);font-size:15px;line-height:1.45;margin:0}
#gw .bx{border:1px solid var(--ln);border-radius:22px;background:var(--pn);padding:18px;margin-top:16px}
#gw .go{display:flex;align-items:center;justify-content:center;width:100%;border:0;border-radius:999px;padding:16px;font:700 17px Inter;color:#fff;background:var(--ac);margin-top:14px}
#gw .go.o{background:transparent;color:var(--ac);border:1.5px solid var(--ac)}
#gw .cc{position:absolute;left:14px;right:14px;bottom:18px;display:flex;gap:12px;align-items:center;background:var(--tx);color:var(--bg);border-radius:16px;padding:12px 14px;font-size:15px;line-height:1.4}
#gw .cc svg{flex:none}#gw .mu{margin-left:auto;flex:none;opacity:.7}
.ln{position:relative;width:100%;aspect-ratio:3/2;background:#fff url(/arm.jpg) center/contain no-repeat;border-radius:18px;border:1px solid var(--ln)}
.ln span{position:absolute;top:43%;width:21%;height:20%;display:grid;place-items:center;text-align:center;background:#fff;border-radius:12px;font:500 11.5px/1.3 Georgia,serif;color:#222}
.gb2{width:64px;height:64px;border-radius:50%;border:1.5px solid var(--ln);background:var(--pn);display:grid;place-items:center;font:500 30px Inter;color:var(--tx)}
'''
MIC='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/></svg>'
SPK='<svg class="mu" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>'
BK='<div class="bk"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>Leitura</div>'
def pr(n):return '<div class="pr">'+''.join('<i class="on"></i>' if i<n else '<i></i>' for i in range(3))+'</div>'
TELAS={
'3_afaste':BK+pr(1)+'<div class="eb">PASSO 1 DE 3</div><h2>Afaste o celular devagar até ler sem esforço</h2><p>Sem óculos de leitura. A câmera mede a distância pelo seu rosto; nada é gravado.</p><div class="bx" style="text-align:center"><div style="font:500 16px Georgia,serif;color:var(--tx)">O café da manhã fica pronto às sete.</div><div style="margin:18px auto 8px;height:6px;border-radius:9px;background:var(--ln);position:relative"><i style="position:absolute;left:0;top:0;bottom:0;width:58%;border-radius:9px;background:var(--ac)"></i></div><b style="font-size:22px;color:var(--tx)">58 cm</b></div><button class="go">Agora está nítido</button><div class="cc">'+MIC+'<span>Afaste o celular devagar. Quando as letras ficarem nítidas, toque no botão.</span>'+SPK+'</div>',
'4_oculos':BK+pr(2)+'<div class="eb">PASSO 2 DE 3</div><h2>Veja se lê bem com este grau</h2><div class="ln" style="margin-top:12px"><span style="left:22%">O café da manhã fica pronto às sete.</span><span style="left:57%">Ligue amanhã para confirmar.</span></div><div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px"><div class="gb2">−</div><div style="text-align:center"><div style="font:700 36px Inter">+1.75</div><div style="color:var(--mu);font-size:12.5px">grau calculado</div></div><div class="gb2">+</div></div><button class="go">Leio bem</button><div class="cc">'+MIC+'<span>Pela distância, o seu grau é +1.75. Se ainda estiver difícil, toque no mais.</span>'+SPK+'</div>',
'5_resultado':BK+pr(3)+'<div class="eb">SEU GRAU PARA COMEÇAR</div><div style="font:700 64px Inter;margin:6px 0 4px">+1.75</div><p>Você leu bem a 58 cm. Para a sua idade costuma ficar entre +1.50 e +2.00.</p><button class="go">Ver óculos de leitura +1.75</button><button class="go o">Guardar meu grau</button><p style="font-size:13px;margin-top:16px">É uma indicação, não um exame. Procure um oftalmologista se tiver dor de cabeça, visão dupla ou se um olho enxerga bem pior que o outro.</p>',
}
def nova(b):
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
    pg.goto('http://localhost:8768/');pg.wait_for_timeout(2600);pg.add_style_tag(content=CSS);return pg
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=nova(b)
    pg.evaluate("[...document.querySelectorAll('#home button,#home a')].find(e=>e.textContent.trim()=='Leitura').click()");pg.wait_for_timeout(1800)
    pg.evaluate("""()=>{var g=document.getElementById('grid');g.insertAdjacentHTML('beforebegin','<button class=gz type=button><span class=gi></span><span><small>1 MINUTO · COM VOZ</small><b>Não sabe o seu grau?</b></span><i>›</i></button>')}""")
    pg.wait_for_timeout(400);pg.screenshot(path='1_leitura.png')
    pg=nova(b);pg.evaluate("document.querySelector(\"[data-open='GR3350']\").click()");pg.wait_for_timeout(1800)
    pg.evaluate("()=>{var d=document.querySelector('#layer .dgr');d.insertAdjacentHTML('afterend','<a class=gzl>Não sei meu grau ›</a>');var s=document.querySelector('#layer .scrim');s.scrollTop=document.querySelector('#layer .cthl').getBoundingClientRect().top+s.scrollTop-320}")
    pg.wait_for_timeout(500);pg.screenshot(path='2_peca.png')
    for k,h in TELAS.items():
        pg=nova(b);pg.evaluate("h=>{document.body.insertAdjacentHTML('beforeend','<div id=gw>'+h+'</div>')}",h);pg.wait_for_timeout(400);pg.screenshot(path=k+'.png')
