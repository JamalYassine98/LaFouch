"""IDEIAS 12e · o DESENHO DE HOJE (cartão de destaque: fundo profundo, peça no branco, texto claro centralizado, 2 botões)
na COR OFICIAL em tom profundo (dono 23/11 15:41: "testar com uma primeiro" → Natal). Base /tmp/a12d (faixa com a frase nova,
botões aprovados, fundo branco); a campanha .lfcamp do 12b/12d sai e volta o destaque de hoje (#hdst).
A data fica no conteúdo: frase da faixa, o enfeite discreto do cartão (os pontinhos de neve de hoje, em branco suave) e o chapéu do Mochi."""
import shutil
S, D = '/tmp/a12d', '/tmp/a12e'
shutil.rmtree(D, ignore_errors=True); shutil.copytree(S, D)
p = D + '/js/lf-site.js'; s = open(p).read()
h = "'html[data-ev] #home:has(.lfcamp) #hdst{display:none!important}'+"; assert s.count(h) == 1; s = s.replace(h, '')  # o destaque de hoje volta
s += """
/* PINTURA · IDEIAS 12e: o cartão de hoje, na cor oficial profunda (uma só regra para todas as datas: --lfprof) */
(function(){var e=document.createElement('style');e.textContent=
 ':root{--lfprof1:color-mix(in srgb,#943d6f 78%,#000);--lfprof2:color-mix(in srgb,#943d6f 48%,#000);--lfluz:#f0e4eb}'+
 'html[data-ev] .lfcamp{display:none!important}'+
 'html[data-ev] body,html[data-ev] .top{background:#fff!important}'+
 /* o cartão: fundo profundo na cor da loja; o enfeite da data por cima, em branco suave */
 'html[data-ev] #home .hd{background:var(--lfenf,linear-gradient(transparent,transparent)),linear-gradient(135deg,var(--lfprof1),var(--lfprof2))!important;color:#fff!important}'+
 /* (dono 16:36) pontinhos só onde são da data: neve no Natal, brilho no Ano Novo; nas outras o cartão é liso (enfeites: depois) */
 'html[data-ev=natal],html[data-ev^=anonovo]{--lfenf:radial-gradient(circle at 20% 20%,#ffffff1c 0 2px,transparent 3px) 0 0/38px 38px}'+
 /* mesma cor, profundidade diferente: BF e Halloween mais fundos (urgência, mistério), Mães mais suave */
 'html[data-ev=bf],html[data-ev=halloween]{--lfprof1:color-mix(in srgb,#943d6f 62%,#000);--lfprof2:color-mix(in srgb,#943d6f 34%,#000)}'+
 'html[data-ev=maes]{--lfprof1:color-mix(in srgb,#943d6f 92%,#000);--lfprof2:color-mix(in srgb,#943d6f 64%,#000)}'+
 'html[data-ev] #home .hd .hlb,html[data-ev] #home .hd h1 em{color:var(--lfluz)!important}'+
 'html[data-ev] #home .hd .hsub{color:#ffffffcc!important}html[data-ev] #home .hd .hpr s{color:#ffffff99!important}'+
 /* a peça no branco, como hoje (estojo dentro do cartão) */
 'html[data-ev] #home #hdst.hd .hdi{margin:14px!important;border-radius:18px!important}'+
 /* botões da família aprovada, na versão sobre fundo escuro: principal cheio rosé com letra na cor da loja; o outro é link claro */
 'html[data-ev] #home #hdst.hd .hbt .p1:not(#_a):not(#_b){background:radial-gradient(130% 220% at 50% 35%,#fff,var(--lfluz) 60%,#e6d3de)!important;color:#7f345f!important;border:0!important}'+
 'html[data-ev] #home #hdst.hd .hbt .p2:not(#_a):not(#_b),html[data-ev] #home #hdst.hd .hbt .p2 i{color:var(--lfluz)!important;border-color:transparent!important;background:transparent!important}'+
 'html[data-ev] #home .hd .hdots button{background:#ffffff40!important}html[data-ev] #home .hd .hdots button.on{background:var(--lfluz)!important}'+
 /* títulos e rodapé voltam ao da loja (sem o verde de hoje) */
 'html[data-ev] #home h2.h2,html[data-ev] .htr b{color:var(--tx)!important}';
 document.head.appendChild(e)})();
"""
# a frase do cartão: sem "retirada no mesmo dia" (dá a ideia errada de entrega no dia, dono 23/11)
o = "sub:'Ideias de presente · retirada no mesmo dia em Ciudad del Este'"; assert s.count(o) == 1; s = s.replace(o, "sub:'Peças escolhidas para presentear'")
for o, n in (("sub:'Para a sua mãe · retirada no mesmo dia em Ciudad del Este'", "sub:'Peças escolhidas para ela'"), ("sub:'Para o seu pai · retirada no mesmo dia em Ciudad del Este'", "sub:'Peças escolhidas para ele'")):
    assert s.count(o) == 1; s = s.replace(o, n)
open(p, 'w').write(s); print('ok')
