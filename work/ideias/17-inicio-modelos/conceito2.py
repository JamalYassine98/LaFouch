"""IDEIAS 17d · Início reformulado (dono 26/11 13:39–13:41): reformular de verdade, mantendo os elementos da nossa
família e a HARMONIA do site (uma atmosfera só: fundo rosé claro #fbf7fa, cartões brancos com borda fina e o mesmo
arredondado, Fraunces nos títulos, Inter no texto, vinho só nos detalhes). Nenhum bloco escuro na página; o único escuro
é o véu suave da foto da capa. Ritmo inspirado na Made (vídeo do dono), feito do nosso jeito.
Seções (todas desenhadas de novo, com os dados reais da página): capa de tela inteira · faixa de confiança · Novidades
em carrossel · Solar/Armações em cartões altos com a modelo · Veja no rosto · Mais vendidos em carrossel ·
Em movimento (vídeos curtos do Semp) · Comece por aqui (guias de imagem fixa, como estão) · Para lojistas (claro).
Uso: python3 conceito2.py (site servido em :8765)."""
import base64, io, os, sys
from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright
AQ = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQ); from abre import abre
def b64(p, w=1000):
    im = Image.open(os.path.join(AQ, p)).convert('RGB'); im.thumbnail((w, 4000)); b = io.BytesIO(); im.save(b, 'JPEG', quality=86)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
CAFE, ESTU = b64('semp-cafe-campanha.jpg'), b64('semp-estudio-vitrine.jpg')
CSS = """
main .wrap{min-width:0!important;max-width:100%!important}
#home{display:block!important;min-width:0!important;width:100%!important;max-width:100%!important;flex:1 1 auto!important}
.nx h2{border:0!important;padding:0!important}
.nx{margin:0 0 40px}
.nx h2{font:500 22px/1.2 Fraunces,Georgia,serif;color:#2a1f27;margin:0}
.nx .hd{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 16px}
.nx .hd a{font:500 15px Inter,system-ui;color:#943d6f;text-decoration:none}
.rot{font:600 11px Inter,system-ui;letter-spacing:.16em;text-transform:uppercase;color:#943d6f}
.cartao{background:#fff;border:1px solid #943d6f1f;border-radius:16px;overflow:hidden}
/* capa */
.capa{position:relative;overflow:hidden;color:#fff;margin:0 0 24px}
.capa .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:42% 20%}
.capa .vt{position:absolute;left:0;right:0;top:0;height:36%;background:linear-gradient(#1f0d1788,#1f0d1700)}
.capa .vb{position:absolute;left:0;right:0;bottom:0;height:40%;background:linear-gradient(#1f0d1700,#1f0d17a6)}
.capa .cima{position:absolute;left:24px;right:24px;top:32px;text-align:center}
.capa .cima .rot{color:#fff;opacity:.92}
.capa h1{font:500 34px/1.1 Fraunces,Georgia,serif;margin:10px 0 0;color:#fff}
.capa h1 em{color:#f6e3ec!important}
.capa .baixo{position:absolute;left:24px;right:24px;bottom:28px;text-align:center}
.capa p{font:15px/1.45 Inter,system-ui;margin:0 0 16px}
.capa .bt{display:inline-block;padding:12px 28px;border:1px solid #fff;border-radius:999px;font:500 15px Inter,system-ui}
.capa .pts{display:flex;gap:8px;justify-content:center;margin-top:20px}.capa .pts i{width:6px;height:6px;border-radius:9px;background:#fff8}.capa .pts i.on{width:22px;background:#fff}
/* confiança */
.conf{display:flex;justify-content:space-between;border-top:1px solid #943d6f24;border-bottom:1px solid #943d6f24;padding:14px 0;margin:0 0 40px}
.conf div{text-align:center;flex:1;font:12.5px/1.4 Inter,system-ui;color:#6b5a66}.conf b{display:block;font-weight:600;color:#943d6f;font-size:12px;letter-spacing:.04em}
.conf div+div{border-left:1px solid #943d6f1f}
/* carrossel */
.car{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;margin-right:-24px;padding-right:24px;scrollbar-width:none}
.car > *{flex:0 0 46%!important;scroll-snap-align:start;min-width:0}
/* categorias */
.cats{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.cats .cartao img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover}
.cats .tx{padding:12px 14px 14px}.cats .tx small{display:block;font:600 11px Inter;letter-spacing:.14em;text-transform:uppercase;color:#6b5a66;margin-bottom:2px}
.cats .tx span{font:500 20px Fraunces,Georgia,serif;color:#2a1f27}
.semp{aspect-ratio:3/4;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,#fcf3f8,#f2dce8);color:#943d6f;font:600 11px/1.6 Inter;letter-spacing:.06em;border-bottom:1px dashed #943d6f55}
/* editorial */
.ed img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover}
.ed .tx{padding:22px 20px 24px;text-align:center}
.ed h2{font-size:26px!important;margin:8px 0 8px!important}.ed h2 em{color:#943d6f}
.ed p{font:15px/1.5 Inter,system-ui;color:#6b5a66;margin:0 0 12px}.ed a{font:500 15px Inter;color:#943d6f;text-decoration:none}
/* vídeos */
.vid > .v{flex:0 0 58%!important;aspect-ratio:9/16;position:relative}
.vid .semp{position:absolute;inset:0;aspect-ratio:auto;border:0;flex-direction:column;gap:10px}
.vid .pl{width:52px;height:52px;border-radius:50%;border:1.5px solid #943d6f;display:flex;align-items:center;justify-content:center;font-size:18px}
.vid .tag{position:absolute;left:10px;right:10px;bottom:10px;background:#fff;border:1px solid #943d6f1f;border-radius:12px;padding:10px 12px;font:500 13px Inter;color:#2a1f27;display:flex;justify-content:space-between}
/* lojistas */
.loj{display:flex;align-items:center;gap:14px;padding:18px}
.loj img{width:96px;height:96px;object-fit:contain;flex:0 0 96px}
.loj h3{font:500 20px/1.2 Fraunces,Georgia,serif;color:#2a1f27;margin:4px 0 6px}.loj p{font:13.5px/1.45 Inter;color:#6b5a66;margin:0 0 10px}
.loj a{font:500 14px Inter;color:#943d6f;text-decoration:none}
"""
JS = r"""([CAFE, ESTU, CSS]) => {
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  const home = document.getElementById('home');
  const q = s => home.querySelector(s), qa = s => [...home.querySelectorAll(s)];
  const hs = qa('.hsh'), grades = qa('.hg');
  const novos = [...grades[0].children].map(e => e.cloneNode(true)), maisv = [...grades[1].children].map(e => e.cloneNode(true));
  const guias = q('.hgu').cloneNode(true);
  const cats = qa('.hcat a').map(a => ({href: a.getAttribute('href'), mf: a.dataset.mf, n: a.querySelector('small').textContent, nome: a.querySelector('span:last-child').lastChild.textContent.trim()}));
  const ata = q('.hata img').getAttribute('src');
  const destCod = q('#hdst [data-open]').dataset.open;
  const topH = document.querySelector('.top').getBoundingClientRect().height, W = document.documentElement.clientWidth;
  const L = home.getBoundingClientRect().left;
  const sec = (tit, mais) => { const s = document.createElement('section'); s.className = 'nx'; s.innerHTML = `<div class=hd><h2>${tit}</h2>${mais ? '<a href="#vitrine">Ver todos ›</a>' : ''}</div>`; return s; };
  home.innerHTML = '';
  // capa
  const capa = document.createElement('section'); capa.className = 'capa'; capa.dataset.open = destCod;
  capa.style.cssText = `height:${innerHeight - topH}px;width:${W}px;margin-left:${-L}px`;
  capa.innerHTML = `<img class=bg src="${CAFE}"><div class=vt></div><div class=vb></div><div class=cima><div class=rot>Destaque da semana</div><h1>Armação LaFouch <em>quadrada</em></h1></div><div class=baixo><p>Acetato rosé com detalhe dourado na haste.</p><span class=bt>Ver a peça</span><div class=pts><i class=on></i><i></i><i></i><i></i></div></div>`;
  home.appendChild(capa);
  // confiança
  const cf = document.createElement('div'); cf.className = 'conf';
  cf.innerHTML = '<div><b>Delivery</b>todo o Paraguai</div><div><b>Pagamento seguro</b>PIX ou Banco Familiar</div><div><b>Retirada</b>em CDE</div>'; home.appendChild(cf);
  // novidades
  let s = sec('Novidades', true); const c1 = document.createElement('div'); c1.className = 'car'; novos.forEach(n => c1.appendChild(n)); s.appendChild(c1); home.appendChild(s);
  // categorias
  s = sec('Compre por categoria'); const cg = document.createElement('div'); cg.className = 'cats';
  cg.innerHTML = cats.map(c => `<a class=cartao href="${c.href}" data-mf="${c.mf}">${/arma/i.test(c.nome) ? `<img src="${CAFE}" style="object-position:45% 18%">` : `<div class=semp>FOTO DO SEMP<br>modelo usando<br>óculos de sol da loja</div>`}<div class=tx><small>${c.n}</small><span>${c.nome}</span></div></a>`).join('');
  s.appendChild(cg); home.appendChild(s);
  // veja no rosto
  s = document.createElement('section'); s.className = 'nx'; s.innerHTML = `<div class="cartao ed"><img src="${ESTU}"><div class=tx><div class=rot>Veja no rosto</div><h2>A armação certa <em>muda</em> o rosto</h2><p>Cada peça com a foto no rosto, para você ver o tamanho e a cor antes de reservar.</p><a href="#vitrine">Ver catálogo ›</a></div></div>`; home.appendChild(s);
  // mais vendidos
  s = sec('Mais vendidos', true); const c2 = document.createElement('div'); c2.className = 'car'; maisv.forEach(n => c2.appendChild(n)); s.appendChild(c2); home.appendChild(s);
  // em movimento
  s = sec('Em movimento'); const c3 = document.createElement('div'); c3.className = 'car vid';
  c3.innerHTML = novos.slice(0, 3).map(n => { const cod = n.dataset.open, pz = (n.querySelector('.hp')||{}).textContent || ''; return `<div class="cartao v"><div class=semp><span class=pl>▶</span>VÍDEO CURTO DO SEMP<br>modelo usando a ${cod}</div><div class=tag><span>${cod}</span><b>${pz}</b></div></div>`; }).join('');
  s.appendChild(c3); home.appendChild(s);
  // comece por aqui (como está)
  s = sec('Comece por aqui'); s.appendChild(guias); home.appendChild(s);
  // para lojistas (claro, na família)
  s = sec('Para lojistas'); s.insertAdjacentHTML('beforeend', `<div class="cartao loj"><img src="${ata}" alt=""><div><div class=rot>Para revender</div><h3>Compre em quantidade</h3><p>Preços especiais para lojas, revendedores e empresas, com atendimento exclusivo.</p><a href="#" data-gpan="atacado">Solicitar orçamento ›</a></div></div>`); home.appendChild(s);
  return 'ok ' + W + ' L=' + L;
}"""
def prep(pg):
    for y in range(0, 12000, 300): pg.evaluate('window.scrollTo(0,%d)' % y); pg.wait_for_timeout(50)
    pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(700)
    pg.evaluate("document.querySelectorAll('*').forEach(e=>{if(getComputedStyle(e).contentVisibility!='visible')e.style.contentVisibility='visible'}); document.querySelectorAll('.rv').forEach(e=>e.classList.add('in')); document.querySelectorAll('body *').forEach(e=>{const c=getComputedStyle(e); if(c.opacity==='0'&&e.offsetHeight>20){e.style.setProperty('opacity','1','important');e.style.setProperty('transform','none','important')}})")
    pg.wait_for_timeout(400)
with sync_playwright() as p:
    for nome, prop in (('hoje', False), ('proposta', True)):
        b, pg = abre(p)
        if prop: print(pg.evaluate(JS, [CAFE, ESTU, CSS])); pg.wait_for_timeout(700)
        prep(pg)
        if prop:
            sw = pg.evaluate('document.documentElement.scrollWidth'); print('largura da página', sw)
        pg.screenshot(path='/tmp/%s.png' % nome, full_page=True); b.close()
H, P = Image.open('/tmp/hoje.png'), Image.open('/tmp/proposta.png')
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 30)
hh = max(H.height, P.height); pr = Image.new('RGB', (H.width * 2 + 60, hh + 80), '#e9e4e8'); d = ImageDraw.Draw(pr)
d.text((20, 22), 'HOJE', fill='#555', font=f); d.text((H.width + 40, 22), 'PROPOSTA · Início reformulado', fill='#943d6f', font=f)
pr.paste(H, (20, 70)); pr.paste(P, (H.width + 40, 70)); pr.thumbnail((1000, 7000)); pr.save('esboco-17d-inicio-reformulado.jpg', quality=84)
print('ok', H.size, P.size, pr.size)
