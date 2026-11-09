exec(open('r.py').read().split('def nova(b):')[0])
import glob,subprocess
POV_CSS='''
.pv{position:relative;margin-top:14px;width:354px;height:300px;border-radius:22px;overflow:hidden;background:#fbfaf7;border:1px solid var(--ln)}
.pv .tx{position:absolute;inset:0;padding:34px 22px;font:400 18px/1.6 Georgia,serif;color:#222}
.pv .fora{filter:blur(3.5px);opacity:.85}
.pv .dentro{clip-path:url(#lentes);transition:filter .5s;transform:scale(1.05);transform-origin:50% 45%}
.pv .arm{position:absolute;left:0;top:0;width:354px;height:300px;pointer-events:none;transition:transform 1.2s cubic-bezier(.2,.8,.2,1),opacity .9s}
.pv.longe .arm{transform:translateY(120px) scale(1.35);opacity:0}.pv.longe .dentro{clip-path:inset(0 0 100% 0)}
'''
P="M14 52 Q14 28 40 26 L150 22 Q172 22 170 48 L166 196 Q160 268 96 270 L74 270 Q18 266 14 200 Z M340 52 Q340 28 314 26 L204 22 Q182 22 184 48 L188 196 Q194 268 258 270 L280 270 Q336 266 340 200 Z"
TXT='O café da manhã fica pronto às sete. Depois, ligue para a farmácia e confirme o horário da entrega de amanhã. Leve a receita e o documento.'
SV='<svg class="arm" viewBox="0 0 354 300"><defs><filter id="b1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter><filter id="b2"><feGaussianBlur stdDeviation="3"/></filter>'+\
 '<linearGradient id="rf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#9fb7c9" stop-opacity=".08"/></linearGradient>'+\
 '<mask id="fo"><rect width="354" height="300" fill="#fff"/><path d="'+P+'" fill="#000"/></mask></defs>'+\
 '<rect width="354" height="300" fill="#1a1316" opacity=".22" mask="url(#fo)"/>'+\
 '<path d="'+P+'" fill="none" stroke="#1a1316" stroke-width="22" opacity=".92" filter="url(#b1)"/>'+\
 '<path d="M168 40 Q177 30 186 40" fill="none" stroke="#1a1316" stroke-width="26" filter="url(#b1)"/>'+\
 '<path d="'+P+'" fill="url(#rf)"/>'+\
 '<path d="M40 44 Q90 30 140 38" stroke="#fff" stroke-opacity=".5" stroke-width="4" fill="none" filter="url(#b2)"/><path d="M214 40 Q262 30 314 44" stroke="#fff" stroke-opacity=".4" stroke-width="4" fill="none" filter="url(#b2)"/></svg>'
HTML=BK+pr(2)+'<div class="eb">PASSO 2 DE 3 · ÓCULOS VIRTUAL</div><h2>Como se você estivesse usando o óculos</h2>'+\
 '<div class="pv longe" id="pv"><svg width="0" height="0" style="position:absolute"><defs><clipPath id="lentes"><path d="'+P+'"/></clipPath></defs></svg>'+\
 '<div class="tx fora">'+TXT+'</div><div class="tx dentro" id="dn" style="filter:blur(3px)">'+TXT+'</div>'+SV+'</div>'+\
 '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px"><div class="gb2" id="bm">−</div><div style="text-align:center"><div style="font:700 36px Inter" id="gv">+1.00</div><div style="color:var(--mu);font-size:12.5px">grau do óculos virtual</div></div><div class="gb2" id="bp">+</div></div><button class="go" id="ok">Agora leio bem</button>'+\
 '<div class="cc" style="font-size:16px" id="cc">'+MIC+'<span id="ct">Vou colocar o óculos em você. Olhe o texto através das lentes.</span>'+SPK+'</div>'
JS='''()=>{const $=i=>document.getElementById(i);let g=1;const B={1:3,1.25:2,1.5:1.1,1.75:0};
 const tap=e=>{e.style.transform='scale(.9)';e.style.background='#f3e1ec';setTimeout(()=>{e.style.transform='';e.style.background=''},200)};
 const mais=()=>{tap($('bp'));g+=.25;$('gv').textContent='+'+g.toFixed(2);$('dn').style.filter='blur('+B[g]+'px)'};
 setTimeout(()=>$('pv').classList.remove('longe'),900);
 setTimeout(()=>$('ct').textContent='Toque no mais até as letras ficarem nítidas dentro das lentes.',3400);
 setTimeout(mais,5200);setTimeout(mais,6800);setTimeout(mais,8400);
 setTimeout(()=>{$('ct').textContent='Ficou nítido? Toque em “Agora leio bem”.'},9400);
 setTimeout(()=>tap($('ok')),11200)}'''
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR',record_video_dir='pv',record_video_size={'width':390,'height':844})
    pg=ctx.new_page();pg.goto('http://localhost:8768/');pg.wait_for_timeout(2500);pg.add_style_tag(content=CSS+POV_CSS)
    pg.evaluate("h=>{document.body.insertAdjacentHTML('beforeend','<div id=gw>'+h+'</div>')}",HTML);pg.wait_for_timeout(300)
    t0=pg.evaluate("performance.now()");pg.evaluate(JS);pg.wait_for_timeout(12500);ctx.close()
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR');pg.goto('http://localhost:8768/');pg.wait_for_timeout(2500);pg.add_style_tag(content=CSS+POV_CSS)
    pg.evaluate("h=>{document.body.insertAdjacentHTML('beforeend','<div id=gw>'+h+'</div>')}",HTML);pg.evaluate("document.getElementById('pv').classList.remove('longe')");pg.wait_for_timeout(1400);pg.screenshot(path='pov_100.png')
    pg.evaluate("()=>{document.getElementById('dn').style.filter='none';document.getElementById('gv').textContent='+1.75';document.getElementById('ct').textContent='Ficou nítido? Toque em “Agora leio bem”.'}");pg.wait_for_timeout(700);pg.screenshot(path='pov_175.png')
f=glob.glob('pv/*.webm')[0]
subprocess.run(['ffmpeg','-loglevel','error','-y','-ss','2.9','-i',f,'-vf','fps=30,scale=780:1688:flags=lanczos','-c:v','libx264','-preset','veryfast','-pix_fmt','yuv420p','S41_calcando.mp4'],check=True)
