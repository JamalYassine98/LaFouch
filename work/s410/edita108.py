# S410 · ESBOÇO 108 (Mochi): toda fala que cita um botão faz ESSE botão dar os dois halos vinho do 107, 1,2 s depois de a fala começar.
# Hoje: "Se estiver difícil, pode dizer que não consegue — sem problema." → Não consigo; "Quando quiser, é só tocar em Começar." → Começar.
import sys,subprocess
p=sys.argv[1];s=open(p,encoding='utf8').read()
def troca(a,b):
    global s;assert s.count(a)==1,'achei %d×: %s'%(s.count(a),a[:80]);s=s.replace(a,b)
troca("function fala(h,cb,perg,dz){",
 "function btLuz(t){var M2=[[T('Se estiver difícil, pode dizer que não consegue — sem problema.'),'#gw [data-gz=nao]'],[T('Quando quiser, é só tocar em Começar.'),'#gzcom']],s0=null;M2.forEach(function(x){if(t.indexOf(x[0])>=0)s0=x[1]});if(!s0)return;var t0=Date.now();setTimeout(function w(){var b=document.querySelector(s0);if(!b||!Z.m||Date.now()-t0>12000)return;if(RM.matches||!b.animate)return;b.animate([{boxShadow:'0 0 0 0 rgba(141,58,105,.6)'},{boxShadow:'0 0 0 20px rgba(141,58,105,0)'}],{duration:1100,iterations:2,easing:'cubic-bezier(.2,.7,.3,1)'})},1200)}\n"
 "    function fala(h,cb,perg,dz){")
troca("var b=Z.el&&Z.el.querySelector('#gzbal'),t=String(dz||h).replace(/<[^>]+>/g,''),id=++FID,est=Math.min(7000,700+t.length*62);",
 "var b=Z.el&&Z.el.querySelector('#gzbal'),t=String(dz||h).replace(/<[^>]+>/g,''),id=++FID,est=Math.min(7000,700+t.length*62);btLuz(String(h).replace(/<[^>]+>/g,''));")
open(p,'w',encoding='utf8').write(s)
r=subprocess.run(['node','-e',"new (require('vm').Script)(require('fs').readFileSync('%s','utf8'))"%p],capture_output=True,text=True);assert r.returncode==0,r.stderr[-400:];print('ok')
