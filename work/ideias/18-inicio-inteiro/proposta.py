"""IDEIAS 18 — início inteiro (dono 26/11 15:25: "me faz a página inteira sem ser por partes"; fotos da internet só como desenho).
Base: o site real (kit) + aprovado em espírito: capa de tela inteira (17b). Estudos: 16-padrao-luxo/ESTUDO.md §7–§10.
Fotos de desenho: recortes do vídeo da Made que o dono mandou (desenho/), café e estúdio do Semp. Masculino: sem foto ainda."""
import base64, io, os, subprocess
from PIL import Image
AQ = os.path.dirname(os.path.abspath(__file__)); I17 = os.path.join(AQ, '../17-inicio-modelos')
def b64(p, w=800):
    im = Image.open(p).convert('RGB'); im.thumbnail((w, 3000)); b = io.BytesIO(); im.save(b, 'JPEG', quality=84)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
F = {k: b64(os.path.join(I17, 'desenho', k + '.jpg')) for k in ['grupo', 'lanc', 'maisv', 'retrato', 'video', 'design', 'conforto', 'elas']}
import re as _re
_P = {m.group(1): {'nome': m.group(2), 'n': int(m.group(3)), 'mat': m.group(4).lower(), 'foto': m.group(5), 'cor': m.group(6)} for m in _re.finditer(r"ref:'(\w+)',gen:'\w',nome:'([^']*)'.*?n:(\d+).*?mat:'([^']*)'.*?foto:'([^']*)'.*?cores:\['([^']*)'", open(os.path.join(AQ, '../../kit/pecas-teste.js')).read())}
from PIL import ImageChops
def peca(path, W=900, H=600, larg=0.86):
    '''Normaliza a foto da peça: recorta o branco em volta, centraliza e põe todas na MESMA escala (a peça ocupa 86% da largura).
    Na loja isto é feito uma vez, ao subir a foto (Titan/catálogo) — um lugar só, vale para todas as telas.'''
    im = Image.open('/tmp/kitsite' + path).convert('RGB'); bg = Image.new('RGB', im.size, (255, 255, 255))
    bb = ImageChops.difference(im, bg).convert('L').point(lambda v: 255 if v > 18 else 0).getbbox() or (0, 0, im.width, im.height)
    pc = im.crop(bb); esc = min(W * larg / pc.width, H * 0.80 / pc.height); pc = pc.resize((int(pc.width * esc), int(pc.height * esc)), Image.LANCZOS)
    m = ImageChops.difference(pc, Image.new('RGB', pc.size, (255, 255, 255))).convert('L').point(lambda v: 255 if v > 18 else 0)
    import numpy as _np; a = _np.asarray(m, dtype=float); cx = (a.sum(0) * _np.arange(a.shape[1])).sum() / max(a.sum(), 1)  # centro de massa
    x = int(W / 2 - cx); x = max(min(x, W - pc.width), 0) if pc.width <= W else (W - pc.width) // 2
    cv = Image.new('RGB', (W, H), (255, 255, 255)); cv.paste(pc, (x, (H - pc.height) // 2))
    b = io.BytesIO(); cv.save(b, 'JPEG', quality=86); return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
F['cafe'] = b64(os.path.join(I17, 'semp-cafe-campanha.jpg'), 900)
F.update({k: b64(os.path.join(I17, 'desenho/net', k + '.jpg')) for k in ['h_jaqueta', 'h_sol_branco', 'h_sueter', 's_lendo', 'loja_lote', 'h_barba', 's_celular', 'h_sol_couro', 't_selfie1', 't_le_livro']})  # fotos de desenho (Unsplash) — dono 17:13: homens e 45+ reais
JS = r"""(()=>{const F=__F__, P=__P__, PF=__PF__;
const css = `
#hdst{display:none!important}
main > .wrap{min-width:0;max-width:100%}#home{min-width:0}  /* as fileiras que deslizam não podem alargar a coluna (itens flex: min-width 0) */
.lfx-capa{position:relative;overflow:hidden;cursor:pointer;color:#fff}
.lfx-capa .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:42% 20%}
.lfx-capa .vt{position:absolute;left:0;right:0;top:0;height:36%;background:linear-gradient(#1f0d1788,#1f0d1700)}
.lfx-capa .vb{position:absolute;left:0;right:0;bottom:0;height:40%;background:linear-gradient(#1f0d1700,#1f0d17a6)}
.lfx-capa .cima{position:absolute;left:16px;right:16px;top:32px;text-align:center}
.lfx-capa .rot{font:600 12px Inter,system-ui;letter-spacing:.16em;text-transform:uppercase}
.lfx-capa h1{font:500 32px/1.15 Fraunces,Georgia,serif;margin:8px 0 0;color:#fff}
.lfx-capa h1 em{color:#f6e3ec!important}
.lfx-capa .baixo{position:absolute;left:16px;right:16px;bottom:32px;text-align:center}
.lfx-capa p{font:15px/1.5 Inter,system-ui;margin:0 0 16px}
.lfx-capa .bt{display:inline-block;padding:12px 24px;border:1px solid #fff;border-radius:999px;font:500 15px Inter,system-ui}
.lfx-capa .pts{display:flex;gap:16px;justify-content:center;margin-top:16px}.lfx-capa .pts i{width:8px;height:8px;border-radius:8px;background:#fff8}.lfx-capa .pts i.on{width:24px;background:#fff}
/* foto de campanha: inteira, arredondada como os cartões, só o nome por cima (ESTUDO §10) */
.lfx-ft{position:relative;display:block;border-radius:18px;overflow:hidden;color:#fff;text-decoration:none}
.lfx-ft img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.lfx-ft .vb{position:absolute;left:0;right:0;bottom:0;height:50%;background:linear-gradient(#1f0d1700,#1f0d17b3)}
.lfx-ft b{position:absolute;left:16px;right:16px;bottom:16px;font:500 20px/1.2 Fraunces,Georgia,serif}
.lfx-ft small{display:block;font:13px/1.4 Inter,system-ui;opacity:.9;margin-top:4px}
.lfx-semp{position:absolute;inset:0;display:flex;align-items:flex-start;justify-content:center;text-align:center;padding:24px 16px;background:linear-gradient(135deg,#c99ab3,#8d5a77);color:#fff;font:600 12px/1.5 Inter,system-ui}
#home .lfx-gen{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
#home .lfx-gen .lfx-ft{aspect-ratio:3/4}
/* visto na foto: a foto e, FORA dela, a peça */
#home .lfx-visto .lfx-ft{aspect-ratio:4/5}
#home .lfx-rot{font:600 12px Inter,system-ui;letter-spacing:.16em;text-transform:uppercase;color:#943d6f;text-align:center;margin:0 0 16px}
/* v5: preço embaixo do código (dono 17:32: o preço competia com a peça seguinte) */
/* CARTÃO DE PEÇA v4 (dono 17:22: "a reclamação está nos cartões dos produtos em si"):
   sem caixa, sem painel e sem borda — a peça pousa no próprio fundo rosé da página, com uma sombra de apoio suave embaixo (como numa vitrine);
   linha 1: código em Fraunces 18 à esquerda e preço preto à direita, na mesma linha de base (L2); linha 2: o detalhe (formato/material), cinza;
   linha 3: as cores em anéis de 12 px. "Última unidade" vira texto pequeno vinho, sem etiqueta sobre a foto. */
#home .hc{display:grid!important;grid-template-columns:1fr;align-items:start;background:transparent!important;border:0!important;border-radius:0!important;overflow:visible!important}
#home .hc .hci{grid-column:1/-1;margin:0 0 16px!important;background:transparent!important;overflow:visible!important;position:relative}
#home .hc .hci:after{content:'';position:absolute;left:20%;right:20%;bottom:6%;height:12px;background:radial-gradient(closest-side,#2a1f2726,#2a1f2700);z-index:0}
#home .hc .hci img{position:absolute!important;inset:0;width:100%!important;height:100%!important;max-height:none!important;z-index:1;object-fit:contain!important;transform:none!important;mix-blend-mode:multiply;padding:0 0 8px;box-sizing:border-box}
#home .hc .hn{display:contents!important}
#home .hc .lfx-cod{grid-column:1;grid-row:2;font:500 18px/1.2 Fraunces,Georgia,serif;color:#2a1f27;min-width:0}
#home .hc .hds{grid-column:1/-1;grid-row:3;font:13px/1.4 Inter,system-ui!important;letter-spacing:0;color:#6b5a66!important;margin:4px 0 0!important}
#home .hc .hp{grid-column:1;grid-row:4;padding:8px 0 0!important;font:600 15px/1.2 Inter,system-ui!important;color:#2a1f27;font-variant-numeric:tabular-nums;white-space:nowrap}
#home .hc .hsw{grid-column:1/-1;grid-row:5;padding:8px 0 0!important;display:flex;gap:8px}
#home .hc .hsw i{width:12px!important;height:12px!important;border-radius:50%;box-shadow:0 0 0 1px #fbf7fa,0 0 0 2px #d9c6d1}
#home .hc .ulin{position:static!important;grid-column:1/-1;grid-row:6;margin:8px 0 0!important;padding:0!important;background:none!important;font:600 12px/1.3 Inter,system-ui!important;color:#943d6f!important}
#home .hc .ulin i{display:none}
/* para lojistas na mesma família (painel rosé, sem caixa) */
#home .hata{background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;overflow:visible!important}
#home .hata .hati{display:grid!important;place-items:center;background:#f4ebf1!important;border-radius:18px;overflow:hidden}#home .hata .hati img{mix-blend-mode:multiply}
#home .hata .hatt{padding:16px 0 0!important}
/* peças GRANDES: carrossel de 1,25 por tela (acabou de chegar) e grade 2 × 2 (mais pedidos) */
#home .hg.lfx-grande{display:flex!important;gap:24px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin-right:-16px;padding-right:16px}
#home .hg.lfx-grande::-webkit-scrollbar{display:none}
#home .hg.lfx-grande > *{flex:0 0 calc((100% - 24px) / 1.2)!important;scroll-snap-align:start}
#home .hg.lfx-grande .hci{aspect-ratio:3/2!important;height:auto!important;width:100%!important}
#home .hg.lfx-grade{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:16px}
#home .hg.lfx-grande .hci img,#home .hg.lfx-grade .hci img{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important}
#home .hg.lfx-grade .hci{aspect-ratio:1/1!important;height:auto!important;width:100%!important}
#home .hg.lfx-grade{row-gap:32px;align-items:start!important}
/* visto na foto: a peça em tamanho de vitrine, abaixo da foto */
#home .lfx-visto .lfx-pg{margin-top:16px}
#home .lfx-pg .hci{aspect-ratio:16/9!important;height:auto!important;width:100%!important}
#home .lfx-pg .vm{margin-top:16px;justify-content:center;width:100%;box-sizing:border-box;height:44px;display:inline-flex;align-items:center;padding:0 24px;border:1px solid #943d6f;border-radius:999px;color:#943d6f;font:500 15px Inter,system-ui;white-space:nowrap}
/* para cada uso: mosaico de revista */
#home .lfx-rev{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
#home .lfx-rev .lfx-ft:first-child{grid-column:1/-1;aspect-ratio:4/5}#home .lfx-rev .lfx-ft{aspect-ratio:3/4}
#home .lfx-rev .lfx-ft:first-child b{font-size:28px}
/* em movimento */
#home .lfx-mov{display:flex;gap:16px;overflow-x:auto;scrollbar-width:none;margin-right:-16px;padding-right:16px}
#home .lfx-mov > div{flex:0 0 calc((100% - 32px) / 2.2)}
#home .lfx-mov .lfx-semp{font-size:12px}
#home .lfx-mov .lfx-ft{aspect-ratio:9/16}
#home .lfx-mov .play{position:absolute;left:50%;top:50%;width:48px;height:48px;margin:-24px 0 0 -24px;border-radius:50%;background:#ffffffd9;display:flex;align-items:center;justify-content:center}
#home .lfx-mov .play:after{content:'';margin-left:4px;border-left:14px solid #943d6f;border-top:9px solid transparent;border-bottom:9px solid transparent}
#home .lfx-mov p{margin:8px 0 0;font:12px/1.4 Inter,system-ui;color:#6b5a66}#home .lfx-mov p b{display:block;color:#2a1f27;font:500 16px/1.2 Fraunces,Georgia,serif}
/* as duas ferramentas: 2 cartões-foto quadrados lado a lado, logo abaixo dos selos (mesmo componente de campanha .lfx-ft) */
#home .lfx-fer{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:24px 0 0}
/* ferramenta = foto de ação + nome + o que faz + botão com o verbo (o botão é o que diz "isto é uma ferramenta") */
#home .lfx-fe{display:flex;flex-direction:column;text-decoration:none}
#home .lfx-fe .im{display:block;aspect-ratio:4/3;border-radius:18px;overflow:hidden;margin-bottom:16px}#home .lfx-fe .im img{width:100%;height:100%;object-fit:cover}
#home .lfx-fe b{font:500 18px/1.2 Fraunces,Georgia,serif;color:#2a1f27}
#home .lfx-fe small{margin-top:4px;font:13px/1.4 Inter,system-ui;color:#6b5a66}
#home .lfx-fe .bt{margin-top:16px;height:44px;display:flex;align-items:center;justify-content:center;border:1px solid #943d6f;border-radius:999px;color:#943d6f;font:500 15px Inter,system-ui}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
const H = document.getElementById('home'), $ = s => H.querySelector(s), $$ = s => [...H.querySelectorAll(s)];
const mk = h => { const t = document.createElement('div'); t.innerHTML = h.trim(); return t.firstChild; };
const ft = (src, nome, sub, mf) => `<a class=lfx-ft href="#vitrine"${mf ? ` data-mf="${mf}"` : ''}>${src ? `<img src="${src}" alt="">` : `<span class=lfx-semp>FOTO DO SEMP<br>modelo masculino</span>`}<span class=vb></span><b>${nome}${sub ? `<small>${sub}</small>` : ''}</b></a>`;
/* 1. capa */
const d = $('#hdst'), cod = d.querySelector('[data-open]') ? d.querySelector('[data-open]').dataset.open : '';
const topH = document.querySelector('.top').getBoundingClientRect().height;
const cap = mk(`<section id=lfxcapa class=lfx-capa data-open="${cod}"><img class=bg src="${F.cafe}"><div class=vt></div><div class=vb></div><div class=cima><div class=rot>Destaque da semana</div><h1>Armação LaFouch <em>quadrada</em></h1></div><div class=baixo><p>Acetato rosé com detalhe dourado na haste.</p><span class=bt>Ver a peça</span><div class=pts><i class=on></i><i></i><i></i><i></i></div></div></section>`);
const topW = document.querySelector('.top').getBoundingClientRect().width; let host = d;
while (host.parentElement && host.parentElement.getBoundingClientRect().width < topW - 1) host = host.parentElement;
host.parentElement.insertBefore(cap, host);
const tb = document.querySelector('.top').getBoundingClientRect().bottom, r = cap.getBoundingClientRect(), pp = getComputedStyle(cap.parentElement);
cap.style.cssText = `height:${innerHeight - topH}px;margin:${tb - r.top - scrollY}px ${-parseFloat(pp.paddingRight)}px 0 ${-parseFloat(pp.paddingLeft)}px`;
/* 2. escolha o seu estilo: só Feminino | Masculino (uma decisão; a escolha de gênero aparece UMA vez na página) */
const hc = $('.hcat'), fotoTipo = {}; hc.querySelectorAll('a').forEach(a => { const m = (a.dataset.mf || '').split(':')[1]; fotoTipo[m] = a.querySelector('img').src; });
hc.previousElementSibling.querySelector('h2').innerHTML = 'Escolha o seu <em>estilo</em>';
hc.replaceWith(mk(`<div class=lfx-gen>${ft(F.lanc, 'Feminino', '', 'gen:f')}${ft(F.h_jaqueta, 'Masculino', '', 'gen:m')}</div>`));
/* 3. acabou de chegar: a peça GRANDE (1,25 por tela), sem botões extras */
const [sNov, sMv] = $$('.hsh.hsh1'), [gNov, gMv] = $$('.hg');
sNov.querySelector('h2').innerHTML = 'Acabou de chegar'; sMv.querySelector('h2').innerHTML = 'Os mais pedidos';
sNov.style.marginTop = '48px'; gNov.classList.add('lfx-grande');
H.querySelectorAll('.hc .ulin').forEach(u => u.closest('.hc').appendChild(u));
/* nenhuma peça repete na página (dono 17:17); BR44145 fora (o dono não gosta dela) */
const VISTO = 'GR3350', TIPO = {solar: 'SL2305', grau: 'GR3345', armacao: 'BR44140'}, MAIS = ['SL2265', 'SL2290', 'SL2300'];
const base = gNov.children[0].cloneNode(true), preco = n => 'R$ ' + Math.round(n / 1050 / 5) * 5;
const cartao = ref => { const c = base.cloneNode(true), p = P[ref]; c.dataset.open = ref; c.querySelector('.hci img').src = p.foto; const u = c.querySelector('.ulin'); if (u) u.remove();
  c.querySelector('.hn').innerHTML = `<small class=hds>LaFouch · ${p.mat}</small>${ref}`; c.querySelector('.hsw').innerHTML = `<i style="background:${p.cor}"></i>`; c.querySelector('.hp').textContent = preco(p.n); return c; };
const pv = gNov.querySelector(`[data-open="${VISTO}"]`), d1 = pv ? {pr: (pv.innerText.match(/R\$\s?[\d.,]+/) || [''])[0]} : {pr: preco(P[VISTO].n)};
H.querySelectorAll('.hc[data-open="BR44145"],.hc[data-open="' + VISTO + '"],.hc[data-open="' + TIPO.grau + '"]').forEach(e => e.remove());
/* 4. visto na foto: foto grande e, logo abaixo e FORA dela, a peça em tamanho de vitrine */
const dados = c => { const ds = (c.querySelector('.hds') || {}).textContent || '', t = c.innerText, cod = (t.match(/[A-Z]{2}\d{3,5}/) || [''])[0], pr = (t.match(/R\$\s?[\d.,]+/) || [''])[0]; return {ds, cod, pr}; };

const visto = mk(`<div class=lfx-visto style="margin:48px 0 0"><div class=hsh><h2 class=h2>Visto na foto</h2></div>${ft(F.retrato, '', '', '')}
  <div class=lfx-pg></div></div>`);
{ const cv = cartao(VISTO); cv.querySelector('.hp').textContent = d1.pr || cv.querySelector('.hp').textContent; visto.querySelector('.lfx-pg').append(cv, mk('<span class=vm>Ver modelo</span>')); }
gNov.after(visto);
/* 5. para cada uso = capa de revista (dono 17:32): mosaico 1 grande + 2, a foto de quem usa aquele tipo; nome e linha curta por cima, no véu */
const tipos = mk(`<div style="margin-top:48px"><div class=hsh><h2 class=h2>Para cada uso</h2></div><div class=lfx-rev>${ft(F.design, 'Solar', '', 'tipo:solar')}${ft(F.s_celular, 'Leitura', '', 'tipo:grau')}${ft(F.h_sueter, 'Armações', '', 'tipo:armacao')}</div></div>`);
visto.after(tipos);
/* 6. os mais pedidos: outro formato (grade 2 × 2 de peças grandes) — não repete o carrossel */
sMv.style.marginTop = '48px'; gMv.classList.add('lfx-grade');
{ const o = gMv.children[0], ul = o.querySelector('.ulin'), nc = cartao(o.dataset.open); nc.querySelector('.hp').textContent = o.querySelector('.hp').textContent; if (ul) nc.appendChild(ul); o.replaceWith(nc); }  /* o 1º cartão também sai do mesmo molde */
MAIS.forEach(r => { if (gMv.children.length < 4) gMv.appendChild(cartao(r)); }); /* peças de teste: completa 4, sem repetir */
/* 7. como fica no rosto: mulheres e homens, de idades diferentes (vídeos do Semp) */
const mov = mk(`<div style="margin-top:48px"><div class=hsh><h2 class=h2>Como fica no <em>rosto</em></h2></div><div class=lfx-mov></div></div>`);
[[F.maisv, ''], [F.h_sol_branco, ''], [F.elas, ''], [F.h_sol_couro, '']].forEach(([s, ph], i) => { const c = gNov.children[i % gNov.children.length], q = dados(c);
  mov.querySelector('.lfx-mov').appendChild(mk(`<div><a class=lfx-ft href="#rosto">${s ? `<img src="${s}" alt="">` : `<span class=lfx-semp>FOTO DO SEMP<br>${ph}</span>`}<span class=play></span></a><p><b>${q.cod}</b>${q.pr}</p></div>`)); });
$('#hguia').before(mov);
const hi = $('.hata .hati img'); if (hi) { hi.src = F.loja_lote; hi.style.cssText = 'width:100%;height:100%;object-fit:cover;mix-blend-mode:normal'; $('.hata .hati').style.aspectRatio = '16/9'; }
/* 8. as duas ferramentas logo abaixo dos selos; a foto combina com quem usa (grau de leitura = 45+) */
const gu = $('.hgu.hcom');  /* na loja: os mesmos botões do site (provador = upgrade do "qual combina", teste de leitura) */
const fer = mk(`<div class=lfx-fer>
  <a class=lfx-fe href="#rosto"><span class=im><img src="${F.t_selfie1}" alt=""></span><b>Provador virtual</b><small>Pela câmera do celular</small><span class=bt>Experimentar</span></a>
  <a class=lfx-fe href="#grau"><span class=im><img src="${F.t_le_livro}" alt=""></span><b>Teste de leitura</b><small>Grau para ler de perto</small><span class=bt>Fazer o teste</span></a></div>`);
$('.htr').after(fer); $('#hguia').remove(); gu.remove();
$('.hsh').style.marginTop = '48px';  /* 48 entre o bloco de serviços e o primeiro título */
const det = n => { const t = n.replace(/^(Armação|Solar|Óculos de leitura)\s*/i, ''); return t.charAt(0).toUpperCase() + t.slice(1); };
H.querySelectorAll('.hc').forEach(c => { const r = c.dataset.open; if (PF[r]) c.querySelector('.hci img').src = PF[r]; const d = c.querySelector('.hds'); if (d && P[r]) { d.textContent = det(P[r].nome); d.dataset.f = d.textContent; } });
/* código num elemento próprio: código e preço na mesma linha de base (L2), em todos os cartões (inclusive os montados acima) */
H.querySelectorAll('.hc .hn').forEach(hn => { [...hn.childNodes].forEach(n => { if (n.nodeType === 3 && n.textContent.trim()) { const b = document.createElement('span'); b.className = 'lfx-cod'; b.textContent = n.textContent.trim(); n.replaceWith(b); } }); });
return 'ok'})()"""
open(os.path.join(AQ, 'proposta.js'), 'w').write(JS.replace('__F__', __import__('json').dumps(F)).replace('__P__', __import__('json').dumps(_P)).replace('__PF__', __import__('json').dumps({r: peca(p['foto']) for r, p in _P.items()})))
