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
CAFE = b64('semp-cafe-campanha.jpg', (230, 160, 1200, 1373))      # recorte 4:5 com o rosto e a armação
ESTU = b64('semp-estudio-vitrine.jpg', (0, 0, 896, 1120))
JS = r"""([CAFE, ESTU]) => {
  const st = document.createElement('style'); st.textContent = `
  #hdst.lfx-camp{border:0!important;border-radius:0!important;width:100vw!important;max-width:none!important;margin-left:calc(50% - 50vw)!important;margin-right:0!important;background:transparent!important;box-shadow:none!important;overflow:visible}
  .lfx-foto{display:block;width:100%;aspect-ratio:4/5;object-fit:cover}
  .lfx-ed{width:100vw;margin:32px 0 8px calc(50% - 50vw);background:linear-gradient(135deg,#fcf3f8,#f2dce8)}
  .lfx-ed img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover}
  .lfx-ed .tx{padding:24px 24px 32px;text-align:center}
  .lfx-rot{font:600 12px Inter,system-ui;letter-spacing:.16em;text-transform:uppercase;color:#943d6f}
  .lfx-ed h2{font:500 28px/1.15 Fraunces,Georgia,serif;color:#2a1f27;margin:10px 0 8px}
  .lfx-ed h2 i{color:#943d6f}
  .lfx-ed p{font:15px/1.5 Inter,system-ui;color:#6b5a66;margin:0 0 16px}
  .lfx-ed a{color:#943d6f;text-decoration:none;font:500 16px Inter,system-ui}
  .lfx-tocar{position:absolute;inset:0;border:2px dashed #943d6f;border-radius:14px;background:#fcf3f8e6;display:flex;align-items:center;justify-content:center;text-align:center;font:600 12px/1.4 Inter;color:#943d6f;padding:8px}`;
  document.head.appendChild(st);
  // 1) destaque da semana com a modelo
  const d = document.getElementById('hdst'); d.classList.add('lfx-camp');
  const fig = d.querySelector('.hdi');
  const foto = document.createElement('img'); foto.className = 'lfx-foto'; foto.src = CAFE; fig.replaceWith(foto);
  d.querySelector('.hdt h1').innerHTML = 'Armação LaFouch <em>quadrada</em>';
  d.querySelector('.hpr').remove();
  // 2) catálogo: ao tocar, a modelo usando a peça
  const card = document.querySelector('#home .hg .hc'); const ci = card.querySelector('.hci'); ci.style.position='relative';
  const t = document.createElement('div'); t.className='lfx-tocar'; t.innerHTML='AO TOCAR<br>a modelo usando<br>esta peça<br>(foto do Semp)'; ci.appendChild(t);
  // 3) Veja no rosto
  const hs = [...document.querySelectorAll('#home .hsh')]; const mv = hs.find(e=>/Mais vendidos/.test(e.innerText)); const grade = mv.nextElementSibling;
  const ed = document.createElement('section'); ed.className='lfx-ed';
  ed.innerHTML = `<img src="${ESTU}"><div class=tx><div class=lfx-rot>Veja no rosto</div><h2>A armação certa <i>muda</i> o rosto</h2><p>Cada peça com a foto no rosto, para você ver o tamanho e a cor antes de reservar.</p></div>`;
  const ver = [...document.querySelectorAll('#hdst a, #hdst button')].find(e=>/catálogo/.test(e.innerText)); if (ver) ed.querySelector('.tx').appendChild(ver.cloneNode(true));
  grade.after(ed);
  const W = document.documentElement.scrollWidth;
  for (const el of [d, ed]) { el.style.setProperty('width', W+'px', 'important'); el.style.setProperty('margin-left', '0', 'important');
    const L = el.getBoundingClientRect().left; el.style.setProperty('margin-left', (-L)+'px', 'important'); }
  return 'ok ' + W;
}"""
sys.path.insert(0, '/home/claude/prev'); from abre import abre
with sync_playwright() as p:
    for nome, prop in (('hoje', False), ('proposta', True)):
        b, pg = abre(p)
        if prop: print(pg.evaluate(JS, [CAFE, ESTU])); pg.wait_for_timeout(600)
        pg.screenshot(path='/tmp/%s.png' % nome, full_page=True); b.close()
H, P = Image.open('/tmp/hoje.png'), Image.open('/tmp/proposta.png')
def faixa(im, y0, y1): return im.crop((0, y0, im.width, min(y1, im.height)))
for i, (a0, a1, b0, b1) in enumerate([(0, 1700, 0, 2300), (1500, 4300, 2100, 6300)]):
    h, pp = faixa(H, a0, a1), faixa(P, b0, b1); hh = max(h.height, pp.height)
    pr = Image.new('RGB', (h.width * 2 + 60, hh + 80), '#e9e4e8')
    from PIL import ImageDraw, ImageFont; f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 34); d = ImageDraw.Draw(pr)
    d.text((20, 22), 'HOJE', fill='#555', font=f); d.text((h.width + 40, 22), 'PROPOSTA · Início com modelos', fill='#943d6f', font=f)
    pr.paste(h, (20, 70)); pr.paste(pp, (h.width + 40, 70)); pr.thumbnail((1500, 4000)); pr.save('esboco-17-inicio-parte%d.jpg' % (i + 1), quality=86)
print('pranchas ok', H.size, P.size)
