# S254 · vídeos das decisões do dono (relatório S253, item 8) e de exemplos: editar o Início, carregando com Cancelar, Mochi, leitor da haste.  python3 video.py
import os, subprocess, sys, time, shutil, math
AQ = os.path.dirname(os.path.abspath(__file__)) + '/'
src = open(AQ + '../s247/gera.py').read().replace("os.path.dirname(os.path.abspath(__file__)) + '/'", "'%s../s247/'" % AQ); exec(src[:src.index("try:\n  with sync_playwright")])
SO = os.environ.get('SO', 'editar carregando mochi leitor').split(); X = 'cubic-bezier(.16,1,.3,1)'
def filme(nome, tit, sub, a, b_, rot=('HOJE', 'PROPOSTA'), rep=1, fps=30):
    d = '/tmp/s254_' + nome; shutil.rmtree(d, ignore_errors=True); os.makedirs(d); n = 0
    def quadro(x, y):
        g = 20; W = x.width + y.width + g + 60; H = max(x.height, y.height) + 150; W += W % 2; H += H % 2
        B = Image.new('RGB', (W, H), '#ece6ea'); dr = ImageDraw.Draw(B); dr.text((30, 16), tit, font=F(24, 1), fill='#2a1a28'); dr.text((30, 50), sub, font=F(18), fill='#5b4a57')
        dr.text((30, 86), rot[0], font=F(22, 1), fill=V); B.paste(x, (30, 118)); dr.text((30 + x.width + g, 86), rot[1], font=F(22, 1), fill=G); B.paste(y, (30 + x.width + g, 118)); return B
    seqs = [(a[0], b_[0], 20)] + [(x, y, rep) for x, y in zip(a[1:], b_[1:])] + [(a[-1], b_[-1], 36)]
    for x, y, r in seqs:
        im = quadro(x, y)
        for _ in range(r): im.save('%s/%05d.png' % (d, n)); n += 1
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', d + '/%05d.png', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '21', '-movflags', '+faststart', AQ + nome + '.mp4'], check=True)
    print('ok', nome, n, 'quadros', '%.1f s' % (n / fps), os.path.getsize(AQ + nome + '.mp4') // 1024, 'kB', flush=True)
NOME = "([ns,t])=>document.getAnimations().forEach(a=>{if(ns.includes(a.animationName)){a.pause();a.currentTime=t}})"
ZERA = "()=>document.getAnimations().forEach(a=>{const c=a.effect&&a.effect.getComputedTiming();if(c&&c.iterations!==Infinity){try{a.finish()}catch(e){}}})"
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'])
    R = {}
    # ───── decisão 4 · atalhos no modo editar do Início
    if 'editar' in SO:
      for modo in ('h', 'p'):
        c, pg = app(b); pg.evaluate("scrollTo(0,400)"); pg.wait_for_timeout(300); fr = [shot(pg, None, 380)]
        pg.evaluate("()=>{window.__LF.S.inicioEd=true;window.__LF.setView('estoque');window.__LF.setView('inicio')}"); pg.wait_for_timeout(700); pg.evaluate(ZERA); pg.evaluate("scrollTo(0,400)"); pg.wait_for_timeout(200)
        if modo == 'p': pg.evaluate("()=>{document.getAnimations().forEach(a=>{if(a.animationName==='wob')a.cancel()});const st=document.createElement('style');st.textContent='.twrap .tl{animation:none!important;opacity:1!important}';document.head.appendChild(st);window.__tw=[...document.querySelectorAll('#v-inicio .twrap')]}")
        for t in range(0, 2400, 66):
            if modo == 'h': pg.evaluate(NOME, [['wob'], t])
            else: pg.evaluate("t=>window.__tw.forEach((w,i)=>{const k=Math.max(0,Math.min(1,(t-i*16)/320)),e=1-Math.pow(1-k,4);w.style.transform='translateY('+(-2*e)+'px)';w.style.filter='drop-shadow(0 '+(6*e)+'px '+(10*e)+'px rgba(42,31,39,'+(.16*e)+'))'})", t)
            pg.wait_for_timeout(15); fr.append(shot(pg, None, 380))
        R[modo] = fr; c.close()
      filme('s254_video_app_editar_inicio', 'App · Início · entrar no modo de editar os atalhos', 'Hoje balançam sem parar · proposta: sobem 2 px com sombra e param', R['h'], R['p'], rep=2)
    # ───── decisão 5 · carregando (com Cancelar aos 4 s)
    if 'carregando' in SO:
      for modo in ('h', 'p'):
        c, pg = app(b); pg.evaluate("window.__LF.setView('estoque')"); pg.wait_for_timeout(1000); pg.evaluate("document.querySelector('#btnAdd').click()"); pg.wait_for_timeout(800); fr = [shot(pg, None, 380)]
        if modo == 'h': pg.evaluate("""()=>{const d=document.createElement('div');d.id='loadFoto';d.style.cssText='position:fixed;inset:0;z-index:99999;display:flex;justify-content:center;align-items:flex-start;padding-top:calc(env(safe-area-inset-top,0px) + 70px);background:rgba(0,0,0,.38);pointer-events:auto;touch-action:none';const pl=document.createElement('div');pl.className='busyPill';pl.innerHTML='<span class="busy" role="status"><span><span>Analisando código</span><span id="s254d" style="display:inline-block;min-width:1.2em;text-align:left">.</span></span></span>';d.appendChild(pl);document.body.appendChild(d)}""")
        else: pg.evaluate("""()=>{const r=document.querySelector('#btnFoto').getBoundingClientRect(),im=(document.querySelector('#addModal img')||document.querySelector('.pcard img')||{}).src||'';const d=document.createElement('div');d.id='s254ov';d.style.cssText='position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:rgba(20,12,18,0);font-family:Inter,system-ui,sans-serif';
          d.innerHTML='<div id="s254c" style="width:292px;background:var(--panel,#fff);color:var(--fg,#2a1f27);border-radius:26px;padding:22px 22px 18px;box-shadow:0 24px 60px -24px rgba(20,12,18,.55);text-align:center;transform-origin:'+(r.left+r.width/2-49)+'px '+(r.top+r.height/2-300)+'px"><div style="position:relative;width:132px;height:88px;margin:0 auto 16px;border-radius:16px;overflow:hidden;background:#f3eef2"><img src="'+im+'" style="width:100%;height:100%;object-fit:contain"><i id="s254l" style="position:absolute;top:0;bottom:0;left:0;width:38px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent)"></i></div><div id="s254t" style="font:500 20px Georgia,serif;letter-spacing:-.01em">Lendo o código</div><div id="s254s" style="font-size:12.5px;opacity:.6;margin-top:6px;letter-spacing:.04em">Código · Medidas · Cor</div><div style="height:2px;border-radius:2px;background:color-mix(in srgb,currentColor 12%,transparent);margin:18px 6px 0;overflow:hidden"><i id="s254p" style="display:block;height:100%;width:100%;background:currentColor;opacity:.75;transform-origin:0 50%;transform:scaleX(0)"></i></div><div id="s254x" style="margin-top:14px;font:600 14px Inter,system-ui,sans-serif;opacity:0;height:20px">Cancelar</div></div>';document.body.appendChild(d)}""")
        for t in range(0, 6800, 66):
            if modo == 'h': pg.evaluate("t=>{document.querySelector('#s254d').textContent=['.','..','...'][Math.floor(t/420)%3]}", t)
            else: pg.evaluate("""t=>{const E=k=>1-Math.pow(1-Math.max(0,Math.min(1,k)),4),o=document.querySelector('#s254ov'),c=document.querySelector('#s254c'),e=E(t/320);o.style.background='rgba(20,12,18,'+(.42*e)+')';c.style.transform='scale('+(.62+.38*e)+')';c.style.opacity=e;
              document.querySelector('#s254l').style.transform='translateX('+(-40+((t%1700)/1700)*190)+'px)';
              const et=t<2300?0:t<4500?1:2,nomes=['Lendo o código','Lendo as medidas','Conferindo a cor'],ini=[0,2300,4500][et],tx=document.querySelector('#s254t');tx.textContent=nomes[et];tx.style.opacity=E((t-ini)/240);
              document.querySelector('#s254p').style.transform='scaleX('+(.9*(1-Math.exp(-t/2600)))+')';document.querySelector('#s254x').style.opacity=.75*E((t-4000)/320)}""", t)
            pg.wait_for_timeout(12); fr.append(shot(pg, None, 380))
        R[modo] = fr; c.close()
      filme('s254_video_app_carregando', 'App · carregando ao ler a foto de uma peça', 'Proposta: cartão nasce do botão Foto · etapas · linha fina · Cancelar aos 4 s', R['h'], R['p'], rep=2)
    # ───── decisão 6 · Mochi: padrão próprio × regra geral (respiração para depois de 2 voltas)
    if 'mochi' in SO:
      for modo in ('h', 'p'):
        c, pg = site(b); pg.goto('http://localhost:8811/'); pg.wait_for_timeout(2600); pg.evaluate("document.querySelector('#mnb').click()"); pg.wait_for_timeout(1200); pg.evaluate("document.querySelector('[data-gzopen]').click()"); pg.wait_for_timeout(3500); pg.evaluate(ZERA)
        clip = {'x': 0, 'y': 76, 'width': 390, 'height': 150}; fr = [shot(pg, clip, 760)]
        for t in range(0, 9100, 66):
            pg.evaluate(NOME, [['resp', 'somb'], t if modo == 'h' else (t if t < 5200 else 5200)]); pg.wait_for_timeout(10); fr.append(shot(pg, clip, 760))
        R[modo] = fr; c.close()
      d = '/tmp/s254_mochi'
      def um(nome, a, b_):  # empilhado (um em cima do outro) porque o recorte é largo
        shutil.rmtree(d, ignore_errors=True); os.makedirs(d); n = 0
        for i, (x, y) in enumerate(zip(a, b_)):
            B = Image.new('RGB', (x.width + 60, x.height * 2 + 230), '#ece6ea'); dr = ImageDraw.Draw(B); dr.text((30, 16), 'Site · Mochi parada na tela (ampliada 2×)', font=F(24, 1), fill='#2a1a28'); dr.text((30, 50), 'A respiração dela: sem fim (padrão próprio) × 2 voltas e repousa (regra geral)', font=F(18), fill='#5b4a57')
            dr.text((30, 86), 'PADRÃO DA MOCHI · respira sem parar', font=F(22, 1), fill=V); B.paste(x, (30, 118)); yy = 118 + x.height + 16; dr.text((30, yy), 'REGRA GERAL · para aos 5,2 s', font=F(22, 1), fill=G); B.paste(y, (30, yy + 32))
            for _ in range(2 if 0 < i < len(a) - 1 else 24): B.save('%s/%05d.png' % (d, n)); n += 1
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '30', '-i', d + '/%05d.png', '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '21', '-movflags', '+faststart', AQ + nome + '.mp4'], check=True); print('ok', nome, n, 'quadros', flush=True)
      um('s254_video_site_mochi', R['h'], R['p'])
    # ───── exemplo · leitor da haste
    if 'leitor' in SO:
      LUX = """()=>{const v=document.querySelector('video');let R=v;while(R.parentElement&&R.parentElement!==document.body)R=R.parentElement;window.__R=R;const st=document.createElement('style');st.id='s254lx';
        st.textContent='.s254r{background:#0b0a0c!important}.s254r b{font:500 21px Georgia,serif!important;letter-spacing:-.01em}.s254r .chip{background:transparent!important;border:1px solid rgba(255,255,255,.32)!important;color:#fff!important;border-radius:999px!important;box-shadow:none!important}.s254r video{object-fit:cover!important}'
         +'.s254r .lfv{box-shadow:0 0 0 100vmax rgba(8,6,10,.6)!important;border-radius:18px!important;border:1.5px solid rgba(255,255,255,0)}.s254r .lfl,.s254r .lfg{display:none!important}.s254r .lfc{width:22px!important;height:22px!important;border-width:1.5px!important;border-color:#fff!important;box-shadow:none!important;border-radius:0!important;background:none!important}'
         +'.s254r .lfc.tl{border-right:0!important;border-bottom:0!important;border-top-left-radius:16px!important}.s254r .lfc.tr{border-left:0!important;border-bottom:0!important;border-top-right-radius:16px!important}.s254r .lfc.bl{border-right:0!important;border-top:0!important;border-bottom-left-radius:16px!important}.s254r .lfc.br{border-left:0!important;border-top:0!important;border-bottom-right-radius:16px!important}'
         +'.s254r .busy{font:500 15px Inter,system-ui,sans-serif!important;letter-spacing:.01em}.s254r .busy span span:last-child{display:none!important}'
         +'.s254r input[type=range]{-webkit-appearance:none;appearance:none;height:2px;background:rgba(255,255,255,.3);border-radius:2px}.s254r input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#fff;border:0}'
         +'#s254cod{position:absolute;left:0;right:0;text-align:center;color:#fff;font:500 30px Georgia,serif;letter-spacing:.02em;opacity:0}';
        document.head.appendChild(st);R.classList.add('s254r');const f=R.querySelector('.lfv'),r=f.getBoundingClientRect(),pr=f.parentElement.getBoundingClientRect();const c=document.createElement('div');c.id='s254cod';c.textContent='PY-566';c.style.top=(r.top-pr.top-58)+'px';f.parentElement.appendChild(c);
        const bt=[...R.querySelectorAll('button')].filter(x=>!x.classList.contains('chip')).pop();if(bt){bt.style.cssText+=';background:transparent!important;border:2px solid #fff!important;box-shadow:inset 0 0 0 5px #0b0a0c,inset 0 0 0 40px #fff!important'}}"""
      for modo in ('h', 'p'):
        c = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=1.5, is_mobile=True, has_touch=True, service_workers='block', permissions=['camera']); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', rota)
        pg = c.new_page(); pg.goto('http://localhost:8835/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(800); pg.evaluate("window.__LF.setView('estoque')"); pg.wait_for_timeout(900); pg.evaluate("document.querySelector('#btnAdd').click()"); pg.wait_for_timeout(800); fr = [shot(pg, None, 380)]
        pg.evaluate("document.querySelector('#btnLeitor').click()"); pg.wait_for_timeout(1500 if modo == 'p' else 60)
        if modo == 'p': pg.evaluate(LUX)
        for t in range(0, 4600, 66):
            if modo == 'h': pg.evaluate(NOME, [['lfsw'], t])
            else: pg.evaluate("""t=>{const E=k=>1-Math.pow(1-Math.max(0,Math.min(1,k)),4),R=window.__R,e=E(t/460);R.style.transformOrigin='110px 145px';R.style.transform='scale('+(.28+.72*e)+')';R.style.opacity=Math.min(1,e*1.6);R.style.borderRadius=(26*(1-e))+'px';R.style.overflow='hidden';
              const achou=t>=2700,k=E((t-2700)/320);R.querySelectorAll('.lfc').forEach(x=>x.style.opacity=achou?(1-k):(.55+.45*(.5+.5*Math.sin(t/380))));R.querySelector('.lfv').style.borderColor='rgba(255,255,255,'+(achou?.95*k:0)+')';
              const cd=document.querySelector('#s254cod');cd.style.opacity=achou?k:0;cd.style.transform='translateY('+(achou?8*(1-k):8)+'px)';const tx=R.querySelector('.busy span span');if(tx)tx.textContent=achou?'Código lido':'Procurando o código'}""", t)
            pg.wait_for_timeout(10); fr.append(shot(pg, None, 380))
        R[modo] = fr; c.close()
      filme('s254_video_app_leitor_haste', 'App · Adicionar → Ler haste', 'Câmera falsa (verde). Leitura aos 2,7 s simulada só na proposta.', R['h'], R['p'], rep=2)
finally: srv.terminate()
