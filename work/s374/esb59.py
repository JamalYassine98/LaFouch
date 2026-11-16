# S374 · esboço 59 (opção A do dono, 16/11 10:00): Início com 6 botões — Resultados, Giro e preços, Site, Marketing, Clientes, Atacado.
# 59a Início Hoje × Proposta · 59b a flecha das 4 famílias novas. App real (só o estado dos grupos muda); claro e escuro; olho.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s374/'
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
SEIS="""()=>{const L=window.__LF,S=L.S;S.grupos=S.grupos.filter(g=>!['g:site','g:cli'].includes(g.id));
 S.grupos.push({id:'g:res',nome:'Resultados',ico:'hoje',fam:1,frase:'Dia, mês e histórico',itens:['hoje','hist']},
   {id:'g:gp',nome:'Giro e preços',ico:'giro',fam:1,frase:'Giro, preços e reservas',itens:['giro','prec','din']},
   {id:'g:site',nome:'Site',ico:'onl',fam:1,frase:'Pedidos, mensagens e analisador',itens:['site','ped','msg','anl']},
   {id:'g:mkt',nome:'Marketing',ico:'mkt',fam:1,frase:'Posts, vídeos e temática',itens:['mkt','tem']});
 S.inicioT=['g:res','g:gp','g:site','g:mkt','cli','ata'];L.render();return S.inicioT}"""
def quadros(nome,titulo,sub,ims,rots):
    ims=[Image.open(x).convert('RGB') for x in ims];w_,h_=ims[0].size;g=40;S=Image.new('RGB',(g+len(ims)*(w_+g),300+h_+g),'#f1eef0');d=ImageDraw.Draw(S);d.text((g,34),titulo,font=F(40,True),fill='#1d1418')
    for i,l in enumerate(sub): d.text((g,96+i*36),l,font=F(25),fill='#55484f')
    for i,(im,r) in enumerate(zip(ims,rots)):
        x=g+i*(w_+g);d.text((x,236),r,font=F(32,True),fill='#8d3a69');S.paste(im,(x,290));d.rectangle([x-1,289,x+w_,290+h_],outline='#cfc6cb')
    S.save(comum.OUT+nome,quality=88);print(' ',nome,S.size)
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(1800)
            if prop: oo.append(olho(pg));print('  ',pg.evaluate(SEIS));w(800)
            p=T+'s59_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
        print('59a',tema,'achados novos:',novos(oo[0]|oo[1],oo[2]))
        prancha('59a-app-inicio-seis-botoes-%s.jpg'%tema,'App · Início com 6 botões · tema '+tema,['Hoje: Dashboard, Site e Clientes (as outras famílias estão na barra).','Proposta (opção A): Resultados (dia, mês, histórico) · Giro e preços (giro, preços, reservas) · Site (pedidos, mensagens, analisador) · Marketing (marketing, temática) · Clientes · Atacado. A barra não muda.'],*fs)
        qs=[]
        for gid,prep in (('g:res',"()=>{const L=window.__LF;L.S.dTab='hoje';L.setView('dash')}"),('g:gp',"()=>{const L=window.__LF;L.S.dTab='giro';L.setView('dash')}"),('g:site',"()=>window.__LF.setView('site')"),('g:mkt',"()=>window.__LF.inicioGo?0:0")):
            b,pg,w=ap.abre(pw,'inicio',esc);w(1500);pg.evaluate(SEIS);w(500)
            if gid!='g:mkt': pg.evaluate(prep)
            w(1400);print('  ',gid,pg.evaluate("()=>[window.__LF.S.view,window.__LF.S._gAt]"))
            if gid=='g:mkt': pg.evaluate("()=>{window.__LF.S._gAt='g:mkt';window.__LF.ACT.grpVer()}")
            else: pg.evaluate("()=>window.__LF.ACT.grpVer()")
            w(800)
            p=T+'s59f_%s_%d.png'%(gid[2:],esc);pg.screenshot(path=p);qs.append(p);b.close()
        quadros('59b-app-flecha-das-familias-novas-%s.jpg'%tema,'App · a flecha das famílias novas · tema '+tema,['Tocar no título com a flecha abre as outras telas da família (como hoje). Clientes e Atacado abrem direto, sem flecha.','Marketing e Temática abrem em janela: tocar em Marketing no Início abre esta lista para escolher.','"Gerenciar grupo" continua tirando ou pondo telas.'],qs,['RESULTADOS','GIRO E PREÇOS','SITE','MARKETING'])
