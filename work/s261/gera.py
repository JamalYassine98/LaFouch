# S261 · esboço do FUNCIONAMENTO no app: gravar o giro até completar, padrão da loja, e o resultado em fundo infinito com sombras naturais (fotos e vídeo).
# As imagens da peça são do vídeo que o dono mandou (só a luz foi acertada; nada recortado). A tela de resultado é um conceito desenhado no estilo do app.  python3 gera.py
import os, subprocess, sys, time, json
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
V, G = '#b42318', '#1f8a4c'; GJ = json.load(open(A + '../s260/giro.json')); FR = GJ['frente']
subprocess.run('bash /tmp/srv.sh >/dev/null 2>&1', shell=True)
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8895', '-d', A + '../../www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
def folha(arq, tit, sub, partes, gap=22):
    W = sum(i.width + gap for _, _, i in partes) - gap + 80; H = 140 + max(i.height for _, _, i in partes) + 60
    B = Image.new('RGB', (W, H), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 24), tit, font=F(29, 1), fill='#2a1a28'); d.text((40, 70), sub, font=F(18), fill='#5b4a57'); x = 40
    for rot, cor, im in partes:
        d.text((x, 120), rot, font=F(19, 1), fill=cor); B.paste(im, (x, 154)); d.rectangle((x - 1, 153, x + im.width, 154 + im.height), outline='#c9bcc5'); x += im.width + gap
    B.save(A + arq + '.jpg', quality=88); print('ok', arq, B.size, flush=True)
def shot(pg, larg=330):
    pg.screenshot(path='/tmp/s261.png'); x = Image.open('/tmp/s261.png').convert('RGB'); return x.resize((larg, int(x.height * larg / x.width)))
RAW = 'http://localhost:8811/s260raw/'; PR = 'http://localhost:8811/s260c/'
FUNDO = """(u)=>{const v=document.querySelector('video');v.style.opacity=0;const p=v.parentElement;p.style.background='#cfcbd6 url('+u+') center/cover no-repeat'}"""
GIRO = """()=>{const pil=[...document.querySelectorAll('body *')].filter(e=>e.children.length===0&&/Aproxime ou afaste/.test(e.textContent)).pop();window.__pil=pil;const pt=pil.getBoundingClientRect().top;const ct=pt-40,d=Math.min(230,ct-12-262),tp=262+((ct-12-262)-d)/2;
 document.body.insertAdjacentHTML('beforeend','<div id="s261g" style="position:fixed;left:0;right:0;top:'+tp+'px;z-index:99999;display:grid;place-items:center;pointer-events:none"><svg width="'+d+'" height="'+d+'" viewBox="0 0 250 250" style="filter:drop-shadow(0 1px 4px rgba(0,0,0,.35))"><circle cx="125" cy="125" r="119" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2.4"/><circle id="s261r" cx="125" cy="125" r="119" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="747.7" stroke-dashoffset="747.7" transform="rotate(-90 125 125)"/></svg></div><div id="s261c" style="position:fixed;left:0;right:0;top:'+ct+'px;z-index:99999;display:flex;justify-content:center;gap:7px;pointer-events:none"></div>');
 window.s261=(g,t,ok)=>{document.querySelector('#s261r').setAttribute('stroke-dashoffset',747.7*(1-g/360));window.__pil.textContent=t;document.querySelector('#s261c').innerHTML=['Frente','3/4','Perfil','Volta'].map((n,i)=>'<i style="font:600 12px Inter,system-ui,sans-serif;font-style:normal;padding:5px 11px;border-radius:999px;'+(i<ok?'background:#fff;color:#1f8a4c':'background:rgba(20,12,18,.5);color:#fff;border:1px solid rgba(255,255,255,.35)')+'">'+(i<ok?'✓ ':'')+n+'</i>').join('')}}"""
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'])
    def cam():
        c = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, service_workers='block', permissions=['camera']); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        pg = c.new_page(); pg.on('dialog', lambda d: d.dismiss()); pg.goto('http://localhost:8895/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(900); pg.evaluate("()=>{const t=[...document.querySelectorAll('#v-inicio .tl')].find(e=>/Estúdio/.test(e.innerText));t.click()}"); pg.wait_for_timeout(1200)
        pg.evaluate("document.querySelector('.estOv [data-e=sessao]').click()"); pg.wait_for_timeout(2800); return c, pg
    # ── 1 · gravar até completar
    c, pg = cam(); pg.evaluate(FUNDO, RAW + 'ini.jpg'); pg.wait_for_timeout(500); q = [('HOJE · foto por foto', V, shot(pg))]
    pg.evaluate(GIRO)
    for leg, img, a in (('PROPOSTA · começa', 'ini.jpg', (20, 'Gravando o giro · não mexa no celular', 0)), ('PROPOSTA · vai marcando', 'q34.jpg', (170, 'Frente e 3/4 prontas · continue', 2)), ('PROPOSTA · completo', 'perfil.jpg', (360, 'Tudo certo · fechando', 4))):
        pg.evaluate(FUNDO, RAW + img); pg.evaluate("a=>window.s261(...a)", list(a)); pg.wait_for_timeout(500); q.append((leg, G, shot(pg)))
    folha('s261_app_gravar_giro', 'App · Estúdio · gravar o giro até completar', 'O app marca Frente, 3/4, Perfil e Volta conforme acha cada um e fecha a câmera sozinho. Imagem do seu vídeo.', q)
    # ── 2 · padrão da loja (antes de gravar)
    pg.evaluate("document.querySelector('#s261g').remove();document.querySelector('#s261c').remove();window.__pil.textContent='Aproxime ou afaste até a peça caber na moldura'")
    pg.evaluate("""()=>{const pt=window.__pil.getBoundingClientRect().top,t0=268,alt=pt-52-t0;document.body.insertAdjacentHTML('beforeend','<div id="s261p" style="position:fixed;left:30px;right:30px;top:'+t0+'px;height:'+alt+'px;z-index:99999;pointer-events:none;border:1.5px dashed rgba(255,255,255,.9);border-radius:18px;filter:drop-shadow(0 1px 3px rgba(0,0,0,.4))"><i style="position:absolute;left:0;right:0;top:58%;border-top:1px solid rgba(255,255,255,.7)"></i><b style="position:absolute;left:12px;top:8px;font:600 11.5px Inter,system-ui,sans-serif;letter-spacing:.14em;color:#fff">PADRÃO DA LOJA</b></div><div id="s261m" style="position:fixed;left:20px;right:20px;top:'+(pt-40)+'px;z-index:99999;text-align:center;color:#fff;font:500 18px Georgia,serif;text-shadow:0 1px 6px rgba(0,0,0,.6)"></div>');window.s261m=(t,ok)=>{const m=document.querySelector('#s261m');m.textContent=t;document.querySelector('#s261p').style.borderColor=ok?'rgba(120,230,160,.95)':'rgba(255,255,255,.9)'}}""")
    q = []
    for leg, img, a in (('PROPOSTA · peça grande demais', 'perfil.jpg', ('Afaste um pouco: a haste sai do quadro', 0)), ('PROPOSTA · no padrão', 'frente.jpg', ('No padrão · pode ligar o prato', 1))):
        pg.evaluate(FUNDO, RAW + img); pg.evaluate("a=>window.s261m(...a)", list(a)); pg.wait_for_timeout(500); q.append((leg, G, shot(pg, 380)))
    c.close()
    folha('s261_app_padrao_da_loja', 'App · Estúdio · padrão da loja antes de gravar', 'A primeira peça boa vira o padrão. O app compara cada peça nova e orienta.', q)
    # ── 3 · resultado (conceito no estilo do app): fundo infinito + sombras naturais
    c = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg = c.new_page(); pg.goto('http://localhost:8895/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(900)
    pg.evaluate("""([PR,RAW,FR])=>{const n=i=>String(i).padStart(3,'0');const st=document.createElement('style');st.textContent='#s261o{position:fixed;inset:0;z-index:99990;background:var(--bg);color:var(--fg);font-family:Inter,system-ui,sans-serif;padding:18px 18px 0;overflow:hidden}#s261o h1{font:500 28px Georgia,serif;margin:6px 0 2px}#s261o .sb{font-size:13.5px;opacity:.75;margin-bottom:14px}#s261o .gr{background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 1px 2px rgba(42,31,39,.05),0 10px 28px -18px rgba(42,31,39,.3)}#s261o .gr img{display:block;width:100%}#s261o .lb{font:600 11.5px Inter,system-ui,sans-serif;letter-spacing:.14em;opacity:.7;margin:16px 2px 8px}#s261o .th{display:flex;gap:8px}#s261o .th div{flex:1;background:#fff;border-radius:14px;overflow:hidden;text-align:center;font-size:12px;padding-bottom:7px;color:#2a1f27}#s261o .th img{width:100%;display:block;aspect-ratio:3/2;object-fit:cover}#s261o .th .ic{aspect-ratio:3/2;display:grid;place-items:center;font:500 17px Georgia,serif}#s261o .ok{display:flex;align-items:center;gap:10px;margin:16px 2px;font-size:14px}#s261o .ok i{width:9px;height:9px;border-radius:9px;background:#1f8a4c;box-shadow:0 0 0 5px color-mix(in srgb,#1f8a4c 14%,transparent)}#s261o .bt{display:flex;gap:10px;align-items:center;margin-top:6px}#s261o .p{flex:1;min-height:48px;border-radius:999px;background:transparent;color:var(--fg);border:1px solid color-mix(in srgb,currentColor 28%,transparent);font:600 15px Inter,system-ui,sans-serif}#s261o .s{min-height:48px;padding:0 18px;background:none;border:0;color:var(--fg);font:600 15px Inter,system-ui,sans-serif}#s261o .sg{display:flex;background:color-mix(in srgb,currentColor 7%,transparent);border-radius:999px;padding:3px;margin:0 0 10px;width:max-content}#s261o .sg b{font:600 12.5px Inter,system-ui,sans-serif;padding:7px 14px;border-radius:999px}#s261o .sg b.on{background:var(--panel,#fff)}';document.head.appendChild(st);
      document.body.insertAdjacentHTML('beforeend','<div id="s261o"><h1>Giro pronto</h1><div class="sb">Fundo infinito · sombras naturais · nada recortado</div><div class="sg"><b class="on" id="s261d">Pronto</b><b id="s261a">Como foi filmado</b></div><div class="gr"><img id="s261i" src="'+PR+'g'+n(FR+20)+'.jpg"></div><div class="lb">O QUE SAIU DESTE GIRO</div><div class="th"><div><img src="'+PR+'p'+n(FR)+'.jpg">Frente</div><div><img src="'+PR+'p'+n(FR+20)+'.jpg">3/4</div><div><img src="'+PR+'p'+n(FR+40)+'.jpg">Perfil</div><div><span class="ic">360°</span>Girar</div><div><span class="ic">▶</span>Vídeo</div></div><div class="ok"><i></i><span>No padrão da loja: mesmo ângulo, distância e luz</span></div><div class="bt"><button class="p">Salvar</button><button class="s">Refazer</button></div></div>');
      window.s261ver=(antes)=>{document.querySelector('#s261i').src=antes?RAW+'q34c.jpg':PR+'g'+n(FR+20)+'.jpg';document.querySelector('#s261d').classList.toggle('on',!antes);document.querySelector('#s261a').classList.toggle('on',!!antes)}}""", [PR, RAW, FR])
    pg.wait_for_timeout(1200); r1 = shot(pg, 400); pg.evaluate("window.s261ver(1)"); pg.wait_for_timeout(700); r2 = shot(pg, 400); c.close()
    folha('s261_app_resultado', 'App · Estúdio · resultado do giro (conceito)', 'Só o fundo vira branco contínuo; peça e sombra ficam como a câmera viu.', [('PROPOSTA · pronto', G, r1), ('PROPOSTA · conferindo com o filmado', G, r2)])
finally: srv.terminate()
# ── 4 · o que sai: fotos 3:2 e vídeo 9:16 em fundo infinito
n3 = lambda i: '%03d' % i; fotos = [(leg, Image.open('/tmp/kitsite/s260c/g%s.jpg' % n3(i)).resize((420, 280))) for leg, i in (('FOTO · frente', FR), ('FOTO · 3/4', FR + 20), ('FOTO · perfil', FR + 40))]
vid = []
for i in (FR, FR + 13, FR + 27, FR + 40):
    g = Image.open('/tmp/kitsite/s260c/g%s.jpg' % n3(i)); cv = Image.new('RGB', (1080, 1920), 'white'); cv.paste(g, (0, 600)); vid.append(('VÍDEO · %.1f s' % ((i - FR) / 6), cv.resize((200, 356))))
B = Image.new('RGB', (40 + 3 * 440 + 20, 150 + 280 + 80 + 356 + 60), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 24), 'O que sai de um giro · fundo infinito e sombras naturais', font=F(29, 1), fill='#2a1a28'); d.text((40, 70), 'Fotos 3:2 para o catálogo e vídeo em pé (9:16) para Status e Marketing. Imagens do seu vídeo, só com a luz acertada.', font=F(18), fill='#5b4a57')
for j, (leg, im) in enumerate(fotos):
    x = 40 + j * 440; d.text((x, 118), leg, font=F(18, 1), fill=G); B.paste(im, (x, 146)); d.rectangle((x - 1, 145, x + 420, 146 + 280), outline='#c9bcc5')
for j, (leg, im) in enumerate(vid):
    x = 40 + j * 222; y = 146 + 280 + 46; d.text((x, y - 28), leg, font=F(17, 1), fill=G); B.paste(im, (x, y)); d.rectangle((x - 1, y - 1, x + 200, y + 356), outline='#c9bcc5')
B.save(A + 's261_fotos_e_video.jpg', quality=90); print('ok s261_fotos_e_video')
