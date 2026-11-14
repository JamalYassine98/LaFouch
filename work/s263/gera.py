# S263 · tutorial novo do Estúdio (tudo automático): 4 passos em frase curta + "se o app pedir". Hoje × Proposta.  python3 gera.py
import os, subprocess, sys, time
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
V, G = '#b42318', '#1f8a4c'
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8898', '-d', A + '../../www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
IC = {'caixa': '<rect x="6" y="10" width="36" height="28" rx="3"/><path d="M6 30c10-6 26-6 36 0M24 4v4M14 6l2 3M34 6l-2 3"/>',
      'peca': '<ellipse cx="24" cy="34" rx="18" ry="5"/><rect x="9" y="18" width="12" height="9" rx="3"/><rect x="27" y="18" width="12" height="9" rx="3"/><path d="M21 22h6"/>',
      'giro': '<ellipse cx="24" cy="32" rx="18" ry="6"/><path d="M40 22a16 9 0 0 0-30-3M10 14v6h6"/><rect x="18" y="20" width="12" height="7" rx="2"/>',
      'ok': '<circle cx="24" cy="24" r="17"/><path d="M15 24l6 6 12-13"/>'}
NOVO = """(IC)=>{const st=document.createElement('style');st.textContent='#s263{position:fixed;inset:0;z-index:99999;background:var(--bg);color:var(--fg);font-family:Inter,system-ui,sans-serif;padding:20px 20px 0;overflow:hidden}#s263 h1{font:500 28px Georgia,serif;margin:4px 0 2px}#s263 .sb{font-size:14px;opacity:.75;margin-bottom:16px}#s263 .p{display:flex;gap:14px;align-items:center;background:var(--panel,#fff);border-radius:20px;padding:14px 16px;margin-bottom:10px;box-shadow:0 1px 2px rgba(42,31,39,.05),0 8px 24px -18px rgba(42,31,39,.25)}#s263 .p svg{flex:none;width:46px;height:46px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;opacity:.8}#s263 .p b{display:block;font:500 18px Georgia,serif;margin-bottom:2px}#s263 .p span{font-size:13.5px;opacity:.75;line-height:1.35}#s263 .n{font:600 11.5px Inter,system-ui,sans-serif;letter-spacing:.14em;opacity:.6}#s263 .lb{font:600 11.5px Inter,system-ui,sans-serif;letter-spacing:.14em;opacity:.7;margin:18px 2px 6px}#s263 .ln{display:flex;gap:10px;min-height:44px;align-items:center;border-top:1px solid color-mix(in srgb,currentColor 12%,transparent);font-size:14px}#s263 .ln i{font-style:normal;flex:1}#s263 .ln em{font-style:normal;opacity:.65;flex:1.1}#s263 .x{position:absolute;right:16px;top:16px;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;border:1px solid color-mix(in srgb,currentColor 18%,transparent)}';document.head.appendChild(st);
 const P=[['caixa','1 · PREPARE','Acenda a luz da caixa','Celular no tripé, de frente para o prato.'],['peca','2 · A PEÇA','Ponha a peça no meio do prato','De frente para a câmera, hastes abertas.'],['giro','3 · O GIRO','Ligue o prato e toque em Começar','O app grava, confere e fecha sozinho.'],['ok','4 · PRONTO','Confira e toque em Salvar','Fotos, giro e vídeo vão para a peça e para o site.']];
 document.body.insertAdjacentHTML('beforeend','<div id="s263"><span class="x">✕</span><h1>Como fotografar</h1><div class="sb">Quatro passos. O resto o app faz sozinho.</div>'+P.map(p=>'<div class="p"><svg viewBox="0 0 48 48">'+IC[p[0]]+'</svg><div><span class="n">'+p[1]+'</span><b>'+p[2]+'</b><span>'+p[3]+'</span></div></div>').join('')+'<div class="lb">SE O APP PEDIR</div>'+[['“Falta luz”','acenda ou aproxime a luz da caixa'],['“Afaste um pouco”','a peça está saindo do quadro'],['“Prato rápido demais”','diminua a velocidade do prato'],['“Deixe o prato vazio”','ele está medindo o fundo, 2 segundos']].map(x=>'<div class="ln"><i>'+x[0]+'</i><em>'+x[1]+'</em></div>').join('')+'</div>')}"""
def shot(pg, larg=400):
    pg.screenshot(path='/tmp/s263.png'); x = Image.open('/tmp/s263.png').convert('RGB'); return x.resize((larg, int(x.height * larg / x.width)))
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    c = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg = c.new_page(); pg.goto('http://localhost:8898/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(900)
    pg.evaluate("()=>{const t=[...document.querySelectorAll('#v-inicio .tl')].find(e=>/Estúdio/.test(e.innerText));t.click()}"); pg.wait_for_timeout(1200); pg.evaluate("document.querySelector('.estOv [data-e=ajuda]').click()"); pg.wait_for_timeout(900)
    pg.evaluate("()=>{const l=[...document.querySelectorAll('body *')].filter(e=>e.children.length<3&&/^Como fotografar/.test(e.textContent.trim())&&e.getClientRects().length);(l[0].closest('button,[data-act],[data-e],[role=button]')||l[0]).click()}"); pg.wait_for_timeout(1500); h1 = shot(pg)
    info = pg.evaluate("()=>({abas:[...document.querySelectorAll('.egTabs button')].map(e=>e.innerText.trim()),itens:document.querySelectorAll('.egIt').length,txt:(document.querySelector('.egTabs')||{parentElement:{innerText:''}}).parentElement.innerText.length})"); print('tutorial de hoje:', info)
    pg.evaluate("()=>{const s=[...document.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+200&&getComputedStyle(e).overflowY!='visible').pop();s&&s.scrollBy(0,700)}"); pg.wait_for_timeout(500); h2 = shot(pg)
    pg.evaluate(NOVO, IC); pg.wait_for_timeout(500); p1 = shot(pg); c.close()
finally: srv.terminate()
q = [('HOJE · 4 abas, 35 explicações de botões', V, h1), ('PROPOSTA · cabe numa tela', G, p1)]
W = sum(i.width + 22 for _, _, i in q) - 22 + 80; H = 140 + max(i.height for _, _, i in q) + 60; B = Image.new('RGB', (W, H), '#ece6ea'); d = ImageDraw.Draw(B)
d.text((40, 24), 'App · Estúdio · tutorial "Como fotografar"', font=F(29, 1), fill='#2a1a28'); d.text((40, 70), 'Hoje explica cada botão técnico. Proposta: quatro passos e o que fazer quando o app pedir algo.', font=F(18), fill='#5b4a57'); x = 40
for rot, cor, im in q:
    d.text((x, 120), rot, font=F(19, 1), fill=cor); B.paste(im, (x, 154)); d.rectangle((x - 1, 153, x + im.width, 154 + im.height), outline='#c9bcc5'); x += im.width + 22
B.save(A + 's263_app_tutorial_estudio.jpg', quality=88); print('ok', B.size)
