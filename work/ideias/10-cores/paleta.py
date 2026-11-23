"""IDEIAS 10 · as cores da La Fouch padronizadas a partir da cor oficial (CMYK C47 M91 Y29 K8, dada pelo dono 23/11 10:25).
Na tela: perfil de impressão FOGRA39 → sRGB = #943d6f. Todas as outras saem dela (mistura com branco/preto), num lugar só.
Contraste conferido (WCAG). Saída: esboco-10-paleta.jpg"""
import os
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
from playwright.sync_api import sync_playwright
C = [
 ('Marca', '#943d6f', 'C47 M91 Y29 K8', 'logo, botão principal, links, fio do secundário, etiquetas ("DESTAQUE DA SEMANA"), bolinha do carrinho', '#fff', 'letra branca 6,6'),
 ('Cetim · centro', '#a15480', 'marca + 12% branco', 'o brilho suave no meio do botão acetinado', '#fff', 'letra branca 5,1'),
 ('Cetim · borda', '#873865', 'marca + 9% preto', 'a borda do botão acetinado', '#fff', '7,5'),
 ('Toque', '#7f345f', 'marca + 14% preto', 'botão apertado', '#fff', '8,2'),
 ('Rosé', '#f6eff3', 'marca a 8%', 'fundo de cartão da marca (Atacado, Formato do rosto), opção marcada', '#943d6f', 'letra da marca 5,9'),
 ('Rosé forte', '#f0e4eb', 'marca a 14%', 'fundo marcado ao passar o mouse, aviso suave', '#943d6f', '5,4'),
 ('Fio da marca', '#dabbcd', 'marca a 35%', 'contornos claros (quantidade, campos em foco)', '#141414', 'só linha, sem letra'),
]
N = [('Texto', '#141414', 'títulos e texto'), ('Texto suave', '#6b6763', 'legendas, rótulos'), ('Linha', '#ece7e9', 'divisórias'), ('Fundo', '#ffffff', 'fundo da loja (creme só nos eventos)')]
E_ = [('Certo', '#1f8f4e', 'confirmações (nunca em botão)'), ('Perigo', '#b3261e', 'Cancelar pedido, Excluir'), ('Atenção', '#b7791f', 'avisos')]
css = """*{box-sizing:border-box}body{margin:0;padding:28px 32px;width:1240px;font-family:Inter,system-ui,sans-serif;color:#141414;background:#fff}
h1{font:600 26px Inter;margin:0 0 4px}.sub{color:#6b6763;font-size:15px;margin:0 0 22px;line-height:1.45}h2{font:600 17px Inter;margin:26px 0 12px;color:#943d6f}
.g{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.s{border:1px solid #ece7e9;border-radius:14px;overflow:hidden}.sw{height:96px;display:flex;align-items:flex-end;padding:10px 12px;font:500 12px Inter;letter-spacing:.12em}
.t{padding:10px 12px 12px}.t b{display:block;font:600 15px Inter}.t code{font:500 13px ui-monospace,monospace;color:#141414}.t i{display:block;font-style:normal;color:#6b6763;font-size:12px;margin-top:2px}.t p{margin:6px 0 0;font-size:12.5px;color:#6b6763;line-height:1.35}
.bt{display:flex;gap:14px;align-items:center;margin-top:8px}.k{display:inline-flex;align-items:center;justify-content:center;height:48px;padding:0 28px;border-radius:999px;font:500 13px Inter;letter-spacing:.18em;text-transform:uppercase;color:#fff;background:radial-gradient(130% 220% at 50% 35%,#a15480 0%,#943d6f 52%,#873865 100%)}
.k.s2{background:none;color:#943d6f;box-shadow:inset 0 0 0 1px #943d6f}.l{color:#943d6f;font:500 15px Inter}.nt{color:#6b6763;font-size:13px;margin-top:10px}"""
def card(n, h, sub, uso, fg='#fff', ct=''):
    return '<div class=s><div class=sw style="background:%s;color:%s">%s</div><div class=t><b>%s</b><code>%s</code><i>%s</i><p>%s</p></div></div>' % (h, fg, ct, n, h, sub, uso)
h = '<style>%s</style><h1>As cores da La Fouch · uma família só</h1><p class=sub>Tudo sai da cor oficial da marca (CMYK C47 M91 Y29 K8 → na tela #943d6f). As outras são misturas dela com branco ou preto, num lugar só do código: muda a marca, muda tudo junto. Nos eventos, a cor do evento entra no lugar da marca e as misturas se refazem sozinhas. No site e no app, a mesma lista.</p>' % css
h += '<h2>Marca e as que saem dela</h2><div class=g>' + ''.join(card(*c) for c in C) + '</div>'
h += '<h2>Neutras</h2><div class=g>' + ''.join(card(n, x, '', u, '#fff' if x in ('#141414', '#6b6763') else '#141414') for n, x, u in N) + '</div>'
h += '<h2>Só para avisar (nunca decoração)</h2><div class=g>' + ''.join(card(n, x, '', u) for n, x, u in E_) + '</div>'
h += '<h2>Como fica no botão</h2><div class=bt><b class=k>Comprar</b><b class="k s2">Ver modelo</b><a class=l>Ver catálogo ›</a></div><p class=nt>Impressão (estojo, flanela, embalagem): usar o CMYK oficial; em tecido fosco ele já sai mais suave que na tela. O arquivo do logo hoje está em #7c486c (fora do oficial): refazer o arquivo na cor oficial.</p>'
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 1304, 'height': 600}, device_scale_factor=2)
    pg.set_content(h); pg.wait_for_timeout(300); pg.screenshot(path='esboco-10-paleta.jpg', full_page=True, type='jpeg', quality=88); b.close()
print('ok')
