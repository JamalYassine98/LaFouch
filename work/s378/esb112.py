# S378 · esboço 112 (dono 17/11 21:56 "primeiro quero as correções"): correções dos defeitos achados hoje.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s374');import ap,comum,apsite
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s378/';T='/tmp/s378/';os.makedirs(T,exist_ok=True)
CLI="()=>{const L=window.__LF,S=L.S;S.clientes=S.clientes||[];S.clientes.push({id:77,nome:'Óptica Central',email:'compras@exemplo.com',tel:'0981777777'});L.setView('clientes');setTimeout(()=>L.ACT.ataConta(77),500)}"
CANC_ACT="""()=>{const L=window.__LF;const id=Object.keys(L.S.ataContas)[0];window.confirm=()=>true;for(let i=0;i<2;i++){L.ACT.ataCanc(id)}}"""
CANC_PROP=r"""()=>{const S=window.__LF.S;const id=Object.keys(S.ataContas)[0];S.ataContas[id].cancelada=true;S.ataContas[id].cancEm=Date.now();
 const j=[...document.querySelectorAll('.ljJn')].pop();const a=j.querySelector('.ata77');const hd=a.querySelector('.hd77');hd.querySelector('small').innerHTML='Cliente associado · <span class="w77">Cancelada em 17/11</span>';
 [...a.children].forEach(c=>{if(c!==hd)c.remove()});
 a.insertAdjacentHTML('beforeend','<p style="font-size:14.5px;line-height:1.5;color:var(--sub);margin:16px 0 18px;text-align:center">O acesso ao catálogo de atacado foi apagado. Ele não entra mais por nenhum aparelho.</p><button type="button" class="go77">Criar novo acesso</button><div style="text-align:center;font-size:12.5px;color:var(--mute);margin-top:8px">manda um convite novo pelo WhatsApp</div>');return 1}"""
FICHA_HOJE="()=>{const L=window.__LF,S=L.S;S.clientes=S.clientes||[];S.clientes.push({id:77,nome:'Óptica Central',email:'compras@exemplo.com',tel:'0981777777'});S.ataContas=S.ataContas||{};S.ataContas.A1={id:'A1',nome:'Óptica Central',email:'compras@exemplo.com',tipo:'assoc',tab:'opt',dispMax:3,cancelada:true,cliId:'77',ts:Date.now()};L.setView('clientes');setTimeout(()=>{const e=[...document.querySelectorAll('#v-clientes [data-act=cliab]')].find(x=>/Óptica/.test(x.innerText));e&&e.click()},500)}"
FICHA_PROP=r"""()=>{const e=[...document.querySelectorAll('#v-clientes button,#v-clientes [data-act]')].filter(x=>x.getBoundingClientRect().height).find(x=>/criar o acesso/.test(x.innerText));if(!e)return 0;const b=e.querySelector('b')||e;e.innerHTML=e.innerHTML.replace('criar o acesso ao catálogo de atacado','cancelada em 17/11 · ver a conta');const t=[...e.querySelectorAll('*')].find(x=>/ver a conta/.test(x.textContent)&&!x.children.length);if(t)t.style.color='var(--warn)';return 1}"""
ROLA_FICHA="()=>{const e=[...document.querySelectorAll('#v-clientes button,#v-clientes [data-act]')].filter(x=>x.getBoundingClientRect().height).find(x=>/Conta atacadista/.test(x.innerText));e&&scrollTo({top:e.getBoundingClientRect().top+scrollY-420,behavior:'instant'})}"
PECA="()=>{const L=window.__LF;L.setView('estoque');setTimeout(()=>{const c=[...document.querySelectorAll('#v-estoque .pcard[data-ref]')].find(x=>/Armani/.test(x.innerText));c.click();setTimeout(()=>document.getElementById('edSiteBtn').scrollIntoView({block:'center'}),900)},600)}"
LIGA="()=>{document.getElementById('edSiteBtn').click()}"
SWFIX="#edSiteBtn.lfwave:after{content:'';position:absolute;inset:auto;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;animation:none;opacity:1;transform:none;transition:left .25s cubic-bezier(.3,1.5,.5,1)}#edSiteBtn.on.lfwave:after{left:21px}#edSiteBtn.lfwave:before{content:'';position:absolute;inset:-6px;border-radius:99px;pointer-events:none;background:radial-gradient(circle,rgba(224,139,192,.55),transparent 65%);animation:lfwv 1s ease-out forwards}"
AVFIX="#lfSitePv{bottom:calc(86px + 12px + env(safe-area-inset-bottom,0px))!important}"
PNL="()=>{window.__LF.ACT.ajSite()}"
PNL_ABRE="(t)=>{const f=[...document.querySelectorAll('iframe')].find(x=>/admin/.test(x.src));const d=f.contentDocument;const e=[...d.querySelectorAll('button,[role=button],div')].filter(x=>x.getBoundingClientRect().height&&x.children.length<6).find(x=>x.innerText&&x.innerText.trim().startsWith(t));e&&e.click();return !!e}"
PNL_FIX="()=>{const s=document.getElementById('siteBox');const n=document.getElementById('mainnav');const t=s.getBoundingClientRect().top+scrollY;s.style.height=(innerHeight-t-n.getBoundingClientRect().height)+'px';return s.style.height}"
LISTA_PED="()=>{const L=window.__LF,S=L.S;const its=S.items.filter(i=>i.qty>0&&!i.bulk);S.pedidos.push({id:902,num:902,sid:'s902',cli:'Maria López',tel:'0981000902',st:'novo',pg:'comp',comp:'x',ts:Date.now()-50*60000,itens:[{t:its[0].ref,q:1,p:250000,ref:its[0].ref}],orig:'site',cod:'AB902',pag:'pix',total:250000,ent:'loja'},{id:901,num:901,sid:'s901',cli:'Maria Fernanda Benítez',tel:'0981000901',st:'novo',pg:'pagar',ts:Date.now()-55*60000,itens:[{t:its[0].ref,q:1,p:250000,ref:its[0].ref}],orig:'site',cod:'AB901',pag:'pix',total:250000,ent:'loja'});S.pedF='novo';L.setView('ped')}"
CASOS=[
 ('a','atacado-cancelar','Clientes › Conta atacadista · tocar em Cancelar conta',CLI,None,CANC_ACT,CANC_PROP,None,
  'Hoje: cada toque abre outra janela por cima (2 toques = 3 janelas) e a conta cancelada continua com Cancelar, Pausar e Enviar convite.',
  'Proposta: depois de confirmar (janela do 111b7), a MESMA janela muda no lugar: "Cancelada em 17/11", a frase do que aconteceu e um só botão "Criar novo acesso". Toda ação da janela (Pausar, moeda, limite) também atualiza no lugar, sem abrir outra.'),
 ('b','ficha-conta-cancelada','Clientes › ficha · Conta atacadista depois de cancelar',FICHA_HOJE,ROLA_FICHA,None,FICHA_PROP,None,
  'Hoje: a ficha volta a dizer "criar o acesso" e, ao tocar, o app cria OUTRA conta sozinho (fica uma cancelada e uma ativa).',
  'Proposta: a linha diz "cancelada em 17/11 · ver a conta" e abre a conta cancelada (a do 112a). Conta nova só pelo "Criar novo acesso", de propósito.'),
 ('c','chave-no-site','Ficha da peça · ligar a chave "No site"',PECA,None,LIGA,LIGA,SWFIX,
  'Hoje: ao ligar, a bolinha branca some (o brilho usa o mesmo desenho da bolinha) e a chave fica só rosa.',
  'Proposta: a bolinha corre para a direita como sempre e o brilho acontece em volta da chave, por trás; depois some.'),
 ('d','aviso-no-site','Ficha da peça · aviso "No ar no site"',PECA,None,LIGA,LIGA,SWFIX+AVFIX,
  'Hoje: o aviso "… No ar no site" aparece por cima da barra de baixo por uns 3 s.',
  'Proposta: o aviso aparece logo ACIMA da barra (como o "Desfazer"), sem cobrir Início, Vender, Peças…'),
 ('e','painel-janela','Ajustes do site · abrir "Entrega · transportadoras"',PNL,None,"PNL:Entrega","PNL:Entrega",None,
  'Hoje: o painel do site vai até embaixo da barra do app; a janela dele abre cortada atrás da barra (o "Salvar entrega" fica escondido).',
  'Proposta: o painel termina em cima da barra, então a janela dele abre inteira, com o botão Salvar à vista.'),
 ('f','pedidos-nome','Pedidos online · nome da cliente na lista',LISTA_PED,None,None,None,"#v-ped .pdCard .pdNm,#v-ped .pdNome{white-space:normal!important;overflow:visible!important;text-overflow:clip!important}",
  'Hoje: o nome sai cortado ("Maria L…") mesmo com espaço sobrando, porque o selo do pagamento fica na mesma linha.',
  'Proposta: o nome inteiro na primeira linha e o selo embaixo, junto do número do pedido.'),
]
with sync_playwright() as pw:
  only=os.environ.get('SO','').split(',') if os.environ.get('SO') else None
  for k,nome,tit,abre,rola,hj,pr,css,h,p in CASOS:
    if only and k not in only: continue
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[]
      for prop in (0,1):
        if k=='e': b,pg,w=apsite.abre(pw,esc)
        else: b,pg,w=ap.abre(pw,'inicio',esc)
        w(400);pg.on('dialog',lambda d:d.accept())
        pg.evaluate(abre);w(2600 if k=='e' else 1800)
        if prop and css: pg.add_style_tag(content=css)
        if k=='e' and prop: pg.evaluate(PNL_FIX);w(600)
        if rola: pg.evaluate(rola);w(300)
        acao=pr if prop else hj
        if acao:
          if acao.startswith('PNL:'): apsite.frame(pg).evaluate("t=>{const e=[...document.querySelectorAll('button,[role=button],.row,li,div')].filter(x=>x.getBoundingClientRect().height&&x.children.length<6).find(x=>x.innerText&&x.innerText.trim().startsWith(t));e&&e.click();return !!e}",acao[4:])
          else: pg.evaluate(acao)
        w(1700 if k in 'cd' else 900)
        if k=='f' and prop: pg.evaluate(open('/home/claude/lafouch/work/s378/f_prop.js').read() if os.path.exists('/home/claude/lafouch/work/s378/f_prop.js') else '()=>0');w(300)
        oo.append(olho(pg));fp=T+'%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp);b.close()
      print(k,tema,'novos:',novos(oo[0],oo[1]))
      prancha('112%s-app-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],*fs)
