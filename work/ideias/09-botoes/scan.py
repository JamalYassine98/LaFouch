"""IDEIAS 09 · procura o vinho que sobrou na proposta (:8751): todo elemento visível com texto ou fundo vinho/degradê vinho, por tela. Base do inventário: dos botões do site: abre todas as telas do roteiro único (o mesmo do comparador e do Argus),
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
URL = 'http://localhost:8751'

JS = r"""()=>{const out=[];const V=/141, 58, 105|111, 34, 80|180, 82, 138|162, 68, 124|8d3a69|b4528a/;
document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.width<4||r.height<4||r.bottom<0||r.top>innerHeight)return;const c=getComputedStyle(e);if(c.visibility==='hidden'||c.display==='none'||+c.opacity<.2)return;
 const own=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());const t=(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,30);
 const vc=own&&V.test(c.color), vb=V.test(c.backgroundColor)||V.test(c.backgroundImage), vbo=V.test(c.borderTopColor)&&parseFloat(c.borderTopWidth)>0;
 if(vc||vb||vbo)out.push((vc?'cor ':'')+(vb?'fundo ':'')+(vbo?'borda ':'')+'| '+e.tagName+'.'+(typeof e.className==='string'?e.className:'')+' < '+(e.parentElement&&e.parentElement.className)+' | '+t)});return out}"""
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
        print('==', tela['nome']); [print('  ', x) for x in dict.fromkeys(pg.evaluate(JS))]
        c.close()
    b.close()
