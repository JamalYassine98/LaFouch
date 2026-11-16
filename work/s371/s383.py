# S383 (16/11/2026): nova estratégia para as travadas — o medidor mostrou que quem mais segura a tela é a função que redesenha a Mochi a cada quadro (frame), não a câmera.
# Ela reescrevia ~20 atributos do desenho 60 vezes por segundo mesmo parada. Agora só escreve o que mudou de valor (o desenho fica idêntico) e não procura as peças do braço a cada quadro.
import re
p='/home/claude/catalogo/js/lf-site.js';s=open(p,encoding='utf8').read()
i=s.index(" function armSet(lado,ang,L,fE){");j=s.index(" raf=requestAnimationFrame(frame);\n",i);reg=s[i:j]
pat=re.compile(r"((?:N\[[^\]]+\]|[A-Za-z_$][\w$]*)(?:\.[A-Za-z_$][\w$]*(?:\[\d+\])?)*)\.setAttribute\(")
n1=len(pat.findall(reg));reg=pat.sub(r"SA(\1,",reg)
# estilos escritos a cada quadro
for a,b in ((".style.display=op<1?'':'none';",None),):pass
reg2=reg
reg2=reg2.replace("B.style.display=op<1?'':'none';","ST(B,'display',op<1?'':'none');").replace("F.style.display=op>0?'':'none';","ST(F,'display',op>0?'':'none');")
reg2=reg2.replace("nS.style.transform=`scale(${(1+(MOL.sx.v-1)*.3).toFixed(4)},${(1+(MOL.sy.v-1)*.3).toFixed(4)})`;","ST(nS,'transform',`scale(${(1+(MOL.sx.v-1)*.3).toFixed(4)},${(1+(MOL.sy.v-1)*.3).toFixed(4)})`);")
reg2=reg2.replace("nT.style.transform=`rotate(${(M.rot!=null?M.rot:MOL.ti.v).toFixed(2)}deg)`;","ST(nT,'transform',`rotate(${(M.rot!=null?M.rot:MOL.ti.v).toFixed(2)}deg)`);")
reg2=reg2.replace("nE.style.transform=`rotate(${MOL.es.v.toFixed(2)}deg)`;nE.style.transformOrigin='60px 58px';","ST(nE,'transform',`rotate(${MOL.es.v.toFixed(2)}deg)`);ST(nE,'transformOrigin','60px 58px');")
n2=reg2.count("ST(")
reg2=reg2.replace("const G=q(lado<0?'.filE':'.filD'),body=q('.corpoF');","const G=lado<0?(N._fE||(N._fE=q('.filE'))):(N._fD||(N._fD=q('.filD'))),body=N._cF||(N._cF=q('.corpoF'));")
assert "N._fE" in reg2
ajuda=" /* S383: só escreve no desenho o que mudou de valor (atributo: confere o que está lá; estilo: lembra o último que pôs) */\n function SA(n,a,v){if(n.getAttribute(a)!==v)n.setAttribute(a,v)}\n function ST(n,k,v){const c=n._st||(n._st={});if(c[k]!==v){c[k]=v;n.style[k]=v}}\n"
s=s[:i]+ajuda+reg2+s[j:];open(p,'w',encoding='utf8').write(s);print('setAttribute trocados:',n1,'| estilos:',n2)
