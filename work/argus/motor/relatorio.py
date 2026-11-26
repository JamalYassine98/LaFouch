# ARGUS · o relatório (Parte 8): o que o dono e a ESBOCO olham. Um lugar só para app e site.
#   foto: a tela de hoje × a planta, lado a lado, cada diferença com um quadro e um número (mesmo número nas duas e na lista)
#   vídeo: o toque que falhou, filmado com o dedo de verdade (MP4, sem GIF — regra 11), do antes até 2 s depois
import os, sys, base64, subprocess, shutil
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import planta, compara, dedo
from PIL import Image, ImageDraw, ImageFont
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
VERMELHO = (220, 40, 60)
def _fonte(n): return ImageFont.truetype(F, n)
def _foto(pg, f):
    """A tela inteira, parada (animações no fim), e a escala px da foto ÷ px da página."""
    pg.evaluate('()=>window.__argus.parar()'); pg.screenshot(path=f, full_page=True)
    return pg.evaluate('()=>devicePixelRatio')
def marca(img, itens, escala, rolagem=0):
    """Desenha um quadro numerado em cada caixa [x, y, l, a] (px da página)."""
    d = ImageDraw.Draw(img); fn = _fonte(int(14 * escala))
    for n, cx in itens:
        if not cx: continue
        x, y, l, a = [v * escala for v in cx]; y += rolagem * escala
        d.rectangle([x - 3, y - 3, x + l + 3, y + a + 3], outline=VERMELHO, width=max(2, int(2 * escala)))
        r = int(11 * escala); d.ellipse([x - r - 4, y - r - 4, x + r - 4, y + r - 4], fill=VERMELHO)
        d.text((x - 4, y - 4), str(n), font=fn, fill=(255, 255, 255), anchor='mm')
    return img
def tela(pw, pl, tema, pasta, porta=None, navegador=None):
    """Foto marcada da tela × a planta. Devolve (arquivo, [diferenças]) — arquivo None se igual."""
    os.makedirs(pasta, exist_ok=True)
    b, pg = planta._abre_tela(pw, planta.tela_de(pl), tema, porta, navegador=navegador)
    try:
        hoje = pg.evaluate(planta.COLETA); v = pg.evaluate(planta.VERSAO); f = os.path.join(pasta, '_hoje.png'); esc = _foto(pg, f)
    finally: b.close()
    D = compara.compara(compara.mesma_versao(pl['temas'][tema]['pecas'], pl.get('versao_app'), v), hoje)
    if not D: return None, []
    num = [(i + 1, x) for i, x in enumerate(D)]
    H = marca(Image.open(f).convert('RGB'), [(n, None if 'falta' in x[1] else x[4]) for n, x in num], esc)   # falta: não está na tela de hoje
    fp = os.path.join(planta.pasta(pl), '%s_%s.jpg' % (pl['id'], tema))
    P = marca(Image.open(fp).convert('RGB'), [(n, x[4] if 'falta' in x[1] else None) for n, x in num], Image.open(fp).width / max(1, H.width / esc))   # na planta, marca o que falta hoje
    alt = max(H.height, P.height); W = H.width + P.width + 120; fn = _fonte(26)
    linhas = ['%d · %s · %s' % (n, x[0], x[1]) for n, x in num]
    o = Image.new('RGB', (W, 90 + alt + 40 + 34 * len(linhas)), (24, 26, 32)); d = ImageDraw.Draw(o)
    d.text((40, 28), 'HOJE · %s (%s)' % (pl['tela'], tema), font=fn, fill=(235, 235, 240)); o.paste(H, (40, 80))
    d.text((80 + H.width, 28), 'PLANTA APROVADA', font=fn, fill=(229, 138, 176)); o.paste(P, (80 + H.width, 80))
    for k, l in enumerate(linhas): d.text((40, 100 + alt + 34 * k), l[:150], font=_fonte(22), fill=(235, 235, 240))
    o.thumbnail((3600, 6000)); out = os.path.join(pasta, '%s_%s.jpg' % (pl['id'], tema)); o.save(out, quality=82); os.remove(f)
    return out, D
def video(pw, pl, nome, pasta, tema=None, porta=None, navegador=None, depois_ms=2000):
    """Filma o toque no botão (pelo nome que aparece na tela de HOJE; "Nome (2ª)" = o segundo com esse nome) com o dedo de verdade
    e grava MP4. Devolve o arquivo (None se o botão não está na tela ou não deu para filmar)."""
    os.makedirs(pasta, exist_ok=True); tema = tema or planta.setor(pl)['tema_base']
    b, pg = planta._abre_tela(pw, planta.tela_de(pl), tema, porta, navegador=navegador)
    fr = os.path.join(pasta, '_quadros'); shutil.rmtree(fr, ignore_errors=True); os.makedirs(fr)
    i = botao(pg.evaluate(planta.TOCAVEIS), nome)
    if i is None: b.close(); return None
    try:
        s = pg.context.new_cdp_session(pg); Q = []
        s.on('Page.screencastFrame', lambda e: (Q.append(e['data']), s.send('Page.screencastFrameAck', {'sessionId': e['sessionId']})))
        s.send('Page.startScreencast', {'format': 'jpeg', 'quality': 80, 'everyNthFrame': 1})
        pg.wait_for_timeout(600); m = dedo.mao(pg); dedo.toque(m, i); pg.wait_for_timeout(depois_ms)
        s.send('Page.stopScreencast')
    finally: b.close()
    if len(Q) < 2: return None
    for k, q in enumerate(Q): open(os.path.join(fr, '%05d.jpg' % k), 'wb').write(base64.b64decode(q))
    out = os.path.join(pasta, '%s_toque_%s.mp4' % (pl['id'], ''.join(c if c.isalnum() else '-' for c in nome)[:40]))
    fps = max(4, round(len(Q) / ((600 + depois_ms) / 1000)))
    r = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', os.path.join(fr, '%05d.jpg'), '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
                        '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', out], capture_output=True)
    shutil.rmtree(fr, ignore_errors=True)
    return out if r.returncode == 0 and os.path.exists(out) else None
def botao(tocaveis, nome):
    """O índice do botão pelo nome que aparece — o mesmo jeito dos toques: o nome, e a ordem quando o nome se repete ("Nome (2ª)")."""
    base, k = nome, 1
    if nome.endswith('ª)') and ' (' in nome: base, k = nome.rsplit(' (', 1)[0], int(nome.rsplit(' (', 1)[1][:-2])
    achados = [t for t in tocaveis if t['nome'][:40] == base[:40]]
    return achados[k - 1]['i'] if len(achados) >= k else None
