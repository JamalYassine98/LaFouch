"""Parte A · câmera muito boa — Hoje × Proposta com o vídeo do manequim (manequim.py) na câmera do simulador.
Hoje: o site de verdade (/tmp/ih) com cada vídeo. Proposta: a mesma tela com os avisos/anel/luz pintados por cima.
Uso: python3 camera2.py → cap/c2-*.png e cap/c2.json"""
import os, json, time
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
from playwright.sync_api import sync_playwright
AQUI = os.path.dirname(os.path.abspath(__file__)); __file__ = os.path.join(AQUI, 'captura.py')
exec(open(__file__).read().split('with sync_playwright()')[0])

ST = "()=>{const e=document.getElementById('camm'),c=document.getElementById('camc'),r=document.querySelector('.fares h3');return [e?e.textContent:'',c?c.textContent:'',r?r.textContent:'']}"
PINTA = r"""(o)=>{const w=document.getElementById('camw'),e=document.getElementById('camm'),ov=document.getElementById('camov');
 const c=document.getElementById('camc');if(c)c.style.visibility='hidden';
 e.style.display='none';let m=document.getElementById('cammP');if(!m){m=e.cloneNode();m.id='cammP';m.style.display='';e.after(m)}m.textContent=o.msg;
 w.classList.toggle=()=>{};w.classList.toggle('ok',false);if(o.ok)w.classList.add('ok');else w.classList.remove('ok');
 m.style.color=o.ok?'#7be8ae':'';
 if(o.luz){ov.style.boxShadow='0 0 0 200vmax rgba(255,250,246,.94)';document.querySelector('.camtop').style.color='#2a1f27';m.style.color='#2a1f27';m.style.textShadow='none';const cb=document.querySelector('.cambot');cb.style.background='none';cb.querySelectorAll('.camv,.camz').forEach(b=>{b.style.color='#2a1f27'});const sh=cb.querySelector('.shut');sh.style.borderColor='#2a1f27';sh.style.boxShadow='inset 0 0 0 5px #2a1f27'}
 let g=document.getElementById('anelP');if(g)g.remove();
 if(o.anel!=null){const r={width:ov.offsetWidth,height:ov.offsetHeight,left:ov.offsetLeft-ov.offsetWidth/2,top:ov.offsetTop-ov.offsetHeight/2},wr={left:0,top:0};g=document.createElementNS('http://www.w3.org/2000/svg','svg');g.id='anelP';
  g.setAttribute('style','position:absolute;pointer-events:none;left:'+(r.left-wr.left-8)+'px;top:'+(r.top-wr.top-8)+'px;width:'+(r.width+16)+'px;height:'+(r.height+16)+'px');
  g.setAttribute('viewBox','0 0 '+(r.width+16)+' '+(r.height+16));
  const el=document.createElementNS('http://www.w3.org/2000/svg','ellipse');el.setAttribute('cx',r.width/2+8);el.setAttribute('cy',r.height/2+8);el.setAttribute('rx',r.width/2+4);el.setAttribute('ry',r.height/2+4);
  el.setAttribute('fill','none');el.setAttribute('stroke','#4ccf8a');el.setAttribute('stroke-width','5');el.setAttribute('stroke-linecap','round');el.setAttribute('pathLength','100');
  el.setAttribute('stroke-dasharray',o.anel+' '+(100-o.anel));el.setAttribute('stroke-dashoffset','-75');g.appendChild(el);w.appendChild(g);ov.style.borderColor='rgba(76,207,138,.35)'}
}"""
# estado: vídeo, o que a Proposta mostra
PROP = {
 'virado': ('virado', dict(msg='Vire o rosto para a câmera')),
 'boca':   ('boca',   dict(msg='Feche a boca e relaxe o rosto')),
 'escuro': ('escuro', dict(msg='Luz da tela ligada · fique parado', luz=True, ok=True, anel=35)),
 'medindo':('ok',     dict(msg='Medindo… fique parado', ok=True, anel=60)),
}
rel = {}
with sync_playwright() as p:
    for est, (vid, o) in PROP.items():
        br = p.chromium.launch(args=['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-video-capture=/tmp/manequim-%s.mjpeg' % vid])
        for nome, base in (('hoje', 'http://localhost:8701'), ('prop', 'http://localhost:8702')):
            ctx = br.new_context(viewport={'width': 386, 'height': 858}, device_scale_factor=2, is_mobile=True, has_touch=True, permissions=['camera'])
            ctx.add_init_script(INIT); ctx.route('**/*', rota); pg = ctx.new_page()
            pg.goto(base + '/?cliente=1&r=formato', wait_until='networkidle'); pg.wait_for_timeout(1200)
            pg.click('#rosto [data-fa]'); pg.wait_for_timeout(600); pg.click('[data-facam]')
            t0 = time.time(); seq = []
            while time.time() - t0 < 30:
                s = pg.evaluate(ST)
                if not seq or seq[-1][1] != s: seq.append((round(time.time() - t0, 1), s))
                if s[0] not in ('Iniciando a câmera…', 'Preparando a análise…', '') or s[2]: break
                pg.wait_for_timeout(200)
            if nome == 'prop':
                pg.evaluate(PINTA, o); pg.wait_for_timeout(300); pg.screenshot(path=f'{OUT}/c2-prop-{est}.png')
            else:
                pg.wait_for_timeout(2300 if est != 'virado' else 2500); pg.screenshot(path=f'{OUT}/c2-hoje-{est}.png')
                while time.time() - t0 < 40:  # Hoje segue até o fim: que resultado dá?
                    s = pg.evaluate(ST)
                    if seq[-1][1] != s: seq.append((round(time.time() - t0, 1), s))
                    if s[2]: pg.wait_for_timeout(800); pg.screenshot(path=f'{OUT}/c2-hoje-{est}-res.png'); break
                    pg.wait_for_timeout(250)
                rel[est] = seq; print(est, seq)
            ctx.close()
        br.close()
json.dump(rel, open(f'{OUT}/c2.json', 'w'), ensure_ascii=False, indent=1)
