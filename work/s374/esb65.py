# S374 · esboço 65 (dono 16/11 12:23: padronizar os botões do app no design de luxo, aba por aba; 1ª: Preços).
# Base = a tela do esboço 64 (aprovado). Regras do "Padrão de controles do APP" (docs/DESIGN-SITE-E-APP.md, 15/11):
#  AÇÃO principal = .go contorno fino rosa, UMA por tela ("Aceitar os 5 preços") · secundária = contorno neutro ("Corrigir os 10 de uma vez",
#  "Usar G$ …", "Informar") · terciária = texto rosa com "›", sem sublinhado (por quê ›, ajustar tabela ›, ver um por um ›, Calculadora ›, E se…? ›)
#  · OPÇÃO = cartões (Igual por peça · Proporcional ao custo) · campo com o "%" dentro.
import sys;sys.argv=[sys.argv[0]]
exec(open('/home/claude/lafouch/work/s374/esb64.py').read().split('with sync_playwright')[0])
ABRE="()=>{document.querySelectorAll('.fx64').forEach(s=>{s.classList.add('on');s.querySelector('.fxB').style.height='auto';const I=s.querySelector('.fxI');I.style.opacity=1;I.style.transform='none'})}"
CSS65="""
#v-dash .cntV,#v-dash .lxT{text-decoration:none!important;color:var(--accent-fg)!important;font-weight:600}
#v-dash .cntV::after,#v-dash .lxT::after{content:' ›'}
#v-dash .cntB:has(.lxT.m){justify-content:flex-start!important;gap:22px!important;padding:0 2px}
#v-dash [data-act=pcUsaTodos],#v-dash .pcUsa{border-color:var(--line)!important;color:var(--fg)!important;background:none!important}
#v-dash .pcUsa{font-weight:600}
#v-dash .op65{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px}
#v-dash .op65 button{display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;background:var(--panel2);border:1px solid var(--line);border-radius:14px;padding:12px 14px;color:var(--fg);font:inherit;min-height:64px}
#v-dash .op65 button b{font-weight:600;font-size:14.5px}#v-dash .op65 button small{color:var(--mute);font-size:12.5px}
#v-dash .op65 button.on{border-color:var(--accent);background:var(--accent-soft)}
#v-dash .pc65{position:relative;display:inline-block}#v-dash .pc65 input{padding-right:34px!important}#v-dash .pc65 i{position:absolute;right:14px;top:50%;transform:translateY(-50%);font-style:normal;color:var(--mute);pointer-events:none}
"""
JS65="""()=>{const r=[...document.querySelectorAll('#v-dash [data-act=ratsel]')];if(r.length){const box=document.createElement('div');box.className='op65';const sub={0:'o mesmo valor em cada peça',1:'peça mais cara carrega mais'};
  r.forEach((b,i)=>{const n=document.createElement('button');n.type='button';n.className=b.classList.contains('on')?'on':'';n.innerHTML='<b>'+b.textContent.trim()+'</b><small>'+sub[i]+'</small>';box.appendChild(n)});
  const pai=r[0].parentElement;pai.replaceWith(box)}
 let n=0;document.querySelectorAll('#v-dash input.in').forEach(i=>{const s=i.nextElementSibling;if(s&&s.textContent.trim()==='%'){const w=document.createElement('span');w.className='pc65';w.style.width=getComputedStyle(i).width;i.parentNode.insertBefore(w,i);w.appendChild(i);const p=document.createElement('i');p.textContent='%';w.appendChild(p);s.remove();i.style.width='100%';n++}});
 return [r.length,n]}"""
def prancha65(*a):
    import types
    g=globals();src=open('/home/claude/lafouch/work/s374/esb64.py').read();i=src.index('def prancha64');j=src.index('with sync_playwright')
    code=src[i:j].replace('def prancha64','def _p65').replace("(blocos fechados; abrem como na Apple)","(blocos abertos para comparar)")
    exec(code,g);return g['_p65'](*a)
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];hs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(1200);tela(pg,w,1);pg.evaluate(ABRE);w(300)
            if prop: pg.add_style_tag(content=CSS65);print('   js',pg.evaluate(JS65));w(400)
            o=olho(pg)
            for y in (900,1800,2700): pg.evaluate("y=>scrollTo(0,y)",y);w(250);o|=olho(pg)
            oo.append(o);pg.evaluate("()=>scrollTo(0,0)");w(200)
            hs.append(pg.evaluate("()=>document.documentElement.scrollHeight"));pg.add_style_tag(content='#mainnav,#sidenav{visibility:hidden!important}');w(100)
            p=T+'b65_%d_%d.png'%(esc,prop);pg.screenshot(path=p,full_page=True);fs.append(p);b.close()
        print('65',tema,'achados novos:',novos(oo[0],oo[1]))
        prancha65('65-app-precos-botoes-padrao-%s.jpg'%tema,'App · Preços › botões no padrão de luxo (aba 1) · tema '+tema,
          ['Hoje (já com o 64, blocos abertos para ver tudo): links sublinhados em rosa e em cinza, "Revisar agora" sem nada, "Usar G$ …" e "Informar" iguais ao botão principal, "Igual por peça | Proporcional" em bolinhas, o "%" fora do campo.',
           'Proposta: 1 ação principal na tela (contorno rosa: "Aceitar os 5 preços"); ações secundárias em contorno neutro ("Corrigir os 10 de uma vez", "Usar G$ …", "Informar"); ações de linha em texto rosa com "›", sem sublinhado (por quê ›, ajustar tabela ›, ver um por um ›, Calculadora ›, E se…? ›); escolher = 2 cartões com título e frase; "%" dentro do campo.'],fs[0],fs[1],hs[0],hs[1])
