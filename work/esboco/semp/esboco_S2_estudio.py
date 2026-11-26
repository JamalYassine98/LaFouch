# ESBOÇO S2 · SEMP · Estúdio ↔ Marketing e a Galeria (ESBOCO, 26/11/2026) — parte 2 do esboço do Semp no app.
# Base: o app real + TODOS os aprovados: 43 (Estúdio tela do grupo Peças, "‹ PEÇAS", Galeria e "?" redondos, sem "×") + 45 (rumo
# aprovado 21/11: "Gravar uma peça ›", EM ANDAMENTO, FALTAM FOTOS) — ambos aprovados e AINDA NÃO implementados: são a base do Estúdio;
# a parte 1 do Semp (aprovada 26/11 11:29: Criar em 3 passos, Galeria só depois do esboço dela); regras 15/16; família 81/86; e as
# decisões do dono de 25/11: Estúdio = primeira camada, só gravação, e dele sai SÓ um atalho para o Marketing; dia de gravar muito
# (~200 fotos) = UMA linha de resumo que abre a fila do dia, sem lista longa; Galeria + "Usar em".
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from base import *
from PIL import Image
L = loja_site()
G = lambda n: 'G$ ' + format(n, ',').replace(',', '.')
HOJE5 = [('AC1050', 'Quadrada AC1050', 'últimas %d · antes do Natal' % L['AC1050']['est']), ('SL2305', 'Aviador SL2305', 'solar · começa o verão'),
         ('SL2265', 'Gatinho SL2265', 'solar · presente de Natal'), ('GR3340', 'Quadrada GR3340', 'acetato · presente'), ('AC1055', 'Redonda AC1055', 'rosto quadrado ou longo')]
D = {'f': {r: foto(r) for r in ('AC1050', 'SL2305', 'SL2265', 'GR3340', 'AC1055', 'SL2250', 'BR44145')}, 'p': {r: G(L[r]['n']) for r, _, _ in HOJE5}, 'o': HOJE5}
CAM = '<rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="12" cy="12.5" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/>'
IMG = '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>'
INT = '<path d="M9.2 9a3 3 0 0 1 5.6 1.4c0 2-2.8 2.4-2.8 4.1"/><circle cx="12" cy="18.2" r=".6"/>'
GAL = '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>'
D.update(cam=CAM, img=IMG, int=INT, gal=GAL)
# 1 · Estúdio: o 45a como está aprovado + UMA linha "Hoje no Estúdio ›" (o único atalho para o Marketing), só nos dias com gravação.
ESTUDIO = r"""TOPB('Peças','Estúdio',[[D.img,'Galeria',2],[D.int,'Ajuda']],'Fotos e giros das peças')+GO('Gravar uma peça ›')+
 '<div style="height:24px"></div>'+LS(L(D.cam,'Hoje no Estúdio','23 peças · 92 fotos · para o Marketing','','›'))+
 LB('Em andamento · 3')+LS(LF(D.f.SL2250,'SL2250 · peça nova','aberta · 2 cores gravadas · continuar','','›')+LF(D.f.AC1050,'AC1050 · Quadrada','finalizada · 4 cores gravadas · 1 tratando','','›')+LF(D.f.GR3340,'GR3340 · Quadrada','finalizada · 5 cores · a tratar em casa','','›'))+
 LB('Faltam fotos · 1')+LS(LF(D.f.BR44145,'Redonda BR44145','falta: 3/4 e giro','','›'))"""
# 2 · a fila do dia: o atalho abre o Passo 1 do Criar só com as peças gravadas hoje — as 5 que o Semp põe primeiro e uma linha fina
FILA = r"""TOPA('Estúdio','Peça')+LB('Passo 1 de 3 · gravadas hoje · 23',1)+LS(D.o.map(x=>LF(D.f[x[0]],x[1],x[2],D.p[x[0]],'›')).join(''))+
 LS(FINO('As outras 18 de hoje'))+HINT('Tocar numa peça segue para o Cenário, como no Criar.')"""
# 3 · Galeria vazia (tela vazia = ícone + frase + explicação, regra 15)
GAL0 = r"""TOPA('Criar','Galeria')+lfVazioHtml(D.gal,'Nenhuma foto ainda','As fotos que você gerar no Flow ficam aqui. Toque numa para usar em post, story, status ou carrossel.')"""
# 4 · Galeria com fotos: duas colunas, a foto e embaixo onde ela já foi usada; tocar abre o Pronto daquela foto ("Usar em")
CARD = r"""((f,t,s)=>'<button type="button" style="display:flex;flex-direction:column;gap:8px;background:none;border:0;padding:0;text-align:left;color:inherit"><span style="aspect-ratio:3/4;border-radius:12px;background:#fff;border:1px dashed var(--line);display:flex;align-items:center;justify-content:center"><img src="'+f+'" alt="" style="width:80%"></span><b style="font-size:15px;font-weight:500">'+t+'</b><small style="font-size:13px;color:var(--mute)">'+s+'</small></button>')"""
GAL1 = r"""TOPA('Criar','Galeria')+LB('Novembro · 4',1)+'<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px 16px">'+
 C(D.f.SL2305,'Margaux · rua de CDE','post qui · story sex')+C(D.f.SL2265,'Gatinho · presente','ainda não usada')+C(D.f.AC1050,'Quadrada · café','status sáb')+C(D.f.GR3340,'Quadrada · estúdio bege','vitrine do site')+'</div>'+
 HINT('No quadro de cada foto entra a foto que você salvou no Flow.')"""
def par(pw, nav, esc, nome, hoje_fn, corpo):
    b, pg = abre(pw, nav, esc); hoje_fn(pg); h = pecas(pg); fh = foto_tela(pg, nome + '_h'); b.close()
    b, pg = abre(pw, nav, esc); proposta(pg, ('(()=>{const C=' + CARD + ';return ' + corpo + '})()') if 'C(' in corpo else corpo, D)
    p = pecas(pg); mede(pg, '%s · %s' % (nome, 'escuro' if esc else 'claro')); fp = foto_tela(pg, nome + '_p'); b.close()
    compara_hp('%s · %s' % (nome, 'escuro' if esc else 'claro'), h, p)
    return fh, fp
def base_45(esc):
    """O Estúdio aprovado (43 + 45a), como o dono aprovou — a imagem do esboço 45a (só existe no escuro; no claro, a mesma base)."""
    im = Image.open('/home/claude/lafouch/work/s435/fluxo/esboco_45a_estudio.jpg').convert('RGB')
    return im.crop((38, 104, 858, im.height - 172)).resize((828, int((im.height - 276) * 828 / 820)))
def estudio_hoje(pg):
    pg.evaluate('()=>{__LF.estAbre();window.__esbPorCima=1}'); pg.wait_for_timeout(1500)   # o Estúdio de hoje (abre por cima de tudo, com "×")
def nada(pg): pass
if __name__ == '__main__':
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        nav = sim.navegador(pw)
        for esc in (True, False):
            n = 'escuro' if esc else 'claro'
            h, p = par(pw, nav, esc, 'S2a-estudio', estudio_hoje, ESTUDIO)
            quadro('esboco_S2a_estudio_%s.jpg' % n, [('HOJE · Estúdio', n + ' · o app de hoje', h), ('BASE · Estúdio aprovado (43 + 45a)', 'aprovado, ainda não implementado · só no escuro', base_45(esc)), ('PROPOSTA · Estúdio', n + ' · + "Hoje no Estúdio ›": o único atalho para o Marketing', p)])
            h, p = par(pw, nav, esc, 'S2b-fila-do-dia', estudio_hoje, FILA)
            quadro('esboco_S2b_fila_do_dia_%s.jpg' % n, [('HOJE · não existe', n + ' · o Estúdio de hoje não leva ao Marketing', h), ('PROPOSTA · a fila do dia', n + ' · Passo 1 do Criar só com as gravadas hoje', p)])
            h, p = par(pw, nav, esc, 'S2c-galeria-vazia', nada, GAL0)
            quadro('esboco_S2c_galeria_vazia_%s.jpg' % n, [('HOJE · não existe', n + ' · o Marketing de hoje', h), ('PROPOSTA · Criar › Galeria (vazia)', n + ' · ícone + frase + explicação (regra 15)', p)])
            h, p = par(pw, nav, esc, 'S2d-galeria', nada, GAL1)
            quadro('esboco_S2d_galeria_%s.jpg' % n, [('HOJE · não existe', n + ' · o Marketing de hoje', h), ('PROPOSTA · Criar › Galeria', n + ' · cada foto mostra onde já foi usada; tocar = "Usar em"', p)])
        nav.close()
    relatorio('comparador_S2.md')
