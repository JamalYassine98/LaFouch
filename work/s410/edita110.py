# S410 · ESBOÇO 110 (Mochi): no passeio, a mesma folga de 12 px vale também para os BOTÕES; o cantinho de baixo do quadro sobe para caber.
# Vem por cima do 109 (precisa do zCabe). python3 edita110.py <lf-site.js>
import sys,subprocess
p=sys.argv[1];s=open(p,encoding='utf8').read()
def troca(a,b):
    global s;assert s.count(a)==1,'achei %d×: %s'%(s.count(a),a[:80]);s=s.replace(a,b)
troca("z3:[Math.max(L.wl,W/2-66*k),L.top+L.wh+L.gap-101*k-6]","z3:[Math.max(L.wl,W/2-66*k),L.top+L.wh+8+(L.gap-8-110*k)/2]")
troca("var g=12;return x0>=B.right+g||x1<=B.left-g||y0>=B.bottom+g||y1<=B.top-g}",
 "var g=12,lv=function(R){return x0>=R.right+g||x1<=R.left-g||y0>=R.bottom+g||y1<=R.top-g};if(!lv(B))return false;var ok=true;document.querySelectorAll('#gzbt .gzgo').forEach(function(e){var r=e.getBoundingClientRect();if(r.width&&!lv(r))ok=false});return ok}")
troca("if(!b.classList.contains('on')&&!b.textContent.trim())return true;","var semB=!b.classList.contains('on')&&!b.textContent.trim();")
troca("if(!lv(B))return false;","if(!semB&&!lv(B))return false;")
open(p,'w',encoding='utf8').write(s)
r=subprocess.run(['node','-e',"new (require('vm').Script)(require('fs').readFileSync('%s','utf8'))"%p],capture_output=True,text=True);assert r.returncode==0,r.stderr[-400:];print('ok')
