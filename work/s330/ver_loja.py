# S331: confere o MODO LOJA implementado (app real + cópia nova do site): topo, barra com peças, peça aberta, fim da página, espanhol, larguras.
import sys,os,json;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
from playwright.sync_api import sync_playwright
kit.serve(os.path.join(kit.RAIZ,'www'),kit.PA);T='/tmp/s330/'
MED="""()=>{const v=e=>{if(!e)return null;const r=e.getBoundingClientRect(),c=getComputedStyle(e);return (c.display==='none'||r.height<2)?null:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]};const q=s=>v(document.querySelector(s));
 const p=document.getElementById('lojap');return {barra:q('#lojab'),botao:q('#lojap'),texto:p?p.innerText.replace(/\\n/g,' | '):'',corta:p?p.scrollWidth>p.clientWidth+1:null,busca:q('#sbtn'),logo:q('.top .logo'),faixa:q('#home>.htr'),lojistas:q('#home>.hata'),novidades:q('#home>section.hnews'),rodape:q('#home>.lfft'),ajuda:q('.hgu.hcom [data-gpan=como]'),guias:document.querySelectorAll('.hgu.hcom>*').length,comprar:q('#layer .buyrow'),alt:document.documentElement.scrollHeight,larg:innerWidth}}"""
R=[]
with sync_playwright() as pw:
    for W,H,lang in ((390,844,'pt'),(360,740,'es'),(820,1180,'pt'),(1366,768,'pt')):
        b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox']);c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=2 if W<900 else 1,is_mobile=W<900,has_touch=W<900)
        c.add_init_script("try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang',%r)}catch(e){}"%lang)
        pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:120]))
        pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(900)
        pg.evaluate("()=>{window.__LF.setView('vendas')}");pg.wait_for_timeout(500);pg.evaluate("()=>{const x=document.querySelector('[data-act=mcLiga]');x&&x.click()}");pg.wait_for_timeout(3500)
        fr=[f for f in pg.frames if 'loja.html' in f.url][0]
        if lang=='es': fr.evaluate("()=>{try{LFI.set&&LFI.set('es')}catch(e){}}");pg.wait_for_timeout(600)
        m0=fr.evaluate(MED);pg.screenshot(path=T+'L%d_0.png'%W)
        # abre a 1ª peça e toca "Quero este" duas vezes
        fr.evaluate("()=>{const c=document.querySelector('#home [data-open],[data-open]');c&&c.click()}");pg.wait_for_timeout(1500)
        fr.evaluate("()=>{const a=document.querySelector('#layer [data-addm]');a&&a.click()}");pg.wait_for_timeout(500);fr.evaluate("()=>{const a=document.querySelector('#layer [data-addm]');a&&a.click()}");pg.wait_for_timeout(900)
        m1=fr.evaluate(MED);pg.screenshot(path=T+'L%d_1.png'%W)
        tap=fr.evaluate("()=>{const r=document.querySelector('#layer .buyrow')?.getBoundingClientRect(),b=document.getElementById('lojap')?.getBoundingClientRect();return r&&b?{sobrepoe:!(b.bottom<=r.top||b.top>=r.bottom),buy:[Math.round(r.top),Math.round(r.bottom)],bar:[Math.round(b.top),Math.round(b.bottom)]}:null}")
        fr.evaluate("()=>{try{closeLayer()}catch(e){}}");pg.wait_for_timeout(900);m2=fr.evaluate(MED);pg.screenshot(path=T+'L%d_2.png'%W)
        fr.evaluate("()=>document.getElementById('lojap').click()");pg.wait_for_timeout(900);ped=fr.evaluate("()=>({painel:!!document.querySelector('#layer .lojpn'),chamar:!!document.getElementById('lojch'),barra_some:getComputedStyle(document.getElementById('lojab')).display==='none'})");pg.screenshot(path=T+'L%d_3.png'%W)
        fr.evaluate("()=>{try{closeLayer()}catch(e){};scrollTo(0,document.documentElement.scrollHeight)}");pg.wait_for_timeout(900);pg.screenshot(path=T+'L%d_4.png'%W)
        fim=fr.evaluate("()=>{const b=document.getElementById('lojap').getBoundingClientRect();const u=[...document.querySelectorAll('#home>*')].filter(e=>e.getBoundingClientRect().height>2).pop().getBoundingClientRect();return {ultimo_fim:Math.round(u.bottom),barra_topo:Math.round(b.top)}}")
        print(W,lang,'\n  sem peça:',{k:m0[k] for k in ('barra','busca','faixa','lojistas','novidades','rodape','ajuda','guias','alt')},'\n  na peça:',m1['texto'],'| corta',m1['corta'],'| sobre o Comprar:',tap,'\n  fora da peça:',m2['botao'],'| Meu pedido:',ped,'| fim:',fim,'| erros',er[:2]);b.close()
