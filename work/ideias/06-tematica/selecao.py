"""IDEIAS 06f · página da SELEÇÃO da data (para onde leva 'Descobrir a seleção'). Hoje: 'Ver presentes' só rola até
a vitrine comum do Início (#vitrine). Proposta: uma tela própria (regra 16: lugar = tela com título e '‹ voltar'),
no padrão do catálogo do site: '‹ Início', título serifado, a faixa da campanha (as mesmas fotos que se dissolvem),
uma frase, abas no mesmo desenho das abas do catálogo (Todos · Para ela · Para ele) e a grade com SÓ as peças
escolhidas para a data — os cartões são os mesmos do catálogo (clonados do site, não desenhados de novo).
Base = /tmp/a6fe (molde + cores por data). Uso: python3 selecao.py → /tmp/a6fg (:8736)"""
import shutil, json
import os
_fs = os.listdir('/tmp/b5h/dados/f'); FOTO = lambda r: '/dados/f/' + [a for a in _fs if a.startswith(r + '_')][0]
SEL = {'natal': dict(fotos=[FOTO(r) for r in ('SL2265', 'SL2275', 'SL2260')], t='Seleção de <em>Natal</em>', fr='Escolhidas pela La Fouch para presentear. Retirada no mesmo dia em Ciudad del Este.',
                     refs=['SL2265', 'SL2300', 'SL2270', 'SL2275', 'SL2305', 'SL2250', 'SL2260', 'SL2285'])}
CSS = (".lfselb{position:relative;margin:8px 0 0;border-radius:22px;overflow:hidden;aspect-ratio:16/9;background:#fff;border:1px solid var(--ln)}"
       ".lfselb .sl{position:absolute;inset:0;background:#fff center/70% no-repeat;opacity:0;transition:opacity 1.4s cubic-bezier(.45,0,.25,1)}.lfselb .sl.on{opacity:1}"
       ".lfselb .sl.vai{transition:opacity 1.4s cubic-bezier(.45,0,.25,1),transform 6.5s linear;transform:scale(1.06)}"
       ".lfself{font:400 15px/1.45 Inter,sans-serif;color:var(--mu);margin:16px 0 8px}"
       "#vtitT em{font-style:italic;color:var(--act,var(--ac))}html.lfsel .vtit .lfgf{display:none!important}html.lfsel #lfgen button{font-size:17px!important}")
JS = ("\n/* PINTURA · IDEIAS 06f: a página do catálogo vira a SELEÇÃO da data */\n(function(){var S=%s;var s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);"
      "window.__lfSel=function(){var ev=(document.documentElement.getAttribute('data-ev')||'').replace(/-[nd]$/,'');var e=S[ev];if(!e)return;document.documentElement.classList.add('lfsel');"
      " var t=document.getElementById('vtitT');t.innerHTML=e.t;var vn=document.querySelector('#vitrine .vnav');"
      " if(!document.querySelector('.lfselb')){var bd=document.createElement('div');bd.className='lfselb';var fr=document.createElement('p');fr.className='lfself';fr.textContent=e.fr;var gn=document.getElementById('lfgen');gn.parentNode.insertBefore(bd,gn);gn.parentNode.insertBefore(fr,gn);"
      "  var L=e.fotos.map(function(u){var d=document.createElement('div');d.className='sl';d.style.backgroundImage='url('+u+')';bd.appendChild(d);return d});"
      "  var i=0;function mo(){L.forEach(function(d,k){d.classList.toggle('on',k===i);if(k!==i)d.classList.remove('vai')});requestAnimationFrame(function(){L[i]&&L[i].classList.add('vai')})}mo();setInterval(function(){i=(i+1)%%L.length;mo()},4500)}"
      " [].forEach.call(document.querySelectorAll('#vitrine button, #vitrine a'),function(b){if(b.closest('#fsh'))return;var x=b.textContent.trim();if(x==='Feminino')b.textContent='Para ela';else if(x==='Masculino')b.textContent='Para ele';else if(x==='Unissex')b.remove()});"
      " var n=0;document.querySelectorAll('#grid article.card').forEach(function(c){var o=c.querySelector('[data-open]');var ok=o&&e.refs.indexOf(o.dataset.open)>=0;c.style.display=ok?'':'none';if(ok)n++});"
      " var ct=document.getElementById('count');if(ct)ct.textContent=n+' modelos'};"
      "})();\n") % (json.dumps(SEL, ensure_ascii=False), CSS)
if __name__ == '__main__':
    cat = json.load(open('/tmp/b5h/dados/inicio.json'))
    GEN = {x['fields']['ref']['stringValue']: x['fields']['gen']['stringValue'] for x in cat['docs']}
    shutil.rmtree('/tmp/a6fg', ignore_errors=True); shutil.copytree('/tmp/a6fe', '/tmp/a6fg')
    open('/tmp/a6fg/js/lf-site.js', 'a').write('\nwindow.__lfGen=%s;\n' % json.dumps(GEN) + JS); print('ok')
