# S169: prévias do WhatsApp para cada temática (link principal), com o Mochi da temática acenando
import sys
from playwright.sync_api import sync_playwright
T = {  # tema: (fundo, texto, destaque, rótulo, título, subtítulo, mochi)
 'natal': ('#f7f2ea', '#1d2b22', '#b3263a', 'NATAL', 'Presenteie estilo neste <em>Natal</em>', 'Ideias de presente · retirada no mesmo dia em Ciudad del Este', 'natal'),
 'anonovo': ('#ffffff', '#1f1d1a', '#a8854a', 'ANO NOVO', 'Ano novo, <em>novo olhar</em>', 'Dourados e clássicos para receber o ano com estilo', 'anonovo'),
 'maes': ('#fbf1f5', '#2a1f27', '#b3477d', 'DIA DAS MÃES', 'Um presente com <em>carinho</em>', 'Para a sua mãe · retirada no mesmo dia em Ciudad del Este', 'maes'),
 'pais': ('#eef2f7', '#1d2635', '#2f4a6d', 'DIA DOS PAIS', 'Estilo para o seu <em>pai</em>', 'Para o seu pai · retirada no mesmo dia em Ciudad del Este', 'pais'),
 'bf': ('#f3f3f3', '#111111', '#e11d48', 'SÓ ESTA SEMANA', 'BLACK <em>FRIDAY</em>', 'Ofertas em toda a loja · estoque limitado: quando acaba, acabou', 'bf'),
 'cyber': ('#f3f3f3', '#111111', '#e11d48', 'SÓ HOJE', 'CYBER <em>MONDAY</em>', 'Ofertas em toda a loja · estoque limitado: quando acaba, acabou', 'bf'),
 'halloween': ('#160c1a', '#f3e9f5', '#e2711d', 'HALLOWEEN', 'Olhar <em>misterioso</em>', 'Solares escuros e armações gatinho', 'halloween'),
}
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1200, 'height': 630})
    pg.route('**/*', lambda r: r.continue_() if 'localhost' in r.request.url else r.abort())
    for k, (bg, tx, ac, lab, h, s, m) in T.items():
        logo = 'http://localhost:8160/media/i/cfbd0d0ac220.png' if k == 'halloween' else 'http://localhost:8160/og_logo.png'
        pg.set_content('''<html><body style="margin:0"><div style="width:1200px;height:630px;position:relative;overflow:hidden;background:''' + bg + ''';font-family:Georgia,serif">
        <img src="''' + logo + '''" style="position:absolute;left:60px;top:55px;width:215px">
        <div style="position:absolute;left:72px;top:232px;font:700 20px Inter,system-ui,sans-serif;letter-spacing:.16em;color:''' + ac + '''">''' + lab + '''</div>
        <div style="position:absolute;left:70px;top:268px;width:600px;font-size:64px;line-height:1.1;color:''' + tx + '''">''' + h.replace('<em>', '<em style="color:' + ac + '">') + '''</div>
        <div style="position:absolute;left:72px;top:470px;width:560px;font:500 24px/1.35 Inter,system-ui,sans-serif;color:''' + tx + ''';opacity:.72">''' + s + '''</div>
        <div style="position:absolute;right:36px;top:70px;width:470px;height:500px"><img src="http://localhost:8160/og_t_''' + m + '''.png" style="width:100%;height:100%;object-fit:contain"></div></div></body></html>''')
        pg.wait_for_timeout(400); pg.screenshot(path=f'og_tema_{k}_pt.jpg', type='jpeg', quality=90)
    b.close()
