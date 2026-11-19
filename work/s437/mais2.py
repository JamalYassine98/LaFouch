exec(open('/home/claude/lafouch/work/s437/esb.py').read())
C['clientes']=["()=>window.__LF.setView('clientes')"]
J1="""()=>{const P=(e,k,v)=>e.style.setProperty(k,v,'important');const e=document.querySelector('[data-act=ataLoteNovo]');if(!e)return;P(e,'text-decoration','none');P(e,'align-self','center');P(e,'display','block');P(e,'margin-left','auto');P(e,'margin-right','auto');P(e,'color','var(--fg)')}"""
J2="""()=>{const P=(e,k,v)=>e.style.setProperty(k,v,'important');const e=document.querySelector('[data-act=clinovo]');if(!e)return;P(e,'color','var(--fg)');P(e,'border-color','var(--line2)');e.querySelectorAll('svg').forEach(s=>P(s,'color','var(--fg)'))}"""
caso('mais_lotes','Atacado › Lotes',C['atacado-lotes'],'[data-act=ataLoteNovo]',J1,'Carrinho · "+ Adicionar outra peça"',C['catalogo-carrinho'],'[data-act=cartclose]','"+ Criar lote" à esquerda e sublinhado','centralizado (sozinho na tela vazia), sem sublinhado','grupo dos "+" em texto')
caso('mais_clientes','Clientes',C['clientes'],'[data-act=clinovo]',J2,'Despesas',C['despesas-conta'],'[data-act=despNova]','"+" rosa (os outros são brancos)','"+" branco, contorno fino, igual aos outros','modelo da família Adicionar +')
