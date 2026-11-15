# S339: teste pedido pelo dono (15/11 14:45). App real no simulador, tema escuro, celular.
# 1) juntar Inventário + Catálogo num GRUPO; 2) tocar em compartilhar sem escolher peça; 3) tentar fechar a barra "Toque nas peças";
# 4) ir ao Início e tocar em Atacado. Fotografa e mede cada passo. Só leitura.
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s321');import base
from playwright.sync_api import sync_playwright
T='/home/claude/lafouch/work/s339/';R=[]
EST="""()=>{const L=window.__LF,S=L.S,q=s=>document.querySelector(s),v=e=>{if(!e)return null;const r=e.getBoundingClientRect(),c=getComputedStyle(e);return c.display==='none'||c.visibility==='hidden'||r.height<2?null:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]};
 const b=q('#ebBar'),n=q('#ebBar .ebN'),g=q('#ebBar .ebGo'),x=q('#ebBar .ebX');const rn=n&&n.getBoundingClientRect(),rg=g&&g.getBoundingClientRect();
 const ativa=[...document.querySelectorAll('section[id^=v-],main[id^=v-],div[id^=v-]')].filter(e=>e.offsetParent&&e.getBoundingClientRect().height>50).map(e=>e.id);
 return {view:S.view,ebSel:S.ebSel===null?null:(S.ebSel||[]).length,telas_visiveis:ativa,grupo:(q('#grpTabs')||{}).innerText||'',abas_grupo:v(q('#grpTabs')),barra:b?{classe:b.className,caixa:v(b),texto:n?n.innerText:'',texto_caixa:v(n),botao_caixa:v(g),texto_em_cima_do_botao:!!(rn&&rg&&rn.right>rg.left+1),x_caixa:v(x)}:null,painel:v(q('#lojaFrame')),nav:v(q('#mainnav')),topo_em_x:(e=>e?(e.id||e.className||e.tagName):'')(b&&x?document.elementFromPoint(x.getBoundingClientRect().left+x.getBoundingClientRect().width/2,x.getBoundingClientRect().top+x.getBoundingClientRect().height/2):null)}}"""
with sync_playwright() as pw:
    b,pg,w=base.abre(pw,'inicio',True);er=[];pg.on('pageerror',lambda e:er.append(str(e)[:160]))
    def passo(nome,js=None,espera=900,foto=True):
        if js: pg.evaluate(js)
        w(espera);e=pg.evaluate(EST);e['passo']=nome;R.append(e)
        if foto: pg.screenshot(path=T+'%d-%s.png'%(len(R),nome.split(' ')[0]))
        print(len(R),nome,'\n   ',json.dumps({k:e[k] for k in ('view','ebSel','telas_visiveis','grupo','barra','painel')},ensure_ascii=False)[:520])
    passo('inicio')
    passo('grupo Inventário+Catálogo',"()=>{const L=window.__LF;L.S._gn={a:'estoque',b:'vendas'};L.ACT.grpCria()}",1500)
    passo('abrir-catalogo no grupo',"()=>{window.__LF.setView('vendas')}",1200)
    achou=pg.evaluate("()=>{const bs=[...document.querySelectorAll('#v-vendas button')].filter(e=>e.offsetParent&&/ompartilh|nviar/i.test((e.getAttribute('aria-label')||'')+(e.title||'')+(e.dataset.act||'')));return bs.map(e=>(e.getAttribute('aria-label')||e.title||'')+' ['+(e.dataset.act||'')+'] '+e.className).slice(0,6)}");print('   botões de compartilhar no Catálogo:',achou)
    passo('compartilhar sem peça',"()=>{const e=[...document.querySelectorAll('#v-vendas button')].filter(e=>e.offsetParent&&/ompartilh/i.test((e.getAttribute('aria-label')||'')+(e.title||'')))[0];e&&e.click()}",1200)
    # fechar pelo × com toque de verdade
    cx=R[-1]['barra'] and R[-1]['barra']['x_caixa']
    if cx: pg.touchscreen.tap(cx[0]+cx[2]/2,cx[1]+cx[3]/2)
    passo('tocar no × da barra',None,900)
    passo('compartilhar de novo',"()=>{const e=[...document.querySelectorAll('#v-vendas button')].filter(e=>e.offsetParent&&/ompartilh/i.test((e.getAttribute('aria-label')||'')+(e.title||'')))[0];e&&e.click()}",900,False)
    passo('ir ao Início',"()=>{window.__LF.setView('inicio')}",1200)
    passo('tocar em Atacado',"()=>{const t=[...document.querySelectorAll('#v-inicio .tl')].find(e=>/Atacado/.test(e.innerText));t&&t.click()}",2500)
    cx=R[-1]['barra'] and R[-1]['barra']['x_caixa']
    if cx: pg.touchscreen.tap(cx[0]+cx[2]/2,cx[1]+cx[3]/2)
    passo('tocar no × depois do Atacado',None,900)
    print('erros de JS:',er[:3]);json.dump(R,open(T+'passos.json','w'),ensure_ascii=False,indent=0);b.close()
