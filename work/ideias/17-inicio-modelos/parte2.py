"""IDEIAS 17 · parte 2 de 5 (dono 26/11 13:50): selos + "Compre por categoria".
Base: a tela REAL pelo kit (work/kit/kit.py, regra 11) + parte 1 aprovada como direção (capa de tela inteira).
Parte 2: os selos ficam como estão (já são da família); os cartões de categoria ficam o MESMO componente (cartão branco,
mesmo arredondado, borda, rótulo e "N modelos" de hoje) — só a imagem muda: em vez da peça solta, a modelo usando a
peça, mais alta (3:4), ocupando o cartão. Solar: lugar marcado para a foto do Semp (não há foto de modelo de sol ainda).
Medidas: nada novo — margens, espaço entre cartões e letras são as do site; só a proporção da imagem muda.
Gera parte2.js e roda o kit (Hoje e Proposta, com o olho.js/ecom.js), depois a prancha do kit."""
import os, subprocess, sys
AQ = os.path.dirname(os.path.abspath(__file__)); R = os.path.abspath(os.path.join(AQ, '../../..')); sys.path.insert(0, AQ)
from fotos import CAFE, ESTU
CAPA = r"""
  const d = document.getElementById('hdst'); const cod = d.querySelector('[data-open]').dataset.open;
  const topH = document.querySelector('.top').getBoundingClientRect().height;
  const st0 = document.createElement('style'); st0.textContent = `
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
  .lfx-capa .pts{display:flex;gap:16px;justify-content:center;margin-top:16px}.lfx-capa .pts i{width:8px;height:8px;border-radius:8px;background:#fff8}.lfx-capa .pts i.on{width:24px;background:#fff}`;
  document.head.appendChild(st0);
  const cap = document.createElement('section'); cap.id = 'lfxcapa'; cap.className = 'lfx-capa'; cap.dataset.open = cod;
  cap.innerHTML = `<img class=bg src="${CAFE}"><div class=vt></div><div class=vb></div><div class=cima><div class=rot>Destaque da semana</div><h1>Armação LaFouch <em>quadrada</em></h1></div><div class=baixo><p>Acetato rosé com detalhe dourado na haste.</p><span class=bt>Ver a peça</span><div class=pts><i class=on></i><i></i><i></i><i></i></div></div>`;
  /* jeito natural (regra 12b): a capa fica FORA da coluna com margens, como peça de tela inteira — sem margem negativa */
  const topW = document.querySelector('.top').getBoundingClientRect().width;
  let host = d; while (host.parentElement && host.parentElement.getBoundingClientRect().width < topW - 1) host = host.parentElement;
  host.parentElement.insertBefore(cap, host); d.style.display = 'none';
  const tb = document.querySelector('.top').getBoundingClientRect().bottom, r = cap.getBoundingClientRect();
  const pp = getComputedStyle(cap.parentElement), pl = parseFloat(pp.paddingLeft), pr = parseFloat(pp.paddingRight);
  cap.style.cssText = `height:${innerHeight - topH}px;margin:${tb - r.top - scrollY}px ${-pr}px 0 ${-pl}px`;  /* sangra só o recuo da coluna da página */
"""
P2 = r"""
  const st = document.createElement('style'); st.textContent = `
  #home .hcat .hci{aspect-ratio:3/4;height:auto!important;padding:0!important;overflow:hidden;position:relative}
  #home .hcat .hci img{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover;object-position:50% 20%}
  #home .hcat .lfx-semp{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,#fcf3f8,#f2dce8);color:#943d6f;font:600 12px/1.5 Inter,system-ui;padding:16px}`;
  document.head.appendChild(st);
  const [aSol, aArm] = document.querySelectorAll('#home .hcat a');
  aArm.querySelector('img').src = ESTU;
  const ps = document.createElement('div'); ps.className = 'lfx-semp'; ps.innerHTML = 'FOTO DO SEMP<br>modelo usando<br>óculos de sol da loja'; aSol.querySelector('.hci').appendChild(ps);
"""
def js(partes): return "(()=>{const CAFE=%r, ESTU=%r;\n%s\nreturn 'ok'})()" % (CAFE, ESTU, '\n'.join(partes))
open(os.path.join(AQ, 'parte1.js'), 'w').write(js([CAPA]))
open(os.path.join(AQ, 'parte2.js'), 'w').write(js([CAPA, P2]))
kit = os.path.join(R, 'work/kit/kit.py'); o = lambda n: os.path.join(AQ, n)
def roda(*a):
    r = subprocess.run(['python3', kit] + list(a), capture_output=True, text=True, timeout=240); print('\n'.join(l for l in r.stdout.splitlines() if 'DESIGNER' in l) or '(designer sem avisos)'); print(r.stderr[-400:])
print('== HOJE');      roda('site', 'home', o('p2-hoje.png'), '--alvo', '.htr')
print('== PROPOSTA');  roda('site', 'home', o('p2-proposta.png'), o('parte2.js'), '--alvo', '.htr')
roda('prancha', o('esboco-17-parte2-categorias.jpg'), 'Início · parte 2 de 5', 'selos + Compre por categoria',
     o('p2-hoje.png') + ':Hoje:cartões com a peça solta', o('p2-proposta.png') + ':Proposta:mesmo cartão, a modelo usando a peça (3:4)')
