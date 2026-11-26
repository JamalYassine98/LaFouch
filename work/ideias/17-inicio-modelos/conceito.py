"""IDEIAS 17 · conceito do Início com modelos (dono 26/11 13:15 "faz um esboço para ver como ficaria").
Base: o site REAL (catalogo, servido local; sem a nuvem: as camadas de manutenção/offline são tiradas) + a base de luxo
(ESTUDO.md e PRINCIPIOS-ELEGANCIA-SEMP.md). Mudanças da proposta, todas no próprio site:
 1) destaque da semana: a foto da modelo usando a peça, de ponta a ponta, no lugar da foto da peça; o bloco de texto
    (rótulo, título com itálico, botões) fica igual, sem a moldura do cartão;
 2) no catálogo, ao tocar numa peça aparece a modelo usando a mesma peça (aqui: lugar marcado, a foto vem do Semp);
 3) bloco novo "Veja no rosto" depois de Mais vendidos (foto de vitrine no rosto + 2 linhas + link).
Fotos: as duas fotos do dono (café = campanha; estúdio = vitrine no rosto). Uso: python3 conceito.py (site em :8765)"""
import base64, io, sys
from PIL import Image
from playwright.sync_api import sync_playwright
def b64(p, box=None, w=900):
    im = Image.open(p).convert('RGB')
    if box: im = im.crop(box)
    im.thumbnail((w, 4000)); b = io.BytesIO(); im.save(b, 'JPEG', quality=86)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
CAFE = b64('semp-cafe-campanha.jpg', None, 1100)   # foto inteira; o recorte é feito pela capa (cover)
ESTU = b64('semp-estudio-vitrine.jpg', (0, 0, 896, 1120))
JS = r"""([CAFE, ESTU]) => {
  const st = document.createElement('style'); st.textContent = `
  #hdst.lfx-camp{border:0!important;border-radius:0!important;width:100vw!important;max-width:none!important;margin-left:calc(50% - 50vw)!important;margin-right:0!important;background:transparent!important;box-shadow:none!important;overflow:visible}
  .lfx-capa{position:relative;overflow:hidden;cursor:pointer;color:#fff}
  .lfx-capa .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:42% 20%}
  .lfx-capa .vt{position:absolute;left:0;right:0;top:0;height:38%;background:linear-gradient(#1f0d1799,#1f0d1700)}
  .lfx-capa .vb{position:absolute;left:0;right:0;bottom:0;height:42%;background:linear-gradient(#1f0d1700,#1f0d17b3)}
  .lfx-capa .cima{position:absolute;left:24px;right:24px;top:32px;text-align:center}
  .lfx-capa .rot{font:600 12px Inter,system-ui;letter-spacing:.18em;text-transform:uppercase;opacity:.92}
  .lfx-capa h1{font:500 34px/1.1 Fraunces,Georgia,serif;margin:10px 0 0;text-shadow:0 1px 12px #0004}
  .lfx-capa h1 em{color:#f6e3ec!important}
  .lfx-capa .baixo{position:absolute;left:24px;right:24px;bottom:28px;text-align:center}
  .lfx-capa p{font:15px/1.45 Inter,system-ui;margin:0 0 16px;opacity:.95}
  .lfx-capa .bt{display:inline-block;padding:12px 28px;border:1px solid #fff;border-radius:999px;font:500 15px Inter,system-ui;letter-spacing:.04em}
  .lfx-capa .pts{display:flex;gap:8px;justify-content:center;margin-top:20px}.lfx-capa .pts i{width:6px;height:6px;border-radius:9px;background:#fff8}.lfx-capa .pts i.on{width:22px;background:#fff}
  .lfx-ed{width:100vw;margin:32px 0 8px calc(50% - 50vw);background:linear-gradient(135deg,#fcf3f8,#f2dce8)}
  .lfx-ed img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover}
  .lfx-ed .tx{padding:24px 24px 32px;text-align:center}
  .lfx-rot{font:600 12px Inter,system-ui;letter-spacing:.16em;text-transform:uppercase;color:#943d6f}
  .lfx-ed h2{font:500 28px/1.15 Fraunces,Georgia,serif;color:#2a1f27;margin:10px 0 8px}
  .lfx-ed h2 i{color:#943d6f}
  .lfx-ed p{font:15px/1.5 Inter,system-ui;color:#6b5a66;margin:0 0 16px}
  #home .hsh{margin-top:40px!important}
  #home .htr{border-top:1px solid #943d6f2e;border-bottom:1px solid #943d6f2e;padding:14px 0!important;margin:0 0 8px!important}
  #home .hata{background:linear-gradient(135deg,#562340 0%,#341527 55%,#1f0d17 100%)!important;border:0!important;padding:6px!important;border-radius:16px!important;box-shadow:none!important}
  #home .hata .hati{display:none!important}
  #home .hatt{border:1px solid rgba(214,178,116,.6);border-radius:12px;padding:30px 22px!important;text-align:center}
  #home .hatt small{color:#e9d3a6!important;letter-spacing:.18em!important}
  #home .hatt h3{color:#fff!important;font-family:Fraunces,Georgia,serif!important}
  #home .hatt p{color:#d9c3d0!important}
  #home .hatt button{background:transparent!important;color:#e9d3a6!important;border-color:#e9d3a6!important}
  #home, #home > *, main .wrap{min-width:0!important}
  .lfx-vid{max-width:calc(100% + 24px)}
  #home .lfx-car{max-width:calc(100% + 24px)!important;display:flex!important;overflow-x:auto;gap:12px;scroll-snap-type:x mandatory;grid-template-columns:none!important;margin-right:-24px!important;padding-right:24px}
  #home .lfx-car > *{flex:0 0 46%;scroll-snap-align:start}
  #home .hcat.lfx-cat a{position:relative;display:block;height:300px;border-radius:16px;overflow:hidden;border:0!important;padding:0!important;background:#2a1f27}
  #home .hcat.lfx-cat .hci{position:absolute!important;inset:0;height:100%!important;margin:0!important;padding:0!important;background:none!important}
  #home .hcat.lfx-cat .hci img{width:100%!important;height:100%!important;object-fit:cover!important;max-width:none!important;max-height:none!important}
  #home .hcat.lfx-cat a::after{content:'';position:absolute;left:0;right:0;bottom:0;height:45%;background:linear-gradient(#1f0d1700,#1f0d17b3)}
  #home .hcat.lfx-cat a > span:last-child{position:absolute;left:16px;right:16px;bottom:16px;z-index:2;color:#fff!important;font:500 22px Fraunces,Georgia,serif!important;text-align:left}
  #home .hcat.lfx-cat small{display:block;color:#f6e3ec!important;font:600 11px Inter!important;letter-spacing:.14em;text-transform:uppercase;margin-bottom:4px}
  .lfx-semp{position:absolute;inset:0;border:2px dashed #e9d3a6;border-radius:16px;display:flex;align-items:center;justify-content:center;text-align:center;color:#e9d3a6;font:600 12px/1.5 Inter;padding:16px 16px 90px;background:linear-gradient(135deg,#562340,#1f0d17)}
  .lfx-vid{display:flex;gap:12px;overflow-x:auto;margin-right:-24px;padding-right:24px}
  .lfx-vid .v{flex:0 0 58%;aspect-ratio:9/16;border-radius:16px;position:relative;overflow:hidden;background:linear-gradient(135deg,#fcf3f8,#f2dce8);border:2px dashed #943d6f66}
  .lfx-vid .pl{position:absolute;left:50%;top:42%;width:56px;height:56px;margin:-28px;border-radius:50%;border:1.5px solid #943d6f;display:flex;align-items:center;justify-content:center;color:#943d6f;font-size:20px}
  .lfx-vid .q{position:absolute;left:12px;right:12px;top:58%;text-align:center;font:600 11px/1.5 Inter;color:#943d6f;letter-spacing:.06em}
  .lfx-vid .tag{position:absolute;left:10px;right:10px;bottom:10px;background:#fff;border-radius:12px;padding:10px 12px;font:500 13px Inter;color:#2a1f27;display:flex;justify-content:space-between}
  .lfx-ed a{color:#943d6f;text-decoration:none;font:500 16px Inter,system-ui}
  .lfx-tocar{position:absolute;inset:0;border:2px dashed #943d6f;border-radius:14px;background:#fcf3f8e6;display:flex;align-items:center;justify-content:center;text-align:center;font:600 12px/1.4 Inter;color:#943d6f;padding:8px}`;
  document.head.appendChild(st);
  // 1) capa de tela inteira (dono 13:23): a foto cobre a tela toda abaixo do topo; o texto fica por cima da foto;
  //    tocar em qualquer lugar da capa abre a página da peça (data-open, o mesmo do botão "Ver modelo")
  const d = document.getElementById('hdst'); const cod = d.querySelector('[data-open]').dataset.open;
  const topH = document.querySelector('.top').getBoundingClientRect().height;
  const cap = document.createElement('section'); cap.id = 'hdst'; cap.className = 'lfx-capa'; cap.dataset.open = cod;
  cap.style.height = (innerHeight - topH) + 'px';
  cap.innerHTML = `<img class=bg src="${CAFE}"><div class=vt></div><div class=vb></div>
    <div class=cima><div class=rot>Destaque da semana</div><h1>Armação LaFouch <em>quadrada</em></h1></div>
    <div class=baixo><p>Acetato rosé com detalhe dourado na haste.</p><span class=bt>Ver a peça</span>
    <div class=pts><i class=on></i><i></i><i></i><i></i></div></div>`;
  d.replaceWith(cap);
  // 2) catálogo: ao tocar, a modelo usando a peça
  const card = document.querySelector('#home .hg .hc'); const ci = card.querySelector('.hci'); ci.style.position='relative';
  const t = document.createElement('div'); t.className='lfx-tocar'; t.innerHTML='AO TOCAR<br>a modelo usando<br>esta peça<br>(foto do Semp)'; ci.appendChild(t);
  // 3) Veja no rosto
  const hs = [...document.querySelectorAll('#home .hsh')]; const nv = hs.find(e=>/Novidades/.test(e.innerText)); const grade = nv.nextElementSibling;
  const ed = document.createElement('section'); ed.className='lfx-ed';
  ed.innerHTML = `<img src="${ESTU}"><div class=tx><div class=lfx-rot>Veja no rosto</div><h2>A armação certa <i>muda</i> o rosto</h2><p>Cada peça com a foto no rosto, para você ver o tamanho e a cor antes de reservar.</p></div>`;
  const lk=document.createElement('a'); lk.href='#vitrine'; lk.textContent='Ver catálogo ›'; ed.querySelector('.tx').appendChild(lk);
  grade.after(ed);
  // 3b) carrosséis: Novidades e Mais vendidos deslizam para o lado (2 peças + a ponta da 3ª)
  document.querySelectorAll('#home .hg').forEach(g=>g.classList.add('lfx-car'));
  // 4) categorias: dois cartões altos com a modelo; o nome em Fraunces por cima
  const cat = document.querySelector('#home .hcat'); cat.classList.add('lfx-cat');
  const [aSol, aArm] = cat.querySelectorAll('a');
  aArm.querySelector('img').src = CAFE; aArm.querySelector('img').style.objectPosition = '45% 18%';
  const ps = document.createElement('div'); ps.className='lfx-semp'; ps.innerHTML='FOTO DO SEMP<br>modelo usando<br>óculos de sol da loja'; aSol.querySelector('.hci').appendChild(ps);
  // 6) vídeos curtos do Semp, depois de Mais vendidos
  const mvh = [...document.querySelectorAll('#home .hsh')].find(e=>/Mais vendidos/.test(e.innerText)); const mvg = mvh.nextElementSibling;
  const vh = mvh.cloneNode(true); vh.querySelector('h2').textContent = 'Em movimento'; const vt = vh.querySelector('a,button,span:not(:first-child)'); if (vt) vt.remove();
  const vr = document.createElement('div'); vr.className='lfx-vid';
  vr.innerHTML = [['AC1055','R$ 100'],['BR44145','R$ 115'],['SL2250','R$ 140']].map(([c,pz])=>`<div class=v><div class=pl>▶</div><div class=q>VÍDEO CURTO DO SEMP<br>modelo usando a ${c}</div><div class=tag><span>${c}</span><b>${pz}</b></div></div>`).join('');
  mvg.after(vh); vh.after(vr);
  const W = document.documentElement.scrollWidth;
  for (const el of [cap, ed]) { el.style.setProperty('width', W+'px', 'important'); el.style.setProperty('margin-left', '0', 'important');
    const L = el.getBoundingClientRect().left; el.style.setProperty('margin-left', (-L)+'px', 'important'); }
  return 'ok ' + W;
}"""
sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__))); from abre import abre
with sync_playwright() as p:
    for nome, prop in (('hoje', False), ('proposta', True)):
        b, pg = abre(p)
        if prop: print(pg.evaluate(JS, [CAFE, ESTU])); pg.wait_for_timeout(600)
        for y in range(0, 12000, 300): pg.evaluate('window.scrollTo(0,%d)' % y); pg.wait_for_timeout(60)
        pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(800)
        pg.evaluate("document.querySelectorAll('*').forEach(e=>{if(getComputedStyle(e).contentVisibility!='visible')e.style.contentVisibility='visible'}); document.querySelectorAll('.rv').forEach(e=>e.classList.add('in')); document.querySelectorAll('body *').forEach(e=>{const c=getComputedStyle(e); if(c.opacity==='0'&&e.offsetHeight>20){e.style.setProperty('opacity','1','important');e.style.setProperty('transform','none','important')}})"); pg.wait_for_timeout(400)
        pg.screenshot(path='/tmp/%s.png' % nome, full_page=True); b.close()
H, P = Image.open('/tmp/hoje.png'), Image.open('/tmp/proposta.png')
def faixa(im, y0, y1): return im.crop((0, y0, im.width, min(y1, im.height)))
for i, (a0, a1, b0, b1) in enumerate([(0, 1266, 0, 1266), (1125, 3225, 1125, 3525)]):
    h, pp = faixa(H, a0, a1), faixa(P, b0, b1); hh = max(h.height, pp.height)
    pr = Image.new('RGB', (h.width * 2 + 60, hh + 80), '#e9e4e8')
    from PIL import ImageDraw, ImageFont; f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 34); d = ImageDraw.Draw(pr)
    d.text((20, 22), 'HOJE', fill='#555', font=f); d.text((h.width + 40, 22), 'PROPOSTA · Início com modelos', fill='#943d6f', font=f)
    pr.paste(h, (20, 70)); pr.paste(pp, (h.width + 40, 70)); pr.thumbnail((1500, 4000)); pr.save('esboco-17-inicio-parte%d.jpg' % (i + 1), quality=86)
print('pranchas ok', H.size, P.size)
hh = max(H.height, P.height); pr = Image.new('RGB', (H.width * 2 + 60, hh + 80), '#e9e4e8'); d = ImageDraw.Draw(pr)
d.text((20, 22), 'HOJE', fill='#555', font=f); d.text((H.width + 40, 22), 'PROPOSTA · página inicial inteira', fill='#943d6f', font=f)
pr.paste(H, (20, 70)); pr.paste(P, (H.width + 40, 70)); pr.thumbnail((1000, 6000)); pr.save('esboco-17-inicio-pagina-inteira.jpg', quality=84)
print('página inteira ok', pr.size)
