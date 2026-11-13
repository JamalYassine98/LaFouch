# S214 (13/11): estudo do site real (sem injeção) — roda o designer em várias telas, tamanhos e posições de rolagem (parado).
import sys, json
from playwright.sync_api import sync_playwright
E = open('/home/claude/lafouch/work/kit/ecom.js').read()
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
TEL = [('inicio', '', None), ('catalogo solar', '?r=solar', None), ('catalogo armazones', '?r=armazones', None), ('peca', '?r=armazones', "()=>document.querySelector('#grid .card .open').click()")]
TAM = [(360, 740), (390, 844), (412, 915), (768, 1024), (1440, 900), (2560, 1300)]
tot = {}; wam = [0, 0]
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    for W, H in TAM:
        mob = W < 700
        c = b.new_context(viewport={'width': W, 'height': H}, is_mobile=mob, has_touch=mob, locale='es-PY', service_workers='block')
        c.add_init_script("sessionStorage.setItem('lf_ni','1')"); c.route('**/*', rota)
        for nome, url, acao in TEL:
            pg = c.new_page(); pg.goto('http://localhost:8811/' + url); pg.wait_for_timeout(2500)
            if acao: pg.evaluate(acao); pg.wait_for_timeout(1500)
            for passo in range(5):
                if passo: pg.mouse.wheel(0, H * 0.8); pg.wait_for_timeout(1500)
                if mob and not acao:
                    wam[1] += 1; wam[0] += pg.evaluate("document.documentElement.classList.contains('wamin')")
                for x in pg.evaluate(E):
                    k = x.split('·')[0].strip(); k = ''.join(ch for ch in k if not ch.isdigit())
                    tot.setdefault(k, set()).add('%s %d' % (nome, W))
            pg.close()
        c.close()
    b.close()
print('WhatsApp recolhido (celular, parado): %d de %d posições' % (wam[0], wam[1]))
for k, v in sorted(tot.items(), key=lambda x: -len(x[1])): print(len(v), '|', k, '|', sorted(v)[:6])
