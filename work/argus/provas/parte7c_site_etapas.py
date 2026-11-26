# ARGUS · prova da Parte 7c (as conferências próprias do SITE: busca, carrinho, preços, cupom, compra pela nuvem, idioma, rede,
# consulta, a página por dentro, girar, camadas). Prova que: (1) todas rodam e nenhuma some; (2) estragos de propósito são vistos —
# português no espanhol, foto quebrada, chamada à nuvem sem o selo do App Check, nuvem fora do ar na compra; (3) uma conferência
# que quebra vira "não conferido" com o motivo, nunca "ok".
import os, sys, json
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor')); sys.path.insert(0, os.path.join(A, 'setor_site'))
import etapas, sim, lfsite
from playwright.sync_api import sync_playwright
R = []
def ok(nome, cond, d=''): R.append((nome, bool(cond), d)); print(('ok    ' if cond else 'FALHA ') + nome + (' · ' + d if d else ''))
def estados(res): return [x for v in res.values() for x in v]
def tem(res, pedaco, estado): return any(pedaco in x[0] and x[1] == estado for x in estados(res))
import consertos, estragos
from estragos import PT_NO_ES, FOTO_QUEBRADA, SEM_SELO   # os estragos de propósito ficam num lugar só (setor_site/estragos.py)
with sync_playwright() as pw:
    nav = sim.navegador(pw)
    # (1) o site de hoje: todas rodam, cada uma devolve só ok / ACHADO / não conferido
    res = etapas.roda(pw, nav)
    json.dump(res, open('/tmp/argus_p7c_site_hoje.json', 'w'), ensure_ascii=False, indent=1)
    ok('todas as %d conferências do site rodaram' % len(etapas.TODAS), list(res) == [n for n, _ in etapas.TODAS], ', '.join(res))
    E = estados(res); val = {etapas.OK, etapas.ACH, etapas.NC}
    ok('cada resultado é ok, ACHADO ou não conferido (%d resultados)' % len(E), E and all(x[1] in val for x in E))
    ok('nenhuma conferência quebrou no site de hoje', not any('quebrou' in x[2] for x in E), '; '.join(x[2] for x in E if 'quebrou' in x[2])[:160])
    ok('o cupom passa pelo caminho de verdade (link /t/CÓDIGO) e baixa 10%', tem(res, 'código certo (10%)', etapas.OK))
    ok('as frases de cupom recusado aparecem em PT e ES', sum(1 for x in E if 'cupom recusado' in x[0] and x[1] == etapas.OK) == 2 * len(etapas.MOTIVOS))
    ok('a compra vai inteira pela porta da nuvem e chega à tela de pagar', tem(res, 'aparece a tela de pagar', etapas.OK) and tem(res, 'porta da nuvem', etapas.OK))
    # o defeito de 25/11 foi consertado no site em 26/11 (17f3e97): a trava é vista na versão de antes do conserto (f224c92)
    rc = etapas.roda(pw, nav, so=['camadas'], porta=lfsite.serve(lfsite.monta('f224c92'), 8834))
    ok('camadas: o defeito de 25/11 (menu e peça sem fundo) é visto no site de antes do conserto', tem(rc, 'camadas · Peça', etapas.ACH) and tem(rc, 'camadas · Menu', etapas.ACH))
    r = etapas.roda(pw, nav, so=['camadas'], porta=lfsite.serve(lfsite.monta('ef883de'), 8832))
    ok('camadas: o site de 19/11 (inteiro) passa', all(x[1] == etapas.OK for x in estados(r)), '; '.join(x[0] for x in estados(r) if x[1] != etapas.OK))
    # os consertos (setor_site/consertos.py): hoje passam, e cada um é visto na versão de antes do conserto ou com o estrago plantado
    for nome, _ in consertos.NOMES: ok('%s: o site de hoje passa' % nome, res.get(nome) and all(x[1] == etapas.OK for x in res[nome]), '; '.join('%s %s' % (x[1], x[0]) for x in res.get(nome, []) if x[1] != etapas.OK))
    for k, (nome, antes) in enumerate([('conserto: Esc = voltar', '4e9622f'), ('conserto: janela solta', '4b96bd1'), ('conserto: Destaque sem piscar', '17fc91b')]):
        rv = etapas.roda(pw, nav, so=[nome], porta=lfsite.serve(lfsite.monta(antes), 8840 + k))
        ok('%s: visto no site de antes do conserto (%s)' % (nome, antes), all(x[1] == etapas.ACH for x in estados(rv)), '; '.join('%s %s' % (x[1], x[0]) for x in estados(rv)))
    for nome, conf, js_, pedaco in estragos.ESTRAGOS:
        if conf.startswith('conserto:'):
            rv = etapas.roda(pw, nav, so=[conf], scripts=(js_,)); ok('estrago: %s é visto' % nome, tem(rv, pedaco, etapas.ACH))
    # (2) estragos de propósito
    r = etapas.roda(pw, nav, so=['idioma e fotos'], scripts=(PT_NO_ES,))
    ok('estrago: português no site em espanhol é visto', tem(r, 'espanhol sem português', etapas.ACH), next((x[2] for x in estados(r) if x[1] == etapas.ACH), '')[:80])
    r = etapas.roda(pw, nav, so=['idioma e fotos'], scripts=(FOTO_QUEBRADA,))
    ok('estrago: foto que não carrega é vista', tem(r, 'fotos carregam', etapas.ACH))
    r = etapas.roda(pw, nav, so=['compra pela nuvem'], scripts=(SEM_SELO,))
    ok('estrago: chamada à nuvem sem o selo do App Check é vista', tem(r, 'selo do App Check', etapas.ACH), next((x[2] for x in estados(r) if 'selo' in x[0]), ''))
    from nuvem import Nuvem
    b, pg, ok_ = etapas._cart_com_peca(pw, nav, Nuvem({'pedido': None}), logada=True)
    try:
        for s in ('[data-cta=prosseguir]', '[data-ent=loja]', '[data-cta=irpag]', '[data-cta=pg][data-v=pix]', '[data-send]'): etapas.toca(pg, s, 2000)
        pg.wait_for_timeout(3000); pagou = etapas._vis(pg, '#pkok') and 'pkretry' not in pg.content()
    finally: b.close()
    ok('estrago: nuvem fora do ar na compra — o site não mostra "pedido feito"', ok_ and not pagou)
    # (3) uma conferência que quebra vira "não conferido", nunca some nem vira ok
    velho = etapas.TODAS
    etapas.TODAS = [('quebra de propósito', lambda pw, nav, **kw: 1 / 0)]
    try: r = etapas.roda(pw, nav)
    finally: etapas.TODAS = velho
    x = estados(r)
    ok('conferência que quebra vira "não conferido" com o motivo', len(x) == 1 and x[0][1] == etapas.NC and 'quebrou' in x[0][2], x[0][2] if x else '')
f = [n for n, c, _ in R if not c]
print('\nParte 7c: %d/%d' % (len(R) - len(f), len(R)))
sys.exit(1 if f else 0)
