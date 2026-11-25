# ARGUS · Parte 6 · LOTE 1 de plantas do app: as telas que o teste do gabarito (24/11) achou IGUAIS ao último esboço aprovado.
# Planta = o app de hoje (nada a mudar), gravada nos dois temas e com as ligações; fica "pendente" até o dono aprovar o lote.
# Gera, por tela, a folha para o dono: a planta (escuro e claro) ao lado do último esboço aprovado daquela tela.
import os, sys, json
A = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, os.path.join(A, 'motor'))
import planta
from PIL import Image, ImageDraw, ImageFont
S = '/home/claude/lafouch/work/s435/'
LOTE = [
 ('pedidos-online', 'Pedidos online', ["()=>__LF.inicioGo('ped')"], '46c (+74r)', S + 'switch/esboco_46c_pedidos.jpg'),
 ('ajustes', 'Ajustes', ["()=>window.__argus.aba(4)"], '86 v2', S + 'varredura/titulos/esboco_86_titulos_linhas_escuro.jpg'),
 ('pecas', 'Peças', ["()=>window.__argus.aba(2)"], '48a', S + 'compras/esboco_48a_pecas.jpg'),
 ('compras', 'Compras', ["()=>__LF.inicioGo('comp')"], '51 + 51b', S + 'compras/esboco_51_compras_por_vaga.jpg'),
 ('caixa', 'Caixa', ["()=>__LF.inicioGo('caixa')"], '86 v2 + 104', S + 'semcartao/esboco_104_caixa_sem_cartao.jpg'),
 ('ferramentas', 'Preços › Ferramentas', planta.precos('ferr'), '66', S + 'titan/esboco_66_ferramentas_titan.jpg'),
]
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 30)
def folha(id_, nome, ref, img):
    P = [Image.open(os.path.join(planta.P_APP, '%s_%s.jpg' % (id_, t))) for t in ('escuro', 'claro')]
    E = Image.open(img).convert('RGB'); H = 1700
    P = [p.crop((0, 0, p.width, min(p.height, int(p.width * 2.4)))) for p in P]; P = [p.resize((p.width * H // p.height, H)) for p in P]
    E = E.resize((E.width * H // E.height, H)) if E.height > H else E
    W = sum(p.width for p in P) + E.width + 160; o = Image.new('RGB', (W, H + 110), (24, 26, 32)); d = ImageDraw.Draw(o); x = 40
    for p, t in zip(P, ('PLANTA · escuro', 'PLANTA · claro')): d.text((x, 30), t, font=F, fill=(235, 235, 240)); o.paste(p, (x, 90)); x += p.width + 40
    d.text((x, 30), 'último esboço aprovado · %s' % ref, font=F, fill=(229, 138, 176)); o.paste(E, (x, 90))
    o.thumbnail((3600, 3600)); f = os.path.join(A, 'plantas', 'lotes', 'lote1_%s.jpg' % id_); o.save(f, quality=82); return f
if __name__ == '__main__':
    from playwright.sync_api import sync_playwright
    so = sys.argv[1:] or None
    with sync_playwright() as pw:
        for id_, nome, passos, ref, img in LOTE:
            if so and id_ not in so: continue
            pl = planta.grava(pw, 'app-' + id_, {'nome': nome, 'passos': passos, 'cenario': 'normal'}); pl['esboco_aprovado'] = ref
            planta.salva(pl); print('planta', id_, pl['titulo'], len(pl['ligacoes']), 'ligações', flush=True)
            print('  folha:', folha('app-' + id_, nome, ref, img), flush=True)
