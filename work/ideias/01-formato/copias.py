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
x = x.replace(o1, '.rzfaz{border:1.5px dashed color-mix(in srgb,var(--tx) 35%,transparent);border-radius:8px;background:none!important;-webkit-mask:none!important;mask:none!important;position:relative}.rzfaz:after{content:"a fazer";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;font:500 9px/1.2 Inter,system-ui,sans-serif;color:var(--mu);padding:2px}\n.fatk{margin:4px 0 8px}.fatop{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:0 0 16px;text-align:left}.fatop .hc{border-radius:12px}.fatop .ulin{display:none}\n.faill{display:flex;justify-content:center;gap:8px;width:192px;height:144px;margin:0 auto 16px;padding:16px 24px;border-radius:16px;background:color-mix(in srgb,var(--ac) 5%,var(--pn))}\n.faill[data-fagenv=f] [data-g=m],.faill[data-fagenv=m] [data-g=f]{display:none}\n')
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
 'retangular': ('curvas e lentes altas suavizam os ângulos e encurtam o rosto.', ['Redondo', 'Aviador', 'Oval']),
 'triangular': ('a parte de cima marcada alarga a testa e equilibra a mandíbula.', ['Gatinho', 'Aviador']),
}
NOVOS = [{'id': 'retangular', 'nome': 'Retangular'}, {'id': 'triangular', 'nome': 'Triangular'}]  # PARTE B: sem ilustração ainda (m/f vazios)
j = open(p).read()
a = j.index('  var FACES=['); b = j.index('];', a) + 2
F = json.loads(j[a + len('  var FACES='):b - 1])
F = F[:4] + [dict(NOVOS[0], m='', f='')] + F[4:] + [dict(NOVOS[1], m='', f='')]  # ordem: ... Alongado, Retangular, Coração, Diamante, Triangular
for f in F:
    pq, fm = FORMAS[f['id']]; f['pq'] = pq; f['fm'] = fm; f.pop('dica', None)
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
# PARTE B (pintura): formato sem ilustração mostra o lugar dela tracejado
o = "    var mk=function(u){return '<span class=\"rzi\" style=\"-webkit-mask-image:url('+u+');mask-image:url('+u+')\"></span>'};"
assert j.count(o) == 1, 'mk'
j = j.replace(o, "    var mk=function(u){return u?'<span class=\"rzi\" style=\"-webkit-mask-image:url('+u+');mask-image:url('+u+')\"></span>':'<span class=\"rzi rzfaz\"></span>'};")
o = "  function fig(f,sd){var d=f[sd==='m'?'gm':'gf'],src=f[sd],asp=f[sd==='m'?'wm':'wf'];"
assert j.count(o) == 1, 'fig'
j = j.replace(o, "  function fig(f,sd){if(!f[sd])return '<span class=\"fw rzfaz\" style=\"aspect-ratio:.7\"></span>';var d=f[sd==='m'?'gm':'gf'],src=f[sd],asp=f[sd==='m'?'wm':'wf'];")
j = j.replace("  function faIl(f){var mk=function(u,g){return '<span class=\"rzi\" data-g=\"'+g+'\" style=\"-webkit-mask-image:url('+u+');mask-image:url('+u+')\"></span>'};", "  function faIl(f){var mk=function(u,g){return u?'<span class=\"rzi\" data-g=\"'+g+'\" style=\"-webkit-mask-image:url('+u+');mask-image:url('+u+')\"></span>':'<span class=\"rzi rzfaz\" data-g=\"'+g+'\"></span>'};")
# PARTE B: as 3 melhores peças já no resultado — combina com o rosto + gênero escolhido + com estoque; ordem: tamanho certo, mais vendida, mais nova
MEL = r"""  /* as melhores para este rosto: só as que combinam, do gênero escolhido e com estoque; primeiro as de tamanho certo (frente da armação perto da largura do rosto), depois as mais vendidas */
  function faFrente(p){var m=p.med||[];return m.length>=2?2*(+m[0])+(+m[1])+10:0}
  function faMelhores(id,g,w){return P.filter(function(p){return (p.rosto||[]).indexOf(id)>=0&&genOk(p,g)&&p.aviso!=='Esgotado'}).map(function(p){var fr=faFrente(p);return {p:p,k:(w&&fr?Math.abs(fr-w):99)<=6?0:1}}).sort(function(a,b){return a.k-b.k||(b.p.mv||0)-(a.p.mv||0)||(b.p.cad||0)-(a.p.cad||0)}).map(function(x){return x.p})}
  function faTop(id){var fr=document.querySelector('.fares'),w=fr&&+fr.dataset.faw||0,L=faMelhores(id,faGen,w);
    var f=FACES.filter(function(x){return x.id===id})[0],gn={f:'femininos',m:'masculinos'}[faGen]||'';
    return L.length?'<div class="fak fatk">'+LFI.tr('As melhores para você')+'</div><div class="fatop">'+L.slice(0,3).map(function(p){return card5(p,0)}).join('')+'</div>':'<p class="sub fatz">'+LFI.tr('Ainda não temos modelos')+(gn?' '+LFI.tr(gn):'')+' '+LFI.tr('para rosto')+' '+esc(f.nome.toLowerCase())+'.</p>'}
"""
j = j.replace("  function faResult(cv,r,res){", MEL + "  function faResult(cv,r,res){", 1)
o = "faIl(f)+'<div class=\"fak\">Seu rosto é</div>"
assert j.count(o) == 1, 'faIl'
j = j.replace("'<div class=\"fares\" data-faid=\"'+res.id+'\">", "'<div class=\"fares\" data-faid=\"'+res.id+'\" data-faw=\"'+(res.mm?res.mm.w:'')+'\">")
o = "'<div class=\"fabtns\"><button type=\"button\" class=\"btn p\" data-fause=\"'+res.id+'\">Ver os modelos para o meu rosto</button>"
assert j.count(o) == 1, 'btns'
j = j.replace(o, "'<div class=\"fatopw\"></div><div class=\"fabtns\"><button type=\"button\" class=\"btn p\" data-fause=\"'+res.id+'\">Ver todos os modelos para o meu rosto ›</button>")
o = "'<button type=\"button\" class=\"fan\" data-fawrong>Não parece com você? Escolher o formato sozinho</button></div>'}"
assert j.count(o) == 1, 'fim'
j = j.replace(o, "'<button type=\"button\" class=\"fan\" data-fawrong>Não parece com você? Escolher o formato sozinho</button></div>';var tw=m.querySelector('.fatopw');if(tw)tw.innerHTML=faTop(res.id)}")
o = "if(il)il.dataset.fagenv=faGen}"
assert j.count(o) == 1, 'gen'
j = j.replace(o, "if(il)il.dataset.fagenv=faGen;var tw=fr&&fr.querySelector('.fatopw');if(tw)tw.innerHTML=faTop(fr.dataset.faid)}")
# PARTE B: resultado mais curto — a contagem vai para o botão ("Ver todos os N modelos ›"), o tamanho numa linha
o = "return esc(faDica(f))+(n?' Separamos '+n+' modelos para você.':'')}"
assert j.count(o) == 1, 'faSub'
j = j.replace(o, "return esc(faDica(f))}\n  function faN(id){return faMelhores(id,faGen,0).length}")
o = "(res.mm?'<p class=\"sub fatam\">Tamanho de armação para você: <b>'+mpTam(res.mm.w)[0]+'</b> <span>'+mpTam(res.mm.w)[1]+'</span></p>':'')"
assert j.count(o) == 1, 'tam'
j = j.replace(o, "(res.mm?'<p class=\"sub fatam\">Tamanho da armação: <b>'+mpTam(res.mm.w)[0]+'</b> <span>· '+mpTam(res.mm.w)[2]+'</span></p>':'')")
o = "function mpTam(w){return w<132?['Pequeno','(frente com até ~132 mm)']:w<=144?['Médio','(frente com ~132 a 144 mm)']:['Grande','(frente com mais de ~144 mm)']}"
assert j.count(o) == 1, 'mpTam'
j = j.replace(o, "function mpTam(w){return w<132?['Pequeno','(frente com até ~132 mm)','até 132 mm']:w<=144?['Médio','(frente com ~132 a 144 mm)','132 a 144 mm']:['Grande','(frente com mais de ~144 mm)','mais de 144 mm']}")
j = j.replace(">Ver todos os modelos para o meu rosto ›</button>", " data-fabtn>'+faBtn(res.id)+'</button>")
j = j.replace("  function faN(id){return faMelhores(id,faGen,0).length}", "  function faN(id){return faMelhores(id,faGen,0).length}\n  function faBtn(id){var n=faN(id);return n?LFI.tr('Ver todos os')+' '+n+' '+LFI.tr(n===1?'modelo':'modelos')+' ›':LFI.tr('Ver o catálogo')+' ›'}")
j = j.replace("if(il)il.dataset.fagenv=faGen;var tw=", "if(il)il.dataset.fagenv=faGen;var bt=fr&&fr.querySelector('[data-fabtn]');if(bt)bt.textContent=faBtn(fr.dataset.faid);var tw=")
# SÓ PARA O VÍDEO (pintura): a câmera da cópia para de decidir sozinha quando o vídeo assume (window.__lfPinta)
o = "    function tick(){\n      var v=$('favid');if(!v||!CAM.st){camStop();return}"
assert j.count(o) == 1, 'tick'
j = j.replace(o, "    function tick(){if(window.__lfPinta)return;\n      var v=$('favid');if(!v||!CAM.st){camStop();return}")
j = j.replace("open:faOpen};", "open:faOpen,stop:camStop};")
# guia (art. 'rosto'): nunca roda — guiaAbre('rosto') manda para a página do formato. Sai no implementar (código morto), não é pintado.
open(p, 'w').write(j)
print('ok /tmp/ih /tmp/ip')
