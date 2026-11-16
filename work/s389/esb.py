# S389 · esboço 56: Mochi — etapa "aproxime até embaçar" com UM botão e UM toque (dono, 16/11 17:06). Site real, celular, tema claro; só injeta o que muda.
import sys,subprocess,time,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/testes')
from comum import *
import comum,base;comum.OUT='/home/claude/lafouch/work/s389/'
from playwright.sync_api import sync_playwright
import os;os.makedirs('/tmp/s389',exist_ok=True)
A1="""()=>{const b=document.querySelector('#gzbt');b.innerHTML='<button type="button" class="gzgo" data-gz="emb">Embaçou</button>';const t=document.querySelector('#gzbal');if(t)t.textContent='Agora uma última coisa: aproxime o celular devagar e toque em Embaçou quando as letras começarem a embaçar.'}"""
A2="""()=>{const b=document.querySelector('#gzbt');b.innerHTML='<button type="button" class="gzgo" disabled style="opacity:.42;pointer-events:none">Pronto</button>';const t=document.querySelector('#gzbal');if(t)t.textContent='Pronto, medi! Pode afastar o celular.';const h=document.querySelector('.gzpph');if(h)h.textContent=''}"""
srv=subprocess.Popen(['python3','-m','http.server','8871','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2);O={}
def vai(p):
    b,pg,er=base.abre(p,W=390,H=844,ls={'t_perm':'granted'});pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.add_init_script("sessionStorage.setItem('lf_ni','1');Math.random=()=>0.42");pg.goto('http://localhost:8871/');w=pg.wait_for_timeout;w(3500);pg.evaluate("()=>{window.__dist=30;window.__lfGzAbre()}");w(2500);pg.click('#gzcom')
    pg.wait_for_function("()=>__LFGZ.Z.fase==='teste'",timeout=70000)
    w(3000);pg.evaluate('()=>__LFGZ.pp(2)')
    print('fase',flush=True) or print(pg.evaluate("()=>__LFGZ.Z.fase"));w(5000);return b,pg,w
try:
  with sync_playwright() as p:
    for nome in ('hoje','prop'):
        b,pg,w=vai(p);pg.add_style_tag(content='.mochi *{animation-play-state:paused!important}')
        if nome=='prop': pg.evaluate(A1);w(400)
        f='/tmp/s389/a_%s.png'%nome;pg.screenshot(path=f);O['a_'+nome]=olho(pg)
        if nome=='hoje':
            pg.click('#gw [data-gz=emb]');
            try: pg.wait_for_function("()=>__LFGZ.Z.ppD&&__LFGZ.Z.ppD.length===1",timeout=15000)
            except Exception as e: print('sem 2a',e)
            w(4500)
        else: pg.evaluate(A2);w(400)
        f='/tmp/s389/b_%s.png'%nome;pg.screenshot(path=f);O['b_'+nome]=olho(pg);b.close()
finally: srv.terminate()
for k in 'ab': print(k,'falhas novas do olho na proposta:',sorted(O[k+'_prop']-O[k+'_hoje'])[:4])
prancha('56a-site-mochi-embacou-um-botao.jpg','Esboço 56a · Mochi · aproximar até embaçar: ao abrir',['Hoje: dois botões (“Embaçou aqui” e “Não embaça”).','Proposta: um botão só, “Embaçou”. Se a pessoa chega bem perto e não toca, a Mochi entende sozinha que não embaça e segue.'],'/tmp/s389/a_hoje.png','/tmp/s389/a_prop.png')
prancha('56b-site-mochi-embacou-depois-do-toque.jpg','Esboço 56b · Mochi · depois do toque',['Hoje: pede “mais uma vez” (até 3 toques) e espera o celular ficar parado.','Proposta: um toque só. A Mochi usa a distância daquele instante, o botão trava e ela avisa “pode afastar”; em 1 a 2 s vem o resultado.'],'/tmp/s389/b_hoje.png','/tmp/s389/b_prop.png')
