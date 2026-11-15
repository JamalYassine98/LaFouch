# S359: os desenhos devidos antes do "implementar tudo" (ordem do dono 15/11 19:12). App real; claro e escuro; olho sem achado novo.
#  49a Início com as famílias · 49b as flechas das famílias Peças, Dinheiro, Site e Clientes · 50a Vitrine · 50b Contas pagas · 50c Verificar agora
#  39e Pagamento em Pix · 39f abaixo do piso · 48-pc / 48-tablet Dashboard · 49a-pc Início.   Uso: esb.py [49a 49b 50 39 pc]
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s359/';OUT=comum.OUT;T='/tmp/s359/'
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
so=sys.argv[1:];quer=lambda n:not so or n in so
S351=open('/home/claude/lafouch/work/s351/esb.py').read();PEGA=S351.split('PEGA="""')[1].split('"""')[0].replace('\\\\','\\');POE=S351.split('POE="""')[1].split('"""')[0].replace('\\\\','\\');TIT=S351.split('TIT="""')[1].split('"""')[0].replace('\\\\','\\')
S353=open('/home/claude/lafouch/work/s353/pag.py').read();CSSP=S353.split('CSS39="""')[0] and open('/home/claude/lafouch/work/s350/esb.py').read().split('CSS39="""')[1].split('"""')[0];MUDAP=S353.split('MUDA="""')[1].split('"""')[0].replace('\\\\','\\');POSP=S353.split('POS="""')[1].split('"""')[0]
TOCA="rx=>{const b=[...document.querySelectorAll('button')].filter(e=>e.offsetParent&&new RegExp(rx).test(e.innerText.trim())).pop();if(!b)return 'sem';b.click();return 'ok'}"
def tres(nome,titulo,sub,quadros,rots):
    ims=[Image.open(x).convert('RGB') for x in quadros];w_,h_=ims[0].size;g=40;S=Image.new('RGB',(g+len(ims)*(w_+g),300+h_+g),'#f1eef0');d=ImageDraw.Draw(S);d.text((g,34),titulo,font=F(40,True),fill='#1d1418')
    for i,l in enumerate(sub): d.text((g,96+i*36),l,font=F(25),fill='#55484f')
    for i,(im,r) in enumerate(zip(ims,rots)):
        x=g+i*(w_+g);d.text((x,236),r,font=F(32,True),fill='#8d3a69');S.paste(im,(x,290));d.rectangle([x-1,289,x+w_,290+h_],outline='#cfc6cb')
    S.save(OUT+nome,quality=88);print(' ',nome,S.size)
FAM="""()=>{const L=window.__LF;L.S.inicioFant=true;L.render();const q=id=>document.querySelector('#v-inicio .tl[data-id="'+id+'"]');const glob=(q('onl')||{querySelector:()=>null}).querySelector('.ti');const gi=glob?glob.innerHTML:'';L.S.inicioFant=false;L.render();
 const keep={hoje:['Dashboard','Dia, mês, reservas, giro e preços'],ped:['Site','Pedidos, mensagens, analisador e temática'],cli:['Clientes','Clientes, atacado e cartões']};let n=0;
 [...document.querySelectorAll('#v-inicio .tl[data-id]')].forEach(e=>{const id=e.getAttribute('data-id');const k=keep[id];if(!k||e.dataset.ok){if(!e.closest('.vh,.hero')&&e.classList.contains('tl')){e.remove();n++}return}e.dataset.ok=1;keep[id]=null;e.querySelector('.tn').textContent=k[0];let tp=e.querySelector('.tp');if(!tp){tp=document.createElement('span');tp.className='tp';e.appendChild(tp)}tp.textContent=k[1];tp.className='tp';if(id==='ped'&&gi)e.querySelector('.ti').innerHTML=gi});
 const nav=[...document.querySelectorAll('#mainnav .mn,#mainnav button,#sidenav button,.sn')];nav.forEach(b=>{const s=[...b.querySelectorAll('*')].filter(x=>x.children.length===0&&x.textContent.trim()).pop()||b;const t=s.textContent.trim();if(t==='Catálogo')s.textContent='Vender';if(t==='Inventário')s.textContent='Peças'});return n}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        b,pg,w=ap.abre(pw,'dash',esc);w(1200);pg.evaluate("()=>document.querySelector('#v-dash .dHdT').click()");w(1000);D=pg.evaluate(PEGA);oF=olho(pg);b.close()
        if quer('49a'):
            for apn,pc in (('celular',False),('pc',True)):
                if apn=='pc' and not quer('pc') and so: continue
                fs=[];oo=[]
                for prop in (0,1):
                    b,pg,w=ap.abre(pw,'inicio',esc,apn);w(2600)
                    if prop: oo.append(olho(pg));print('   atalhos tirados:',pg.evaluate(FAM));w(700)
                    p=T+'in_%s_%d_%d.png'%(apn,esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
                print('49a',apn,tema,'achados novos:',novos(oo[0]|oo[1],oo[2]))
                prancha('49a-%s-inicio-familias-%s.jpg'%(apn,tema),'App · %sInício com as famílias · tema %s'%('Computador · ' if pc else '',tema),['Hoje: 17 atalhos soltos no Início, mais os 5 botões da barra.','Proposta: na barra ficam Vender, Peças e Dinheiro; no Início ficam Dashboard, Site e Clientes. Cada um é um grupo: o título da tela, com a flecha, abre as outras telas dele. Os avisos ficam no sino e no cartão "Guardião".'],*fs,pc=pc)
        if quer('49b'):
            qs=[]
            for nome,tela,tit,linhas in (('Peças','estoque','Inventário',[['Inventário','Cadastro, estoque e preço de cada peça'],['Fornecedores','Compras e lotes'],['Reposição','O que comprar, com a lista do Giro'],['Contagem','Conferir o estoque'],['Estúdio','Fotos das peças'],['Gerenciar grupo','Nome e telas de "Peças"']]),
              ('Dinheiro','caixa','Caixa',[['Caixa','O dinheiro da loja, por moeda'],['Despesas','Contas do mês e imprevistos'],['Câmbio','Cotações e trocas'],['Gerenciar grupo','Nome e telas de "Dinheiro"']]),
              ('Site','ped','Pedidos online',[['Pedidos online','O que chegou pelo site'],['Mensagens','Contato e atacado'],['Analisador','Visitas e avisos do site'],['Temática','Calendário do site'],['Marketing','Posts, vídeos e plano'],['Gerenciar grupo','Nome e telas de "Site"']]),
              ('Clientes','clientes','Clientes',[['Clientes','Quem compra na loja e no atacado'],['Atacado','Lojistas, lotes e tabela'],['Cartões','Descontos e cupons'],['Gerenciar grupo','Nome e telas de "Clientes"']])):
                b,pg,w=ap.abre(pw,tela,esc);w(1500);pg.evaluate(TIT,['#v-'+tela,tit,D['tit']]);pg.evaluate(POE,[D,linhas,0]);pg.evaluate("()=>document.querySelectorAll('button').forEach(e=>{if(e.offsetParent&&/^[×✕]$/.test(e.innerText.trim()))e.remove()})");w(700)
                p=T+'fm_%s_%d.png'%(tela,esc);pg.screenshot(path=p);qs.append(p);b.close()
            tres('49b-app-flecha-das-familias-%s.jpg'%tema,'App · a flecha de cada família · tema '+tema,['Tocar no título da tela abre as outras telas da família (a mesma folha do Dashboard, sem o "×"). Dados de exemplo nas legendas.','"Gerenciar grupo" tira ou põe telas e desfaz a família. Avisos não é grupo: é o sino.'],qs,['PEÇAS','DINHEIRO','SITE','CLIENTES'])
        if quer('50'):
            def par(nome,titulo,sub,prep,muda,css=''):
                fs=[];oo=[]
                for prop in (0,1):
                    b,pg,w=ap.abre(pw,'inicio',esc);prep(pg,w);w(900)
                    if prop:
                        oo.append(olho(pg))
                        if css: pg.add_style_tag(content=css)
                        print('   ',str(pg.evaluate(muda))[:120]);w(700)
                    p=T+'%s_%d_%d.png'%(nome[:3],esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
                print(nome,tema,'achados novos:',novos(oo[0]|oo[1],oo[2]));prancha('%s-%s.jpg'%(nome,tema),titulo+' · tema '+tema,sub,*fs)
            par('50a-app-giro-vitrine-campo','App · Giro › Vitrine da semana',['Hoje: o campo "quantos lugares" tem 28 px de largura (o botão "Salvar" ocupa a linha toda).','Proposta: o campo ocupa a linha e o botão fica do tamanho do texto.'],
              lambda pg,w:(pg.evaluate("()=>{const L=window.__LF;L.S.dTab='giro';L.setView('dash')}"),w(1500),pg.evaluate("()=>{const e=[...document.querySelectorAll('#v-dash [data-act]')].filter(e=>/Vitrine da semana/.test(e.innerText)).pop();e.click()}"),w(900),pg.evaluate("()=>{const i=document.getElementById('vtLug');i&&i.scrollIntoView({block:'center',behavior:'instant'})}")),
              "()=>{const i=document.getElementById('vtLug'),b=i.nextElementSibling;i.style.cssText='flex:1 1 auto;min-width:0';b.style.cssText='flex:none;width:auto;padding:0 26px';return [i.getBoundingClientRect().width|0,b.getBoundingClientRect().width|0]}")
            par('50b-app-despesas-contas-pagas','App · Despesas › Contas pagas neste mês',['Hoje: tocar na linha "Contas pagas neste mês" não abre nada.','Proposta: abre a lista das contas pagas (o conteúdo que o app já tem pronto e não mostra).'],
              lambda pg,w:(pg.evaluate("()=>window.__LF.setView('desp')"),w(1300),pg.evaluate("()=>{const e=[...document.querySelectorAll('#v-desp [data-act]')].filter(e=>/Contas pagas neste mês/.test(e.innerText)).pop();e.scrollIntoView({block:'center',behavior:'instant'});e.click()}")),
              "()=>{const L=window.__LF;const e=[...document.querySelectorAll('#v-desp [data-act]')].filter(e=>/Contas pagas neste mês/.test(e.innerText)).pop();const id=e.getAttribute('data-id');const antes=document.getElementById('v-desp').innerText.length;try{L.render()}catch(x){};const e2=[...document.querySelectorAll('#v-desp [data-act]')].filter(e=>/Contas pagas neste mês/.test(e.innerText)).pop();e2.scrollIntoView({block:'start',behavior:'instant'});scrollBy(0,-120);return [id,antes,document.getElementById('v-desp').innerText.length]}")
            par('50c-app-pedidos-verificar-agora','App · Pedidos › Verificar agora',['Hoje: tocar em "Verificar agora" não muda nada na tela.','Proposta: o aviso do app responde ("Verificado agora · nenhum pedido novo").'],
              lambda pg,w:(pg.evaluate("()=>window.__LF.setView('ped')"),w(1300)),
              "()=>{const b=document.createElement('div');b.className='lfa-toast b';b.setAttribute('role','status');b.innerHTML='<div style=\"flex:1\"><b>Verificado agora</b><div class=\"hint\" style=\"margin:2px 0 0\">Nenhum pedido novo</div></div>';document.body.appendChild(b);return 'ok'}")
        if quer('39'):
            def ate(pg,w):
                pg.evaluate("()=>window.__LF.setView('vendas')");w(800);pg.evaluate("()=>document.querySelector('#vRows .pcard[data-ref]').click()");w(1000);pg.evaluate(TOCA,'^Vender');w(1100);pg.evaluate("()=>document.querySelector('[data-act=cartopen]').click()");w(900);pg.evaluate(TOCA,'Confirmar pedido');w(1200)
            for nome,desc,prep,rola,nota in (('e-pix','Pix',lambda pg,w:(pg.evaluate(TOCA,'^Pix$'),w(900)),False,'o trilho marca Pix; o que o app pede para o Pix aparece embaixo, como hoje'),('f-abaixo-do-piso','venda abaixo do piso (fim da tela)',lambda pg,w:None,True,'o aviso do piso fica colado ao botão "Finalizar venda"')):
                fs=[];oo=[]
                for prop in (0,1):
                    b,pg,w=ap.abre(pw,'inicio',esc);ate(pg,w);prep(pg,w)
                    if prop: o=olho(pg);pg.evaluate('()=>scrollBy(0,400)');w(300);o|=olho(pg);oo.append(o);pg.add_style_tag(content=CSSP);pg.evaluate(MUDAP);pg.evaluate(POSP);w(400)
                    if rola: pg.evaluate("()=>{const g=document.getElementById('sgo');g.scrollIntoView({block:'end',behavior:'instant'});scrollBy(0,90)}")
                    else: pg.evaluate("()=>{const c=document.getElementById('vSaleCard');c.scrollIntoView({block:'start',behavior:'instant'});scrollBy(0,-70)}")
                    w(500);p=T+'pg_%s_%d_%d.png'%(nome[:1],esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
                print('39'+nome,tema,'achados novos:',novos(oo[0]|oo[1],oo[2]))
                prancha('39%s-celular-pagamento-%s.jpg'%(nome,tema),'App · Pagamento · %s · tema %s'%(desc,tema),['Hoje: o mesmo estado na tela atual.','Proposta (padrão do esboço 39): '+nota+'.'],*fs)
