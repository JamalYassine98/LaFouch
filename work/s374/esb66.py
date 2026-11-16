# S374 · esboço 66 (dono 16/11 12:42–12:43): em cima do 64 + 65.
# (1) "preços para corrigir" num lugar só: 1 linha no Contador ("15 preços para corrigir · 10 com sugestão · 5 sem custo · ver ›")
#     que abre a lista ali mesmo (abrir como na Apple); o número 15 do Contador abre a mesma lista; saem "Subir 5 preços",
#     "Aceitar os 5 preços" e o bloco separado. Principal da tela = "Corrigir os 10 de uma vez".
# (2) sai "Como dividir as contas entre as peças": sempre proporcional ao custo, com 1 frase.
import sys;_A=list(sys.argv);sys.argv=[sys.argv[0]]
src=open('/home/claude/lafouch/work/s374/esb65.py').read();src=src.split("if '--partes' not in _ARGS:")[0];exec(src)
comum.OUT=OUT
JS66="""()=>{const D=document.querySelector('#v-dash .cntD');const fA=document.querySelector('.fx64[data-fx=abp]');const I=fA.querySelector('.fxI');
 const nT=document.querySelectorAll('#v-dash [data-act=pcUsa]').length,nC=document.querySelectorAll('#v-dash [data-act=pcInforma]').length,n=nT+nC;
 D.querySelectorAll('.c52G').forEach(e=>e.remove());const aceita=D.querySelector('[data-act=cntTudo]');if(aceita)(aceita.closest('.cntB')||aceita).remove();
 const tpl=[...D.querySelectorAll('.cntL')].find(l=>l.querySelector('.cntV'));const l=tpl.cloneNode(true);l.querySelector('b').textContent=n+' preços para corrigir';l.querySelector('small').textContent=nT+' com sugestão do contador · '+nC+' sem custo';const v0=l.querySelector('.cntV');const v=document.createElement('i');v.className='ch66';v.setAttribute('aria-hidden','true');v.textContent='⌄';v.setAttribute('data-x66','1');v0.replaceWith(v);l.setAttribute('role','button');l.style.cursor='pointer';
 const lbl=D.firstElementChild;D.insertBefore(l,lbl.nextSibling);
 const x=document.createElement('div');x.className='x66';x.innerHTML='<div class="x66i"></div>';[...I.children].forEach(c=>x.firstChild.appendChild(c));D.insertBefore(x,l.nextSibling);fA.remove();
 const go=x.querySelector('[data-act=pcUsaTodos]');if(go)go.style.cssText='';
 const EZ='cubic-bezier(.45,0,.2,1)';const tog=()=>{const ab=!x.classList.contains('on'),h=x.firstChild.scrollHeight;x.classList.toggle('on',ab);l.classList.toggle('on66',ab);
  x.animate([{height:(ab?0:h)+'px'},{height:(ab?h:0)+'px'}],{duration:ab?420:280,easing:EZ,fill:'forwards'});x.firstChild.animate([{opacity:ab?.35:1,transform:'translateY('+(ab?-6:0)+'px)'},{opacity:ab?1:0,transform:'translateY('+(ab?0:-4)+'px)'}],{duration:ab?420:240,easing:EZ,fill:'both'})};
 l.onclick=tog;const k=document.querySelector('#v-dash .cntK[data-act=pcAbre]');if(k){k.removeAttribute('data-act');k.style.cursor='pointer';k.onclick=tog}
 lbl.textContent=lbl.textContent.replace(/\d+\s*$/,String([...D.querySelectorAll('.cntL')].filter(e=>!e.closest('.x66')&&e.offsetParent).length));
 // (2) rateio: sai a escolha
 const t=[...document.querySelectorAll('#v-dash *')].find(e=>e.children.length===0&&/^como dividir as contas entre as peças$/i.test(e.textContent.trim()));let tirou=0;
 if(t){let a=t.nextElementSibling;const fora=[t];while(a&&fora.length<3){fora.push(a);a=a.nextElementSibling}
  const h=document.createElement('div');h.className='hint';h.style.margin='4px 0 0';h.textContent='As contas do mês são divididas pelo custo: peça mais cara carrega mais.';t.parentNode.insertBefore(h,t);fora.forEach(e=>e.remove());tirou=fora.length}
 return [n,nT,nC,tirou]}"""
CSS66="#v-dash .ch66{font-style:normal;font-size:20px;color:var(--mute);display:inline-block;transition:transform .42s cubic-bezier(.45,0,.2,1);flex:none}#v-dash .on66 .ch66{transform:rotate(180deg)}#v-dash .x66{height:0;overflow:hidden;margin:0 -2px}#v-dash .x66i{padding:4px 2px 14px}#v-dash .x66 [data-act=pcUsaTodos]{border-color:var(--pri-bd,rgba(243,192,220,.38))!important;color:var(--accent-fg)!important}"
ABRE66="()=>{const x=document.querySelector('.x66');x.classList.add('on');x.style.height='auto';x.firstChild.style.opacity=1;x.previousElementSibling.classList.add('on66')}"
PARTES=[('a-contador','.cntD','O Contador com uma linha só para os preços',0),('b-lista-aberta','.x66','Tocar na linha: a lista abre no próprio Contador (como na Apple)',1),('c-contas','.op65,[data-act=ratsel]','Contas, taxas e meta sem "como dividir"',2)]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,sel,tit,modo in PARTES:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(1200);tela(pg,w,1);pg.evaluate(ABRE);w(300);pg.add_style_tag(content=CSS65);pg.evaluate(JS65);w(300)
                if prop:
                    oo.append(olho(pg));pg.add_style_tag(content=CSS66);print('   66',pg.evaluate(JS66));w(400)
                    if modo==1: pg.evaluate(ABRE66);w(300)
                s2='.cntD' if (prop and modo==1) else sel
                if not prop and modo==1: s2='.fx64[data-fx=abp]'
                if prop and modo==2: s2='.op65,.hint'
                if prop and modo==2: pg.evaluate("()=>{const h=[...document.querySelectorAll('#v-dash .hint')].find(e=>/divididas pelo custo/.test(e.textContent));window.scrollTo({top:h.getBoundingClientRect().top+scrollY-260,behavior:'instant'})}")
                else: pg.evaluate("s=>{const e=document.querySelector(s);window.scrollTo({top:e.getBoundingClientRect().top+scrollY-(s==='.cntD'?40:150),behavior:'instant'})}",s2)
                w(400)
                if prop: o=olho(pg);oo.append(o)
                p=T+'p66_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print('66'+nome,tema,'achados novos:',novos(oo[0],oo[1]))
            prancha('66%s-app-precos-%s.jpg'%(nome,tema),'App · Preços › %s · tema %s'%(tit,tema),['Hoje: já com os esboços 64 e 65 aprovados. Os mesmos preços aparecem 3 vezes (o número 15, "Subir 5 preços · Aceitar os 5" e o bloco "Preços para corrigir").',
              'Proposta: 1 linha no Contador ("15 preços para corrigir · 10 com sugestão · 5 sem custo ⌄"); tocar na linha abre a lista ali mesmo, como na Apple (a linha é o título, a seta gira, a lista cresce e o resto desce junto); o número 15 abre a mesma lista. Principal da tela: "Corrigir os 10 de uma vez". As contas são divididas sempre pelo custo (sai a escolha).'],*fs)
