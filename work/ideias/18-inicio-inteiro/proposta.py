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
.lfx-semp{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:16px;background:linear-gradient(135deg,#fcf3f8,#f2dce8);color:#943d6f;font:600 12px/1.5 Inter,system-ui}
#home .lfx-gen{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
#home .lfx-gen .lfx-ft{aspect-ratio:3/4}
#home .lfx-tip{display:flex;gap:8px;justify-content:center;margin-top:16px}
#home .lfx-tip a{height:44px;display:inline-flex;align-items:center;padding:0 16px;border:1px solid #efe3ea;background:#fff;border-radius:999px;font:500 14px Inter,system-ui;color:#2a1f27;text-decoration:none}
/* escolha de dois lados (regra 15) */
#home .lfx-2l{display:flex;padding:4px;background:#f4e8ef;border-radius:999px;margin:0 0 16px}
#home .lfx-2l button{flex:1;height:44px;border:0;border-radius:999px;background:transparent;font:500 14px Inter,system-ui;color:#6b5a66}
#home .lfx-2l button.on{background:#fff;color:#943d6f;box-shadow:0 1px 2px #2a1f2714}
/* listas deslizam: 2 por tela + a ponta do próximo */
#home .hg.lfx-desl{display:flex!important;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin-right:-16px;padding-right:16px}
#home .hg.lfx-desl::-webkit-scrollbar{display:none}
#home .hg.lfx-desl > *{flex:0 0 calc((100% - 32px) / 2.2)!important;scroll-snap-align:start}
/* visto na foto: a foto e, FORA dela, a peça */
#home .lfx-visto .lfx-ft{aspect-ratio:4/5}
#home .lfx-rot{font:600 12px Inter,system-ui;letter-spacing:.16em;text-transform:uppercase;color:#943d6f;text-align:center;margin:0 0 16px}
#home .lfx-peca{display:flex;align-items:center;gap:16px;margin-top:16px;padding:8px 16px 8px 8px;background:#fff;border:1px solid #efe3ea;border-radius:18px}
#home .lfx-peca .hci{flex:0 0 96px!important;width:96px!important;height:72px!important}
#home .lfx-peca .tx{flex:1;min-width:0}
#home .lfx-peca i{font-style:normal;color:#943d6f;font:500 15px Inter,system-ui;white-space:nowrap}
/* em movimento */
#home .lfx-mov{display:flex;gap:16px;overflow-x:auto;scrollbar-width:none;margin-right:-16px;padding-right:16px}
#home .lfx-mov > div{flex:0 0 calc((100% - 32px) / 2.2)}
#home .lfx-mov .lfx-ft{aspect-ratio:9/16}
#home .lfx-mov .play{position:absolute;left:50%;top:50%;width:48px;height:48px;margin:-24px 0 0 -24px;border-radius:50%;background:#ffffffd9;display:flex;align-items:center;justify-content:center}
#home .lfx-mov .play:after{content:'';margin-left:4px;border-left:14px solid #943d6f;border-top:9px solid transparent;border-bottom:9px solid transparent}
#home .lfx-mov p{margin:8px 0 0;font:12px/1.4 Inter,system-ui;color:#6b5a66}#home .lfx-mov p b{display:block;color:#2a1f27;font-weight:600}
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
/* 2. escolha o seu estilo: campanha Feminino | Masculino + os tipos em pílulas (uma grade só, ESTUDO §8/§10) */
const hc = $('.hcat'); hc.previousElementSibling.querySelector('h2').innerHTML = 'Escolha o seu <em>estilo</em>';
hc.replaceWith(mk(`<div class=lfx-gen>${ft(F.lanc, 'Feminino', '', 'gen:f')}${ft('', 'Masculino', '', 'gen:m')}</div>`));
$('.lfx-gen').after(mk(`<div class=lfx-tip><a href="#vitrine" data-mf="tipo:solar">Solar</a><a href="#vitrine" data-mf="tipo:grau">Leitura</a><a href="#vitrine" data-mf="tipo:armacao">Armações</a></div>`));
/* 3. listas: Feminino | Masculino + deslizam */
const [sNov, sMv] = $$('.hsh.hsh1'), [gNov, gMv] = $$('.hg');
sNov.querySelector('h2').innerHTML = 'Acabou de <em>chegar</em>'; sMv.querySelector('h2').innerHTML = 'Os mais <em>pedidos</em>';
[gNov, gMv].forEach(g => { g.classList.add('lfx-desl'); g.before(mk(`<div class=lfx-2l><button class=on>Feminino</button><button>Masculino</button></div>`)); });
/* 4. visto na foto (entre as listas): foto grande e, logo abaixo e FORA dela, a peça que a modelo usa */
const dados = c => { const ds = (c.querySelector('.hds') || {}).textContent || '', t = c.innerText, cod = (t.match(/[A-Z]{2}\d{3,5}/) || [''])[0], pr = (t.match(/R\$\s?[\d.,]+/) || [''])[0]; return {ds, cod, pr}; };
const c1 = gNov.children[0].cloneNode(true), d1 = dados(gNov.children[0]), peca = mk(`<div class=lfx-peca></div>`);
peca.appendChild(c1.querySelector('.hci')); const tx = mk(`<div class=tx><small style="display:block;font:12px/1.4 Inter,system-ui;color:#6b5a66">${d1.ds}</small><b style="display:block;font:600 14px/1.4 Inter,system-ui;color:#2a1f27">${d1.cod}</b><span style="font:600 14px/1.4 Inter,system-ui;color:#2a1f27">${d1.pr}</span></div>`); peca.append(tx, mk(`<i>Ver a peça ›</i>`));
const visto = mk(`<div class=lfx-visto style="margin:48px 0"><p class=lfx-rot>Visto na foto</p>${ft(F.retrato, '', '', '')}</div>`); visto.appendChild(peca);
sMv.before(visto);
/* 5. em movimento (vídeos curtos do Semp) */
const mov = mk(`<div><div class=hsh><h2 class=h2>Como fica no <em>rosto</em></h2></div><div class=lfx-mov></div></div>`);
[F.maisv, F.elas, F.grupo].forEach((s, i) => { const c = gNov.children[i + 1] || gNov.children[0], q = dados(c);
  mov.querySelector('.lfx-mov').appendChild(mk(`<div><a class=lfx-ft href="#rosto"><img src="${s}" alt=""><span class=play></span></a><p><b>${q.cod}</b>${q.pr}</p></div>`)); });
$('#hguia').before(mov); mov.style.marginTop = '48px';
/* 6. as duas ferramentas sobem para logo abaixo dos selos (dono 16:23); "Comece por aqui" sai (Dúvidas vai para o menu/rodapé) */
const gu = $('.hgu.hcom'), [bGrau, bRosto] = [...gu.children];
const fer = mk(`<div class=lfx-fer></div>`);
const ferr = (b, src, t, sub) => { b.classList.add('lfx-ft2'); b.style.backgroundImage = `url(${src})`; b.querySelector('.gt').innerHTML = `<b>${t}</b><small>${sub}</small>`; fer.appendChild(b); };
ferr(bRosto, F.design, 'Experimente no <em>rosto</em>', 'Pela câmera do celular'); ferr(bGrau, F.conforto, 'Descubra seu <em>grau</em>', 'Teste de leitura em 1 min');
$('.htr').after(fer); $('#hguia').remove(); gu.remove();
return 'ok'})()"""
open(os.path.join(AQ, 'proposta.js'), 'w').write(JS.replace('__F__', __import__('json').dumps(F)))
