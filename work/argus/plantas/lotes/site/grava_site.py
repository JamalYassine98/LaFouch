# ARGUS · FASE 1 (dono 28/11 08:31) · plantas do SITE como está HOJE (PLANTAS).
# Uma planta por lugar do mapa da porta (setor_site/porta.py: paginas() = cada página .html + carrinho, conta e peça), gravada pelo
# motor (motor/planta.py): celular do dono nas 9 temáticas + as ligações tocadas com o dedo. Tablet, PC, as 3 letras e o espanhol
# não ficam na planta: a porta os confere com o medidor. Ficam PENDENTES (sem aprovação) até o dono aprovar o fim da fase.
#   python3 work/argus/plantas/lotes/site/grava_site.py <parte> <partes>     (as partes rodam em paralelo, cada uma com sua porta)
#   python3 work/argus/plantas/lotes/site/grava_site.py folhas               (as folhas para o dono: uma por planta, as 9 temáticas)
import os, sys, json, inspect
A = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path[:0] = [os.path.join(A, 'motor'), os.path.join(A, 'setor_site')]
import planta, lfsite, porta as porta_site
# o motor usa uma foto de passagem com nome fixo (/tmp/_pl.png): com partes em paralelo, cada processo usa a sua (só aqui, o motor não muda)
exec(compile(inspect.getsource(planta.grava).replace("'/tmp/_pl.png'", "'/tmp/_pl_%d.png' % os.getpid()"), planta.__file__, 'exec'), planta.__dict__)
NOMES = {'': 'Início', '?carrinho=1': 'Carrinho', '?conta=1': 'Conta (entrar)', 'admin': 'Painel (admin)'}
def telas():
    ref = json.load(open(lfsite.LOJA))['docs'][0]['fields']['ref']['stringValue']
    T = []
    for r in porta_site.paginas(lfsite.CAT):
        if r == 'p/<peça>':   # a peça é uma página por peça: uma planta (a 1ª peça do retrato) vale para o molde "p/<peça>"
            T.append({'id': 'site-peca', 'nome': 'Peça (%s)' % ref, 'rota': 'p/' + ref, 'vale_para': ['p/<peça>']}); continue
        T.append({'id': 'site-' + ({'': 'inicio', '?carrinho=1': 'carrinho', '?conta=1': 'conta'}.get(r) or r), 'nome': NOMES.get(r, r), 'rota': r})
    return T
def grava(parte, partes):
    from playwright.sync_api import sync_playwright
    com = lfsite.commit_de(); p = lfsite.serve(lfsite.monta(com), 8850 + parte)
    with sync_playwright() as pw:
        for i, t in enumerate(telas()):
            if i % partes != parte or os.path.exists(os.path.join(planta.P_SITE, t['id'] + '.json')): continue
            pl = planta.grava(pw, t['id'], {'nome': t['nome'], 'passos': [], 'cenario': 'normal', 'setor': 'site', 'rota': t['rota']}, porta=p)
            pl['site_commit'] = com[:7]
            if t.get('vale_para'): pl['vale_para'] = t['vale_para']
            planta.salva(pl); print('planta', t['id'], len(pl['ligacoes']), 'ligações', flush=True)
def folhas():
    from PIL import Image, ImageDraw, ImageFont
    F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 26); out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'folhas'); os.makedirs(out, exist_ok=True)
    for f in sorted(os.listdir(planta.P_SITE)):
        if not f.endswith('.json'): continue
        pl = json.load(open(os.path.join(planta.P_SITE, f))); I = []
        for tm, t in pl['temas'].items():
            im = Image.open(os.path.join(planta.P_SITE, t['foto'])); im = im.crop((0, 0, im.width, min(im.height, im.width * 2.6))); im.thumbnail((300, 800)); I.append((tm, im))
        W = 24 + len(I) * 316; H = 110 + max(im.height for _, im in I) + 24; o = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(o)
        d.text((24, 20), '%s · /%s · planta = site de hoje (%s) · %d ligações' % (pl['tela'], pl.get('rota', ''), pl.get('site_commit', ''), len(pl.get('ligacoes', []))), font=F, fill=(40, 40, 40))
        for k, (tm, im) in enumerate(I): x = 24 + k * 316; d.text((x, 66), tm, font=F, fill=(148, 61, 111)); o.paste(im, (x, 110))
        o.save(os.path.join(out, f[:-5] + '.jpg'), quality=78)
if __name__ == '__main__':
    if sys.argv[1] == 'folhas': folhas()
    else: grava(int(sys.argv[1]), int(sys.argv[2]))
