# S381 · esboço 115 (dono 17/11 22:41, prints do celular): pedido cancelado — botões espremidos, janela da peça antiga, nome em espanhol, valor do pagamento confuso.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s381/';T='/tmp/s381/';os.makedirs(T,exist_ok=True)
PED="()=>{const L=window.__LF,S=L.S;const it=S.items.find(i=>i.qty>0&&!i.bulk&&/Armani/.test(L.pubNome?L.pubNome(i.ref):'')&&i.ref)||S.items.find(i=>i.qty>0&&!i.bulk);window.__ref=it.ref;S.pedidos.push({id:7,num:7,sid:'s7',cli:'Hilda Teste',tel:'+595981000007',st:'canc',pg:'pagar',cliNovo:true,ts:Date.now()-28*3600e3,itens:[{t:'Armazón de acetato morado',q:1,preco:5000,ref:it.ref}],orig:'site',cod:'AB7',pag:'alias',pagar:4961,total:5000,ent:'loja'});S.pedF='ent';L.setView('ped')}"
ABRE="()=>setTimeout(()=>window.__LF.ACT.pedab(7),300)"
BTNFIX=".pdB2.txt{width:auto!important;flex:none!important;padding:0 20px!important;white-space:nowrap}"
NOMES=r"""()=>{const L=window.__LF;const nm=L.pubNome?L.pubNome(window.__ref):'';document.querySelectorAll('#v-ped .pdRow b').forEach(b=>{if(/Armazón/.test(b.textContent))b.textContent=nm});return nm}"""
PAG=r"""()=>{const c=[...document.querySelectorAll('#v-ped .pdCd')].find(x=>/Pagamento/i.test((x.querySelector('.pdLb')||{}).textContent||''));if(!c)return 0;const lin=c.querySelector('.pdLin');const pill=lin.querySelector('.pdPill');
 lin.innerHTML='<div style="flex:1;min-width:0"><b>Banco Familiar (alias)</b></div>';if(pill)lin.appendChild(pill);
 c.insertAdjacentHTML('beforeend','<div class="cxL" style="padding:10px 0"><span>Valor do pedido</span><b style="font-size:16px;font-weight:600">G$ 5.000</b></div><div class="cxL" style="padding:10px 0;border-bottom:0"><span>Valor exato da transferência<small>com final único para achar o pagamento</small></span><b style="font-size:16px;font-weight:600;white-space:nowrap">G$ 4.961</b></div>');
 [...c.querySelectorAll('.pdMt')].forEach(m=>{if(/^G\$ 5\.000$/.test(m.textContent.trim()))m.remove()});return 1}"""
PROD="()=>{const L=window.__LF;L.S.pedProd=0;L.render&&L.render()}"
PROD_P=r"""()=>{const L=window.__LF,ref=window.__ref;const m=document.querySelector('.modal:not([hidden]) .modal-box');const nome=m.querySelector('b').textContent;const img=m.querySelector('img');const vals=[...m.querySelectorAll('.tgrid .card')].map(c=>[c.querySelector('.lbl').textContent,c.querySelector('b').textContent]);
 m.closest('.modal').style.display='none';
 const bk=document.createElement('div'),jn=document.createElement('div');bk.className='ljBk';jn.className='ljJn';jn.innerHTML='<div class="ljPuxa"></div><div class="ljHd"><b>'+nome+'</b></div><div class="ljCorpo"></div>';document.body.append(bk,jn);bk.style.opacity='.5';jn.style.transform='translateY(0)';
 jn.querySelector('.ljCorpo').innerHTML='<div style="padding:0 0 6px">'+(img?'<div style="background:#fff;border-radius:16px;padding:6px;text-align:center"><img src="'+img.src+'" style="max-width:100%;max-height:190px"></div>':'')+'<div style="font-size:12.5px;color:var(--mute);margin:10px 0 2px">'+ref+'</div>'+
 vals.map((v,i)=>'<div class="cxL" style="padding:12px 0'+(i==vals.length-1?';border-bottom:0':'')+'"><span>'+v[0].charAt(0)+v[0].slice(1).toLowerCase()+'</span><b style="font-size:16px;font-weight:600">'+v[1]+'</b></div>').join('')+
 '<button type="button" class="lk100 c101" style="display:block;margin:10px auto 0;background:none;border:0;color:var(--accent-fg);font-size:15px;font-weight:600;min-height:44px;font-family:inherit">Ver a peça no Inventário ›</button></div>';return 1}"""
CASOS=[('a','pedidos-feitos-card','Pedidos online › Feitos · pedido cancelado',PED,None,None,BTNFIX,
  'Hoje: "Remover" não cabe no botão (texto vazando).','Proposta: o botão cresce até caber o texto (mesma correção do 110a). Ao tocar, remove na hora com "Desfazer" (111a1).'),
 ('b','pedido-cancelado','Pedido cancelado · Pagamento e Peças',PED,ABRE,NOMES+'|||'+PAG,BTNFIX,
  'Hoje: "Banco Familiar (alias) · G$ 4.961" e embaixo "G$ 5.000" sem dizer o que é cada um; a peça vem com o nome do site em espanhol ("Armazón de acetato morado"); "Remover" vazando.',
  'Proposta: duas linhas claras — "Valor do pedido G$ 5.000" e "Valor exato da transferência G$ 4.961" (o final único para achar o pagamento); a peça com o nome do app; "Remover" cabendo.'),
 ('c','pedido-janela-peca','Pedido › tocar na peça',PED,ABRE+'|||'+PROD,PROD_P,None,
  'Hoje: caixa antiga no meio da tela, com "×" cinza quadrado e "Fechar" (dois fechar), números em quadradinhos com rótulo quebrado ("NESTE / PEDIDO").',
  'Proposta: a janela de baixo de sempre (arrasta ou toca fora para fechar): foto, código e linhas finas (Neste pedido · No estoque · Preço no pedido · Material · Público) e "Ver a peça no Inventário ›".')]
with sync_playwright() as pw:
  for k,nome,tit,js,depois,prop_js,css,h,p in [c for c in CASOS if c[0] in (os.environ.get('SO') or 'abc')]:
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(400);pg.evaluate(js);w(1200)
        for d in (depois or '').split('|||'):
          if d: pg.evaluate(d);w(1000)
        if k in 'ab': pg.evaluate("()=>{const e=document.querySelector('#v-ped [data-act=peddel]');e&&e.scrollIntoView({block:'end'});scrollBy(0,120)}");w(300)
        if k=='b': pg.evaluate("()=>{const c=[...document.querySelectorAll('#v-ped .pdCd')].find(x=>/Pagamento/i.test(x.textContent));c&&scrollTo({top:c.getBoundingClientRect().top+scrollY-160,behavior:'instant'})}");w(300)
        if prop:
          if css: pg.add_style_tag(content=css)
          for q in (prop_js or '').split('|||'):
            if q: pg.evaluate(q);w(300)
        w(500);oo.append(olho(pg));fp=T+'%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp);b.close()
      print(k,tema,'novos:',novos(oo[0],oo[1]))
      prancha('115%s-app-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],*fs)
