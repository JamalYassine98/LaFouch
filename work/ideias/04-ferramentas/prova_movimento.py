"""IDEIAS 04 · protótipo (esboço) — 2 provas que o Argus de hoje NÃO faz e que pegam erros reais do dono de 22/11:
  B4 · rolar a página e abrir o menu: o topo (logo) e a faixa têm de continuar na tela.
  B5 · trocar de aba na Minha conta (logada, com pedidos e endereços): o cartão nunca pode mostrar barra de rolagem
       nem conteúdo de outra aba, EM NENHUM momento da troca (olhado a cada 40 ms).
Liga o que falta no simulador: barras do Windows visíveis (o Chromium de teste esconde) e conta de teste com dados.
Uso: python3 prova_movimento.py URL   (ex.: http://localhost:8721 = cópia do site do ar)"""
import os, sys, json, time
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
sys.path.insert(0, '/home/claude/lafouch/work/kit'); sys.path.insert(0, '/home/claude/lafouch/work/ideias/03-bugs-site')
from playwright.sync_api import sync_playwright
import sim
from abas_video import INIT, rota  # conta de teste (2 endereços, 5 pedidos) e letras do site
U = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8721'
res = []
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=sim.EXE, args=sim.ARGS, ignore_default_args=['--hide-scrollbars'])  # PROPOSTA: sim.navegador(pw, barras=True)
    for W, H, toque, ap in ((1128, 900, False, 'PC'), (390, 844, True, 'celular')):
        c = sim.contexto(b, W, H, toque=toque, dpr=1, lingua='pt-BR'); c.add_init_script(INIT); c.route('**/*', rota); pg = c.new_page()
        # B4
        pg.goto(U + '/?cliente=1'); pg.wait_for_timeout(2500); pg.evaluate('scrollTo(0,700)'); pg.wait_for_timeout(500)
        pg.evaluate("document.getElementById('mnb').click()"); pg.wait_for_timeout(900)
        t = pg.evaluate("()=>Math.round(document.querySelector('.top').getBoundingClientRect().top)")
        res.append((ap, 'B4 topo com o menu aberto', 'ok' if -2 <= t <= 2 else 'FALHA (topo em y=%d, fora da tela)' % t))
        # B5
        pg.goto(U + '/?cliente=1'); pg.wait_for_timeout(2500); pg.evaluate("document.querySelector('#contabtn').click()"); pg.wait_for_timeout(1500)
        ruins = []
        for a in ['Pedidos', 'Endereços', 'Cartões', 'Perfil', 'Endereços']:
            pg.evaluate("a=>{const b=[...document.querySelectorAll('#layer .mct button')].find(e=>e.textContent.trim()===a);b&&b.click()}", a)
            t0 = time.time()
            while time.time() - t0 < 1.2:
                r = pg.evaluate("""()=>{const p=document.querySelector('#layer aside.panel');if(!p)return null;const s=getComputedStyle(p);
                  const barra=(/(auto|scroll)/.test(s.overflowY)&&p.scrollHeight>p.clientHeight+1)||(/(auto|scroll)/.test(s.overflowX)&&p.scrollWidth>p.clientWidth+1);
                  const velho=!!p.querySelector('.mcOld');return barra||velho?(barra?'barra':'')+(velho?' conteúdo-de-outra-aba':''):null}""")
                if r: ruins.append('%s: %s' % (a, r.strip())); break
                pg.wait_for_timeout(40)
        res.append((ap, 'B5 troca de aba da Minha conta', 'ok' if not ruins else 'FALHA (' + '; '.join(ruins) + ')'))
        c.close()
    b.close()
for r in res: print(' · '.join(r))
print('RESULTADO:', 'reprova' if any(x[2] != 'ok' for x in res) else 'passa')
