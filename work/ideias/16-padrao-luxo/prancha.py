"""IDEIAS 16 · prancha do estudo do padrão de luxo: o que já é luxo hoje na La Fouch (prévia rosé do Início e os
cupons de luxo aprovados) e a paleta/letra que se repete neles. Só peças reais do projeto. Uso: python3 prancha.py <catalogo>"""
import sys, os, base64
from playwright.sync_api import sync_playwright
CAT = sys.argv[1]; R = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
b64 = lambda p, t: 'data:%s;base64,%s' % (t, base64.b64encode(open(p, 'rb').read()).decode())
FR = b64(os.path.join(R, 'work/argus/motor/letras/site/fraunces-latin-600-normal.woff2'), 'font/woff2')
OG = b64(os.path.join(CAT, 'og/inicio-pt.jpg'), 'image/jpeg')
JS = open(os.path.join(R, 'work/s435/varredura/cartao_luxo.js')).read()
SW = [('#fbf7fa', 'Rosé claro · fundo'), ('#f4e8ef', 'Rosé · luz'), ('#943d6f', 'Cor oficial · assinatura'), ('#562340', 'Vinho · luz'),
      ('#1f0d17', 'Vinho · sombra'), ('#e9d3a6', 'Champanhe · números'), ('#d6b274', 'Fio dourado'), ('#2a1f27', 'Texto')]
sw = ''.join('<div class=s><i style="background:%s"></i><b>%s</b><span>%s</span></div>' % (c, n, c) for c, n in SW)
HTML = """<html><head><style>@font-face{font-family:F;src:url('%s') format('woff2');font-weight:600}
body{margin:0;width:1180px;padding:28px;background:#f3eef1;font:14px Arial;color:#2a1f27}
h1{font:600 30px F;margin:0 0 4px}h2{font:600 19px F;margin:26px 0 10px}p{margin:0 0 6px;color:#6b5a66}
.row{display:flex;gap:20px;align-items:flex-start}.og{width:560px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,.08)}
.c{width:290px}.sw{display:flex;gap:10px;flex-wrap:wrap}.s{width:132px}.s i{display:block;height:56px;border-radius:8px;border:1px solid #0001}
.s b{display:block;font:600 12px Arial;margin-top:6px}.s span{font:11px monospace;color:#6b5a66}
.t1{font:600 40px F}.t2{font:600 13px Arial;letter-spacing:.16em;text-transform:uppercase;color:#6b5a66}.t3{font:14px Arial}
</style></head><body><h1>O que já é luxo hoje na La Fouch</h1><p>IDEIAS 16 · estudo do padrão (26/11). Peças reais: a prévia do Início no ar e os cupons de luxo aprovados (functions/email.js, S400/S409).</p>
<div class=row><img class=og src="%s"><div><h2 style="margin-top:0">Prévia do Início · rosé suave</h2><p>Luz diagonal do branco rosado ao rosé, peça grande em três-quartos,<br>serifa com uma palavra em itálico na cor da marca.</p>
<p><b>Erros:</b> frase dentro da imagem e logo fora do quadradinho.</p></div></div>
<h2>Cupons de luxo aprovados · vinho, preto e da data</h2><div class=row><div class=c id=a></div><div class=c id=b></div><div class=c id=c></div></div>
<p style="margin-top:10px">Luz diagonal 135° · moldura com fio dourado de 1 px · %% grande em serifa champanhe · título em itálico · rótulos em maiúsculas espaçadas.<br>Letra: Georgia/Arial (e-mail só aceita letras do sistema); no site e no app o par é Fraunces + Inter.</p>
<h2>A família que se repete</h2><div class=sw>%s</div>
<h2>Letra</h2><div class=t1>La Fouch · Óculos de sol e de grau</div><div class=t2 style="margin:8px 0">Rótulo em maiúsculas espaçadas</div><div class=t3>Texto corrido em Inter (aqui Arial no lugar dela)</div>
<script>%s
document.getElementById('a').innerHTML=LUXO({tema:'vinho',rot:'CLIENTE FIEL',pct:'15%%',tit:'Um presente da La Fouch',nome:'MARIA',val:'ATÉ 31/12'});
document.getElementById('b').innerHTML=LUXO({tema:'preto',rot:'VIP',pct:'20%%',tit:'Feliz aniversário',nome:'MARIA',val:'ATÉ 31/12'});
document.getElementById('c').innerHTML=LUXO({tema:'natal',rot:'CUPOM DE NATAL',pct:'10%%',tit:'Para o seu presente',nome:'MARIA',val:'ATÉ 25/12'});
</script></body></html>"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1236, 'height': 900})
    pg.set_content(HTML % (FR, OG, sw, JS)); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(600)
    assert pg.evaluate("document.fonts.check('600 30px F')"); pg.screenshot(path='prancha-16-luxo-hoje.jpg', full_page=True, quality=88, type='jpeg'); b.close()
print('ok')
