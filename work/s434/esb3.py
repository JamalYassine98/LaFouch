# S434 — esboços dos 8 detalhes da navegação B refinada (um arquivo por detalhe)
exec(open('/home/claude/lafouch/work/s434/nvlib.py').read())
from PIL import ImageDraw
import json
CX=C['caixa-acoes'][:1];DS=C['dash-mes'];RS=C['caixa-reservado']
def ab(pw,st,a='celular'):
  b,pg,w=ap.abre(pw,'inicio',True,ap=a);w(300);pg.evaluate(LM)
  for x in st:
    try: pg.evaluate(x)
    except Exception: pass
    w(900)
  pg.evaluate(J_HELP);pg.evaluate(J_B);return b,pg,w
def toque(png,xy,out):  # anel rosa onde o dedo toca
  im=Image.open(png).convert('RGB');d=ImageDraw.Draw(im);x,y=xy[0]*2,xy[1]*2
  for r,wd in ((46,6),(30,3)): d.ellipse([x-r,y-r,x+r,y+r],outline='#e46aa8',width=wd)
  im.save(out);return out
def ctr(pg,js): return pg.evaluate("()=>{const e=("+js+");const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}")
NAVDIN="[...document.querySelectorAll('#mainnav button')].find(x=>/Dinheiro/.test(x.innerText))"
ITD=[['Caixa','O dinheiro da loja, por moeda',SV('caixa')],['Despesas','Contas do mês e quanto cada venda separa',SV('desp')],['Câmbio','Cotação do dia e trocas de moeda',SV('fx')]]
GER="()=>{const s=[...document.querySelectorAll('section')].filter(x=>x.querySelector('.cxL')&&x.offsetHeight).pop();s.insertAdjacentHTML('afterend','<button type=\"button\" style=\"display:block;margin:24px auto 0;background:none;border:0;color:var(--mute);font:inherit;font-size:14px;min-height:44px\">Gerenciar grupo ›</button>')}"
BASE='Base: app real + todos os aprovados + navegação B refinada (146).'
R={}
with sync_playwright() as pw:
  # telas de apoio
  b,pg,w=ab(pw,CX);pg.evaluate("a=>__nb.indice('Dinheiro','O dinheiro da loja',a)",ITD);pg.evaluate(GER);w(300);R['ind']=foto(pg,'ind');pD=ctr(pg,NAVDIN);b.close()
  b,pg,w=ab(pw,CX);pg.evaluate("()=>__nb.vers('Dinheiro')");w(300);R['cx']=foto(pg,'cx');pg.evaluate("()=>__nb.rolar('Caixa')");w(400);R['cxr']=foto(pg,'cxr');b.close()
  b,pg,w=ab(pw,["()=>__LF.setView('vendas')"]);R['ven']=foto(pg,'ven');b.close()
  b,pg,w=ab(pw,[]);R['ini']=foto(pg,'ini')
  pH=ctr(pg,"document.querySelector('#v-inicio [data-id=hoje]')");pC=ctr(pg,"document.querySelector('#v-inicio [data-id=cli]')");b.close()
  b,pg,w=ab(pw,DS);pg.evaluate("()=>{__nb.vers('Resultados');__nv.trocaSimb(/^Este mês/,'›')}");w(300);R['ds']=foto(pg,'ds');b.close()
  b,pg,w=ab(pw,["()=>__LF.setView('clientes')"]);R['cli0']=foto(pg,'cli0');b.close()
  # 5: janela Grupo hoje (no meio) × proposta (de baixo)
  b,pg,w=ab(pw,CX);pg.evaluate("()=>__LF.ACT.grpGerirV('g:din')");w(900);R['g0']=foto(pg,'g0');pg.evaluate("a=>__nb.indice('Dinheiro','O dinheiro da loja',a)",ITD)
  pg.evaluate(r"""()=>{const t=[...document.querySelectorAll('*')].find(x=>x.offsetHeight&&x.childNodes.length&&[...x.childNodes].some(n=>n.nodeType==3&&n.nodeValue.trim()=='Grupo'));let c=t;while(c&&!(getComputedStyle(c).borderTopLeftRadius!='0px'&&c.getBoundingClientRect().width<innerWidth-10))c=c.parentElement;
   const P=(k,v)=>c.style.setProperty(k,v,'important');[['position','fixed'],['left','0'],['right','0'],['bottom','0'],['top','auto'],['margin','0'],['width','100%'],['max-width','none'],['transform','none'],['border-radius','24px 24px 0 0'],['border-left','0'],['border-right','0'],['border-bottom','0'],['padding-top','28px'],['padding-bottom','32px']].forEach(q=>P(q[0],q[1]));
   c.insertAdjacentHTML('afterbegin','<span style="position:absolute;top:10px;left:50%;width:36px;height:4px;margin-left:-18px;border-radius:2px;background:var(--line2)"></span>');
   const ic=t.previousElementSibling;if(ic&&ic.querySelector('svg'))ic.style.display='none';
   [...c.querySelectorAll('*')].filter(x=>x.children.length==0&&x.textContent.trim()=='Dinheiro'&&x.tagName!='INPUT').slice(0,1).forEach(x=>x.textContent='Caixa');c.querySelectorAll('input').forEach(i=>{const Q=(k,v)=>i.style.setProperty(k,v,'important');[['background','transparent'],['border','0'],['border-bottom','1px solid var(--line2)'],['border-radius','0'],['padding-left','0'],['padding-right','0'],['box-shadow','none']].forEach(q=>Q(q[0],q[1]))})}""");w(400);R['g1']=foto(pg,'g1');b.close()
  # 6: nomes — hoje e proposta
  b,pg,w=ab(pw,CX);R['cx0']=foto(pg,'cx0');b.close()
  b,pg,w=ab(pw,RS);R['rs0']=foto(pg,'rs0');pg.evaluate("()=>__nb.vers('Caixa')");w(300);R['rs1']=foto(pg,'rs1');b.close()
  b,pg,w=ab(pw,CX);pg.evaluate("()=>{__nb.vers('Dinheiro');const e=[...document.querySelectorAll('button,[data-act]')].find(x=>/^Livre e reservado/.test(x.innerText.trim())&&x.offsetHeight);const tw=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let t;while(t=tw.nextNode()){if(/Livre e reservado/.test(t.nodeValue))t.nodeValue=t.nodeValue.replace('Livre e reservado','Reservas')}}");w(300);R['cx6']=foto(pg,'cx6');b.close()
  # 7: cabeçalho único — mede o do Caixa e aplica no Dashboard
  b,pg,w=ab(pw,["()=>__LF.setView('ajustes')"]);R['aj']=foto(pg,'aj');ref=pg.evaluate("()=>{const h=__nv.tit(),c=h.parentElement.querySelector('.crumb');const cs=getComputedStyle(h);const r=document.createRange();r.selectNodeContents(h);const L=r.getClientRects()[0];return {fs:cs.fontSize,ff:cs.fontFamily,fw:cs.fontWeight,top:L.top,gap:c.getBoundingClientRect().top-h.getBoundingClientRect().bottom,cfs:getComputedStyle(c).fontSize}}");b.close()
  b,pg,w=ab(pw,DS);pg.evaluate("ref=>{__nb.vers('Resultados');__nv.trocaSimb(/^Este mês/,'›');const h=__nv.tit(),d=h.closest('.dHd'),s=d.nextElementSibling;h.style.setProperty('font-size',ref.fs,'important');h.style.setProperty('font-family',ref.ff,'important');h.style.setProperty('font-weight',ref.fw,'important');d.style.setProperty('margin-bottom','0','important');d.style.setProperty('padding-bottom','0','important');s.style.setProperty('font-size',ref.cfs,'important');s.style.setProperty('margin-top','0','important');const g=s.getBoundingClientRect().top-h.getBoundingClientRect().bottom;s.style.setProperty('margin-top',(ref.gap-g)+'px','important');const p=d.querySelector('.dHdP');if(p){const rr=document.createRange();rr.selectNodeContents(h);const L=rr.getClientRects()[0],pr=p.getBoundingClientRect();p.style.setProperty('transform','translateY('+((L.top+L.height/2)-(pr.top+pr.height/2)).toFixed(1)+'px)','important')}}",ref);w(300);R['ds7']=foto(pg,'ds7');print('7 alin',[x for x in pg.evaluate(A2)][:3]);b.close()
  # 8: PC e tablet — índice vira a coluna da esquerda
  NAV=r"""(a)=>{const [ic,ativo,larg]=a;const n=document.querySelector('#mainnav');const logo=n.querySelector('img,svg.logo,.logo');const lg=(n.querySelector('.mnLogo,.brand')||{}).outerHTML||'';
   const grp=[['','',[['Início',ic['Início']],['Vender',ic['Vender']]]],['PEÇAS','',[['Inventário',ic['Peças']],['Estúdio','<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>']]],['DINHEIRO','',[['Caixa',ic['Dinheiro']],['Despesas',ic['Despesas']],['Câmbio',ic['Câmbio']]]],['RESULTADOS','',[['Dashboard',ic['Dashboard']],['Histórico',ic['Histórico']]]],['LOJA','',[['Pedidos',ic['Pedidos']],['Clientes',ic['Clientes']]]]];
   let h='<div style="height:'+(larg?20:8)+'px"></div>';grp.forEach(g=>{if(g[0])h+='<div style="font-size:12px;font-weight:600;letter-spacing:1.68px;color:var(--mute);margin:16px 0 4px 24px">'+g[0]+'</div>';g[2].forEach(it=>{const on=it[0]==ativo;h+='<div style="display:flex;align-items:center;gap:16px;min-height:44px;padding:0 24px;color:'+(on?'var(--accent-fg)':'var(--fg)')+';font-size:15px;font-weight:'+(on?600:400)+'"><span style="width:22px;display:flex;color:'+(on?'var(--accent-fg)':'var(--mute)')+'">'+(it[1]||'')+'</span>'+it[0]+'</div>'})});
   h+='<div style="height:72px"></div><div style="position:sticky;bottom:0;background:var(--panel);border-top:1px solid var(--line2);display:flex;align-items:center;gap:16px;min-height:56px;padding:0 24px;color:var(--fg);font-size:15px"><span style="width:22px;display:flex;color:var(--mute)">'+ic['Ajustes']+'</span>Ajustes</div>';
   const keep=[...n.children].find(x=>x.querySelector&&x.querySelector('img,svg')&&/LA FOUCH|lafouch/i.test(x.outerHTML)&&x.offsetTop<90);
   n.style.setProperty('overflow-y','auto','important');n.style.setProperty('display','block','important');if(larg){const P=(k,v)=>n.style.setProperty(k,v,'important');[['position','fixed'],['left','0'],['top','0'],['bottom','0'],['right','auto'],['width',larg+'px'],['height','100vh'],['display','block'],['border-top','0'],['border-right','1px solid var(--line2)']].forEach(q=>P(q[0],q[1]));document.body.style.setProperty('padding-left',larg+'px','important')}
   const lgH=keep?keep.outerHTML:'';n.innerHTML=h;if(keep){n.prepend(keep)}if(larg){const L=[...document.querySelectorAll('img,svg')].find(x=>{const r=x.getBoundingClientRect();return r.top<120&&r.width>80&&!n.contains(x)});if(L){const box=L.closest('a,div')||L;const cl=box.cloneNode(true);cl.style.cssText='display:flex;justify-content:center;padding:28px 0 4px';cl.querySelectorAll('img,svg').forEach(x=>{x.style.setProperty('width','104px','important');x.style.setProperty('height','auto','important')});n.prepend(cl);box.style.setProperty('visibility','hidden','important')}const m=document.querySelector('.main')||document.querySelector('main');document.querySelectorAll('.view').forEach(v=>{if(v.offsetHeight){v.style.setProperty('padding-left','32px','important');v.style.setProperty('padding-right','32px','important')}})}}"""
  icm={}
  for x in json.load(open('/home/claude/lafouch/work/s434/pcnav.json')): icm[x[1]]=(x[2] or '').replace('<svg','<svg width="20" height="20"',1)
  for a,larg in (('pc',0),('tablet',260)):
    b,pg,w=ab(pw,CX,a);R[a+'0']=foto(pg,a+'0')
    pg.evaluate(NAV,[icm,'Caixa',larg]);pg.evaluate("()=>__nv.semChv()");w(400);R[a+'1']=foto(pg,a+'1');b.close()
# ---- quadros ----
quadro('147-1-tocar-de-novo.jpg','Navegação · 1 · tocar de novo na aba de baixo',[BASE,'Dentro do Caixa (rolado), tocar de novo em "Dinheiro" volta ao índice. No índice, tocar de novo sobe para o topo.'],[('NO CAIXA, TOCA "DINHEIRO"',toque(R['cxr'],pD,T+'t1.png')),('VOLTA AO ÍNDICE',R['ind'])])
quadro('147-2-lembrar-onde-parou.jpg','Navegação · 2 · cada aba lembra onde parou',[BASE,'Você está no Caixa, vai em Vender e volta em "Dinheiro": abre o Caixa, não o índice.'],[('NO CAIXA',R['cx']),('VAI EM VENDER E TOCA "DINHEIRO"',toque(R['ven'],pD,T+'t2.png')),('VOLTA NO CAIXA',R['cx'])])
quadro('147-2b-voltar-do-android.jpg','Navegação · 2 · botão voltar do Android',[BASE,'O voltar do Android faz o mesmo que "‹": 1º fecha a janela aberta (se houver) · 2º volta uma tela na pilha · no índice volta ao Início · no Início pergunta "Sair do app?".'],[('NO CAIXA · VOLTAR',R['cx']),('ÍNDICE · VOLTAR',R['ind']),('INÍCIO',R['ini'])])
quadro('147-3-atalho-do-inicio.jpg','Navegação · 3 · atalho do Início abre a tela direto',[BASE,'Tocar o atalho do Dashboard no Início abre direto o Dashboard, já com "‹ RESULTADOS" para ir ao índice do grupo.'],[('INÍCIO',toque(R['ini'],pH,T+'t3.png')),('DASHBOARD',R['ds'])])
quadro('147-4-tela-sem-grupo.jpg','Navegação · 4 · tela sem grupo',[BASE,'Clientes não está em grupo: abre direto, sem índice e sem versalete. Igual a hoje.'],[('INÍCIO',toque(R['ini'],pC,T+'t4.png')),('CLIENTES',R['cli0'])])
quadro('147-5-gerenciar-grupo.jpg','Navegação · 5 · Gerenciar grupo',[BASE,'"Gerenciar grupo ›" fica discreto no fim do índice. A janela de editar passa a ser a de baixo (P2): alça, campo em linha (P3), sem ícone no título.'],[('ÍNDICE',R['ind']),('HOJE · NO MEIO',R['g0']),('PROPOSTA · DE BAIXO',R['g1'])])
quadro('147-6-um-nome-so.jpg','Navegação · 6 · um nome só por tela',[BASE,'O nome é o do título. Hoje o link diz "Livre e reservado ›" e a tela se chama "Reservas"; na proposta o link diz "Reservas ›" e a tela tem "‹ CAIXA". (Na janela de troca, o Caixa aparece como "Dinheiro"; no índice passa a ser "Caixa".)'],[('HOJE · CAIXA',R['cx0']),('HOJE · RESERVAS',R['rs0']),('PROPOSTA · CAIXA',R['cx6']),('PROPOSTA · RESERVAS',R['rs1'])])
quadro('147-7-cabecalho-unico.jpg','Navegação · 7 · cabeçalho único',[BASE,'O Dashboard passa a usar o cabeçalho das outras telas (como Ajustes): mesma letra e tamanho do título, mesma distância até a frase, período no centro do título.'],[('HOJE · DASHBOARD',R['ds']),('PROPOSTA · DASHBOARD',R['ds7']),('REFERÊNCIA · AJUSTES',R['aj'])])
def vert(arq,titulo,sub,a,b2):
  A=Image.open(a).convert('RGB');B=Image.open(b2).convert('RGB');w,h=A.size;g=40;S=Image.new('RGB',(w+2*g,240+2*(h+70)+g),'#f1eef0');d=ImageDraw.Draw(S)
  fs=34
  while ImageDraw.Draw(Image.new('RGB',(4,4))).textlength(titulo,font=F(fs,True))>w and fs>18: fs-=2
  d.text((g,30),titulo,font=F(fs,True),fill='#1d1418');y=82
  for l in sub:
    q=''
    for p in l.split(' '):
      if d.textlength((q+' '+p).strip(),font=F(22))>w and q: d.text((g,y),q,font=F(22),fill='#4a3f45');y+=32;q=p
      else: q=(q+' '+p).strip()
    d.text((g,y),q,font=F(22),fill='#4a3f45');y+=32
  y=max(y+20,200)
  for i,(im,l) in enumerate(((A,'HOJE'),(B,'PROPOSTA'))):
    d.text((g,y),l,font=F(28,True),fill='#8d3a69' if i else '#1d1418');y+=44;S.paste(im,(g,y));d.rectangle([g-1,y-1,g+w,y+h],outline='#cfc6cb');y+=h+26
  S.save(O+arq,quality=90);print('ok',arq)
vert('147-8-pc.jpg','Navegação · 8 · PC: índice vira a coluna da esquerda',[BASE,'Os grupos aparecem em versalete (DINHEIRO, RESULTADOS…) com as telas e seus ícones (linhas de 44 px). A tela aberta fica rosa. Sem "‹" e sem "⌄". Se não couber, a coluna rola e Ajustes fica fixo embaixo.'],R['pc0'],R['pc1'])
vert('147-8-tablet.jpg','Navegação · 8 · Tablet: duas colunas como no PC',[BASE,'No tablet a barra de baixo vira a mesma coluna da esquerda do PC.'],R['tablet0'],R['tablet1'])
