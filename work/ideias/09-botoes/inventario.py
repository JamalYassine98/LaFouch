"""IDEIAS 09 · inventário dos botões do site: abre todas as telas do roteiro único (o mesmo do comparador e do Argus),
junta todo botão com texto, agrupa pelo desenho (fundo, texto, borda, cantos, altura, letra) e recorta exemplos.
Base: o pacote aprovado (/tmp/a8k :8750), sem evento (fundo branco), celular 390. Uso: python3 inventario.py"""
import os, sys, json, collections
AQ = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, '/home/claude/lafouch/work/s430/comparador'); os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
import compara as C
import roteiro_site as RS
from playwright.sync_api import sync_playwright
sys.path.insert(0, '/home/claude/lafouch/work/ideias/08-menu-luxo')
exec(open('/home/claude/lafouch/work/ideias/08-menu-luxo/semev.py').read().split("nome, porta = sys.argv")[0].split("def abre(")[0])  # DATA (sem evento) e fontes()
FD = '/home/claude/lafouch/work/ideias/08-menu-luxo/fontes'  # as fontes reais (Fraunces 400/500/600) ficam no 08
URL = 'http://localhost:8750'
JS = r"""()=>{const out=[];const vis=e=>{const r=e.getBoundingClientRect();if(r.width<24||r.height<16)return false;if(r.bottom<0||r.top>innerHeight*3)return false;const c=getComputedStyle(e);return c.visibility!=='hidden'&&c.display!=='none'&&+c.opacity>0.2};
 document.querySelectorAll('button,a,[role=button],input[type=submit]').forEach((e,i)=>{if(!vis(e))return;const t=(e.innerText||e.value||'').trim().replace(/\s+/g,' ');if(!t||t.length>48)return;
  if(e.closest('#grid .card,.sor,.l9vs,.hg .card'))return;
  const c=getComputedStyle(e),r=e.getBoundingClientRect();const bw=parseFloat(c.borderTopWidth)||0;const tem_fundo=c.backgroundColor!=='rgba(0, 0, 0, 0)'&&c.backgroundColor!=='transparent';
  const rad=parseFloat(c.borderTopLeftRadius)||0;const h=Math.round(r.height);
  const forma=rad>=h/2-1?'pílula':rad>=6?'cantos '+Math.round(rad):'reto';
  const tipo=tem_fundo?'cheio':(bw>0?'contorno':'texto');
  e.setAttribute('data-inv',String(i));
  out.push({i:String(i),t,tipo,forma,fundo:tem_fundo?c.backgroundColor:'',cor:c.color,borda:bw>0?bw.toFixed(0)+'px '+c.borderTopColor:'',alt:h,letra:Math.round(parseFloat(c.fontSize))+'px '+c.fontWeight,img:c.backgroundImage!=='none'})});return out}"""
def sig(x):
    if x['tipo'] == 'texto': return ('texto', x['cor'], x['letra'])
    return (x['tipo'], x['fundo'] + (' degradê' if x['img'] else ''), x['cor'], x['borda'], x['forma'], (x['alt'] // 6) * 6, x['letra'])
G = collections.OrderedDict(); n = 0
with sync_playwright() as pw:
    b = sim.navegador(pw)
    for tela in RS.TELAS:
        c = sim.contexto(b, 390, 844, toque=True, movimento=False, csp_livre=False, camera=True)
        c.add_init_script(C.INIT); c.add_init_script(DATA)
        if tela.get('logada'): c.add_init_script(RS.LOGADA)
        c.route('**cloudfunctions.net/**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body=RS.NUVEM))
        c.route('**identitytoolkit**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body='{"users":[{"emailVerified":true,"email":"maria@exemplo.com"}]}'))
        fontes(c); pg = c.new_page()
        try: RS.vai(pg, URL, tela)
        except Exception as ex: print('falhou', tela['nome'], ex); c.close(); continue
        L = pg.evaluate(JS)
        for x in L:
            k = sig(x); g = G.setdefault(k, {'ex': [], 'telas': set(), 'textos': set(), 'x': x})
            g['telas'].add(tela['nome']); g['textos'].add(x['t'])
            if len(g['ex']) < 3 and x['t'] not in [e[1] for e in g['ex']]:
                fn = os.path.join(AQ, 'rec', 'b%03d.png' % n); n += 1
                try:
                    el = pg.query_selector('[data-inv="%s"]' % x['i']); el.scroll_into_view_if_needed(timeout=2000); pg.wait_for_timeout(150); el.screenshot(path=fn, timeout=3000); g['ex'].append((fn, x['t']))
                except Exception: pass
        print(tela['nome'], len(L)); c.close()
    b.close()
out = [{'sig': list(k), 'telas': sorted(v['telas']), 'textos': sorted(v['textos'])[:12], 'ex': v['ex'], 'x': v['x']} for k, v in G.items()]
json.dump(out, open(os.path.join(AQ, 'inventario.json'), 'w'), ensure_ascii=False, indent=1)
print('grupos', len(out))
