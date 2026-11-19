exec(open('/home/claude/lafouch/work/s437/esb.py').read())
PAD="const P=(e,k,v)=>e.style.setProperty(k,v,'important');const pad=e=>{[['font-size','15px'],['font-weight','600'],['color','var(--accent-fg)'],['text-decoration','none'],['letter-spacing','0']].forEach(q=>P(e,q[0],q[1]));e.querySelectorAll('b,span,i').forEach(x=>{P(x,'font-size','15px');P(x,'font-weight','600');P(x,'color','var(--accent-fg)')})};"
REF=C['caixa-acoes'][:1]
J1="()=>{"+PAD+"const e=document.querySelector('[data-act=d48Res]');if(e)pad(e)}"
J2="()=>{"+PAD+"[...document.querySelectorAll('[data-act=tabsheet],[data-act=pgrAjusta]'),...[...document.querySelectorAll('button')].filter(b=>/^por quê/.test(b.textContent.trim()))].forEach(e=>{const t=e.textContent.trim();e.textContent=t.charAt(0).toUpperCase()+t.slice(1);pad(e)})}"
J3="()=>{"+PAD+"const e=document.querySelector('[data-act=pcAbre]');if(e)pad(e)}"
J4="()=>{"+PAD+"const e=[...document.querySelectorAll('a[data-id=desp]')].find(x=>x.getBoundingClientRect().height);if(e){e.textContent='Editar despesas ›';pad(e)}}"
R='modelo da família Link ›'
#caso('link_caixa','Caixa',C['caixa-acoes'][:1],'[data-act=d48Res]',J1,'Caixa · "Reservas ›"',REF,'[data-act=cxReservas]','"Ver o que falta repor ›" 14 px fino','15 px, mesmo peso do "Reservas ›"',R)
caso('link_precos','Preços',C['precos'],'[data-act=tabsheet]',J2,'Caixa · "Reservas ›"',REF,'[data-act=cxReservas]','"por quê", "ajustar tabela" 14 px minúsculo','"Por quê ›", "Ajustar tabela ›" 15 px',R)
#caso('link_inventario','Inventário',C['giro-no-estoque'],'[data-act=pcAbre]',J3,'Caixa · "Reservas ›"',REF,'[data-act=cxReservas]','"15 preços para corrigir ›" 13 px amarelo','15 px rosa (rosa = ação)',R)
#caso('link_reservas','Reservas',C['reservas-30dias'],'a[data-id=desp]',J4,'Caixa · "Reservas ›"',REF,'[data-act=cxReservas]','"Editar despesas" 12 px sublinhado, sem ›','"Editar despesas ›" 15 px, sem sublinhado',R)
