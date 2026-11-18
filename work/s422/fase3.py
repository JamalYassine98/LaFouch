# S422 · LIMPEZA DO SITE, FASE 3: Minha conta numa função só (antes: declaração antiga + 4 camadas uma por cima da outra).
# O comportamento é o mesmo: mesma ordem dos passos das camadas (S370 → entrada B1 → desenho → trilho S420), só sem embrulhos.
import re
C = '/home/claude/catalogo/js/lf-site.js'; s = open(C, encoding='utf8').read()
def troca(a, b):
    global s; assert s.count(a) == 1, ('achei %d×: ' % s.count(a)) + a[:90]; s = s.replace(a, b)
def bloco_funcao(i):
    k = s.index('{', i); d = 0; q = None; j = k
    while True:
        c = s[j]
        if q:
            if c == '\\': j += 1
            elif c == q: q = None
        elif c in '"\'`': q = c
        elif c == '/' and s[j + 1] == '*': j = s.index('*/', j) + 1
        elif c == '{': d += 1
        elif c == '}':
            d -= 1
            if d == 0: return j + 1
        j += 1
# 1) a declaração antiga (11/11), trocada desde o S288 — só sobra o nome
i = s.index('  function minhaConta(){\n    var c=getConta();if(!sessG()){entrarTela(false);return}if(!c){contaForm(false);return}')
j = bloco_funcao(i)
s = s[:i] + "  var minhaConta;/* S422: a tela da conta é desenhada por mcTela() e aberta pela minhaConta() única (bloco S420/S422 do trilho) */" + s[j:]
# 2) o desenho vira mcTela (mesmo corpo)
troca("  minhaConta=function(aba,edita){\n    var c=contaNorm(getConta());if(!sessG()){entrarTela(false);return}", "  var mcTela=function(aba,edita){\n    var c=contaNorm(getConta());if(!sessG()){entrarTela(false);return}")
# 3) camada B1 (entrada suave) vira função de passo
a = s[s.index("  var _mc0=minhaConta,_mcAba='';\n"):s.index("  function mcSalvar(){")]
assert a.count('minhaConta=function') == 1
troca(a, """  var _mcAba='';
  /* B1 (11/11): entrada suave da Minha conta; na troca de aba quem anima é o trilho (S420) */
  function mcEntra(aberto){if(window.__lfTk2){_mcAba=st.mcAba;return}if(!MOV())return;
    var pn=document.querySelector('#layer [aria-label="Minha conta"]');if(!pn)return;var A=st.mcAba;
    var alvo=aberto?(A!==_mcAba?[].slice.call(pn.children).filter(function(e){return !/^(H2|DIV)$/.test(e.tagName)||!e.querySelector('h2')}).slice(1):[]):[].slice.call(pn.children);
    alvo.forEach(function(e,k){e.animate([{transform:'translateY(12px)',opacity:0},{transform:'none',opacity:1}],{duration:380,delay:k*55,easing:EZ,fill:'backwards'})});_mcAba=A}
""")
# 4) camada S370 (tocar no ícone com a conta aberta só sobe ao topo): o passo vai para a função única
troca("""  var _mc370=minhaConta;minhaConta=function(){if(!arguments.length&&st._ab==='conta'&&$('layer').firstChild&&$('layer').querySelector('[aria-label="Minha conta"],.mct')){ab370Topo();return}var r=_mc370.apply(this,arguments);if($('layer').firstChild&&$('layer').querySelector('[aria-label="Minha conta"],.mct'))st._ab='conta';return r};\n""", "")
# 5) a camada S420 vira a função única
troca("""  var _mcTk=minhaConta;minhaConta=function(aba,edita){
    var m0=""", """  /* S422: a Minha conta numa função só — S370 (já aberta: só sobe ao topo) → desenho (mcTela) → entrada B1 (mcEntra) → trilho único (S420) */
  minhaConta=function(aba,edita){
    if(!arguments.length&&st._ab==='conta'&&$('layer').firstChild&&$('layer').querySelector('[aria-label="Minha conta"],.mct')){ab370Topo();return}
    var m0=""")
troca("""    window.__lfTk2=troca?1:0;var r;try{r=_mcTk.apply(this,arguments)}finally{window.__lfTk2=0}""",
      """    window.__lfTk2=troca?1:0;var r;try{var aberto=!!document.querySelector('#layer [aria-label="Minha conta"]');mcTela(aba,edita);mcEntra(aberto);if($('layer').firstChild&&$('layer').querySelector('[aria-label="Minha conta"],.mct'))st._ab='conta'}finally{window.__lfTk2=0}""")
assert len(re.findall(r'minhaConta\s*=\s*function', s)) == 1
open(C, 'w', encoding='utf8').write(s); print('ok: minhaConta numa função só')
