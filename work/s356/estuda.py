# S356: ESTUDO (pedido do dono 15/11 18:50) — o que o app JÁ mostra sobre "quanto separar / quanto trocar" e para onde cada toque leva.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
BL="""rx=>{const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent);const h=[...v.querySelectorAll('h2,h3,.lbl,summary,b')].find(e=>e.offsetParent&&new RegExp(rx).test((e.innerText||'').replace(/\\s+/g,' ').trim()));if(!h)return null;const c=h.closest('section,details,.card,.kpi')||h.parentElement;c.querySelectorAll('details:not([open])>summary,[aria-expanded=false]').forEach(x=>{try{x.click()}catch(e){}});
 return {txt:c.innerText.replace(/[ \\t]+/g,' ').replace(/\\n+/g,' ¶ ').slice(0,1100),acts:[...c.querySelectorAll('button,a,[data-act]')].map(e=>(e.getAttribute('data-act')||e.tagName)+':'+(e.getAttribute('data-id')||e.getAttribute('data-view')||'')+' «'+e.innerText.replace(/\\s+/g,' ').slice(0,30)+'»').slice(0,12)}}"""
with sync_playwright() as pw:
    for tela,aba,rxs in (('dash','hoje',['^Separar das vendas','^Para repor o estoque','^Colchão de segurança','^Quanto separar do que']),('dash','din',['^Livre para você','^Próximos 30 dias']),('fx','',['^REPOSIÇÃO|^Reposição']),('dia','',['^Câmbio do dia','^Fechamento do dia'])):
        b,pg,w=ap.abre(pw,'inicio',True);pg.evaluate("a=>{const L=window.__LF;if(a[1])L.S.dTab=a[1];L.setView(a[0])}",[tela,aba]);w(2600)
        if aba=='din': pg.evaluate("()=>{const b=[...document.querySelectorAll('#v-dash button')].find(e=>/Ver para onde vai/.test(e.innerText));b&&b.click()}");w(700)
        for rx in rxs:
            r=pg.evaluate(BL,rx);w(300);r=pg.evaluate(BL,rx) or r
            print('\n### %s/%s · %s'%(tela,aba,rx));print(r['txt'] if r else 'não achei');print('   toques:',r['acts'] if r else '')
        b.close()
