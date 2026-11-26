# VÍDEO explicativo do Semp (ESBOCO, 26/11/2026) — pedido do dono 09:41: "um vídeo calmo e explicativo de como funciona, desde a
# geração de uma modelo ou foto até o vídeo comercial e o status do WhatsApp. Só pra ver como seria."
# Celular em pé (1080×1920, 30 fps), sem som (voz só com autorização: regra 23). Cada cena é uma página desenhada no navegador
# (Fraunces nos títulos e Inter nos textos, como o site) e filmada como foto parada com um zoom lento; o nome do modelo aparece letra
# por letra. Peça REAL (SL2305, foto do Estúdio que o site usa) e as telas do esboço da parte 1. A pessoa com a peça é ILUSTRAÇÃO:
# a foto de verdade só sai do Flow (aqui não se gera foto de gente), e o vídeo diz isso na tela.
import os, sys, base64, subprocess, shutil
D = os.path.dirname(os.path.abspath(__file__)); T = '/tmp/semp_video'; os.makedirs(T, exist_ok=True)
CAT = '/home/claude/catalogo/dados/f/'
def b64(p, mime='image/jpeg'): return 'data:%s;base64,%s' % (mime, base64.b64encode(open(p, 'rb').read()).decode())
OC = b64(CAT + [x for x in os.listdir(CAT) if x.startswith('SL2305_')][0])
FR = b64('/home/claude/lafouch/work/argus/motor/letras/site/fraunces-latin-600-normal.woff2', 'font/woff2')
TELA = {k: b64(os.path.join(D, 'tela_S1%s.jpg' % k)) for k in ('b_peca', 'c_cenario', 'd_pronto', 'e_pronto-foto')}
CSS = """@font-face{font-family:Fraunces;src:url(%s) format('woff2');font-weight:600}
*{box-sizing:border-box;margin:0;padding:0}html,body{width:1080px;height:1920px;overflow:hidden}
body{background:#faf7f2;color:#1d1d1f;font-family:Inter,sans-serif;display:flex;flex-direction:column;padding:120px 88px 110px}
.n{font-size:30px;letter-spacing:.18em;text-transform:uppercase;color:#943d6f;font-weight:600}
h1{font-family:Fraunces,serif;font-weight:600;font-size:88px;line-height:1.05;letter-spacing:-.01em;margin:20px 0 0}
p.c{font-size:42px;line-height:1.38;color:#3a3a3c;margin-top:32px}
.mid{flex:1;display:flex;align-items:center;justify-content:center;margin:48px 0}
.cel{width:560px;height:1120px;border-radius:64px;background:#111;padding:18px;box-shadow:0 30px 80px #0002}
.cel>div{width:100%%;height:100%%;border-radius:48px;overflow:hidden;background:#fff;position:relative}
.cel img.t{width:100%%;display:block}
.pe{font-size:30px;color:#8a8580;margin-top:24px}
.tag{display:inline-block;font-size:26px;color:#8a8580;border:1px solid #d9d2c9;border-radius:40px;padding:8px 22px;margin-top:24px}
""" % FR
def pagina(corpo): return '<!DOCTYPE html><html><head><meta charset="utf-8"><style>%s</style></head><body>%s</body></html>' % (CSS, corpo)
def cel(img, y=0): return '<div class="cel"><div><img class="t" src="%s" style="margin-top:-%dpx"></div></div>' % (img, y)
# a pessoa com a peça (ILUSTRAÇÃO): rua no fim da tarde, rosto oval médio, e a armação REAL por cima (multiply tira o branco da foto)
def ilustra(w=640, h=800, rotulo=True, raio=28):
    return ('<div style="position:relative;width:%dpx;height:%dpx;border-radius:%dpx;overflow:hidden;background:linear-gradient(180deg,#e9c9a4 0%%,#d9a77a 55%%,#b98a68 100%%)">'
            '<div style="position:absolute;inset:0;background:radial-gradient(circle at 78%% 22%%,#fff3d6 0,#fff3d600 38%%)"></div>'
            '<div style="position:absolute;left:6%%;top:30%%;width:20%%;height:70%%;background:#c79a76;border-radius:8px;opacity:.55;filter:blur(6px)"></div>'
            '<div style="position:absolute;right:4%%;top:38%%;width:24%%;height:62%%;background:#b58262;border-radius:8px;opacity:.5;filter:blur(6px)"></div>'
            '<div style="position:absolute;left:50%%;bottom:-6%%;width:78%%;height:40%%;transform:translateX(-50%%);background:#efe6da;border-radius:48%% 48%% 0 0"></div>'
            '<div style="position:absolute;left:50%%;top:16%%;width:44%%;height:20%%;transform:translateX(-50%%);background:#2b1d16;border-radius:50%% 50%% 20%% 20%%"></div>'
            '<div style="position:absolute;left:50%%;top:22%%;width:36%%;height:40%%;transform:translateX(-50%%);background:#c98f6b;border-radius:50%% 50%% 46%% 46%%/55%% 55%% 45%% 45%%"></div>'
            '<img src="%s" style="position:absolute;left:50%%;top:33%%;width:42%%;transform:translateX(-50%%);mix-blend-mode:multiply">'
            '%s</div>') % (w, h, raio, OC, '<div style="position:absolute;left:24px;bottom:20px;font-size:22px;color:#fff;background:#0006;border-radius:20px;padding:6px 16px">ilustração · a foto de verdade sai do Flow</div>' if rotulo else '')
CENAS = []
def cena(nome, html, dur, zoom=True): CENAS.append((nome, html, dur, zoom))
cena('01', pagina('<div class="n">Esboço · como seria</div><h1>Do Estúdio<br>ao status</h1><p class="c">Como o Semp vai transformar uma peça da loja em foto, vídeo e status — e o que fica com você.</p>'
                  '<div class="mid"><img src="%s" style="width:820px"></div><div class="pe">Nada disto está pronto no app ainda: é para ver o caminho.</div>' % OC), 7)
cena('02', pagina('<div class="n">1 · A peça real</div><h1>Você grava<br>no Estúdio</h1>'
                  '<div class="mid"><div style="background:#fff;border-radius:28px;padding:48px;box-shadow:0 20px 60px #0001"><img src="%s" style="width:780px;display:block"></div></div>'
                  '<p class="c">A foto do Estúdio é a base de tudo. A IA nunca muda a armação: formato, cor e hastes vêm daqui.</p>' % OC), 8)
cena('03', pagina('<div class="n">2 · Criar › Peça</div><h1>O Semp sugere<br>a peça</h1><div class="mid">%s</div>'
                  '<p class="c">Em ordem e com o motivo: “últimas 3”, “solar · começa o verão”. Estoque 1 nunca é anunciado.</p>' % cel(TELA['b_peca'], 90)), 8)
cena('04', pagina('<div class="n">3 · Cenário</div><h1>Um cenário<br>com lógica</h1><div class="mid">%s</div>'
                  '<p class="c">Ele explica antes (“Entendi assim”). Se não for isso, você toca “Não é isso” — sem gastar nada.</p>' % cel(TELA['c_cenario'], 90)), 9)
ROSTO = lambda forma, tam, ok, tit, sub: ('<div style="display:flex;flex-direction:column;align-items:center;gap:18px;opacity:%s">'
    '<div style="position:relative;width:250px;height:300px;display:flex;align-items:center;justify-content:center">'
    '<div style="width:%dpx;height:%dpx;background:#d9a77a;border-radius:%s"></div>'
    '<img src="%s" style="position:absolute;top:42%%;left:50%%;transform:translateX(-50%%);width:180px;mix-blend-mode:multiply"></div>'
    '<b style="font-size:34px;font-weight:600">%s</b><span style="font-size:26px;color:#8a8580">%s</span>%s</div>') % (
    '1' if ok else '.45', tam[0], tam[1], forma, OC, tit, sub, '<span style="font-size:40px;color:#2e7d4f">✓</span>' if ok else '<span style="font-size:40px;color:#b0a8a0">·</span>')
cena('05', pagina('<div class="n">4 · A modelo certa</div><h1>A peça vai no<br>rosto certo</h1>'
                  '<div class="mid" style="gap:28px">%s%s%s</div>'
                  '<p class="c">Elenco virtual de todo tipo de rosto. O Semp escolhe pelo formato e pelo tamanho do rosto, pelas medidas da armação: o aviador tem a frente larga → rosto oval médio.</p>' % (
                      ROSTO('50%/55% 55% 45% 45%', (170, 220), True, 'Amara', 'oval · médio'), ROSTO('50%', (150, 150), False, 'Lia', 'redondo · pequeno'), ROSTO('22%', (200, 210), False, 'Nadia', 'quadrado · grande'))), 10)
FLOW = ('<div class="cel"><div style="background:#f3f3f3;display:flex;flex-direction:column">'
        '<div style="height:96px;background:#fff;border-bottom:1px solid #ddd;display:flex;align-items:center;gap:16px;padding:0 28px;font-size:24px;color:#555"><span style="font-size:34px">×</span><span>labs.google/flow</span></div>'
        '<div style="padding:28px;display:flex;flex-direction:column;gap:20px;flex:1">'
        '<div style="font-size:22px;color:#888">Referências da peça</div><div style="display:flex;gap:12px">'
        '<div style="flex:1;height:110px;background:#fff;border-radius:14px;display:flex;align-items:center;justify-content:center"><img src="%s" style="width:90%%"></div>'
        '<div style="flex:1;height:110px;background:#fff;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:18px;color:#aaa">3/4 do giro</div>'
        '<div style="flex:1;height:110px;background:#fff;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:18px;color:#aaa">lado do giro</div></div>'
        '<div style="font-size:22px;color:#888">Prompt (veio pronto do app)</div>'
        '<div style="background:#fff;border-radius:14px;padding:20px;font-size:21px;line-height:1.45;color:#333">Mulher de rosto oval, tamanho médio, numa rua de Ciudad del Este no fim da tarde, luz quente. Usa o óculos de sol aviador das referências: armação preta com ponte dourada, idêntica. Foto de revista, olhando para a câmera, natural. Formato 3:4.</div>'
        '<div style="margin-top:auto;height:84px;border-radius:42px;background:#1a73e8;color:#fff;font-size:30px;font-weight:600;display:flex;align-items:center;justify-content:center">Gerar</div>'
        '</div></div></div>') % OC
cena('06', pagina('<div class="n">5 · Gerar no Flow</div><h1>Você só<br>aperta gerar</h1><div class="mid" style="gap:40px">%s</div>'
                  '<p class="c">O Flow do Google abre dentro do app, com o prompt e as fotos da peça prontos. Plano grátis: foto no Nano Banana Pro.</p>' % FLOW), 10)
USAR = ''.join('<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e5ded5;padding:22px 0;font-size:32px"><b style="font-weight:600">%s</b><span style="color:#8a8580;font-size:26px">%s</span></div>' % x for x in
               (('Post', '4:5 · qui 20h'), ('Story', '9:16 · sex 12h'), ('Status', 'WhatsApp · sex 12h'), ('Carrossel', 'com a vitrine')))
cena('07', pagina('<div class="n">6 · A foto volta</div><h1>Uma foto,<br>vários usos</h1>'
                  '<div class="mid" style="flex-direction:column;gap:36px">%s<div style="width:640px">%s</div></div>'
                  '<p class="c">Você salva a foto e volta ao app. Dela saem o post, o story, o status e o carrossel, com a legenda em espanhol e português.</p>' % (ilustra(520, 650), USAR)), 10)
# o reel: a linha do tempo de 15 s (decidido em 25/11) e o fim de verdade — peça no branco e o nome letra por letra
SEG = lambda w, cor, t, s: '<div style="width:%d%%;background:%s;border-radius:16px;padding:20px 18px;color:#fff"><b style="font-size:28px;display:block">%s</b><span style="font-size:22px;opacity:.9">%s</span></div>' % (w, cor, t, s)
cena('08', pagina('<div class="n">7 · O reel de 15 s</div><h1>O vídeo<br>comercial</h1>'
                  '<div class="mid" style="flex-direction:column;gap:40px">%s<div style="display:flex;gap:10px;width:900px">%s%s%s</div></div>'
                  '<p class="c">0–2 s: o momento mais bonito, para prender. Até 12 s: cenas do Flow (Omni 1.2 Flash). No fim: a peça no branco e o nome dela.</p>' % (
                      ilustra(420, 520), SEG(15, '#943d6f', '0–2 s', 'gancho'), SEG(65, '#b07a93', '2–12 s', 'cenas do Flow'), SEG(20, '#3a3a3c', '12–15 s', 'nome'))), 10)
def fim(n):
    nome = 'MARGAUX'[:n]
    return pagina('<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fff;margin:-120px -88px -110px;padding:0 60px">'
                  '<div style="font-family:Fraunces,serif;font-weight:600;font-size:150px;letter-spacing:.04em;height:180px">%s</div>'
                  '<img src="%s" style="width:900px;margin:40px 0">'
                  '<div style="font-size:34px;letter-spacing:.2em;color:#555">LA FOUCH</div><div style="font-size:30px;color:#888;margin-top:16px;opacity:%s">Disponible en lafouch.com</div></div>' % (nome or '&nbsp;', OC, '1' if n >= 7 else '0'))
STATUS = ('<div class="cel"><div style="background:#111">'
          '<div style="position:absolute;left:20px;right:20px;top:20px;display:flex;gap:6px"><i style="flex:1;height:5px;border-radius:3px;background:#fff"></i><i style="flex:1;height:5px;border-radius:3px;background:#fff5"></i></div>'
          '<div style="position:absolute;left:24px;top:44px;display:flex;align-items:center;gap:14px;color:#fff;font-size:24px;z-index:2"><span style="width:52px;height:52px;border-radius:50%%;background:#943d6f;display:flex;align-items:center;justify-content:center;font-family:Fraunces,serif">L</span><span><b>LaFouch</b><br><span style="opacity:.75;font-size:20px">hoje, 12:00</span></span></div>'
          '<div style="position:absolute;inset:0;background:linear-gradient(180deg,#e9c9a4,#d9a77a 55%%,#b98a68);display:flex;align-items:flex-end;justify-content:center">%s</div>'
          '<div style="position:absolute;left:0;right:0;bottom:70px;text-align:center;color:#fff;z-index:2;text-shadow:0 2px 16px #0009"><div style="font-family:Fraunces,serif;font-size:56px">Margaux</div><div style="font-size:28px;margin-top:6px">G$ 176.000 · lafouch.com</div></div>'
          '</div></div>') % ilustra(524, 760, rotulo=False, raio=0)
cena('10', pagina('<div class="n">8 · Status do WhatsApp</div><h1>O status<br>pronto às 12h</h1><div class="mid">%s</div>'
                  '<p class="c">O status é sempre você que posta: o Semp deixa pronto e o sino avisa no horário.</p><div class="tag">ilustração · a foto de verdade sai do Flow</div>' % STATUS), 9)
AG = ''.join('<div style="display:flex;justify-content:space-between;border-bottom:1px solid #e5ded5;padding:20px 0;font-size:34px"><span>%s</span><span style="color:#8a8580">%s</span></div>' % x for x in
             (('Reel', '1'), ('Post (foto ou carrossel)', '2'), ('Stories', '3 a 4 dias'), ('Status', '3')))
cena('11', pagina('<div class="n">9 · A semana</div><h1>A semana<br>inteira pronta</h1><div class="mid" style="flex-direction:column;align-items:stretch">'
                  '<div style="font-size:28px;letter-spacing:.14em;text-transform:uppercase;color:#8a8580;margin-bottom:8px">Semana normal</div>%s'
                  '<div style="font-size:30px;color:#8a8580;margin-top:28px">Semana de evento (Natal, Black Friday): 2 reels, 3 posts, stories todo dia e 5 status.</div></div>'
                  '<p class="c">No domingo o Semp prepara tudo de uma vez. Você aprova, ou toca “Não é isso”.</p>' % AG), 9)
cena('12', pagina('<div class="n">Resumo</div><h1>Você aprova.<br>O Semp aprende.</h1>'
                  '<div class="mid" style="flex-direction:column;align-items:stretch;gap:0">%s</div><div class="pe">Custos: Flow no plano grátis · o cérebro (API do Claude) ~US$ 2–10 por mês, com o teto controlado pelo Titan.</div>' %
                  ''.join('<div style="font-size:38px;line-height:1.4;border-bottom:1px solid #e5ded5;padding:22px 0">%s</div>' % x for x in (
                      'Estúdio: a peça real', 'Criar: peça → cenário → pronto', 'Flow: você aperta gerar', 'Uma foto: post, story, status, carrossel', 'Reel de 15 s com o nome do modelo', 'Cada “sim” e cada “não é isso” ensina o Semp'))), 9)
def render():
    from playwright.sync_api import sync_playwright
    arqs = []
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1920})
        def foto(html, f): pg.set_content(html); pg.wait_for_timeout(500); pg.evaluate('document.fonts.ready'); pg.screenshot(path=f, type='jpeg', quality=92)
        for nome, html, dur, zoom in CENAS:
            f = '%s/%s.jpg' % (T, nome); foto(html, f); arqs.append((nome, f, dur, zoom))
        # cena 09: o fim do reel — o nome letra por letra (0,35 s cada), depois parado
        for n in range(8): foto(fim(min(n, 7)), '%s/09_%d.jpg' % (T, n))
        b.close()
    return arqs
def enc(args, out):
    tmp = out[:-4] + '.tmp.mp4'
    r = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error'] + args + ['-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-r', '30', tmp])
    assert r.returncode == 0, out; os.replace(tmp, out)
if __name__ == '__main__':
    arqs = render(); partes = []
    for nome, f, dur, zoom in arqs:
        out = '%s/c%s.mp4' % (T, nome); n = int(dur * 30)
        vf = ('scale=2160:-1,zoompan=z=\'1+0.04*on/%d\':x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':d=%d:s=1080x1920:fps=30' % (n, n)) + ',fade=t=in:st=0:d=0.8,fade=t=out:st=%.2f:d=0.8,format=yuv420p' % (dur - 0.8)
        enc(['-framerate', '30', '-i', f, '-vf', vf, '-frames:v', str(n)], out); partes.append((nome, out))
    # 09 (fim do reel) depois da 08
    lista = '%s/l09.txt' % T
    with open(lista, 'w') as L:
        for n in range(8): L.write("file '%s/09_%d.jpg'\nduration %s\n" % (T, n, '0.4' if n < 7 else '4.2'))
        L.write("file '%s/09_7.jpg'\n" % T)
    enc(['-f', 'concat', '-safe', '0', '-i', lista, '-vf', 'fps=30,fade=t=in:st=0:d=0.6,fade=t=out:st=6.4:d=0.6,format=yuv420p', '-t', '7'], '%s/c09.mp4' % T)
    partes.append(('09', '%s/c09.mp4' % T)); partes.sort()
    with open('%s/todas.txt' % T, 'w') as L:
        for _, p in partes: L.write("file '%s'\n" % p)
    out = os.path.join(D, 'semp_como_funciona.mp4'); tmp = out[:-4] + '.tmp.mp4'
    r = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', '%s/todas.txt' % T, '-c', 'copy', '-movflags', '+faststart', tmp])
    assert r.returncode == 0; os.replace(tmp, out); print('ok', out)
