"""IDEIAS 06g v4 · (dono 22/11 15:59) presente por PEDIDO: as peças já vão com flanela e estojo; nos eventos todo pedido leva um mimo (spray de limpeza + cartão). A única escolha é EMBRULHAR (um embrulho por pedido) e escrever o cartão. Antes (v2/v3): 'Para presente' POR PEÇA e mais luxuoso (dono 22/11 15:41: 'mais luxuoso; e vários presentes? e várias peças?').
Lógica: cada peça é um pacote. Dentro do cartão de CADA peça, uma linha fina:
  ○ Embrulhar para presente            → toque marca (✓ na cor da data)
  depois de marcado: 'Escrever o cartão ›' → janela de baixo (regra 15) com a mensagem e 'Salvar';
  salvo: a mensagem aparece em itálico serifado, entre aspas, com 'Editar'.
O topo do carrinho ganha uma frase discreta: 'Embrulho de presente cortesia neste Natal.'
O Resumo conta: 'Presentes · 2 embrulhos · cortesia'. Palavras de luxo: 'cortesia', não 'grátis'.
Sai a versão v1 (cartão separado com Não|Sim). Uso: python3 presente2.py → /tmp/a6fp4 (:8738)"""
import shutil
CSS = (".lfgw{grid-column:1/-1;flex:0 0 100%;width:100%}.lfgl{display:flex;align-items:center;gap:12px;margin-top:12px;padding-top:12px;border-top:1px solid var(--ln);cursor:pointer;font:400 15px Inter,sans-serif;color:var(--tx)}"
       ".lfgl .ck{width:26px;height:26px;display:grid;place-items:center;flex:none;color:var(--mu);transition:color .42s cubic-bezier(.16,1,.3,1)}"
       ".lfgl .ck .tp{transform-origin:12px 9px;transform:translateY(-2.5px) rotate(-12deg);transition:transform .42s cubic-bezier(.16,1,.3,1)}"
       ".lfgl .ck .cx{fill:transparent;transition:fill .42s cubic-bezier(.16,1,.3,1)}"
       ".lfgl.on .ck{color:var(--act,var(--ac))}.lfgl.on .ck .tp{transform:none}.lfgl.on .ck .cx{fill:color-mix(in srgb,var(--act,var(--ac)) 14%,transparent)}"
       ".lfgpk{margin:0 0 16px;padding:16px;border-radius:22px;background:var(--pn);border:1px solid var(--ln)}.lfgpk b{display:block;font:600 15px Inter,sans-serif;color:var(--tx);margin-bottom:12px}"
       ".lfgpk .dl{display:flex;border:1px solid var(--ln2);border-radius:999px;padding:4px;gap:4px}.lfgpk .dl button{all:unset;flex:1;text-align:center;height:40px;line-height:40px;border-radius:999px;font:500 15px Inter,sans-serif;color:var(--mu);text-transform:none!important;letter-spacing:0!important}"
       ".lfgpk .dl button.on{background:var(--tx);color:var(--bg)}.lfgpk p{font:400 13px/1.4 Inter,sans-serif;color:var(--mu);margin:8px 0 0}"
       "#layer .cartp .cs-b,#layer .cartp .btn.w{background:#7a1f3d!important;border-color:#7a1f3d!important}"
       ".lfgm{margin:8px 0 0 34px;font:400 15px Inter,sans-serif}.lfgm a{color:var(--act,var(--ac));text-decoration:none}"
       ".lfgm q{display:block;font:italic 500 16px/1.45 Fraunces,serif;color:var(--tx);quotes:'“' '”'}.lfgm .ed{display:inline-block;margin-top:4px;font-size:14px}"
       ".lfgtop{font:italic 500 15px Fraunces,serif;color:var(--mu);margin:0 0 16px}"
       ".lfgsh{position:fixed;inset:0;z-index:90;background:rgba(18,8,14,.28)}.lfgsh .pn{position:absolute;left:0;right:0;bottom:0;background:var(--pn);border-radius:22px 22px 0 0;padding:8px 24px 24px}"
       ".lfgsh .gr{width:40px;height:4px;border-radius:2px;background:var(--ln2);margin:0 auto 16px}"
       ".lfgsh h3{font:600 24px Fraunces,serif;margin:0 0 4px;color:var(--tx)}.lfgsh p{font:400 14px Inter,sans-serif;color:var(--mu);margin:0 0 16px}"
       ".lfgsh .cp{display:block;border-bottom:1px solid var(--ln2);padding:8px 0}.lfgsh .cp small{font:500 12px Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}"
       ".lfgsh textarea{all:unset;display:block;width:100%;min-height:96px;font:italic 500 18px/1.45 Fraunces,serif;color:var(--tx);margin-top:6px}"
       ".lfgsh .ct{text-align:right;font:400 12px Inter,sans-serif;color:var(--mu);margin:6px 0 16px;font-variant-numeric:tabular-nums}"
       ".lfgsh .sv{display:flex;align-items:center;justify-content:center;height:48px;border-radius:999px;background:var(--act,var(--ac));color:#fff;font:600 16px Inter,sans-serif}")
CK = ('<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
      '<g class="tp"><path d="M3 9h18v3H3z"/><path d="M12 9c-2-4-6-4-6-1.5S12 9 12 9zm0 0c2-4 6-4 6-1.5S12 9 12 9z"/></g>'
      '<path class="cx" d="M4.5 12h15v8.5a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z"/><path d="M12 9v12.5"/></svg>')
JS = ("\n/* PINTURA · IDEIAS 06g v4: presente por PEDIDO + mimo do evento */\n(function(){var s=document.createElement('style');s.textContent=%r+'.lfgo{margin:16px 0 0;padding:16px;border-radius:22px;background:var(--pn);border:1px solid var(--ln)}.lfgo .lfgl{margin-top:0;padding-top:0;border-top:0}.lfgo .lfgm{margin-left:38px;display:block!important}.lfgmi{font:italic 500 15px/1.45 Fraunces,serif;color:var(--mu);margin:0 0 12px}';document.head.appendChild(s);var CK=%r;var G=window.__lfG={on:false,msg:''};"
      "function pinta(){var o=document.querySelector('.lfgo');if(!o)return;o.querySelector('.lfgl').classList.toggle('on',G.on);var m=o.querySelector('.lfgm');"
      " m.innerHTML=G.msg?'<q>'+G.msg.replace(/</g,'&lt;')+'</q><a class=\"ed\" href=\"#\">Editar o cartão ›</a>':'<a href=\"#\">Escrever o cartão ›</a>';m.querySelector('a').onclick=function(e){e.preventDefault();folha()};resumo()}"
      "function folha(){var f=document.createElement('div');f.className='lfgsh';f.innerHTML='<div class=\"pn\"><div class=\"gr\"></div><h3>O cartão</h3><p>Vai junto com o pedido, escrito à mão.</p><label class=\"cp\"><small>Mensagem</small><textarea maxlength=\"200\"></textarea></label><div class=\"ct\">0/200</div><div class=\"sv\" role=\"button\">Salvar</div></div>';"
      " document.body.appendChild(f);var t=f.querySelector('textarea');t.value=G.msg;var ct=f.querySelector('.ct');function n(){ct.textContent=t.value.length+'/200'}n();t.oninput=n;f.onclick=function(e){if(e.target===f)f.remove()};f.querySelector('.sv').onclick=function(){G.msg=t.value.trim();f.remove();pinta()}}"
      "function resumo(){var p=document.querySelector('#layer .cartp');if(!p)return;var ent=[].find.call(p.querySelectorAll('span'),function(x){return x.textContent.trim()==='Entrega'});if(!ent)return;var row=ent.parentElement,r=p.querySelector('.lfgres');"
      " if(!r){r=row.cloneNode(true);r.classList.add('lfgres');row.parentNode.insertBefore(r,row.nextSibling)}r.style.display=G.on?'':'none';r.children[0].textContent='Embrulho para presente';r.children[1].textContent='cortesia'}"
      "setInterval(function(){var p=document.querySelector('#layer .cartp');if(!p||p.querySelector('.lfgo'))return;var its=[].map.call(p.querySelectorAll('.crl'),function(b){var c=b;while(c&&!(getComputedStyle(c).borderTopLeftRadius!=='0px'&&c.getBoundingClientRect().width>300))c=c.parentElement;return c}).filter(Boolean);if(!its.length)return;var ult=its[its.length-1];"
      " if(!p.querySelector('.lfgtop')){var h=p.querySelector('h2');if(h){var t=document.createElement('p');t.className='lfgtop';t.textContent='Neste Natal, todo pedido leva um mimo: spray de limpeza e um cartão La Fouch.';h.parentElement.parentNode.insertBefore(t,h.parentElement.nextSibling)}}"
      " var o=document.createElement('div');o.className='lfgo';o.innerHTML='<div class=\"lfgl\"><span class=\"ck\">'+CK+'</span><span>Embrulhar para presente</span></div><div class=\"lfgm\"></div>';ult.parentNode.insertBefore(o,ult.nextSibling);"
      " o.querySelector('.lfgl').onclick=function(){G.on=!G.on;pinta()};pinta()},250)})();\n") % (CSS, CK)
shutil.rmtree('/tmp/a6fp4', ignore_errors=True); shutil.copytree('/tmp/a6fg', '/tmp/a6fp4')
open('/tmp/a6fp4/js/lf-site.js', 'a').write(JS); print('ok')
