"""IDEIAS 06g v2 · 'Para presente' POR PEÇA e mais luxuoso (dono 22/11 15:41: 'mais luxuoso; e vários presentes? e várias peças?').
Lógica: cada peça é um pacote. Dentro do cartão de CADA peça, uma linha fina:
  ○ Embrulhar para presente            → toque marca (✓ na cor da data)
  depois de marcado: 'Escrever o cartão ›' → janela de baixo (regra 15) com a mensagem e 'Salvar';
  salvo: a mensagem aparece em itálico serifado, entre aspas, com 'Editar'.
O topo do carrinho ganha uma frase discreta: 'Embrulho de presente cortesia neste Natal.'
O Resumo conta: 'Presentes · 2 embrulhos · cortesia'. Palavras de luxo: 'cortesia', não 'grátis'.
Sai a versão v1 (cartão separado com Não|Sim). Uso: python3 presente2.py → /tmp/a6fp3 (:8738)"""
import shutil
CSS = (".lfgw{grid-column:1/-1;flex:0 0 100%;width:100%}.lfgl{display:flex;align-items:center;gap:12px;margin-top:12px;padding-top:12px;border-top:1px solid var(--ln);cursor:pointer;font:400 15px Inter,sans-serif;color:var(--tx)}"
       ".lfgl .ck{width:22px;height:22px;border-radius:50%;border:1px solid var(--ln2);display:grid;place-items:center;flex:none;transition:background .3s,border-color .3s}"
       ".lfgl.on .ck{background:var(--act,var(--ac));border-color:var(--act,var(--ac))}.lfgl .ck svg{opacity:0;transition:opacity .3s}.lfgl.on .ck svg{opacity:1}"
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
CK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>'
JS = ("\n/* PINTURA · IDEIAS 06g v2: presente por peça */\n(function(){var s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);var CK=%r;window.__lfG={};"
      "function cards(p){return [].filter.call(p.querySelectorAll('*'),function(e){return e.querySelector&&e.querySelector('.crl')&&!e.parentElement.closest('.lfcard')&&getComputedStyle(e).borderTopLeftRadius!=='0px'&&e.getBoundingClientRect().width>300&&!e.querySelector('*[style*=\"border-top-left-radius\"]')})}"
      "function linha(c,ref){var g=window.__lfG[ref]||{};var l=c.querySelector('.lfgl');if(!l){var w=document.createElement('div');w.className='lfgw';if(getComputedStyle(c).display.indexOf('flex')>=0)c.style.flexWrap='wrap';c.appendChild(w);l=document.createElement('div');l.className='lfgl';l.innerHTML='<span class=\"ck\">'+CK+'</span><span>Embrulhar para presente</span>';w.appendChild(l);"
      "  var m=document.createElement('div');m.className='lfgm';w.appendChild(m);l.onclick=function(){var x=window.__lfG[ref]=window.__lfG[ref]||{};x.on=!x.on;linha(c,ref);resumo()}}"
      " l.classList.toggle('on',!!g.on);var m=c.querySelector('.lfgm');m.style.display=g.on?'':'none';"
      " m.innerHTML=g.msg?'<q>'+g.msg.replace(/</g,'&lt;')+'</q><a class=\"ed\" href=\"#\">Editar o cartão ›</a>':'<a href=\"#\">Escrever o cartão ›</a>';"
      " m.querySelector('a').onclick=function(ev){ev.preventDefault();folha(c,ref)}}"
      "function folha(c,ref){var g=window.__lfG[ref];var f=document.createElement('div');f.className='lfgsh';f.innerHTML='<div class=\"pn\"><div class=\"gr\"></div><h3>O cartão</h3><p>Vai junto com a peça, escrito à mão.</p><label class=\"cp\"><small>Mensagem</small><textarea maxlength=\"200\"></textarea></label><div class=\"ct\">0/200</div><div class=\"sv\" role=\"button\">Salvar</div></div>';"
      " document.body.appendChild(f);var t=f.querySelector('textarea');t.value=g.msg||'';var ct=f.querySelector('.ct');function n(){ct.textContent=t.value.length+'/200'}n();t.oninput=n;"
      " f.onclick=function(e){if(e.target===f)f.remove()};f.querySelector('.sv').onclick=function(){g.msg=t.value.trim();f.remove();linha(c,ref)};window.__lfFolha=f}"
      "function resumo(){var n=0;for(var k in window.__lfG)if(window.__lfG[k].on)n++;var p=document.querySelector('#layer .cartp');if(!p)return;var r=p.querySelector('.lfgres');"
      " var ent=[].find.call(p.querySelectorAll('span'),function(x){return x.textContent.trim()==='Entrega'});if(!ent)return;var row=ent.parentElement;"
      " if(!r){r=row.cloneNode(true);r.classList.add('lfgres');row.parentNode.insertBefore(r,row.nextSibling)}r.style.display=n?'':'none';r.children[0].textContent='Presentes';r.children[1].textContent=n+(n>1?' embrulhos':' embrulho')+' · cortesia'}"
      "setInterval(function(){var p=document.querySelector('#layer .cartp');if(!p)return;"
      " if(!p.querySelector('.lfgtop')){var h=p.querySelector('h2');if(h){var t=document.createElement('p');t.className='lfgtop';t.textContent='Embrulho de presente cortesia neste Natal.';var st=h.parentElement.nextSibling;h.parentElement.parentNode.insertBefore(t,st)}}"
      " p.querySelectorAll('.crl').forEach(function(b){var c=b.closest('[class]');while(c&&!(getComputedStyle(c).borderTopLeftRadius!=='0px'&&c.getBoundingClientRect().width>300))c=c.parentElement;if(!c||c._lfg)return;c._lfg=1;"
      "  var r=(c.textContent.match(/[A-Z]{2}\\d{4,5}/)||[''])[0];linha(c,r)});resumo()},250)})();\n") % (CSS, CK)
shutil.rmtree('/tmp/a6fp3', ignore_errors=True); shutil.copytree('/tmp/a6fg', '/tmp/a6fp3')
open('/tmp/a6fp3/js/lf-site.js', 'a').write(JS); print('ok')
