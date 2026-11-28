# ARGUS · setor SITE · a PORTA do site. Roda tudo o que o site precisa passar antes de publicar e decide: selo ou trava.
#   python3 work/argus/setor_site/porta.py rapida     (a cada passo da implementadora: o Argus enxerga + conferências do site + plantas no celular do dono)
#   python3 work/argus/setor_site/porta.py completa   (antes de publicar: tudo, e só ela dá o selo — vale para o commit do catalogo)
# O site conferido é o commit atual do catalogo (o que vai subir). Fecha por padrão: o que não rodou é falha.
# Etapas: autoprova (motor e site) · conferências do site (busca, carrinho, preços, cupom, compra pela nuvem, idioma, rede, Mochi,
# página por dentro, girar) · plantas válidas · comparador · toques · medidor nos modos do site · tempo com a loja cheia · mapa
# (página sem planta) · segurança (setor NUVEM: regras no emulador do Firebase e testes das funções) · selo.
import os, sys, json, glob, time
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = os.path.dirname(os.path.dirname(A))
for p in ('motor', 'setor_site', 'setor_nuvem'): sys.path.insert(0, os.path.join(A, p))
import anota, relatorio, planta, compara, toques, familia, autoprova, tempo, selo, aparelhos, sim, lfsite, etapas, estragos, seguranca
APARELHOS = [aparelhos.DONO, 'celular 320', 'celular 430', 'tablet 768', 'PC 1440']
M = aparelhos.MODOS['site']
def _etapa(E, nome, estado, itens=()):
    E.append({'etapa': nome, 'estado': estado, 'itens': list(itens)}); print(('%-14s' % estado) + nome + ('  (%d)' % len(itens) if itens else ''), flush=True)
def plantas_validas():
    P = []
    for f in sorted(os.listdir(planta.P_SITE)) if os.path.isdir(planta.P_SITE) else []:
        if f.endswith('.json'): x = json.load(open(os.path.join(planta.P_SITE, f))); P.append((x, planta.valida(x)))
    return P
def modos_quer(completa):
    """Os modos do site que a rodada TEM de passar. Cada valor de cada modo roda (não o produto de todos, que daria 270 aberturas
    por tela): no celular do dono, todas as temáticas (letra 1×, PT); em cada aparelho, as 3 letras (sem temática, PT) e o espanhol
    na letra maior. Mais "reduzir movimento". Na rápida: só o celular do dono, sem temática, letra 1×, PT."""
    if not completa: return {(aparelhos.DONO, 'sem', 1.0, 'pt')}
    q = {(aparelhos.DONO, t, 1.0, 'pt') for t in M['tematica']}
    q |= {(a, 'sem', f, 'pt') for a in APARELHOS for f in M['letra']} | {(a, 'sem', max(M['letra']), 'es') for a in APARELHOS}
    return q | {'reduzir movimento'}
def paginas(pasta):
    """Os lugares do site: cada página .html da cópia (menos a do Google e a 404, que só redireciona) + as telas que abrem por cima."""
    P = sorted('' if os.path.basename(f) == 'index.html' else os.path.basename(f)[:-5] for f in glob.glob(os.path.join(pasta, '*.html')))
    return [p for p in P if p not in ('404',) and not p.startswith('google')] + ['?carrinho=1', '?conta=1', 'p/<peça>']
def cobertas(P):
    """As rotas que as plantas aprovadas cobrem: a da própria tela + as que o dono aprovou como iguais ('vale_para')."""
    c = set()
    for x, v in P:
        if v == 'aprovada': c.add(x.get('rota', '')); c |= set(x.get('vale_para') or [])
    return c
def roda(modo='rapida'):
    completa = modo == 'completa'; E = []; t0 = time.time(); com = selo.commit('site')
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        nav = sim.navegador(pw)
        # 0 autoprova: o motor (comparador, toques, medidor) e o site (estragos de propósito) — se o Argus não enxerga, nada vale
        ok1, ap = autoprova.roda(pw, nav, antiga=False)
        ok2, es = estragos.roda(pw, nav)
        ok = ok1 and ok2
        _etapa(E, 'autoprova (o Argus ainda enxerga: motor e site)', 'ok' if ok else 'FALHA', ['%s: %s' % (n, 'visto' if v else 'NÃO VISTO') for n, v in ap + es])
        # 1 as conferências próprias do site (ACHADO e "não conferido" travam: fecha por padrão)
        res = etapas.roda(pw, nav)
        ruins = ['%s · %s%s' % (x[1], x[0], (' · ' + x[2]) if x[2] else '') for v in res.values() for x in v if x[1] != etapas.OK]
        _etapa(E, 'conferências do site (%d)' % sum(len(v) for v in res.values()), 'FALHA' if ruins else 'ok', ruins)
        # 2 plantas
        P = plantas_validas(); inval = [x['id'] for x, v in P if v.startswith('INVÁLIDA')]; apr = [x for x, v in P if v == 'aprovada']
        _etapa(E, 'plantas do site válidas (aprovação na lista viva)', 'FALHA' if inval else 'ok', ['%s: %s' % (x['id'], v) for x, v in P])
        if not apr: _etapa(E, 'plantas do site aprovadas para conferir', 'FALHA', ['nenhuma planta do site aprovada ainda (lotes do site)'])
        iguais, difs = set(), set()
        # 3 comparador: todas as temáticas na completa; sem temática na rápida
        it = []
        for pl in apr:
            for tm, D in compara.confere(pw, pl, temas=None if completa else ['sem']).items():
                it += ['%s (%s): %s %s' % (pl['tela'], tm, a, b) for a, b, *_ in D]
                if not D: iguais.add((pl['id'], tm))
                else: difs.add((pl['id'], tm))
        _etapa(E, 'comparador (site × planta)', 'FALHA' if it else 'ok', it)
        REL = os.path.join('/tmp/argus/relatorio', 'site'); fotos = []   # relatório: foto marcada de cada tela diferente (hoje × planta)
        for pl in apr:
            for tm in [t for (i, t) in sorted(difs) if i == pl['id']][:2]:
                f, _ = relatorio.tela(pw, pl, tm, REL, navegador=nav)
                if f: fotos.append(f)
        if fotos: _etapa(E, 'relatório: fotos marcadas (hoje × planta)', 'aviso', fotos)
        # 4 toques
        it = []
        for pl in apr: it += ['%s: %s %s' % (pl['tela'], a, b) for a, b in toques.confere(pw, pl)]
        av = [x for x in it if toques.APROVADO in x]; it = [x for x in it if toques.APROVADO not in x]
        _etapa(E, 'toques (ligações e regras)', 'FALHA' if it else 'ok', it)
        vids = []   # relatório: vídeo (MP4) de cada botão que falhou, com o dedo de verdade
        for pl in apr:
            for x in it:
                if not x.startswith(pl['tela'] + ': botão "'): continue
                v = relatorio.video(pw, pl, x.split('botão "', 1)[1].split('"', 1)[0], REL, navegador=nav)
                if v and v not in vids: vids.append(v)
        if vids: _etapa(E, 'relatório: vídeos dos toques que falharam', 'aviso', vids)
        if av: _etapa(E, 'toques: regra × aprovado (o dono decide; não trava)', 'aviso', av)
        # 5 medidor nos modos do site; onde o site é igual à planta (celular do dono, sem temática, 1×, PT) o achado é do APROVADO
        quer = modos_quer(completa); fal, conf, base, rodou = [], [], set(), set()
        for pl in apr:
            tela = planta.tela_de(pl)
            for m in sorted((x for x in quer if isinstance(x, tuple)), key=lambda x: (x[0] != aparelhos.DONO, x[1] != 'sem', x[2], x[3])):
                apar, tm, f, lg = m
                b, pg = planta._abre_tela(pw, tela, tm, None, aparelho=apar, navegador=nav, letra=f, lingua=lg); rodou.add(m)
                for x in familia.mede_tela('%s · %s · %s · letra %s · %s' % (pl['tela'], apar, tm, f, lg), pg.evaluate(familia.COLETA)):
                    txt = '%s · %s · %s %s' % (x[1], x[0], x[2], x[3] if len(x) > 3 else ''); k = (pl['id'], x[0], x[2], x[3] if len(x) > 3 else '')
                    if (pl['id'], 'sem') in iguais and m == (aparelhos.DONO, 'sem', 1.0, 'pt'): base.add(k); conf.append(txt)
                    elif k in base: conf.append(txt)
                    else: fal.append(txt)
                b.close()
            if 'reduzir movimento' in quer:
                b, pg = planta._abre_tela(pw, tela, 'sem', None, navegador=nav, reduzir_movimento=True)
                fal += ['%s · %s · %s' % (x[1], x[0], x[2]) for x in familia.mede_tela('%s · reduzir movimento' % pl['tela'], pg.evaluate(familia.COLETA), True) if x[0].startswith('mexe')]
                b.close(); rodou.add('reduzir movimento')
        _etapa(E, 'medidor de família nos modos do site', 'FALHA' if fal else 'ok', fal)
        falta = sorted(str(m) for m in quer - rodou)
        _etapa(E, 'todos os modos do site rodaram', 'FALHA' if (falta and apr) else 'ok', ['não conferido: ' + m for m in falta] if apr else ['sem plantas aprovadas'])
        if conf: _etapa(E, 'regra × aprovado (o dono decide; não trava)', 'aviso', conf)
        # 6 tempo com a loja cheia (abrir e laço)
        it = []
        for pl in apr:
            tela = dict(planta.tela_de(pl), cenario='cheio')
            t = time.time(); b, pg = planta._abre_tela(pw, tela, 'sem', None, navegador=nav); ab = (time.time() - t) * 1000; soz = tempo.muda_sozinha(pg); b.close()
            if ab > tempo.ABRIR_MS + 1000 * len(pl['passos']) + 2500: it.append('%s: abrir com a loja cheia levou %d ms' % (pl['tela'], ab))
            if soz > tempo.SOZINHA_MAX: it.append('%s: a tela muda sozinha sem parar (%d mudanças em 1 s, parada) — laço' % (pl['tela'], soz))
        _etapa(E, 'tempo com a loja cheia', 'FALHA' if it else 'ok', it)
        # 7 mapa: página do site sem planta aprovada (completa)
        if completa:
            sem = [p or '(início)' for p in paginas(lfsite.monta(com)) if p not in cobertas(P)]
            _etapa(E, 'mapa: página do site sem planta aprovada', 'FALHA' if sem else 'ok', sem)
        else: _etapa(E, 'mapa do site', 'não rodou', ['só na rodada completa'])
        nav.close()
    # 7b limpeza (FASE 1, 28/11): função/ação 2×, "!important", arquivo fora de família, cor/px soltos, UMA REGRA SÓ POR ASSUNTO — nada pode piorar
    import limpeza
    try:
        P, rl, mel = limpeza.confere(); _etapa(E, 'limpeza: nada pode piorar', 'FALHA' if P else 'ok', P + ['hoje: ' + ', '.join('%s %d' % kv for kv in rl.items()) + (' (melhorou: a foto desceu)' if mel and not P else '')])
    except Exception as e: _etapa(E, 'limpeza: nada pode piorar', 'FALHA', ['não rodou: %s' % e])
    # 8 segurança: o setor NUVEM (na completa também o emulador do Firebase no GitHub)
    try:
        aqui = seguranca.funcoes_aqui(); gh = seguranca.no_github() if completa else None; F, AV = seguranca.resumo(aqui, gh)
        _etapa(E, 'segurança (setor NUVEM%s)' % (': emulador do Firebase + funções' if completa else ': funções, aqui'), 'FALHA' if F else 'ok', F + AV)
    except SystemExit as e: _etapa(E, 'segurança (setor NUVEM)', 'FALHA', ['não rodou: %s' % e])
    falhas = [e for e in E if e['estado'] == 'FALHA']
    res = {'setor': 'site', 'modo': modo, 'completa': completa, 'commit': com, 'falhas': len(falhas), 'autoprova_ok': ok,
           'etapas': E, 'minutos': round((time.time() - t0) / 60, 1), 'resumo': '%d etapas, %d com falha' % (len(E), len(falhas))}
    s = selo.grava('site', res)
    res['selo'] = bool(s); res['data'] = time.strftime('%Y-%m-%d %H:%M')
    print('\n' + ('SELO DADO: ' + s['commit'][:9] if s else 'SEM SELO: %s' % ('rodada rápida não dá selo' if not completa else '%d etapa(s) com falha' % len(falhas))))
    return res
if __name__ == '__main__':
    res = roda(sys.argv[1] if len(sys.argv) > 1 else 'rapida')
    os.makedirs('/tmp/argus', exist_ok=True); json.dump(res, open('/tmp/argus/porta_site.json', 'w'), ensure_ascii=False, indent=1)
    print('STATUS:', *anota.anota(res))   # o resultado entra sozinho na Fila do docs/STATUS.md (motor/anota.py)
