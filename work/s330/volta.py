# S330: o que o site faz ao ir para segundo plano e VOLTAR (simulado: visibilitychange). Conta quanto da página é refeito e quadros longos. Só leitura.
# Limite: no kit a rede da loja é cortada (sem busca de estoque real) e o simulador não descarta fotos da memória como o Android faz.
import sys;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
from playwright.sync_api import sync_playwright
kit.prep_site();kit.serve(kit.SITE,kit.PS)
M="""()=>{window.__m={mut:0,nos:0,longos:[],maior:0,alvos:{}};new MutationObserver(l=>{l.forEach(x=>{window.__m.mut++;window.__m.nos+=x.addedNodes.length;const k=(x.target.id||x.target.className||x.target.tagName)+'';window.__m.alvos[k.slice(0,30)]=(window.__m.alvos[k.slice(0,30)]||0)+1})}).observe(document.body,{childList:true,subtree:true});
 let u=performance.now();const f=t=>{const d=t-u;u=t;if(d>34)window.__m.longos.push(Math.round(d));window.__m.maior=Math.max(window.__m.maior,Math.round(d));requestAnimationFrame(f)};requestAnimationFrame(f)}"""
V="""(h)=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>h});Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>h?'hidden':'visible'});document.dispatchEvent(new Event('visibilitychange'));if(!h){window.dispatchEvent(new Event('focus'));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:false}))}}"""
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
    c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg=c.new_page();pg.goto('http://localhost:8811/?kit=1');pg.wait_for_timeout(2500)
    print('animações rodando com a página parada:',pg.evaluate("()=>document.getAnimations().filter(a=>a.playState==='running').length"),'· sem fim:',pg.evaluate("()=>document.getAnimations().filter(a=>a.playState==='running'&&a.effect&&a.effect.getTiming().iterations===Infinity).length"))
    pg.evaluate(M);pg.wait_for_timeout(4000);print('PARADO 4 s (ninguém toca):',pg.evaluate("()=>{const m=window.__m;const r={mutacoes:m.mut,nos_criados:m.nos,quadros_longos:m.longos.length,maior_ms:m.maior,onde:Object.entries(m.alvos).sort((a,b)=>b[1]-a[1]).slice(0,5)};m.mut=0;m.nos=0;m.longos=[];m.maior=0;m.alvos={};return r}"))
    pg.evaluate(V,True);pg.wait_for_timeout(4000)
    print('em segundo plano, animações ainda rodando:',pg.evaluate("()=>document.getAnimations().filter(a=>a.playState==='running').length"))
    pg.evaluate("()=>{const m=window.__m;m.mut=0;m.nos=0;m.longos=[];m.maior=0;m.alvos={}}");pg.evaluate(V,False);pg.wait_for_timeout(3000)
    print('VOLTOU, 3 s:',pg.evaluate("()=>{const m=window.__m;return {mutacoes:m.mut,nos_criados:m.nos,quadros_longos:m.longos,maior_ms:m.maior,onde:Object.entries(m.alvos).sort((a,b)=>b[1]-a[1]).slice(0,6)}}"))
    b.close()
