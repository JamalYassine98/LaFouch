# S262 · câmera do Estúdio AUTOMÁTICA: somem da tela os controles técnicos (gráfico de luz, Medir fundo, 2s, Peaking, ISO/velocidade/branco/foco/exposição, lente, 4 luzinhas);
# fica a peça, UMA frase em português claro e o disparo. Nada é apagado do app: tudo vai para "Controles manuais".  python3 gera.py
import os, subprocess, sys, time
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
V, G = '#b42318', '#1f8a4c'
subprocess.run('bash /tmp/srv.sh >/dev/null 2>&1', shell=True)
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8897', '-d', A + '../../www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
RAW = 'http://localhost:8811/s260raw/'
FUNDO = "(u)=>{const v=document.querySelector('#ecV');v.style.opacity=0;v.parentElement.style.background='#cfcbd6 url('+u+') center/cover no-repeat'}"
AUTO = """()=>{const st=document.createElement('style');st.textContent='#ecFundo,#ecT2,#ecPk,#ecHist,#ecMsg,#ecChips,#ecPro,#ecDial,#ecAuto,#ecPkC{display:none!important}#ecLens{visibility:hidden!important}.ecTop{justify-content:space-between}#s262m{margin-left:auto;width:44px;height:36px;border-radius:999px;display:grid;place-items:center;color:#fff;border:1px solid rgba(255,255,255,.3)}#s262f{position:absolute;left:18px;right:18px;bottom:18px;display:flex;align-items:center;gap:10px;justify-content:center;background:rgba(20,12,18,.62);color:#fff;border-radius:999px;padding:12px 18px;font:500 17px Georgia,serif;z-index:5}#s262f i{width:9px;height:9px;border-radius:9px;flex:none}';document.head.appendChild(st);
 document.querySelector('.ecTop').insertAdjacentHTML('beforeend','<span id="s262m" role="button" aria-label="Controles manuais"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg></span>');
 document.querySelector('.ecVf').insertAdjacentHTML('beforeend','<div id="s262f"><i></i><span></span></div>');
 window.s262=(t,cor)=>{document.querySelector('#s262f span').textContent=t;document.querySelector('#s262f i').style.background=cor;document.querySelectorAll('.ecGd i').forEach(x=>x.style.borderColor=cor==='#3ddc8c'?'#3ddc8c':'#fff')}}"""
MANUAL = """()=>{document.body.insertAdjacentHTML('beforeend','<div style="position:fixed;inset:0;z-index:99998;background:rgba(10,6,10,.5)"></div><div style="position:fixed;left:0;right:0;bottom:0;z-index:99999;background:var(--panel,#fff);color:var(--fg,#2a1f27);border-radius:26px 26px 0 0;padding:14px 20px 26px;font-family:Inter,system-ui,sans-serif"><i style="display:block;width:38px;height:4px;border-radius:4px;background:color-mix(in srgb,currentColor 20%,transparent);margin:0 auto 14px"></i><div style="font:500 22px Georgia,serif">Controles manuais</div><div style="font-size:13.5px;opacity:.7;margin:4px 0 12px">O app cuida de tudo sozinho. Mexa só se quiser.</div>'+[['Medir o fundo','automático na primeira peça'],['Espera de 2 s antes da foto','desligada'],['Contorno do que está nítido','desligado'],['Gráfico de luz','escondido'],['Sensibilidade, velocidade, branco, foco, exposição','automáticos'],['Lente 1× ou 2×','automática']].map(x=>'<div style="display:flex;align-items:center;min-height:50px;border-top:1px solid color-mix(in srgb,currentColor 12%,transparent);font-size:15px"><span style="flex:1;padding-right:10px">'+x[0]+'</span><span style="font-size:13px;opacity:.6;text-align:right">'+x[1]+'</span><span style="opacity:.4;font-size:18px;padding-left:8px">›</span></div>').join('')+'</div>')}"""
def shot(pg, larg=330):
    pg.screenshot(path='/tmp/s262.png'); x = Image.open('/tmp/s262.png').convert('RGB'); return x.resize((larg, int(x.height * larg / x.width)))
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'])
    c = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, service_workers='block', permissions=['camera']); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg = c.new_page(); pg.on('dialog', lambda d: d.dismiss()); erros = []; pg.on('pageerror', lambda e: erros.append(str(e)[:90])); pg.goto('http://localhost:8897/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(900)
    pg.evaluate("()=>{const t=[...document.querySelectorAll('#v-inicio .tl')].find(e=>/Estúdio/.test(e.innerText));t.click()}"); pg.wait_for_timeout(1200); pg.evaluate("document.querySelector('.estOv [data-e=sessao]').click()"); pg.wait_for_timeout(2800)
    pg.evaluate(FUNDO, RAW + 'frente.jpg'); pg.wait_for_timeout(500); q = [('HOJE · 22 coisas na tela', V, shot(pg))]
    print('controles visíveis hoje:', pg.evaluate("()=>[...document.querySelectorAll('#estCam button,#estCam input,#ecHist,#ecMsg,#ecChips span,.ecTag,#ecAuto')].filter(e=>e.getClientRects().length).length"))
    pg.evaluate(AUTO); pg.evaluate("window.s262('Falta luz: acenda a luz da caixa','#f0b341')"); pg.wait_for_timeout(400); q.append(('PROPOSTA · diz o que falta', G, shot(pg)))
    print('controles visíveis na proposta:', pg.evaluate("()=>[...document.querySelectorAll('#estCam button,#estCam input,#ecHist,#ecMsg,#ecChips span,.ecTag,#ecAuto,#s262m,#s262f')].filter(e=>e.getClientRects().length).length"))
    pg.evaluate("window.s262('Tudo certo · pode fotografar','#3ddc8c')"); pg.wait_for_timeout(400); q.append(('PROPOSTA · tudo certo', G, shot(pg)))
    pg.evaluate(MANUAL); pg.wait_for_timeout(400); q.append(('PROPOSTA · controles manuais', G, shot(pg))); print('erros JS:', erros); c.close()
finally: srv.terminate()
W = sum(i.width + 22 for _, _, i in q) - 22 + 80; H = 140 + max(i.height for _, _, i in q) + 60; B = Image.new('RGB', (W, H), '#ece6ea'); d = ImageDraw.Draw(B)
d.text((40, 24), 'App · Estúdio · câmera automática', font=F(29, 1), fill='#2a1a28'); d.text((40, 70), 'Fica a peça, uma frase clara e o disparo. Os controles técnicos saem da tela e ficam guardados em "Controles manuais".', font=F(18), fill='#5b4a57'); x = 40
for rot, cor, im in q:
    d.text((x, 120), rot, font=F(19, 1), fill=cor); B.paste(im, (x, 154)); d.rectangle((x - 1, 153, x + im.width, 154 + im.height), outline='#c9bcc5'); x += im.width + 22
B.save(A + 's262_app_camera_automatica.jpg', quality=88); print('ok', B.size)
