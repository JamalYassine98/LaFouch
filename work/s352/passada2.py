# S352 · 2ª PASSADA da auditoria (aprovada 15/11 19:01): (1) o que há DENTRO de cada bloco/janela/folha que abre (58 da varredura) e (2) a ficha da peça,
# aba por aba; cruza títulos, rótulos e números com as telas (textos.json) para achar repetição. (3) mede as suspeitas. Celular; tablet e PC só a contagem.
import sys,json,os,re,glob,collections;sys.argv=['x','0'];src=open('/home/claude/lafouch/work/s352/varre2.py').read().split("R=[];n=0")[0].replace("parte=int(sys.argv[1]);sys.argv=['x'];","parte=0;")
exec(src)
TX="""()=>{const cam=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);if(s.position!=='fixed'||s.display==='none'||s.visibility==='hidden'||+s.opacity<.3)return false;const r=e.getBoundingClientRect();return r.height>90&&r.width>200&&(+s.zIndex||0)>40&&e.id!=='mainnav'}).sort((a,b)=>(+getComputedStyle(b).zIndex||0)-(+getComputedStyle(a).zIndex||0))[0];
 const esc=cam||[...document.querySelectorAll('.view')].find(e=>e.offsetParent);const o=[];const w=document.createTreeWalker(esc,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const t=n.textContent.replace(/\\s+/g,' ').trim();if(t.length<4)continue;const e=n.parentElement;if(!e||!e.offsetParent||e.closest('svg,script,style,.pcard,#rows,#vRows'))continue;const s=getComputedStyle(e);const fs=parseFloat(s.fontSize),fw=+s.fontWeight||400;
 o.push([t.slice(0,90),(fs>=17||(/serif|display/i.test(s.fontFamily)&&fs>=15))?'T':(fw>=600?'B':(/uppercase/.test(s.textTransform)?'L':'t'))])}return {cam:!!cam,o}}"""
V=[];
for f in sorted(glob.glob('/home/claude/lafouch/work/s352/varre2-*.json')): V+=json.load(open(f))
AB=[r for r in V if r['r'] in('abriu','mudou') and len(r['caminho'])==1]
T={x[0]:x for x in TELAS};OUT={}
with sync_playwright() as pw:
    for r in AB:
        t=T.get(r['tela'])
        if not t: continue
        try:
            pg=vai(pw,t);o=pg.evaluate(JS,True)['o'];k=[c['k'] for c in o if c['t']==r['caminho'][0]]
            if not k: continue
            a=set(x[0] for x in pg.evaluate(TX)['o']);toca(pg,k[0]);pg.wait_for_timeout(500);d=pg.evaluate(TX)
            novo=[x for x in d['o'] if d['cam'] or x[0] not in a]
            if novo: OUT[r['tela']+' › '+r['caminho'][0][:34]]=novo
        except Exception as e: print('erro',r['tela'],r['caminho'][0][:30],str(e)[:60],flush=True)
    # ficha da peça, aba por aba
    try:
        pg=vai(pw,T['Inventário']);pg.query_selector_all('#v-estoque .pcard')[2].evaluate('e=>e.click()');pg.wait_for_timeout(1300)
        abas=pg.evaluate("()=>[...document.querySelectorAll('#detail .fnTab')].filter(e=>e.offsetParent&&!e.classList.contains('fnLk')).map(e=>e.innerText.trim())")
        for i,a in enumerate(abas):
            pg.evaluate("i=>[...document.querySelectorAll('#detail .fnTab')].filter(e=>e.offsetParent&&!e.classList.contains('fnLk'))[i].click()",i);pg.wait_for_timeout(900)
            pg.evaluate("()=>document.querySelectorAll('#detail details:not([open])>summary').forEach(e=>e.click())");pg.wait_for_timeout(400)
            OUT['Ficha da peça › aba '+a]=pg.evaluate("()=>{const esc=document.getElementById('detail');const o=[];const w=document.createTreeWalker(esc,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const t=n.textContent.replace(/\\s+/g,' ').trim();if(t.length<4)continue;const e=n.parentElement;if(!e||!e.offsetParent)continue;const s=getComputedStyle(e);const fs=parseFloat(s.fontSize),fw=+s.fontWeight||400;o.push([t.slice(0,90),(fs>=17)?'T':(fw>=600?'B':(/uppercase/.test(s.textTransform)?'L':'t'))])}return o}")
    except Exception as e: print('ficha erro',str(e)[:80])
    # suspeitas
    S_={}
    try:
        pg=vai(pw,T['Início']);S_['inicio']=pg.evaluate("()=>[...document.querySelectorAll('#v-inicio [data-id],#v-inicio [data-act]')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('data-act')||'')+':'+(e.getAttribute('data-id')||'')+' «'+e.innerText.replace(/\\s+/g,' ').slice(0,44)+'»')")
        for nome,rx in (('Guardião','^Guardião'),('Pendências','^Pendências'),('Fornecedores','^Fornecedores'),('Estúdio','^Estúdio'),('Loja online','^Loja online'),('Pedidos online','^Pedidos online'),('Contagem','^Contagem'),('Giro','^Giro'),('sino','')):
            pg=vai(pw,T['Início'])
            if nome=='sino': r=pg.evaluate("()=>{const b=document.querySelector('#bell,.bell,[data-act=notif],[aria-label*=otifica]');if(!b)return 'sem';b.click();return 'ok'}")
            else:
                pg.evaluate("()=>{const L=window.__LF;L.S.inicioFant=true;L.render()}");pg.wait_for_timeout(500)
                r=pg.evaluate("rx=>{const b=[...document.querySelectorAll('#v-inicio button,#v-inicio [data-act]')].filter(e=>e.offsetParent&&new RegExp(rx).test(e.innerText.trim()))[0];if(!b)return 'sem atalho';b.click();return 'ok'}",rx)
            pg.wait_for_timeout(1200);S_[nome]=[r]+pg.evaluate("()=>{const L=window.__LF;const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent);const cam=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);return s.position==='fixed'&&s.display!=='none'&&+s.opacity>.3&&e.getBoundingClientRect().height>150&&(+s.zIndex||0)>40}).pop();return [L.S.view,L.S.dTab||'',(v&&(v.querySelector('h1')||{}).innerText)||'',cam?(cam.innerText||'').replace(/\\s+/g,' ').slice(0,60):'',(v&&v.querySelector('.nav .on,.lfAbas .on,.chip.on')||{}).innerText||'']}")
    except Exception as e: print('suspeitas erro',str(e)[:90])
    B[0].close()
json.dump({'dentro':OUT,'suspeitas':S_},open('/home/claude/lafouch/work/s352/passada2.json','w'),ensure_ascii=False,indent=0)
print('blocos lidos:',len(OUT));print(json.dumps(S_,ensure_ascii=False)[:1800])
