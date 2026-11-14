# S260 · peça giratória no site com os quadros REAIS do giro que o dono mandou (tratados por trata.py). Desenho novo dos controles: régua de ângulo com paradas, ampliar por gesto, "ver em grande".
# A peça do vídeo aparece no lugar da foto de uma peça de amostra do site (o nome e o preço da página são da amostra).  python3 gera.py
import os, subprocess, sys, time, shutil, json, math
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
OLHO = open(A + '../kit/olho.js').read(); V, G = '#b42318', '#1f8a4c'; GJ = json.load(open(A + 'giro.json')); N = GJ['n']; FR = GJ['frente']; Q34 = FR + 20; QPF = FR + 40
subprocess.run('bash /tmp/srv.sh >/dev/null 2>&1', shell=True); rota = lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def folha(arq, tit, sub, partes, vertical=False, gap=24):
    W = (max(i.width for _, _, i in partes) if vertical else sum(i.width + gap for _, _, i in partes) - gap) + 80; H = 140 + (sum(i.height + 60 for _, _, i in partes) if vertical else max(i.height for _, _, i in partes) + 60)
    B = Image.new('RGB', (W, H), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 24), tit, font=F(30, 1), fill='#2a1a28'); d.text((40, 70), sub, font=F(19), fill='#5b4a57'); x, y = 40, 120
    for rot, cor, im in partes:
        d.text((x, y), rot, font=F(21, 1), fill=cor); B.paste(im, (x, y + 36)); d.rectangle((x - 1, y + 35, x + im.width, y + 36 + im.height), outline='#c9bcc5')
        if vertical: y += im.height + 60
        else: x += im.width + gap
    B.save(A + arq + '.jpg', quality=88); print('ok', arq, B.size, flush=True)
CSS = """.pgl .big{touch-action:none;position:relative}.pgl .big img.s260i{width:100%;height:100%;object-fit:contain;transform-origin:50% 50%;will-change:transform;background:#fff}
.pgl .big .zh{left:50%!important;right:auto!important;bottom:14px!important;transform:translateX(-50%);background:color-mix(in srgb,var(--tx) 76%,transparent)!important;white-space:nowrap;transition:opacity .3s}
#s260x{position:absolute;left:10px;top:10px;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#fff;color:var(--tx);border:1px solid color-mix(in srgb,var(--tx) 14%,transparent);box-shadow:0 2px 10px rgba(42,31,39,.08)}
#s260r{position:relative;height:68px;margin:8px 6px 2px;color:var(--tx);touch-action:none}
#s260r .tr{position:absolute;left:0;right:0;top:15px;height:1px;background:color-mix(in srgb,currentColor 22%,transparent)}
#s260r .tk{position:absolute;top:11px;width:1px;height:9px;background:color-mix(in srgb,currentColor 30%,transparent)}
#s260r .pt{position:absolute;top:9px;width:13px;height:13px;margin-left:-6.5px;border-radius:50%;background:var(--tx);box-shadow:0 0 0 5px color-mix(in srgb,var(--tx) 9%,transparent)}
#s260r button{position:absolute;top:22px;transform:translateX(-50%);height:44px;min-width:64px;padding:0 6px 14px;background:none;border:0;font:600 12px Inter,system-ui,sans-serif;letter-spacing:.14em;color:color-mix(in srgb,var(--tx) 58%,transparent)}
#s260r button.on{color:var(--tx)}
#s260g{position:fixed;inset:0;z-index:99990;background:#fff;display:none;color:var(--tx)}#s260g.on{display:block}
#s260g img{position:absolute;left:0;right:0;top:50%;width:100%;transform:translateY(-58%)}
#s260g h3{position:absolute;left:20px;top:22px;margin:0;font:500 20px Georgia,serif}#s260g .fx{position:absolute;right:14px;top:12px;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;border:1px solid color-mix(in srgb,currentColor 18%,transparent);font-size:18px}
#s260g #s260r2{position:absolute;left:24px;right:24px;bottom:54px}
#s260d{position:fixed;width:46px;height:46px;border-radius:50%;background:rgba(141,58,105,.2);border:1.5px solid rgba(141,58,105,.65);pointer-events:none;z-index:99999;opacity:0;transform:translate(-50%,-50%)}"""
JS = """([N,FR,Q34,QPF])=>{const b=document.querySelector('.pgl .big'),im=b.querySelector('img');im.classList.add('s260i');const z=b.querySelector('.zh');[...z.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.textContent=' Arrastá para girar');
 window.__P=[];window.__Gd=[];for(let i=0;i<N;i++){const a=new Image();a.src='/s260/p'+String(i).padStart(3,'0')+'.jpg';window.__P.push(a);const g=new Image();g.src='/s260/g'+String(i).padStart(3,'0')+'.jpg';window.__Gd.push(g)}
 b.insertAdjacentHTML('beforeend','<span id="s260x" role="button" aria-label="Ver en grande"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg></span>');
 const f=q=>(q/(N-1))*100;let tk='';for(let q=FR%5;q<N;q+=5)tk+='<i class="tk" style="left:'+f(q)+'%"></i>';
 const reg=id=>'<div id="'+id+'" class="s260r"><i class="tr"></i>'+tk+'<i class="pt"></i><button data-q="'+FR+'" style="left:'+f(FR)+'%">FRENTE</button><button data-q="'+Q34+'" style="left:'+f(Q34)+'%">3/4</button><button data-q="'+QPF+'" style="left:'+f(QPF)+'%">PERFIL</button></div>';
 b.insertAdjacentHTML('afterend',reg('s260r'));const h=(document.querySelector('.modal.pgm h1,.modal.pgm h2')||{}).textContent||'';
 document.body.insertAdjacentHTML('beforeend','<div id="s260g"><h3>'+h+'</h3><span class="fx">✕</span><img>'+reg('s260r2').replace('class="s260r"','class="s260r" style="position:absolute;left:24px;right:24px;bottom:54px;height:56px"')+'</div><i id="s260d"></i>');
 const st=document.createElement('style');st.textContent='#s260r2 .tr{position:absolute;left:0;right:0;top:15px;height:1px;background:color-mix(in srgb,currentColor 22%,transparent)}#s260r2 .tk{position:absolute;top:11px;width:1px;height:9px;background:color-mix(in srgb,currentColor 30%,transparent)}#s260r2 .pt{position:absolute;top:9px;width:13px;height:13px;margin-left:-6.5px;border-radius:50%;background:currentColor}#s260r2 button{position:absolute;top:22px;transform:translateX(-50%);height:34px;min-width:64px;background:none;border:0;font:600 12px Inter,system-ui,sans-serif;letter-spacing:.14em;color:color-mix(in srgb,currentColor 58%,transparent)}#s260r2 button.on{color:inherit}';document.head.appendChild(st);
 window.s260=(q,zoom,ox,oy,dx,dy,dica,grande)=>{q=Math.max(0,Math.min(N-1,q));const i=Math.round(q);zoom=zoom||1;const G=document.querySelector('#s260g');G.classList.toggle('on',!!grande);
  im.src=(zoom>1.3?window.__Gd:window.__P)[i].src;im.style.transformOrigin=(ox||50)+'% '+(oy||50)+'%';im.style.transform='scale('+zoom+')';if(grande)G.querySelector('img').src=window.__Gd[i].src;
  document.querySelectorAll('.s260r').forEach(r=>{r.querySelector('.pt').style.left=f(q)+'%';r.querySelectorAll('button').forEach(x=>x.classList.toggle('on',Math.abs(+x.dataset.q-q)<2.5));r.style.opacity=zoom>1.05&&!grande?.35:1});
  z.style.opacity=dica?1:0;const d=document.querySelector('#s260d');if(dx!=null){d.style.opacity=1;d.style.left=dx+'px';d.style.top=dy+'px'}else d.style.opacity=0};
 return Promise.all([...window.__P,...window.__Gd].map(a=>a.decode().catch(()=>0))).then(()=>'ok')}"""
def site(b, W, H, dpr=None):
    c = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=dpr or (2 if W < 900 else 1), is_mobile=W < 700, has_touch=W < 700, locale='es-PY', service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', rota)
    pg = c.new_page(); pg.goto('http://localhost:8811/?r=tienda'); pg.wait_for_selector('#grid .card'); pg.wait_for_timeout(2300); pg.evaluate("document.querySelector('#grid .card .open').click()"); pg.wait_for_timeout(2300); return c, pg
def shot(pg, clip=None, larg=None):
    pg.screenshot(path='/tmp/s260.png', **({'clip': clip} if clip else {})); x = Image.open('/tmp/s260.png').convert('RGB'); return x.resize((larg, int(x.height * larg / x.width))) if larg else x
def poe(pg, *a): pg.evaluate("a=>window.s260(...a)", list(a)); pg.wait_for_timeout(60)
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    im = {}; ol = {}
    for modo in ('hoje', 'prop'):
        c, pg = site(b, 390, 844)
        if modo == 'prop': pg.add_style_tag(content=CSS); print('  quadros carregados:', pg.evaluate(JS, [N, FR, Q34, QPF])); poe(pg, FR, 1, 50, 50, None, None, 1, 0)
        pg.wait_for_timeout(300); ol[modo, 0] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; im[modo] = shot(pg, None, 430)
        if modo == 'prop':
            clip = {'x': 0, 'y': 137, 'width': 390, 'height': 410}; q = []
            for leg, a in (('1 · chega de frente', (FR, 1, 50, 50, None, None, 1, 0)), ('2 · arrasta: gira', (Q34 - 6, 1, 50, 50, 250, 330, 0, 0)), ('3 · toca em PERFIL', (QPF, 1, 50, 50, 286, 516, 0, 0)), ('4 · pinça: amplia', (Q34, 2.6, 74, 56, None, None, 0, 0))):
                poe(pg, *a); pg.wait_for_timeout(150); q.append((leg, '#5b4a57', shot(pg, clip, 330)))
            poe(pg, Q34, 1, 50, 50, None, None, 0, 1); pg.wait_for_timeout(200); q.append(('5 · em grande', '#5b4a57', shot(pg, None, 250)))
            folha('s260_site_celular_manuseio', 'Site · como o cliente mexe na peça · 5 momentos', 'Quadros REAIS do seu vídeo, com fundo branco. Só o que está filmado gira (cerca de 150°).', q)
            poe(pg, FR, 1, 50, 50, None, None, 1, 0)
        pg.evaluate("document.querySelector('.scrim.pg').scrollBy(0,500)"); pg.wait_for_timeout(300); ol[modo, 1] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; pg.evaluate("document.querySelector('.scrim.pg').scrollTo(0,0)")
        if modo == 'prop':
            d = '/tmp/s260v'; shutil.rmtree(d, ignore_errors=True); os.makedirs(d); n = 0; S = lambda k: (lambda k: k * k * (3 - 2 * k))(max(0, min(1, k))); E4 = lambda k: 1 - (1 - max(0, min(1, k))) ** 4
            def est(t):
                if t < 2800: k = t / 2800; return (FR + (Q34 - FR) * math.sin(k * math.pi) * 1.0, 1, 50, 50, None, None, 1 if t > 2300 or t < 300 else 0, 0, 'chega: gira devagar até a 3/4 e volta para a frente')
                if t < 3400: return (FR, 1, 50, 50, None, None, 1, 0, 'a dica aparece uma vez')
                if t < 5600: k = S((t - 3400) / 2200); q = FR + (QPF + 6 - FR) * k; return (q, 1, 50, 50, 300 - 190 * k, 330, 0, 0, 'o dedo arrasta: a peça gira junto')
                if t < 6100: return (QPF + 6 - 6 * E4((t - 5600) / 500), 1, 50, 50, None, None, 0, 0, 'solta: desacelera e assenta em PERFIL')
                if t < 6600: return (QPF, 1, 50, 50, 78, 516, 0, 0, 'toca em FRENTE na régua')
                if t < 7700: return (QPF + (FR - QPF) * E4((t - 6600) / 1100), 1, 50, 50, None, None, 0, 0, 'a peça gira sozinha até a frente')
                if t < 8100: return (FR, 1, 50, 50, None, None, 0, 0, 'pinça: amplia')
                if t < 9000: return (FR, 1 + 1.8 * E4((t - 8100) / 700), 30, 52, None, None, 0, 0, 'pinça: amplia o detalhe')
                if t < 10200: k = S((t - 9000) / 1200); return (FR, 2.8, 30 + 42 * k, 52, None, None, 0, 0, 'arrasta ampliado: percorre a peça')
                if t < 10800: return (FR, 2.8 - 1.8 * E4((t - 10200) / 500), 72, 52, None, None, 0, 0, 'toque duplo: volta ao normal')
                if t < 11300: return (FR, 1, 50, 50, 37, 174, 0, 0, 'toca no ícone: ver em grande')
                k = S((t - 11300) / 2200); return (FR + (QPF - FR) * k, 1, 50, 50, None, None, 0, 1, 'em grande: tela inteira, mesma régua')
            for t in range(0, 14000, 40):
                e = est(t); poe(pg, *e[:8]); x = shot(pg, {'x': 0, 'y': 71, 'width': 390, 'height': 600}, 480)
                Bq = Image.new('RGB', (x.width + 40, x.height + 126), '#ece6ea'); dr = ImageDraw.Draw(Bq); dr.text((20, 14), 'Site · peça giratória com o seu giro real', font=F(23, 1), fill='#2a1a28'); dr.text((20, 52), e[8], font=F(18, 1), fill=G); Bq.paste(x, (20, 96)); Bq = Bq.crop((0, 0, Bq.width - Bq.width % 2, Bq.height - Bq.height % 2)); Bq.save('%s/%05d.png' % (d, n)); n += 1
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '25', '-i', d + '/%05d.png', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '22', '-movflags', '+faststart', A + 's260_video_site_peca_giratoria_real.mp4'], check=True); print('ok vídeo', n, 'quadros', os.path.getsize(A + 's260_video_site_peca_giratoria_real.mp4') // 1024, 'kB')
        c.close()
    for k in (0, 1): print('olho celular', 'rolado' if k else 'parado', 'pioras:', [(r, ol['hoje', k].get(r, 0), v) for r, v in ol['prop', k].items() if v > ol['hoje', k].get(r, 0)])
    folha('s260_site_celular_peca', 'Site · página da peça · celular', 'Régua fina com as paradas FRENTE · 3/4 · PERFIL e um ícone para ver em grande', [('HOJE', V, im['hoje']), ('PROPOSTA (peça do seu vídeo)', G, im['prop'])])
    im = {}; ol = {}
    for modo in ('hoje', 'prop'):
        c, pg = site(b, 1366, 768)
        if modo == 'prop': pg.add_style_tag(content=CSS + ".pgl .big{cursor:grab}#s260r{max-width:520px;margin-left:auto;margin-right:auto}"); pg.evaluate(JS, [N, FR, Q34, QPF]); poe(pg, Q34, 1, 50, 50, None, None, 0, 0)
        pg.wait_for_timeout(300); ol[modo] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; im[modo] = shot(pg, None, 1100); c.close()
    print('olho PC pioras:', [(r, ol['hoje'].get(r, 0), v) for r, v in ol['prop'].items() if v > ol['hoje'].get(r, 0)])
    folha('s260_site_pc_peca', 'Site · página da peça · computador', 'Arrastar com o mouse gira, a roda amplia; a régua fica centrada sob a foto. Peça do seu vídeo, na 3/4.', [('HOJE', V, im['hoje']), ('PROPOSTA', G, im['prop'])], vertical=True)
