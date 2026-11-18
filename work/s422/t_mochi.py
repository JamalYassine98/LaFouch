# S420 · teste da Mochi (104, 107–110, troca do "Leu!") — vários cenários, toques repetidos, tentativas de bugar.
# python3 t_mochi.py <porta> <W> <H> <lang>
import sys,json,time;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
porta=int(sys.argv[1]);W=int(sys.argv[2]);H=int(sys.argv[3]);lang=sys.argv[4] if len(sys.argv)>4 else 'pt-BR'
U='http://localhost:%d/'%porta
EST="""()=>{const Z=__LFGZ.Z,r=e=>{const x=document.querySelector(e);if(!x||!x.offsetParent)return null;const b=x.getBoundingClientRect();return [Math.round(b.top),Math.round(b.bottom),Math.round(b.left),Math.round(b.right)]},bt=document.querySelector('#gzbt');
return {f:Z.fase,bal:(document.querySelector('#gzbal')||{}).innerText||'',balR:r('#gzbal'),fw:r('#gzfw'),btR:r('#gzbt .gzgo'),btEsc:bt?bt.classList.contains('ppesc'):null,btTxt:bt?bt.innerText:'',trava:Z.ppTrava,res:Z.fase==='res'}}"""
def sobrep(a,b):
    return a and b and not(a[1]<=b[0] or b[1]<=a[0] or a[3]<=b[2] or b[3]<=a[2])
def chega_pp(pg,dist=30):
    w=pg.wait_for_timeout
    pg.evaluate("()=>{window.__dist=%d;window.__lfGzAbre()}"%dist);w(2500);pg.click('#gzcom')
    pg.wait_for_function("()=>__LFGZ.Z.fase==='teste'",timeout=90000);w(2500)
    pg.evaluate('()=>{__LFGZ.Z.falando=0;__LFGZ.pp(2)}');pg.wait_for_function("()=>__LFGZ.Z.fase==='pp'",timeout=20000)
res={}
def cen(nome,fn):
    with sync_playwright() as p:
        b,pg,er=base.abre(p,lang=lang,W=W,H=H,ls={'t_perm':'granted'})
        pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        pg.add_init_script("sessionStorage.setItem('lf_ni','1')")
        pg.goto(U);pg.wait_for_timeout(3500)
        try:out=fn(pg)
        except Exception as e:out={'ERRO':str(e)[:300]}
        out['erros_js']=er[:5];res[nome]=out;print(nome,json.dumps(out,ensure_ascii=False)[:900],flush=True);b.close()
def amostra(pg,seg):
    L=[]
    for i in range(seg*2):
        pg.wait_for_timeout(500);e=pg.evaluate(EST);L.append(e)
    return L
# A: aproxima de 30 para 21 e PARA → mede sozinho ("Pronto, medi!")
def A(pg):
    chega_pp(pg);L=amostra(pg,3)
    for d in range(30,20,-1):
        pg.evaluate("()=>window.__dist=%d"%d);pg.wait_for_timeout(250)
    L+=amostra(pg,9)
    bal=[x['bal'][:40] for x in L];bate=[i for i,x in enumerate(L) if sobrep(x['balR'],x['fw'])]
    return {'falas':sorted(set(bal)),'bal_bate_quadro':bate,'fim':L[-1]['f'],'bt_escondido_no_inicio':L[0]['btEsc'],'bt_aparece':any(x['btEsc']==False for x in L),'audios':[f for f in pg.evaluate('()=>__al.map(x=>x.f)') if '10_' in f or '4_03' in f]}
# B: toca Embaçou 8 vezes seguidas, rápido → uma trava só
def B(pg):
    chega_pp(pg);pg.wait_for_function("()=>{const b=document.querySelector('#gzbt');return b&&!b.classList.contains('ppesc')}",timeout=30000);pg.wait_for_timeout(700)
    n=0
    for i in range(8):
        try:pg.click('#gzbt .gzgo',timeout=800,force=True);n+=1
        except Exception:pass
        pg.wait_for_timeout(60)
    L=amostra(pg,8);return {'toques':n,'falas':sorted(set(x['bal'][:40] for x in L)),'fim':L[-1]['f']}
# C: chega a 15 cm sem parar → "Não embaçou?" (continua andando)
def C(pg):
    chega_pp(pg);pg.wait_for_timeout(2000)
    for d in [29,27,25,23,21,19,17,15,14,13,13,12,12,12]:
        pg.evaluate("()=>window.__dist=%d"%d);pg.wait_for_timeout(300)
    L=amostra(pg,8);return {'falas':sorted(set(x['bal'][:40] for x in L)),'fim':L[-1]['f']}
# D: toca o botão escondido antes de aparecer (via JS) → nada acontece
def D(pg):
    chega_pp(pg);pg.wait_for_timeout(300)
    esc=pg.evaluate("()=>document.querySelector('#gzbt').classList.contains('ppesc')")
    try:pg.click('#gzbt .gzgo',timeout=800)
    except Exception as e:pass
    pg.wait_for_timeout(1500);e=pg.evaluate(EST);return {'escondido':esc,'fase':e['f'],'trava':e['trava'],'bal':e['bal'][:50]}
# E: fica parado em 30 cm desde o começo (não aproximou 5 cm) → NÃO mede sozinho; no fim de 25 s conclui
def E(pg):
    chega_pp(pg);L=amostra(pg,12);return {'fases':sorted(set(x['f'] for x in L)),'falas':sorted(set(x['bal'][:40] for x in L))}
# F: fecha a consulta no meio da etapa e abre de novo → sem erro, etapa recomeça limpa
def F(pg):
    chega_pp(pg);pg.wait_for_timeout(1500)
    pg.evaluate("()=>{const x=document.querySelector('#gw [data-gz=x]');x&&x.click()}");pg.wait_for_timeout(1500)
    pg.keyboard.press('Escape');pg.wait_for_timeout(1000);aberto=pg.evaluate("()=>!!document.querySelector('#gw')")
    return {'fechou':not aberto}
# G: fecha no meio e ABRE de novo até a etapa: precisa funcionar igual (sem resto da vez anterior)
def G(pg):
    chega_pp(pg);pg.wait_for_timeout(1500);pg.evaluate("()=>document.querySelector('#gw [data-gz=x]').click()");pg.wait_for_timeout(2500)
    chega_pp(pg);L=amostra(pg,3)
    for d in range(30,20,-1):
        pg.evaluate("()=>window.__dist=%d"%d);pg.wait_for_timeout(250)
    L+=amostra(pg,9);return {'audios':[f for f in pg.evaluate('()=>__al.map(x=>x.f)') if '10_' in f],'falas':sorted(set(x['bal'][:40] for x in L)),'fim':L[-1]['f']}
SO=sys.argv[5].split(',') if len(sys.argv)>5 else 'ABCDEFG'
for k,f in [('A',A),('B',B),('C',C),('D',D),('E',E),('F',F),('G',G)]:
    if k in SO:cen(k,f)
json.dump(res,open('/tmp/t_mochi_%d_%s.json'%(W,lang),'w'),ensure_ascii=False,indent=1)
