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
FORMAS = {  # pq = por que esses modelos combinam · fm = formatos de armação (nomes do app); a frase dos modelos sai do fm
 'oval':     ('escolha pelo estilo.', ['Quadrado', 'Retangular', 'Hexagonal', 'Aviador', 'Gatinho', 'Redondo', 'Oval']),
 'redondo':  ('as linhas retas dão estrutura e alongam o rosto.', ['Quadrado', 'Retangular', 'Hexagonal']),
 'quadrado': ('as curvas suavizam a mandíbula marcada.', ['Redondo', 'Oval', 'Aviador']),
 'alongado': ('lentes altas e largas equilibram o comprimento.', ['Aviador', 'Quadrado', 'Hexagonal']),
 'coracao':  ('mais leves em cima e arredondadas embaixo, equilibram a testa.', ['Aviador', 'Redondo', 'Oval']),
 'diamante': ('a parte de cima marcada equilibra as maçãs do rosto.', ['Gatinho', 'Oval']),
}
j = open(p).read()
a = j.index('  var FACES=['); b = j.index('];', a) + 2
F = json.loads(j[a + len('  var FACES='):b - 1])
for f in F:
    pq, fm = FORMAS[f['id']]; f['pq'] = pq; f['fm'] = fm; del f['dica']
j = j[:a] + '  var FACES=' + json.dumps(F, ensure_ascii=False) + ';' + j[b:]
FN = r"""  /* a descrição de cada formato fala dos MODELOS que combinam, e sai da mesma lista (fm) que decide as peças de cada rosto */
  var FMP={Redondo:'redondas',Quadrado:'quadradas',Retangular:'retangulares',Gatinho:'gatinho',Aviador:'aviador',Oval:'ovais',Hexagonal:'hexagonais'};
  function faMod(f){if(f.fm.length>=6)return LFI.tr('Quase todos os modelos');var n=f.fm.map(function(x){return LFI.tr(FMP[x])});var t=n.length>1?n.slice(0,-1).join(', ')+' '+LFI.tr('e')+' '+n[n.length-1]:n[0];return t.charAt(0).toUpperCase()+t.slice(1)}
  function faDica(f){var m=faMod(f);return (f.fm.length>=6?m:LFI.tr('Armações')+' '+m.charAt(0).toLowerCase()+m.slice(1))+': '+LFI.tr(f.pq)}
  function rostoDe(fm){return FACES.filter(function(f){return f.fm.indexOf(fm)>=0}).map(function(f){return f.id})}
  function faceMini(id){"""
j = j.replace("  function faceMini(id){", FN, 1)
# todo lugar que mostrava f.dica passa a usar faDica(f)
for o, n in (("esc(f.dica)+(n?' Separamos '", "esc(faDica(f))+(n?' Separamos '"),
             ("data-fadica=\"'+esc(f.dica)+'\"", "data-fadica=\"'+esc(faDica(f))+'\""),
             ("<span>'+f.dica+'</span>", "<span>'+faMod(f)+'</span>"),
             ("<p>'+esc(f.dica)+(st.rsem", "<p>'+esc(faDica(f))+(st.rsem"),
             (";f.dica=LFI.tn(f.dica)})", "})")):
    assert j.count(o) == 1, o; j = j.replace(o, n)
assert 'f.dica' not in j.replace('faDica(f)', ''), 'sobrou f.dica'
# a peça: o site calcula os rostos pelo formato da armação (planta do banco aprovada 19/11 23:03); sem formato = nenhum
o = "if(!p.rosto||!p.rosto.length)p.rosto=['oval'];"
assert j.count(o) == 1; j = j.replace(o, "p.rosto=rostoDe(p.fm);")
# lista "Escolha o seu formato": os modelos que combinam (da tabela)
o = "<small>'+T('Combina:')+' '+T(RZ_C[f.id]||'')+'</small>"
assert j.count(o) == 1; j = j.replace(o, "<small>'+faMod(f)+'</small>")
# lista: um toque abre o catálogo do formato (hoje, no celular, o 1º toque só gira o carrossel escondido #fcar)
o = "if(fi!==fk&&!matchMedia('(min-width:700px)').matches)faceGo(fi);else{st.rosto=st.rosto===d.face?'':d.face;drawFaces();drawGrid();goTo('vitrine')}"
assert j.count(o) == 1; j = j.replace(o, "st.rosto=st.rosto===d.face?'':d.face;drawFaces();drawGrid();goTo('vitrine')")
# SÓ PARA O VÍDEO (pintura): a câmera da cópia para de decidir sozinha quando o vídeo assume (window.__lfPinta)
o = "    function tick(){\n      var v=$('favid');if(!v||!CAM.st){camStop();return}"
assert j.count(o) == 1, 'tick'
j = j.replace(o, "    function tick(){if(window.__lfPinta)return;\n      var v=$('favid');if(!v||!CAM.st){camStop();return}")
j = j.replace("open:faOpen};", "open:faOpen,stop:camStop};")
# guia (art. 'rosto'): nunca roda — guiaAbre('rosto') manda para a página do formato. Sai no implementar (código morto), não é pintado.
open(p, 'w').write(j)
print('ok /tmp/ih /tmp/ip')
