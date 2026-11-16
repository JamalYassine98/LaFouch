# S387 (dono 16/11 15:25 "Implementar"): a cópia da imagem para a claridade volta a ser 1 a cada 4 medições TAMBÉM com o leitor no trabalhador ao lado (falha do S384: a condição só olhava Z.mp)
f='/home/claude/catalogo/js/lf-site.js';s=open(f,encoding='utf8').read()
a="fazLuz=!Z.mp||Z.lzN%4===1;";assert s.count(a)==1;s=s.replace(a,"fazLuz=!(Z.mp||wkOk)||Z.lzN%4===1;")
open(f,'w',encoding='utf8').write(s);print('ok')
