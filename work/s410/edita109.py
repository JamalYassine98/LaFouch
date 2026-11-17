# S410 · ESBOÇO 109 (Mochi): quando ela passeia (pessoa demorando), só vai a um cantinho onde caiba INTEIRA na tela e a 12 px ou mais do balão.
# Se nenhum cantinho cabe, ela fica onde está (no lugar de apontar). python3 edita109.py <lf-site.js>
import sys,subprocess
p=sys.argv[1];s=open(p,encoding='utf8').read()
def troca(a,b):
    global s;assert s.count(a)==1,'achei %d×: %s'%(s.count(a),a[:80]);s=s.replace(a,b)
troca(",z=zs[Math.floor(Math.random()*zs.length)];m.paraGesto();m.vara(0);",
 ";zs=zs.filter(zCabe);if(!zs.length)return;var z=zs[Math.floor(Math.random()*zs.length)];m.paraGesto();m.vara(0);")
troca("function livre(){var m=Z.m;",
 "function zCabe(z){var p=L.Z[z],m=Z.m,b=q('#gzbal');if(!p||!m||!b||!m.el.offsetParent)return true;var S=m.el.offsetParent.getBoundingClientRect(),B=b.getBoundingClientRect(),x0=S.left+p[0],y0=S.top+p[1],x1=x0+m.el.offsetWidth,y1=y0+m.el.offsetHeight;"
 "if(z==='z4'){var F=q('#gzfw');if(F)y1=Math.min(y1,F.getBoundingClientRect().top)}if(x1>innerWidth+2||x0<-2)return false;if(!b.classList.contains('on')&&!b.textContent.trim())return true;var g=12;return x0>=B.right+g||x1<=B.left-g||y0>=B.bottom+g||y1<=B.top-g}\n"
 "    function livre(){var m=Z.m;")
open(p,'w',encoding='utf8').write(s)
r=subprocess.run(['node','-e',"new (require('vm').Script)(require('fs').readFileSync('%s','utf8'))"%p],capture_output=True,text=True);assert r.returncode==0,r.stderr[-400:];print('ok')
