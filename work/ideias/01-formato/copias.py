"""Monta as duas cópias do site REAL para o esboço 01 (Descubra seu formato).
/tmp/ih = Hoje (site do ar, só com uma porta de teste para abrir o resultado)
/tmp/ip = Proposta (pintura por cima, NUNCA vai para o site; o "como fazer" está no COMO-FAZER.md)
Uso: python3 copias.py
"""
import os, shutil, re

SRC = '/home/claude/catalogo'
PORTA = "\n  window.__lfFa={res:function(cv,r,res){faResult(cv,r,res)},shape:faShape,med:faMeasure,M68:M68,MOVAL:MOVAL,MOFF:MOFF,open:faOpen};\n"

def copia(dst):
    if os.path.exists(dst): shutil.rmtree(dst)
    shutil.copytree(SRC, dst, ignore=shutil.ignore_patterns('.git'))
    p = dst + '/js/lf-site.js'; j = open(p).read()
    assert j.count('  function faTeste(res){') == 1
    j = j.replace('  function faTeste(res){', PORTA + '  function faTeste(res){', 1)
    open(p, 'w').write(j)
    return dst

copia('/tmp/ih')
d = copia('/tmp/ip')

# ---------- Proposta: resultado com a ilustração do formato (sem foto e sem traço roxo) ----------
p = d + '/js/lf-site.js'; j = open(p).read()
ini = j.index('  function faResult(cv,r,res){'); fim = j.index('  function faTeste(res){', ini)
fim = j.rindex('\n  window.__lfFa=', ini, fim)
NOVO = r"""  /* resultado: a ilustração do formato (a mesma da página "Seu formato de rosto"), nunca a foto do cliente */
  function faIl(f){var mk=function(u,g){return '<span class="rzi" data-g="'+g+'" style="-webkit-mask-image:url('+u+');mask-image:url('+u+')"></span>'};return '<div class="faill" data-fagenv="'+faGen+'">'+mk(f.m,'m')+mk(f.f,'f')+'</div>'}
  function faResult(cv,r,res){
    var m=document.querySelector('.modal.fa');if(!m)return;
    var f=FACES.filter(function(x){return x.id===res.id})[0];faGen=st.gen==='m'||st.gen==='f'?st.gen:(res.gen||'');faTeste(res);
    m.innerHTML='<div class="fares" data-faid="'+res.id+'"><div style="text-align:right;margin:-8px -6px 0 0"><button type="button" class="x" data-close aria-label="Fechar">×</button></div>'+
    faIl(f)+'<div class="fak">Seu rosto é</div><h3>'+esc(f.nome)+'</h3>'+
    '<p class="sub" data-fadica="'+esc(f.dica)+'">'+faSub(res.id)+'</p>'+(res.close?'<p class="sub" style="margin-top:-4px">Seu rosto também tem traços de <button type="button" class="fan" style="display:inline;padding:0;text-decoration:underline" data-fause="'+res.second+'">'+esc(FACES.filter(function(x){return x.id===res.second})[0].nome.toLowerCase())+'</button>.</p>':'')+
    (res.mm?'<p class="sub fatam">Tamanho de armação para você: <b>'+mpTam(res.mm.w)[0]+'</b> <span>'+mpTam(res.mm.w)[1]+'</span></p>':'')+
    '<div class="fak" style="margin-top:2px">Para quem são os óculos?</div><div class="fagen">'+[['f','Feminino'],['m','Masculino'],['','Todos']].map(function(g){return '<button type="button" class="chip" data-fagen="'+g[0]+'" aria-pressed="'+(faGen===g[0])+'">'+g[1]+'</button>'}).join('')+'</div>'+
    '<div class="fabtns"><button type="button" class="btn p" data-fause="'+res.id+'">Ver os modelos para o meu rosto</button><button type="button" class="btn o" data-fanew>Tentar outra foto</button></div>'+
    '<button type="button" class="fan" data-fawrong>Não parece com você? Escolher o formato sozinho</button></div>'}
"""
j = j[:ini] + NOVO + j[fim:]
# a escolha Feminino/Masculino/Todos troca a ilustração e a contagem do formato do RESULTADO (hoje pega o 1º [data-fause])
old = "var sb=document.querySelector('.fares .sub'),fu=document.querySelector('[data-fause]');if(sb&&fu)sb.innerHTML=faSub(fu.dataset.fause)}"
new = "var fr=document.querySelector('.fares'),sb=fr&&fr.querySelector('.sub'),il=fr&&fr.querySelector('.faill');if(sb)sb.innerHTML=faSub(fr.dataset.faid);if(il)il.dataset.fagenv=faGen}"
assert j.count(old) == 1; j = j.replace(old, new)
open(p, 'w').write(j)

h = d + '/index.html'; x = open(h).read()
o1 = '.faph{position:relative;width:184px;height:184px;margin:0 auto 14px;border-radius:50%;padding:5px;background:conic-gradient(from 210deg,#6f2250,#dc92bc,#b4528a,#6f2250);box-shadow:0 14px 34px -14px rgba(111,34,80,.55)}\n.faph canvas{width:100%;height:100%;border-radius:50%;display:block;background:#fff}\n'
assert x.count(o1) == 1
x = x.replace(o1, '.faill{display:flex;justify-content:center;gap:8px;width:224px;height:176px;margin:0 auto 16px;padding:16px 24px;border-radius:16px;background:color-mix(in srgb,var(--ac) 5%,var(--pn))}\n.faill[data-fagenv=f] [data-g=m],.faill[data-fagenv=m] [data-g=f]{display:none}\n')
open(h, 'w').write(x)
# ---------- Proposta parte 3: descrição dos formatos — UMA tabela (FACES) para tudo ----------
import json
FORMAS = {  # rec = como reconhecer (curto, lista) · txt = frase do resultado · fm = formatos de armação (nomes do app)
 'oval':     ('Mais comprido que largo, linhas suaves', 'O comprimento é maior que a largura, com linhas suaves da testa ao queixo. Quase todo formato fica bem: escolha pelo estilo.', ['Quadrado', 'Retangular', 'Hexagonal', 'Aviador', 'Gatinho', 'Redondo', 'Oval']),
 'redondo':  ('Largura e altura parecidas', 'Largura e comprimento parecidos, maçãs cheias e queixo arredondado. Armações retas e angulares dão estrutura e alongam o rosto.', ['Quadrado', 'Retangular', 'Hexagonal']),
 'quadrado': ('Mandíbula larga e marcada', 'Testa, maçãs e mandíbula com quase a mesma largura, e a mandíbula reta. Armações curvas suavizam os ângulos.', ['Redondo', 'Oval', 'Aviador']),
 'alongado': ('Bem mais comprido que largo', 'Bem mais comprido que largo, com as laterais quase retas. Armações altas e largas equilibram o comprimento.', ['Aviador', 'Quadrado', 'Hexagonal']),
 'coracao':  ('Testa larga, queixo fino', 'Testa e maçãs largas, afinando até um queixo fino. Armações mais leves em cima e arredondadas embaixo equilibram a testa.', ['Aviador', 'Redondo', 'Oval']),
 'diamante': ('Maçãs largas, testa e queixo finos', 'Maçãs do rosto largas, com a testa e o queixo mais estreitos. Armações com a parte de cima marcada equilibram as maçãs.', ['Gatinho', 'Oval']),
}
j = open(p).read()
a = j.index('  var FACES=['); b = j.index('];', a) + 2
F = json.loads(j[a + len('  var FACES='):b - 1])
for f in F:
    rec, txt, fm = FORMAS[f['id']]; f['rec'] = rec; f['dica'] = txt; f['fm'] = fm
j = j[:a] + '  var FACES=' + json.dumps(F, ensure_ascii=False) + ';' + j[b:]
j = j.replace("  function faceMini(id){", "  /* os rostos de uma peça saem do formato da armação, pela mesma tabela FACES */\n  function rostoDe(fm){return FACES.filter(function(f){return f.fm.indexOf(fm)>=0}).map(function(f){return f.id})}\n  function faceMini(id){", 1)
# a peça: o site calcula os rostos pelo formato da armação (planta do banco aprovada 19/11 23:03); sem formato = nenhum
o = "if(!p.rosto||!p.rosto.length)p.rosto=['oval'];"
assert j.count(o) == 1; j = j.replace(o, "p.rosto=rostoDe(p.fm);")
# lista "Escolha o seu formato": como reconhecer (o que combina aparece depois de escolher)
o = "<small>'+T('Combina:')+' '+T(RZ_C[f.id]||'')+'</small>"
assert j.count(o) == 1; j = j.replace(o, "<small>'+T(f.rec)+'</small>")
# lista: um toque abre o catálogo do formato (hoje, no celular, o 1º toque só gira o carrossel escondido #fcar)
o = "if(fi!==fk&&!matchMedia('(min-width:700px)').matches)faceGo(fi);else{st.rosto=st.rosto===d.face?'':d.face;drawFaces();drawGrid();goTo('vitrine')}"
assert j.count(o) == 1; j = j.replace(o, "st.rosto=st.rosto===d.face?'':d.face;drawFaces();drawGrid();goTo('vitrine')")
# guia (art. 'rosto'): nunca roda — guiaAbre('rosto') manda para a página do formato. Sai no implementar (código morto), não é pintado.
open(p, 'w').write(j)
print('ok /tmp/ih /tmp/ip')
