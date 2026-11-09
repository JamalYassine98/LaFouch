exec(open('r.py').read().split('def nova(b):')[0])
G='''<svg viewBox="0 0 340 150" width="100%" style="display:block">
<defs><linearGradient id="fr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3036"/><stop offset=".45" stop-color="#151114"/><stop offset="1" stop-color="#241d21"/></linearGradient>
<linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".5" stop-color="#fff" stop-opacity=".0"/><stop offset=".52" stop-color="#e9eef3" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<path d="M4 40 L14 34 M336 40 L326 34" stroke="#151114" stroke-width="7" stroke-linecap="round"/>
<path fill="url(#fr)" fill-rule="evenodd" d="M14 30 Q14 22 24 22 H150 Q160 22 160 32 V92 Q160 132 120 132 H52 Q14 132 14 96 Z M30 40 Q30 36 34 36 H140 Q146 36 146 42 V92 Q146 118 118 118 H54 Q30 118 30 94 Z"/>
<path fill="url(#fr)" fill-rule="evenodd" d="M326 30 Q326 22 316 22 H190 Q180 22 180 32 V92 Q180 132 220 132 H288 Q326 132 326 96 Z M310 40 Q310 36 306 36 H200 Q194 36 194 42 V92 Q194 118 222 118 H286 Q310 118 310 94 Z"/>
<path d="M158 40 Q170 30 182 40 L182 50 Q170 42 158 50 Z" fill="url(#fr)"/>
<rect x="31" y="37" width="114" height="80" rx="20" fill="url(#gl)"/><rect x="195" y="37" width="114" height="80" rx="20" fill="url(#gl)"/>
<circle cx="24" cy="31" r="2.2" fill="#c9c2c6"/><circle cx="316" cy="31" r="2.2" fill="#c9c2c6"/>
<path d="M30 26 H150" stroke="#fff" stroke-opacity=".18" stroke-width="2" stroke-linecap="round"/><path d="M190 26 H310" stroke="#fff" stroke-opacity=".18" stroke-width="2" stroke-linecap="round"/>
</svg>'''
L4_old='<div style="position:relative;margin-top:16px;border:1px solid var(--ln);border-radius:20px;background:#fff;padding:22px 10px">'+G+'<span style="position:absolute;left:12%;top:38%;width:31%;text-align:center;font:500 13px/1.35 Georgia,serif;color:#222">O café da manhã fica pronto às sete.</span><span style="position:absolute;left:60%;top:38%;width:31%;text-align:center;font:500 13px/1.35 Georgia,serif;color:#222">Ligue amanhã para confirmar.</span></div>'

L4='<div class="bx" style="padding:22px 20px"><div style="font:400 19px/1.6 Georgia,serif;color:#222;filter:blur(BLpx)">O café da manhã fica pronto às sete. Depois, ligue para a farmácia e confirme o horário da entrega.</div></div>'
TELAS={
'5_resultado':BK+pr(3)+'<div class="eb">SEU GRAU PARA COMEÇAR</div><div style="font:700 64px Inter;margin:6px 0 4px">+1.75</div><p style="font-size:16px">Você leu bem a 58 cm. Para a sua idade costuma ficar entre +1.50 e +2.00.</p><button class="go">Ver óculos de leitura +1.75</button><button class="go o">Guardar meu grau</button><p style="font-size:13.5px;margin-top:16px">É uma indicação, não um exame. Procure um oftalmologista se tiver dor de cabeça, visão dupla ou se um olho enxerga bem pior que o outro.</p><div class="cc" style="font-size:16px">'+MIC+'<span>Pronto! O seu grau para começar é mais um e setenta e cinco.</span>'+SPK+'</div>',
'3_afaste':BK+pr(1)+'<div class="eb">PASSO 1 DE 3</div><h2>Afaste o celular devagar até ler sem esforço</h2><div class="bx" style="text-align:center"><div style="font:500 16px Georgia,serif;color:var(--tx)">O café da manhã fica pronto às sete.</div><div style="margin:18px auto 8px;height:6px;border-radius:9px;background:var(--ln);position:relative"><i style="position:absolute;left:0;top:0;bottom:0;width:58%;border-radius:9px;background:var(--ac)"></i></div><b style="font-size:22px;color:var(--tx)">58 cm</b></div><button class="go">Agora está nítido</button><button class="go o">Mesmo longe não consigo ler</button><div class="cc" style="font-size:16px">'+MIC+'<span>Afaste devagar. Quando ficar nítido, toque no botão de cima. Se nem com o braço esticado der para ler, toque no de baixo.</span>'+SPK+'</div>',
'3b_longe':BK+pr(2)+'<div class="eb">SEM PROBLEMA</div><h2>Vamos começar com um grau mais forte</h2><p style="font-size:16px">Quem não lê nem de longe costuma precisar de +2.50 ou mais. Começamos por aí.</p>'+L4.replace('BL','2.2')+'<div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px"><div class="gb2">−</div><div style="text-align:center"><div style="font:700 36px Inter">+2.50</div><div style="color:var(--mu);font-size:12.5px">grau</div></div><div class="gb2">+</div></div><button class="go">Leio bem</button><div class="cc" style="font-size:16px">'+MIC+'<span>Toque no mais até ficar nítido. Eu leio a frase em voz alta para você comparar.</span>'+SPK+'</div>',
'4_oculos':BK+pr(2)+'<div class="eb">PASSO 2 DE 3</div><h2>Confira se lê bem com este grau</h2><p style="font-size:16px">A tela mostra como fica a leitura com o grau calculado.</p>'+L4.replace('BL','0')+'<div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px"><div class="gb2">−</div><div style="text-align:center"><div style="font:700 36px Inter">+1.75</div><div style="color:var(--mu);font-size:12.5px">grau calculado</div></div><div class="gb2">+</div></div><button class="go">Leio bem</button><div class="cc" style="font-size:16px">'+MIC+'<span>Pela distância, o seu grau é +1.75. Se ainda estiver difícil, toque no mais.</span>'+SPK+'</div>'}
def nova(b):
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
    pg.goto('http://localhost:8768/');pg.wait_for_timeout(2600);pg.add_style_tag(content=CSS+'''
.gzb{display:flex;align-items:center;gap:12px;width:100%;margin-top:14px;padding:14px 16px;border:1.5px solid var(--ac);border-radius:16px;background:var(--pn);color:var(--ac);font:700 17px Inter;text-align:left}
.gzb small{display:block;font:500 14px Inter;color:var(--mu);margin-top:2px}.gzb i{margin-left:auto;font-style:normal;font-size:24px}''');return pg
def peca(b,html,out):
    pg=nova(b);pg.evaluate("document.querySelector(\"[data-open='GR3350']\").click()");pg.wait_for_timeout(1800)
    pg.evaluate("h=>{var d=document.querySelector('#layer .dgr');d.insertAdjacentHTML('afterend',h);var s=document.querySelector('#layer .scrim');s.scrollTop=document.querySelector('#layer .cthl').getBoundingClientRect().top+s.scrollTop-300}",html)
    pg.wait_for_timeout(500);pg.screenshot(path=out)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    peca(b,'<button class=gzb type=button><span>Não sei o meu grau<small>Descubra em 1 minuto, com voz</small></span><i>›</i></button>','2a.png')
    for k,h in TELAS.items():
        if not h: continue
        pg=nova(b);pg.evaluate("h=>{document.body.insertAdjacentHTML('beforeend','<div id=gw>'+h+'</div>')}",h);pg.wait_for_timeout(400);pg.screenshot(path=k+'.png')
