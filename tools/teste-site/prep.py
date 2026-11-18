# S414: monta duas cópias do site para comparar num aparelho/navegador de verdade:
#   t/hoje = o site como está publicado; t/prop = o mesmo site + os esboços injetados (nada vai para o ar).
# uso: python3 prep.py <pasta do site> <saida t> "work/s412/prop112.js,work/s413/prop2.js"
import sys, os, shutil
site, out, props = sys.argv[1], sys.argv[2], [p for p in sys.argv[3].split(',') if p.strip()]
raiz = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
shutil.rmtree(out, ignore_errors=True)
ign = shutil.ignore_patterns('.git', 'p', 'modelo', 'teste-giro', 'promo.mp4', 'og')
for nome in ('hoje', 'prop'):
    shutil.copytree(site, os.path.join(out, nome), ignore=ign)
js = ''.join("addEventListener('DOMContentLoaded',()=>{%s});\n" % open(os.path.join(raiz, p.strip()), encoding='utf-8').read() for p in props)
f = os.path.join(out, 'prop', 'index.html'); h = open(f, encoding='utf-8').read()
h = h.replace('</body>', '<script>/*ESBOCO*/\n' + js + '</script></body>', 1) if '</body>' in h else h + '<script>' + js + '</script>'
open(f, 'w', encoding='utf-8').write(h)
print('ok', props)
