# S260 v3 · manuseio mais simples: só a peça. Arrastar gira (com ímã leve nas paradas), tocar abre em grande, pinça amplia. Sem régua e sem ícone; três pontinhos mostram a parada.
# Usa os quadros do tratamento novo (trata2.py).  python3 gera3.py
import os, subprocess, sys, time, shutil, json, math
A = os.path.dirname(os.path.abspath(__file__)) + '/'
src = open(A + 'gera.py').read(); exec(src[:src.index('CSS = """')]); exec(src[src.index('def site('):src.index('def poe(')])
CSS = """.pgl .big{touch-action:none;position:relative}.pgl .big img.s260i{width:100%;height:100%;object-fit:contain;transform-origin:50% 50%;will-change:transform;background:#fff}
.pgl .big .zh{left:50%!important;right:auto!important;bottom:40px!important;transform:translateX(-50%);background:color-mix(in srgb,var(--tx) 76%,transparent)!important;white-space:nowrap}
#s3d{position:absolute;left:0;right:0;bottom:14px;display:flex;justify-content:center;gap:9px;pointer-events:none}#s3d i{width:6px;height:6px;border-radius:50%;background:color-mix(in srgb,var(--tx) 22%,transparent)}#s3d i.on{background:var(--tx)}
#s3n{position:absolute;left:0;right:0;bottom:30px;text-align:center;font:600 12px Inter,system-ui,sans-serif;letter-spacing:.16em;color:var(--tx);opacity:0;pointer-events:none}
#s3g{position:fixed;inset:0;z-index:99990;background:#fff;display:none;color:var(--tx)}#s3g.on{display:block}#s3g img{position:absolute;left:0;top:50%;width:100%;transform-origin:50% 50%}
#s3g .fx{position:absolute;right:14px;top:12px;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;border:1px solid color-mix(in srgb,currentColor 18%,transparent);font-size:18px;background:#fff}
#s3g .dd{position:absolute;left:0;right:0;bottom:44px;display:flex;justify-content:center;gap:9px}#s3g .dd i{width:6px;height:6px;border-radius:50%;background:color-mix(in srgb,currentColor 22%,transparent)}#s3g .dd i.on{background:currentColor}
#s3f{position:fixed;width:46px;height:46px;border-radius:50%;background:rgba(141,58,105,.2);border:1.5px solid rgba(141,58,105,.65);pointer-events:none;z-index:99999;opacity:0;transform:translate(-50%,-50%)}"""
JS = """([N,FR,Q34,QPF])=>{const b=document.querySelector('.pgl .big'),im=b.querySelector('img');im.classList.add('s260i');const z=b.querySelector('.zh');[...z.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.textContent=' Arrastá para girar');
 window.__P=[];window.__Gd=[];for(let i=0;i<N;i++){const a=new Image();a.src='/s260b/p'+String(i).padStart(3,'0')+'.jpg';window.__P.push(a);const g=new Image();g.src='/s260b/g'+String(i).padStart(3,'0')+'.jpg';window.__Gd.push(g)}
 b.insertAdjacentHTML('beforeend','<div id="s3n"></div><div id="s3d"><i></i><i></i><i></i></div>');document.body.insertAdjacentHTML('beforeend','<div id="s3g"><span class="fx">✕</span><img><div class="dd"><i></i><i></i><i></i></div></div><i id="s3f"></i>');
 const PR=[[FR,'FRENTE'],[Q34,'3/4'],[QPF,'PERFIL']];
 window.s3=(q,zoom,ox,oy,dx,dy,dica,grande,nome)=>{q=Math.max(0,Math.min(N-1,q));const i=Math.round(q);zoom=zoom||1;const G=document.querySelector('#s3g');G.classList.toggle('on',!!grande);
  let perto=0,dm=1e9;PR.forEach((p,k)=>{if(Math.abs(p[0]-q)<dm){dm=Math.abs(p[0]-q);perto=k}});
  if(grande){const gi=G.querySelector('img');gi.src=window.__Gd[i].src;gi.style.transformOrigin=(ox||50)+'% '+(oy||50)+'%';gi.style.transform='translateY(-56%) scale('+zoom+')';G.querySelectorAll('.dd i').forEach((x,k)=>x.classList.toggle('on',k===perto));G.querySelector('.dd').style.opacity=zoom>1.05?0:1}
  else{im.src=window.__P[i].src;im.style.transform='none'}
  document.querySelectorAll('#s3d i').forEach((x,k)=>x.classList.toggle('on',k===perto));const n=document.querySelector('#s3n');n.textContent=PR[perto][1];n.style.opacity=nome||0;
  z.style.opacity=dica?1:0;const d=document.querySelector('#s3f');if(dx!=null){d.style.opacity=1;d.style.left=dx+'px';d.style.top=dy+'px'}else d.style.opacity=0};
 return Promise.all([...window.__P,...window.__Gd].map(a=>a.decode().catch(()=>0))).then(()=>'ok')}"""
def poe(pg, *a): pg.evaluate("a=>window.s3(...a)", list(a)); pg.wait_for_timeout(60)
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    im = {}; ol = {}
    for modo in ('hoje', 'prop'):
        c, pg = site(b, 390, 844)
        if modo == 'prop': pg.add_style_tag(content=CSS); print('  quadros:', pg.evaluate(JS, [N, FR, Q34, QPF])); poe(pg, FR, 1, 50, 50, None, None, 1, 0, 0)
        pg.wait_for_timeout(300); ol[modo, 0] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; im[modo] = shot(pg, None, 430)
        if modo == 'prop':
            clip = {'x': 0, 'y': 137, 'width': 390, 'height': 350}; q = []
            for leg, a in (('1 · chega de frente', (FR, 1, 50, 50, None, None, 1, 0, 0)), ('2 · arrasta: gira', (Q34 - 7, 1, 50, 50, 240, 320, 0, 0, 0)), ('3 · solta: encaixa na 3/4', (Q34, 1, 50, 50, None, None, 0, 0, 1))):
                poe(pg, *a); pg.wait_for_timeout(150); q.append((leg, '#5b4a57', shot(pg, clip, 380)))
            poe(pg, Q34, 1, 50, 50, None, None, 0, 1, 0); pg.wait_for_timeout(200); q.append(('4 · toca: grande', '#5b4a57', shot(pg, None, 230)))
            poe(pg, Q34, 2.7, 62, 52, None, None, 0, 1, 0); pg.wait_for_timeout(200); q.append(('5 · pinça', '#5b4a57', shot(pg, None, 230)))
            folha('s260_site_celular_manuseio_v3', 'Site · manuseio simples · só a peça', 'Sem régua e sem ícone. Arrastar gira, soltar encaixa na parada, tocar abre em grande, pinça amplia. Quadros reais, tratamento novo.', q)
            poe(pg, FR, 1, 50, 50, None, None, 1, 0, 0)
        pg.evaluate("document.querySelector('.scrim.pg').scrollBy(0,500)"); pg.wait_for_timeout(300); _o = pg.evaluate(OLHO); ol[modo, 1] = {x['r']: x['n'] for x in _o}; print('   ', modo, 'rolado colados ex:', [x.get('ex') for x in _o if x['r'] == 'colados']); pg.evaluate("document.querySelector('.scrim.pg').scrollTo(0,0)")
        if modo == 'prop' and not os.environ.get('SEMVIDEO'):
            d = '/tmp/s260v3'; shutil.rmtree(d, ignore_errors=True); os.makedirs(d); n = 0; S = lambda k: (lambda k: k * k * (3 - 2 * k))(max(0, min(1, k))); E4 = lambda k: 1 - (1 - max(0, min(1, k))) ** 4
            def est(t):
                if t < 2600: k = t / 2600; return (FR + (Q34 - FR) * math.sin(k * math.pi), 1, 50, 50, None, None, 1 if t > 2200 or t < 300 else 0, 0, 0, 'chega: gira devagar até a 3/4 e volta')
                if t < 3200: return (FR, 1, 50, 50, None, None, 1, 0, 0, 'a dica aparece uma vez')
                if t < 4600: k = S((t - 3200) / 1400); return (FR + (Q34 - 5 - FR) * k, 1, 50, 50, 290 - 120 * k, 320, 0, 0, 0, 'arrasta: a peça gira junto com o dedo')
                if t < 5100: return (Q34 - 5 + 5 * E4((t - 4600) / 400), 1, 50, 50, None, None, 0, 0, E4((t - 4700) / 200), 'solta: encaixa sozinha na 3/4')
                if t < 5900: return (Q34, 1, 50, 50, None, None, 0, 0, 1 - S((t - 5500) / 400), 'o nome da parada aparece e some')
                if t < 7200: k = S((t - 5900) / 1300); return (Q34 + (QPF - 4 - Q34) * k, 1, 50, 50, 250 - 110 * k, 320, 0, 0, 0, 'arrasta de novo')
                if t < 8300: return (QPF - 4 + 4 * E4((t - 7200) / 400), 1, 50, 50, None, None, 0, 0, E4((t - 7300) / 200) * (1 - S((t - 7900) / 400)), 'encaixa no perfil')
                if t < 8800: return (QPF, 1, 50, 50, 195, 320, 0, 0, 0, 'um toque na peça')
                if t < 9800: return (QPF, 1, 50, 50, None, None, 0, 1, 0, 'abre em grande, tela inteira')
                if t < 11200: k = S((t - 9800) / 1400); return (QPF + (Q34 - QPF) * k, 1, 50, 50, 120 + 150 * k, 420, 0, 1, 0, 'em grande: arrastar gira igual')
                if t < 12100: return (Q34, 1 + 1.7 * E4((t - 11200) / 700), 62, 52, None, None, 0, 1, 0, 'pinça: amplia o detalhe')
                if t < 13000: return (Q34, 2.7, 62, 52, None, None, 0, 1, 0, 'pinça: amplia o detalhe')
                return (Q34, 2.7 - 1.7 * E4((t - 13000) / 500), 62, 52, None, None, 0, 1, 0, 'toque duplo: volta')
            for t in range(0, 13800, 40):
                e = est(t); poe(pg, *e[:9]); x = shot(pg, {'x': 0, 'y': 71, 'width': 390, 'height': 600}, 480)
                Bq = Image.new('RGB', (x.width + 40, x.height + 126), '#ece6ea'); dr = ImageDraw.Draw(Bq); dr.text((20, 14), 'Site · manuseio simples · só a peça', font=F(23, 1), fill='#2a1a28'); dr.text((20, 52), e[9], font=F(18, 1), fill=G); Bq.paste(x, (20, 96)); Bq = Bq.crop((0, 0, Bq.width - Bq.width % 2, Bq.height - Bq.height % 2)); Bq.save('%s/%05d.png' % (d, n)); n += 1
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '25', '-i', d + '/%05d.png', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '22', '-movflags', '+faststart', A + 's260_video_site_manuseio_v3.mp4'], check=True); print('ok vídeo', n, 'quadros')
        c.close()
    print('colados rolado:', ol.get(('prop', 1), {}).get('colados'), ol.get(('hoje', 1), {}).get('colados'))
    for k in (0, 1): print('olho celular', 'rolado' if k else 'parado', 'pioras:', [(r, ol['hoje', k].get(r, 0), v) for r, v in ol['prop', k].items() if v > ol['hoje', k].get(r, 0)])
    folha('s260_site_celular_peca_v3', 'Site · página da peça · celular · versão simples', 'Só a peça e três pontinhos. A página não muda de altura.', [('HOJE', V, im['hoje']), ('PROPOSTA (peça do seu vídeo, tratamento novo)', G, im['prop'])])
