"""IDEIAS 06e · o Destaque Campanha em CADA evento (dono 22/11 15:16). Base = /tmp/a6p (identidade fixa + aprovados).
Para cada data: o título pequeno, o título e o subtítulo são os do site hoje (EVD); o botão vira 'Descobrir a seleção'
('Descobrir as ofertas' na Black Friday); a seleção tem 3 escolhas; 3 peças reais por data, escolhidas pelo
que a data pede (no lugar das fotos da campanha do Semp). Mesmo movimento em todas (06d).
Uso: python3 eventos.py → /tmp/a6fe (:8735)"""
import shutil, json
D = {
 'bf':       dict(lab='Só esta semana', h='Black <em>Friday</em>', sub='Estoque limitado: quando acaba, acabou', bt='Descobrir as ofertas', sel=['Solar', 'Armações', 'Leitura'], p=['GR3340', 'SL2285', 'SL2255']),
 'natal':    dict(lab='Natal La Fouch', h='Presenteie estilo neste <em>Natal</em>', sub='Retirada no mesmo dia em Ciudad del Este', bt='Descobrir a seleção', sel=['Para ela', 'Para ele', 'Para todos'], p=['SL2265', 'SL2275', 'SL2260']),
 'anonovo-n':dict(lab='Ano Novo', h='Ano novo, <em>novo olhar</em>', sub='Dourados e clássicos para receber o ano', bt='Descobrir a seleção', sel=['Solar', 'Armações', 'Leitura'], p=['SL2270', 'SL2250', 'BR44145']),
 'maes':     dict(lab='Dia das Mães', h='Um presente com <em>carinho</em>', sub='Retirada no mesmo dia em Ciudad del Este', bt='Descobrir a seleção', sel=['Solar', 'Armações', 'Leitura'], p=['SL2300', 'AC1055', 'SL2270']),
 'pais':     dict(lab='Dia dos Pais', h='Estilo para o seu <em>pai</em>', sub='Retirada no mesmo dia em Ciudad del Este', bt='Descobrir a seleção', sel=['Solar', 'Armações', 'Leitura'], p=['SL2305', 'GR3345', 'SL2250']),
 'halloween':dict(lab='Halloween', h='Olhar <em>misterioso</em>', sub='Solares escuros e armações gatinho', bt='Descobrir a seleção', sel=['Solar', 'Gatinho', 'Armações'], p=['SL2255', 'BR44140', 'SL2285']),
}
import os
cat = json.load(open('/tmp/b5h/dados/inicio.json')); fs = os.listdir('/tmp/b5h/dados/f'); P = {}
for x in cat['docs']:
    f = x['fields']; r = f['ref']['stringValue']
    nome = f['nome']['stringValue'].replace('LaFouch ', '').replace('Óculos de sol', 'Óculos de sol').strip()
    n = int(f['n']['integerValue']); P[r] = ['/dados/f/' + [a for a in fs if a.startswith(r + '_')][0], '%s · G$ %s' % (nome, '{:,}'.format(n).replace(',', '.'))]
for k in D: D[k]['f'] = [P[r] for r in D[k]['p']]
CSS = (".lfcamp{margin:16px 16px 8px;border-radius:22px;overflow:hidden;background:var(--pn);border:1px solid var(--ln)}"
       ".lfcamp .ft{position:relative;overflow:hidden;aspect-ratio:4/3.4;background:#fff}"
       ".lfcamp .ft .sl{position:absolute;inset:0;background:#fff center/86% no-repeat;opacity:0;transition:opacity 1.4s cubic-bezier(.45,0,.25,1)}"
       ".lfcamp .ft .sl.on{opacity:1}.lfcamp .ft .sl.vai{transition:opacity 1.4s cubic-bezier(.45,0,.25,1),transform 6.5s linear;transform:scale(1.06)}"
       ".lfcamp .tx{padding:24px}"
       ".lfcamp .k{font:700 12px/1 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--act,var(--ac))}"
       ".lfcamp h2{font:600 30px/1.12 Fraunces,serif;margin:8px 0 8px;color:var(--tx)}.lfcamp h2 em{font-style:italic;color:var(--act,var(--ac))}"
       ".lfcamp .sub{font:400 15px/1.4 Inter,sans-serif;color:var(--mu);margin:0 0 4px}"
       ".lfcamp .p{font:400 14px/1.4 Inter,sans-serif;color:var(--mu);margin:0 0 16px;font-variant-numeric:tabular-nums;transition:opacity .7s}"
       ".lfcamp .bt{display:flex;align-items:center;justify-content:center;height:48px;border-radius:999px;background:var(--act,var(--ac));color:#fff;font:600 16px Inter,sans-serif;text-decoration:none}"
       ".lfcamp .sel{display:flex;gap:8px;margin-top:16px}.lfcamp .sel a{flex:1;display:flex;align-items:center;justify-content:center;height:44px;border-radius:999px;border:1px solid var(--ln2);color:var(--tx);font:500 14px Inter,sans-serif;text-decoration:none}"
       "@keyframes lxsobe{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}"
       ".lfcamp .tx>*{animation:lxsobe .7s cubic-bezier(.16,1,.3,1) both}"
       + ''.join('.lfcamp .tx>:nth-child(%d){animation-delay:%.2fs}' % (i + 1, .3 + .12 * i) for i in range(6)) +
       "@media (prefers-reduced-motion:reduce){.lfcamp .tx>*{animation:none}.lfcamp .ft .sl{transition:none!important;transform:none!important}}")
JS = ("\n/* PINTURA · IDEIAS 06e: Destaque Campanha por evento */\n(function(){var D=%s;var s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);"
      "var red=matchMedia('(prefers-reduced-motion: reduce)').matches;"
      "function monta(){var h=document.getElementById('home'),ev=document.documentElement.getAttribute('data-ev')||'';var e=D[ev]||D[ev.replace(/-[nd]$/,'')+'-n'];if(!h||!e||h.querySelector('.lfcamp'))return;"
      " var c=document.createElement('section');c.className='lfcamp';c.innerHTML='<div class=\"ft\"></div><div class=\"tx\"><div class=\"k\">'+e.lab+'</div><h2>'+e.h+'</h2><p class=\"sub\">'+e.sub+'</p><p class=\"p\"></p><a class=\"bt\" href=\"#\">'+e.bt+'</a><div class=\"sel\">'+e.sel.map(function(x){return '<a href=\"#\">'+x+'</a>'}).join('')+'</div></div>';"
      " h.insertBefore(c,h.firstChild);var f=c.querySelector('.ft'),P=c.querySelector('.p');var L=e.f.map(function(u){var d=document.createElement('div');d.className='sl';d.style.backgroundImage='url('+u[0]+')';f.appendChild(d);return d});"
      " var i=0;function mostra(){L.forEach(function(d,k){if(k!==i){d.classList.remove('on');setTimeout(function(){if(!d.classList.contains('on'))d.classList.remove('vai')},1500)}});"
      "  L[i].classList.add('on');var dd=L[i];if(!red)requestAnimationFrame(function(){dd.classList.add('vai')});"
      "  if(P.textContent){P.style.opacity=0;var t=e.f[i][1];setTimeout(function(){P.textContent=t;P.style.opacity=1},700)}else P.textContent=e.f[i][1]}"
      " mostra();if(!red)setInterval(function(){i=(i+1)%%L.length;mostra()},4500)}"
      "setInterval(monta,200)})();\n") % (json.dumps(D, ensure_ascii=False), CSS)
if __name__ == '__main__':
    shutil.rmtree('/tmp/a6fe', ignore_errors=True); shutil.copytree('/tmp/a6p', '/tmp/a6fe')
    open('/tmp/a6fe/js/lf-site.js', 'a').write(JS); print('ok')
