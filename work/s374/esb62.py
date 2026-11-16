# S374 · esboço 62 (painel integrado, PASSO 2 · 1ª parte): Site › Mensagens como tela do app.
# Hoje = o painel do site dentro do app (já com o 60a aprovado: sem a caixa). Proposta = lista do app (Todas · Contato · Atacado),
# cada mensagem em linha (estado, nome, o que pediu, quando); tocar abre a folha com o texto, WhatsApp/e-mail e o estado.
# Dados de EXEMPLO (o simulador não tem a sua conta). Os mesmos dados que o painel lê (função "mensagem"). Claro e escuro; olho.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s374');sys.argv=[sys.argv[0]]
exec(open('/home/claude/lafouch/work/s374/esb60.py').read().split('with sync_playwright')[0])
from PIL import Image,ImageDraw
MSGS=[{'id':'1','tipo':'atacado','est':'novo','nome':'Óptica Sol','tel':'+595 981 222 333','pais':'Paraguai','qtd':'50','procura':['leitura','sol'],'ts':-25},
      {'id':'2','tipo':'contato','est':'novo','nome':'Ana Ruiz','email':'ana@exemplo.com','msg':'Tem o modelo gatinho em tartaruga? Retiro sábado.','ts':-140},
      {'id':'3','tipo':'contato','est':'respondido','nome':'Carlos Benítez','tel':'+595 985 111 000','msg':'Qual o prazo de entrega para Encarnación?','ts':-1500},
      {'id':'4','tipo':'atacado','est':'fechado','nome':'Ótica Vista','tel':'+55 45 99999 0000','pais':'Brasil','qtd':'120','procura':['grau'],'ts':-4300}]
TELA="""a=>{const [M,ab]=a;const v=document.getElementById('v-site');const now=Date.now();const ha=m=>{const x=Math.round(-m);return x<60?'há '+x+' min':x<1440?'há '+Math.round(x/60)+' h':(d=>'há '+d+(d===1?' dia':' dias'))(Math.round(x/1440))};
 const E={novo:['Novo','#e8b04a','#241a05'],respondido:['Respondido','var(--ok)','#06220f'],fechado:['Fechado','var(--line)','var(--mute)']};
 const sub=m=>m.tipo==='atacado'?('Atacado · quer '+m.qtd+' peças'+(m.procura?' · '+m.procura.join(', '):'')):('Contato · '+m.msg);
 const lin=m=>'<button type="button" class="ataL" data-id="'+m.id+'"><span><b>'+m.nome+'</b><small>'+sub(m)+'</small></span><span style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex:none"><em style="font-style:normal;font-size:11.5px;font-weight:700;padding:3px 8px;border-radius:999px;background:'+E[m.est][1]+';color:'+E[m.est][2]+'">'+E[m.est][0]+'</em><small style="color:var(--mute);font-size:12px">'+ha(m.ts)+'</small></span></button>';
 const n=M.filter(m=>m.est==='novo').length;
 v.innerHTML='<div class="top"><div><h1>Mensagens</h1><div class="crumb">'+n+' novas · contato e pedidos de atacado</div></div></div>'+
  '<div class="s185Seg lfAbas ataTabs" id="ataTabs" role="tablist"><button type="button" class="on">Todas <b class="ataBd">'+n+'</b></button><button type="button">Contato</button><button type="button">Atacado</button></div>'+
  '<div class="card" style="padding:2px 16px">'+M.map(lin).join('')+'</div>';
 window.__LF.render&&0;return n}"""
FOLHA="""m=>{window.__LF.ACT.grpVer();const sh=document.querySelector('#dFolha .lfa-sh');if(!sh)return 'sem';
 const at=m.tipo==='atacado';const corpo=at?['País: '+m.pais,'Quantidade: '+m.qtd,'Procura: '+m.procura.join(', ')].join('<br>'):m.msg;
 sh.innerHTML='<div class="dFt"><span>'+(at?'ATACADO':'CONTATO')+'</span></div><div style="padding:4px 4px 0"><b style="font-size:19px;display:block">'+m.nome+'</b><small style="color:var(--mute);display:block;margin-top:3px">'+(m.tel||m.email)+' · '+(m.ts>-60?'há 25 min':'há 2 h')+'</small>'+
  '<p style="margin:14px 0 16px;line-height:1.5">'+corpo+'</p><div style="display:flex;gap:10px;margin-bottom:16px">'+(m.tel?'<button type="button" class="go" style="flex:1">WhatsApp</button>':'')+(m.email?'<button type="button" class="go" style="flex:1">Responder por e-mail</button>':'')+'</div>'+
  '<div class="lbl" style="margin:0 0 8px">Estado</div><div class="s185Seg lfAbas" style="margin:0 0 6px"><button type="button" class="on">Novo</button><button type="button">Respondido</button><button type="button">Fechado</button></div></div>';return 'ok'}"""
def quadros(nome,titulo,sub,ims,rots):
    ims=[Image.open(x).convert('RGB') for x in ims];w_,h_=ims[0].size;g=40;S=Image.new('RGB',(g+len(ims)*(w_+g),330+h_+g),'#f1eef0');d=ImageDraw.Draw(S);d.text((g,34),titulo,font=F(40,True),fill='#1d1418')
    for i,l in enumerate(sub): d.text((g,96+i*36),l,font=F(25),fill='#55484f')
    for i,(im,r) in enumerate(zip(ims,rots)):
        x=g+i*(w_+g);d.text((x,266),r,font=F(32,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,320));d.rectangle([x-1,319,x+w_,320+h_],outline='#cfc6cb')
    S.save(comum.OUT+nome,quality=88);print(' ',nome,S.size)
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        b,pg,w=abre(pw,esc);pg.evaluate("()=>window.__LF.setView('site')");w(600);pg.evaluate("()=>document.querySelector('#v-site [data-id=msg]').click()");w(4500)
        pg.add_style_tag(content=CSS60);w(400);oo.append(olho(pg));p=T+'m62_0_%d.png'%esc;pg.screenshot(path=p);fs.append(p);b.close()
        for q in (1,2):
            b,pg,w=abre(pw,esc);pg.evaluate("()=>window.__LF.setView('site')");w(700);print('  ',pg.evaluate(TELA,[MSGS,0]));pg.add_style_tag(content='.top h1.grpH{min-height:44px;display:inline-flex;align-items:center;gap:6px}');w(500)
            if q==1: oo.append(olho(pg))
            if q==2: print('  ',pg.evaluate(FOLHA,MSGS[0]));w(700)
            p=T+'m62_%d_%d.png'%(q,esc);pg.screenshot(path=p);fs.append(p);b.close()
        print('62',tema,'achados novos:',novos(oo[0],oo[1]))
        quadros('62-app-site-mensagens-tela-do-app-%s.jpg'%tema,'App · Site › Mensagens como tela do app · passo 2 · tema '+tema,
          ['Hoje (já com o 60a): a página de Mensagens do painel do site dentro do app (e às vezes pede para entrar de novo). Dados de exemplo nos quadros 1 e 2.',
           'Proposta: tela do app — Todas · Contato · Atacado; cada mensagem numa linha (nome, o que pediu, estado, quando). Tocar abre a folha com o',
           'texto, WhatsApp / e-mail e o estado (Novo · Respondido · Fechado). Os mesmos dados que o painel lê; sem entrar de novo. A flecha do título',
           'continua abrindo Site, Pedidos, Mensagens e Analisador.'],fs,['HOJE','1 · A LISTA','2 · TOCAR NUMA MENSAGEM'])
