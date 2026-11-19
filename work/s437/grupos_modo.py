# Troca quadrados|lista em TODOS os grupos (dono 19/11 16:16), por cima da base (Início 149n já aprovado)
exec(open('/home/claude/lafouch/work/s437/cartao.py').read().split('def SEM')[0])
s=open('/home/claude/lafouch/work/s437/inicio/caminhos.py').read()
T2=s[s.index('TOG2=r"""')+9:s.index('"""',s.index('TOG2=r"""')+9)]
T2=T2.replace("iniTog2","grTog").replace("si.offsetParent.appendChild(b);const gr=document.querySelector('#v-inicio .tgrid');gr&&gr.style.setProperty('margin-top','24px','important')","si.offsetParent.appendChild(b)")
Q=r"""()=>{const l=document.querySelector('#v-grp .nvLista');if(!l||l.dataset.q)return;l.dataset.q=1;const ini=document.querySelector('#v-inicio .tl');
 const P=(e,k,v)=>e&&e.style.setProperty(k,v,'important');P(l,'display','grid');P(l,'grid-template-columns','repeat(3,1fr)');P(l,'gap','12px');P(l,'border','0');P(l,'margin-top','24px');
 l.querySelectorAll('.nvL').forEach(b=>{[['display','flex'],['flex-direction','column'],['align-items','center'],['justify-content','center'],['gap','8px'],['height','112px'],['min-height','0'],['padding','8px'],['border','0'],['border-radius','18px'],['background','color-mix(in srgb,var(--fg) 5%,transparent)'],['text-align','center']].forEach(q=>P(b,q[0],q[1]));
  const ic=b.querySelector('.nvIc');P(ic,'color','var(--accent)');P(ic,'margin','0');const sm=b.querySelector('small');P(sm,'display','none');const i=b.querySelector('i');P(i,'display','none');const tx=b.querySelector('.nvTx');P(tx,'display','flex');P(tx,'flex-direction','column');P(tx,'align-items','center');P(tx,'flex','0 0 auto');const t=b.querySelector('b');P(t,'font-size','14px');P(t,'white-space','nowrap')})}"""
G=lambda gid:"()=>{const b=document.querySelector(\"#mainnav .mn[data-id='%s']\");if(b){b.click();return}__LF.S.nvP=[];const g=(__LF.S.grupos||[]).find(x=>x.id=='%s');}"%(gid,gid)
IDX0=lambda gid:"()=>{const b=document.querySelector(\"#v-inicio [data-id='%s']\");b&&b.click()}"%gid
IDX=lambda gid:"()=>{__LF.S.nvG='%s';__LF.S.nvP=['grp:%s'];__LF.setView('grp')}"%(gid,gid)
CR0="()=>{const c=[...document.querySelectorAll('button,a,[data-act]')].find(x=>x.getBoundingClientRect().height&&/^‹\\s*[A-ZÁÉÍÓÚÇÃÕ ]+$/.test(x.textContent.trim())&&x.getBoundingClientRect().top<400);c&&c.click()}"
RT='Início (aprovado 149n)';RP=[];RA='#sino'
def J(*xs): return "()=>new Promise(async r=>{"+"".join("await (async()=>{("+x+")();await new Promise(q=>setTimeout(q,500))})();" for x in xs)+"r()})"
CS=[('modo_dinheiro','Dinheiro',[G('g:din')]),('modo_giro','Giro e preços',[IDX('g:gp')]),('modo_resultados','Resultados',[IDX('g:res')]),('modo_site','Site',[IDX('g:site')])]
for nome,tela,ps in CS:
  if os.environ.get('SO') and os.environ['SO'] not in nome: continue
  
  caso(nome,tela,[LM]+ps+["()=>{("+T2+")('l');const t=document.getElementById('grTog');t&&t.style.setProperty('display','flex','important')}"],'#v-grp h1',J(Q,"()=>{document.getElementById('grTog')&&document.getElementById('grTog').remove();("+T2+")('g')}"),RT,RP,RA,'em lista (com o botão no canto)','em quadrados (toque no canto troca)','o mesmo botão do Início')
