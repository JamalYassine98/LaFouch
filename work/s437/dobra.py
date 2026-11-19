exec(open('/home/claude/lafouch/work/s437/esb.py').read())
REF=["()=>window.__LF.setView('ajustes')"];R='modelo da família Dobra ⌄'
J1="""()=>{const P=(e,k,v)=>e.style.setProperty(k,v,'important');document.querySelectorAll('.hSem').forEach(b=>{P(b,'padding-left','0');P(b,'padding-right','0');P(b,'min-height','64px');const t=b.querySelector('b');if(t){P(t,'font-size','16px')}const s=b.querySelector('small');if(s){P(s,'font-size','13px')}})}"""
J2="""()=>{const P=(e,k,v)=>e.style.setProperty(k,v,'important');const e=document.querySelector('[data-act=famAbre]');if(!e)return;[['font-size','15px'],['font-weight','600'],['min-height','44px']].forEach(q=>P(e,q[0],q[1]))}"""
caso('dobra_historico','Histórico',C['hist-lista'],'[data-act=hSem]',J1,'Ajustes',REF,'#ajGrp','"Semana…": texto e ⌄ 14 px para dentro','na mesma margem das outras linhas',R)
#caso('dobra_caixa','Caixa',C['caixa-acoes'][:1],'[data-act=famAbre]',J2,'Ajustes',REF,'#ajGrp','"Ver todos os movimentos ⌄" 13 px','15 px, ⌄ logo depois do texto',R)
