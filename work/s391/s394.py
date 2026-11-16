# S394: o pedido leva o preço de cada linha do jeito que o cliente viu (campo pv dentro de cada item) — para o e-mail "Recebemos seu pedido" ficar igual ao esboço 58g
f='/home/claude/catalogo/js/lf-site.js';s=open(f,encoding='utf8').read()
def tr(a,b,n=1):
    global s;assert s.count(a)==n,(s.count(a),a[:70]);s=s.replace(a,b)
tr("  function pkEnviar(doc,id){","  /* S394: preço da linha como aparece na tela (moeda do cliente), para o e-mail do pedido */\n  function pvLin(u,q){try{var b=window.LFI&&LFI.cur==='BRL',v=(b?LFI.pv(u):Math.round(u))*q;return (b?'R$ ':'Gs. ')+String(Math.round(v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g,'.')}catch(_){return ''}}\n  function pkEnviar(doc,id){")
tr("grau:(p.gr&&p.gr.length)?p.gr[st.gr[k]||0]:'',preco:Math.round(p.n)}})}","grau:(p.gr&&p.gr.length)?p.gr[st.gr[k]||0]:'',preco:Math.round(p.n),pv:pvLin(p.n,st.cart[k])}})}")
tr("l2:DV==='l2'?L2.por[k]||0:0,cd:DV==='cup'?CI.por[k]||0:0}})}","l2:DV==='l2'?L2.por[k]||0:0,cd:DV==='cup'?CI.por[k]||0:0,pv:pvLin(p.n-(DV==='l2'?(L2.por[k]||0):0)/st.cart[k]-(DV==='cup'?(CI.por[k]||0):0)/st.cart[k],st.cart[k])}})}")
open(f,'w',encoding='utf8').write(s);print('ok')
