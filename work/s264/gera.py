# S264 · site: trocar de cor com a peça girada (mantém o ângulo, cruza suave) e voltar para a vista inicial. Quadros reais do giro do dono (só a luz acertada);
# a SEGUNDA COR é simulada por computador (tom dourado), só para mostrar o manuseio.  python3 gera.py
import os, subprocess, sys, time, shutil, json, math
A = os.path.dirname(os.path.abspath(__file__)) + '/'
src = open(A + '../s260/gera.py').read().replace("os.path.dirname(os.path.abspath(__file__)) + '/'", "'%s../s260/'" % A); exec(src[:src.index('CSS = """')]); exec(src[src.index('def site('):src.index('def poe(')])
A = os.path.dirname(os.path.abspath(__file__)) + '/'
def folha(arq, tit, sub, partes, vertical=False, gap=24):
    W = sum(i.width + gap for _, _, i in partes) - gap + 80; H = 140 + max(i.height for _, _, i in partes) + 60
    B = Image.new('RGB', (W, H), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 24), tit, font=F(29, 1), fill='#2a1a28'); d.text((40, 70), sub, font=F(18), fill='#5b4a57'); x = 40
    for rot, cor, im in partes:
        d.text((x, 120), rot, font=F(19, 1), fill=cor); B.paste(im, (x, 154)); d.rectangle((x - 1, 153, x + im.width, 154 + im.height), outline='#c9bcc5'); x += im.width + gap
    B.save(A + arq + '.jpg', quality=88); print('ok', arq, B.size, flush=True)
CSS = """.pgl .big{touch-action:none;position:relative}.pgl .big img.s4{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#fff}.pgl .big img.s4b{opacity:0}
.pgl .big .zh{display:none!important}
#s4d{position:absolute;left:0;right:0;bottom:14px;display:flex;justify-content:center;gap:9px;pointer-events:none}#s4d i{width:6px;height:6px;border-radius:50%;background:color-mix(in srgb,var(--tx) 22%,transparent)}#s4d i.on{background:var(--tx)}
#s4v{position:absolute;left:10px;bottom:8px;height:44px;padding:0 14px 0 10px;border-radius:999px;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.92);color:var(--tx);border:1px solid color-mix(in srgb,var(--tx) 14%,transparent);font:600 12.5px Inter,system-ui,sans-serif;opacity:0;box-shadow:0 2px 10px rgba(42,31,39,.08)}
#s4c{display:flex;gap:10px;margin:2px 0 6px}#s4c button{width:64px;height:64px;border-radius:16px;padding:3px;background:#fff;border:1px solid color-mix(in srgb,var(--tx) 14%,transparent)}#s4c button.on{border:1.5px solid var(--tx)}#s4c img{width:100%;height:100%;object-fit:cover;border-radius:12px}
#s4f{position:fixed;width:46px;height:46px;border-radius:50%;background:rgba(141,58,105,.2);border:1.5px solid rgba(141,58,105,.65);pointer-events:none;z-index:99999;opacity:0;transform:translate(-50%,-50%)}"""
JS = """([N,FR,Q34,QPF])=>{const b=document.querySelector('.pgl .big'),old=b.querySelector('img');old.style.visibility='hidden';const n=i=>String(i).padStart(3,'0');
 window.__A=[];window.__B=[];for(let i=0;i<N;i++){const a=new Image();a.src='/s260c/p'+n(i)+'.jpg';window.__A.push(a);const c=new Image();c.src='/s260d/p'+n(i)+'.jpg';window.__B.push(c)}
 b.insertAdjacentHTML('beforeend','<img class="s4 s4a"><img class="s4 s4b"><div id="s4d"><i></i><i></i><i></i></div><span id="s4v" role="button" aria-label="Volver a la vista inicial"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.6-5.9M4 5v4h4"/></svg>Vista inicial</span>');
 const lab=[...document.querySelectorAll('.cthl')][0],row=document.querySelector('.cth');if(row)row.style.display='none';
 const alvo=row||lab;alvo.insertAdjacentHTML('afterend','<div id="s4c"><button class="on"><img src="/s260c/p'+n(FR)+'.jpg"></button><button><img src="/s260d/p'+n(FR)+'.jpg"></button></div>');document.body.insertAdjacentHTML('beforeend','<i id="s4f"></i>');
 const nomes=['Grafito','Dorado'],PR=[FR,Q34,QPF];
 window.s4=(q,mix,volta,dx,dy)=>{q=Math.max(0,Math.min(N-1,q));const i=Math.round(q);b.querySelector('.s4a').src=window.__A[i].src;const B=b.querySelector('.s4b');B.src=window.__B[i].src;B.style.opacity=mix;
  let perto=0,dm=1e9;PR.forEach((p,k)=>{if(Math.abs(p-q)<dm){dm=Math.abs(p-q);perto=k}});document.querySelectorAll('#s4d i').forEach((x,k)=>x.classList.toggle('on',k===perto));
  document.querySelectorAll('#s4c button').forEach((x,k)=>x.classList.toggle('on',k===(mix>.5?1:0)));if(lab){const t=[...lab.childNodes].filter(x=>x.nodeType===1).pop();if(t)t.textContent=nomes[mix>.5?1:0]}
  document.querySelector('#s4v').style.opacity=volta;const d=document.querySelector('#s4f');if(dx!=null){d.style.opacity=1;d.style.left=dx+'px';d.style.top=dy+'px'}else d.style.opacity=0};
 return Promise.all([...window.__A,...window.__B].map(a=>a.decode().catch(()=>0))).then(()=>{const r=document.querySelectorAll('#s4c button')[1].getBoundingClientRect(),v=document.querySelector('#s4v').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,v.x+v.width/2,v.y+v.height/2]})}"""
def poe(pg, *a): pg.evaluate("a=>window.s4(...a)", list(a)); pg.wait_for_timeout(60)
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    im = {}; ol = {}
    for modo in ('hoje', 'prop'):
        c, pg = site(b, 390, 844)
        if modo == 'prop': pg.add_style_tag(content=CSS); P = pg.evaluate(JS, [N, FR, Q34, QPF]); print('  pontos:', [round(x) for x in P]); poe(pg, Q34, 0, 1, None, None)
        pg.wait_for_timeout(300); ol[modo, 0] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; im[modo] = shot(pg, None, 430)
        if modo == 'prop':
            clip = {'x': 0, 'y': 137, 'width': 390, 'height': 480}; q = []
            for leg, a in (('1 · girada na 3/4', (Q34, 0, 1, None, None)), ('2 · toca na outra cor', (Q34, .5, 1, P[0], P[1])), ('3 · mesma posição, outra cor', (Q34, 1, 1, None, None)), ('4 · toca em Vista inicial', (Q34, 1, 1, P[2], P[3])), ('5 · volta para a frente', (FR, 1, 0, None, None))):
                poe(pg, *a); pg.wait_for_timeout(150); q.append((leg, '#5b4a57', shot(pg, clip, 330)))
            folha('s264_site_trocar_cor_e_voltar', 'Site · trocar de cor com a peça girada · voltar à vista inicial', 'A cor troca no MESMO ângulo, cruzando suave. "Vista inicial" só aparece quando a peça saiu do lugar. Segunda cor simulada por computador.', q)
            d = '/tmp/s264v'; shutil.rmtree(d, ignore_errors=True); os.makedirs(d); n = 0; S = lambda k: (lambda k: k * k * (3 - 2 * k))(max(0, min(1, k))); E4 = lambda k: 1 - (1 - max(0, min(1, k))) ** 4
            def est(t):
                if t < 600: return (FR, 0, 0, None, None, 'começa na vista inicial')
                if t < 2200: k = S((t - 600) / 1600); return (FR + (Q34 - FR) * k, 0, E4((t - 900) / 300), 290 - 110 * k, 320, 'arrasta: gira até a 3/4')
                if t < 2800: return (Q34, 0, 1, None, None, 'aparece "Vista inicial" porque a peça saiu do lugar')
                if t < 3300: return (Q34, 0, 1, P[0], P[1], 'toca na outra cor')
                if t < 3700: return (Q34, S((t - 3300) / 320), 1, None, None, 'a cor troca no mesmo ângulo')
                if t < 4300: return (Q34, 1, 1, None, None, 'a cor troca no mesmo ângulo')
                if t < 5900: k = S((t - 4300) / 1600); return (Q34 + (QPF - Q34) * k, 1, 1, 250 - 110 * k, 320, 'continua girando na cor nova')
                if t < 6300: return (QPF, 1, 1, P[0] - 74, P[1], 'troca de cor de novo, agora no perfil')
                if t < 6700: return (QPF, 1 - S((t - 6300) / 320), 1, None, None, 'mesmo ângulo, cor anterior')
                if t < 7300: return (QPF, 0, 1, None, None, 'mesmo ângulo, cor anterior')
                if t < 7800: return (QPF, 0, 1, P[2], P[3], 'toca em Vista inicial')
                if t < 9000: return (QPF + (FR - QPF) * E4((t - 7800) / 1100), 0, 1 - S((t - 8600) / 300), None, None, 'a peça gira sozinha de volta para a frente')
                return (FR, 0, 0, None, None, 'de volta à vista inicial')
            for t in ([] if os.environ.get('SEMVIDEO') else range(0, 9800, 40)):
                e = est(t); poe(pg, *e[:5]); x = shot(pg, {'x': 0, 'y': 71, 'width': 390, 'height': 600}, 480)
                Bq = Image.new('RGB', (x.width + 40, x.height + 126), '#ece6ea'); dr = ImageDraw.Draw(Bq); dr.text((20, 14), 'Site · cor e vista inicial (2ª cor simulada)', font=F(22, 1), fill='#2a1a28'); dr.text((20, 52), e[5], font=F(18, 1), fill=G); Bq.paste(x, (20, 96)); Bq = Bq.crop((0, 0, Bq.width - Bq.width % 2, Bq.height - Bq.height % 2)); Bq.save('%s/%05d.png' % (d, n)); n += 1
            os.environ.get('SEMVIDEO') or subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '25', '-i', d + '/%05d.png', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '22', '-movflags', '+faststart', A + 's264_video_site_cor_e_vista_inicial.mp4'], check=True); print('ok vídeo', n)
            poe(pg, Q34, 0, 1, None, None)
        pg.evaluate("document.querySelector('.scrim.pg').scrollBy(0,500)"); pg.wait_for_timeout(300); _o = pg.evaluate(OLHO); ol[modo, 1] = {x['r']: x['n'] for x in _o}; print('  tampado', modo, [(x['r'], x.get('ex')) for x in _o if x['r'] in ('tampado', 'fileira torta')]); c.close()
    for k in (0, 1): print('olho', 'rolado' if k else 'parado', 'pioras:', [(r, ol['hoje', k].get(r, 0), v) for r, v in ol['prop', k].items() if v > ol['hoje', k].get(r, 0)])
    folha('s264_site_celular_peca', 'Site · página da peça · celular', 'Peça girada na 3/4, com as cores logo abaixo e "Vista inicial" à mão.', [('HOJE', V, im['hoje']), ('PROPOSTA', G, im['prop'])])
