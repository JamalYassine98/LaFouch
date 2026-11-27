"""IDEIAS 18 v25 — lâmina 2 da capa (dono 22:34–22:43): natureza-morta = UMA foto de estúdio do Semp (Flow), não recortes.
Por cima só o nome em Fraunces fina (opsz 144, peso 300) e uma frase; sem nome de cor e sem botão (a lâmina inteira é tocável); os pontos ficam.
Fotos: semp/natureza-morta-pc.jpg (16:9) e semp/natureza-morta-celular.jpg (em pé). Letra: semp/fraunces-300-titulos.woff2 (só as letras do nome, para o esboço)."""
import os, base64
AQ = os.path.dirname(os.path.abspath(__file__))
def d64(p, mime): return f'data:{mime};base64,' + base64.b64encode(open(os.path.join(AQ, p), 'rb').read()).decode()
PC, CEL, FON = d64('semp/natureza-morta-pc.jpg', 'image/jpeg'), d64('semp/natureza-morta-celular.jpg', 'image/jpeg'), d64('semp/fraunces-300-titulos.woff2', 'font/woff2')
JS = r"""(()=>{
const st=document.createElement('style'); st.textContent=`
@font-face{font-family:'Fraunces Fina';src:url(__FON__) format('woff2');font-weight:300}
.lfx-capa.l2{color:#2a1f27;background:#f1e6ec}
.lfx-capa.l2 .bg{content:url(__CEL__);object-position:50% 100%}
.lfx-capa.l2 .vt,.lfx-capa.l2 .vb{display:none}
.lfx-capa.l2 .cima{top:48px}
.lfx-capa.l2 h1{font:300 80px/1 'Fraunces Fina',Fraunces,Georgia,serif;font-optical-sizing:auto;letter-spacing:-.01em;color:#2a1f27;margin:0}
.lfx-capa.l2 .frase{display:block;max-width:280px;margin-left:auto!important;margin-right:auto!important;font:300 20px/1.4 Inter,system-ui;color:#2a1f27;margin-top:16px;text-wrap:balance}
.lfx-capa.l2 .baixo{bottom:24px}
.lfx-capa.l2 .pts i{background:#2a1f2733}.lfx-capa.l2 .pts i.on{background:var(--ac)}
@media (min-width:1024px){
.lfx-capa.l2 .bg{content:url(__PC__);object-position:50% 80%}
.lfx-capa.l2 .cima{top:56px;left:0;right:0;display:flex;align-items:last baseline;justify-content:center;gap:48px;text-align:left}  /* v31: posição da v28 (centrada); a frase apoia na linha de base do nome — fica na altura do miolo das letras, não no meio da caixa com o acento e a haste do d */
.lfx-capa.l2 h1{font-size:144px}  /* v28: 144 = o ponto ótimo do tamanho óptico da Fraunces */
.lfx-capa.l2 .frase{margin:0!important;max-width:340px;font-size:28px;line-height:1.3;font-weight:300;color:#6b5a66}  /* tom secundário: o nome manda, a frase acompanha */  /* v27: título menor e frase maior — proporção ~5:1 em vez de ~9:1 */
.lfx-capa.l2 .baixo{bottom:32px}
}`; document.head.appendChild(st);
const c=document.getElementById('lfxcapa'); c.classList.add('l2');
c.querySelector('.cima').innerHTML='<h1>Odéon</h1><span class=frase>Presença que dispensa palco.</span>';
const b=c.querySelector('.baixo'); b.querySelector('p').remove(); b.querySelector('.bt').remove();
c.querySelectorAll('.pts i').forEach((e,i)=>e.classList.toggle('on',i==1));
return 'ok'})()"""
open(os.path.join(AQ, 'lamina2.js'), 'w').write(open(os.path.join(AQ, 'proposta.js')).read() + ';\n' + JS.replace('__PC__', PC).replace('__CEL__', CEL).replace('__FON__', FON))
