# S375 · esboço 111 (dono 17/11 18:57 "Esboço de todos os grupos"): regras de confirmação (docs/ESTUDO-CONFIRMACOES-17-11.md).
#  B = janela de confirmação única (desenho do 110c). A = faz na hora + "Desfazer" (o aviso que o app já usa). Um arquivo por tela.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s375/';T='/tmp/s375/';os.makedirs(T,exist_ok=True)
PNG='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
NUV="const S=window.__LF.S;S.nuvem={email:'loja@exemplo.com',rt:'r',ts:Date.now(),cot:'',dst:''};S.syncOn=true;S.pinHash='x';S.bioOn=false;"
AJ="setTimeout(()=>{const s=document.querySelector('#ajGrp .ajS[data-k=%s]:not(.on) .ajR');s&&s.click()},300)"
PED=lambda st,pgv,extra='': "const L=window.__LF,S=L.S;const it=S.items.find(i=>i.qty>0&&!i.bulk);S.pedidos.push({id:902,num:902,sid:'s902',cli:'Maria López',tel:'0981000902',st:'%s',pg:'%s',ts:Date.now()-50*60000,itens:[{t:it.ref,q:1,p:250000,ref:it.ref}],orig:'site',cod:'AB902',pag:'pix',total:250000,ent:'loja'%s});S.pedF='%s';L.setView('ped');setTimeout(()=>L.ACT.pedab(902),600)"%(st,pgv,extra,'ent' if st=='ent' else 'novo')
JAN=r"""(o)=>{const bk=document.createElement('div'),jn=document.createElement('div');bk.className='ljBk';jn.className='ljJn';jn.innerHTML='<div class="ljPuxa"></div><div class="ljHd"><b>'+o.t+'</b></div><div class="ljCorpo"></div>';document.body.append(bk,jn);bk.style.zIndex=5000;jn.style.zIndex=5001;bk.style.opacity='.5';jn.style.transform='translateY(0)';
 jn.querySelector('.ljCorpo').innerHTML='<div style="padding:2px 0 4px">'+(o.q?'<div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:12px 0;border-bottom:1px solid var(--line2)"><span style="font-size:15px">'+o.q+'<small style="display:block;font-size:12.5px;color:var(--mute);margin-top:2px">'+(o.d||'')+'</small></span><b style="font-size:17px;white-space:nowrap">'+(o.v||'')+'</b></div>':'')+
 '<p style="font-size:14.5px;line-height:1.5;color:var(--sub);margin:14px 0 18px">'+(o.nv?'<b style="color:var(--fg)">Não tem volta.</b> ':'')+o.f+'</p>'+
 '<button type="button" style="width:100%;min-height:52px;border-radius:14px;border:1px solid var(--bad);background:transparent;color:var(--bad);font-size:16px;font-weight:600;font-family:inherit">'+o.b+'</button>'+
 '<button type="button" style="display:block;margin:6px auto 0;min-height:44px;background:none;border:0;color:var(--fg);font-size:15px;font-weight:600;font-family:inherit">Voltar</button></div>';return 1}"""
DESF=r"""(o)=>{if(o.fz){(new Function(o.fz))()}document.querySelectorAll(o.sel||'#nada__').forEach(e=>{const x=o.up?e.closest(o.up):e;if(x)x.style.display='none'});let e=document.getElementById('lfDesf');if(!e){e=document.createElement('div');e.id='lfDesf';e.innerHTML='<span></span><button type="button">Desfazer</button>';document.body.appendChild(e)}e.firstChild.textContent=o.m;e.classList.add('on');return 1}"""
C=[]
def B(k,nome,tit,setup,alvo,hoje_js,h,p,jan): C.append(dict(k=k,nome=nome,tit=tit,setup=setup,alvo=alvo,hoje=hoje_js,h=h,p=p,jan=jan))
def A(k,nome,tit,setup,alvo,hoje_js,h,p,desf): C.append(dict(k=k,nome=nome,tit=tit,setup=setup,alvo=alvo,hoje=hoje_js,h=h,p=p,desf=desf))
# ---------- GRUPO B: janela de confirmação
B('b1','recusar-comprovante','Pedido do site · Recusar comprovante',PED('novo','comp',",comp:'%s'"%PNG),'[data-act=pedrecus]','',
  'Hoje: "Recusar" recusa no primeiro toque — a cliente recebe o aviso no site na hora.',
  'Proposta: janela de confirmação. Recusar mexe com a cliente.',
  dict(t='Recusar o comprovante?',q='Maria López',d='Pedido 902 · PIX',v='G$ 250.000',f='Ela recebe o aviso no site para mandar outro comprovante. A reserva continua valendo.',b='Recusar comprovante'))
B('b2','estornar','Resultados › Dia · Estornar venda',"window.__LF.inicioGo('hoje')",'.btn-pe.p',"()=>document.querySelector('.view:not([hidden]) .btn-pe.p').click()",
  'Hoje: o 1º toque em "Estornar" mostra uma confirmação dentro do cartão (tocar de novo).',
  'Proposta: janela de confirmação. Estornar mexe com o dinheiro e o estoque.',
  dict(t='Estornar a venda?',q='1× SL2210 C3 · Tartaruga',d='V-1953 · hoje 01:49',v='G$ 58.000',f='A peça volta para o estoque e o valor sai do caixa e dos resultados.',nv=1,b='Estornar venda'))
B('b3','desligar-sincronizacao','Ajustes › Sincronização · Desligar',"()=>{"+NUV+"window.__LF.setView('ajustes');"+AJ%'sync'+"}",'[data-act=syncdesl]',"()=>document.querySelector('[data-act=syncdesl]').click()",
  'Hoje: "Desligar neste aparelho" pede para tocar de novo ("Desligar? Toque de novo").',
  'Proposta: janela de confirmação. Mexe com os outros aparelhos da loja.',
  dict(t='Desligar a sincronização?',q='Este aparelho',d='para de receber e mandar mudanças',f='Os outros aparelhos deixam de ver o que for feito aqui. O que já está neste celular continua.',b='Desligar neste aparelho'))
B('b4','tirar-bloqueio','Ajustes › Segurança · Tirar o bloqueio',"()=>{"+NUV+"window.__LF.setView('ajustes');"+AJ%'seg'+"}",'[data-act=pinoff]',"()=>document.querySelector('[data-act=pinoff]').click()",
  'Hoje: o 1º toque troca o texto para "Confirmar: tirar o bloqueio do app" (tocar de novo).',
  'Proposta: janela de confirmação. Deixa o app aberto para quem pegar o celular.',
  dict(t='Tirar o bloqueio do app?',f='Qualquer pessoa com este celular na mão abre o app sem PIN, com vendas, caixa e clientes.',b='Tirar o bloqueio'))
B('b5','desconectar-nuvem','Ajustes › Nuvem · Desconectar',"()=>{"+NUV+"window.__LF.setView('ajustes');"+AJ%'bk'+";setTimeout(()=>window.__LF.ACT.nvxNuvem(),900)}",'[data-act=nvSair]','',
  'Hoje: "Desconectar" desliga a nuvem no primeiro toque, sem perguntar.',
  'Proposta: janela de confirmação. Para a cópia automática e a cotação do site.',
  dict(t='Desconectar da nuvem?',q='loja@exemplo.com',d='última cópia: agora',f='A cópia automática para e a cotação da loja deixa de ir para o site. As cópias que já estão na nuvem continuam lá.',b='Desconectar'))
B('b6','importar-backup','Ajustes › Arquivo de backup · Importar',"()=>{"+NUV+"window.__LF.setView('ajustes');"+AJ%'bk'+";setTimeout(()=>window.__LF.ACT.nvxArq(),900)}",'[data-act=bkimp]',"()=>{}",
  'Hoje: "Importar" pede para tocar de novo e depois ainda abre outra confirmação (pergunta duas vezes).',
  'Proposta: uma janela só, antes de escolher o arquivo.',
  dict(t='Importar um backup?',f='Os dados deste aparelho (peças, vendas, caixa, clientes) são trocados pelos do arquivo.',nv=1,b='Escolher o arquivo'))
ATA="const L=window.__LF,S=L.S;S.clientes=S.clientes||[];S.clientes.push({id:77,nome:'Óptica Central',email:'compras@exemplo.com',tel:'0981777777'});S.ataContas=S.ataContas||{};S.ataContas.A77={id:'A77',nome:'Óptica Central',email:'compras@exemplo.com',tipo:'assoc',tab:'opt',dispMax:3,trocaOk:true,pausada:false,cancelada:false,cliId:'77',ts:Date.now()-20*86400000,aparelhos:[]};L.setView('clientes');setTimeout(()=>L.ACT.ataConta(77),500)"
B('b7','cancelar-conta-atacado','Atacado · Cancelar conta',ATA,'[data-act=ataCanc]','',
  'Hoje: "Cancelar conta" abre a caixa cinza do navegador (fora do design do app).',
  'Proposta: a janela de confirmação do app, por cima da janela da conta. O mesmo vale para "Encerrar lote" e "Trocar acesso".',
  dict(t='Cancelar a conta atacadista?',q='Óptica Central',d='compras@exemplo.com',f='O acesso ao catálogo de atacado é apagado. Para voltar, só com um convite novo.',nv=1,b='Cancelar conta'))
# ---------- GRUPO A: faz na hora + Desfazer
A('a1','remover-pedido','Pedido entregue · Remover',PED('ent','pago'),'[data-act=peddel]',"()=>document.querySelector('[data-act=peddel]').click()",
  'Hoje: "Remover" pede para tocar de novo ("Remover?").',
  'Proposta: remove na hora e o aviso "Desfazer" fica 5 s (igual a excluir produto e remover cliente). Vale também para "Apagar pedidos de teste".',
  dict(fz="const A=window.__LF.ACT;A.peddel(902);A.peddel(902);",m='Pedido 902 removido'))
A('a2','esvaziar-carrinho','Pedido (carrinho) · Esvaziar',"()=>{const L=window.__LF,S=L.S;const its=S.items.filter(i=>i.qty>0&&!i.bulk).slice(0,2);S.cart=its.map(i=>({it:i,qty:1,tab:S.tabAtiva,preco:null}));L.setView('vendas');setTimeout(()=>L.ACT.cartopen(),500)}",'[data-act=cartclear]','',
  'Hoje: "Esvaziar carrinho" apaga tudo no primeiro toque, sem como voltar.',
  'Proposta: esvazia na hora e o aviso "Desfazer" fica 5 s.',
  dict(fz="window.__LF.ACT.cartclear()",m='Carrinho esvaziado'))
A('a3','limpar-historico','Pendências · Limpar histórico',"window.__LF.setView('notif')",'.dz105','',
  'Hoje: "Limpar histórico" apaga todo o histórico no primeiro toque, sem como voltar.',
  'Proposta: limpa na hora e o aviso "Desfazer" fica 5 s.',
  dict(fz="window.__LF.ACT.notifLimpa()",m='Histórico limpo'))
with sync_playwright() as pw:
  only=os.environ.get('SO','').split(',') if os.environ.get('SO') else None
  for c in C:
    if only and c['k'] not in only: continue
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(500)
        pg.route('**/*googleapis.com/**',lambda r:r.fulfill(status=200,body='{"documents":[]}',content_type='application/json'))
        s=c['setup'];pg.evaluate(s if s.startswith('()') else '()=>{'+s+'}');w(1700)
        ok=pg.evaluate("s=>!!document.querySelector(s)",c['alvo'])
        if not ok: print('  !! alvo não achado',c['k'],c['alvo'])
        pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(x=>x.getBoundingClientRect().height);if(e&&!e.closest('.ljJn'))scrollTo({top:e.getBoundingClientRect().top+scrollY-520,behavior:'instant'})}",c['alvo']);w(300)
        if prop:
          if 'jan' in c: pg.evaluate(JAN,c['jan'])
          else:
            pg.evaluate(DESF,dict(c['desf'],up=c['desf'].get('up')))
        elif c['hoje']: pg.evaluate(c['hoje'])
        w(700)
        oo.append(olho(pg));p=T+'%s_%d_%d.png'%(c['k'],esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
      print(c['k'],tema,'novos:',novos(oo[0],oo[1]))
      g='B · janela de confirmação' if 'jan' in c else 'A · faz na hora + Desfazer'
      prancha('111%s-app-%s-%s.jpg'%(c['k'],c['nome'],tema),'App · %s · %s · tema %s'%(c['tit'],g,tema),[c['h'],c['p']],*fs)
