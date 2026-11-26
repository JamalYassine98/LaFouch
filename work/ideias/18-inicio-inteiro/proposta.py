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
F['cafe'] = b64(os.path.join(I17, 'semp-cafe-campanha.jpg'), 900)
F.update({k: b64(os.path.join(I17, 'desenho/net', k + '.jpg')) for k in ['h_jaqueta', 'h_sol_branco', 'h_sueter', 's_lendo']})  # fotos de desenho (Unsplash) — dono 17:13: homens e 45+ reais
JS = r"""(()=>{const F=__F__;
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
.lfx-ft .vb{position:absolute;left:0;right:0;bottom:0;height:35%;background:linear-gradient(#1f0d1700,#1f0d1799)}
.lfx-ft b{position:absolute;left:16px;right:16px;bottom:16px;font:500 20px/1.2 Fraunces,Georgia,serif}
.lfx-ft small{display:block;font:13px/1.4 Inter,system-ui;opacity:.9;margin-top:4px}
.lfx-semp{position:absolute;inset:0;display:flex;align-items:flex-start;justify-content:center;text-align:center;padding:24px 16px;background:linear-gradient(135deg,#c99ab3,#8d5a77);color:#fff;font:600 12px/1.5 Inter,system-ui}
#home .lfx-gen{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
#home .lfx-fer .lfx-semp{z-index:0}
#home .lfx-gen .lfx-ft{aspect-ratio:3/4}
/* visto na foto: a foto e, FORA dela, a peça */
#home .lfx-visto .lfx-ft{aspect-ratio:4/5}
#home .lfx-rot{font:600 12px Inter,system-ui;letter-spacing:.16em;text-transform:uppercase;color:#943d6f;text-align:center;margin:0 0 16px}
/* CARTÃO DE PEÇA (família nova, dono 17:13): sem caixa branca nem borda; a peça num painel rosé claro arredondado (o branco da foto some com multiply);
   embaixo, solto: marca · material (pequeno), código em Fraunces, cor, preço preto. Vale para listas, "visto na foto" e "para cada uso". */
#home .hc{background:transparent!important;border:0!important;border-radius:0!important;overflow:visible!important}
#home .hc .hci{margin:0!important;background:#f4ebf1!important;border-radius:18px;overflow:hidden}
#home .hc .hci img{object-fit:contain!important;transform:none!important;mix-blend-mode:multiply;padding:16px;box-sizing:border-box}
#home .hc .ulin{top:8px;bottom:auto!important;left:8px!important;right:auto!important;width:auto;padding:4px 8px!important;background:#fff!important;border-radius:999px!important;font:600 12px/1.3 Inter,system-ui!important}
#home .hc .hn{padding:16px 0 0!important;font:500 18px/1.2 Fraunces,Georgia,serif!important;color:#2a1f27}
#home .hc .hds{font:12px/1.3 Inter,system-ui!important;letter-spacing:.04em;color:#6b5a66!important;margin:0 0 4px!important}
#home .hc .hsw{padding:8px 0 0!important}#home .hc .hp{padding:4px 0 0!important;font:600 15px/1.3 Inter,system-ui!important;color:#2a1f27}
/* para lojistas na mesma família (painel rosé, sem caixa) */
#home .hata{background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;overflow:visible!important}
#home .hata .hati{display:grid!important;place-items:center;background:#f4ebf1!important;border-radius:18px;overflow:hidden}#home .hata .hati img{mix-blend-mode:multiply}
#home .hata .hatt{padding:16px 0 0!important}
/* peças GRANDES: carrossel de 1,25 por tela (acabou de chegar) e grade 2 × 2 (mais pedidos) */
#home .hg.lfx-grande{display:flex!important;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin-right:-16px;padding-right:16px}
#home .hg.lfx-grande::-webkit-scrollbar{display:none}
#home .hg.lfx-grande > *{flex:0 0 calc((100% - 16px) / 1.25)!important;scroll-snap-align:start}
#home .hg.lfx-grande .hci{aspect-ratio:4/3;height:auto!important}
#home .hg.lfx-grade{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:16px}
#home .hg.lfx-grande .hci img,#home .hg.lfx-grade .hci img{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important}
#home .hg.lfx-grade .hci{aspect-ratio:4/5;height:auto!important}
#home .hg.lfx-grade{row-gap:24px}
/* visto na foto: a peça em tamanho de vitrine, abaixo da foto */
#home .lfx-visto .lfx-pg{margin-top:16px}
#home .lfx-pg .im{display:block;aspect-ratio:16/9;padding:16px;box-sizing:border-box;background:#f4ebf1;border-radius:18px}#home .lfx-pg .im img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}
#home .lfx-pg .rw{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 0 0}
#home .lfx-pg small{display:block;font:12px/1.4 Inter,system-ui;color:#6b5a66}#home .lfx-pg b{display:block;font:500 18px/1.2 Fraunces,Georgia,serif;color:#2a1f27}#home .lfx-pg span:not(.vm){font:600 14px/1.4 Inter,system-ui;color:#2a1f27}
#home .lfx-pg .vm{height:44px;display:inline-flex;align-items:center;padding:0 24px;border:1px solid #943d6f;border-radius:999px;color:#943d6f;font:500 15px Inter,system-ui;white-space:nowrap}
/* para cada uso: vitrine grande que desliza */
#home .lfx-tipos{display:flex;gap:16px;overflow-x:auto;scrollbar-width:none;margin-right:-16px;padding-right:16px}
#home .lfx-tipos a{flex:0 0 calc((100% - 16px) / 1.6);text-decoration:none}
#home .lfx-tipos .im{display:block;aspect-ratio:4/3;padding:16px;box-sizing:border-box;background:#f4ebf1;border-radius:18px;margin-bottom:16px}#home .lfx-tipos img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}
#home .lfx-tipos b{display:block;padding:0;font:500 20px/1.2 Fraunces,Georgia,serif;color:#2a1f27}#home .lfx-tipos small{display:block;padding:4px 0 0;font:13px/1.4 Inter,system-ui;color:#6b5a66}
/* em movimento */
#home .lfx-mov{display:flex;gap:16px;overflow-x:auto;scrollbar-width:none;margin-right:-16px;padding-right:16px}
#home .lfx-mov > div{flex:0 0 calc((100% - 32px) / 2.2)}
#home .lfx-mov .lfx-semp{font-size:12px}
#home .lfx-mov .lfx-ft{aspect-ratio:9/16}
#home .lfx-mov .play{position:absolute;left:50%;top:50%;width:48px;height:48px;margin:-24px 0 0 -24px;border-radius:50%;background:#ffffffd9;display:flex;align-items:center;justify-content:center}
#home .lfx-mov .play:after{content:'';margin-left:4px;border-left:14px solid #943d6f;border-top:9px solid transparent;border-bottom:9px solid transparent}
#home .lfx-mov p{margin:8px 0 0;font:12px/1.4 Inter,system-ui;color:#6b5a66}#home .lfx-mov p b{display:block;color:#2a1f27;font:500 16px/1.2 Fraunces,Georgia,serif}
/* as duas ferramentas: foto + nome curto (como Made item 12), botões reais do site */
#home .lfx-fer{display:grid;grid-template-columns:1fr;gap:16px;margin:24px 0 48px}
#home .lfx-fer > button.lfx-ft2{position:relative;aspect-ratio:16/7;border:0!important;border-radius:18px;overflow:hidden;padding:0!important;background:#2a1f27 center/cover no-repeat;text-align:left;color:#fff}
#home .lfx-fer > button.lfx-ft2:before{content:'';position:absolute;inset:0;background:linear-gradient(#1f0d1700 35%,#1f0d17b3)}
#home .lfx-fer .gi,#home .lfx-fer > button > svg{display:none!important}
#home .lfx-fer .gt{position:absolute;left:16px;right:16px;bottom:16px}
#home .lfx-fer .gt b{display:block;color:#fff!important;font:500 20px/1.2 Fraunces,Georgia,serif}
#home .lfx-fer .gt b em{color:#f6e3ec!important}
#home .lfx-fer .gt small{display:block;color:#ffffffd9!important;font:13px/1.4 Inter,system-ui;margin-top:4px;letter-spacing:0;text-transform:none}
#home .hgu.hcom.lfx-fts{display:grid!important;grid-template-columns:1fr!important;gap:16px}
#home .hgu.lfx-fts > button{position:relative;height:168px;border:0!important;border-radius:18px;overflow:hidden;padding:0!important;background:#2a1f27 center/cover no-repeat;text-align:left;color:#fff}
#home .hgu.lfx-fts > button:before{content:'';position:absolute;inset:0;background:linear-gradient(#1f0d1700 30%,#1f0d17a6)}
#home .hgu.lfx-fts .gi{display:none!important}
#home .hgu.lfx-fts .gt{position:absolute;left:16px;right:16px;bottom:16px}
#home .hgu.lfx-fts .gt small{color:#f6e3ec!important;font:600 12px Inter,system-ui;letter-spacing:.16em}
#home .hgu.lfx-fts .gt b{display:block;color:#fff!important;font:500 20px/1.25 Fraunces,Georgia,serif;margin-top:4px}
#home .hgu.lfx-fts .gt em{color:#ffffffd9!important}
#home .hgu.lfx-fts svg.ch,#home .hgu.lfx-fts > button > svg{display:none}
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
sNov.querySelector('h2').innerHTML = 'Acabou de <em>chegar</em>'; sMv.querySelector('h2').innerHTML = 'Os mais <em>pedidos</em>';
sNov.style.marginTop = '48px'; gNov.classList.add('lfx-grande');
/* 4. visto na foto: foto grande e, logo abaixo e FORA dela, a peça em tamanho de vitrine */
const dados = c => { const ds = (c.querySelector('.hds') || {}).textContent || '', t = c.innerText, cod = (t.match(/[A-Z]{2}\d{3,5}/) || [''])[0], pr = (t.match(/R\$\s?[\d.,]+/) || [''])[0]; return {ds, cod, pr}; };
const c0 = gNov.children[1] || gNov.children[0], d1 = dados(c0);  /* peça de metal, parecida com a da foto de desenho */
const visto = mk(`<div class=lfx-visto style="margin:48px 0 0"><div class=hsh><h2 class=h2>Visto na <em>foto</em></h2></div>${ft(F.retrato, '', '', '')}
  <div class=lfx-pg><div class=im><img src="${c0.querySelector('.hci img').src}" alt=""></div><div class=rw><div><small>${d1.ds}</small><b>${d1.cod}</b><span>${d1.pr}</span></div><span class=vm>Ver modelo</span></div></div></div>`);
gNov.after(visto);
/* 5. para cada uso: Solar · Leitura · Armações como vitrine grande (a peça é a estrela) */
const tipos = mk(`<div style="margin-top:48px"><div class=hsh><h2 class=h2>Para cada <em>uso</em></h2></div><div class=lfx-tipos></div></div>`);
[['solar', 'Solar', 'Proteção UV'], ['grau', 'Leitura', 'Para ler de perto'], ['armacao', 'Armações', 'Para a sua receita']].forEach(([k, n, sub]) => {
  const src = fotoTipo[k] || '/media/i/b0ce33cc336d.jpg';
  tipos.querySelector('.lfx-tipos').appendChild(mk(`<a href="#vitrine" data-mf="tipo:${k}"><span class=im><img src="${src}" alt=""></span><b>${n}</b><small>${sub}</small></a>`)); });
visto.after(tipos);
/* 6. os mais pedidos: outro formato (grade 2 × 2 de peças grandes) — não repete o carrossel */
sMv.style.marginTop = '48px'; gMv.classList.add('lfx-grade');
for (let i = 0; gMv.children.length < 4 && i < gNov.children.length; i++) gMv.appendChild(gNov.children[gNov.children.length - 1 - i].cloneNode(true)); /* peças de teste: completa 4 */
/* 7. como fica no rosto: mulheres e homens, de idades diferentes (vídeos do Semp) */
const mov = mk(`<div style="margin-top:48px"><div class=hsh><h2 class=h2>Como fica no <em>rosto</em></h2></div><div class=lfx-mov></div></div>`);
[[F.maisv, ''], [F.h_sol_branco, ''], [F.elas, ''], [F.h_sueter, '']].forEach(([s, ph], i) => { const c = gNov.children[i % gNov.children.length], q = dados(c);
  mov.querySelector('.lfx-mov').appendChild(mk(`<div><a class=lfx-ft href="#rosto">${s ? `<img src="${s}" alt="">` : `<span class=lfx-semp>FOTO DO SEMP<br>${ph}</span>`}<span class=play></span></a><p><b>${q.cod}</b>${q.pr}</p></div>`)); });
$('#hguia').before(mov);
/* 8. as duas ferramentas logo abaixo dos selos; a foto combina com quem usa (grau de leitura = 45+) */
const gu = $('.hgu.hcom'), [bGrau, bRosto] = [...gu.children];
const fer = mk(`<div class=lfx-fer></div>`);
const ferr = (b, src, ph, t, sub) => { b.classList.add('lfx-ft2'); if (src) b.style.backgroundImage = `url(${src})`; else b.insertAdjacentHTML('afterbegin', `<span class=lfx-semp>FOTO DO SEMP<br>${ph}</span>`);
  b.querySelector('.gt').innerHTML = `<b>${t}</b><small>${sub}</small>`; fer.appendChild(b); };
ferr(bRosto, F.design, '', 'Experimente no <em>rosto</em>', 'Pela câmera do celular');
ferr(bGrau, F.s_lendo, '', 'Descubra seu <em>grau</em>', 'Teste de leitura em 1 min');
$('.htr').after(fer); $('#hguia').remove(); gu.remove();
return 'ok'})()"""
open(os.path.join(AQ, 'proposta.js'), 'w').write(JS.replace('__F__', __import__('json').dumps(F)))
