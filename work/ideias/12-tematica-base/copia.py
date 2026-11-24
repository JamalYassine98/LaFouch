"""IDEIAS 12 · temática em 3 camadas sobre a identidade fixa (dono 23/11 13:20-13:43).
Base: /tmp/a8k (pacote aprovado: menu 08g, busca, conta, camadas 08k, temática campanha 06/06e) + botões 09 (pinta12) na cor
oficial #943d6f acetinada + formato Lente (11) + conserto 08k2 (pinta13 e sem a regra v452). Saída: /tmp/a12 (:8765).
Regra da temática (o que esta cópia mostra):
 1) NUNCA MUDA: a cor da marca no logo, botões, links e rosé; letra; formato Lente; menu, topo e camadas.
 2) MUDA NA DATA: fundo creme, a faixa (cor e frase da data), o título pequeno do destaque, o fio das camadas, o "Ofertas"
    do menu e o chapéu do Mochi → todos pela MESMA variável de acento (--ac = cor da data; sem data = cor da marca).
 3) SÓ NA DATA: o Destaque Campanha (fotos da data), a seleção e o "para presente".
Diferença para o aprovado das 10:23/10:52: os botões NÃO viram a cor da data (ficam na marca)."""
import shutil
SRC, D = '/tmp/a8k', '/tmp/a12'
shutil.rmtree(D, ignore_errors=True); shutil.copytree(SRC, D)
A = "CFG=Object.assign({ativo:true},fbd(d),{_f:1})"
p = D + '/js/lf-site.js'; s = open(p).read(); s = s.replace(A, "CFG=Object.assign({ativo:true},fbd(d),{_f:1,ativo:true})")
for v, n in (("closest('#mnb,#sbtn,#bagbtn')", "closest('#mnb,#sbtn,#bagbtn,#contabtn')"), ("if(b.id==='bagbtn')history.back()", "if(b.id==='bagbtn'||b.id==='contabtn')history.back()")):
    assert s.count(v) == 1; s = s.replace(v, n)
p12 = open('/tmp/rp/lafouch/work/ideias/09-botoes/pinta12.js').read()
p12 = p12.replace(":root[data-ev]{--lfc:var(--ac)}", "")
p12 = p12.replace("var PRIN=['.bb.p',", "var PRIN=['.lfcamp .bt','.bb.p',")  # o botão do Destaque Campanha é da MESMA família (estava na cor da data)  # 1) os botões ficam na cor da marca também na data
p12 = p12.replace("border-radius:999px!important", "border-radius:var(--lfcanto,14px)!important")  # formato Lente (11)
p12 = p12.replace("+'font-size:11px!important;letter-spacing:.16em!important;height:32px!important;", "+'--lfcanto:10px;font-size:11px!important;letter-spacing:.16em!important;height:32px!important;")
s += "\nwindow.__lfcor='#943d6f';\n" + p12 + '\n' + open('/tmp/rp/lafouch/work/ideias/08-menu-luxo/pinta13.js').read()
s += """
/* PINTURA · IDEIAS 12: a cor da marca oficial é a base de tudo (sai o vinho antigo #8d3a69 do --ac); na data, o --ac vira o acento */
(function(){var e=document.createElement('style');e.textContent=':root{--ac:var(--act,#943d6f)}html .buyrow .mq,html .buyrow .mq button{border-radius:14px!important}html body:not(#_a):not(#_b) .lfcamp .bt{display:flex!important;width:100%!important}';document.head.appendChild(e)})();
"""
open(p, 'w').write(s)
h = D + '/index.html'; t = open(h).read(); R = 'html.v5:has(#layer .scrim.pg) .top{position:fixed!important;top:0;left:0;right:0;}'
assert t.count(R) == 1; t = t.replace(R, '')
t = t.replace('--ac:var(--act,#8d3a69)', '--ac:var(--act,#943d6f)')
open(h, 'w').write(t); print('ok')
