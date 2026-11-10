# S108 (esboço): lupa larga + Mochi espiando pela borda + com lente vai direto à bula + espaço entre balão e lente. Aplica só na cópia do simulador.
import sys;p=sys.argv[1];s=open(p).read()
def R(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]);s=s.replace(a,b)
R("L.wl=Math.round(173*k+6);L.ww=W-L.wl-18;","L.wl=Math.round(173*k+6);L.ww=W-L.wl-18;if(Z.lupa){L.wl=Math.round(64*k);L.ww=W-L.wl-12}")
R("var bh=Math.max(64,bal.offsetHeight);L.top=bh+22;","var bh=Math.max(64,bal.offsetHeight);L.top=bh+22+(Z.lupa?16:0);")
# ponto do Mochi na lupa: espiando pela borda esquerda, na altura da frase
R("    function mira(ja){","""    function pontoLupa(){var k=L.k,ty=L.top+1+yLin(Z.at)-pag(Z.at)*L.wh;L.Z.ponto=[-42*k,ty-58*k-3];if(Z.m)Z.m.el.style.zIndex=7}
    function mira(ja){if(Z.lupa)pontoLupa();""")
R("    function aponta(){var m=Z.m;if(!m)return;if(m.gestoUsa('d'))m.paraGesto();mira(false)}",
  "    function aponta(){var m=Z.m;if(!m)return;if(m.gestoUsa('d'))m.paraGesto();if(Z.lupa){pontoLupa();var p=L.Z.ponto;if(Math.abs(m.x-p[0])>2||Math.abs(m.y-p[1])>2){m.flutua(p[0],p[1],480,function(){mira(false)});return}}mira(false)}")
# lente → lupa larga (antes da lente voar) e direto para a bula
R("function trocaLente(g,cb0){var m=Z.m,fr=q('#gzfr');if(!m)return;","function trocaLente(g,cb0){var m=Z.m,fr=q('#gzfr');if(!m)return;if(!Z.lupa){Z.lupa=1;q('#gzfita').classList.add('lupa');lay()}")
R("var pri=!Z.g;segue(function(){var w=junta(function(){Z.slot=null;aponta();","var pri=!Z.g;segue(function(){var w=junta(function(){Z.slot=null;if(Z.at!==LS.length-1)resetLinhas();aponta();")
R("function fimTeste(){","function fimTeste(){Z.lupa=0;")
R("function ppIni(G,n){var m=Z.m;if(!m)return;","function ppIni(G,n){var m=Z.m;if(!m)return;if(Z.lupa){Z.lupa=0;q('#gzfita').classList.remove('lupa');lay()}")
open(p,'w').write(s);print('ok')
