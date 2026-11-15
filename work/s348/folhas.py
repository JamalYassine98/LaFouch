# S348: toda folha que sobe de baixo (com a alça) tem de FECHAR ARRASTANDO PARA BAIXO (regra do dono de 08/11). Abre cada uma no app real
# e arrasta a alça 320 px para baixo com o dedo (toque de verdade); anota se fechou. Também confere tocar fora. Só leitura.
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s321');import base
from playwright.sync_api import sync_playwright
ACHA="""()=>{const c=[...document.querySelectorAll('body *')].filter(e=>{if(!e.offsetParent&&getComputedStyle(e).position!=='fixed')return false;const s=getComputedStyle(e);if(s.position!=='fixed'&&s.position!=='absolute')return false;const r=e.getBoundingClientRect();return r.width>300&&r.height>150&&r.bottom>=innerHeight-90&&r.top>60&&parseFloat(s.borderTopLeftRadius)>=12&&s.visibility!=='hidden'&&+s.opacity>.5&&e.id!=='mainnav'&&!e.closest('#mainnav')});
 const f=c.sort((a,b)=>(+getComputedStyle(b).zIndex||0)-(+getComputedStyle(a).zIndex||0))[0];if(!f)return null;f.setAttribute('data-fl','1');const r=f.getBoundingClientRect();
 const al=[...f.querySelectorAll('*')].find(e=>{const q=e.getBoundingClientRect();return q.width>=28&&q.width<=80&&q.height>=3&&q.height<=8&&q.top-r.top<24});
 return {id:f.id||f.className.toString().slice(0,40),topo:Math.round(r.top),alt:Math.round(r.height),alca:!!al,titulo:((f.querySelector('h1,h2,h3,b')||{}).innerText||'').slice(0,30)}}"""
ABERTA="()=>{const f=document.querySelector('[data-fl]');if(!f||!f.isConnected)return false;const r=f.getBoundingClientRect(),s=getComputedStyle(f);return r.height>100&&r.top<innerHeight-60&&s.display!=='none'&&s.visibility!=='hidden'&&+s.opacity>.3}"
V=lambda v:"()=>window.__LF.setView('%s')"%v
CASOS=[('Filtros do inventário','estoque',"()=>{const x=[...document.querySelectorAll('#v-estoque button')].find(b=>/Filtros e ordem/.test(b.getAttribute('aria-label')||''));x&&x.click()}"),
 ('Ajustes do catálogo','vendas',"()=>document.getElementById('cjAj').click()"),
 ('Compartilhar','vendas',"()=>{window.__LF.S.ebSel=[];const c=document.querySelector('#vRows .pcard[data-ref]');const e=[...document.querySelectorAll('#v-vendas button')].filter(e=>e.offsetParent&&/ompartilh/i.test(e.getAttribute('aria-label')||''))[0];e.click();setTimeout(()=>{c.click();setTimeout(()=>document.querySelector('#ebBar .ebGo').click(),300)},300)}"),
 ('Novo objetivo','caixa',"()=>window.__LF.ACT.cxabre('mel')"),('Retirar do caixa','caixa',"()=>window.__LF.ACT.cxabre('ret')"),('Conferir o caixa','caixa',"()=>window.__LF.ACT.cxabre('conf')"),
 ('Novo cliente','clientes',"()=>document.querySelector('[data-act=clinovo]').click()"),('Acesso atacado','clientes',"()=>document.querySelector('[data-act=ataNovo]').click()"),
 ('Lotes','clientes',"()=>document.querySelector('[data-act=ataLotes]').click()"),('Cartões','clientes',"()=>document.querySelector('[data-act=cupAbre]').click()"),
 ('Folha da peça (vender)','vendas',"()=>{const c=document.querySelector('#vRows .pcard[data-ref]');c&&c.click()}"),
 ('Atualização: confirmar','ajustes',"()=>{try{window.__LF.ACT.updagora()}catch(e){}}"),('Nova despesa','desp',"()=>{const b=[...document.querySelectorAll('#v-desp button')].find(e=>e.offsetParent&&/\\+|Nova|Adicionar/.test(e.innerText));b&&b.click()}")]
R=[]
with sync_playwright() as pw:
    for nome,tela,abre in CASOS:
        b,pg,w=base.abre(pw,tela,True);cdp=pg.context.new_cdp_session(pg)
        try:
            pg.evaluate(abre);w(1500);f=pg.evaluate(ACHA)
            if not f: R.append({'folha':nome,'abriu':False});print(nome,'— não achei folha aberta');b.close();continue
            x=195;y0=f['topo']+10
            cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y0}]})
            for k in range(1,9): cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y0+k*40}]});w(30)
            cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});w(900)
            arr=not pg.evaluate(ABERTA);fora=None
            if not arr:
                pg.touchscreen.tap(195,max(70,f['topo']-60));w(900);fora=not pg.evaluate(ABERTA)
            R.append({'folha':nome,'abriu':True,'alca':f['alca'],'fecha_arrastando':arr,'fecha_tocando_fora':fora,'el':f['id'],'titulo':f['titulo']})
            print('%-26s alça:%s · arrastar fecha:%s · tocar fora fecha:%s · (%s)'%(nome,'sim' if f['alca'] else 'NÃO','sim' if arr else 'NÃO','—' if fora is None else ('sim' if fora else 'NÃO'),f['id']))
        except Exception as e: print(nome,'ERRO',str(e)[:120])
        b.close()
json.dump(R,open('/home/claude/lafouch/work/s348/folhas.json','w'),ensure_ascii=False,indent=0)
