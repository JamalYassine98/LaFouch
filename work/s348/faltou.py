# S348: as 8 folhas que o primeiro teste não abriu — abre cada uma por um caminho próprio e arrasta/toca fora. Celular, app real.
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
ACHA="""()=>{const c=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);if(s.position!=='fixed'&&s.position!=='absolute')return false;if(s.display==='none'||s.visibility==='hidden'||+s.opacity<.5)return false;const r=e.getBoundingClientRect();if(r.width<300||r.height<140||r.height>innerHeight+4)return false;if(e.id==='mainnav'||e.closest('#mainnav')||e.classList.contains('view'))return false;if((+s.zIndex||0)<20)return false;const bg=s.backgroundColor;if(/rgba\\(0, 0, 0, 0\\)|transparent/.test(bg))return false;return r.top>=30&&r.bottom>=innerHeight-30});
 const f=c.sort((a,b)=>(+getComputedStyle(b).zIndex||0)-(+getComputedStyle(a).zIndex||0)||a.getBoundingClientRect().height-b.getBoundingClientRect().height)[0];if(!f)return null;document.querySelectorAll('[data-fl]').forEach(e=>e.removeAttribute('data-fl'));f.setAttribute('data-fl','1');const r=f.getBoundingClientRect();
 const al=[...f.querySelectorAll('*')].find(e=>{const q=e.getBoundingClientRect();return q.width>=28&&q.width<=80&&q.height>=3&&q.height<=8&&q.top-r.top<26});return {id:(f.id?'#'+f.id:'.'+(f.className+'').trim().split(/\\s+/).slice(0,2).join('.')),topo:r.top|0,alt:r.height|0,alca:!!al,titulo:((f.querySelector('h1,h2,h3,b')||{}).innerText||'').replace(/\\s+/g,' ').slice(0,30)}}"""
ABERTA="()=>{const f=document.querySelector('[data-fl]');if(!f||!f.isConnected)return false;const r=f.getBoundingClientRect(),s=getComputedStyle(f);return r.height>100&&r.top<innerHeight-60&&s.display!=='none'&&s.visibility!=='hidden'&&+s.opacity>.3}"
BT=lambda v,rx:"()=>{const b=[...document.querySelectorAll('#v-%s button,#v-%s [data-act]')].filter(e=>e.offsetParent&&/%s/i.test((e.getAttribute('aria-label')||'')+' '+e.innerText))[0];if(!b)return 'sem botão';b.click();return 'ok'}"%(v,v,rx)
CASOS=[('Filtros do inventário','estoque',[BT('estoque','Filtros e ordem')]),
 ('Compartilhar (preço)','vendas',[BT('vendas','ompartilhar'),"()=>{const c=document.querySelector('#vRows .pcard[data-ref]');c&&c.click()}","()=>{const g=document.querySelector('#ebBar .ebGo');if(!g)return 'sem barra';g.click();return 'ok'}"]),
 ('Conferir o caixa','caixa',["()=>{window.__LF.ACT.cxabre('conf');return 'ok'}"]),('Retirar do caixa','caixa',["()=>{window.__LF.ACT.cxabre('ret');return 'ok'}"]),
 ('Novo cliente','clientes',[BT('clientes','Novo cliente')]),('Cartões','clientes',[BT('clientes','Cart')]),
 ('Folha da peça','vendas',["()=>{const c=document.querySelector('#vRows .pcard[data-ref]');c&&c.click();return 'ok'}"]),
 ('Nova despesa','desp',[BT('desp','Nova|Adicionar|\\\\+')]),('Atualização','ajustes',[BT('ajustes','atualiza')])]
R=[]
with sync_playwright() as pw:
    for nome,tela,passos in CASOS:
        b,pg,w=ap.abre(pw,tela,True);cdp=pg.context.new_cdp_session(pg)
        try:
            rs=[]
            for p in passos: rs.append(pg.evaluate(p));w(900)
            w(500);f=pg.evaluate(ACHA)
            if not f: print('%-24s não subiu folha (%s)'%(nome,rs));R.append({'folha':nome,'abriu':False,'passos':rs});b.close();continue
            y0=f['topo']+10
            cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':195,'y':y0}]})
            for k in range(1,9): cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':195,'y':y0+k*40}]});w(30)
            cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});w(900);arr=not pg.evaluate(ABERTA);fora=None
            if not arr and f['topo']>80: pg.touchscreen.tap(195,f['topo']-50);w(900);fora=not pg.evaluate(ABERTA)
            R.append({'folha':nome,'abriu':True,'el':f['id'],'alca':f['alca'],'arrastar':arr,'fora':fora})
            print('%-24s %-22s alça:%s · arrastar fecha:%s · tocar fora:%s'%(nome,f['id'][:22],'sim' if f['alca'] else 'NÃO','sim' if arr else 'NÃO','—' if fora is None else ('sim' if fora else 'NÃO')))
        except Exception as e: print(nome,'ERRO',str(e)[:100])
        b.close()
json.dump(R,open('/home/claude/lafouch/work/s348/faltou.json','w'),ensure_ascii=False,indent=0)
